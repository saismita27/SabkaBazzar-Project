#pragma once
#include <atomic>
#include <functional>
#include <thread>
#include <fcntl.h>
#include <poll.h>
#include <unistd.h>
#include <sys/stat.h>
#include <cstring>
#include <cerrno>
#include <stdexcept>
#include <iostream>

// Explicit FIFO mode is a userspace simulation, never a kernel-driver test.
class HelpBridge {
 int fd=-1; std::atomic<bool> running{true}; std::thread worker;
public:
 HelpBridge(const std::string& path,std::function<void(const std::string&)> deliver){
  if(path.empty())return;
  bool fifo=path=="--fifo";std::string actual=path;
  if(fifo){
   std::string dir="/tmp/sabka-backend-"+std::to_string(getuid());
   if(mkdir(dir.c_str(),0700)<0&&errno!=EEXIST)throw std::runtime_error("Cannot create FIFO directory");
   struct stat st{};if(lstat(dir.c_str(),&st)<0||!S_ISDIR(st.st_mode)||st.st_uid!=getuid()||(st.st_mode&077))throw std::runtime_error("Unsafe FIFO directory");
   actual=dir+"/help.fifo";
   if(mkfifo(actual.c_str(),0600)<0&&errno!=EEXIST)throw std::runtime_error("Cannot create FIFO");
   if(lstat(actual.c_str(),&st)<0||!S_ISFIFO(st.st_mode)||st.st_uid!=getuid()||(st.st_mode&077))throw std::runtime_error("Unsafe FIFO");
  }
  fd=open(actual.c_str(),(fifo?O_RDWR:O_RDONLY)|O_NONBLOCK|O_CLOEXEC|O_NOFOLLOW);
  if(fd<0)throw std::runtime_error("Cannot open help device: "+actual);
  std::cout<<"Help input "<<actual<<(fifo?" (USERSPACE SIMULATION)":" (kernel device)")<<"\n";
  worker=std::thread([this,fifo,deliver]{
   pollfd p{fd,POLLIN,0};char data[256];
   while(running){
    int n=poll(&p,1,200);if(n<0){if(errno==EINTR)continue;break;}
    if(n>0&&(p.revents&POLLIN)){
     auto count=read(fd,data,sizeof data);
     if(count>0){try{deliver(fifo?"USERSPACE_FIFO_SIMULATOR":"KERNEL_WRITE_TRIGGERED_EVENT");}catch(const std::exception& e){std::cerr<<"Help delivery: "<<e.what()<<'\n';}}
    }
    if(p.revents&(POLLERR|POLLNVAL))break;
   }
  });
 }
 ~HelpBridge(){running=false;if(worker.joinable())worker.join();if(fd>=0)close(fd);}
};
