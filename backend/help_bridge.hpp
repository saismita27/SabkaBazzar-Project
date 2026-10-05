#pragma once
#include "help_protocol.hpp"
#include <atomic>
#include <functional>
#include <thread>
#include <fcntl.h>
#include <poll.h>
#include <unistd.h>
#include <sys/stat.h>
#include <cerrno>
#include <stdexcept>
#include <iostream>
#include <chrono>

// A FIFO is explicitly userspace simulation. The real device uses the shared ABI.
class HelpBridge {
    int fd=-1;
    std::atomic<bool> running{true};
    std::thread worker;
public:
    using Receiver=std::function<void(const std::string&,const sabka_event&)>;
    HelpBridge(const std::string& path,Receiver deliver) {
        if(path.empty())return;
        const bool fifo=path=="--fifo";
        if(!fifo&&path!="/dev/sabka_help")throw std::runtime_error("Help input must be --fifo or /dev/sabka_help");
        std::string actual=path;
        if(fifo) {
            std::string dir="/tmp/sabka-backend-"+std::to_string(getuid());
            if(mkdir(dir.c_str(),0700)<0&&errno!=EEXIST)throw std::runtime_error("Cannot create FIFO directory");
            struct stat st{};
            if(lstat(dir.c_str(),&st)<0||!S_ISDIR(st.st_mode)||st.st_uid!=getuid()||(st.st_mode&077))throw std::runtime_error("Unsafe FIFO directory");
            actual=dir+"/help.fifo";
            if(mkfifo(actual.c_str(),0600)<0&&errno!=EEXIST)throw std::runtime_error("Cannot create FIFO");
        }
        fd=open(actual.c_str(),(fifo?O_RDWR:O_RDONLY)|O_NONBLOCK|O_CLOEXEC|O_NOFOLLOW);
        if(fd<0)throw std::runtime_error("Cannot open help device: "+actual);
        struct stat st{};
        if(fstat(fd,&st)<0||(fifo?(!S_ISFIFO(st.st_mode)||st.st_uid!=getuid()||(st.st_mode&077)):!S_ISCHR(st.st_mode))) {
            close(fd);fd=-1;throw std::runtime_error("Invalid help device type or permissions");
        }
        std::cout<<"Help input "<<actual<<(fifo?" (USERSPACE SIMULATION)":" (kernel device)")<<'\n';
        try {worker=std::thread([this,fifo,deliver]{
            pollfd p{fd,POLLIN,0};HelpLines lines;__u32 sequence=0;
            auto send=[&](const sabka_event& event){
                try{deliver(fifo?"USERSPACE_FIFO_SIMULATOR":"KERNEL_WRITE_TRIGGERED_EVENT",event);}
                catch(const std::exception& e){std::cerr<<"Help delivery: "<<e.what()<<'\n';}
            };
            while(running) {
                int n=poll(&p,1,200);
                if(n<0){if(errno==EINTR)continue;std::cerr<<"Help poll failed\n";break;}
                if(n>0&&(p.revents&POLLIN)) {
                    if(fifo) {
                        char data[256];auto count=read(fd,data,sizeof data);
                        if(count>0)lines.feed(data,static_cast<size_t>(count),[&]{
                            sabka_event e{};e.event_id=++sequence;e.kiosk_id=SABKA_KIOSK_ID;
                            e.timestamp_ns=std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::system_clock::now().time_since_epoch()).count();
                            std::memcpy(e.trigger_source,"TEST_SIMULATOR",15);send(e);
                        });
                    } else {
                        sabka_event e{};auto count=read(fd,&e,sizeof e);
                        if(count==sizeof e&&valid_help_event(e))send(e);
                        else if(count>0)std::cerr<<"Rejected malformed kernel help event\n";
                    }
                }
                if(p.revents&(POLLERR|POLLNVAL|POLLHUP)){std::cerr<<"Help input disconnected\n";break;}
            }
        });}catch(...){close(fd);fd=-1;throw;}
    }
    HelpBridge(const HelpBridge&)=delete;
    HelpBridge& operator=(const HelpBridge&)=delete;
    ~HelpBridge(){running=false;if(worker.joinable())worker.join();if(fd>=0)close(fd);}
};
