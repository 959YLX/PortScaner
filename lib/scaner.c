#include "scaner.h"

bool* scan_port(char* ip, int start_port, int end_port, int scan_method)
{
    bool* port_status = (bool*)malloc(sizeof(bool) * (end_port - start_port + 1));
    bool (*scan_function)(char *, int) = NULL;
    printf("Scan Method %d\n", scan_method);
    switch (scan_method) {
        case TCP_CONNECT: {
            scan_function = &scan_connect;
            break;
        }
        case TCP_SYN: {
            scan_function = &scan_function;
            break;
        }
        default: {
            perror(ERROR_MESSAGE);
            return port_status;
        }
    }
    if (scan_function != NULL){
        for (int port = start_port; port <= end_port; ++port) {
            port_status[port - start_port] = scan_function(ip, port);
        }
    }
    return port_status;
}

bool* scan_ip(u_int32_t start_ip, u_int32_t end_ip)
{
    printf("print in c\n");
    return scan_ip_by_icmp(start_ip, end_ip);
}


