#pragma once
namespace web {
inline std::string errorText(const std::string& error,const std::string& language){
 static const std::map<std::string,std::pair<std::string,std::string>> messages={
 {"Enter a valid email address",{"सही ईमेल पता दर्ज करें","ଠିକ୍ ଇମେଲ୍ ଠିକଣା ଦିଅନ୍ତୁ"}},
 {"Password must be 10 to 128 bytes",{"पासवर्ड 10 से 128 बाइट का होना चाहिए","ପାସୱାର୍ଡ 10 ରୁ 128 ବାଇଟ୍ ହେବା ଆବଶ୍ୟକ"}},
 {"Invalid email or password",{"ईमेल या पासवर्ड गलत है","ଇମେଲ୍ କିମ୍ବା ପାସୱାର୍ଡ ଭୁଲ୍ ଅଟେ"}},
 {"Too many attempts; try again in 10 minutes",{"बहुत अधिक प्रयास। 10 मिनट बाद कोशिश करें","ଅଧିକ ଚେଷ୍ଟା ହୋଇଛି। 10 ମିନିଟ୍ ପରେ ଚେଷ୍ଟା କରନ୍ତୁ"}},
 {"Account cannot be registered; try logging in",{"खाता नहीं बनाया जा सका। लॉगिन करें","ଖାତା ଖୋଲି ହେଲା ନାହିଁ। ଲଗଇନ୍ କରନ୍ତୁ"}},
 {"Quantity exceeds stock",{"मात्रा उपलब्ध स्टॉक से अधिक है","ପରିମାଣ ଉପଲବ୍ଧ ଷ୍ଟକ୍ ଠାରୁ ଅଧିକ"}},
 {"Invalid quantity",{"सही मात्रा दर्ज करें","ଠିକ୍ ପରିମାଣ ଦିଅନ୍ତୁ"}},
 {"Address is incomplete",{"पूरा पता दर्ज करें","ସମ୍ପୂର୍ଣ୍ଣ ଠିକଣା ଦିଅନ୍ତୁ"}},
 {"Invalid PIN or demo mobile",{"6 अंकों का पिन और 10 अंकों का डेमो मोबाइल दर्ज करें","6 ଅଙ୍କର ପିନ୍ ଓ 10 ଅଙ୍କର ଡେମୋ ମୋବାଇଲ୍ ଦିଅନ୍ତୁ"}},
 {"Your cart is empty",{"आपका कार्ट खाली है","ଆପଣଙ୍କ କାର୍ଟ ଖାଲି ଅଛି"}},
 {"Stock changed; update cart",{"स्टॉक बदल गया है। कार्ट अपडेट करें","ଷ୍ଟକ୍ ବଦଳିଛି। କାର୍ଟ ବଦଳାନ୍ତୁ"}},
 {"Order not found",{"ऑर्डर नहीं मिला","ଅର୍ଡର୍ ମିଳିଲା ନାହିଁ"}},
 {"Cancellation unavailable",{"इस समय ऑर्डर रद्द नहीं हो सकता","ଏବେ ଅର୍ଡର୍ ବାତିଲ ହୋଇପାରିବ ନାହିଁ"}}
 };
 auto it=messages.find(error);if(it==messages.end()||language=="en")return error;return language=="hi"?it->second.first:language=="or"?it->second.second:error;
}
}
