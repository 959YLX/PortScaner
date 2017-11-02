//
// Created by ylx on 2017/10/24.
//

#include "tcp_syn.h"

const char* LOCAL_IP = "127.0.0.1";
const int LOCAL_PORT = 60000;

u_short checksum(const u_short *buffer, u_short length);

bool scan_syn(char *ip, int port)
{
    int raw_tcp_socket_fd = socket(AF_INET, SOCK_RAW, IPPROTO_TCP);
    bool result = false;
    printf("Scan by syn fd = %d\n", raw_tcp_socket_fd);
    if (raw_tcp_socket_fd != -1) {
        struct sockaddr_in local_addr;
        memset(&local_addr, 0, sizeof(struct sockaddr_in));
        local_addr.sin_addr.s_addr = inet_addr(LOCAL_IP);
        local_addr.sin_port = LOCAL_PORT;
        local_addr.sin_family = AF_SYSTEM;
//        bind(recv_fd, (struct sockaddr *) &local_addr, sizeof(struct sockaddr_in));
        struct sockaddr_in scan_address, rece_addr;
        memset(&scan_address, 0, sizeof(struct sockaddr_in));
        scan_address.sin_family = AF_INET;
        scan_address.sin_addr.s_addr = inet_addr(ip);
        scan_address.sin_port = htons(port);
        memcpy(&rece_addr, &scan_address, sizeof(struct sockaddr_in));
        rece_addr.sin_family = AF_SYSTEM;
//        connect(recv_fd, (struct sockaddr *) &rece_addr, sizeof(struct sockaddr_in));
        struct tcphdr tcp_head;
        memset(&tcp_head, 0, sizeof(struct tcphdr));
        tcp_head.th_sport = htons(LOCAL_PORT);
        tcp_head.th_dport = htons(port);
        tcp_head.th_seq = htons(0);
        tcp_head.th_ack = 0;
        tcp_head.th_flags = (TH_SYN);
        tcp_head.th_win = htons(65535);
        tcp_head.th_off = (int)(sizeof(struct tcphdr) / 4);
        psd_header psd;
        psd.saddr = inet_addr(LOCAL_IP);
        psd.daddr = inet_addr(ip);
        psd.ptcl = 6;
        psd.tcpl = sizeof(tcp_head);
        char *buffer = (char *)malloc(sizeof(struct tcphdr));
        char *temp = malloc(sizeof(struct tcphdr) + sizeof(psd_header));
        memcpy(temp, &psd, sizeof(psd_header));
        memcpy(temp + sizeof(psd_header), buffer, sizeof(struct tcphdr));
        u_short check_sum = checksum((const u_short *) temp, sizeof(struct tcphdr) + sizeof(psd_header));
        tcp_head.th_sum = check_sum;
        memcpy(buffer, &tcp_head, sizeof(struct tcphdr));
        ssize_t send_result = sendto(raw_tcp_socket_fd, buffer, sizeof(struct tcphdr), 0,
                                     (struct sockaddr *) &scan_address, sizeof(struct sockaddr_in));
        printf("Package is Send\n");
        free(buffer);
        if (send_result > 0) {
            // Send OK
            printf("Send OK \n");
            ssize_t buffer_size = sizeof(struct tcphdr);
            ssize_t sock_addr_size = sizeof(struct sockaddr_in);
            buffer = (char *)malloc((size_t) buffer_size);
            printf("Wait for receive\n");
//            int receive_size = (int) recv(raw_tcp_socket_fd, buffer, (size_t) buffer_size, 0);
//            ssize_t receive_size = 0;
            int receive_size = (int) recvfrom(raw_tcp_socket_fd, buffer, (size_t) buffer_size, 0, (struct sockaddr *)&scan_address,
                                              (socklen_t *) &sock_addr_size);
            printf("receive = %d\n", receive_size);
            if (receive_size > 0) {
                printf("Receive Success\n");
                struct tcphdr *rec_tcp_head = (struct tcphdr *)buffer;
                printf("%d %d %d\n",rec_tcp_head->th_sport, rec_tcp_head->th_dport, rec_tcp_head->th_flags);
                if ((rec_tcp_head->th_flags & TH_ACK)== TH_ACK) {
                    printf("Accept ACK\n");
                    result = true;
                }
            }
            free(buffer);
        }

        close(raw_tcp_socket_fd);
    }
    return result;
}

u_short checksum(const u_short *buffer, u_short length){
    unsigned long check_sum = 0;
    u_short size = length;
    while(size>1)
    {
        check_sum += *buffer++;
        size -= sizeof(u_short);
    }
    if(size)
    {
        check_sum += *(u_char *)buffer;
    }
    check_sum = (check_sum >> 16) + (check_sum & 0xffff);  //将高16bit与低16bit相加
    check_sum += (check_sum >> 16);             //将进位到高位的16bit与低16bit 再相加
    return (u_short) (~check_sum);
}