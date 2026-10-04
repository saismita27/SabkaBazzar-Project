// Explicit write-triggered test event. This does not simulate a GPIO interrupt.
#include <fcntl.h>
#include <sys/stat.h>
#include <unistd.h>
#include <cerrno>
#include <cstring>
#include <iostream>
#include <string>
int main(int argc,char** argv){
    if(argc!=2){std::cerr<<"Usage: sabka_help_trigger --fifo | /dev/sabka_help\n";return 2;}
    const bool fifo=std::string(argv[1])=="--fifo";
    const std::string path=fifo?"/tmp/sabka-backend-"+std::to_string(getuid())+"/help.fifo":argv[1];
    if(!fifo&&path!="/dev/sabka_help"){std::cerr<<"Choose --fifo or /dev/sabka_help explicitly\n";return 2;}
    int fd=open(path.c_str(),O_WRONLY|O_NONBLOCK|O_CLOEXEC|O_NOFOLLOW);
    if(fd<0){std::cerr<<"Cannot open help input: "<<strerror(errno)<<'\n';return 1;}
    struct stat st{};
    if(fstat(fd,&st)<0||(fifo?(!S_ISFIFO(st.st_mode)||st.st_uid!=getuid()):!S_ISCHR(st.st_mode))){close(fd);std::cerr<<"Unexpected device type/owner\n";return 1;}
    const char event[]="HELP\n";
    ssize_t n;do{n=write(fd,event,sizeof(event)-1);}while(n<0&&errno==EINTR);
    const int saved=errno;close(fd);
    if(n!=sizeof(event)-1){std::cerr<<"Event not accepted: "<<strerror(saved)<<'\n';return 1;}
    std::cout<<(fifo?"USERSPACE FIFO SIMULATION":"KERNEL DEVICE WRITE TEST")<<": event written\n";
}
