//
// Created by ylx on 2017/10/24.
//

#include "tcp_connect.h"

bool scan_connect(char *ip, int port)
{
    bool result = false;
    int connect_fd = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);
    struct sockaddr_in scan_address;
    memset(&scan_address, 0, sizeof(struct sockaddr_in));
    scan_address.sin_family = AF_INET;
    scan_address.sin_addr.s_addr = inet_addr(ip);
    scan_address.sin_port = htons(port);
    if (connect(connect_fd, (struct sockaddr *)&scan_address, sizeof(scan_address)) == 0) {
        result = true;
        close(connect_fd);
    }
    return result;
}
