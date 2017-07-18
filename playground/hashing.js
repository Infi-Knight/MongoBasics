const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var password = '123abc!';

// Generate a salt using bcrypt algo. 
// The higher the number of rounds slow is the salt generation. This can be useful 
// to prevent the brute force attacks. 
// This salt generation is async function
// bcrypt.genSalt(10, (err, salt) => {
// 	// Now hash our data (password)
// 	bcrypt.hash(password, salt, (err, hash) => {
// 		console.log(hash);
// 	});
// });

var hashedPassword = '$2a$10$z92PN3J9ufvQVtY3.Dkn.ONOfbsRiz.4nKa5NrFMPjuNm0itGWP2O';
bcrypt.compare(password, hashedPassword, (err, result) => {
	console.log(result);
});


// var data = {
// 	id: 5
// }

// // jwt.token() takes data to be hashed along with a salt and creates a token
// var token = jwt.sign(data, '123abc');
// console.log(token);

// // verify your token
// var decoded = jwt.verify(token, '123abc');
// console.log(decoded);

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