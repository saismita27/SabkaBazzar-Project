#include "help_protocol.hpp"
#include <sys/utsname.h>
#include <sys/stat.h>
#include <unistd.h>
#include <fstream>
#include <iostream>
#include <string>
int main(){
 utsname u{};if(uname(&u)){std::cerr<<"uname failed\n";return 1;}
 std::cout<<"Sabka Bazaar Linux readiness report\nKernel: "<<u.release<<"\nArchitecture: "<<u.machine<<"\nUID: "<<getuid()<<"\nShared help event: "<<sizeof(sabka_event)<<" bytes\n";
 std::string tree="/lib/modules/"+std::string(u.release)+"/build";struct stat st{};
 bool headers=stat(tree.c_str(),&st)==0&&S_ISDIR(st.st_mode);
 std::cout<<"Matching kernel build tree: "<<(headers?"present":"MISSING")<<" ("<<tree<<")\n";
 std::ifstream disabled("/proc/sys/kernel/modules_disabled");std::string flag;std::getline(disabled,flag);std::cout<<"Module loading disabled flag: "<<flag<<" (0 does not prove permission/loadability)\n";
 bool device=lstat("/dev/sabka_help",&st)==0&&S_ISCHR(st.st_mode);std::cout<<"Character device: "<<(device?"present":"absent")<<"\n";
 std::ifstream init("/proc/1/comm");std::getline(init,flag);std::cout<<"PID 1: "<<flag<<"\n";
 std::cout<<"Userspace C++ demo can run independently. Real driver build/load is "<<(headers&&device?"eligible for explicit testing, not yet proven":"outstanding")<<".\n";
 return 0;
}
