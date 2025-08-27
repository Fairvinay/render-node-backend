const FyersSocket = require("fyers-api-v3").fyersDataSocket

var fyersdata= new FyersSocket("xxxxx-1xx:ey....")

function onmsg(message){
    console.log(message)
    


    }
 
/*
function onconnect(){
    fyersdata.subscribe(['NSE:NIFTY50-INDEX','NSE:TCS-EQ']) //not subscribing for market depth data
    fyersdata.subscribe(['NSE:IDEA-EQ'],true) //subscribing for market depth
    fyersdata.mode(fyersdata.LiteMode) //set data mode to lite mode
    fyersdata.autoreconnect() //enable auto reconnection mechanism in case of disconnection
}*/
function onconnect(){
    fyersdata.subscribe(['NSE:NIFTY50-INDEX']) //not subscribing for market depth data
    // fyersdata.mode(fyersdata.LiteMode) //set data mode to lite mode
    // fyersdata.mode(fyersdata.FullMode) //set data mode to full mode is on full mode by default
    fyersdata.autoreconnect() //enable auto reconnection mechanism in case of disconnection
}


function onerror(err){
    console.log(err)
}

function onclose(){
    console.log("socket closed")
}

fyersdata.on("message",onmsg)
fyersdata.on("connect",onconnect)
fyersdata.on("error",onerror)
fyersdata.on("close",onclose)

fyersdata.connect()
