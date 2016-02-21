function initialize(io, ioClient, globals, noble){
	var kerberos = null;
	var myKerberosId = null;
    
    /// Starting noble
    noble.on('stateChange', function (state) {
        console.log('Noble library report Bluetooth state: ' + state);
        if (state === 'poweredOn') {            
                noble.startScanning();
            } else {
                noble.stopScanning();
            }
    });
    
    /// When a beacon is discovered
    noble.on('discover', function(peripheral) {
        peripheral.connect(function(error) {
            console.log('connected to peripheral: ' + peripheral.uuid);
            
            globals.Beacons.push(peripheral.uuid);

            peripheral.disconnect(function(error) {
            console.log('disconnected from peripheral: ' + peripheral.uuid);
            });
        });
    }); 

	
	if(globals.Kerberos != undefined && globals.Kerberos.length > 0)
		kerberos = ioClient.connect(globals.Kerberos);
		
	kerberos.on('connect', function(){
		console.log('Connected to Kerberos');
	});
	
	kerberos.on('disconnect', function(){
		console.log('Kerberos is offline');
	});
	
	kerberos.on('Welcome', function(data){
		myKerberosId = data.SocketId;
	});
	
	kerberos.on('youRConnected?', function(){
		kerberos.emit('ImConnected', {KerberosId : myKerberosId});
	});
    
    kerberos.on('Clapp.Kerberos.Message', function(data){
        kerberosMessageHub(data);
    })
	
	io.sockets.on('connection', function(socket){     

		console.log('-' + socket.id);
	
		/// Welcome to the new client
		socket.emit('Welcome', {SocketId : socket.id});
				
		/* 
		================
		Local functions 
		*/
		
		/// Emit all cranes
		function sendHydraMessage(){			
			socket.emit('Clapp.Hydra.Message', {Command : 'HydraCommand', Values : 1});
		}
		
		/* 
		================
		Socket Intervals
		*/
		/// Emit every 5 seconds cranes
		setInterval(sendHydraMessage, 5000);
	
		/* 
		================
		Templates for Socket.io
		*/
		/// Template for socket event
		//socket.on('', function(data){
		//  io.sockets.emit('Name', data);
		// socket.emit('ID', {Command: 'CommandID', Values:[{ID: socket.id}]});
		//});
	
	});
		
	console.log('Socket.io initialized');
    
    function kerberosMessageHub(data){
        console.log('Kerberos catched: Clapp.Kerberos.Message');
        var values = data.Values;
        var command = data.Command;
        switch(command) {
            case "GiveYourHydraInformation":
                console.log(globals.HydraUUID);
                kerberos.emit('Clapp.Hydra.Information', {HydraSettings : globals.HydraSettings});
                break;
            case "GiveYourAllInformation":
                if(values.UUID == globals.HydraSettings.UUID){
                    kerberos.emit('Clapp.Hydra.Message', {Command: 'ThisIsMyOwnHydraInformation', Values : { HydraInformation : globals.HydraSettings, Beacons: globals.Beacons}});
                }
        }
    }
}

exports.initialize = initialize;