var result;

function startScan(ips, ports, method, callback){
    let res = scan.scan_port('127.0.0.1', 70, 85, 0)
    console.log(res)
    result = res
    if (res.isNull()) {
        console.log('res is null');
    }
}

var ffi = require('ffi')
var scan = ffi.Library(`${__dirname}/lib/cmake-build-debug/libport_scan_shared.dylib`, {
    'scan_port': ['pointer', ['string', 'int', 'int', 'int']]
})
