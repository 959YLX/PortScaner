//
// Created by ylx on 2017/11/2.
//

#include "icmp_echo.h"


typedef struct __IP_HEADER {
    uint8_t version;
    uint8_t service_filed;
    uint16_t length;
    uint16_t identification;
    uint8_t flat;
    uint8_t offset;
    uint8_t ttl;
    uint8_t protocol;
    uint16_t checksum;
    uint32_t source;
    uint32_t destination;
}header;

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
        destination.sin_addr.s_addr = htonl(ip);
        sendto(sock_fd, ICMP_Package, ICMP_PACKAGE_SIZE, 0, (const struct sockaddr *) &destination,
               (socklen_t) destination_size);
        memset(receive_buffer, 0, ICMP_RECEIVE_SIZE);
        if (recvfrom(sock_fd, receive_buffer, ICMP_RECEIVE_SIZE, MSG_WAITALL, (struct sockaddr *) &destination,
                     (socklen_t *) &destination_size) > 0) {
//            printf("receive from %d PID = %d socket = %d\n", ip, getpid(), sock_fd);
//            printf("------------START------------\n");
//            for (int i = 0; i < ICMP_RECEIVE_SIZE; ++i) {
//                printf("%x\t", receive_buffer[i]);
//            }
//            printf("------------END------------\n");
//
            header *ip_header = (header *) receive_buffer;
            if (htonl(ip_header->source) == ip) {
                result[ip - start] = true;
            }
//            printf("------------START------------\n");
//            printf("source = %d\n", htonl(ip_header->source));
//            printf("destination = %d\n", ip_header->destination);
//            printf("------------END------------\n");


        }
    }
    close(sock_fd);
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