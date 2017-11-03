const FILE_PATH = 'scan_result.csv'

const OPEN_PORT_RESULT_TITLE = '开放端口'
const CLOSE_PORT_RESULT_TITLE = '关闭端口'
const EXIST_IP_TITLE = '开放IP'
const NOT_EXIST_IP_TITLE = '关闭IP'

const PORT_SCAN_TITLE = ['IP地址', '端口']
const IP_SCAN_TITLE = ['编号', 'IP地址']

Vue.component('table-header', {
    template: '\
        <tr>\
            <td v-for="(header, index) of headers" :key="index" class="text-center">{{header}}</td>\
        </tr>',
    props: ['headers']
})

Vue.component('table-body', {
    template: '\
        <tr>\
            <td v-for="(value, index) of items" :key="index" class="text-center">{{value}}</td>\
        </tr>',
    props: ['items']
})

Vue.component('table-component', {
    template: '\
    <table class="table table-hover table-striped">\
        <thead>\
            <tr is="table-header" :headers="tableHeader"></tr>\
        </thead>\
        <tbody>\
            <tr is="table-body" v-for="(result, index) in results" :key="index" :items="result"></tr>\
        </tbody>\
    </table>',
    props: ['tableHeader', 'resultSet'],
    data: function() {
        return {
            results: this.resultSet
        }
    },
    watch: {
        resultSet(val) {
            this.results = val
        }
    }
})

var result_view = new Vue({
    el: '#result-view',
    data: {
        table_header: null,
        openResultSet: [],
        closeResultSet: [],
        open: null,
        close: null,
        scan_port_type: true
    },
    methods: {
        setScanResult(ip, start_port, openPort, closePort) {
            this.open = `${OPEN_PORT_RESULT_TITLE}(${openPort.length}个)`
            this.close = `${CLOSE_PORT_RESULT_TITLE}(${closePort.length}个)`
            this.table_header = PORT_SCAN_TITLE
            openPort.forEach((val) => {
                this.openResultSet.push([ip, val + start_port])
            })
            closePort.forEach((val) => {
                this.closeResultSet.push([ip, val + start_port])
            })
            this.scan_port_type = true
        },
        setIpScanRestlt(start, open, close) {
            this.open = `${EXIST_IP_TITLE}(${open.length}个)`
            this.close = `${NOT_EXIST_IP_TITLE}(${close.length}个)`
            this.table_header = IP_SCAN_TITLE
            open.forEach((value, index) => {
                this.openResultSet.push([index + 1, translateNumberToIp(value + start)])
            })
            close.forEach((value, index) => {
                this.closeResultSet.push([index + 1, translateNumberToIp(value + start)])
            })
            this.scan_port_type = false
        },
        startNewScan() {
            this.openResultSet = []
            this.closeResultSet = []
        },
        exportResult() {
            if (this.openResultSet.length != 0 || this.closeResultSet.length != 0) {
                ipcRenderer.on('save_finish', (event, args) => {
                    if (args) {
                        console.log("Error");
                    }else {
                        console.log("Success");
                    }
                })
                ipcRenderer.send('save', [FILE_PATH, createCSVContain(this.scan_port_type, this.openResultSet, this.closeResultSet)])
            }
        }
    }
})

function createCSVContain(scan_port, openPort, closePort) {
    let result = scan_port ? `${OPEN_PORT_RESULT_TITLE},${CLOSE_PORT_RESULT_TITLE}\n` : `${EXIST_IP_TITLE}, ${NOT_EXIST_IP_TITLE}\n`
    let index = 0
    let open
    let close
    let left
    let right
    while (true) {
        open = openPort[index]
        close = closePort[index]
        if (open == null && close == null) {
            break
        }
        if (scan_port){
            left = (open == null ? "" : `${open[0]}:${open[1]}`)
            right = (close == null ? "" : `${close[0]}:${close[1]}`)
        }else {
            left = (open == null ? "" : open[1])
            right = (close == null ? "" : close[1])
        }
        result = result.concat(`${left},${right}\n`)
        index++
    }
    return result
}
