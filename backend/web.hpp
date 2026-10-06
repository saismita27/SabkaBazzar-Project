#pragma once
#include <algorithm>
#include <functional>
#include <map>
#include <vector>
#include "web_data.hpp"
#include "ui_errors.hpp"
// Server-rendered storefront: all actions are ordinary HTTP forms, no JavaScript.
namespace web {
std::string esc(const std::string& s){std::string o;for(char c:s){switch(c){case '&':o+="&amp;";break;case '<':o+="&lt;";break;case '>':o+="&gt;";break;case '"':o+="&quot;";break;case '\'':o+="&#39;";break;default:o+=c;}}return o;}
std::string money(const J& v){std::ostringstream o;o<<"₹"<<std::fixed<<std::setprecision(v.get<double>()==std::floor(v.get<double>())?0:2)<<v.get<double>();return o.str();}
std::string hidden(const std::string& k,const std::string& v){return "<input type='hidden' name='"+esc(k)+"' value='"+esc(v)+"'>";}
inline std::string icon(const std::string& kind){
 static const std::map<std::string,std::string> paths={
 {"speaker","<path d='m3 9 5 0 5-5v16l-5-5H3ZM17 8a7 7 0 0 1 0 8M20 4a12 12 0 0 1 0 16'/>"},
 {"search","<circle cx='10.5' cy='10.5' r='6.5'/><path d='m16 16 5 5'/>"},
 {"mic","<rect x='9' y='2' width='6' height='12' rx='3'/><path d='M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8'/>"},
 {"cart","<path d='M2 3h3l3 13h11l3-10H6'/><circle cx='9' cy='21' r='1'/><circle cx='19' cy='21' r='1'/>"},
 {"heart","<path d='M20 4c-3-3-6-1-8 1-2-2-5-4-8-1-4 4 0 9 8 16 8-7 12-12 8-16Z'/>"},
 {"user","<circle cx='12' cy='6' r='4'/><path d='M4 22v-3a8 8 0 0 1 16 0v3'/>"},
 {"globe","<circle cx='12' cy='12' r='10'/><ellipse cx='12' cy='12' rx='4' ry='10'/><path d='M2 12h20'/>"},
 {"help","<circle cx='12' cy='12' r='10'/><path d='M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5M12 17v1'/>"},
 {"cat-electronics","<rect x='4' y='3' width='16' height='14' rx='2'/><path d='m4 17-2 4h20l-2-4'/>"},
 {"cat-fashion","<path d='m8 3-6 3 3 6 3-2v12h8V10l3 2 3-6-6-3a4 4 0 0 1-8 0Z'/>"},
 {"cat-grocery","<path d='M4 2v7a3 3 0 0 0 6 0V2M7 2v20M20 22V2c-5 4-5 12 0 12'/>"},
 {"cat-mobiles","<rect x='6' y='2' width='12' height='20' rx='2'/><path d='M11 18h2'/>"},
 {"cat-home","<path d='m2 11 10-9 10 9M5 9v13h14V9M9 22V13h6v9'/>"},
 {"cat-smart-gadgets","<rect x='6' y='6' width='12' height='12' rx='5'/><path d='m8 6 1-4h6l1 4M8 18l1 4h6l1-4M12 9v4l2 1'/>"},
 {"grid","<rect x='3' y='3' width='18' height='18' rx='2'/><path d='M3 9h18M3 15h18M9 3v18M15 3v18'/>"}};
 auto it=paths.find(kind);return "<svg class='ui-icon' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>"+(it==paths.end()?paths.at("grid"):it->second)+"</svg>";
}

std::string form(const J& s,const std::string& op,const std::string& back){return "<form method='post' action='/shop/action'>"+hidden("csrf",s.at("webCsrf"))+hidden("op",op)+hidden("back",back);}
std::string field(const std::string& key,const std::string& label,const std::string& type="text"){return "<label>"+esc(label)+"<input required maxlength='200' name='"+key+"' type='"+type+"'></label>";}
std::string name(const J& p,const std::string& lang){return p.at("name").value(lang,p.at("name").value("en",std::string()));}
std::string picture(const J& p){auto u=p.value("imageUrl",std::string());if(u.rfind("/images/",0)!=0)u="/images/product-placeholder.svg";return "<img loading='lazy' src='"+esc(u)+"' alt='"+esc(name(p,"en"))+"'>";}
std::string button(const J& s,const std::string& op,const std::string& back,const std::string& label,const std::string& extras=""){return form(s,op,back)+extras+"<button>"+esc(label)+"</button></form>";}
void install(httplib::Server& server,Store& store,std::function<std::string(const httplib::Request&,httplib::Response&)> session){
 server.Post("/shop/action",[&,session](const httplib::Request& req,httplib::Response& res){
  std::lock_guard<std::mutex> lock(store.mutex);auto id=session(req,res);auto s=store.state(id);auto get=[&](const char* k){return req.get_param_value(k);};
  if(!s.contains("webCsrf")||get("csrf")!=s["webCsrf"].get<std::string>()){res.status=403;res.set_content("Invalid form token. Reload the page.","text/plain");return;}
  auto back=get("back");if(back!="/"&&back!="/cart"&&back!="/orders"&&back!="/help"&&back!="/wishlist"&&back!="/account"&&back!="/checkout"&&back!="/admin"&&back!="/buy-checkout")back="/";
  try{auto op=get("op");J a={{"op",op}};
   if(op.rfind("auth.",0)==0){J credentials={{"op",op.substr(5)}};if(!get("mobile").empty())credentials["mobile"]=get("mobile");else{credentials["email"]=get("email");credentials["password"]=get("password");}auto fresh=store.authenticate(id,credentials);res.headers.erase("Set-Cookie");res.set_header("Set-Cookie","sb_session="+fresh+"; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600");auto next=store.state(fresh);next["language"]=s.value("language",std::string("en"));next["easy"]=s.value("easy",false);store.save(fresh,next);if(op!="auth.logout")back="/";} else if(op=="welcome.dismiss"){s["welcomeDismissed"]=true;store.save(id,s);back="/";} else if(op=="preferences"){if(!webdata::translations.contains(get("language")))throw std::invalid_argument("Unsupported language");s["language"]=get("language");s["easy"]=get("easy")=="on";store.save(id,s);}
   else {
    if(op.rfind("cart.",0)==0||op=="wishlist.toggle"||op=="buy.now"){a["productId"]=get("productId");a["variant"]=get("variant");if(op=="cart.add"||op=="cart.set"){auto q=get("quantity");if(!std::regex_match(q,std::regex("[0-9]{1,2}")))throw std::invalid_argument("Enter quantity 1 to 99");a["quantity"]=std::stoi(q);}}
    else if(op=="product.save"){
     J p;try{p=store.product(get("productId"));}catch(const std::invalid_argument&){p={{"id",get("productId")},{"name",J::object()},{"description",J::object()},{"variants",J::array()}};}
     for(auto l:{"en","hi","or"}){p["name"][l]=get((std::string("name_")+l).c_str());p["description"][l]=get((std::string("description_")+l).c_str());}
     for(auto k:{"price","mrp"}){auto n=get(k);if(!std::regex_match(n,std::regex("[0-9]{1,8}(\\.[0-9]{1,2})?")))throw std::invalid_argument("Invalid price");p[k]=std::stod(n);}
     if(!std::regex_match(get("stock"),std::regex("[0-9]{1,6}")))throw std::invalid_argument("Invalid stock");
     p["stock"]=std::stoi(get("stock"));
     for(auto k:{"categoryId","subCategory","brand","unit","imageUrl"})p[k]=get(k);
     bool valid=false;for(const auto& c:webdata::categories)if(c["id"]==p["categoryId"])valid=true;if(!valid)throw std::invalid_argument("Invalid department");
     p["aliases"]=J::array();std::istringstream lines(get("aliases"));std::string line;while(std::getline(lines,line))if(!line.empty())p["aliases"].push_back({{"term",line},{"language","und"},{"script","local"}});
     a["product"]=p;
    }
    else if(op=="address")a["address"]={{"fullName",get("fullName")},{"addressLine",get("addressLine")},{"city",get("city")},{"pincode",get("pincode")},{"mobile",get("mobile")}};
    else if(op=="profile")a["user"]={{"name",get("name")},{"email",get("email")}};
    else if(op=="checkout"){a["key"]=get("key");a["buyNow"]=get("buyNow")=="yes";a["payment"]=get("payment");a["address"]={{"fullName",get("fullName")},{"addressLine",get("addressLine")},{"city",get("city")},{"pincode",get("pincode")},{"mobile",get("mobile")}};}
    else if(op=="order.state"){a["orderId"]=get("orderId");a["status"]=get("status");}
    else if(op=="support.create"){a["type"]=get("type");a["subject"]=get("subject");a["message"]=get("message");a["orderId"]=get("orderId");}
    else if(op=="help.ack"&&s.contains("helpEvent"))a["eventId"]=s["helpEvent"]["eventId"];
    if(!get("owner").empty()){a["owner"]=get("owner");} if(op=="support.reply"){a["ticketId"]=get("ticketId");a["reply"]=get("reply");} store.action(id,a);
   }
  }catch(const std::exception& e){s=store.state(id);s["webError"]=e.what();store.save(id,s);back=back=="/orders"?(get("buyNow")=="yes"?"/buy-checkout":"/checkout"):back;}
  res.set_redirect(back,303);
 });
 server.Get(R"(/(?:product|cart|checkout|buy-checkout|orders|help|help/watch|wishlist|account|admin|voice)?)",[&,session](const httplib::Request& req,httplib::Response& res){
  std::lock_guard<std::mutex> lock(store.mutex);auto id=session(req,res);auto s=store.state(id);if(!s.contains("webCsrf")){s["webCsrf"]=token();store.save(id,s);}auto lang=s.value("language",std::string("en"));
  if(!webdata::translations.contains(lang))lang="en";
  auto t=[&](const std::string& key){return esc(webdata::translations.at(lang).value(key,webdata::translations.at("en").value(key,key)));};
  auto words=[&](const std::string& en,const std::string& hi,const std::string& od){return esc(lang=="hi"?hi:lang=="or"?od:en);};
  auto statusText=[&](const std::string& status){static const std::map<std::string,std::string> keys={{"Placed","statusPlaced"},{"Confirmed","statusConfirmed"},{"Packed","statusPacked"},{"Shipped","statusShipped"},{"Out for Delivery","statusOutForDelivery"},{"Delivered","statusDelivered"},{"Cancelled","statusCancelled"}};auto it=keys.find(status);return it==keys.end()?esc(status):t(it->second);};
  auto category=req.get_param_value("category");
  std::string h="<!doctype html><html lang='"+esc(lang)+"'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Sabka Bazaar</title><link rel='stylesheet' href='/store.css'><body"+std::string(s.value("easy",false)?" class='easy'":"")+"><a class='skip' href='#main'>Skip to content</a><div class='delivery-strip'><div>♧ Deliver to: <strong>Odisha</strong>⌄</div><span><a href='/help'>⌁ Linux Subsystem &amp; Help</a>　♧ Multilingual Shopping Demo</span></div><header class='reference-header'><a class='brand' href='/'><span class='brand-logo'>स</span><span>Sabka Bazaar <b class='brand-hindi'>सबका बाज़ार</b><small>Ghar mein generations chaar, pasand ke rang hazaar</small></span></a><div class='header-tools'>";
  h+=form(s,"preferences","/")+hidden("language",lang)+(s.value("easy",false)?"":hidden("easy","on"))+"<button class='easy-toggle' aria-pressed='"+(s.value("easy",false)?std::string("true"):std::string("false"))+"'>✧ "+t("easyMode")+"</button></form>";
  const std::vector<std::vector<std::string>> languages={{"en","English","English"},{"hi","हिन्दी","Hindi"},{"or","ଓଡ଼ିଆ","Odia"},{"mr","मराठी","Marathi"},{"bn","বাংলা","Bengali"},{"ta","தமிழ்","Tamil"},{"te","తెలుగు","Telugu"},{"gu","ગુજરાતી","Gujarati"}};
  std::string languageLabel="English";for(const auto& l:languages)if(l[0]==lang)languageLabel=l[1];
  h+="<details class='language-menu'><summary>"+icon("globe")+esc(languageLabel)+" <span>⌄</span></summary><div class='language-options'><small>SELECT LANGUAGE / भाषा</small>";
  for(const auto& l:languages){h+=form(s,"preferences",req.path=="/account"?"/account":"/")+hidden("language",l[0])+(s.value("easy",false)?hidden("easy","on"):"")+"<button class='"+(lang==l[0]?std::string("selected"):std::string())+"'><span>"+esc(l[1])+"</span><small>"+l[2]+"</small></button></form>";}
  h+="</div></details><a class='help-button' href='/help'>"+icon("help")+t("help")+"</a><a class='wishlist-icon' href='/wishlist' aria-label='"+t("wishlist")+"'>"+icon("heart")+"</a><a class='button cart-pill' href='/cart'>"+icon("cart")+t("cart")+" <small>"+std::to_string(s["cart"].size())+"</small></a><a class='account-pill' href='/account'>"+icon("user")+t(store.accounts->user(id).is_null()?"login":"account")+"</a><a class='orders-link' href='/orders'>"+t("orders")+"</a></div>";
  h+="<form action='/' class='search'><span aria-hidden='true'>"+icon("search")+"</span><label class='sr' for='q'>"+t("searchButton")+"</label><input id='q' name='q' placeholder='"+t("searchPlaceholder")+"' value='"+esc(req.get_param_value("q"))+"'><a class='voice-entry' href='/voice' aria-label='"+t("voiceSearch")+"'>"+icon("mic")+"</a><button aria-label='"+t("searchButton")+"'>"+icon("search")+"</button></form></header><div class='demo-strip'>"+words("Training demo: C++ accounts, orders and support. Sample prices and ratings are unverified. No real payments or deliveries.","प्रशिक्षण डेमो: नमूना मूल्य और रेटिंग अप्रमाणित हैं। वास्तविक भुगतान या डिलीवरी नहीं।","ପ୍ରଶିକ୍ଷଣ ଡେମୋ: ନମୁନା ମୂଲ୍ୟ ଓ ରେଟିଂ ଯାଞ୍ଚ ହୋଇନାହିଁ। ପ୍ରକୃତ ପେମେଣ୍ଟ କିମ୍ବା ଡେଲିଭରି ନାହିଁ।")+"</div><nav class='departments' aria-label='Departments'><a class='"+(category.empty()?std::string("active"):std::string())+"' href='/'>"+icon("grid")+t("allCategories")+"</a>";

  for(const auto& c:webdata::categories)h+="<a class='"+std::string(category==c["id"]?"active":"")+"' href='/?category="+esc(c["id"])+"'><span class='category-icon'>"+icon(c["id"])+"</span>"+esc(c["name"].value(lang,c["name"].value("en",std::string())))+"</a>";

  h+="</nav><main id='main'>";
  if(s.value("easy",false))h+="<aside class='notice'>"+t("easyModeDesc")+" <a href='/help'>"+t("help")+"</a></aside>";
  std::string accountError;if(s.contains("webError")&&req.path=="/account")accountError=errorText(s["webError"],lang);
  if(s.contains("webError")){h+="<p role='alert' class='notice'>"+esc(errorText(s["webError"],lang))+"</p>";s.erase("webError");store.save(id,s);}
  if(s.contains("helpEvent")&&!s["helpEvent"].value("handled",false))h+="<aside class='notice'>Your paired kiosk requested help. <a href='/help'>Open customer care</a></aside>";
  if(req.path=="/help/watch"){
   if(s.contains("helpEvent")&&!s["helpEvent"].value("handled",false)){res.set_redirect("/help",303);return;}
   res.set_header("Refresh","3");res.set_header("Cache-Control","no-store");res.set_content(h+"<section class='panel'><h1>Waiting for your paired help button</h1><p>This screen checks every three seconds. Only this paired browser session receives the event.</p><a href='/help'>Leave waiting mode</a></section></main></body></html>","text/html; charset=utf-8");return;
  }
  bool showWelcome=req.path=="/"&&store.accounts->user(id).is_null()&&!s.value("welcomeDismissed",false);
  auto path=req.path;if(path=="/buy-checkout")s["cart"]=s.value("buyNow",J::array());
  auto purchase=[&](const J& p,const std::string& back){std::string pid=p["id"],b="<div class='actions'>";bool in=false;for(const auto& c:s["cart"])if(c["product"]["id"]==pid)in=true;
   if(p["stock"].get<int>()<=0)b+="<button disabled>"+t("outOfStock")+"</button>";
   else if(in)b+="<a class='button' href='/cart'>"+t("goToCart")+"</a>";
   else {b+=form(s,"cart.add",back)+hidden("productId",pid)+hidden("quantity","1");if(p.contains("variants")&&p["variants"].size()==1)b+=hidden("variant",p["variants"][0]);if(p.contains("variants")&&p["variants"].size()>1){b+="<label>"+words("Variant","विकल्प","ବିକଳ୍ପ")+"<select name='variant'>";for(const auto& v:p["variants"])b+="<option>"+esc(v)+"</option>";b+="</select></label>";}b+="<button class='add-cart'>"+icon("cart")+t("addToCart")+"</button></form>";}
   if(p["stock"].get<int>()>0){b+=form(s,"buy.now","/buy-checkout")+hidden("productId",pid);if(p.contains("variants")&&p["variants"].size()==1)b+=hidden("variant",p["variants"][0]);if(p.contains("variants")&&p["variants"].size()>1){b+="<label>"+words("Buy variant","खरीदने का विकल्प","କିଣିବା ବିକଳ୍ପ")+"<select name='variant'>";for(const auto& v:p["variants"])b+="<option>"+esc(v)+"</option>";b+="</select></label>";}b+="<button class='buy-now'>⚡ "+t("buyNow")+"</button></form>";}
   return b+"</div>";
  };
  auto pricing=[&](const J& p){std::string b="<div class='pricing'><strong>"+money(p["price"])+"</strong>";double mrp=p.value("mrp",0.0),price=p["price"].get<double>();if(mrp>price)b+=" <del>"+money(mrp)+"</del><span class='saving'>"+words("Demo saving","डेमो बचत","ଡେମୋ ସଞ୍ଚୟ")+" "+money(mrp-price)+"</span>";return b+"</div><small>"+words("Demo price · not a live quote","डेमो मूल्य · वर्तमान बाजार मूल्य नहीं","ଡେମୋ ମୂଲ୍ୟ · ବର୍ତ୍ତମାନ ବଜାର ଦର ନୁହେଁ")+"</small>";};
  auto wish=[&](const J& p){bool saved=false;for(const auto& w:s["wishlist"])if(w["id"]==p["id"])saved=true;return form(s,"wishlist.toggle","/wishlist")+hidden("productId",p["id"])+"<button class='wish-control' aria-label='"+t("wishlist")+"' aria-pressed='"+(saved?"true":"false")+"'>"+icon("heart")+"</button></form>";};
  auto readAloud=[&](const J& p){return "<form method='post' action='/voice/read'>"+hidden("csrf",s["webCsrf"])+hidden("productId",p["id"])+"<button class='read-control' aria-label='"+words("Read aloud","पढ़कर सुनें","ପଢ଼ି ଶୁଣନ୍ତୁ")+"'>"+icon("speaker")+"<span>"+words("Read aloud","पढ़कर सुनें","ପଢ଼ି ଶୁଣନ୍ତୁ")+"</span></button></form>";};
  auto rating=[&](const J& p){if(!p.contains("rating"))return std::string();return "<div class='rating-line'><b>"+esc(p["rating"].dump())+" ★</b><small>"+std::to_string(p.value("reviewCount",0))+" "+words("sample reviews (unverified)","नमूना समीक्षाएँ (अप्रमाणित)","ନମୁନା ସମୀକ୍ଷା (ଯାଞ୍ଚ ହୋଇନାହିଁ)")+"</small></div>";};
  auto discount=[&](const J& p){double mrp=p.value("mrp",0.0),price=p["price"].get<double>();return mrp>price?"<span class='discount-badge'>"+std::to_string(static_cast<int>(std::round((mrp-price)*100/mrp)))+"% demo</span>":std::string();};
  auto card=[&](const J& p){std::string pid=p["id"],b="<article class='card reference-card'><div class='card-media'><a href='/product?id="+esc(pid)+"'>"+picture(p)+"</a>"+discount(p)+"<div class='card-wish'>"+wish(p)+"</div><div class='card-read'>"+readAloud(p)+"</div><span class='card-brand'>"+esc(p.value("brand",std::string()))+"</span></div>";
   b+=rating(p)+"<a class='card-title' href='/product?id="+esc(pid)+"'><h3>"+esc(name(p,lang))+"</h3></a>"+pricing(p)+"<p class='stock'>✓ "+t(p["stock"].get<int>()>0?"inStock":"outOfStock")+"</p>"+purchase(p,"/cart");return b+"</article>";};

  if(path=="/"){
   if(category.empty()&&req.get_param_value("q").empty()){
    h+="<section class='hero reference-hero'><div class='hero-copy'><small>APNI PASAND. APNI BHASHA.</small><h1>Where every family finds its favourites</h1><p>From daily essentials to little celebrations — sabke liye, sab kuch</p><div class='hero-buttons'><a class='button' href='#products'>"+words("Explore the collection","संग्रह देखें","ସଂଗ୍ରହ ଦେଖନ୍ତୁ")+" →</a><a class='secondary' href='/voice'>"+icon("mic")+t("voiceSearch")+"</a></div><div class='alias-examples'>Try a familiar name: <a href='/?q=tej%20patta'>tej patta</a><a href='/?q=haldi'>haldi</a><a href='/?q=kurta'>kurta</a></div></div><div class='hero-showcase'>";
    const std::vector<std::vector<std::string>> featured={{"cat-grocery","Everyday essentials","Grocery","/images/grocery-brands/prod-bay-leaf.jpg"},{"cat-fashion","Find your style","Fashion","/images/catalogue-brands/prod-mens-cotton-tshirt-pack.jpg"},{"cat-mobiles","Your next upgrade","Mobiles","/images/technology-brands/prod-iphone-16.jpg"}};
    for(const auto& f:featured){std::string label=f[2];for(const auto& c:webdata::categories)if(lang!="en"&&c["id"]==f[0])label=c["name"].value(lang,f[2]);h+="<a class='hero-tile' href='/?category="+f[0]+"'><span>"+f[1]+"</span><div><img src='"+f[3]+"' alt='"+esc(label)+"'></div><strong>"+esc(label)+" <span>→</span></strong></a>";}h+="</div></section>";
   }
   h+="<h2 id='products'>"+words("Popular Products","लोकप्रिय उत्पाद","ଲୋକପ୍ରିୟ ଉତ୍ପାଦ")+"</h2>";

   for(const auto& c:webdata::categories)if(c["id"]==category){h+="<section class='department-title'><h2>"+esc(c["name"].value(lang,c["name"].value("en",std::string())))+"</h2><p>Browse this department by collection</p></section><form class='filters' action='/'>"+hidden("category",category)+"<label>Subcategory<select name='sub'><option value=''>All collections</option>";for(const auto& sub:c["subcategories"])h+="<option value='"+esc(sub)+"'"+std::string(req.get_param_value("sub")==sub?" selected":"")+">"+esc(sub)+"</option>";h+="</select></label><button>Browse</button></form>";}
   std::vector<std::pair<int,J>> list;std::map<std::string,bool> cats;Statement q(store.db,"SELECT data,stock FROM products ORDER BY rowid");auto query=req.get_param_value("q");auto cat=req.get_param_value("category");
   while(q.step()==SQLITE_ROW){J p=J::parse(q.str(0));p["stock"]=sqlite3_column_int64(q.p,1);cats[p["categoryId"].get<std::string>()]=true;if(!cat.empty()&&p["categoryId"]!=cat)continue;if(!req.get_param_value("sub").empty()&&p.value("subCategory",std::string())!=req.get_param_value("sub"))continue;int score=product_search_score(p,query);if(score)list.push_back({score,p});}
   h+="<form class='filters' action='/'>"+hidden("q",req.get_param_value("q"))+hidden("category",cat)+hidden("sub",req.get_param_value("sub"))+"<label>"+words("Sort","क्रम","କ୍ରମ")+" <select name='sort'><option value=''>"+words("Best match","सबसे उपयुक्त","ସର୍ବୋତ୍ତମ ମେଳ")+"</option><option value='low'"+std::string(req.get_param_value("sort")=="low"?" selected":"")+">"+words("Price: low to high","मूल्य: कम से अधिक","ମୂଲ୍ୟ: କମରୁ ଅଧିକ")+"</option><option value='high'"+std::string(req.get_param_value("sort")=="high"?" selected":"")+">"+words("Price: high to low","मूल्य: अधिक से कम","ମୂଲ୍ୟ: ଅଧିକରୁ କମ")+"</option></select></label><button>"+words("Apply","लागू करें","ଲାଗୁ କରନ୍ତୁ")+"</button></form>";
   auto sort=req.get_param_value("sort");std::stable_sort(list.begin(),list.end(),[&](auto& a,auto& b){if(sort=="low")return a.second["price"]<b.second["price"];if(sort=="high")return a.second["price"]>b.second["price"];return a.first>b.first;});h+="<p>"+std::to_string(list.size())+" sample products · prices are not live quotes</p><div class='grid'>";for(auto& p:list)h+=card(p.second);h+="</div>";if(list.empty())h+="<p>No matches. Try a brand, bay leaf, tej patta or another department.</p>";
  }else if(path=="/product"){
   try{auto p=store.product(req.get_param_value("id"));h+="<div class='product-overlay'><article class='product-dialog' role='dialog' aria-modal='true' aria-label='Product details'><header class='product-dialog-top'><span><b>"+esc(p.value("brand",std::string()))+"</b> · "+esc(p.value("unit",std::string()))+"</span><a href='/' aria-label='Close product'>×</a></header><div class='product-dialog-scroll'><div class='detail product-detail'><div><div class='product-image'>"+picture(p)+"<div class='detail-wish'>"+wish(p)+"</div></div><div class='aliases'><h3>"+words("Vernacular / local names","स्थानीय प्रचलित नाम","ସ୍ଥାନୀୟ ନାମ")+"</h3>";
    for(const auto& a:p["aliases"])h+="<span>"+esc(a["term"])+"</span>";
    h+="</div></div><section><div class='detail-rating'>"+rating(p)+readAloud(p)+"</div><h1>"+esc(name(p,lang))+"</h1><div class='detail-price'>"+pricing(p)+discount(p)+"</div>";
    auto source=p.value("sourceUrl",std::string());if(source.rfind("https://",0)==0)h+="<p class='product-source'><a href='"+esc(source)+"' target='_blank' rel='noopener noreferrer'>"+words("Product & packaging reference ↗","उत्पाद और पैकेजिंग संदर्भ ↗","ଉତ୍ପାଦ ଓ ପ୍ୟାକେଜିଂ ସନ୍ଦର୍ଭ ↗")+"</a></p>";
    h+="<h2>"+words("DESCRIPTION / विवरण","विवरण","ବିବରଣୀ")+"</h2><p class='product-description'>"+esc(p["description"].value(lang,p["description"].value("en",std::string())))+"</p><div class='service-notes'><span>♧<small>Mock Delivery</small></span><span>↶<small>Returns Not Implemented</small></span><span>◇<small>Sample Product</small></span></div><p class='stock'>✓ "+t(p["stock"].get<int>()>0?"inStock":"outOfStock")+"</p>"+purchase(p,"/cart")+"</section></div></div></article></div>";
   }catch(...){res.status=404;h+="<h1>Product not found</h1>";}

  }else if(path=="/voice"){
   h+="<section class='panel'><h1>"+t("voiceSearch")+"</h1><p><strong>PROTOTYPE — local C++ / Linux voice search</strong></p><p>Records the microphone attached to the Linux kiosk, not a remote browser device. Recording lasts eight seconds. Recognition requires a configured local whisper.cpp engine and model. Review the text before searching. Odia speech recognition is unavailable; typed Odia is supported.</p><form method='post' action='/voice/record'>"+hidden("csrf",s["webCsrf"])+"<label><input required type='checkbox' name='consent' value='yes'> I agree to record this kiosk microphone for eight seconds</label><button>Record and review</button></form><h2>Or transcribe a local WAV recording</h2><form method='post' action='/voice/record' enctype='multipart/form-data'>"+hidden("csrf",s["webCsrf"])+hidden("consent","yes")+"<label>16-bit WAV, up to 800 KB<input required type='file' name='audio' accept='.wav,audio/wav'></label><button>Transcribe uploaded audio locally</button></form><p>Audio is processed on this computer. The temporary server recording is deleted after the response. This prototype has not been verified with your microphone.</p><form action='/'><label>"+t("searchPlaceholder")+"<input name='q' required></label><button>"+t("searchButton")+"</button></form></section>";  }else if(path=="/wishlist"){h+="<h1>"+t("wishlist")+"</h1><div class='grid'>";for(auto& p:s["wishlist"])h+=card(store.product(p["id"]));h+="</div>";
  }else if(path=="/cart"||path=="/checkout"||path=="/buy-checkout"){
   h+="<h1>"+t(path=="/cart"?"cart":"checkout")+"</h1><div class='checkout-layout'><section>";
   for(auto& c:s["cart"]){auto p=store.product(c["product"]["id"]);h+="<article class='row'>"+picture(p)+"<div><h3>"+esc(name(p,lang))+"</h3><p>"+money(p["price"])+" · "+esc(c.value("selectedVariant",std::string()))+"</p>"+(path=="/buy-checkout"?std::string("<form action='/buy-checkout'>"):form(s,"cart.set","/cart"))+hidden("productId",p["id"])+hidden("variant",c.value("selectedVariant",std::string()))+"<label>"+words("Quantity (0 removes)","मात्रा (0 से हटाएं)","ପରିମାଣ (0 ଦେଲେ ହଟିବ)")+"<input type='number' min='0' max='99' name='quantity' "+std::string(path=="/buy-checkout"?"readonly ":"")+"value='"+std::to_string(c["quantity"].get<int>())+"'></label><button"+std::string(path=="/buy-checkout"?" disabled":"")+">"+words("Update","बदलें","ବଦଳାନ୍ତୁ")+"</button></form></div></article>";}
   h+="</section><aside class='panel cost-summary'>";J priced=s["cart"];for(auto& c:priced)c["product"]=store.product(c["product"]["id"]);auto total=store.totals(priced);
   for(auto pair:{std::pair<const char*,const char*>{"subtotal","subtotal"},{"gst","gst"},{"deliveryFee","deliveryFee"},{"totalPayable","total"}})h+="<p>"+t(pair.first)+" <strong>"+money(total[pair.second])+"</strong></p>";
   h+="<p class='muted'>"+words("Demo prices, tax and delivery. No real payment.","डेमो मूल्य, कर और डिलीवरी। वास्तविक भुगतान नहीं।","ଡେମୋ ମୂଲ୍ୟ, କର ଓ ଡେଲିଭରି। ପ୍ରକୃତ ପେମେଣ୍ଟ ନୁହେଁ।")+"</p></aside></div>";
   if(s["cart"].empty())h+="<section class='panel'><h2>"+t("emptyCart")+"</h2><a class='button' href='/'>"+t("emptyCartAction")+"</a></section>";
   else if(path=="/cart")h+="<a class='button' href='/checkout'>"+t("proceedToCheckout")+" →</a>";
   else {
    J address=J::object();auto choice=req.get_param_value("address");if(std::regex_match(choice,std::regex("[0-9]{1,2}"))&&std::stoul(choice)<s["addresses"].size())address=s["addresses"][std::stoul(choice)];
    if(!s["addresses"].empty()){h+="<form action='"+path+"'><label>"+words("Saved address","सहेजा पता","ସଞ୍ଚିତ ଠିକଣା")+"<select name='address'>";for(size_t i=0;i<s["addresses"].size();++i)h+="<option value='"+std::to_string(i)+"'>"+esc(s["addresses"][i].value("addressLine",std::string()))+"</option>";h+="</select></label><button>"+words("Use this address","यह पता उपयोग करें","ଏହି ଠିକଣା ବ୍ୟବହାର କରନ୍ତୁ")+"</button></form>";}
    h+=form(s,"checkout","/orders")+hidden("key",token())+(path=="/buy-checkout"?hidden("buyNow","yes"):std::string())+"<section class='panel'><h2>"+t("deliveryAddress")+"</h2>";
    for(auto key:{"fullName","addressLine","city","pincode","mobile"}){std::string label=key==std::string("fullName")?words("Recipient","प्राप्तकर्ता","ପ୍ରାପ୍ତକର୍ତ୍ତା"):key==std::string("addressLine")?t("deliveryAddress"):key==std::string("city")?words("City","शहर","ସହର"):key==std::string("pincode")?words("PIN (6 digits)","पिन (6 अंक)","ପିନ୍ (6 ଅଙ୍କ)"):words("Demo mobile (10 digits)","डेमो मोबाइल (10 अंक)","ଡେମୋ ମୋବାଇଲ୍ (10 ଅଙ୍କ)");h+="<label>"+label+"<input required maxlength='200' name='"+key+"' value='"+esc(address.value(key,std::string()))+"'></label>";}
    h+="<label>"+t("paymentMethod")+"<select name='payment'><option value='COD'>"+t("cashOnDelivery")+"</option><option value='UPI'>"+t("upiPayment")+" (demo)</option><option value='Card'>"+t("cardPayment")+" (demo)</option></select></label><button>"+t("placeOrder")+"</button></section></form>";
   }
  }else if(path=="/orders"){
   h+="<h1>"+t("orders")+"</h1><p>"+words("Tracking and payment are simulated","ट्रैकिंग और भुगतान डेमो हैं","ଟ୍ରାକିଂ ଓ ପେମେଣ୍ଟ ଡେମୋ ଅଟେ")+"</p>";for(auto& o:s["orders"]){h+="<article class='panel'><h2>"+statusText(o["status"])+" · "+money(o["total"])+"</h2><p class='break'>"+esc(o["id"])+"</p>";for(auto& i:o["items"])h+="<p>"+esc(name(i["product"],lang))+" × "+std::to_string(i["quantity"].get<int>())+"</p>";h+="<p>"+esc(o["shippingAddress"]["addressLine"])+" · "+esc(o["paymentMethod"])+" ("+esc(o["paymentStatus"])+")</p><ol class='timeline'>";for(auto& e:o["timeline"])h+="<li>"+statusText(e["status"])+" — "+esc(e["timestamp"])+"</li>";h+="</ol>";std::vector<std::string> flow={"Placed","Confirmed","Packed","Shipped","Out for Delivery","Delivered"};auto it=std::find(flow.begin(),flow.end(),o["status"].get<std::string>());if(store.accounts->admin(id)&&it!=flow.end()&&std::next(it)!=flow.end())h+=button(s,"order.state","/orders","Demo: advance to "+*std::next(it),hidden("orderId",o["id"])+hidden("status",*std::next(it)));if(o["status"]=="Placed"||o["status"]=="Confirmed")h+=button(s,"order.state","/orders",t("cancelOrder"),hidden("orderId",o["id"])+hidden("status","Cancelled"));h+="</article>";}
  } if(path=="/account"||showWelcome){
   auto user=store.accounts->user(id);
   if(user.is_null()){
    auto mode=req.get_param_value("mode")=="register"?std::string("register"):std::string("login");
    auto title=mode=="login"?words("Welcome back","फिर से स्वागत है","ପୁଣି ସ୍ୱାଗତ"):words("Create your account","अपना खाता बनाएं","ଆପଣଙ୍କ ଖାତା ଖୋଲନ୍ତୁ");
    h+="<div class='auth-overlay'><div class='auth-layout' role='dialog' aria-modal='true' aria-label='Account'><div class='auth-top'><span class='brand-logo'>स</span><div><strong>सबका बाज़ार</strong><small>Welcome to India's Family Shopping Store</small></div>"+form(s,"welcome.dismiss","/")+"<button aria-label='Close login'>Login Later ×</button></form></div><div class='auth-scroll'><section class='auth-story'><h1>Ghar mein generations chaar, pasand ke rang hazaar — sabki shopping ka ek thikana, Sabka Bazaar!</h1><p>"+words("Your language. Your favourites. Your shopping space.","आपकी भाषा। आपकी पसंद। आपकी खरीदारी।","ଆପଣଙ୍କ ଭାଷା। ଆପଣଙ୍କ ପସନ୍ଦ। ଆପଣଙ୍କ କିଣାକିଣି।")+"</p></section><section class='panel auth-form'>"+(accountError.empty()?std::string():"<p role='alert' class='notice'>"+esc(accountError)+"</p>")+"<nav class='auth-tabs'><a class='"+std::string(mode=="login"?"active":"")+"' href='/account'>"+words("Sign In","साइन इन","ସାଇନ୍ ଇନ୍")+"</a><a class='"+std::string(mode=="register"?"active":"")+"' href='/account?mode=register'>"+words("Create Account","खाता बनाएं","ଖାତା ଖୋଲନ୍ତୁ")+"</a></nav>"+form(s,"auth."+mode,"/account")+(mode=="register"?"<label>"+words("Your Full Name","आपका पूरा नाम","ଆପଣଙ୍କ ପୂର୍ଣ୍ଣ ନାମ")+"<input name='fullName' maxlength='100' placeholder='e.g. Ramesh Kumar'></label>":"")+"<label>"+words("Mobile Number","मोबाइल नंबर","ମୋବାଇଲ୍ ନମ୍ବର")+"<span class='mobile-field'><b>+91</b><input required name='mobile' inputmode='numeric' pattern='[0-9]{10}' maxlength='10' placeholder='9861023456'></span></label>"+(mode=="register"?"<label>"+words("Email Address (Optional)","ईमेल पता (वैकल्पिक)","ଇମେଲ୍ ଠିକଣା (ଇଚ୍ଛାଧୀନ)")+"<input name='contactEmail' type='email' maxlength='254' placeholder='ramesh@example.com'></label>":"")+"<button>"+(mode=="login"?words("Continue with Demo Profile","डेमो प्रोफ़ाइल के साथ जारी रखें","ଡେମୋ ପ୍ରୋଫାଇଲ୍ ସହ ଜାରି ରଖନ୍ତୁ"):words("Create Demo Profile","डेमो प्रोफ़ाइल बनाएं","ଡେମୋ ପ୍ରୋଫାଇଲ୍ ତିଆରି କରନ୍ତୁ"))+" →</button></form><p class='muted'>"+words("Local demo profile only. No password verification, SMS, OTP, real payments or secure production account. Use fictional details for the demonstration.","केवल स्थानीय डेमो प्रोफ़ाइल। पासवर्ड सत्यापन, SMS, OTP या वास्तविक भुगतान नहीं है। डेमो के लिए काल्पनिक विवरण उपयोग करें।","କେବଳ ସ୍ଥାନୀୟ ଡେମୋ ପ୍ରୋଫାଇଲ୍। ପାସୱାର୍ଡ ଯାଞ୍ଚ, SMS, OTP କିମ୍ବା ପ୍ରକୃତ ପେମେଣ୍ଟ ନାହିଁ। ଡେମୋ ପାଇଁ କଳ୍ପିତ ବିବରଣୀ ବ୍ୟବହାର କରନ୍ତୁ।")+"</p><a href='/'>"+words("Continue browsing","खरीदारी देखें","କିଣାକିଣି ଦେଖନ୍ତୁ")+" →</a></section></div></div></div>";
   }else{
    h+="<h1>"+t("account")+"</h1><p>"+esc(user["email"])+" · "+esc(user["role"])+"</p>"+button(s,"auth.logout","/account",t("logout"));
    h+="<section class='panel'><h2>"+t("deliveryAddress")+"</h2>";for(const auto& a:s["addresses"])h+="<p>"+esc(a.value("fullName",std::string()))+" · "+esc(a.value("addressLine",std::string()))+"</p>";
    h+=form(s,"address","/account")+field("fullName",words("Recipient","प्राप्तकर्ता","ପ୍ରାପ୍ତକର୍ତ୍ତା"))+field("addressLine",t("deliveryAddress"))+field("city",words("City","शहर","ସହର"))+field("pincode","PIN (6 digits)")+field("mobile","Demo mobile (10 digits)")+"<button>"+words("Save address","पता सहेजें","ଠିକଣା ସଞ୍ଚୟ କରନ୍ତୁ")+"</button></form></section>";
    if(user["role"]=="admin")h+="<a class='button' href='/admin'>Administrator workspace</a>";
   }
  }else if(path=="/admin"){
   if(!store.accounts->admin(id)){res.status=403;h+="<h1>Administrator login required</h1><a href='/account'>Login</a>";}
   else{h+="<h1>Administrator workspace</h1><p>Order movements and support replies are for the local demonstration.</p>";
    h+="<h2>Catalogue management</h2><form action='/admin'><label>Product ID<input name='product' placeholder='prod-bay-leaf'></label><button>Load product / create new</button></form>";
    auto pid=req.get_param_value("product");if(!pid.empty()){
     J p;try{p=store.product(pid);}catch(const std::invalid_argument&){p={{"id",pid},{"name",J::object()},{"description",J::object()},{"price",0},{"mrp",0},{"stock",0},{"aliases",J::array()}};}
     h+="<section class='panel'>"+form(s,"product.save","/admin")+hidden("productId",pid)+"<h3>"+esc(pid)+"</h3>";
     for(auto k:{"name","description"})for(auto l:{"en","hi","or"})h+="<label>"+std::string(k)+" ("+l+")<input name='"+k+"_"+l+"' maxlength='6000' value='"+esc(p[k].value(l,std::string()))+"'></label>";
     for(auto k:{"price","mrp","stock"})h+="<label>"+std::string(k)+"<input required name='"+k+"' value='"+esc(p[k].dump())+"'></label>";
     h+="<label>Department<select name='categoryId'>";for(const auto& c:webdata::categories)h+="<option value='"+esc(c["id"])+"'"+std::string(p.value("categoryId",std::string())==c["id"]?" selected":"")+">"+esc(c["name"]["en"])+"</option>";h+="</select></label>";
     for(auto k:{"subCategory","brand","unit","imageUrl"})h+="<label>"+std::string(k)+"<input name='"+k+"' value='"+esc(p.value(k,std::string()))+"'></label>";
     h+="<label>Local aliases (one per line; human review pending)<textarea name='aliases' rows='6'>";for(const auto& a:p["aliases"])h+=esc(a["term"])+"\n";h+="</textarea></label><button>Save product</button></form><p>Changes persist in SQLite. Existing order item snapshots are preserved. Image path must begin /images/.</p></section>";
    }
    for(auto& account:store.admin_view(id)){
     h+="<section class='panel'><h2>"+esc(account["email"])+"</h2>";
     for(auto& o:account["orders"]){h+="<h3 class='break'>"+esc(o["id"])+"</h3><p>"+statusText(o["status"])+" · "+money(o["total"])+"</p>";std::vector<std::string> flow={"Placed","Confirmed","Packed","Shipped","Out for Delivery","Delivered"};auto it=std::find(flow.begin(),flow.end(),o["status"].get<std::string>());if(it!=flow.end()&&std::next(it)!=flow.end())h+=button(s,"order.state","/admin","Advance to "+*std::next(it),hidden("owner",account["owner"])+hidden("orderId",o["id"])+hidden("status",*std::next(it)));}
     for(auto& t:account["supportTickets"]){h+="<h3>"+esc(t["subject"])+"</h3><p>"+esc(t["message"])+"</p>"+form(s,"support.reply","/admin")+hidden("owner",account["owner"])+hidden("ticketId",t["id"])+field("reply","Reply")+"<button>Save reply</button></form>";}
     h+="</section>";
    }
   }
  }else if(path=="/help"){
   h+="<h1>"+t("help")+"</h1><p>"+words("Tickets are saved locally. Chat, SMS and callbacks are simulated; no real agent is connected.","अनुरोध स्थानीय रूप से सहेजे जाते हैं। चैट, SMS और कॉल डेमो हैं; वास्तविक एजेंट नहीं जुड़ा है।","ଅନୁରୋଧ ସ୍ଥାନୀୟ ଭାବେ ସଞ୍ଚୟ ହୁଏ। ଚାଟ୍, SMS ଓ କଲ୍ ଡେମୋ ଅଟେ; ପ୍ରକୃତ ଏଜେଣ୍ଟ ଯୋଡ଼ି ହୋଇନାହାନ୍ତି।")+"</p><div class='detail'><section class='panel'>"+form(s,"support.create","/help")+"<label>"+words("Request type","अनुरोध का प्रकार","ଅନୁରୋଧ ପ୍ରକାର")+"<select name='type'><option value='Order help'>"+words("Order help","ऑर्डर सहायता","ଅର୍ଡର୍ ସହାୟତା")+"</option><option value='Callback request (simulated)'>"+words("Callback request (simulated)","कॉल का अनुरोध (डेमो)","କଲ୍ ଅନୁରୋଧ (ଡେମୋ)")+"</option><option value='SMS request (simulated)'>SMS (demo)</option><option value='General question'>"+words("General question","सामान्य प्रश्न","ସାଧାରଣ ପ୍ରଶ୍ନ")+"</option></select></label>"+field("subject",words("Subject","विषय","ବିଷୟ"))+field("message",words("Your message","आपका संदेश","ଆପଣଙ୍କ ସନ୍ଦେଶ"))+"<label>"+words("Optional order","वैकल्पिक ऑर्डर","ଇଚ୍ଛାଧୀନ ଅର୍ଡର୍")+"<select name='orderId'><option value=''>—</option>";
   for(const auto& o:s["orders"])h+="<option>"+esc(o["id"])+"</option>";
   h+="</select></label><button>"+t("raiseTicket")+"</button></form></section><section><h2>"+words("Your tickets","आपके अनुरोध","ଆପଣଙ୍କ ଅନୁରୋଧ")+"</h2>";
   for(const auto& ticket:s["supportTickets"])h+="<article class='panel'><h3>"+esc(ticket["subject"])+"</h3><p>"+esc(ticket["message"])+"</p><small>"+words("Status","स्थिति","ସ୍ଥିତି")+": "+esc(ticket["status"])+"</small><p>"+esc(ticket.value("adminReply",std::string()))+"</p></article>";
   h+="</section></div><section class='panel'><h2>Linux help-button demonstration</h2>"+button(s,"kiosk.bind","/help",words("Pair this browser session","इस ब्राउज़र को जोड़ें","ଏହି ବ୍ରାଉଜର୍ ଯୋଡ଼ନ୍ତୁ"))+"<p><a href='/help/watch'>Open help-button waiting mode</a> after pairing. Only this session receives the event.</p>";if(s.contains("helpEvent"))h+="<p>Event source: "+esc(s["helpEvent"]["source"])+"</p>"+button(s,"help.ack","/help",words("Acknowledge help request","सहायता अनुरोध स्वीकार करें","ସହାୟତା ଅନୁରୋଧ ସ୍ୱୀକାର କରନ୍ତୁ"));h+="</section>";
  }
  h+="</main><footer>Sabka Bazaar · C++ / Linux training demonstration · <a href='/photo-credits.html'>Photo credits</a><p>160 sample products · no real payments · local C++ voice prototype · translations require human review</p></footer></body></html>";
  res.set_header("Cache-Control","no-store");res.set_header("Content-Security-Policy","default-src 'none'; img-src 'self'; style-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");res.set_header("X-Content-Type-Options","nosniff");res.set_content(h,"text/html; charset=utf-8");
 });
}
}
