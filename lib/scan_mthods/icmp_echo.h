//
// Created by ylx on 2017/11/2.
//


#ifndef LIB_ICMP_ECHO_H
#define LIB_ICMP_ECHO_H

#include <stdbool.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <stdlib.h>
#include <memory.h>
#include <netinet/ip.h>
#include <netinet/ip_icmp.h>
#include <unistd.h>
#include <sys/time.h>
#include <stdio.h>
#include <errno.h>

#define ICMP_PACKAGE_SIZE 64
#define ICMP_RECEIVE_SIZE 1024
#define TIMEOUT 2

bool* scan_ip_by_icmp(u_int32_t, u_int32_t);

#endif //LIB_ICMP_ECHO_H
