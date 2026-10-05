#pragma once
#include <algorithm>
#include <functional>
#include <map>
#include <vector>
#include "web_data.hpp"
// Server-rendered storefront: all actions are ordinary HTTP forms, no JavaScript.
namespace web {
std::string esc(const std::string& s){std::string o;for(char c:s){switch(c){case '&':o+="&amp;";break;case '<':o+="&lt;";break;case '>':o+="&gt;";break;case '"':o+="&quot;";break;case '\'':o+="&#39;";break;default:o+=c;}}return o;}
std::string money(const J& v){std::ostringstream o;o<<"₹"<<std::fixed<<std::setprecision(2)<<v.get<double>();return o.str();}
std::string hidden(const std::string& k,const std::string& v){return "<input type='hidden' name='"+esc(k)+"' value='"+esc(v)+"'>";}
std::string form(const J& s,const std::string& op,const std::string& back){return "<form method='post' action='/shop/action'>"+hidden("csrf",s.at("webCsrf"))+hidden("op",op)+hidden("back",back);}
std::string field(const std::string& key,const std::string& label,const std::string& type="text"){return "<label>"+esc(label)+"<input required maxlength='200' name='"+key+"' type='"+type+"'></label>";}
std::string name(const J& p,const std::string& lang){return p.at("name").value(lang,p.at("name").value("en",std::string()));}
std::string picture(const J& p){auto u=p.value("imageUrl",std::string());if(u.rfind("/images/",0)!=0)u="/images/product-placeholder.svg";return "<img loading='lazy' src='"+esc(u)+"' alt='"+esc(name(p,"en"))+"'>";}
std::string button(const J& s,const std::string& op,const std::string& back,const std::string& label,const std::string& extras=""){return form(s,op,back)+extras+"<button>"+esc(label)+"</button></form>";}
void install(httplib::Server& server,Store& store,std::function<std::string(const httplib::Request&,httplib::Response&)> session){
 server.Post("/shop/action",[&,session](const httplib::Request& req,httplib::Response& res){
  std::lock_guard<std::mutex> lock(store.mutex);auto id=session(req,res);auto s=store.state(id);auto get=[&](const char* k){return req.get_param_value(k);};
  if(!s.contains("webCsrf")||get("csrf")!=s["webCsrf"].get<std::string>()){res.status=403;res.set_content("Invalid form token. Reload the page.","text/plain");return;}
  auto back=get("back");if(back!="/"&&back!="/cart"&&back!="/orders"&&back!="/help"&&back!="/wishlist"&&back!="/account"&&back!="/checkout"&&back!="/admin")back="/";
  try{auto op=get("op");J a={{"op",op}};
   if(op.rfind("auth.",0)==0){auto fresh=store.authenticate(id,{{"op",op.substr(5)},{"email",get("email")},{"password",get("password")}});res.headers.erase("Set-Cookie");res.set_header("Set-Cookie","sb_session="+fresh+"; HttpOnly; SameSite=Strict; Path=/; Max-Age=3600");auto next=store.state(fresh);next["language"]=s.value("language",std::string("en"));next["easy"]=s.value("easy",false);store.save(fresh,next);if(op!="auth.logout")back="/";} else if(op=="preferences"){if(!webdata::translations.contains(get("language")))throw std::invalid_argument("Unsupported language");s["language"]=get("language");s["easy"]=get("easy")=="on";store.save(id,s);}
   else {
    if(op.rfind("cart.",0)==0||op=="wishlist.toggle"){a["productId"]=get("productId");a["variant"]=get("variant");if(op=="cart.add"||op=="cart.set"){auto q=get("quantity");if(!std::regex_match(q,std::regex("[0-9]{1,2}")))throw std::invalid_argument("Enter quantity 1 to 99");a["quantity"]=std::stoi(q);}}
    else if(op=="profile")a["user"]={{"name",get("name")},{"email",get("email")}};
    else if(op=="checkout"){a["key"]=get("key");a["payment"]=get("payment");a["address"]={{"fullName",get("fullName")},{"addressLine",get("addressLine")},{"city",get("city")},{"pincode",get("pincode")},{"mobile",get("mobile")}};}
    else if(op=="order.state"){a["orderId"]=get("orderId");a["status"]=get("status");}
    else if(op=="support.create"){a["type"]=get("type");a["subject"]=get("subject");a["message"]=get("message");a["orderId"]=get("orderId");}
    else if(op=="help.ack"&&s.contains("helpEvent"))a["eventId"]=s["helpEvent"]["eventId"];
    if(!get("owner").empty()){a["owner"]=get("owner");} if(op=="support.reply"){a["ticketId"]=get("ticketId");a["reply"]=get("reply");} store.action(id,a);
   }
  }catch(const std::exception& e){s=store.state(id);s["webError"]=e.what();store.save(id,s);back=back=="/orders"?"/checkout":back;}
  res.set_redirect(back,303);
 });
 server.Get(R"(/(?:product|cart|checkout|orders|help|wishlist|account|admin|voice)?)",[&,session](const httplib::Request& req,httplib::Response& res){
  std::lock_guard<std::mutex> lock(store.mutex);auto id=session(req,res);auto s=store.state(id);if(!s.contains("webCsrf")){s["webCsrf"]=token();store.save(id,s);}auto lang=s.value("language",std::string("en"));
  if(!webdata::translations.contains(lang))lang="en";
  auto t=[&](const std::string& key){return esc(webdata::translations.at(lang).value(key,webdata::translations.at("en").value(key,key)));};
  auto words=[&](const std::string& en,const std::string& hi,const std::string& od){return esc(lang=="hi"?hi:lang=="or"?od:en);};
  auto category=req.get_param_value("category");
  std::string h="<!doctype html><html lang='"+esc(lang)+"'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Sabka Bazaar</title><link rel='stylesheet' href='/store.css'><body"+std::string(s.value("easy",false)?" class='easy'":"")+"><a class='skip' href='#main'>Skip to content</a><div class='delivery-strip'>Deliver to: <strong>Odisha</strong><span>C++ / Linux · Shopping demonstration</span></div><header><a class='brand' href='/'>Sabka Bazaar<small>Where every family finds its favourites</small></a><div class='header-tools'>";
  h+=form(s,"preferences",req.path=="/account"?"/account":"/")+"<label class='language-label'>Language / भाषा / ଭାଷା<select name='language'>";
  for(auto l:{"en","hi","or"}){std::string label=l==std::string("en")?"English":l==std::string("hi")?"हिन्दी":"ଓଡ଼ିଆ";h+="<option value='"+std::string(l)+"'"+(lang==l?" selected":"")+">"+label+"</option>";}
  if(s.value("easy",false))h+=hidden("easy","on");
  h+="</select></label><button class='quiet'>Apply</button></form>";
  h+=form(s,"preferences","/")+hidden("language",lang)+(s.value("easy",false)?"":hidden("easy","on"))+"<button class='easy-toggle' aria-pressed='"+(s.value("easy",false)?std::string("true"):std::string("false"))+"'>✦ "+t("easyMode")+"</button></form><a class='help-button' href='/help'>? "+t("help")+"</a></div>";
  h+="<form action='/' class='search'><label class='sr' for='q'>"+t("searchButton")+"</label><input id='q' name='q' placeholder='"+t("searchPlaceholder")+"' value='"+esc(req.get_param_value("q"))+"'><button>"+t("searchButton")+"</button><a class='voice-entry' href='/voice'>♬ "+t("voiceSearch")+"</a></form><nav class='account-nav'><a href='/wishlist'>♡ "+t("wishlist")+"</a><a href='/orders'>"+t("orders")+"</a><a href='/account'>"+t(store.accounts->user(id).is_null()?"login":"account")+"</a><a class='button' href='/cart'>"+t("cart")+" ("+std::to_string(s["cart"].size())+")</a></nav></header><nav class='departments' aria-label='Departments'><a href='/'>"+t("allCategories")+"</a>";
  for(const auto& c:webdata::categories)h+="<a class='"+std::string(category==c["id"]?"active":"")+"' href='/?category="+esc(c["id"])+"'>"+esc(c["name"].value(lang,c["name"].value("en",std::string())))+"</a>";
  h+="</nav><main id='main'>";
  if(s.value("easy",false))h+="<aside class='notice'>"+t("easyModeDesc")+" <a href='/help'>"+t("help")+"</a></aside>";
  if(s.contains("webError")){h+="<p role='alert' class='notice'>"+esc(s["webError"])+"</p>";s.erase("webError");store.save(id,s);}
  if(s.contains("helpEvent")&&!s["helpEvent"].value("handled",false))h+="<aside class='notice'>Your paired kiosk requested help. <a href='/help'>Open customer care</a></aside>";
  auto path=req.path;
  auto purchase=[&](const J& p,const std::string& back){std::string pid=p["id"],b="<div class='actions'>";bool in=false;for(const auto& c:s["cart"])if(c["product"]["id"]==pid)in=true;
   if(p["stock"].get<int>()<=0)b+="<button disabled>"+t("outOfStock")+"</button>";
   else if(in)b+="<a class='button' href='/cart'>"+t("goToCart")+"</a>";
   else {b+=form(s,"cart.add",back)+hidden("productId",pid)+hidden("quantity","1");if(p.contains("variants")&&!p["variants"].empty()){b+="<label>"+words("Variant","विकल्प","ବିକଳ୍ପ")+"<select name='variant'>";for(const auto& v:p["variants"])b+="<option>"+esc(v)+"</option>";b+="</select></label>";}b+="<button>"+t("addToCart")+"</button></form>";}
   if(p["stock"].get<int>()>0)b+=button(s,"cart.add","/checkout",t("buyNow"),hidden("productId",pid)+hidden("quantity","1"));
   bool saved=false;for(const auto& w:s["wishlist"])if(w["id"]==pid)saved=true;
   b+=button(s,"wishlist.toggle","/wishlist",std::string(saved?"♥ ":"♡ ")+t("wishlist"),hidden("productId",pid));return b+"</div>";
  };
  auto pricing=[&](const J& p){std::string b="<div class='pricing'><strong>"+money(p["price"])+"</strong>";double mrp=p.value("mrp",0.0),price=p["price"].get<double>();if(mrp>price)b+=" <del>"+money(mrp)+"</del><span class='saving'>"+words("Demo saving","डेमो बचत","ଡେମୋ ସଞ୍ଚୟ")+" "+money(mrp-price)+"</span>";return b+"</div><small>"+words("Demo price · not a live quote","डेमो मूल्य · वर्तमान बाजार मूल्य नहीं","ଡେମୋ ମୂଲ୍ୟ · ବର୍ତ୍ତମାନ ବଜାର ଦର ନୁହେଁ")+"</small>";};
  auto card=[&](const J& p){std::string pid=p["id"],b="<article class='card'><a href='/product?id="+esc(pid)+"'>"+picture(p)+"<small class='brand-label'>"+esc(p.value("brand",std::string()))+"</small><h3>"+esc(name(p,lang))+"</h3></a>";
   if(p.contains("rating"))b+="<small class='demo-rating'>★ "+esc(p["rating"].dump())+" · "+words("sample rating, unverified","नमूना रेटिंग, अप्रमाणित","ନମୁନା ରେଟିଂ, ଯାଞ୍ଚ ହୋଇନାହିଁ")+"</small>";
   b+=pricing(p)+"<p class='stock'>"+t(p["stock"].get<int>()>0?"inStock":"outOfStock")+" · "+std::to_string(p["stock"].get<int>())+"</p>"+purchase(p,"/cart");return b+"</article>";};
  if(path=="/"){
   h+="<section class='hero'><small>YOUR EVERYDAY SHOPPING COMPANION</small><h1>Where every family finds its favourites</h1><p>From daily essentials to little celebrations — sabke liye, sab kuch</p><a class='button' href='#products'>Explore Collection</a><a class='secondary' href='/voice'>Voice Search</a><p class='alias-examples'>Try familiar names: tej patta · haldi · kurta</p></section><h2 id='products'>Discover your favourites</h2>";
   if(category.empty()&&req.get_param_value("q").empty()){h+="<div class='category-cards'>";for(const auto& c:webdata::categories)h+="<a href='/?category="+esc(c["id"])+"'><strong>"+esc(c["name"].value(lang,c["name"].value("en",std::string())))+"</strong><span>Explore collection →</span></a>";h+="</div>";}
   for(const auto& c:webdata::categories)if(c["id"]==category){h+="<section class='department-title'><h2>"+esc(c["name"].value(lang,c["name"].value("en",std::string())))+"</h2><p>Browse this department by collection</p></section><form class='filters' action='/'>"+hidden("category",category)+"<label>Subcategory<select name='sub'><option value=''>All collections</option>";for(const auto& sub:c["subcategories"])h+="<option value='"+esc(sub)+"'"+std::string(req.get_param_value("sub")==sub?" selected":"")+">"+esc(sub)+"</option>";h+="</select></label><button>Browse</button></form>";}
   std::vector<std::pair<int,J>> list;std::map<std::string,bool> cats;Statement q(store.db,"SELECT data,stock FROM products ORDER BY rowid");auto query=normalized(req.get_param_value("q"));auto cat=req.get_param_value("category");
   while(q.step()==SQLITE_ROW){J p=J::parse(q.str(0));p["stock"]=sqlite3_column_int64(q.p,1);cats[p["categoryId"].get<std::string>()]=true;if(!cat.empty()&&p["categoryId"]!=cat)continue;if(!req.get_param_value("sub").empty()&&p.value("subCategory",std::string())!=req.get_param_value("sub"))continue;int score=query.empty()?1:0;auto rank=[&](std::string t){t=normalized(t);if(t==query)score=100;else if(t.rfind(query,0)==0)score=std::max(score,80);else if(t.find(query)!=std::string::npos)score=std::max(score,60);};if(!query.empty()){for(auto& n:p["name"])rank(n);for(auto& a:p["aliases"])rank(a["term"]);rank(p["brand"]);}if(score)list.push_back({score,p});}
   h+="<form class='filters' action='/'>"+hidden("q",req.get_param_value("q"))+"<label>Department <select name='category'><option value=''>All departments</option>";for(auto& c:cats)h+="<option value='"+esc(c.first)+"'"+(cat==c.first?" selected":"")+">"+esc(c.first.substr(4))+"</option>";h+="</select></label><label>Sort <select name='sort'><option value=''>Best match</option><option value='low'>Price: low to high</option><option value='high'>Price: high to low</option></select></label><button>Apply</button></form>";
   auto sort=req.get_param_value("sort");std::stable_sort(list.begin(),list.end(),[&](auto& a,auto& b){if(sort=="low")return a.second["price"]<b.second["price"];if(sort=="high")return a.second["price"]>b.second["price"];return a.first>b.first;});h+="<p>"+std::to_string(list.size())+" sample products · prices are not live quotes</p><div class='grid'>";for(auto& p:list)h+=card(p.second);h+="</div>";if(list.empty())h+="<p>No matches. Try a brand, bay leaf, tej patta or another department.</p>";
  }else if(path=="/product"){
   try{auto p=store.product(req.get_param_value("id"));h+="<a href='/'>← "+words("Continue shopping","खरीदारी जारी रखें","କିଣାକିଣି ଜାରି ରଖନ୍ତୁ")+"</a><div class='detail product-detail'><div class='product-image'>"+picture(p)+"</div><section><small class='brand-label'>"+esc(p.value("brand",std::string()))+" · "+esc(p.value("unit",std::string()))+"</small><h1>"+esc(name(p,lang))+"</h1>"+pricing(p)+"<p class='stock'>"+t(p["stock"].get<int>()>0?"inStock":"outOfStock")+" · "+std::to_string(p["stock"].get<int>())+"</p><h2>"+words("About this product","इस उत्पाद के बारे में","ଏହି ଉତ୍ପାଦ ବିଷୟରେ")+"</h2><p>"+esc(p["description"].value(lang,p["description"].value("en",std::string())))+"</p><div class='aliases'><h3>"+words("Familiar / local names","स्थानीय नाम","ସ୍ଥାନୀୟ ନାମ")+"</h3>";
    for(const auto& a:p["aliases"])h+="<span>"+esc(a["term"])+"</span>";
    h+="</div>";auto source=p.value("sourceUrl",std::string());if(source.rfind("https://",0)==0)h+="<p><a href='"+esc(source)+"' target='_blank' rel='noopener noreferrer'>"+words("Product and packaging reference ↗","उत्पाद और पैकेजिंग संदर्भ ↗","ଉତ୍ପାଦ ଓ ପ୍ୟାକେଜିଂ ସନ୍ଦର୍ଭ ↗")+"</a></p>";
    h+=purchase(p,"/cart")+"<p class='muted'>"+words("Simulated delivery and payment. Buy Now includes the current cart. Read-aloud is not connected yet.","डिलीवरी और भुगतान डेमो हैं। अभी खरीदें में मौजूदा कार्ट शामिल है। पढ़कर सुनाना अभी उपलब्ध नहीं है।","ଡେଲିଭରି ଓ ପେମେଣ୍ଟ ଡେମୋ ଅଟେ। ଏବେ କିଣନ୍ତୁରେ ବର୍ତ୍ତମାନ କାର୍ଟ ସାମିଲ ଅଛି। ପଢ଼ି ଶୁଣାଇବା ଏବେ ଉପଲବ୍ଧ ନାହିଁ।")+"</p></section></div>";
   }catch(...){res.status=404;h+="<h1>Product not found</h1>";}
  }else if(path=="/voice"){
   h+="<section class='panel'><h1>"+t("voiceSearch")+"</h1><p><strong>PROPOSED — local C++ speech recognition</strong></p><p>This entry point is restored, but microphone capture and speech recognition are not connected to this browser interface yet. No microphone is active. The planned Linux kiosk module will capture audio only after an explicit action, transcribe locally, and show editable text before searching.</p><form action='/'><label>"+t("searchPlaceholder")+"<input name='q' required></label><button>"+t("searchButton")+"</button></form><a href='/'>Continue shopping</a></section>";  }else if(path=="/wishlist"){h+="<h1>Your wishlist</h1><div class='grid'>";for(auto& p:s["wishlist"])h+=card(store.product(p["id"]));h+="</div>";
  }else if(path=="/cart"||path=="/checkout"){
   h+="<h1>"+std::string(path=="/cart"?"Your cart":"Simple checkout")+"</h1>";for(auto& c:s["cart"]){auto p=c["product"];h+="<article class='row'>"+picture(p)+"<div><h3>"+esc(name(p,lang))+"</h3><p>"+money(p["price"])+" each</p>"+form(s,"cart.set","/cart")+hidden("productId",p["id"])+hidden("variant",c.value("selectedVariant",std::string()))+"<label>Quantity (0 removes)<input type='number' min='0' max='99' name='quantity' value='"+std::to_string(c["quantity"].get<int>())+"'></label><button>Update</button></form></div></article>";}
   auto t=store.totals(s["cart"]);h+="<aside class='panel'><p>Subtotal "+money(t["subtotal"])+" · Demo tax "+money(t["gst"])+" · Delivery "+money(t["deliveryFee"])+"</p><h2>Total "+money(t["total"])+"</h2></aside>";
   if(s["cart"].empty())h+="<p>Your cart is empty. <a href='/'>Discover products</a></p>";else if(path=="/cart")h+="<a class='button' href='/checkout'>Continue to checkout</a>";
   else {h+=form(s,"checkout","/orders")+hidden("key",token())+"<section class='panel'><h2>Delivery details</h2><p>Training demonstration: use fictional details. No actual payment or delivery.</p>"+field("fullName","Recipient")+field("addressLine","Address")+field("city","City")+field("pincode","PIN (6 digits)")+field("mobile","Demo mobile (10 digits)")+"<label>Simulated payment<select name='payment'><option>COD</option><option>UPI</option><option>Card</option></select></label><p>No bank or card information is collected</p><button>Place demo order</button></section></form>";}
  }else if(path=="/orders"){
   h+="<h1>Your orders</h1><p>Tracking and payment are simulated</p>";for(auto& o:s["orders"]){h+="<article class='panel'><h2>"+esc(o["status"])+" · "+money(o["total"])+"</h2><p class='break'>"+esc(o["id"])+"</p>";for(auto& i:o["items"])h+="<p>"+esc(name(i["product"],lang))+" × "+std::to_string(i["quantity"].get<int>())+"</p>";h+="<p>"+esc(o["shippingAddress"]["addressLine"])+" · "+esc(o["paymentMethod"])+" ("+esc(o["paymentStatus"])+")</p><ol>";for(auto& e:o["timeline"])h+="<li>"+esc(e["status"])+" — "+esc(e["timestamp"])+"</li>";h+="</ol>";std::vector<std::string> flow={"Placed","Confirmed","Packed","Shipped","Out for Delivery","Delivered"};auto it=std::find(flow.begin(),flow.end(),o["status"].get<std::string>());if(store.accounts->admin(id)&&it!=flow.end()&&std::next(it)!=flow.end())h+=button(s,"order.state","/orders","Demo: advance to "+*std::next(it),hidden("orderId",o["id"])+hidden("status",*std::next(it)));if(o["status"]=="Placed"||o["status"]=="Confirmed")h+=button(s,"order.state","/orders","Cancel order",hidden("orderId",o["id"])+hidden("status","Cancelled"));h+="</article>";}
  }else if(path=="/account"){
   auto user=store.accounts->user(id);
   if(user.is_null()){
    auto mode=req.get_param_value("mode")=="register"?std::string("register"):std::string("login");
    auto title=mode=="login"?words("Welcome back","फिर से स्वागत है","ପୁଣି ସ୍ୱାଗତ"):words("Create your account","अपना खाता बनाएं","ଆପଣଙ୍କ ଖାତା ଖୋଲନ୍ତୁ");
    h+="<div class='auth-layout'><section class='auth-story'><small>SABKA BAZAAR</small><h1>Where every family finds its favourites</h1><p>From daily essentials to little celebrations — sabke liye, sab kuch</p><p>"+words("Your language. Your favourites. Your shopping space.","आपकी भाषा। आपकी पसंद। आपकी खरीदारी।","ଆପଣଙ୍କ ଭାଷା। ଆପଣଙ୍କ ପସନ୍ଦ। ଆପଣଙ୍କ କିଣାକିଣି।")+"</p></section><section class='panel auth-form'><nav><a href='/account'>"+words("Login","लॉगिन","ଲଗଇନ୍")+"</a><a href='/account?mode=register'>"+words("Create Account","खाता बनाएं","ଖାତା ଖୋଲନ୍ତୁ")+"</a></nav><h2>"+title+"</h2>"+form(s,"auth."+mode,"/account")+field("email",words("Email","ईमेल","ଇମେଲ୍"),"email")+field("password",words("Password (10–128 bytes)","पासवर्ड (10–128 बाइट)","ପାସୱାର୍ଡ (10–128 ବାଇଟ୍)"),"password")+"<button>"+title+" →</button></form><p class='muted'>"+words("Use a unique demo password. Passwords are hashed; no email verification or password reset is provided.","अलग डेमो पासवर्ड उपयोग करें। पासवर्ड हैश किए जाते हैं। ईमेल सत्यापन और पासवर्ड रीसेट उपलब्ध नहीं हैं।","ଅଲଗା ଡେମୋ ପାସୱାର୍ଡ ବ୍ୟବହାର କରନ୍ତୁ। ପାସୱାର୍ଡ ହ୍ୟାସ୍ କରାଯାଏ। ଇମେଲ୍ ଯାଞ୍ଚ ଓ ପାସୱାର୍ଡ ରିସେଟ୍ ଉପଲବ୍ଧ ନାହିଁ।")+"</p><a href='/'>"+words("Continue browsing","खरीदारी देखें","କିଣାକିଣି ଦେଖନ୍ତୁ")+" →</a></section></div>";
   }else{
    h+="<h1>Your account</h1><p>"+esc(user["email"])+" · "+esc(user["role"])+"</p>"+button(s,"auth.logout","/account","Log out");
    if(user["role"]=="admin")h+="<a class='button' href='/admin'>Administrator workspace</a>";
   }
  }else if(path=="/admin"){
   if(!store.accounts->admin(id)){res.status=403;h+="<h1>Administrator login required</h1><a href='/account'>Login</a>";}
   else{h+="<h1>Administrator workspace</h1><p>Order movements and support replies are for the local demonstration.</p>";
    for(auto& account:store.admin_view(id)){
     h+="<section class='panel'><h2>"+esc(account["email"])+"</h2>";
     for(auto& o:account["orders"]){h+="<h3 class='break'>"+esc(o["id"])+"</h3><p>"+esc(o["status"])+" · "+money(o["total"])+"</p>";std::vector<std::string> flow={"Placed","Confirmed","Packed","Shipped","Out for Delivery","Delivered"};auto it=std::find(flow.begin(),flow.end(),o["status"].get<std::string>());if(it!=flow.end()&&std::next(it)!=flow.end())h+=button(s,"order.state","/admin","Advance to "+*std::next(it),hidden("owner",account["owner"])+hidden("orderId",o["id"])+hidden("status",*std::next(it)));}
     for(auto& t:account["supportTickets"]){h+="<h3>"+esc(t["subject"])+"</h3><p>"+esc(t["message"])+"</p>"+form(s,"support.reply","/admin")+hidden("owner",account["owner"])+hidden("ticketId",t["id"])+field("reply","Reply")+"<button>Save reply</button></form>";}
     h+="</section>";
    }
   }
  }else if(path=="/help"){
   h+="<h1>How can we help?</h1><p>Support requests are stored locally. No real agent, SMS or callback is connected.</p>"+form(s,"support.create","/help")+"<label>Request type<select name='type'><option>Order help</option><option>Callback request (simulated)</option><option>General question</option></select></label>"+field("subject","Subject")+field("message","Your message")+"<label>Optional order ID<input name='orderId'></label><button>Save support ticket</button></form><h2>Your tickets</h2>";for(auto& t:s["supportTickets"])h+="<article class='panel'><h3>"+esc(t["subject"])+"</h3><p>"+esc(t["message"])+"</p><small>"+esc(t["status"])+"</small><p>"+esc(t.value("adminReply",std::string()))+"</p></article>";h+="<h2>Linux help-button demonstration</h2>"+button(s,"kiosk.bind","/help","Pair this browser session")+"<p>After triggering the FIFO/device, refresh this page to receive the event. Only the paired session receives it.</p>";if(s.contains("helpEvent"))h+="<p>Event source: "+esc(s["helpEvent"]["source"])+"</p>"+button(s,"help.ack","/help","Acknowledge help request");
  }
  h+="</main><footer>Sabka Bazaar · C++ / Linux training demonstration · <a href='/photo-credits.html'>Photo credits</a><p>160 sample products · no real payments · browser voice unavailable in the JavaScript-free interface</p></footer></body></html>";
  res.set_header("Cache-Control","no-store");res.set_header("Content-Security-Policy","default-src 'none'; img-src 'self'; style-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");res.set_header("X-Content-Type-Options","nosniff");res.set_content(h,"text/html; charset=utf-8");
 });
}
}
