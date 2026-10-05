// Sabka Bazaar's native Linux interface. All shopping rules stay in the C++ server.
#include <httplib.h>
#include <nlohmann/json.hpp>
#include <sys/stat.h>
#include <termios.h>
#include <fcntl.h>
#include <unistd.h>
#include <cerrno>
#include <cstring>
#include <cstdlib>
#include <chrono>
#include <iomanip>
#include <iostream>
#include <stdexcept>
#include <string>
using Json = nlohmann::json;

std::string input(const std::string& prompt) {
    std::cout << prompt << std::flush;
    std::string value;
    if (!std::getline(std::cin, value)) throw std::runtime_error("INPUT_CLOSED");
    return value;
}
std::string encode(const std::string& text) {
    static const char* digits="0123456789ABCDEF";
    std::string out;
    for (unsigned char c:text) {
        if ((c>='a'&&c<='z')||(c>='A'&&c<='Z')||(c>='0'&&c<='9')||c=='-'||c=='_') out+=c;
        else {out+='%';out+=digits[c>>4];out+=digits[c&15];}
    }
    return out;
}
class SessionFile {
    int fd_=-1;
public:
    explicit SessionFile(const std::string& name) {
        fd_=open(name.c_str(),O_RDWR|O_CREAT|O_CLOEXEC|O_NOFOLLOW,0600);
        if(fd_<0)throw std::runtime_error("Cannot open private session file");
        struct stat st{};
        if(fstat(fd_,&st)<0||!S_ISREG(st.st_mode)||st.st_uid!=getuid()||(st.st_mode&077)||st.st_nlink!=1){
            close(fd_);fd_=-1;throw std::runtime_error("Session file must be owned by you with mode 600");
        }
    }
    ~SessionFile(){if(fd_>=0)close(fd_);}
    SessionFile(const SessionFile&)=delete;
    SessionFile& operator=(const SessionFile&)=delete;
    std::string readCookie(){char data[128]{};auto n=read(fd_,data,sizeof(data)-1);if(n<0)throw std::runtime_error("Cannot read session");return std::string(data,static_cast<size_t>(n));}
    void save(const std::string& cookie){
        if(lseek(fd_,0,SEEK_SET)<0||ftruncate(fd_,0)<0)throw std::runtime_error("Cannot save session");
        size_t done=0;
        while(done<cookie.size()){auto n=write(fd_,cookie.data()+done,cookie.size()-done);if(n<0&&errno==EINTR)continue;if(n<=0)throw std::runtime_error("Session write failed");done+=static_cast<size_t>(n);}
        if(fsync(fd_)<0)throw std::runtime_error("Session sync failed");
    }
};
class Shop {
    httplib::Client http_{"127.0.0.1",8080};
    SessionFile file_;
    std::string cookie_;
    std::string checkoutKey_;
    Json checkoutPayload_;
    Json response(httplib::Result result){
        if(!result)throw std::runtime_error("Backend unavailable. Start sabka_backend in another Ubuntu terminal.");
        auto data=Json::parse(result->body);
        if(result->status!=200)throw std::runtime_error(data.value("error",std::string("HTTP request failed")));
        auto next=result->get_header_value("Set-Cookie");
        if(!next.empty()){cookie_=next.substr(0,next.find(';'));file_.save(cookie_);}
        return data;
    }
public:
    explicit Shop(const std::string& session):file_(session),cookie_(file_.readCookie()){
        http_.set_connection_timeout(3);http_.set_read_timeout(10);state();
    }
    Json state(){return response(http_.Get("/api/state",{{"Cookie",cookie_}}));}
    Json action(const Json& data){return response(http_.Post("/api/action",{{"Cookie",cookie_},{"X-Sabka-Request","1"}},data.dump(),"application/json"));}
    void search(){
        const auto query=input("Search (e.g. tej patta / haldi; blank = all): ");
        auto rows=response(http_.Get("/api/products?q="+encode(query)));
        for(const auto& p:rows)std::cout<<p.at("id").get<std::string>()<<"\n  "<<p.at("name").at("en").get<std::string>()<<"  INR "<<p.at("price")<<"  stock "<<p.at("stock")<<'\n';
        std::cout<<rows.size()<<" matching sample products\n";
    }
    void add(){
        auto id=input("Product ID: ");auto raw=input("Quantity 1-99: ");
        size_t used=0;int qty=std::stoi(raw,&used);if(used!=raw.size()||qty<1||qty>99)throw std::runtime_error("Enter an integer from 1 to 99");
        action({{"op","cart.add"},{"productId",id},{"quantity",qty}});std::cout<<"Added. Open Cart to review.\n";
    }
    void cart(){
        auto s=state();for(const auto& row:s.at("cart"))std::cout<<row.at("product").at("id").get<std::string>()<<"  x "<<row.at("quantity")<<"  "<<row.at("product").at("name").at("en").get<std::string>()<<'\n';
        std::cout<<"Costs in INR (illustrative tax and delivery):\n"<<s.at("totals").dump(2)<<'\n';
    }
    void checkout(){
        cart();std::cout<<"SIMULATION ONLY. Enter fictional delivery details. No real payment.\n";
        Json address={{"fullName",input("Recipient: ")},{"addressLine",input("Address: ")},{"city",input("City: ")},{"state","Odisha"},{"pincode",input("6-digit PIN: ")},{"mobile",input("10-digit demo mobile: ")}};
        Json payload={{"op","checkout"},{"address",address},{"payment",input("Mock payment (COD/UPI/Card): ")}};
        if(input("Create simulated order? Type yes: ")!="yes")return;
        // Retain a key after a network failure so retrying cannot duplicate the order.
        if(checkoutKey_.empty()||checkoutPayload_!=payload){checkoutKey_="cli-"+std::to_string(getpid())+"-"+std::to_string(std::chrono::steady_clock::now().time_since_epoch().count());checkoutPayload_=payload;}
        payload["key"]=checkoutKey_;
        auto order=action(payload).at("result");std::cout<<"Saved order: "<<order.at("id")<<" total INR "<<order.at("total")<<'\n';checkoutKey_.clear();
    }
    void orders(){auto s=state();for(auto o:s.at("orders")){o.erase("_payload");o.erase("userId");o.erase("idempotencyToken");std::cout<<o.dump(2)<<'\n';}}
    void changeOrder(){auto id=input("Order ID: ");auto status=input("Next state (Confirmed/Packed/Shipped/Out for Delivery/Delivered/Cancelled): ");action({{"op","order.state"},{"orderId",id},{"status",status}});std::cout<<"Simulated order state saved\n";}
    void help(){
        auto s=state();if(s.contains("helpEvent")&&!s["helpEvent"].value("handled",false)){
            std::cout<<"KIOSK HELP REQUEST: "<<s["helpEvent"].value("source",std::string())<<'\n';
            action({{"op","help.ack"},{"eventId",s["helpEvent"]["eventId"]}});
        }
        std::cout<<"1 Create support ticket  2 List tickets  3 Pair kiosk  4 Check event again\n";
        auto c=input("Help choice: ");
        if(c=="1"){auto subject=input("Subject: ");auto message=input("Message: ");action({{"op","support.create"},{"type","general"},{"subject",subject},{"message",message}});std::cout<<"Ticket saved; no real agent or callback\n";}
        else if(c=="2")std::cout<<state().at("supportTickets").dump(2)<<'\n';
        else if(c=="3"){action({{"op","kiosk.bind"}});std::cout<<"Paired this terminal session. Trigger FIFO, then open Help again.\n";}
    }
    void wishlist(){auto id=input("Product ID to toggle (blank = list): ");if(!id.empty())action({{"op","wishlist.toggle"},{"productId",id}});auto s=state();for(const auto& p:s.at("wishlist"))std::cout<<p.at("name").at("en").get<std::string>()<<'\n';}
    void account(){
        auto op=input("Account action (register/login/logout): ");Json payload={{"op",op}};
        if(op!="logout"){
            payload["email"]=input("Email: ");
            struct EchoGuard {
                termios before{};bool changed=false;
                EchoGuard(){if(isatty(STDIN_FILENO)&&tcgetattr(STDIN_FILENO,&before)==0){auto after=before;after.c_lflag&=~ECHO;changed=tcsetattr(STDIN_FILENO,TCSAFLUSH,&after)==0;}}
                ~EchoGuard(){if(changed)tcsetattr(STDIN_FILENO,TCSAFLUSH,&before);}
            } guard;
            payload["password"]=input("Password (10-128 bytes; hidden on terminal): ");std::cout<<'\n';
        }
        auto s=response(http_.Post("/api/auth",{{"Cookie",cookie_},{"X-Sabka-Request","1"}},payload.dump(),"application/json"));
        std::cout<<(s["user"].is_null()?"Logged out":"Account session ready")<<'\n';
    }
    void administration(){
        auto inbox=response(http_.Get("/api/admin",{{"Cookie",cookie_}}));std::cout<<inbox.dump(2)<<'\n';
        auto op=input("1 Advance order  2 Reply to ticket  Enter to leave: ");if(op!="1"&&op!="2")return;
        auto owner=input("Account owner ID from inbox: ");
        if(op=="1"){auto order=input("Order ID: ");auto status=input("Next tracking state: ");action({{"op","order.state"},{"owner",owner},{"orderId",order},{"status",status}});}
        else{auto ticket=input("Ticket ID: ");auto reply=input("Reply: ");action({{"op","support.reply"},{"owner",owner},{"ticketId",ticket},{"reply",reply}});}
        std::cout<<"Administrator action saved\n";
    }

    void remove(){auto id=input("Product ID to remove: ");action({{"op","cart.remove"},{"productId",id}});}
};
int main(){
    try {
        const char* custom=std::getenv("SABKA_SESSION_FILE");
        Shop shop(custom?custom:"/tmp/sabka-cli-"+std::to_string(getuid())+".session");
        std::cout<<"\nSABKA BAZAAR — Native C++ / Linux\nSample catalogue, simulated payments and delivery. Guest shopping or password-protected account; administrator role required for order advancement.\n";
        while(true){
            std::cout<<"\n1 Search catalogue   2 Add to cart   3 Cart   4 Remove item\n5 Checkout   6 Orders   7 Demo tracking / cancel   8 Wishlist\n9 Help / kiosk   10 Account   11 Administrator   0 Exit\n";
            try{auto c=input("> ");if(c=="0")break;if(c=="1")shop.search();else if(c=="2")shop.add();else if(c=="3")shop.cart();else if(c=="4")shop.remove();else if(c=="5")shop.checkout();else if(c=="6")shop.orders();else if(c=="7")shop.changeOrder();else if(c=="8")shop.wishlist();else if(c=="9")shop.help();else if(c=="10")shop.account();else if(c=="11")shop.administration();else std::cout<<"Choose 0-11\n";}
            catch(const std::exception& e){if(std::string(e.what())=="INPUT_CLOSED")break;std::cerr<<"Error: "<<e.what()<<'\n';}
        }
    }catch(const std::exception& e){std::cerr<<e.what()<<'\n';return 1;}
}
