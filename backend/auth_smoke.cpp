#include <httplib.h>
#include <nlohmann/json.hpp>
#include <sqlite3.h>
#include <iostream>
#include <regex>
#include <stdexcept>
using J=nlohmann::json;
void check(bool ok,const char* m){if(!ok)throw std::runtime_error(m);std::cout<<"PASS "<<m<<'\n';}
std::string cookie(const httplib::Response& r){auto c=r.get_header_value("Set-Cookie");return c.substr(0,c.find(';'));}
int main(int argc,char** argv){sqlite3* db=nullptr;try{
 if(argc!=2)throw std::runtime_error("Pass the isolated test database only");
 httplib::Client c("127.0.0.1",8080);auto first=c.Get("/api/state");auto guest=cookie(*first);
 auto auth=[&](const std::string& session,J p,int status=200){auto r=c.Post("/api/auth",{{"Cookie",session},{"X-Sabka-Request","1"}},p.dump(),"application/json");check(r&&r->status==status,"authentication HTTP status");return r;};
 auto action=[&](const std::string& session,J p,int status=200){auto r=c.Post("/api/action",{{"Cookie",session},{"X-Sabka-Request","1"}},p.dump(),"application/json");check(r&&r->status==status,"authorized action status");return J::parse(r->body);};
 auto state=[&](const std::string& session){auto r=c.Get("/api/state",{{"Cookie",session}});check(r&&r->status==200,"account state response");return J::parse(r->body);};
 action(guest,{{"op","cart.add"},{"productId","prod-bay-leaf"},{"quantity",1}});
 const J registration={{"op","register"},{"email","cpp-user@example.test"},{"password","Test-only-pass-123"}};
 auto reg=auth(guest,registration);auto user=cookie(*reg);auto s=state(user);auto owner=s["user"]["id"];
 check(user!=guest&&s["cart"].size()==1&&s["user"]["role"]=="customer","registration rotates cookie and carries guest cart");check(state(guest)["cart"].empty(),"old guest cookie cannot access migrated cart");
 auth("",registration,400);auth("",{{"op","login"},{"email","cpp-user@example.test"},{"password","Wrong-pass-123"}},400);
 auto second=auth("",{{"op","login"},{"email","cpp-user@example.test"},{"password","Test-only-pass-123"}});auto secondCookie=cookie(*second);check(state(secondCookie)["cart"].size()==1,"login restores account cart across sessions");
 auto denied=c.Get("/api/admin",{{"Cookie",user}});check(denied&&denied->status==403,"customer cannot read admin data");
 action(user,{{"op","profile"},{"user",{{"role","admin"},{"name","forged"}}}});denied=c.Get("/api/admin",{{"Cookie",user}});check(denied&&denied->status==403,"profile role cannot elevate privileges");
 auto other=auth("",{{"op","register"},{"email","cpp-other@example.test"},{"password","Other-test-pass-123"}});auto otherCookie=cookie(*other);check(state(otherCookie)["cart"].empty(),"different account isolated");action(otherCookie,{{"op","cart.clear"},{"owner",owner}},400);
 auto result=action(user,{{"op","checkout"},{"key","auth-checkout"},{"address",{{"fullName","Demo"},{"addressLine","Test"},{"city","Demo"},{"pincode","751001"},{"mobile","9000000000"}}},{"payment","COD"}});auto order=result["result"]["id"];
 action(user,{{"op","order.state"},{"orderId",order},{"status","Confirmed"}},400);
 action(user,{{"op","support.create"},{"type","general"},{"subject","Test ticket"},{"message","Test question"}});auto ticket=state(user)["supportTickets"][0]["id"];
 action(user,{{"op","support.reply"},{"ticketId",ticket},{"reply","forged reply"}},400);
 check(sqlite3_open(argv[1],&db)==SQLITE_OK,"open isolated fixture DB");
 sqlite3_stmt* stmt=nullptr;sqlite3_prepare_v2(db,"SELECT password_hash FROM accounts WHERE email='cpp-user@example.test'",-1,&stmt,nullptr);check(sqlite3_step(stmt)==SQLITE_ROW,"password record exists");std::string hash=reinterpret_cast<const char*>(sqlite3_column_text(stmt,0));sqlite3_finalize(stmt);check(hash.rfind("$argon2id$",0)==0&&hash.find("Test-only")==std::string::npos,"only Argon2id password hash stored");
 // Fixture promotion represents the explicit local operator command, never HTTP.
 check(sqlite3_exec(db,"UPDATE accounts SET role='admin' WHERE email='cpp-other@example.test'",nullptr,nullptr,nullptr)==SQLITE_OK,"fixture admin promotion");
 auto admin=c.Get("/api/admin",{{"Cookie",otherCookie}});check(admin&&admin->status==200,"authenticated admin inbox");
 action(otherCookie,{{"op","order.state"},{"owner",owner},{"orderId",order},{"status","Confirmed"}});
 action(otherCookie,{{"op","support.reply"},{"owner",owner},{"ticketId",ticket},{"reply","C++ admin reply"}});
 check(state(user)["orders"][0]["status"]=="Confirmed"&&state(user)["supportTickets"][0]["adminReply"]=="C++ admin reply","admin actions persist to correct account");
 auth(user,{{"op","logout"}});check(state(user)["user"].is_null()&&state(user)["orders"].empty(),"logout revokes old token without exposing history");check(state(secondCookie)["orders"].size()==1,"other login retains persistent account history");
 check(sqlite3_exec(db,"UPDATE logins SET expires=0",nullptr,nullptr,nullptr)==SQLITE_OK,"expire test sessions");check(state(secondCookie)["user"].is_null()&&state(secondCookie)["orders"].empty(),"expired sessions cannot access account");
 auto page=c.Get("/account");check(page&&page->status==200,"C++ login/register page");auto browserCookie=cookie(*page);std::smatch match;check(std::regex_search(page->body,match,std::regex("name='csrf' value='([^']*)'")),"account form CSRF token");
 auto form=c.Post("/shop/action",{{"Cookie",browserCookie}},httplib::Params{{"csrf",match[1].str()},{"op","auth.register"},{"back","/account"},{"email","cpp-browser@example.test"},{"password","Browser-test-123"}});check(form&&form->status==303&&!cookie(*form).empty(),"browser registration redirects with rotated cookie");check(form->get_header_value("Location")=="/","successful registration returns home");check(state(cookie(*form))["user"]["email"]=="cpp-browser@example.test","browser form creates authenticated account");
 auto noHeader=c.Post("/api/auth",registration.dump(),"application/json");check(noHeader&&noHeader->status==403,"authentication requires request header");
 sqlite3_close(db);db=nullptr;std::cout<<"ALL C++ ACCOUNT CHECKS PASSED\n";
}catch(const std::exception& e){std::cerr<<e.what()<<'\n';if(db)sqlite3_close(db);return 1;}}
