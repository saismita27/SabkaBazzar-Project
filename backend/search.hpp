#pragma once
#include <stdexcept>
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

#include <stdexcept>
