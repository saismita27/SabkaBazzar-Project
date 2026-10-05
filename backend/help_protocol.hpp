#pragma once
#include "../embedded/driver/sabka_help_protocol.h"
#include <cstddef>
#include <cstring>
#include <functional>
#include <string>
static_assert(sizeof(sabka_event)==48,"Driver ABI size mismatch");
static_assert(offsetof(sabka_event,timestamp_ns)==8,"Driver ABI offset mismatch");
inline bool valid_help_event(const sabka_event& e) {
    return e.event_id!=0 && e.kiosk_id==SABKA_KIOSK_ID && e.timestamp_ns!=0 &&
           std::memcmp(e.trigger_source,"TEST_SIMULATOR\0",15)==0;
}
// FIFO writes may arrive split or combined. Only complete HELP lines count.
class HelpLines {
    std::string pending;
    bool discard=false;
public:
    template<class Callback> void feed(const char* data,size_t size,Callback deliver) {
        for(size_t i=0;i<size;++i) {
            if(data[i]=='\n') {
                if(!discard&&pending=="HELP")deliver();
                pending.clear();discard=false;
            } else if(!discard) {
                if(pending.size()>=32){pending.clear();discard=true;}
                else pending+=data[i];
            }
        }
    }
};
