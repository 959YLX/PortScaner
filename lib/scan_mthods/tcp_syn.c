//
// Created by ylx on 2017/10/24.
//

#include "tcp_syn.h"

bool scan_syn(char *ip, int port)
{
    int raw_tcp_socket_fd = socket(AF_INET, SOCK_RAW, IPPROTO_TCP);
    return false;
}