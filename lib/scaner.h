#ifndef LIB_LIBRARY_H
#define LIB_LIBRARY_H

#define TCP_CONNECT 0
#define TCP_SYN 1

#define ERROR_MESSAGE "SCAN_METHOD_ERROR"

#include <stdbool.h>
#include <stdlib.h>
#include <stdio.h>

#include "scan_mthods/tcp_connect.h"
#include "scan_mthods/tcp_syn.h"
#include "scan_mthods/icmp_echo.h"

bool* scan_port(char *, int, int, int);

bool* scan_ip(u_int32_t, u_int32_t);

#endif