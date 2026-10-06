#include <httplib.h>
#include <nlohmann/json.hpp>
#include <regex>
#include <iostream>
#include <stdexcept>
using J=nlohmann::json;
void check(bool b,const char* m){if(!b)throw std::runtime_error(m);std::cout<<"PASS "<<m<<'\n';}
std::string value(const std::string& page,const std::string& key){std::smatch m;if(!std::regex_search(page,m,std::regex("name='"+key+"' value='([^']*)'")))throw std::runtime_error("Missing form field "+key);return m[1];}
int main(){try{
 httplib::Client c("127.0.0.1",8080);auto r=c.Get("/");check(r&&r->status==200,"C++ homepage responds");check(r->body.find("<script")==std::string::npos,"no browser scripts");check(r->body.find("Where every family finds its favourites")!=std::string::npos,"approved branding");auto cookie=r->get_header_value("Set-Cookie");cookie=cookie.substr(0,cookie.find(';'));httplib::Headers h={{"Cookie",cookie}};auto csrf=value(r->body,"csrf");
 auto post=[&](httplib::Params p,int status=303){p.emplace("csrf",csrf);auto x=c.Post("/shop/action",h,p);check(x&&x->status==status,"form action status");return x;};
 check(r->body.find("auth-overlay")!=std::string::npos,"new visitor sees welcome login panel");
 post({{"op","welcome.dismiss"},{"back","/"}});r=c.Get("/",h);check(r&&r->body.find("auth-overlay")==std::string::npos,"Login Later dismisses welcome panel");
 auto fresh=c.Get("/");check(fresh&&fresh->body.find("auth-overlay")!=std::string::npos,"welcome dismissal is session isolated");
 for(const auto* code:{"en","hi","or","mr","bn","ta","te","gu"})check(r->body.find(std::string("name='language' value='")+code+"'")!=std::string::npos,"reference language menu option");
 check(r->body.find("hero-showcase")!=std::string::npos,"reference hero photo cards");
 auto authPage=c.Get("/account",h);check(authPage&&authPage->body.find("auth-overlay")!=std::string::npos&&authPage->body.find("aria-label='Close login'")!=std::string::npos,"closable reference account panel");check(authPage->body.find("name='mobile'")!=std::string::npos&&authPage->body.find("name='password'")==std::string::npos,"mobile-first sign in form");auto registerPage=c.Get("/account?mode=register",h);check(registerPage&&registerPage->body.find("name='fullName'")!=std::string::npos&&registerPage->body.find("name='contactEmail'")!=std::string::npos,"create account asks name mobile and optional email");
 auto asset=c.Get("/store.css");check(asset&&asset->status==200,"local stylesheet served");asset=c.Get("/images/grocery-brands/prod-bay-leaf.jpg");check(asset&&asset->status==200,"preserved local product photo served");
 auto all=c.Get("/api/products");check(all&&all->status==200,"full catalogue available");for(const auto& product:J::parse(all->body)){auto image=c.Get(product["imageUrl"].get<std::string>());if(!image||image->status!=200)throw std::runtime_error("Missing image: "+product["id"].get<std::string>());}check(true,"all catalogue image paths load from project root");
 auto bad=c.Post("/shop/action",h,httplib::Params{{"op","cart.add"}});check(bad&&bad->status==403,"form CSRF rejection");
 r=c.Get("/?q=tej%20patta",h);check(r&&r->body.find("1 sample products")!=std::string::npos,"C++ HTML alias search");
 post({{"op","cart.add"},{"productId","prod-bay-leaf"},{"quantity","1"},{"back","/cart"}});
 r=c.Get("/product?id=prod-bay-leaf",h);check(r&&r->body.find("Go to Cart")!=std::string::npos,"cart button reflects persisted state");
 r=c.Get("/checkout",h);auto key=value(r->body,"key");httplib::Params p={{"op","checkout"},{"key",key},{"fullName","Demo"},{"addressLine","Test street"},{"city","Demo"},{"pincode","751001"},{"mobile","9000000000"},{"payment","COD"},{"back","/orders"}};post(p);post(p);
 r=c.Get("/api/state",h);auto state=J::parse(r->body);check(state["orders"].size()==1&&state["cart"].empty(),"HTML checkout persists once across repeated submission");
 post({{"op","support.create"},{"subject","<script>alert(1)</script>"},{"message","<img src=x>"},{"type","Question"},{"back","/help"}});
 r=c.Get("/help",h);check(r&&r->body.find("&lt;script&gt;alert(1)&lt;/script&gt;")!=std::string::npos,"support content HTML escaped");check(r->get_header_value("Content-Security-Policy").find("default-src 'none'")!=std::string::npos,"restrictive page security policy");
 for(auto path:{"/cart","/orders","/wishlist","/account","/product?id=prod-bay-leaf"}){r=c.Get(path,h);check(r&&r->status==200,"shopping page response");}
 r=c.Get("/orders");check(r&&r->body.find("SB-")==std::string::npos,"browser session order isolation");
 post({{"op","preferences"},{"language","hi"},{"easy","on"},{"back","/"}});
 r=c.Get("/",h);check(r&&r->body.find("lang='hi'")!=std::string::npos&&r->body.find("class='easy'")!=std::string::npos,"server-persisted Hindi and Easy Shopping");
 check(r->body.find("खोज")!=std::string::npos&&r->body.find("<details class='preferences'>")==std::string::npos,"visible translated navigation");
 r=c.Get("/");check(r&&r->body.find("lang='en'")!=std::string::npos,"language isolation between sessions");
 post({{"op","preferences"},{"language","or"},{"back","/"}});
 r=c.Get("/account",h);check(r&&r->body.find("lang='or'")!=std::string::npos,"Odia selection available before login");
 post({{"op","preferences"},{"language","en"},{"back","/"}});
 r=c.Get("/?category=cat-electronics&sub=Laptops",h);check(r&&r->body.find("Subcategory")!=std::string::npos&&r->body.find("Laptops")!=std::string::npos,"department subcategory navigation");
 r=c.Get("/?category=cat-electronics&sub=Laptops&sort=low",h);check(r&&r->body.find("name='sub' value='Laptops'")!=std::string::npos&&r->body.find("value='low' selected")!=std::string::npos,"sorting retains subcategory and selection");
 r=c.Get("/voice",h);check(r&&r->status==200&&r->body.find("PROTOTYPE")!=std::string::npos,"honest voice entry point");
 auto denied=c.Post("/voice/record",h,httplib::Params{{"csrf",csrf}});check(denied&&denied->status==403,"voice capture requires explicit consent without activating microphone");
 post({{"op","address"},{"fullName","Demo"},{"addressLine","Saved street"},{"city","Demo"},{"pincode","751001"},{"mobile","9000000000"},{"back","/account"}});
 post({{"op","cart.add"},{"productId","prod-bay-leaf"},{"quantity","1"},{"back","/cart"}});
 r=c.Get("/checkout?address=0",h);check(r&&r->body.find("value='Saved street'")!=std::string::npos,"saved address prefills checkout");
 post({{"op","buy.now"},{"productId","prod-bay-leaf"},{"back","/buy-checkout"}});
 r=c.Get("/buy-checkout",h);check(r&&r->status==200,"isolated Buy Now checkout page");key=value(r->body,"key");p.erase("key");p.emplace("key",key);p.emplace("buyNow","yes");post(p);post(p);
 r=c.Get("/api/state",h);state=J::parse(r->body);check(state["cart"].size()==1&&state["orders"].size()==2&&state["buyNow"].empty(),"Buy Now preserves cart and prevents duplicate orders");
 post({{"op","kiosk.bind"},{"back","/help"}});r=c.Get("/help/watch",h);check(r&&r->status==200&&r->get_header_value("Refresh")=="3","JavaScript-free paired help waiting mode");
 std::cout<<"ALL C++ WEB CHECKS PASSED\n";
}catch(const std::exception& e){std::cerr<<e.what()<<'\n';return 1;}}
