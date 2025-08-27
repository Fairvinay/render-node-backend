// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2

const express = require("express");
// Capital ServerlessHttp is fine small serverless not work '
const ServerlessHttp = require('serverless-http');
var fs = require('fs');
var ejs = require('ejs');
var path = require('path');
const routes = require('./routes')
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/************************* EEXPRESSS SETIING the VIEW ENNINGE ************ */
//Notice //set express view engine to ejs
app.set("view engine", "ejs");
var fyersModel= require("fyers-api-v3").fyersModel
//var client_id= "7GSQW68AZ4-100"
var client_id= "TK2NQ6EYHR-100 "
//var redirectUrl  = "https://192.168.1.8:56322/fyersauthcodeverify"
var redirectUrl  = "https://successrate.netlify.app/.netlify/functions/netlifystockfyersbridge/api/fyersauthcodeverify"
//var redirectUrl  = "https://store-stocks.netlify.app/.netlify/functions/netlifystockfyersbridge/api/fyersauthcodeverify"
var fyers= new fyersModel({"path":"./","enableLogging":true})
fyers.setAppId(client_id)

fyers.setRedirectUrl(redirectUrl)
var authcode='';

var URL=fyers.generateAuthCode()
	//use url to generate auth code
		console.log("FYERS URL " , URL) 

   
     // redirect_uri=https://192.168.1.8:56322/fyersauthcode&response_type=code&state=sample_state
	 var axios = require('axios');  // "secret_key":"MGY8LRIY0M",
	 var data = { "client_id":client_id, " redirect_uri":redirectUrl,
		"response_type":"code", "state":"sample_state"
	 };
	 var config = {
		 method: 'get',
		 url: " https://api-t1.fyers.in/api/v3/generate-authcode",
		 headers: { 'Content-Type': 'application/json' },
		 data : data
	 };

   app.use('/asset', express.static(__dirname +'../../../public'));
   //    app.use('/localcss', express.static(path.join(__dirname +'/css')));
   //    app.use('/localscripts', express.static(path.join(__dirname +'/iciciscripts')));
   //     app.use('/upload', express.static(path.join(__dirname +'/upload')));
   // 	app.use('/images', express.static(path.join(__dirname +'/images')));
     app.use('/js', express.static(path.join(__dirname + '../../../node_modules/bootstrap/dist/js')));
       app.use('/jquery', express.static(path.join(__dirname + '../../../node_modules/jquery/dist')));
       app.use('/bootcss', express.static(path.join(__dirname + '../../../node_modules/bootstrap/dist/css')));
 const handler2 =  ServerlessHttp(app) ;
const handler = async (event,context) => {
  try {
    const subject = event.queryStringParameters.name || 'World'
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: '',
      };
    }
    if(app !==null && app !==undefined) { 

      console.log("App is created "+app)
       console.log("App routes " +JSON.stringify(app.routes))
       app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      //let routes = routes1(app);
      app.use("/.netlify/functions/netlifystockfyersbridge/api", routes);
      //app.use("/api",routes )
      //process.env.PORT
      /*app.listen(5112, () => {
        console.log("listening on port " + 5112);//process.env.PORT
      });
      */
      app.get("/.netlify/functions/netlifystockfyersbridge/", async (req, res,next) => {
        // const result=await sendMail();
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Headers", "*");
       res.setHeader("Access-Control-Allow-Methods", "*");
        if (req.method === 'OPTIONS') return res.status(200).end();
       next();
        //res.send("Welcome to Gmail API with NodeJS");
      });
    }
    else { 
      console.log("App creation failed ")
    }
    return await   handler2(event, context)
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
