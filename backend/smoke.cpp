#include <fstream>
#include <unistd.h>
#include <httplib.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <stdexcept>
using J=nlohmann::json;
void check(bool ok,const char* what){if(!ok)throw std::runtime_error(what);std::cout<<"PASS "<<what<<"\n";}
int main(int argc,char** argv){
 try{
 httplib::Client client("127.0.0.1",8080);
 if(argc>2&&std::string(argv[1])=="--restart"){
  std::ifstream file(argv[2]);std::string saved;std::getline(file,saved);
  auto r=client.Get("/api/state",{{"Cookie",saved}});check(r&&r->status==200,"restart response");auto state=J::parse(r->body);
  check(state["orders"].size()==1&&state["orders"][0]["status"]=="Cancelled","order survives process restart");
  check(state["supportTickets"].size()==1,"support survives process restart");return 0;
 }
 auto initial=client.Get("/api/state");check(initial&&initial->status==200,"server state");
 std::string cookie=initial->get_header_value("Set-Cookie");cookie=cookie.substr(0,cookie.find(';'));
 httplib::Headers headers={{"Cookie",cookie},{"X-Sabka-Request","1"}};
 auto call=[&](J body,int status=200){auto r=client.Post("/api/action",headers,body.dump(),"application/json");check(r&&r->status==status,"action HTTP status");return J::parse(r->body);};
 auto products=client.Get("/api/products");auto p=J::parse(products->body).at(0);auto pid=p["id"];int stock=p["stock"];
 call({{"op","cart.add"},{"productId",pid},{"quantity",-1}},400);
 call({{"op","cart.add"},{"productId",pid},{"quantity",1}});
 J address={{"fullName","Test"},{"addressLine","Demo address"},{"city","Demo"},{"state","Odisha"},{"pincode","751001"},{"mobile","9000000000"}};
 J payload={{"op","checkout"},{"address",address},{"payment","COD"},{"key","test-checkout"}};
 auto first=call(payload);auto order=first["result"];check(first["state"]["cart"].empty(),"checkout clears cart");
 check(order["items"].size()==1,"order persisted");
 auto again=call(payload);check(again["result"]["id"]==order["id"],"duplicate checkout returns same order");
 auto list=J::parse(client.Get("/api/products")->body);check(list[0]["stock"]==stock-1,"stock deducted once");
 auto other=client.Get("/api/state");check(J::parse(other->body)["orders"].empty(),"separate session cannot see orders");
 call({{"op","order.state"},{"orderId",order["id"]},{"status","Delivered"}},400);
 call({{"op","order.state"},{"orderId",order["id"]},{"status","Confirmed"}});
 call({{"op","order.state"},{"orderId",order["id"]},{"status","Cancelled"}});
 check(J::parse(client.Get("/api/products")->body)[0]["stock"]==stock,"cancellation restores stock");
 call({{"op","order.state"},{"orderId",order["id"]},{"status","Cancelled"}},400);
 payload["address"]["city"]="Changed";call(payload,400);
 auto forbidden=client.Post("/api/action","{}","application/json");check(forbidden&&forbidden->status==403,"mutation requires request header");
 call({{"op","support.create"},{"type","general"},{"subject","Test"},{"message","Test ticket"}});
 call({{"op","kiosk.bind"}});
 {std::ofstream fifo("/tmp/sabka-backend-"+std::to_string(getuid())+"/help.fifo");fifo<<"HELP\n";}
 J paired;for(int i=0;i<20;++i){paired=J::parse(client.Get("/api/state",headers)->body);if(paired.contains("helpEvent"))break;usleep(100000);}
 check(paired.contains("helpEvent")&&paired["helpEvent"]["source"]=="USERSPACE_FIFO_SIMULATOR","Linux FIFO event reaches paired session");
 check(!J::parse(client.Get("/api/state")->body).contains("helpEvent"),"help event does not reach other session");
 auto search=client.Get("/api/products?q=tej%20patta");check(search&&J::parse(search->body).size()>0,"local alias search");
 if(argc>1){std::ofstream file(argv[1]);file<<cookie;}
 std::cout<<"ALL CHECKS PASSED\n";
 }catch(const std::exception& e){std::cerr<<"FAIL "<<e.what()<<"\n";return 1;}
}
