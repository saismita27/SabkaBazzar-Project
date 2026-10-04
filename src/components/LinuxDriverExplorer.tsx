import React, { useState } from 'react';
import { 
  X, 
  Terminal, 
  Cpu, 
  Layers, 
  FileCode, 
  HelpCircle, 
  CheckCircle2, 
  Play, 
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LinuxDriverExplorer: React.FC = () => {
  const { 
    isLinuxInspectorOpen, 
    setIsLinuxInspectorOpen, 
    triggerSimulatedKioskEvent, 
    kioskHardwareEvent 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'architecture' | 'viva'>('simulator');
  const [selectedFile, setSelectedFile] = useState<'driver' | 'simulator' | 'cmake' | 'makefile'>('driver');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[    0.000000] Linux localhost 4.19.0-gvisor x86_64 GNU/Linux',
    '[    1.240112] sabka_help: Allocating dynamic chrdev region for "sabka_help"...',
    '[    1.240180] sabka_help: Major: 240, Minor: 0 registered in Virtual File System (VFS)',
    '[    1.240220] sabka_help: Created device node at /dev/sabka_help (Mode: 0666)',
    '[    1.240310] sabka_daemon: C++ listener thread waiting on poll(&pfd, 1, 500ms)...'
  ]);

  if (!isLinuxInspectorOpen) return null;

  const handleSimulateButtonPress = () => {
    const timestampSec = (Date.now() / 1000).toFixed(6);
    const newLog1 = `[  ${timestampSec}] [IRQ_HANDLER] GPIO_PIN_17 Falling Edge triggered. State: ACTIVE_LOW`;
    const newLog2 = `[  ${timestampSec}] [KERNEL_FOPS] sabka_write() enqueued Event #101. Waking up wait_queue_head_t help_wait_queue...`;
    const newLog3 = `[  ${timestampSec}] [USERSPACE] poll() unblocked with POLLIN | POLLRDNORM! copy_to_user() delivered 48 bytes to C++ listener.`;
    const newLog4 = `[  ${timestampSec}] [IPC_DISPATCH] Broadcast to Active Kiosk Browser Session -> Opened Assistance Modal.`;

    setTerminalLogs(prev => [...prev, newLog1, newLog2, newLog3, newLog4]);
    triggerSimulatedKioskEvent('GPIO_PIN_17_EMBEDDED_SWITCH');
  };

  const clearLogs = () => {
    setTerminalLogs([
      '[    0.000000] Linux localhost kernel init completed.',
      '[    1.240000] sabka_help: Device node ready at /dev/sabka_help'
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-slate-950 text-slate-100 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-white tracking-wide">
                  Embedded Linux & C++ System Architecture Inspector
                </h2>
                <span className="text-[10px] bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-0.5 rounded-full font-mono">
                  /dev/sabka_help
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                B.Tech CSIT Final Year Project Defense & Interactive Subsystem Explorer
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLinuxInspectorOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 p-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'simulator' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Interactive Device Simulator</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'architecture' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>HW/SW Boundary Diagram</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'code' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>Source Code (C / C++)</span>
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`flex-1 py-2 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'viva' 
                ? 'bg-orange-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Interview Viva Defense Q&A</span>
          </button>
        </div>

        {/* Tab 1: Simulator */}
        {activeTab === 'simulator' && (
          <div className="p-6 overflow-y-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Physical Button Actuation */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Physical Hardware Actuation
                </span>
                <p className="text-[11px] text-slate-400 mb-6">
                  Simulates pressing the tactile red assistance button mounted on the assisted shopping kiosk panel.
                </p>

                {/* Tactile Big Red Button */}
                <button
                  onClick={handleSimulateButtonPress}
                  className="w-32 h-32 rounded-full bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-400 hover:to-rose-600 active:scale-95 shadow-xl shadow-rose-900/40 border-4 border-rose-400/40 flex flex-col items-center justify-center text-white font-extrabold cursor-pointer transition-all group"
                >
                  <span className="text-xl tracking-wider uppercase group-hover:scale-110 transition-transform">
                    HELP
                  </span>
                  <span className="text-[10px] font-mono text-rose-200">
                    GPIO Pin 17
                  </span>
                </button>

                <p className="text-[10px] text-slate-500 mt-6">
                  Triggers kernel <code className="text-orange-400">wake_up_interruptible()</code> and userspace <code className="text-orange-400">poll()</code>.
                </p>
              </div>

              {/* Right Column: Live Terminal Output */}
              <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col h-80 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-400 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Kernel Ring Buffer & Userspace Daemon Stream</span>
                  </div>
                  <button 
                    onClick={clearLogs}
                    className="hover:text-white underline cursor-pointer"
                  >
                    Clear Logs
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-1.5 text-slate-300 pr-1 leading-relaxed">
                  {terminalLogs.map((log, idx) => (
                    <div key={idx} className={log.includes('IRQ_HANDLER') ? 'text-amber-400' : log.includes('POLLIN') ? 'text-emerald-400 font-bold' : ''}>
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">DEVICE NODE</span>
                <span className="font-bold text-orange-400">/dev/sabka_help</span>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MAJOR / MINOR</span>
                <span className="font-bold text-slate-200">240 : 0</span>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">SYS CALL WAITER</span>
                <span className="font-bold text-emerald-400">poll() (Zero CPU)</span>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px]">MEM TRANSFER</span>
                <span className="font-bold text-sky-400">copy_to_user()</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Architecture Diagram */}
        {activeTab === 'architecture' && (
          <div className="p-6 overflow-y-auto space-y-6 text-xs">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold text-sm text-orange-400 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Complete Signal Path from Tactile Switch to Web Browser</span>
              </h3>

              <div className="space-y-4 font-mono text-[11px] leading-relaxed">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-orange-400 font-bold block mb-1">1. PHYSICAL HARDWARE LAYER:</span>
                  Physical red button pressed at Assisted Shopping Kiosk ➔ Pulls GPIO Pin 17 to GND ➔ Falling-edge detected by ARM/x86 SoC Interrupt Controller.
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-emerald-400 font-bold block mb-1">2. LINUX KERNEL SPACE (sabka_help_driver.c):</span>
                  Top-half ISR executed ➔ Event queued in circular buffer ➔ Driver executes <code className="text-yellow-300">wake_up_interruptible(&help_wait_queue)</code> ➔ Driver poll callback sets <code className="text-yellow-300">EPOLLIN | EPOLLRDNORM</code>.
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-sky-400 font-bold block mb-1">3. LINUX USERSPACE (C++ DAEMON sabka_help_simulator.cpp):</span>
                  C++ background thread blocked on <code className="text-yellow-300">poll(&pfd, 1, timeout)</code> unblocks immediately ➔ Thread invokes <code className="text-yellow-300">read(fd, &event, sizeof(event))</code> ➔ Kernel uses <code className="text-yellow-300">copy_to_user()</code> to transfer event struct ➔ Logs to <code className="text-yellow-300">/tmp/sabka_help_events.log</code>.
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-pink-400 font-bold block mb-1">4. APPLICATION & KIOSK UI LAYER:</span>
                  Web application receives IPC event ➔ Identifies active kiosk station ➔ Pops modal with audio chime ➔ Attendant notified immediately.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Source Code Viewer */}
        {activeTab === 'code' && (
          <div className="p-6 overflow-y-auto space-y-4">
            <div className="flex gap-2">
              {[
                { id: 'driver', label: 'sabka_help_driver.c (Kernel Driver)' },
                { id: 'simulator', label: 'sabka_help_simulator.cpp (C++ Daemon)' },
                { id: 'cmake', label: 'CMakeLists.txt' },
                { id: 'makefile', label: 'Makefile' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFile(f.id as any)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-mono font-medium transition-colors cursor-pointer ${
                    selectedFile === f.id ? 'bg-orange-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto text-[11px] font-mono leading-relaxed text-slate-300 max-h-96">
              {selectedFile === 'driver' && (
                <pre>{`// sabka_help_driver.c (Linux Character Device Driver)
#include <linux/init.h>
#include <linux/module.h>
#include <linux/fs.h>
#include <linux/cdev.h>
#include <linux/uaccess.h>
#include <linux/wait.h>
#include <linux/poll.h>

static DECLARE_WAIT_QUEUE_HEAD(help_wait_queue);
static int event_available = 0;

static ssize_t sabka_read(struct file *filep, char __user *buffer, size_t len, loff_t *offset) {
    if (!event_available) {
        if (filep->f_flags & O_NONBLOCK) return -EAGAIN;
        wait_event_interruptible(help_wait_queue, (event_available != 0));
    }
    // Safe memory transfer between kernel and userspace
    if (copy_to_user(buffer, &current_event, sizeof(current_event))) {
        return -EFAULT;
    }
    event_available = 0;
    return sizeof(current_event);
}

static __poll_t sabka_poll(struct file *filep, struct poll_table_struct *wait) {
    poll_wait(filep, &help_wait_queue, wait);
    return event_available ? (EPOLLIN | EPOLLRDNORM) : 0;
}`}</pre>
              )}
              {selectedFile === 'simulator' && (
                <pre>{`// sabka_help_simulator.cpp (C++ System Service)
#include <iostream>
#include <poll.h>
#include <fcntl.h>
#include <unistd.h>
#include <csignal>

int main() {
    int fd = open("/dev/sabka_help", O_RDONLY | O_NONBLOCK);
    struct pollfd pfd = { fd, POLLIN, 0 };

    while (g_running) {
        int ret = poll(&pfd, 1, 500); // 500ms zero-CPU wait
        if (ret > 0 && (pfd.revents & POLLIN)) {
            SabkaEvent ev;
            read(fd, &ev, sizeof(ev));
            std::cout << "[KERNEL EVENT] Kiosk Button Pressed: " << ev.event_id << std::endl;
        }
    }
}`}</pre>
              )}
              {selectedFile === 'cmake' && (
                <pre>{`cmake_minimum_required(VERSION 3.10)
project(SabkaBazzarEmbeddedServices CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_FLAGS "\${CMAKE_CXX_FLAGS} -Wall -Wextra -pthread")

add_executable(sabka_help_simulator sabka_help_simulator.cpp)
add_executable(order_worker order_worker.cpp)`}</pre>
              )}
              {selectedFile === 'makefile' && (
                <pre>{`obj-m += sabka_help_driver.o
KDIR ?= /lib/modules/$(shell uname -r)/build
PWD  := $(shell pwd)

all:
\t$(MAKE) -C $(KDIR) M=$(PWD) modules
clean:
\t$(MAKE) -C $(KDIR) M=$(PWD) clean`}</pre>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Viva Defense Q&A */}
        {activeTab === 'viva' && (
          <div className="p-6 overflow-y-auto space-y-4 text-xs">
            {[
              {
                q: 'Why character device instead of block device for the help button?',
                a: 'Character devices operate on unbuffered, sequential byte streams. A physical button generates single timestamped event structs, not structured 512-byte filesystem disk sectors.'
              },
              {
                q: 'Why is poll() used instead of a while(true) loop in C++?',
                a: 'A while(true) loop without blocking consumes 100% CPU spinning. Using poll() registers the process with the kernel wait queue. The Linux scheduler puts the process to sleep (0% CPU) and wakes it up immediately when the interrupt occurs.'
              },
              {
                q: 'Why must we use copy_to_user() instead of standard memcpy()?',
                a: 'Kernel space and userspace have separated virtual address spaces protected by the hardware MMU. Direct pointer dereferencing with memcpy() could trigger a kernel panic if the address is invalid or swapped out. copy_to_user checks access_ok and handles page faults gracefully.'
              },
              {
                q: 'How does your Vernacular Alias search work without paid APIs?',
                a: 'We built an in-memory normalized inverted index with transliteration keys (e.g. "tej patta", "tejpatta", "तेज पत्ता", "ତେଜପତ୍ର") mapping directly to canonical product IDs, delivering sub-millisecond offline lookups.'
              }
            ].map((qa, idx) => (
              <div key={idx} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
                <div className="font-bold text-orange-400 mb-1">
                  Q{idx + 1}: {qa.q}
                </div>
                <div className="text-slate-300 leading-relaxed">
                  {qa.a}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
