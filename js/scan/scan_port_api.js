var ipcRenderer = require('electron').ipcRenderer

const SCAN_METHOD = {
    SCAN_BY_TCP_CONNECT: 0,
    SCAN_BY_TCP_SYN: 1,
    SCAN_BY_ICMP_ECHO: 2
}

function startScan(ip, start, end, method, callback){
    loading.show_loading = true
    ipcRenderer.on('finish_scan', (event, args) => {
        if (args[0]) {
            callback(start, args[1])
        }else{
            console.log("Scan Error");
        }
    })
    ipcRenderer.send('start_scan', [ip, start, end, method])
}
