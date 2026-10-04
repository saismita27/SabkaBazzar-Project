/**
 * @file order_worker.cpp
 * @brief C++ Background Order Lifecycle Worker Daemon
 * @author Final-Year B.Tech CSIT Student & Mentor
 * 
 * Demonstrates:
 * 1. Threads and thread synchronization (std::thread, std::mutex, std::condition_variable)
 * 2. Order status state machine enforcement
 * 3. Synchronous signal waiting (SIGINT, SIGTERM)
 * Standalone console simulation: no database or browser integration.
 */

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <queue>
#include <chrono>
#include <thread>
#include <mutex>
#include <condition_variable>
#include <atomic>
#include <csignal>
#include <pthread.h>
#include <map>

enum class OrderState {
    PLACED,
    CONFIRMED,
    PACKED,
    SHIPPED,
    OUT_FOR_DELIVERY,
    DELIVERED,
    CANCELLED
};

std::string state_to_string(OrderState s) {
    switch(s) {
        case OrderState::PLACED: return "Placed";
        case OrderState::CONFIRMED: return "Confirmed";
        case OrderState::PACKED: return "Packed";
        case OrderState::SHIPPED: return "Shipped";
        case OrderState::OUT_FOR_DELIVERY: return "Out for Delivery";
        case OrderState::DELIVERED: return "Delivered";
        case OrderState::CANCELLED: return "Cancelled";
    }
    return "Unknown";
}

struct OrderTask {
    std::string order_id;
    std::string customer_name;
    OrderState  current_state;
    double      amount;
};

static std::atomic<bool> g_worker_active(true);
static std::mutex g_queue_mutex;
static std::condition_variable g_queue_cv;
static std::queue<OrderTask> g_order_queue;

void order_processing_loop(int thread_id) {
    std::cout << "[WORKER THREAD #" << thread_id << "] Spawned and waiting for order jobs...\n";

    while (g_worker_active) {
        OrderTask task;
        {
            std::unique_lock<std::mutex> lock(g_queue_mutex);
            g_queue_cv.wait_for(lock, std::chrono::milliseconds(500), [] {
                return !g_order_queue.empty() || !g_worker_active;
            });

            if (!g_worker_active && g_order_queue.empty()) {
                break;
            }

            if (g_order_queue.empty()) {
                continue;
            }

            task = g_order_queue.front();
            g_order_queue.pop();
        }

        std::cout << "\n[WORKER #" << thread_id << "] Processing Order: " << task.order_id 
                  << " (" << task.customer_name << ", ₹" << task.amount << ")\n";

        // State Machine advancement
        OrderState states[] = {
            OrderState::CONFIRMED, 
            OrderState::PACKED, 
            OrderState::SHIPPED, 
            OrderState::OUT_FOR_DELIVERY, 
            OrderState::DELIVERED
        };

        for (OrderState next_state : states) {
            if (!g_worker_active) break;
            std::this_thread::sleep_for(std::chrono::milliseconds(800)); // Simulated logistics transit
            task.current_state = next_state;
            std::cout << "  ↳ Order " << task.order_id << " status -> " << state_to_string(next_state) << "\n";
        }
    }

    std::cout << "[WORKER THREAD #" << thread_id << "] Terminated cleanly.\n";
}

int main() {
    std::cout << "========================================================\n";
    std::cout << "  SABKA BAZZAR — C++ ORDER STATUS WORKER SERVICE        \n";
    std::cout << "========================================================\n";

    sigset_t signals;
    sigemptyset(&signals);
    sigaddset(&signals, SIGINT);
    sigaddset(&signals, SIGTERM);
    if (pthread_sigmask(SIG_BLOCK, &signals, nullptr) != 0) return 1;

    // Spawn 2 worker threads
    std::thread t1(order_processing_loop, 1);
    std::thread t2(order_processing_loop, 2);

    // Enqueue simulated sample orders
    {
        std::lock_guard<std::mutex> lock(g_queue_mutex);
        g_order_queue.push({"ORD-2026-901", "Aarav Sharma", OrderState::PLACED, 1250.00});
        g_order_queue.push({"ORD-2026-902", "Priyanka Mohapatra", OrderState::PLACED, 3499.00});
    }
    g_queue_cv.notify_all();

    std::cout << "[MAIN] Dispatched 2 orders into worker queue.\n";

    int received = 0;
    const int signal_result = sigwait(&signals, &received);
    std::cout << "[MAIN] Stopping worker threads. Signal: " << received << '\n';
    g_worker_active = false;
    g_queue_cv.notify_all();
    t1.join();
    t2.join();

    std::cout << "[MAIN] All worker threads joined. Process finished.\n";
    return signal_result == 0 ? 0 : 1;
}
