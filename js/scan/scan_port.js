const ipcRenderer = require('electron').ipcRenderer
const ffi = require('ffi')
let scan_port_c_api = ffi.Library(`${__dirname}/lib/cmake-build-debug/libport_scan_shared.dylib`, {
    'scan_port': ['pointer', ['string', 'int', 'int', 'int']]
})

ipcRenderer.on('start_scan', (event, args) => {
    let start = args[1]
    let end = args[2]
    let scan_result = scan_port_c_api.scan_port(args[0], start, end, args[3])
    if (!scan_result.isNull()) {
        ipcRenderer.send('finish_scan', [true, scan_result.reinterpret(end - start + 1)])
    }else {
        ipcRenderer.send('finish_scan', [false, null])
    }
})
