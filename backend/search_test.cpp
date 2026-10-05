#include "search.hpp"
#include <iostream>
using J=nlohmann::json;
J product(std::string name,std::string alias){return {{"name",{{"en",name}}},{"aliases",J::array({{{"term",alias}}})},{"brand","Demo"}};}
void check(bool ok,const char* message){if(!ok)throw std::runtime_error(message);}
int main(){try{
 auto canonical=product("tej patta","spice"),exact=product("Bay Leaf","tej patta"),folded=product("Another leaf","TEJ PATTA"),prefix=product("tej patta packet","leaf"),substring=product("Fresh tej patta packet","leaf");
 check(product_search_score(canonical,"tej patta")>product_search_score(exact,"tej patta"),"canonical before alias");
 check(product_search_score(exact,"tej patta")>product_search_score(folded,"tej patta"),"exact before normalized alias");
 check(product_search_score(folded,"tej patta")>product_search_score(prefix,"tej patta"),"normalized before prefix");
 check(product_search_score(prefix,"tej patta")>product_search_score(substring,"tej patta"),"prefix before substring");
 check(product_search_score(exact,"  TEJ\tPATTA ")==300,"case and whitespace normalization");
 check(product_search_score(product("Bay Leaf","तेज पत्ता"),"तेज पत्ता")==400,"Hindi alias");
 check(product_search_score(product("Turmeric","ହଳଦୀ"),"ହଳଦୀ")==400,"Odia alias");
 check(product_search_score(product("Phone","mobile"),"ＰＨＯＮＥ")==500,"Unicode compatibility normalization");
 check(product_search_score(exact,"unrelated")==0,"no false match");
 check(product_search_score(exact," \t")==1,"blank query lists catalogue");
 std::cout<<"PASS search ranking tiers, Unicode aliases, whitespace and no-match cases\n";
 }catch(const std::exception& e){std::cerr<<e.what()<<'\n';return 1;}}
