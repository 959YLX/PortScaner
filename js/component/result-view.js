const FILE_PATH = 'scan_result.csv'

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
        table_header: ['IP地址', '端口号'],
        openPortResultSet: [],
        closePortResultSet: []
    },
    methods: {
        setScanResult(ip, start_port, openPort, closePort) {
            console.log("ip = " + ip);
            openPort.forEach((val) => {
                this.openPortResultSet.push([ip, val + start_port])
            })
            closePort.forEach((val) => {
                this.closePortResultSet.push([ip, val + start_port])
            })
        },
        setIpScanRestlt() {
            
        },
        startNewScan() {
            this.openPortResultSet = []
            this.closePortResultSet = []
        },
        exportResult() {
            if (this.openPortResultSet.length != 0 && this.closePortResultSet.length != 0) {
                ipcRenderer.on('save_finish', (event, args) => {
                    if (args) {
                        console.log("Error");
                    }else {
                        console.log("Success");
                    }
                })
                ipcRenderer.send('save', [FILE_PATH, createCSVContain(this.openPortResultSet, this.closePortResultSet)])
            }
        }
    },
    computed: {
        openPortNumber() {
            return this.openPortResultSet.length
        },
        closePortNumber() {
            return this.closePortResultSet.length
        }
    }
})

function createCSVContain(openPort, closePort) {
    let result = "开放端口,关闭端口\n"
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
        left = open == null ? "" : open[1]
        right = close == null ? "" : close[1]
        result = result.concat(`${left},${right}\n`)
        index++
    }
    return result
}
