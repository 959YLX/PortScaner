#include "scaner.h"


bool* scan_port(char* ip, int start_port, int end_port, int scan_method)
{
    bool* port_status = (bool*)malloc(sizeof(bool) * (end_port - start_port + 1));
    bool (*scan_function)(char *, int) = NULL;
    switch (scan_method) {
        case TCP_CONNECT: {
            scan_function = &scan_connect;
            break;
        }
        case TCP_SYN: {
            scan_function = &scan_syn;
            break;
        }
        case ICMP_ECHO: {
            scan_function = &scan_icmp;
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


