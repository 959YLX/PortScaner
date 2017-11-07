const METHODS = ['TCP-Connect', 'TCP-SYN', 'ICMP-Echo']
const MIN_PORT = 0
const MAX_PORT = 65535
const IP_PATTERN = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/
const AND_IP_NUMBER = 255

const WORKING_PROCESS_COUNT = 4

Vue.component('my-option', {
    template: '\
    <option :value="index">{{method}}</option>',
    props: ['method', 'index']
})

var action_bar = new Vue({
    el: '#action-bar',
    data: {
        ip: '',
        start: '',
        end: '',
        methods: METHODS
    },
    methods: {
        scan() {
            let scan_ip = this.ip.split('-')
            let start_port = parseInt(this.start)
            let end_port = parseInt(this.end)
            let method = parseInt($('#method-select')[0].value)
            if (scan_ip.length > 2 || (method != 2 && (isNaN(start_port) || isNaN(end_port) || (!(start_port >= 0 && start_port <= end_port && end_port < 65536))))) {
                console.log("Port Error");
                return
            }
            scan_ip = scan_ip.map((ip) => { return ip.trim() })
            if (!scan_ip.every((ip) => { return ip.search(IP_PATTERN) === 0 })) {
                console.log("IP Error");
                return
            }

            let start_scan_number = translateIpToNumber(scan_ip[0])
            let end_scan_number = scan_ip[1] == null ? start_scan_number : translateIpToNumber(scan_ip[1])

            loading.show_loading = true

            let total = 0
            if (method != 2) {
                total = (end_scan_number - start_scan_number + 1) * (end_port - start_port + 1)
            }else {
                total = end_scan_number - start_scan_number + 1
            }

            result_view.startNewScan(total)

            let taskList = createScanTask(start_scan_number, end_scan_number, start_port, end_port, method);
            removeListener()
            // if (method != 2) {
            console.log(`task size = ${taskList.length}`)
            taskList.forEach((value, index) => {
                let ip_set = new Set()
                value.forEach((task) => {
                    ip_set.add(task[0])
                })
                multiProcessScan(Array.from(ip_set), value, (result) => {
                    if (method != 2){
                        result_view.setScanResult(result[0], result[1], result[2], result[3])
                    }else{
                        result_view.setIpScanRestlt(result[1], result[2], result[3])
                    }
                    // if (index === taskList.length - 1) {
                    //     loading.show_loading = false
                    // }
                })
            })
            // }

            // if (method != 2) {
            //     for (let i = start_scan_number; i <= end_scan_number; i++) {
            //         let temp_ip = translateNumberToIp(i)
            //         let close = (i === end_scan_number)
            //         startScan(temp_ip, start_port, end_port, method, (start, result) => {
            //             result_view.setScanResult(result[0], start, result[1], result[2])
            //             if (close) {
            //                 loading.show_loading = false
            //             }
            //         })
            //     }
            // } else {
            //     startScan(translateNumberToIp(start_scan_number), start_scan_number, end_scan_number, method, (start, result) => {
            //         result_view.setIpScanRestlt(start, result[1], result[2])
            //         loading.show_loading = false
            //     })
            // }
        }
    }
})

function translateIpToNumber(ip) {
    let parttern = ip.split('.');
    let ip_num = 0
    parttern.forEach((value, index) => {
        ip_num += (parseInt(value) << ((3 - index) * 8))
    })
    return ip_num
}

function translateNumberToIp(number) {
    let ip = ''
    let temp
    for (let i = 0; i < 4; i++) {
        temp = (number & (AND_IP_NUMBER << ((3 - i) * 8))) >>> ((3 - i) * 8)
        ip = ip.concat(`${temp}.`)
    }
    return ip.substr(0, ip.length - 1)
}

function createScanTask(startIp, endIp, startPort, endPort, scanMethod) {
    let args = []
    if (scanMethod != 2) {
        let total_ip = endIp - startIp + 1
        let ground = parseInt(total_ip / WORKING_PROCESS_COUNT)
        let curren_ip = startIp
        for (let i = 0; i < ground; i++) {
            let ground_task = []
            for (let j = 0; j < WORKING_PROCESS_COUNT; j++) {
                ground_task[j] = [translateNumberToIp(curren_ip), startPort, endPort, scanMethod]
                curren_ip += 1
            }
            args.push(ground_task)
        }
        let remain_ip = endIp - curren_ip + 1
        if (remain_ip != 0) {
            if (remain_ip > (WORKING_PROCESS_COUNT / 2)) {
                let destination = remain_ip - parseInt((WORKING_PROCESS_COUNT / 2))
                args.push(calculateTask(startPort, endPort, curren_ip, destination, startIp, endIp, scanMethod))
                curren_ip += destination
                remain_ip -= destination
            }
            args.push(calculateTask(startPort, endPort, curren_ip, remain_ip, startIp, endIp, scanMethod))
        }
    } else {
        //IP扫描
        let task = []
        let count = parseInt((endIp - startIp + 1) / WORKING_PROCESS_COUNT) + 1
        for (let i = 0; i < WORKING_PROCESS_COUNT; i++) {
            let start = (i * count) + startIp
            start = start > endIp ? -1 : start
            let end = start + count - 1
            end = end > endIp ? endIp : end
            task.push([translateNumberToIp(start), start, end, scanMethod])
        }
        args.push(task)
    }
    return args
}

function calculateTask(startPort, endPort, curren_ip, remain_ip, startIp, endIp, scanMethod) {
    let count = parseInt((remain_ip * (endPort - startPort + 1)) / WORKING_PROCESS_COUNT)
    let task = []
    for (let i = 0; i < remain_ip; i++) {
        let remain_groung = parseInt(WORKING_PROCESS_COUNT / remain_ip)
        for (let j = 0; j < remain_groung; j++) {
            let start = startPort + (j * count)
            if (j != remain_groung - 1){
                task.push([translateNumberToIp(curren_ip + i), start, start + count - 1, scanMethod])
            } else {
                task.push([translateNumberToIp(curren_ip + i), start, endPort, scanMethod])
            }
        }
    }
    return task
}
