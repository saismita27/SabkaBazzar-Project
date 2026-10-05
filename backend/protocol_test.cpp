#include "help_protocol.hpp"
#include <iostream>
#include <stdexcept>
void require(bool b,const char* s){if(!b)throw std::runtime_error(s);std::cout<<"PASS "<<s<<'\n';}
int main(){try{
 HelpLines lines;int events=0;auto accept=[&]{++events;};
 lines.feed("HE",2,accept);require(events==0,"partial FIFO command waits");
 lines.feed("LP\nHELP\n",8,accept);require(events==2,"split and combined commands are framed");
 lines.feed("BAD\n",4,accept);require(events==2,"unknown command ignored");
 std::string oversized(5000,'X');oversized+="HELP\nHELP\n";
 lines.feed(oversized.data(),oversized.size(),accept);require(events==3,"oversized line discarded and parser recovers");
 sabka_event event{};event.event_id=1;event.kiosk_id=SABKA_KIOSK_ID;event.timestamp_ns=1;std::memcpy(event.trigger_source,"TEST_SIMULATOR",15);
 require(valid_help_event(event),"shared event ABI accepted");event.kiosk_id=999;require(!valid_help_event(event),"wrong kiosk rejected");event.kiosk_id=SABKA_KIOSK_ID;std::memset(event.trigger_source,'x',32);require(!valid_help_event(event),"invalid source rejected");
}catch(const std::exception& e){std::cerr<<e.what()<<'\n';return 1;}}
