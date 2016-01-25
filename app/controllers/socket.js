function initialize(io, ioClient, globals){
	var kerberos = null;
	var myKerberosId = null;
	
	//if(globals.Kerberos != undefined && globals.Kerberos.length > 0)
		kerberos = ioClient.connect(globals.Kerberos);
		
	//console.log(kerberos);
	kerberos.on('connect', function(){
		console.log('Connected to Kerberos');
	});
	
	kerberos.on('Welcome', function(data){
		myKerberosId = data.SocketId;
	});
	
	kerberos.on('youRConnected?', function(){
		kerberos.emit('ImConnected', {KerberosId : myKerberosId});
	});
	
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
}

exports.initialize = initialize;