//
// Created by ylx on 2017/11/2.
//

#include "icmp_echo.h"

u_int16_t icmp_checksum(struct icmp *);

bool* scan_ip_by_icmp(u_int32_t start, u_int32_t end) {
    const int length = end - start;
    char *receive_buffer = malloc(ICMP_RECEIVE_SIZE);
    bool *result = malloc(sizeof(bool) * length);
    memset(result, false, length * sizeof(bool));
    int sock_fd = socket(PF_INET, SOCK_RAW, IPPROTO_ICMP);
    if (sock_fd < 0) {
        return result;
    }
    struct timeval timeout;
    timeout.tv_usec = 0;
    timeout.tv_sec = TIMEOUT;
    if (setsockopt(sock_fd, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(struct timeval)) < 0) {
        return result;
    }
    struct icmp *ICMP_Package = (struct icmp *)malloc(ICMP_PACKAGE_SIZE);
    memset(ICMP_Package, 0, ICMP_PACKAGE_SIZE);
    ICMP_Package->icmp_type = ICMP_ECHO;
    ICMP_Package->icmp_code = 0;
    ICMP_Package->icmp_cksum = 0;
    ICMP_Package->icmp_id = (n_short) getpid();
    ICMP_Package->icmp_seq = 0;
    struct timeval *time = (struct timeval *)ICMP_Package->icmp_data;
    gettimeofday(time, NULL);
    ICMP_Package->icmp_cksum = icmp_checksum(ICMP_Package);
    struct sockaddr_in destination;
    ssize_t destination_size = sizeof(struct sockaddr_in);
    memset(&destination, 0, destination_size);
    for (u_int32_t ip = start; ip <= end; ++ip) {
        printf("scan ip = %d\n", ip);
        destination.sin_addr.s_addr = htonl(ip);
        sendto(sock_fd, ICMP_Package, ICMP_PACKAGE_SIZE, MSG_WAITALL, (const struct sockaddr *) &destination, destination_size);
        if (recvfrom(sock_fd, receive_buffer, ICMP_RECEIVE_SIZE, 0, (struct sockaddr *) &destination,
                     (socklen_t *) &destination_size) > 0) {
            result[ip - start] = true;
        }
    }
    return result;
}

u_int16_t icmp_checksum(struct icmp *package)
{
    u_int16_t *data = (u_int16_t *)package;
    int len = ICMP_PACKAGE_SIZE;
    u_int32_t sum = 0;
    while (len > 1)
    {
        sum += *data++;
        len -= 2;
    }
    if (1 == len)
    {
        u_int16_t tmp = *data;
        tmp &= 0xff00;
        sum += tmp;
    }
    sum = (sum >> 16) + (sum & 0x0000ffff);
    sum += sum >> 16;
    return (u_int16_t) (~sum);
}