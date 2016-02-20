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
    peripheral.discoverServices(['1800'], function(error, services) {
      var deviceInformationService = services[0];
      console.log('discovered device information service');

      deviceInformationService.discoverCharacteristics(null, function(error, characteristics) {
        console.log('discovered the following characteristics:');
        for (var i in characteristics) {
          console.log('  ' + i + ' uuid: ' + characteristics[i].uuid);
        }
      });
    });
  });
});