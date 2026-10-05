#pragma once
#include <sys/wait.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fcntl.h>
#include <filesystem>
#include <chrono>

// Native kiosk prototype. Only explicit CSRF-protected consent starts host audio.
// No shell commands, browser scripts, cloud audio upload or automatic recording.
namespace voice {
inline bool run(const std::vector<std::string>& args,int seconds){
 std::vector<char*> argv;for(const auto& a:args)argv.push_back(const_cast<char*>(a.c_str()));argv.push_back(nullptr);
 pid_t child=fork();if(child<0)return false;
 if(child==0){sigset_t mask;sigemptyset(&mask);sigprocmask(SIG_SETMASK,&mask,nullptr);int null=open("/dev/null",O_RDWR);if(null>=0){dup2(null,0);dup2(null,1);dup2(null,2);close(null);}execv(argv[0],argv.data());_exit(127);}
 auto end=std::chrono::steady_clock::now()+std::chrono::seconds(seconds);int status=0;
 while(std::chrono::steady_clock::now()<end){auto r=waitpid(child,&status,WNOHANG);if(r==child)return WIFEXITED(status)&&WEXITSTATUS(status)==0;if(r<0)return false;std::this_thread::sleep_for(std::chrono::milliseconds(50));}
 kill(child,SIGKILL);while(waitpid(child,&status,0)<0&&errno==EINTR){}return false;
}
inline std::string base64(const std::string& input){static const char alphabet[]="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";std::string out;unsigned value=0;int bits=-6;for(unsigned char c:input){value=(value<<8)|c;bits+=8;while(bits>=0){out+=alphabet[(value>>bits)&63];bits-=6;}}if(bits>-6)out+=alphabet[((value<<8)>>(bits+8))&63];while(out.size()%4)out+='=';return out;}
inline void install(httplib::Server& server,Store& store,std::function<std::string(const httplib::Request&,httplib::Response&)> session){
 server.Post("/voice/read",[&,session](const httplib::Request& req,httplib::Response& res){
  std::string lang,text,pid=req.get_param_value("productId");
  {std::lock_guard<std::mutex> guard(store.mutex);auto s=store.state(session(req,res));
   if(!s.contains("webCsrf")||req.get_param_value("csrf")!=s["webCsrf"]){res.status=403;res.set_content("Invalid form token.","text/plain");return;}
   lang=s.value("language",std::string("en"));if(lang!="hi"&&lang!="or")lang="en";
   try{auto p=store.product(pid);text=web::name(p,lang)+". "+p["description"].value(lang,p["description"].value("en",std::string()));}
   catch(...){res.status=404;res.set_content("Product not found.","text/plain");return;}
  }
  auto words=[&](const std::string& en,const std::string& hi,const std::string& od){return lang=="hi"?hi:lang=="or"?od:en;};
  if(text.size()>16000){res.status=413;res.set_content("Product text is too long for audio.","text/plain");return;}
  static std::mutex synthesis;std::unique_lock<std::mutex> guard(synthesis,std::try_to_lock);
  if(!guard.owns_lock()){res.status=429;res.set_content("Read-aloud is busy. Please try again shortly.","text/plain");return;}
  char pattern[]="/tmp/sabka-read-XXXXXX";char* dir=mkdtemp(pattern);if(!dir){res.status=500;return;}
  struct Cleanup{std::string path;~Cleanup(){std::error_code ec;std::filesystem::remove_all(path,ec);}} cleanup{dir};
  std::string input=std::string(dir)+"/text.txt",output=std::string(dir)+"/speech.wav";
  {std::ofstream f(input);f<<text;if(!f){res.status=500;return;}}
  const char* configured=std::getenv("SABKA_ESPEAK_BIN"),*data=std::getenv("SABKA_ESPEAK_DATA"),*home=std::getenv("HOME");
  std::string cache=std::string(home?home:"")+"/.cache/sabka-espeak-ng/build";
  std::string binary=configured?configured:access("/usr/bin/espeak-ng",X_OK)==0?"/usr/bin/espeak-ng":cache+"/src/espeak-ng";
  std::vector<std::string> args{binary,"-v",lang,"-s","145","-f",input,"-w",output};
  if(data)args.push_back(std::string("--path=")+data);else if(!configured&&binary!="/usr/bin/espeak-ng")args.push_back("--path="+cache);
  std::string audio;
  if(access(binary.c_str(),X_OK)==0&&run(args,20)){std::error_code ec;auto size=std::filesystem::file_size(output,ec);if(!ec&&size>=44&&size<=8000000){std::ifstream f(output,std::ios::binary);audio.assign(std::istreambuf_iterator<char>(f),{});if(audio.compare(0,4,"RIFF")||audio.compare(8,4,"WAVE"))audio.clear();}}
  std::string title=words("Read aloud","पढ़कर सुनें","ପଢ଼ି ଶୁଣନ୍ତୁ");
  std::string h="<!doctype html><html lang='"+lang+"'><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>"+title+"</title><link rel='stylesheet' href='/store.css'><main><section class='panel'><h1>"+title+"</h1>";
  if(audio.empty()){res.status=503;h+="<p>"+words("Local speech generation is unavailable. Install espeak-ng or configure SABKA_ESPEAK_BIN and SABKA_ESPEAK_DATA. Product text remains available below.","स्थानीय आवाज़ अभी उपलब्ध नहीं है। उत्पाद का विवरण नीचे पढ़ें।","ସ୍ଥାନୀୟ ସ୍ୱର ଏବେ ଉପଲବ୍ଧ ନାହିଁ। ଉତ୍ପାଦ ବିବରଣୀ ତଳେ ପଢ଼ନ୍ତୁ।")+"</p>";}
  else h+="<p>"+words("Press Play to listen. Synthetic pronunciation may be imperfect.","सुनने के लिए प्ले दबाएँ। कृत्रिम उच्चारण में त्रुटियाँ हो सकती हैं।","ଶୁଣିବା ପାଇଁ ପ୍ଲେ ଦବାନ୍ତୁ। କୃତ୍ରିମ ଉଚ୍ଚାରଣରେ ତ୍ରୁଟି ରହିପାରେ।")+"</p><audio controls aria-label='"+title+"' src='data:audio/wav;base64,"+base64(audio)+"'></audio>";
  h+="<p>"+web::esc(text)+"</p><a class='button' href='/product?id="+web::esc(pid)+"'>"+words("Back to product","उत्पाद पर वापस जाएँ","ଉତ୍ପାଦକୁ ଫେରନ୍ତୁ")+"</a></section></main></html>";
  res.set_header("Cache-Control","no-store");res.set_header("Content-Security-Policy","default-src 'none'; style-src 'self'; media-src data:; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");res.set_content(h,"text/html; charset=utf-8");
 });
 server.Post("/voice/record",[&,session](const httplib::Request& req,httplib::Response& res){
  auto field=[&](const std::string& key){return req.has_file(key)?req.get_file_value(key).content:req.get_param_value(key);};
  std::string lang;
  {std::lock_guard<std::mutex> lock(store.mutex);auto s=store.state(session(req,res));if(!s.contains("webCsrf")||field("csrf")!=s["webCsrf"]||field("consent")!="yes"){res.status=403;res.set_content("Explicit recording consent and a valid form token are required.","text/plain");return;}lang=s.value("language",std::string("en"));}
  static std::mutex microphone;std::unique_lock<std::mutex> lock(microphone,std::try_to_lock);if(!lock.owns_lock()){res.status=409;res.set_content("Microphone is in use. Try again after the current recording.","text/plain");return;}
  std::string message,text,audio;char pattern[]="/tmp/sabka-voice-XXXXXX";char* dir=mkdtemp(pattern);
  if(!dir){res.status=500;return;}
  struct Cleanup{std::string path;~Cleanup(){std::error_code ec;std::filesystem::remove_all(path,ec);}} cleanup{dir};
  std::string wav=std::string(dir)+"/recording.wav",output=std::string(dir)+"/transcript";
  bool uploaded=req.has_file("audio"),captured=false;
  if(uploaded){auto bytes=req.get_file_value("audio").content;if(bytes.size()>=44&&bytes.size()<=800000&&bytes.compare(0,4,"RIFF")==0&&bytes.compare(8,4,"WAVE")==0){std::ofstream file(wav,std::ios::binary);file.write(bytes.data(),bytes.size());captured=bool(file);}if(!captured)message="Upload a WAV file smaller than 800 KB. Invalid audio was discarded.";}
  else if(access("/usr/bin/arecord",X_OK)!=0)message="Linux audio capture is not installed. Install alsa-utils; typing remains available.";
  else if(!run({"/usr/bin/arecord","-q","-d","8","-f","S16_LE","-r","16000","-c","1","-t","wav",wav},12))message="No recording was captured. Check the Ubuntu audio device and microphone permissions. Typing remains available.";
  else captured=true;
  if(captured){
   std::ifstream f(wav,std::ios::binary);audio.assign(std::istreambuf_iterator<char>(f),{});if(audio.size()>800000||audio.size()<44){audio.clear();message="Unexpected audio data; recording discarded.";}
   else {const char* home=std::getenv("HOME"),*binaryEnv=std::getenv("SABKA_WHISPER_BIN"),*modelEnv=std::getenv("SABKA_WHISPER_MODEL");std::string cache=std::string(home?home:"")+"/.cache/sabka-whisper-cpp",binary=binaryEnv?binaryEnv:cache+"/build/bin/whisper-cli",model=modelEnv?modelEnv:cache+"/models/ggml-tiny.bin";
    if(lang=="or")message="Odia recognition is not supported by this prototype. Recording playback and typed Odia remain available.";
    else if(binary.empty()||model.empty()||access(binary.c_str(),X_OK)!=0||access(model.c_str(),R_OK)!=0)message="Recording captured locally. Speech recognition is not configured: set SABKA_WHISPER_BIN and SABKA_WHISPER_MODEL to a local whisper.cpp executable and multilingual model.";
    else if(run({binary,"-m",model,"-f",wav,"-l",lang,"-otxt","-of",output,"-nt"},90)){std::ifstream result(output+".txt");text.assign(std::istreambuf_iterator<char>(result),{});if(text.size()>2000)text.resize(2000);message="Review the recognized text before searching. Recognition may make mistakes.";}
    else message="Local recognition failed or timed out. Listen to the recording or type your search.";
   }
  }
  std::string h="<!doctype html><html><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'><title>Voice search review</title><link rel='stylesheet' href='/store.css'><main><section class='panel'><h1>Voice search — PROTOTYPE</h1><p>"+web::esc(message)+"</p>";
  if(!audio.empty())h+="<audio controls src='data:audio/wav;base64,"+base64(audio)+"'></audio><p>Temporary server audio is deleted after this response. This page contains the recording until you close it.</p>";
  h+="<form action='/'><label>Review or type your search<input name='q' maxlength='2000' value='"+web::esc(text)+"'></label><button>Search reviewed text</button></form><a href='/voice'>Back to voice search</a></section></main></html>";
  res.set_header("Cache-Control","no-store");res.set_header("Content-Security-Policy","default-src 'none'; style-src 'self'; media-src data:; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");res.set_content(h,"text/html; charset=utf-8");
 });
}
}
