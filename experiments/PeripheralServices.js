var noble = require('noble');

noble.on('stateChange', function (state) {
    // Posible state values:
    //  * "unknown", 
    //  * "resetting", 
    //  * "unsupported", 
    //  * "unauthorized", 
    //  * "poweredOff", 
    //  * "poweredOn"
    if (state === 'poweredOn') {
            noble.startScanning();
        } else {
            noble.stopScanning();
        }
});


noble.on('discover', function(peripheral) {
  peripheral.connect(function(error) {
    console.log('connected to peripheral: ' + peripheral.uuid);
    peripheral.discoverServices(null, function(error, services) {
      console.log('discovered the following services:');
      for (var i in services) {
        console.log('  ' + i + ' uuid: ' + services[i].uuid);
      }
    });
  });
});