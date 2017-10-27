const METHODS = ['TCP-Connect', 'TCP-SYN', 'ICMP-Echo']
const MIN_PORT = 0
const MAX_PORT = 65535
const IP_PATTERN = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/

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
            let scan_ip = this.ip
            let start_port = parseInt(this.start)
            let end_port = parseInt(this.end)
            let method = parseInt($('#method-select')[0].value)
            if (isNaN(start_port) || isNaN(end_port) || (!(start_port >= 0 && start_port <= end_port && end_port < 65536))) {
                //PORT Error
                console.log("Port Error");
                return
            }
            if (scan_ip.search(IP_PATTERN) != 0) {
                //IP Error
                console.log("IP Error");
                return
            }
            startScan(scan_ip, parseInt(this.start), parseInt(this.end), method, (start, result) => {
                result_view.setScanResult(start, result[0], result[1])
                loading.show_loading = false
            })
        }
    }
})
