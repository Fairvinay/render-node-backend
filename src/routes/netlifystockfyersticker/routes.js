
const express = require('express');
const fyersExtra = require('extra-fyers');
//import queue from './queue.js';
//const  queue =  require('./queue.js'); // import queue from './queue.js';
 const InMemoryQueue = require('./queuecjs.cjs') ;
const router  = express.Router()
var path = require('path');
var ejs = require('ejs');
var fyersV3= require("fyers-api-v3");
const FyersSocket = require("fyers-api-v3").fyersDataSocket
//import { fyersDataSocket as FyersSocket } from "fyers-api-v3"
const FyersAPI =fyersV3.fyersModel

var fyersAPI = new FyersAPI()
var fyersModel= fyersV3.fyersModel
 // var fyersAPI =  new fyersModel({"path":"./","enableLogging":true}); // new require("fyers-api-v3").fyersModel();
	// var fyersAPI = new FyersAPI()
//var client_id= "7GSQW68AZ4-100"
var client_id= "TK2NQ6EYHR-100 "; // "7GSQW68AZ4-100" ; // PROD 
var secret_key = "RVMBOSEBMY"; 		 // "MGY8LRIY0M"; // PROD 
const queue = new InMemoryQueue();
var authcode=undefined;
var globalUserCheck=undefined;
var global_auth_code=undefined;
var globalTickerInterval = undefined;
var globalTickerFyersSocket = undefined;
var globlaTickerFyersSocketConnected = false;

var cnt = 0;

//var redirectUrl  = "https://192.168.1.8:56322/fyersauthcodeverify"
var redirectUrl  = "https://successrate.netlify.app/.netlify/functions/netlifystockfyersbridge/api/fyersauthcodeverify"
//var redirectUrl  = "https://store-stocks.netlify.app/.netlify/functions/netlifystockfyersbridge/api/fyersauthcodeverify"
var fyers= new fyersModel({"path":"./","enableLogging":true})
fyers.setAppId(client_id)

fyers.setRedirectUrl(redirectUrl)
var authcode='';
var global_auth_code ='';
var recentUserAuthCode = '';
var globalLogin = undefined;
let iterateObject = function*(obj) {
	for (let k in obj) yield [ k, obj[k] ];
  };
var URL=fyers.generateAuthCode()
	//use url to generate auth code
		console.log("FYERS URL " , URL) 

   
     // redirect_uri=https://192.168.1.8:56322/fyersauthcode&response_type=code&state=sample_state
	 var axios = require('axios');  // "secret_key":"MGY8LRIY0M",
const { isCallLikeExpression } = require('typescript');
	 var data = { "client_id":client_id, " redirect_uri":redirectUrl,
		"response_type":"code", "state":"sample_state"
	 };
	 var config = {
		 method: 'get',
		 url: " https://api-t1.fyers.in/api/v3/generate-authcode",
		 headers: { 'Content-Type': 'application/json' },
		 data : data
	 };
	 
function getFormattedTimeKey()  {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const hour = now.getHours().toString().padStart(2, '0');
  const min = now.getMinutes().toString().padStart(2, '0');
  const sec = now.getSeconds().toString().padStart(2, '0');
  const ms = now.getMilliseconds().toString().padStart(3, '0');
  return `${day}-${hour}-${min}-${sec}-${ms}`;
}

function formatDate(date) {
		const dateObj = new Date(date);
		return dateObj.toISOString().slice(0, 10);
	  }
//CORS HEADERS for localhost:4200 , localhost:3450, localhost:8888 
function setCORSHeaders( res ) { 
  // CHECK OBJECT is a HTTP Response with send method 
if( res !==null && res !==undefined && typeof(res.send ==='function')){
  
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
   res.setHeader("Access-Control-Allow-Methods", "*");
}
} 

function transformCandlesToTimeSeries(data, symbol = "SBET") {
  try {
    if (!data || data.s !== "ok" || !Array.isArray(data.candles)) {
      throw new Error("Invalid or missing candle data");
    }

    const timeSeries = {};
    let lastRefreshed = null;
 // Sort candles descending by timestamp (optional, to find latest easily)
    const sortedCandles = [...data.candles].sort((a, b) => b[0] - a[0]);
    for (const [ts, open, high, low, close, volume] of sortedCandles) {
      if (!ts || isNaN(open) || isNaN(close)) {
		console.log("issue parsing ",JSON.stringify(ts , open , high , low , close ,volume))
		continue;
	    }
      const dateStr = new Date(ts * 1000).toISOString().slice(0, 10); // YYYY-MM-DD
      if (!timeSeries[dateStr]) {
       timeSeries[dateStr] = {
        "1. open": open.toFixed(4),
        "2. high": high.toFixed(4),
        "3. low": low.toFixed(4),
        "4. close": close.toFixed(4),
        "5. volume": volume.toString()
       };
	 }
      if (!lastRefreshed || dateStr > lastRefreshed) {
        lastRefreshed = dateStr;
      }
    }

    return {
      "Meta Data": {
        "1. Information": "Daily Prices (open, high, low, close) and Volumes",
        "2. Symbol": symbol,
        "3. Last Refreshed": lastRefreshed || "N/A",
        "4. Output Size": "Compact",
        "5. Time Zone": "US/Eastern"
      },
      "Time Series (Daily)": timeSeries
    };
  } catch (err) {
    console.error("Error transforming candle data:", err.message);
    return {
      error: "Failed to transform candle data",
      reason: err.message
    };
  }
}


function convertToTimeSeries(data) {
		if (!data || !data.MarketQuote) return [];
	  
		const timeSeries = {};
        let metaData = null;
		
		 

	   data.MarketQuote.map(quote => {
		  const d = quote.MarketQuoteDetails;

			// Format date from timestamp
		    const date = new Date(d.tt).toISOString().split('T')[0];
			 // Build daily time series object
			 timeSeries[date] = {
				"1. open": d.open_price,
				"2. high": d.high_price,
				"3. low": d.low_price,
				"4. close": d.lp,
				"5. volume": d.volume
			  };
			    // Build metadata (assuming we only use the first quote for metadata)
			if (!metaData) {
				metaData = {
				"Information": "Daily Prices (Open, High, Low, Close) and Volumes",
				"Last Refreshed": date,
				"Exchange": d.exchange,
				"Symbol": d.short_name
				};
			}
		
		});

		return {
			"Meta Data": metaData,
			"Time Series (Daily)": timeSeries
		  };

		/*
				  

		  return {
			symbol: details.short_name || quote.n || quote.s,
			exchange: details.exchange || "NSE",
			timestamp: details.tt, // Assuming `tt` is a valid timestamp in ms
			open: details.open_price,
			high: details.high_price,
			low: details.low_price,
			close: details.lp,
			volume: details.volume
		  };
		 */
	  }
	  
	
	  
// STEP SHOW the PROFILE , QOUTE OR MARKET DEPHT from ABOVE CALLBACKS 
// 
async function showFYERSPROFILEQUOTES (req ,res , data  ){
	const jsonToTable = require('json-to-table');
	const tabled = jsonToTable(data,'--NA--');


	for (let [ k, v ] of iterateObject(tabled)) {
		console.log({ k, v });
	  }
	console.log("DATA ",  JSON.stringify(tabled))
   
	try {
         // FAILED DATA PARSE 
		 let dataParsed = '';
		 if(data["FYERS"]!==null && data["FYERS"]!== undefined){
			dataParsed = data["FYERS"]
		 }
		 else {
			dataParsed = data;
		 }  
		//res.send(output)
		ejs.renderFile(path.join(__dirname, "views/fyers_quotes_template.ejs"),
		  {
		  requesterName : "Vinayak Anvekar",
		  lastlogin: new Date(),
		  
		  data :  dataParsed ,
		     TRADECHECKKEY :"7`xZ6=v63s37L227e214j454mFN#h5Q4", //process.env.BREEZE_API_KEY,
		  })
		  .then(result => {
		  	fyersTemplate = result;
		  	res.send(fyersTemplate);
		  });
	} catch (e) {
		console.log(e);
		res.send("{ data: error }" );
	}


}

//-----------------STEP1------------- FYERS REDIRECT --- 
// Auth Code Redirect -------------
// curl --location --request GET https://api-t1.fyers.in/api/v3/generate-authcode?client_id=7GSQW68AZ4-100&redirect_uri='https://192.168.1.8:56322/fyersauthcode'&response_type=code&state=sample_state
// curl --location --request GET "https://api-t1.fyers.in/api/v3/generate-authcode?client_id=7GSQW68AZ4-100&redirect_uri='https://localhost:8888/.netlify/functions/netlifystockfyersbridge/api/fyersauthcode'&response_type=code&state=sample_state"

router.get('/fyersauthcode', async function (req,res) {
	let s = ''
	let code = ''
	let auth_code= '';
	if( req.query !== null && req.query !== undefined ){
		console.log(" FYERS REDIRECT QUERY PARAMS " +JSON.stringify(req.query))
		var queryJSON  = JSON.parse(JSON.stringify(req.query));
		s = queryJSON['s'];
		  code =queryJSON['code'];
		 auth_code= queryJSON['auth_code'];

		 console.log(`s: ${s}  code : ${code}  auth_code:  ${auth_code} `);

	}
	else if( req.params !== null && req.params !== undefined && req.params.length > 1){

		console.log("FYERS REDIRECT PARAMS : "+ JSON.stringify(req.params))


	}
	else { 
		 console.log("REDIRECT from Fyers is with not PARAMTEREs , or could not PARSE THEM ")

	if(res.data !== null && res.data !==undefined){
		s = res .data['s'];
		  code = res .data['code'];
		 auth_code= res .data['auth_code'];
		///
		// 
	}
    }
	 setCORSHeaders( res )
	res.send(JSON.stringify({"auth_code" :auth_code}))

});

// CALL once RECEIVED the AUTH CODE from the FYERS REDIRECT URI that is https://192.168.1.8:56322/fyersauthcode
// ON the View page fyes_login_template.ejs 
// PROCEED ACCESS button click , is handled by this EVENT HANDLER 
router.get('/fyersgetaccess', async function (req,res) {

	let s = ''
	let code = ''
	let auth_code= '';
	if( req.query !== null && req.query !== undefined ){
		console.log(" FYERS VIEW LOGIN TEMPLATE QUERY PARAMS " +JSON.stringify(req.query))
		var queryJSON  = JSON.parse(JSON.stringify(req.query));
		s = queryJSON['s'];
		  code =queryJSON['code'];
		 auth_code= queryJSON['auth_code'];
		 global_auth_code= auth_code;
		 console.log(`s: ${s}  code : ${code}  auth_code:  ${auth_code} `);
		 // INVOKE the BELLOW HANDLE FYERS AUTH CODE to GET ACCESS and SHOW SOME CODE 
	     // the FUCNTION SHOUD DISPLAY the PAGE 
		  setCORSHeaders( res )


		await handledFyersRedirectAuthCode(auth_code,req,res);


	}

});
// PROCEED ACCESS button click , is handled by this EVENT HANDLER 
// just return the auth code , to the Next js login page

router.get('/fyersgetaccessauthcode', async function (req,res) {

	let s = ''
	let code = ''
	let auth_code= '';
	if( req.query !== null && req.query !== undefined ){
		console.log(" FYERS VIEW LOGIN TEMPLATE QUERY PARAMS " +JSON.stringify(req.query))
		var queryJSON  = JSON.parse(JSON.stringify(req.query));
		s = queryJSON['s'];
		  code =queryJSON['code'];
		 auth_code= queryJSON['auth_code'];
		 global_auth_code= auth_code;
		  queue.enqueue({ time:getFormattedTimeKey(), data: global_auth_code });
		 console.log(`s: ${s}  code : ${code}  auth_code:  ${auth_code} `);
		 //SET MOST RECENT USER authcode 
		 recentUserAuthCode = { s: s, authcode :auth_code , code:code  } ;
		  
		 // INVOKE the BELLOW HANDLE FYERS AUTH CODE to GET ACCESS and SHOW SOME CODE 
	     // the FUCNTION SHOUD DISPLAY the PAGE 
		 const now = Date.now();
        setCORSHeaders( res )
		 res.send(JSON.stringify({ "value" : {"auth_code" :auth_code , "code" :code, "s" :s ,"ttl" :now}}));
		//await handledFyersRedirectAuthCode(auth_code,req,res);


	}

});
// JUST reply wih the recentUserAuthCode as this we have for the Ticker generation 
// from  anither node js application 
// PROCEED ACCESS button click , is handled by this EVENT HANDLER 
// just return the auth code , to the Next js login page

router.get('/fyerstickerauthcode', async function (req,res) {

	let s = ''
	let code = ''
	let auth_code= '';
	// no need to check the query paream as the request coming from localhost 3020 
	//if( req.query !== null && req.query !== undefined ){
		console.log(" FYERS VIEW LOGIN TEMPLATE QUERY PARAMS " +JSON.stringify(req.query))
		var queryJSON  = JSON.parse(JSON.stringify(req.query));
		s = queryJSON['s'];
		  code =queryJSON['code'];
		 auth_code= queryJSON['auth_code'];
		 global_auth_code= auth_code;
		 if(auth_code ===undefined || auth_code ==='' || auth_code === null ){
			// pop the first enqued token from the queue 
			let lastTok =   queue.dequeue();
			if(lastTok !== undefined && lastTok !=='') {
			  global_auth_code = lastTok.data;
			  auth_code= lastTok.data;
			   console.log("queue deque lastTok: "+JSON.stringify(auth_code));
			   console.log(`queue deque auth_code:  ${auth_code} `);
			 }
		 }
		 else {
			 console.log("auth code is not undefined  : " + JSON.stringify(auth_code));
		 }
		 console.log(`s: ${s}  code : ${code}  auth_code:  ${auth_code} `);
		 //SET MOST RECENT USER authcode 
		 recentUserAuthCode = { s: s, authcode :auth_code , code:code  } ;
		  
		 // INVOKE the BELLOW HANDLE FYERS AUTH CODE to GET ACCESS and SHOW SOME CODE 
	     // the FUCNTION SHOUD DISPLAY the PAGE 
		 const now = Date.now();
        setCORSHeaders( res )
		 res.send(JSON.stringify({ "value" : {"auth_code" :auth_code , "code" :code, "s" :s ,"ttl" :now}}));
		//await handledFyersRedirectAuthCode(auth_code,req,res);


	//}

});
// const fyers = require('extra-fyers');
router.get('/fyersquicklogin', async function (req,res) {

	try {
		data = { "FYERS":"GOOD MORNING"}
		let symbol = ''; let apikey = '';let resolution = '';let date_format = '';let range_from = '';let range_to = '';let cont_flag = '';
		let authcode =  global_auth_code;
		var oneWeekAgo = new Date();
		oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
		let yyyymmddWeekAgo = oneWeekAgo.toISOString().slice(0, 10);
		if( req.query !== null && req.query !== undefined ){
			console.log(" FYERS fyersquicklogin QUERY PARAMS " +JSON.stringify(req.query))
			var queryJSON  = JSON.parse(JSON.stringify(req.query));
			symbol = queryJSON['symbol'];
			  apikey =queryJSON['apikey'];
			  authcode= queryJSON['auth_code'];
			  resolution=queryJSON['resolution'] ? queryJSON['resolution']: 60;
			  date_format=queryJSON['date_format']? parseInt(queryJSON['date_format']): 0;
			  range_from=queryJSON['range_from'] ? queryJSON['range_from']: yyyymmddWeekAgo;
			  range_to=queryJSON['range_to'] ? queryJSON['range_to']: formatDate(oneWeekAgo);
			  cont_flag=queryJSON['cont_flag'] ? queryJSON['cont_flag']: "1";
			// global_auth_code= auth_code;
			 console.log(`symbol : ${symbol}  code : ${apikey}  auth_code:  ${authcode} `);
		}
		//res.send(output)
		var appId       = client_id ;  //'7GSQW68AZ4-100' PROD APP ID  app_id recieved after creating app
	if( symbol !==null && symbol !== undefined && symbol !== ''){
			console.log("Symbol : "+symbol); 
	 if( authcode !==null && authcode !== undefined && authcode !== ''){
			console.log("Authcode : "+authcode);
		var accessToken = authcode;  // access_token recieved after login
		var api = new fyersExtra.Api(appId, accessToken);   // "MGY8LRIY0M", PROD 
	  fyers.generate_access_token({"client_id":client_id,"secret_key": secret_key,
			"auth_code":authcode})
		.then(async (response)=>{
		if(response.s=='ok'){
				accessToken = response.access_token;
				console.log("Fyers access_token "+accessToken);
				console.log("FYERS Grants provided  ") 
				api = new fyersExtra.Api(appId, accessToken);
				const x = {
					fromDate: new Date("2025-05-30T09:15:00"),
					toDate: new Date("2025-06-01T15:30:00")
				};
				var marketRequest =   {
					symbol: `NSE:${symbol}-EQ`,
					resolution: resolution,
					//date_format: "1",
					//range_from: range_from,
					//range_to: range_to,
					//range_from: "2025-05-30 09:15",
					//range_to: "2025-06-01 15:30",
					//range_from: new Date("2025-05-30T09:15:00"), // ✅ Date object
					//range_to: new Date("2025-06-01T15:30:00"),   // ✅ Date object
					//range_from: '1717200000', // UNIX timestamp (seconds) — FROM
					//range_to: '1717286400',   // UNIX timestamp (seconds) — TO
					//range_from: Math.floor(x.fromDate.getTime() / 1000),
					//range_to: Math.floor(x.toDate.getTime() / 1000),
					fromDate: Math.floor(x.fromDate.getTime() / 1000),
					/** Indicating the end date of records. */
						toDate:  Math.floor(x.toDate.getTime() / 1000),
					continuous: true
					//cont_flag: cont_flag
			    }
	             console.log(" FYERS Market Request " +JSON.stringify(marketRequest));
	  //var marketresonse = await api.getMarketHistory(marketRequest);
	   // await api.getMarketHistory( marketRequest) 
	    // List equity and commodity fund limits.
 	// await api.getFunds()
			if(api !==null && api !== undefined){
					console.log("✅ fyers extra api is initialised" );
			}	
			if(fyersAPI !==null && fyersAPI !== undefined){
					fyersAPI.setAppId(appId)
				//fyersAPI.setRedirectUrl("https://url.xyz")
					fyersAPI.setAccessToken(accessToken)
					const range_to = Math.floor(Date.now() / 1000);
					const range_from = range_to - (86400 * 1); // 1 day back
					var inp={
						"symbol": `NSE:${symbol}-EQ`,
						"resolution":"60",
						"date_format":"1",
						"range_from":   "2025-05-30" , //" "+range_from,
						"range_to": "2025-06-01" , // " "+range_to,
						"cont_flag":"1"
					}
					
					console.log("✅ fyers Model api is initialised" );
				
					fyersAPI.getHistory(inp).then((response)=>{
						console.log(response)
						let wd = `NSE:${symbol}-EQ`;
						let ret = {  "symbol": wd , "status" : "Data available" }
						const output = transformCandlesToTimeSeries(response, symbol);
						 console.log(JSON.stringify(output, null, 2));
  
							 setCORSHeaders( res );

							res.send( JSON.stringify(output));
					}).catch((err)=>{
						console.log(err)
						let wd1 = `NSE:${symbol}-EQ`;
						let ret = {  "symbol": wd1 , "status" : " Input error "+JSON.stringify(err) };
						 setCORSHeaders( res );
						res.send( JSON.stringify( ret));
					})

				}
	/*await api.getMarketHistory( marketRequest) 
		.then(result => {
			console.log("✅ Got response:", result);
			 // Example usage
				const input = result;
				console.log(input );
				//const timeSeriesData = convertToTimeSeries(input);
			//	console.log(timeSeriesData);
			 //setCORSHeaders( res )
				// res.send( input);
				let wd = `NSE:${symbol}-EQ`;
				res.send( JSON.stringify({ wd: "Data available" } ));
		  })
		  .catch(err => {
			console.error("❌ Failed:", err);
			// setCORSHeaders( res )
			res.send(JSON.stringify({"FYERS": "FYERS MARKET CALL FAILED "}) );
		  });
	   */
		}  // response.s == OK 
	   });

	  }
     }
		// construct market request  
		/*{
			  symbol: string,
  /// The candle resolution in minutes. /
  resolution: string,
  ///0 to enter the epoch value. 1 to enter the date format as yyyy-mm-dd. /
  date_format: number,
  /// Indicating the start date of records (epoch, yyyy-mm-dd). /
  range_from: string,
  /// Indicating the end date of records. /
  range_to: string,
  /// Set cont flag 1 for continues data and future options. /
  cont_flag: string,
		} */

		/*
		await api.connectMarketData(quote => {
			console.log(quote);
		  });
		ejs.renderFile(path.join(__dirname, "views/fyers_callback_template.ejs"),
		  {
		  requesterName : "Vinayak Anvekar",
		  lastlogin: new Date(),
		  PUSHLIEDDAYFYERSAGREEMENT: client_id,
		  PUSHLIEDDAYFYERSDIRECTION: redirectUrl +'',
		 
		  data : JSON.stringify(data),
		     TRADECHECKKEY :"7`xZ6=v63s37L227e214j454mFN#h5Q4", //process.env.BREEZE_API_KEY,
		  })
		  .then(result => {
		  	fyersTemplate = result;
		  	res.send(fyersTemplate);
		  });
		  */
	} catch (e) {
		console.log(e);
		  setCORSHeaders( res )
		res.send("{ data: error }" );
	}
	/*
	 <% data.forEach(elem=> { %>

                <li> <% console.table(elem) %>
                </li>
                <% }); %>
	*/


});


// STEP FYERS MAKE A CALL to the FYERS PROXY  that CALLBACK OUR APP WITH 
// REDIRECT URI PROVIDED by US ONLY 
router.get('/fyerscallback', async function (req,res) {

	try {
		data = { "FYERS":"GOOD MORNING"}
		//res.send(output)
		ejs.renderFile(path.join(__dirname, "views/fyers_callback_template.ejs"),
		  {
		  requesterName : "Vinayak Anvekar",
		  lastlogin: new Date(),
		  PUSHLIEDDAYFYERSAGREEMENT: client_id,
		  PUSHLIEDDAYFYERSDIRECTION: redirectUrl +'',
		 
		  data : JSON.stringify(data),
		     TRADECHECKKEY :"7`xZ6=v63s37L227e214j454mFN#h5Q4", //process.env.BREEZE_API_KEY,
		  })
		  .then(result => {
		  	fyersTemplate = result;
			 setCORSHeaders( res );
		  	res.send(fyersTemplate);
		  });
	} catch (e) {
		console.log(e);
		 setCORSHeaders( res )
		res.send("{ data: error }" );
	}
	/*
	 <% data.forEach(elem=> { %>

                <li> <% console.table(elem) %>
                </li>
                <% }); %>
	*/


});

// 
//curl -H "Authorization:app_id:access_token" https://api-t1.fyers.in/api/v3/profile
//curl -H "Authorization: app_id:access_token" POST 'https://api-t1.fyers.in/api/v3/logout'
router.get('/fyersgetquote', async function (req,res) {

    let symbol = ''; let apikey = '';
	let authcode =  global_auth_code;
	if( req.query !== null && req.query !== undefined ){
		console.log(" FYERS fyersgetquote QUERY PARAMS " +JSON.stringify(req.query))
		var queryJSON  = JSON.parse(JSON.stringify(req.query));
		symbol = queryJSON['symbol'];
		  apikey =queryJSON['apikey'];
		  authcode= queryJSON['auth_code'];
		// global_auth_code= auth_code;
		 console.log(`symbol : ${symbol}  code : ${apikey}  auth_code:  ${authcode} `);
	}
	
	
	if( symbol !==null && symbol !== undefined && symbol !== ''){
		console.log("Symbol : "+symbol); 
	  if( authcode !==null && authcode !== undefined && authcode !== ''){
		console.log("FYERS Initiatied Successfully ") 
		let fyersAccess= false;
		fyers.generate_access_token({"client_id":client_id,"secret_key":secret_key,"auth_code":authcode}).then((response)=>{
			if(response.s=='ok'){
				fyers.setAccessToken(response.access_token)
				console.log("FYERS Grants provided  ") 
                fyers.get_profile().then((response)=>{
					console.log("FYERS Profile logged  ") 
					console.log(response)
  
					fyers.getQuotes([`NSE:${symbol}-EQ` ]).then((response)=>{
						console.log("FYERS Sample Quotes..  ") 
					 	console.log(response)
					    //console.log("STOCK TABLE " , JSON.stringify(stock_table) )	
					   // showFYERSPROFILEQUOTES(req,res,stock_table)
					    setCORSHeaders( res )
					      res.send(response);
						

					}).catch((err)=>{
						console.log("FYERS Quotes. no reach ..  ")
						 setCORSHeaders( res )
						res.send(JSON.stringify({"FYERS": "FYERS PROFILE CALL FAILED "}));
						//showFYERSPROFILEQUOTES(req,res,{"FYERS": "FYERS PROFILE CALL FAILED "})
						console.log(err)
					})

				}).catch((err)=>{
					console.log("FYERS Profile no reach ..  ")
					 setCORSHeaders( res )
					res.send(JSON.stringify({"FYERS": "FYERS PROFILE CALL NO REACH "}));
					//showFYERSPROFILEQUOTES(req,res,{"FYERS": "FYERS PROFILE CALL FAILED "})
					console.log(err)
				})

			}else{
				console.log("error generating access token",JSON.stringify(response.data));
				 setCORSHeaders( res )
				res.send(JSON.stringify({"FYERS": "FYERS ACCESS FAILED "}));
				//showFYERSPROFILEQUOTES(req,res,{"FYERS": "FYERS ACCESS FAILED "})
			}
		})
	   }
	   else {
		console.log("FYERS Initialization issues ... ") 
		 setCORSHeaders( res )
		res.send(JSON.stringify({"FYERS": " AUTH CODE INVALID "}));
		//showFYERSPROFILEQUOTES(req,res,{"FYERS": " AUTH CODE INVALID "})
	   }
	 }else {
		console.log("FYERS Initialization issues ... ") ;
		 setCORSHeaders( res )
		res.send(JSON.stringify({"FYERS": " SYMBOL INVALID "}));
		//showFYERSPROFILEQUOTES(req,res,{"FYERS": " SYMBOL INVALID "})
	 }

});




router.get('/fyersgetbsecequote', async function (req,res) {

    let symbol = ''; let apikey = '';
	let authcode =  global_auth_code;
	let access_token =  global_auth_code;
	if( req.query !== null && req.query !== undefined ){
		console.log(" FYERS fyersgetbsecequote QUERY PARAMS " +JSON.stringify(req.query))
		var queryJSON  = JSON.parse(JSON.stringify(req.query));
		symbol = queryJSON['symbol'];
		  apikey =queryJSON['apikey'];
		//  authcode= queryJSON['auth_code'];
		  access_token= queryJSON['access_token'];
		// global_auth_code= auth_code;
		 console.log(`symbol : ${symbol}  code : ${apikey}  auth_code:  ${authcode}  access_token : ${access_token}`);
	}
	
	
	if( symbol !==null && symbol !== undefined && symbol !== ''){
		console.log("Symbol : "+symbol); 
	  if( access_token !==null && access_token !== undefined && access_token !== ''){
		console.log("FYERS Initiatied Successfully ") 
		let fyersAccess= false;
		//fyers.generate_access_token({"client_id":client_id,"secret_key":secret_key,"auth_code":authcode}).then((response)=>{
			//if(response.s=='ok'){
			 if(fyers !==null && fyers !== undefined){ 
				fyers.setAccessToken(access_token)
				console.log("FYERS Grants provided  ") 
                fyers.get_profile().then((profileRes)=>{
					console.log("FYERS Profile logged  ") 
					console.log(profileRes)
  
					fyers.getQuotes([`BSE:${symbol}` ]).then((quoteRes)=>{
						console.log("FYERS Sample Quotes..  ") 
					 	console.log(quoteRes)
					    //console.log("STOCK TABLE " , JSON.stringify(stock_table) )	
					   // showFYERSPROFILEQUOTES(req,res,stock_table)
					    setCORSHeaders( res )
					      res.send(quoteRes);
						

					}).catch((err)=>{
						console.log("FYERS BSE Quotes. no reach ..  ")
						 setCORSHeaders( res )
						res.send(JSON.stringify({"FYERS": "FYERS PROFILE CALL FAILED "}));
						//showFYERSPROFILEQUOTES(req,res,{"FYERS": "FYERS PROFILE CALL FAILED "})
						console.log(err)
					})

				}).catch((err)=>{
					console.log("FYERS BSE Profile no reach ..  ")
					 setCORSHeaders( res )
					res.send(JSON.stringify({"FYERS": "FYERS PROFILE CALL NO REACH "}));
					//showFYERSPROFILEQUOTES(req,res,{"FYERS": "FYERS PROFILE CALL FAILED "})
					console.log(err)
				})
			   }else {
				   setCORSHeaders( res )
				   console.log("Fyers API fyers object not initialised " );
			   } 
			//}else{
			///	console.log("error generating access token",JSON.stringify(response.data));
			//	 setCORSHeaders( res )
			//	res.send(JSON.stringify({"FYERS": "FYERS ACCESS FAILED "}));
				//showFYERSPROFILEQUOTES(req,res,{"FYERS": "FYERS ACCESS FAILED "})
			//}
		//})
	   }
	   else {
		console.log("FYERS Initialization issues ... ") 
		 setCORSHeaders( res )
		res.send(JSON.stringify({"FYERS": " AUTH CODE INVALID "}));
		//showFYERSPROFILEQUOTES(req,res,{"FYERS": " AUTH CODE INVALID "})
	   }
	 }else {
		console.log("FYERS Initialization issues ... ") ;
		 setCORSHeaders( res )
		res.send(JSON.stringify({"FYERS": " SYMBOL INVALID "}));
		//showFYERSPROFILEQUOTES(req,res,{"FYERS": " SYMBOL INVALID "})
	 }

});
/**
 *   TICKER GET INDEX TICKER 
 * 
------------------------------------------------------------------------------------------------------------------------------------------
Sample Success Response 
------------------------------------------------------------------------------------------------------------------------------------------
          
 {
    symbol: 'NSE:NIFTY50-INDEX',
    ltp: 19733.55,
    prev_close_price: 19753.8,
    high_price: 19795.6,
    low_price: 19704.6,
    open_price: 19784,
    ch: -20.25,
    chp: -0.1,
    type: 'if'
  }

  OR for COMMODIDITY 
  
------------------------------------------------------------------------------------------------------------------------------------------
Sample Success Response 
------------------------------------------------------------------------------------------------------------------------------------------
          
 {
    symbol: 'MCX:CRUDEOIL25JULFUT',
    ltp: 19733.55,
    prev_close_price: 19753.8,
    high_price: 19795.6,
    low_price: 19704.6,
    open_price: 19784,
    ch: -20.25,
    chp: -0.1,
    type: 'if'
  }

  api-support@fyers.in
 * 
 */

router.get('/fyersgetticker', async function (req,res) {

   let auth_code= ''; //req.body.authcode;
  let s=  req.body.interval;
  let code= '';
  let limit = req.body.limit;
  let fyersdata = undefined;
   let access_token =req.body.access_token;
    let  symboltick = req.body.ticker; //NIFTY50-INDEX
	//if( req.query !== null && req.query !== undefined ){
 
   if( req.query !== null && req.query !== undefined ){
		console.log("Ticker request recevied " +JSON.stringify(req.query))
		var queryJSON  = JSON.parse(JSON.stringify(req.query));
		s = queryJSON['interval'];
		  limit =queryJSON['limit'];
		 auth_code= queryJSON['authcode'];
		 let access_token = queryJSON['access_token'];
        let  symboltick =  queryJSON['ticker']; //NIFTY50-INDEX
	 
 //  if( auth_code !==null && auth_code !== undefined && auth_code !== ''){
   if( access_token !==null && access_token !== undefined && access_token !== ''){

   //	fyers.generate_access_token({"client_id":client_id,"secret_key":secret_key,"auth_code":auth_code}).then((response)=>{
			//if(response.s=='ok'){
                   console.log("Fyers Access Granted ")
                try {  
                     console.log("Access token  "+JSON.stringify(access_token));
                    let currentAccToken = access_token;
                        // on Connect set the response header 
                        // to text/stream
                        //    no-cache 
                        //    keep-alive
                        res.setHeader('Content-Type', 'text/event-stream');
                        res.setHeader('Cache-Control', 'no-cache');
                        res.setHeader('Connection', 'keep-alive');
                        res.setHeader("Access-Control-Allow-Origin","*");

                        res.flushHeaders(); // Optional but helpful
                    // let fSk = new fyersSocket(client_id, response.access_token,symboltick ,queue, userInteval );
                   //  fyersSocket(client_id,response.access_token);
                    let buffer = [];
                    // setTimeOut will create the global fyersSocket object
                    // later in the setInterval we will trigger the fyersSocket .connect
                    // basically the onmsg of fyerSocket will reside inside the setInterval .. 
                    // so then only the sync of client and server res.write possible and 
                    // only then we can see the the EventStream populating the proper messages 
                   globalTickerInterval =  setInterval (() => {
                       //  console.log(" queue size ", queue.size());
                    
                        if(globalTickerFyersSocket === undefined && currentAccToken !== undefined && currentAccToken !==null){  
                            globalTickerFyersSocket  =  new FyersSocket(client_id+":"+currentAccToken);
                            
                           
                        } 
                        if(globalTickerFyersSocket !==undefined && !res.writableEnded && !res.finished){
                             function onmsg(message){
                                queue.enqueue({ time:getFormattedTimeKey(), data: message });
                             if( queue.size() > 0){
                                  let isIndexQuote =  Object.assign( {} ,   queue.dequeue());
                                  let data = isIndexQuote.data;
                                  let symbol = data['symbol'];
                                  let ltp = data['ltp'];
                                  if(symbol !== undefined && symbol===symboltick ){ //"NSE:NIFTY50-INDEX""MCX:CRUDEOIL25JULFUT"
                                //   console.log(" queue   ", isIndexQuote.data);
                                  console.log("symbol   "+symbol+ ": "+ltp);
                                 const ticker = { time: new Date().toISOString(), price: ltp  , symbol: symbol };
                                   res.write(`data: ${JSON.stringify(ticker)}\n\n`);     
                                  //  buffer.push(ltp);
                                    //res.write(JSON.stringify(data));
                                  }
                             }
                                console.log(message)
                            }
                            
                            function onconnect(){
                                //fyersdata.subscribe(['NSE:TCS-EQ']) //not subscribing for market depth data
                                  //globalTickerFyersSocket.subscribe(['NSE:NIFTY50-INDEX'])
                                  globalTickerFyersSocket.subscribe([symboltick])
                                  globlaTickerFyersSocketConnected = true;
                               // fyersdata.subscribe(['MCX:CRUDEOIL25JULFUT']) 
                                // fyersdata.mode(fyersdata.LiteMode) //set data mode to lite mode
                                // fyersdata.mode(fyersdata.FullMode) //set data mode to full mode is on full mode by default
                                  globalTickerFyersSocket.autoreconnect() //enable auto reconnection mechanism in case of disconnection
                            }
                            
                            function onerror(err){
                                console.log(err)
                                
                            }
                            
                            function onclose(){
                                console.log("socket closed")
                                globlaTickerFyersSocketConnected = false;
                            }
                            
                              globalTickerFyersSocket.on("message",onmsg)
                              globalTickerFyersSocket.on("connect",onconnect)
                              globalTickerFyersSocket.on("error",onerror)
                              globalTickerFyersSocket.on("close",onclose)
                            if(!globlaTickerFyersSocketConnected ){  
                              globalTickerFyersSocket.connect() 
                            }
                        }
                         
                     } ,4000);
                     res.write(": connected.\n\n");
                               
                      //  const intervalId = setInterval(sendData, 6000);

                        // 🔁 Handle client disconnect to avoid writing to a dead socket
                        req.on('close', () => {
                         // clearInterval(intervalId);
                           clearInterval(globalTickerInterval);
                          console.log("Client disconnected, stream stopped.");
                          res.end(); // Optional safety
                        });
               
                }catch(accerror){
                      console.log("Fyers Access Token not granted  "+JSON.stringify(accerror))   
                }
     //  } 
     // });   NOT REQUREIED 
    }  // aCCESS -TOKEN   
    else { 
        console.log("FYERS authorisation issues ...User not authorized ") 
		 setCORSHeaders( res )
		res.send(JSON.stringify({"FYERS": " ACCESS TOKEN INVALID "}));

    }
//  }   // AUTH CODE IMPROPER 
//   else { 
//         console.log("FYERS Authentication issues ...User not logged in proper ") 
// 		 setCORSHeaders( res )
// 		res.send(JSON.stringify({"FYERS": " AUTH CODE INVALID "}));

//     }
   } //NOT REQUIRED IN POST // rEQUIRED IN POST and EVENT SOURCE work only on GET 

});

router.get('/close', async function (req,res) {
 // clearInterval(intervalId);
   clearInterval(globalTickerInterval);
    console.log("Client disconnected, stream stopped.");
						res.end(); // Optional safety

});


router.get('/fyersaccesstoken', async function (req,res) {
      let auth_code= '';
  let s= '';
  let code= '';
  let limit ='';
  let fyersdata = undefined;
	//if( req.query !== null && req.query !== undefined ){


    console.log("req.body ", JSON.stringify(req.body))
  if( req.query !== null && req.query !== undefined ){
		console.log("Ticker request recevied " +JSON.stringify(req.query))
		var queryJSON  = JSON.parse(JSON.stringify(req.query));
		s = queryJSON['interval'];
		  limit =queryJSON['limit'];
		 auth_code= queryJSON['auth_code'];
        let  symboltick =  queryJSON['ticker']; //NIFTY50-INDEX
		


   if( auth_code !==null && auth_code !== undefined && auth_code !== ''){
	var accessToken = authcode;
   	fyers.generate_access_token({"client_id":client_id,"secret_key":secret_key,"auth_code":auth_code}).then((response)=>{
			if(response.s=='ok'){
                   console.log("Fyers Access Granted ")
				accessToken = response.access_token;
				console.log("Fyers access_token "+accessToken);
				console.log("FYERS Grants provided  ") 
				 setCORSHeaders( res );
				res.send( JSON.stringify(accessToken));
			}
		}).catch((err)=>{
					console.log("FYERS Access Token no found reach ..  ")
					 setCORSHeaders( res )
					res.send(JSON.stringify({"FYERS": "FYERS ACCESS TOKEN NOT GENERATED "}));
					//showFYERSPROFILEQUOTES(req,res,{"FYERS": "FYERS PROFILE CALL FAILED "})
					console.log(err)
				})
	}// AUTH_CODE 
	 
	   else {
		console.log("FYERS Initialization issues ... ") 
		 setCORSHeaders( res )
		res.send(JSON.stringify({"FYERS": " AUTH CODE INVALID "}));
		//showFYERSPROFILEQUOTES(req,res,{"FYERS": " AUTH CODE INVALID "})
	   }
  }// REQ.QUERY 
  

});

// SEND the GLOBAL LOGIN DATA
router.get('/fyersgloballogin', async function (req,res) {

	try {
		 setCORSHeaders( res )
		res.send(JSON.stringify(globalLogin));
	} catch (e) {
		console.log(e);
		 setCORSHeaders( res )
		res.send("{ data: error }" );
	}
});
// QUICK LOGIN with self triggered  button click
router.get('/fyersauthcodeverify', async function (req,res) {

    let s = ''
	let code = ''
	let auth_code= '';
	if( req.query !== null && req.query !== undefined ){
		console.log(" FYERS REDIRECT QUERY PARAMS " +JSON.stringify(req.query))
		var queryJSON  = JSON.parse(JSON.stringify(req.query));
		s = queryJSON['s'];
		  code =queryJSON['code'];
		 auth_code= queryJSON['auth_code'];
		  queue.enqueue({ time:getFormattedTimeKey(), data: auth_code });
		 console.log(`s: ${s}  code : ${code}  auth_code:  ${auth_code} `);

	}
	else if( req.params !== null && req.params !== undefined && req.params.length > 1){

		console.log("FYERS REDIRECT PARAMS : "+ JSON.stringify(req.params))


	}
	else { 
		 console.log("REDIRECT from Fyers is with not PARAMTEREs , or could not PARSE THEM ")
	if(res.data !== null && res.data !==undefined){
		s = res .data['s'];
		  code = res .data['code'];
		 auth_code= res .data['auth_code'];
		///
		// 
	}
    }
	// 
	// 
	// https://api-t1.fyers.in/api/v3/generate-authcode?client_id=7GSQW68AZ4-100&redirect_uri=https://192.168.1.8:56322/fyersauthcode&response_type=code&state=sample_state
	//s=ok&code=200&auth_code
	// PAYLOAD
	//var payload_for_checksum =body.replace(/("[^"]+"[:,])/g, "$1 ");
	var checksum ="";
    // fetch checksum from python child process , STILL WE NEED TO PASS POSITION Tempate as argu
	try {
		const now = Date.now()
		// set in global object logged in data 
		 globalLogin = { "value" : {"auth_code" :auth_code , "code" :code, "s" :s ,"ttl" :now}};

		//res.send(output)
		ejs.renderFile(path.join(__dirname, "views/fyers_show_logged_in.ejs"),
		  {
		  requesterName : "Vinayak Anvekar",
		  lastlogin: new Date(),
		  s: s+'',
		  code: code +'',
		  auth_code : auth_code  +'',
		  fnoresult : {},
		     TRADECHECKKEY :"7`xZ6=v63s37L227e214j454mFN#h5Q4", //process.env.BREEZE_API_KEY,
		  })
		  .then(result => {
		  	emailTemplate = result;
			 setCORSHeaders( res )
		  	res.send(emailTemplate);
		  });
	} catch (e) {
		console.log(e);
		 setCORSHeaders( res )
		res.send("{ data: error }" );
	}

});


// STEP CLEAR focus on the auth code , usually to hanlde the browser redirect , cannot be 
// call as XHR or Ajax request will always fail 
async function handledFyersRedirectAuthCode(authcode, req , res ){

	if( authcode !==null && authcode !== undefined && authcode !== ''){
		console.log("FYERS Initiatied Successfully ") 
		let fyersAccess= false;
		fyers.generate_access_token({"client_id":client_id,"secret_key":secret_key,"auth_code":authcode}).then((response)=>{
			if(response.s=='ok'){
				fyers.setAccessToken(response.access_token)
				console.log("FYERS Grants provided  ") 
                fyers.get_profile().then((response)=>{
					console.log("FYERS Profile logged  ") 
					console.log(response)
  
					fyers.getQuotes(["NSE:SBIN-EQ","NSE:TCS-EQ"]).then((response)=>{
						console.log("FYERS Sample Quotes..  ") 
					
					  	console.log(response)

						fyers.getMarketDepth({"symbol":["NSE:SBIN-EQ","NSE:TCS-EQ"],"ohlcv_flag":1}).then((response)=>{
							console.log("FYERS Sample Quotes MARKET DEPTH..  ") 
 
							    
							 console.log(response.d )
							let  quotes_obj = response.d;
							let  stock_table = []
							keys = Object.keys(quotes_obj),
							len = keys.length;
							if(Array.isArray(keys))	{
								let a1 = keys  
								let tableQ = { STOCK : "" ,  STOCK_ASK :"" ,   STOCK_BID :""};
								//ITERATE STOCK entries 
								entryVals = 		Object.entries(quotes_obj)
							     console.log("STOCK Entries LENGTH ", entryVals.length)
								//a1.forEach( stock_record => {
							   for (i = 0; i < entryVals.length; i++){	
								  // NOTE STOCK ASK and BID ARRAYS 
								  console.log( " entry"  , JSON.stringify(entryVals[i]) );
								  const [k , v ]  =entryVals[i];
								  let stock_ask  = v.ask;		
								  let stock_bid  =v.bids;	 
							 	 
								//	 permittedValues[i] = array[i]["key"];
								//  }
								  if(stock_ask !== null && stock_ask !== undefined &&
									 stock_bid !== null && stock_bid !== undefined ) 
								    { 
										tableQ.STOCK = k
										tableQ.STOCK_ASK = stock_ask
										tableQ.STOCK_BID = stock_bid
										let rec = Object.assign({}, tableQ);
										console.log(k + " rec " , JSON.stringify(rec) )	
										stock_table.push(rec)
										console.log(k + " stock_record " , JSON.stringify(stock_table) )	
										tableQ = {};
									}
								 
								} 
								if(a1.length > 1){
									
									a1.forEach( stock_record => {
										console.log("STOCK " + stock_record)
									});
								}
							}
							console.log("STOCK TABLE " , JSON.stringify(stock_table) )	
							showFYERSPROFILEQUOTES(req,res,stock_table)



							
						}).catch((err)=>{
							console.log("FYERS Market DEPTH no reach ..  ") 
							showFYERSPROFILEQUOTES(req,res,{"FYERS": "FYERS MARKET DEPTH FAILED "})
							console.log(err)
						})	

					}).catch((err)=>{
						console.log("FYERS Quotes. no reach ..  ")
						showFYERSPROFILEQUOTES(req,res,{"FYERS": "FYERS PROFILE CALL FAILED "})
						console.log(err)
					})

				}).catch((err)=>{
					console.log("FYERS Profile no reach ..  ")
					showFYERSPROFILEQUOTES(req,res,{"FYERS": "FYERS PROFILE CALL FAILED "})
					console.log(err)
				})

			}else{
				console.log("error generating access token",JSON.stringify(response.data))
				showFYERSPROFILEQUOTES(req,res,{"FYERS": "FYERS ACCESS FAILED "})
			}
		})
		
	 }else {
		console.log("FYERS Initialization issues ... ") 
		showFYERSPROFILEQUOTES(req,res,{"FYERS": " AUTH CODE INVALID "})
	 }
	
}  

module.exports = router;