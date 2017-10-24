//
// Created by ylx on 2017/10/24.
//

#ifndef LIB_TCP_SYN_H
#define LIB_TCP_SYN_H

#include <stdbool.h>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <sys/types.h>
#include <netinet/in.h>
#include <netinet/tcp.h>
#include <memory.h>
#include <unistd.h>

bool scan_syn(char *, int);

#endif //LIB_TCP_SYN_H
