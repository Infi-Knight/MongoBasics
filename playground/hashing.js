const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
	id: 5
}

// jwt.token() takes data to be hashed along with a salt and creates a token
var token = jwt.sign(data, '123abc');
console.log(token);

// verify your token
var decoded = jwt.verify(token, '123abc');
console.log(decoded);

// var message = 'Duos mas Duos egual a quartro';
// var hash = SHA256(message).toString();

// console.log(`message: `, message);
// console.log(`hash: `, hash);

// var data = {
// 	id: 4
// }

// // We will salt our hash so that the end user, even if he has access to the 
// // hash corresponding to the data can't trick us because salting the hash 
// // will create a hash that will be known only to us
// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }

// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(token.date)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
// 	console.log('DATA SECURE');
// } else {
// 	console.log('Data Insecure. Burn em all!!');
// }