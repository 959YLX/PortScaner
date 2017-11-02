//
// Created by ylx on 2017/10/24.
//

#ifndef LIB_TCP_SCAN_H
#define LIB_TCP_SCAN_H

#include <stdbool.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <netinet/in.h>
#include <memory.h>
#include <unistd.h>
#include <sys/select.h>
#include <errno.h>

bool scan_connect(char *, int);

#endif //LIB_TCP_SCAN_H
