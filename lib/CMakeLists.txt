cmake_minimum_required(VERSION 3.8)
project(lib)

set(CMAKE_C_STANDARD 11)

set(SOURCE_FILES scaner.c scaner.h scan_mthods/tcp_connect.c scan_mthods/tcp_connect.h scan_mthods/tcp_syn.c scan_mthods/tcp_syn.h scan_mthods/icmp_echo.c scan_mthods/icmp_echo.h)
add_library(port_scan_shared SHARED ${SOURCE_FILES})
add_library(port_scan_static STATIC ${SOURCE_FILES})