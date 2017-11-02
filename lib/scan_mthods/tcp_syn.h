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
#include <stdlib.h>
#include <netinet/ip.h>
#include <stdio.h>
#include <netinet/if_ether.h>

typedef struct __PSD_HEADER {
    unsigned long saddr; //源地址
    unsigned long daddr; //目的地址
    char mbz;//置空
    char ptcl; //协议类型
    unsigned short tcpl; //TCP长度
} psd_header;


bool scan_syn(char *, int);

#endif //LIB_TCP_SYN_H
