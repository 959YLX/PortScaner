const METHODS = ['TCP-Connect', 'TCP-SYN', 'ICMP-Echo']
const MIN_PORT = 0
const MAX_PORT = 65535
const IP_PATTERN = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/
const AND_IP_NUMBER = 255

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
            result_view.startNewScan()

            if (method != 2) {
                for (let i = start_scan_number; i <= end_scan_number; i++) {
                    let temp_ip = translateNumberToIp(i)
                    let close = (i === end_scan_number)
                    startScan(temp_ip, start_port, end_port, method, (start, result) => {
                        result_view.setScanResult(result[0], start, result[1], result[2])
                        if (close) {
                            loading.show_loading = false
                        }
                    })
                }
            } else {
                startScan(translateNumberToIp(start_scan_number), start_scan_number, end_scan_number, method, (start, result) => {
                    result_view.setIpScanRestlt(start, result[1], result[2])
                    loading.show_loading = false
                })
            }
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
