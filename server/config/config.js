// When you require a json it is automatically parsed into a javascript object
var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
	var config = require('./config.json');
	// You need to use the bracket notation when accessing properties through variables
	var envConfig = config[env];
	// Object.keys takes an object and returns its properties as an array 
	Object.keys(envConfig).forEach((key) => {
		process.env[key] = envConfig[key];
	});
	// console.log(Object.keys(envConfig));
	// console.log(config);
}
