cmake_minimum_required(VERSION 3.22.1)
project("onecore_engine")

add_library(onecore_engine SHARED
            onecore_main.cpp
            memory_utils.cpp
            pattern_scanner.cpp)

find_library(log-lib log)

target_link_libraries(onecore_engine ${log-lib})
