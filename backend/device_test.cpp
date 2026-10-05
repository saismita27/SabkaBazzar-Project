#include "help_protocol.hpp"
#include <fcntl.h>
#include <poll.h>
#include <unistd.h>
#include <sys/stat.h>
#include <cerrno>
#include <iostream>
#include <stdexcept>
// Run only after loading the actual module, with the backend listener stopped.
int main(int argc,char** argv){
 if(argc!=2||std::string(argv[1])!="--device"){std::cerr<<"Usage: sabka_device_test --device (requires loaded /dev/sabka_help; stop listener first)\n";return 2;}
 int fd=open("/dev/sabka_help",O_RDWR|O_NONBLOCK|O_CLOEXEC|O_NOFOLLOW);
 if(fd<0){std::cerr<<"SKIP: kernel device unavailable; no driver test completed\n";return 77;}
 try{
  struct stat st{};if(fstat(fd,&st)||!S_ISCHR(st.st_mode))throw std::runtime_error("Not a character device");
  sabka_event e{};auto n=read(fd,&e,sizeof e);if(n!=-1||errno!=EAGAIN)throw std::runtime_error("Expected idle EAGAIN; ensure exclusive test use");
  if(write(fd,"BAD\n",4)!=-1||errno!=EINVAL)throw std::runtime_error("Unknown command should fail EINVAL");
  if(write(fd,SABKA_HELP_COMMAND,5)!=5)throw std::runtime_error("HELP write failed");
  if(write(fd,SABKA_HELP_COMMAND,5)!=-1||errno!=EBUSY)throw std::runtime_error("Pending event should reject second write");
  pollfd p{fd,POLLIN,0};if(poll(&p,1,1000)!=1||!(p.revents&POLLIN))throw std::runtime_error("poll did not report readable event");
  char short_buffer[1];if(read(fd,short_buffer,1)!=-1||errno!=EINVAL)throw std::runtime_error("Short read should fail without consuming event");
  if(read(fd,&e,sizeof e)!=sizeof e||!valid_help_event(e))throw std::runtime_error("Invalid event ABI");
  if(read(fd,&e,sizeof e)!=-1||errno!=EAGAIN)throw std::runtime_error("Consumed event should return EAGAIN");
  std::cout<<"PASS real kernel device write/read/poll, backpressure, ABI, and nonblocking behavior\n";close(fd);return 0;
 }catch(const std::exception& e){std::cerr<<e.what()<<'\n';close(fd);return 1;}
}
