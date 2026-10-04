#include <ctime>
#include <iomanip>
#include <sstream>
#include <cmath>
#include "search.hpp"
#include "help_bridge.hpp"
#include <httplib.h>
#include <nlohmann/json.hpp>
#include <sqlite3.h>
#include <sodium.h>
#include <fstream>
#include <iostream>
#include <mutex>
#include <memory>
#include <regex>
#include <chrono>
#include <csignal>
#include <pthread.h>
#include <thread>
using J = nlohmann::json;
struct Statement {
 sqlite3_stmt* p=nullptr;
 Statement(sqlite3* db,const char* sql){if(sqlite3_prepare_v2(db,sql,-1,&p,nullptr)!=SQLITE_OK)throw std::runtime_error(sqlite3_errmsg(db));}
 ~Statement(){sqlite3_finalize(p);}
 void text(int n,const std::string& s){if(sqlite3_bind_text(p,n,s.c_str(),-1,SQLITE_TRANSIENT)!=SQLITE_OK)throw std::runtime_error("Bind failed");}
 void number(int n,long long v){sqlite3_bind_int64(p,n,v);}
 int step(){int r=sqlite3_step(p);if(r!=SQLITE_ROW&&r!=SQLITE_DONE)throw std::runtime_error(sqlite3_errmsg(sqlite3_db_handle(p)));return r;}
 std::string str(int n){auto s=sqlite3_column_text(p,n);return s?reinterpret_cast<const char*>(s):"";}
};
std::string token(){unsigned char b[24];char h[49];randombytes_buf(b,sizeof b);sodium_bin2hex(h,sizeof h,b,sizeof b);return h;}
std::string now(){std::time_t time=std::time(nullptr);std::tm utc{};gmtime_r(&time,&utc);std::ostringstream out;out<<std::put_time(&utc,"%Y-%m-%dT%H:%M:%SZ");return out.str();}
struct Store {
 sqlite3* db=nullptr; std::mutex mutex; std::string paired;
 explicit Store(const char* path){if(sqlite3_open(path,&db)!=SQLITE_OK)throw std::runtime_error("Database open failed");sqlite3_busy_timeout(db,5000);exec("PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS clients(id TEXT PRIMARY KEY,data TEXT NOT NULL); CREATE TABLE IF NOT EXISTS products(id TEXT PRIMARY KEY,data TEXT NOT NULL,stock INTEGER NOT NULL CHECK(stock>=0));");}
 ~Store(){sqlite3_close(db);}
 void exec(const char* sql){char* error=nullptr;if(sqlite3_exec(db,sql,nullptr,nullptr,&error)!=SQLITE_OK){std::string msg=error?error:"SQL error";sqlite3_free(error);throw std::runtime_error(msg);}}
 J initial(){return {{"cart",J::array()},{"wishlist",J::array()},{"orders",J::array()},{"addresses",J::array()},{"supportTickets",J::array()},{"user",nullptr}};}
 J state(const std::string& id){Statement q(db,"SELECT data FROM clients WHERE id=?");q.text(1,id);return q.step()==SQLITE_ROW?J::parse(q.str(0)):initial();}
 void save(const std::string& id,const J& s){Statement q(db,"INSERT INTO clients VALUES(?,?) ON CONFLICT(id) DO UPDATE SET data=excluded.data");q.text(1,id);q.text(2,s.dump());q.step();}
 J product(const std::string& id){Statement q(db,"SELECT data,stock FROM products WHERE id=?");q.text(1,id);if(q.step()!=SQLITE_ROW)throw std::invalid_argument("Unknown product");J p=J::parse(q.str(0));p["stock"]=sqlite3_column_int64(q.p,1);return p;}
 void stock(const std::string& id,int delta){Statement q(db,"UPDATE products SET stock=stock+? WHERE id=?");q.number(1,delta);q.text(2,id);q.step();}
 void seed(const char* path){std::ifstream f(path);if(!f)throw std::runtime_error("Catalogue file missing");J products;f>>products;exec("BEGIN IMMEDIATE");try{for(auto& p:products){Statement q(db,"INSERT OR IGNORE INTO products VALUES(?,?,?)");q.text(1,p.at("id"));q.text(2,p.dump());q.number(3,p.at("stock"));q.step();}exec("COMMIT");}catch(...){exec("ROLLBACK");throw;}}
 J totals(const J& cart){long long paise=0;for(auto& x:cart)paise+=std::llround(x["product"]["price"].get<double>()*100)*x["quantity"].get<int>();long long tax=((paise*5+5000)/10000)*100;long long delivery=paise==0||paise>=49900?0:4000;return {{"subtotal",paise/100.0},{"gst",tax/100.0},{"deliveryFee",delivery/100.0},{"total",(paise+tax+delivery)/100.0}};}
 J view(J s){s["totals"]=totals(s["cart"]);return s;}
 void help(const std::string& source){
  if(paired.empty())return;
  J s=state(paired);
  s["helpEvent"]={{"eventId",std::chrono::duration_cast<std::chrono::milliseconds>(std::chrono::system_clock::now().time_since_epoch()).count()},{"kioskId",101},{"timestamp",now()},{"source",source},{"rawPayload","HELP_REQUEST"},{"handled",false}};
  save(paired,s);
 }
 J action(const std::string& id,const J& a){
  exec("BEGIN IMMEDIATE");
  try{
   J s=state(id);std::string op=a.at("op");J result=nullptr;
   if(op=="kiosk.bind"){paired=id;}
   else if(op=="cart.add"||op=="cart.set"||op=="cart.remove"){
    std::string pid=a.at("productId"),v=a.value("variant",std::string());J p=product(pid);
    if(!v.empty()&&(!p.contains("variants")||std::find(p["variants"].begin(),p["variants"].end(),v)==p["variants"].end()))throw std::invalid_argument("Invalid variant");
    if(op!="cart.remove"&&!a.at("quantity").is_number_integer())throw std::invalid_argument("Quantity must be an integer");
    if(op!="cart.remove"&&(a.at("quantity")<0||a.at("quantity")>99||(op=="cart.add"&&a.at("quantity")==0)))throw std::invalid_argument("Invalid quantity");
    int qty=op=="cart.remove"?0:a.at("quantity").get<int>();if(qty<0||qty>99)throw std::invalid_argument("Quantity must be 0 to 99");
    auto& c=s["cart"];auto it=std::find_if(c.begin(),c.end(),[&](auto& x){return x["product"]["id"]==pid&&x.value("selectedVariant",std::string())==v;});
    if(op=="cart.add"&&it!=c.end())qty+=(*it)["quantity"].template get<int>();
    int combined=qty;for(auto& x:c)if(x["product"]["id"]==pid&&x.value("selectedVariant",std::string())!=v)combined+=x["quantity"].get<int>();
    if(qty>99||combined>p["stock"].get<int>())throw std::invalid_argument("Quantity exceeds stock");
    if(it!=c.end())c.erase(it);
    if(qty>0)c.push_back({{"product",p},{"quantity",qty},{"selectedVariant",v}});
   } else if(op=="cart.clear")s["cart"]=J::array();
   else if(op=="wishlist.toggle"){auto p=product(a.at("productId"));auto& w=s["wishlist"];auto it=std::find_if(w.begin(),w.end(),[&](auto& x){return x["id"]==p["id"];});if(it==w.end())w.push_back(p);else w.erase(it);}
   else if(op=="profile"){s["user"]=a.at("user");s["user"]["id"]=id;s["user"]["role"]="customer";}
   else if(op=="address"){s["addresses"].push_back(a.at("address"));}
   else if(op=="logout"){s["user"]=nullptr;if(paired==id)paired.clear();}
   else if(op=="help.ack"){
    if(s.contains("helpEvent")&&s["helpEvent"]["eventId"]==a.at("eventId"))s["helpEvent"]["handled"]=true;
   }
   else if(op=="checkout"){
    std::string key=a.at("key");if(key.empty()||key.size()>128)throw std::invalid_argument("Invalid checkout key");
    J payload={{"address",a.at("address")},{"payment",a.at("payment")}};
    for(auto& o:s["orders"])if(o["idempotencyToken"]==key){if(o["_payload"]!=payload)throw std::invalid_argument("Checkout key already used");result=o;break;}
    if(result.is_null()){
     auto address=a.at("address");for(auto field:{"fullName","addressLine","city"})if(address.value(field,std::string()).empty())throw std::invalid_argument("Address is incomplete");
     if(!std::regex_match(address.value("pincode",std::string()),std::regex("[0-9]{6}"))||!std::regex_match(address.value("mobile",std::string()),std::regex("[0-9]{10}")))throw std::invalid_argument("Invalid PIN or demo mobile");
     std::string payment=a.at("payment");if(payment!="COD"&&payment!="UPI"&&payment!="Card")throw std::invalid_argument("Invalid demo payment");
     if(s["cart"].empty())throw std::invalid_argument("Your cart is empty");
     for(auto& item:s["cart"]){auto p=product(item["product"]["id"]);int qty=item["quantity"];if(qty<1||qty>p["stock"].get<int>())throw std::invalid_argument("Stock changed; update cart");item["product"]=p;stock(p["id"],-qty);}
     J o=totals(s["cart"]);o.update({{"id","SB-"+token()},{"userId",id},{"items",s["cart"]},{"discount",0},{"status","Placed"},{"paymentMethod",payment},{"paymentStatus",payment=="COD"?"Pending":"Paid"},{"shippingAddress",address},{"idempotencyToken",key},{"createdAt",now()},{"_payload",payload},{"timeline",J::array({{{"status","Placed"},{"timestamp",now()},{"note","C++ transactional checkout; simulated payment"}}})}});
     s["orders"].insert(s["orders"].begin(),o);s["cart"]=J::array();result=o;
    }
   } else if(op=="order.state"){
    auto& orders=s["orders"];auto it=std::find_if(orders.begin(),orders.end(),[&](auto& o){return o["id"]==a.at("orderId");});if(it==orders.end())throw std::invalid_argument("Order not found");
    std::string next=a.at("status"),old=(*it)["status"];std::vector<std::string> flow={"Placed","Confirmed","Packed","Shipped","Out for Delivery","Delivered"};
    auto pos=std::find(flow.begin(),flow.end(),old);
    if(next=="Cancelled"){if(old!="Placed"&&old!="Confirmed")throw std::invalid_argument("Cancellation unavailable");for(auto& x:(*it)["items"])stock(x["product"]["id"],x["quantity"]);if((*it)["paymentStatus"]=="Paid")(*it)["paymentStatus"]="Refunded";}
    else if(pos==flow.end()||std::next(pos)==flow.end()||*std::next(pos)!=next)throw std::invalid_argument("Invalid order transition");
    (*it)["status"]=next;(*it)["timeline"].push_back({{"status",next},{"timestamp",now()},{"note","Simulated tracking"}});result=true;
   } else if(op=="support.create"){
    if(a.contains("orderId")&&!a["orderId"].get<std::string>().empty()){bool found=false;for(auto& o:s["orders"])if(o["id"]==a["orderId"])found=true;if(!found)throw std::invalid_argument("Order not found");}
    J t={{"id","TCK-"+token()},{"userId",id},{"type",a.at("type")},{"subject",a.at("subject")},{"message",a.at("message")},{"status","Open"},{"createdAt",now()}};if(a.contains("orderId"))t["orderId"]=a["orderId"];s["supportTickets"].push_back(t);
   } else if(op=="support.reply"){bool found=false;for(auto& t:s["supportTickets"])if(t["id"]==a.at("ticketId")){t["adminReply"]=a.at("reply");t["status"]="In Progress";found=true;}if(!found)throw std::invalid_argument("Ticket not found");}
   else throw std::invalid_argument("Unknown action");
   save(id,s);exec("COMMIT");return {{"state",view(s)},{"result",result}};
  }catch(...){exec("ROLLBACK");throw;}
 }
};
#include "web.hpp"
int main(int argc,char** argv){
 try{
  if(sodium_init()<0)return 1;
  Store store(argc>1?argv[1]:"sabka.sqlite");store.seed(argc>2?argv[2]:"backend/catalogue.json");
  sigset_t signals;sigemptyset(&signals);sigaddset(&signals,SIGINT);sigaddset(&signals,SIGTERM);pthread_sigmask(SIG_BLOCK,&signals,nullptr);
  httplib::Server server;server.set_payload_max_length(65536);
  auto session=[&](const httplib::Request& req,httplib::Response& res){std::smatch match;auto cookie=req.get_header_value("Cookie");if(std::regex_search(cookie,match,std::regex("(?:^|; *)sb_session=([a-f0-9]{48})(?:;|$)")))return match[1].str();auto id=token();res.set_header("Set-Cookie","sb_session="+id+"; HttpOnly; SameSite=Strict; Path=/");return id;};
  server.Get("/api/health",[](auto&,auto& res){res.set_content(R"({"backend":"C++17","storage":"SQLite","mode":"local demonstration"})","application/json");});
  server.Get("/api/state",[&](auto& req,auto& res){std::lock_guard<std::mutex> lock(store.mutex);auto id=session(req,res);res.set_header("Cache-Control","no-store");res.set_content(store.view(store.state(id)).dump(),"application/json");});
  server.Post("/api/action",[&](auto& req,auto& res){if(req.get_header_value("X-Sabka-Request")!="1"){res.status=403;return;}try{std::lock_guard<std::mutex> lock(store.mutex);auto id=session(req,res);res.set_content(store.action(id,J::parse(req.body)).dump(),"application/json");}catch(const std::exception& e){res.status=400;res.set_content(J({{"error",e.what()}}).dump(),"application/json");}});
  server.Get("/api/products",[&](const httplib::Request& req,httplib::Response& res){
   std::lock_guard<std::mutex> lock(store.mutex);
   Statement q(store.db,"SELECT data,stock FROM products ORDER BY rowid");
   std::vector<std::pair<int,J>> matches;
   std::string query=normalized(req.get_param_value("q")),category=req.get_param_value("category"),sub=req.get_param_value("sub");
   while(q.step()==SQLITE_ROW){
    auto p=J::parse(q.str(0));p["stock"]=sqlite3_column_int64(q.p,1);
    if(!category.empty()&&p.value("categoryId",std::string())!=category)continue;
    if(!sub.empty()&&p.value("subCategory",std::string())!=sub)continue;
    int score=query.empty()?1:0;
    auto rank=[&](const std::string& text){auto n=normalized(text);if(n==query)score=100;else if(n.rfind(query,0)==0)score=std::max(score,80);else if(n.find(query)!=std::string::npos)score=std::max(score,60);};
    if(!query.empty()){for(auto& name:p["name"])rank(name.get<std::string>());for(auto& alias:p["aliases"])rank(alias["term"]);rank(p["brand"]);}
    if(score)matches.emplace_back(score,p);
   }
   std::stable_sort(matches.begin(),matches.end(),[](auto& a,auto& b){return a.first>b.first;});
   J results=J::array();for(auto& item:matches)results.push_back(item.second);
   res.set_content(results.dump(),"application/json");
  });
  web::install(server,store,session);
  const std::string assets=argc>3?argv[3]:"public";
  if(assets!="-"&&!server.set_mount_point("/",assets))throw std::runtime_error("Static directory missing");
  if(!server.bind_to_port("127.0.0.1",8080))throw std::runtime_error("Port 8080 unavailable");
  HelpBridge bridge(argc>4?argv[4]:"",[&](const std::string& source){std::lock_guard<std::mutex> lock(store.mutex);store.help(source);});
  std::thread shutdown([&]{int signal=0;sigwait(&signals,&signal);server.stop();});
  std::cout<<"Sabka Bazaar C++ backend: http://127.0.0.1:8080\n"<<std::flush;
  server.listen_after_bind();pthread_kill(shutdown.native_handle(),SIGTERM);shutdown.join();
 }catch(const std::exception& e){std::cerr<<e.what()<<'\n';return 1;}
}
