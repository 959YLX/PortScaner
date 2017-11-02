//
// Created by ylx on 2017/10/24.
//

#include <fcntl.h>
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

    struct timeval time;
    time.tv_sec = 1;
    time.tv_usec = 0;

    int status = fcntl(connect_fd, F_GETFL,0);
    fcntl(connect_fd, F_SETFL,(status | O_NONBLOCK));
    if (connect(connect_fd, (struct sockaddr *)&scan_address, sizeof(scan_address)) == 0) {
        result = true;
    }
    if (errno == EINPROGRESS) {
        fd_set wset, rset;
        __DARWIN_FD_ZERO(&wset);
        __DARWIN_FD_ZERO(&rset);
        __DARWIN_FD_SET(connect_fd, &wset);
        __DARWIN_FD_SET(connect_fd, &rset);
        if (select(connect_fd + 1, &rset, &wset, NULL, &time) == 1) {
            if (__DARWIN_FD_ISSET(connect_fd, &wset)) {
                fcntl(connect_fd, F_SETFL, (status & ~O_NONBLOCK));
                result = true;
            }
        }
    }
    close(connect_fd);
    return result;
}
