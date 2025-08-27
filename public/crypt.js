// Node.js program to demonstrate the	
// crypto.createHmac() method

// Includes crypto module
const crypto = require('crypto');
const utf8 = require('utf8');

// Defining key
const secret = '005@303Vgc26vI5153QD6^73672145~h';

body = {"exchange_code": "NSE","from_date": "2022-01-25T04:00:00.000Z","to_date": "2022-01-27T04:00:00.000Z","underlying": "","portfolio_type": ""}

body = JSON.stringify(body)

var payload_for_checksum =body.replace(/("[^"]+"[:,])/g, "$1 ");

console.log("payload for checksum " +payload_for_checksum);

let d = new Date();
	let current_date = d.toISOString().substring(0,19)+  '.000Z';

console.log("current_date  " +current_date );
console.log("payload_for_checksum " +payload_for_checksum);

// Calling createHmac method
const hash = crypto.//createHmac('sha256', '005@303Vgc26vI5153QD6^73672145~h')
			createHash('sha256')		
				// updating data
				.update(utf8.encode(current_date+payload_for_checksum+secret))

				// Encoding to be used
				.digest('hex');

// Displays output
console.log("hash: "+hash);
