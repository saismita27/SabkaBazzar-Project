#include <httplib.h>
#include <fstream>
#include <regex>
#include <iostream>
#include <stdexcept>
int main(int argc,char** argv){try{
 if(argc!=2){std::cerr<<"Usage: sabka_voice_smoke <public-fixture.wav>\n";return 2;}
 httplib::Client c("127.0.0.1",8080);c.set_read_timeout(100,0);auto page=c.Get("/voice");if(!page||page->status!=200)throw std::runtime_error("Voice page unavailable");
 std::smatch match;if(!std::regex_search(page->body,match,std::regex("name='csrf' value='([^']*)'")))throw std::runtime_error("Missing CSRF token");
 auto cookie=page->get_header_value("Set-Cookie");cookie=cookie.substr(0,cookie.find(';'));
 if(std::string(argv[1])=="--tts"){
  httplib::Headers headers{{"Cookie",cookie}};
  auto bad=c.Post("/voice/read",headers,httplib::Params{{"productId","prod-bay-leaf"}});
  if(!bad||bad->status!=403)throw std::runtime_error("Read-aloud CSRF bypass");
  for(const auto* language:{"en","hi","or"}){
   auto preference=c.Post("/shop/action",headers,httplib::Params{{"csrf",match[1].str()},{"op","preferences"},{"language",language},{"back","/"}});
   if(!preference||preference->status!=303)throw std::runtime_error("Language change failed");
   auto audio=c.Post("/voice/read",headers,httplib::Params{{"csrf",match[1].str()},{"productId","prod-bay-leaf"}});
   if(!audio||audio->status!=200||audio->body.find("data:audio/wav;base64,UklGR")==std::string::npos||audio->body.size()<10000)throw std::runtime_error(std::string("Missing generated WAV: ")+language);
   if(audio->body.find("autoplay")!=std::string::npos||audio->body.find("<script")!=std::string::npos)throw std::runtime_error("Unexpected auto playback or script");
   std::cout<<"PASS native speech WAV generation: "<<language<<" (pronunciation not human-reviewed)\n";
  }
  bad=c.Post("/voice/read",headers,httplib::Params{{"csrf",match[1].str()},{"productId","missing-product"}});
  if(!bad||bad->status!=404)throw std::runtime_error("Missing product was accepted");
  std::cout<<"PASS read-aloud CSRF and invalid-product rejection\n";return 0;
 }
 std::ifstream file(argv[1],std::ios::binary);std::string wav((std::istreambuf_iterator<char>(file)),{});if(wav.empty())throw std::runtime_error("Fixture missing");
 httplib::MultipartFormDataItems items={{"csrf",match[1].str(),"",""},{"consent","yes","",""},{"audio",wav,"fixture.wav","audio/wav"}};
 auto result=c.Post("/voice/record",{{"Cookie",cookie}},items);if(!result||result->status!=200)throw std::runtime_error("Upload route failed");
 if(result->body.find("Review the recognized text")==std::string::npos||result->body.find("country")==std::string::npos)throw std::runtime_error("Expected public JFK fixture transcription missing");
 if(result->body.find("data:audio/wav;base64,")==std::string::npos)throw std::runtime_error("Playback missing");
 std::cout<<"PASS real local whisper.cpp transcription through C++ upload route; review field and audio playback present. Microphone not used.\n";
 items.back().content="invalid audio";result=c.Post("/voice/record",{{"Cookie",cookie}},items);if(!result||result->body.find("Invalid audio was discarded")==std::string::npos)throw std::runtime_error("Malformed audio was not rejected");
 std::cout<<"PASS invalid audio rejection\n";
 }catch(const std::exception& e){std::cerr<<e.what()<<'\n';return 1;}}
