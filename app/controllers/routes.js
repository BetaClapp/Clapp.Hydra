function initialize(app, express){
	// REGULAR ROUTES
		
	// API ROUTES -------------------
	
	// get an instance of the router for api routes
	var apiRoutes = express.Router(); 
		
	// route to show a random message (GET http://localhost:8080/api/)
	apiRoutes.get('/', function(req, res) {
		res.json({ message: 'Welcome to the coolest API on earth!' });
	});
	
	// apply the routes to our application with the prefix /api
	app.use('/api', apiRoutes);
}

exports.initialize = initialize;