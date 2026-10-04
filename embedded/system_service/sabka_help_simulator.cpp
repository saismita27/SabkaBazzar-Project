/**
 * @file sabka_help_simulator.cpp
 * @brief C++ Linux System Programming Service & Device Event Listener
 * @author Final-Year B.Tech CSIT Student & Mentor
 * 
 * Demonstrates:
 * 1. File descriptors & non-blocking I/O
 * 2. poll() multiplexing for zero-CPU event listening
 * 3. Fallback to named pipe (FIFO) when running in environments without kernel module access
 * 4. Standalone single-threaded console listener
 * 5. POSIX signal handling (SIGINT, SIGTERM) for graceful shutdown
 * 6. Local event log (no browser IPC bridge is implemented)
 */

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <chrono>
#include <thread>
#include <atomic>
#include <mutex>
#include <cstring>
#include <csignal>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <poll.h>

#define PRIMARY_DEVICE_NODE "/dev/sabka_help"
static const std::string runtime_dir = "/tmp/sabka-help-" + std::to_string(getuid());
#define SIMULATED_FIFO_NODE (runtime_dir + "/help.fifo").c_str()
#define IPC_EVENT_LOG_FILE (runtime_dir + "/events.log").c_str()

/* Event structure matching the kernel driver struct */
struct SabkaEvent {
    uint32_t event_id;
    uint32_t kiosk_id;
    uint64_t timestamp_ns;
    char     trigger_source[32];
};

static volatile sig_atomic_t g_running = 1;
static std::mutex g_log_mutex;

void signal_handler(int) {
    g_running = 0;
}

void log_kiosk_event(const SabkaEvent& ev) {
    std::lock_guard<std::mutex> lock(g_log_mutex);
    std::ofstream outfile(IPC_EVENT_LOG_FILE, std::ios::app);
    if (outfile.is_open()) {
        auto now = std::chrono::system_clock::now();
        std::time_t now_time = std::chrono::system_clock::to_time_t(now);
        outfile << "TIMESTAMP=" << std::ctime(&now_time);
        outfile << "EVENT_ID=" << ev.event_id 
                << " KIOSK_ID=" << ev.kiosk_id 
                << " SOURCE=" << ev.trigger_source 
                << " STATUS=RECORDED_LOCALLY_NO_BROWSER_BRIDGE\n";
        outfile.flush();
    }
}

int main() {
    if (mkdir(runtime_dir.c_str(), 0700) < 0 && errno != EEXIST) return 1;
    struct stat directory_info {};
    if (lstat(runtime_dir.c_str(), &directory_info) < 0 || !S_ISDIR(directory_info.st_mode) || directory_info.st_uid != getuid() || (directory_info.st_mode & 077) != 0) {
        std::cerr << "Unsafe runtime directory: " << runtime_dir << '\n';
        return 1;
    }
    std::cout << "========================================================\n";
    std::cout << "  SABKA BAZZAR — LINUX KIOSK HELP EVENT DAEMON (C++)    \n";
    std::cout << "========================================================\n";

    // Register POSIX signal handlers
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = signal_handler;
    sigaction(SIGINT, &sa, nullptr);
    sigaction(SIGTERM, &sa, nullptr);

    bool is_real_driver = false;
    int fd = -1;

    // Step 1: Attempt to open the real kernel character device node
    fd = open(PRIMARY_DEVICE_NODE, O_RDONLY | O_NONBLOCK);
    if (fd >= 0) {
        is_real_driver = true;
        std::cout << "[INIT] Successfully opened real kernel device: " << PRIMARY_DEVICE_NODE << "\n";
    } else {
        std::cout << "[NOTICE] Kernel device " << PRIMARY_DEVICE_NODE << " not detected (" 
                  << strerror(errno) << ").\n";
        std::cout << "[INIT] Initializing userspace FIFO simulation node: " << SIMULATED_FIFO_NODE << "\n";

        // Create FIFO if it doesn't already exist
        if (mkfifo(SIMULATED_FIFO_NODE, 0600) == -1 && errno != EEXIST) {
            std::cerr << "[ERROR] mkfifo failed: " << strerror(errno) << "\n";
            return 1;
        }

        // Open non-blocking read/write to avoid blocking on FIFO open
        struct stat fifo_info {};
        if (lstat(SIMULATED_FIFO_NODE, &fifo_info) < 0 || !S_ISFIFO(fifo_info.st_mode) || fifo_info.st_uid != getuid()) return 1;
        fd = open(SIMULATED_FIFO_NODE, O_RDWR | O_NONBLOCK | O_NOFOLLOW);
        if (fd < 0) {
            std::cerr << "[ERROR] Failed to open simulation FIFO: " << strerror(errno) << "\n";
            return 1;
        }
    }

    std::cout << "[DAEMON] Event loop running. Monitoring events using poll() system call...\n";
    std::cout << "[INFO] To simulate a button press in another terminal, run:\n";
    if (is_real_driver) {
        std::cout << "       echo 1 > " << PRIMARY_DEVICE_NODE << "\n";
    } else {
        std::cout << "       echo 'HELP_KIOSK_101' > " << SIMULATED_FIFO_NODE << "\n";
    }
    std::cout << "--------------------------------------------------------\n";

    struct pollfd pfd;
    pfd.fd = fd;
    pfd.events = POLLIN;

    uint32_t simulated_seq = 0;

    while (g_running) {
        // poll with 500ms timeout so we can periodically check g_running
        int ret = poll(&pfd, 1, 500);

        if (ret < 0) {
            if (errno == EINTR) {
                // Interrupted by signal
                continue;
            }
            std::cerr << "[ERROR] poll() error: " << strerror(errno) << "\n";
            break;
        }

        if (ret == 0) {
            // Timeout expired; no event pending
            continue;
        }

        if (pfd.revents & POLLIN) {
            SabkaEvent ev;
            memset(&ev, 0, sizeof(ev));

            if (is_real_driver) {
                ssize_t n = read(fd, &ev, sizeof(ev));
                if (n == static_cast<ssize_t>(sizeof(ev))) {
                    ev.trigger_source[sizeof(ev.trigger_source) - 1] = '\0';
                    std::cout << "\n[KERNEL EVENT DETECTED!]\n";
                    std::cout << " -> Event ID : " << ev.event_id << "\n";
                    std::cout << " -> Kiosk ID : " << ev.kiosk_id << "\n";
                    std::cout << " -> Source   : " << ev.trigger_source << "\n";
                    log_kiosk_event(ev);
                }
            } else {
                char buf[128];
                ssize_t n = read(fd, buf, sizeof(buf) - 1);
                if (n > 0) {
                    buf[n] = '\0';
                    simulated_seq++;
                    ev.event_id = simulated_seq;
                    ev.kiosk_id = 101;
                    ev.timestamp_ns = std::chrono::duration_cast<std::chrono::nanoseconds>(
                        std::chrono::system_clock::now().time_since_epoch()).count();
                    strncpy(ev.trigger_source, "USERSPACE_FIFO_SIM", sizeof(ev.trigger_source) - 1);

                    std::cout << "\n[SIMULATED EVENT DETECTED!]\n";
                    std::cout << " -> Event ID : " << ev.event_id << "\n";
                    std::cout << " -> Kiosk ID : " << ev.kiosk_id << "\n";
                    std::cout << " -> Raw Data : " << buf;
                    std::cout << " -> IPC Log  : Written to " << IPC_EVENT_LOG_FILE << "\n";
                    log_kiosk_event(ev);
                }
            }
        }
    }

    // Cleanup resources
    close(fd);
    // Retain the user-owned FIFO so another listener is not disconnected.

    std::cout << "[DAEMON] Exiting cleanly. File descriptors closed. Goodbye!\n";
    return 0;
}
