#pragma once
#include <stdexcept>
#include <algorithm>
#include <nlohmann/json.hpp>
#include <unicode/normalizer2.h>
#include <unicode/unistr.h>
#include <unicode/uchar.h>
#include <string>
inline std::string normalized(const std::string& text){
 UErrorCode status=U_ZERO_ERROR;
 auto normalizer=icu::Normalizer2::getNFKCCasefoldInstance(status);
 icu::UnicodeString result;
 normalizer->normalize(icu::UnicodeString::fromUTF8(text),result,status);
 if(U_FAILURE(status))throw std::runtime_error("Unicode normalization failed");
 icu::UnicodeString compact;bool space=false;
 for(int32_t i=0;i<result.length();){auto ch=result.char32At(i);i+=U16_LENGTH(ch);if(u_isUWhiteSpace(ch)){space=compact.length()>0;}else{if(space)compact.append(static_cast<UChar32>(' '));compact.append(ch);space=false;}}
 std::string output;compact.toUTF8String(output);return output;
}

// Shared by HTTP JSON and HTML rendering. Higher tiers always win over partial
// matches; brand matches help discovery but never outrank product names/aliases.
inline int product_search_score(const nlohmann::json& product,const std::string& query){
 const auto key=normalized(query);if(key.empty())return 1;
 int score=0;
 auto partial=[&](const std::string& text){auto n=normalized(text);if(n.rfind(key,0)==0)score=std::max(score,200);else if(n.find(key)!=std::string::npos)score=std::max(score,100);};
 for(const auto& name:product.at("name")){
  auto text=name.get<std::string>();
  if(normalized(text)==key)score=std::max(score,500);
  else partial(text);
 }
 for(const auto& alias:product.at("aliases")){
  auto text=alias.at("term").get<std::string>();
  if(text==query)score=std::max(score,400);
  else if(normalized(text)==key)score=std::max(score,300);
  else partial(text);
 }
 auto brand=normalized(product.value("brand",std::string()));
 if(!brand.empty()&&brand.find(key)!=std::string::npos)score=std::max(score,50);
 return score;
}
