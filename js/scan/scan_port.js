const ipcRenderer = require('electron').ipcRenderer
const ffi = require('ffi')
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
    if (args[3] === 2) {
        console.log("ip scan");
        scan_result = scan_port_c_api.scan_ip(start, end)
    }else {
        scan_result = scan_port_c_api.scan_port(ip, start, end, args[3])
    }
    if (!scan_result.isNull()) {
        scan_result = scan_result.reinterpret(end - start + 1)
        scan_result.forEach((val, index) => {
            if (val === 0) {
                closeArray.push(index)
            }else {
                openArray.push(index)
            }
        })
        console.log(`scan ip finish: ${ip}`);
        ipcRenderer.send('finish_scan', [true, [ip, openArray, closeArray]])
    }else {
        ipcRenderer.send('finish_scan', [false, null])
    }
})
