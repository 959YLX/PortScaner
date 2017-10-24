#ifndef LIB_LIBRARY_H
#define LIB_LIBRARY_H

#define TCP_CONNECT 0
#define TCP_SYN 1
#define ICMP_ECHO 2

#define ERROR_MESSAGE "SCAN_METHOD_ERROR"

#include <stdbool.h>
#include <stdlib.h>
#include <stdio.h>

#include "scan_mthods/tcp_connect.h"
#include "scan_mthods/tcp_syn.h"
#include "scan_mthods/icmp_echo.h"

bool* scan_port(char* ip, int start_port, int end_port, int scan_method);

#endif