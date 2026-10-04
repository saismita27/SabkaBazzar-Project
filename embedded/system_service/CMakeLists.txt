cmake_minimum_required(VERSION 3.10)
project(SabkaBazzarEmbeddedServices CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wall -Wextra -pthread")

# Target 1: Kiosk Help Event Listener & Hardware/Software Simulator
add_executable(sabka_help_simulator sabka_help_simulator.cpp)

# Target 2: Background Order Lifecycle Worker
add_executable(order_worker order_worker.cpp)

# Install rules
install(TARGETS sabka_help_simulator order_worker DESTINATION /usr/local/bin)
