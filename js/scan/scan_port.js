const ipcRenderer = require('electron').ipcRenderer
const ffi = require('ffi')
let scan_port_c_api = ffi.Library(`${__dirname}/lib/cmake-build-debug/libport_scan_shared.dylib`, {
    'scan_port': ['pointer', ['string', 'int', 'int', 'int']]
})

ipcRenderer.on('start_scan', (event, args) => {
    let openArray = []
    let closeArray = []
    let start = args[1]
    let end = args[2]
    let scan_result = scan_port_c_api.scan_port(args[0], start, end, args[3])
    if (!scan_result.isNull()) {
        scan_result = scan_result.reinterpret(end - start + 1)
        scan_result.forEach((val, index) => {
            if (val === 0) {
                closeArray.push(index)
            }else {
                openArray.push(index)
            }
        })
        ipcRenderer.send('finish_scan', [true, [openArray, closeArray]])
    }else {
        ipcRenderer.send('finish_scan', [false, null])
    }
})
