let ipcRenderer = require('electron').ipcRenderer
let ffi = require('ffi')
let scan_port_c_api = ffi.Library(`${__dirname}/lib/cmake-build-debug/libport_scan_shared.dylib`, {
    'scan_port': ['pointer', ['string', 'int', 'int', 'int']],
    'scan_ip': ['pointer', ['uint32', 'uint32']]
})

/*
 * 当扫描端口时args[0]表示IP地址,args[1]表示起始端口号,args[2]表示结束端口号,args[3]表示扫描方法
 * 当使用ICMP-ECHO扫描IP地址时,args[0]表示IP地址,args[1]表示起始IP地址的32位数值表示,
 * args[2]表示结束IP地址的32位数值表示,args[3]表示扫描方法
*/
ipcRenderer.on('start_scan', (event, args) => {
    let ip = args[0]
    let openArray = []
    let closeArray = []
    let start = args[1]
    let end = args[2]
    let scan_result
    if (start < 0) {
        return
    }
    if (args[3] === 2) {
        scan_result = scan_port_c_api.scan_ip(start, end)
    }else {
        scan_result = scan_port_c_api.scan_port(ip, start, end, args[3])
    }
    if (!scan_result.isNull()) {
        console.log(scan_result)
        scan_result = scan_result.reinterpret(end - start + 1)
        console.log(scan_result)
        scan_result.forEach((val, index) => {
            if (val === 1) {
                openArray.push(index)
            }else {
                closeArray.push(index)
            }
        })
        ipcRenderer.send('finish_scan', [true, [ip, start, openArray, closeArray], scan_result])
    }else {
        ipcRenderer.send('finish_scan', [false, null])
    }
})
