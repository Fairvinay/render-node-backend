import {StorageUtils} from "@/libs/cache"
import {API} from "@/libs/client"
import {disableLoader, enableLoader} from "@/redux/slices/miscSlice"
import {saveCompanyData} from "@/redux/slices/stockSlice"
import { saveSensexTickerBook } from '@/redux/slices/tickerSensexSlice';  

import {CommonConstants} from "@/utils/constants"
import toast from "react-hot-toast"
import { FYERSAPINSECSV , FYERSAPITICKERACCESTOKEN,   FYERSAPITICKERURL , FYERSAPITICKERURLCLOSE} from '@/libs/client';


 const TICKER_URL  = [   FYERSAPITICKERURL  ] ;
 let  pollBtnClicked = false;
 let  popupInterval  = false;

 let SENSEXTICKERDOMID = 'sensex-status';
 let SENSEXTICKERTIME = 'sensex-time';
 let SENSEXTICKERPRICE = 'sensex-price';
 let SYMBOL = 'SENSEX';
 let previousSENSEXPrice = null;  // PREVIOUS PRICE SENSEX 
 let previousNIFTYPrice = null;  // PREVIOUS PRICE NIFTY 
 let previousPrice = null;  // PREVIOUS PRICE  
let  stringMap  = null;
 let mt = [];
 let sensexQue = [];
let bestMacthes1 = { bestMatches: [...mt] }; // 🔁 clone to avoid frozen reference
 const parseLine = (line )  => {
          let parts   = line; //split(',');
         // console.log(" line "+JSON.stringify(line));
          // parts.symbol;  
              parts  = JSON.parse(JSON.stringify(line));
       //        console.log("parts.symbol "+parts['symbol']);  
          const rawName =  (parts['clientId'] !==undefined ?  parts['clientId']: "");          //0 clientId   "AMARA RAJA ENERGY MOB LTD"
     //         console.log("parts.clientId "+parts['clientId']);  
          const ordertime =  (parts['orderDateTime']!==undefined ?  parts['orderDateTime']: "");             //orderDateTime
       //    console.log("parts.ordertime "+parts['ordertime']);  
           const orderNumber =  (parts['orderNumber']!==undefined ?  parts['orderNumber']: "");          // 2 orderNumber
        //    console.log("parts.orderNumber "+parts['orderNumber']);  
            const exchangeOrderNo =  (parts['exchangeOrderNo']!==undefined ?  parts['exchangeOrderNo']: "");          //3  exchangeOrderNo
        //     console.log("parts.exchangeOrderNo "+parts['exchangeOrderNo']);  
             const exchange =  (parts['exchange'] !==undefined ?  parts['exchange']: "");           //4  exchange
        //      console.log("parts.exchange "+parts['exchange']);  
              const side =  (parts['side'] !==undefined ?  parts['side']: "");          //5  side
         //      console.log("parts.side "+parts['side']);  
               const segment =  (parts['segment'] !==undefined ?  parts['segment']: "");           //6  segment
          //      console.log("parts.segment "+parts['segment']);  
                const orderType =  (parts['orderType'] !==undefined ?  parts['orderType']: "");           //7  orderType
         //        console.log("parts.orderType "+parts['orderType']);  
                 const fyToken =  (parts['fyToken'] !==undefined ?  parts['fyToken']: "");          //8  fyToken
         //         console.log("parts.fyToken "+parts['fyToken']);  
                  const productType =  (parts['productType'] !==undefined ?  parts['productType']: "");          //9  productType
           //        console.log("parts.productType "+parts['productType']);  
            const tickerdQty =  (parts['tickerdQty']!==undefined ?  parts['tickerdQty']: "");            //10  tickerdQty
           //  console.log("parts.tickerdQty "+parts['tickerdQty']);  
                const tickerPrice =  (parts['tickerPrice']!==undefined ?  parts['tickerPrice']: "");           //11  tickerPrice
            //     console.log("parts.tickerPrice "+parts['tickerPrice']);  
                 const tickerValue =  (parts['tickerValue'] !==undefined ?  parts['tickerValue']: "");           //12  tickerValue
            //      console.log("parts.tickerValue "+parts['tickerValue']);  
                  const tickerNumber =  (parts['tickerNumber'] !==undefined ?  parts['tickerNumber']: "");           //13  tickerNumber
             //      console.log("parts.tickerNumber "+parts['tickerNumber']);  
         const row =  (parts['row']!==undefined ?  parts['row']: "");          //  row 14
       //   console.log("parts.row "+parts['row']);  
                 const symbol = (parts['symbol']!==undefined ? parts['symbol']: "");           //  symbol
               //   console.log("parts.symbol "+parts['symbol']);  
                  const orderTag = (parts['orderTag']!==undefined ? parts['orderTag']: "");            // 16  orderTag
                //   console.log("parts.orderTag "+parts['orderTag']);  

          //const symbol = parts[9];            // "NSE:ARE&M-EQ"
          const cleaned =  symbol.replace(/^NSE:|[-_]EQ$/g, "");
          const sym = { "symbol": `${cleaned}`  };
          let qty = {  "tickerdQty": tickerdQty  };
          
          let type =  { "orderType": orderType };
          if(symbol.includes('NCD') || rawName.includes('NCD')){
            type =  { "orderType": "NCD" };
          }
          else if(symbol.includes('EQ')){
             type =  { "orderType": "Equity" };
          }
          else if(symbol.includes('BOND')){
             type =  { "orderType": "BOND" };
          }
           else if(symbol.includes('NAV')){
             type =  { "orderType": "BOND" };
          }
           else if(symbol.includes('INDEX')){
             type =  { "orderType": "INDEX" };
          }
          const region =  { "4. region": "India/Bombay" };
          const marketOpen =  { "5. marketOpen": "09:15" };
          const marketClose =  { "6. marketClose": "15:30" };
          const timezone =  {"7. timezone": "UTC+5.5" };
          const currency =  {"8. currency": "INR" };
          const tsegment  = { "segment" : segment}; 
          const tside  = { "side" : side}; 
          const prodtype =  {"productType": productType };
          const price =  {"tickerPrice": tickerPrice };
          const tvalue =  {"tickerValue": tickerValue };
          const tordertime = { "orderDateTime": ordertime};

          /*
          {
        "bestMatches": [
            {
                "1. symbol": "ICICI500.BSE",
            "2. name": "ICICI Prudential S&P BSE 500 ETF",

               "3. type": "ETF",
               "4. region": "India/Bombay",
               "5. marketOpen": "09:15",
               "6. marketClose": "15:30",
               "7. timezone": "UTC+5.5",
              "8. currency": "INR",
              "9. matchScore": "0.6250"
           },
          ]
          */
          // Extract first 3 words from the name, or custom logic
          const name = rawName.split(' ').slice(0, 3).join(' '); // "AMARA RAJA ENERGY"
           // rw = {  "2. name": name  };
            let trads  = {  ...sym,
              
              ...type,
              ...qty,
              ...price,
              ...tvalue,
              ...prodtype ,
              ...tsegment,
              ...tside,
              ...tordertime
                };
             //   console.log("ticker line "+JSON.stringify(trads))
      return trads;
   };
 const localISTDateTimeSec = (inStr) => {
            const options = {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      let  utcDate = new Date();
      try{ 
        if (inStr !==null && inStr !== undefined )
        {         utcDate =  new Date(inStr);  } 
        else {
          utcDate = new Date();
        }
       }catch(derr){
        utcDate = new Date();
        console.log("ticker time no present, current used ")
       }
    const istTime = new Intl.DateTimeFormat('en-GB', options).format(utcDate);
      return istTime;

   }

function updateBestMatches1(sensexQue){
  let result = sensexQue;
  if(result !==undefined){ 
  stringMap=Object.fromEntries(
                                  Object.entries(result).map(([key, value]) => [key, String(value)])
                                      );
    if (!Object.isExtensible(bestMacthes1.bestMatches)) {
    console.warn("bestMatches array is frozen — recreating");
    bestMacthes1.bestMatches = [...bestMacthes1.bestMatches]; // force new clone
    }
    else {
        console.warn("bestMatches array is  not frozen ");
    //  console.warn("TICKER JSON  "+ JSON.stringify(stringMap));
    }
                              
    bestMacthes1.bestMatches.push(stringMap); // ✅ safe now
  }
}

function updatePriceFromStream(newPriceStr,sym) {
  const newPrice = parseFloat(newPriceStr);
  const priceElement = document.getElementById(SENSEXTICKERPRICE);
  switch(sym){
    case 'SENSEX':previousPrice = previousSENSEXPrice;
    case 'NIFTY': previousPrice = previousNIFTYPrice;
    default : previousPrice = previousNIFTYPrice;
  }
  if(priceElement){ 
   console.log("price element present");
  } 
  if (!isNaN(newPrice)) {
    if (previousPrice !== null) {
      if (newPrice > previousPrice) {
        priceElement.style.color = "green"; // price increased
        priceElement.style.backgroundColor = "#e6ffed"; // light green background
        
       
      } else if (newPrice < previousPrice) {
        priceElement.style.color = "red"; // price decreased
        priceElement.style.backgroundColor = "#ffe6e6"; // light red background
      } else {
        priceElement.style.color = "black"; // unchanged
        priceElement.style.backgroundColor = "transparent";
      }
    }

    priceElement.textContent = newPrice.toFixed(2); // display with 2 decimal places
    previousPrice = newPrice;
  }
}
export const updateTickerStatusFromCache = (sym) =>{

   
 
    
   return async (dispatch) =>{ 
     try { 
       let dataFromCache = StorageUtils._retrieve(CommonConstants.tickerSensexDataCacheKey)
 if (dataFromCache.isValid && dataFromCache.data !== null &&  dataFromCache.data !== undefined) {
             console.log("updateTickerStatusFromCache  SensexTickerData: available  " )
     console.log('CACHE data:', dataFromCache.data);

        let el = document.getElementById(SENSEXTICKERDOMID);
        let tickerData = JSON.parse(dataFromCache.data);
        let sym = tickerData["symbol"];
        let price = tickerData["price"];
        
        let time = localISTDateTimeSec(tickerData["time"])
        // NO NEED to pUSH in active sensex queue
       // sensexQue.push({time:time, price :price});
       // NO NEED to EVEN have a LRU LIST of BEST MATCHES 
        //    updateBestMatches1(sensexQue);
        console.log("tick  "+JSON.stringify( { sym , price, time  }))
        if(el !==null && el !== undefined){
        // el.textContent = time + " :: "+ sym +" :: "+ price;
            let timeEl = document.getElementById(SENSEXTICKERTIME);
            if(timeEl !==null && timeEl !== undefined){
            timeEl.textContent = time ;
            }
            // SKIPED AS HEADING DIV CLARIFY the SYMBOL 
           /* let symbolEl = document.getElementById("symbol");
            if(symbolEl !==null && symbolEl !== undefined){
                symbolEl.textContent =   sym ;
            }*/
            // update price and color based on previus price 
        let priceSpan = document.getElementById(SENSEXTICKERPRICE);
            if(priceSpan !==null && priceSpan !== undefined){

            updatePriceFromStream( price,SYMBOL);
            }
        }

    }
    else {
        console.log("No SENSEX CACHE DATA");
    }

    //  return (dispatch, getState) => {
    // // Now dispatch is defined
    // const { ticker } = getState();
    //     dispatch({ type: 'UPDATE_TICKER', payload: ticker });
    //  };
  } 
 finally {
            dispatch(disableLoader())
        }  
    }
}
//https://fyers-stocks-node-express-render.onrender.com/api/close?authcode=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJUUkxWMkE2R1BMIiwidXVpZCI6IjZlYzNkZmNkZDJkNzQ5ZGJiNjg5YzU0ZmVlNDkwODU5IiwiaXBBZGRyIjoiIiwibm9uY2UiOiIiLCJzY29wZSI6IiIsImRpc3BsYXlfbmFtZSI6IlhWMzEzNjAiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiIzMDMwZjNjMDM2ZTUxYmE2YWNmZDg1YjQyMWM0MGY1NmRiOTQwODFlZTBlYjJjMzY3ZGE5OTExYiIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsImF1ZCI6IltcImQ6MVwiLFwiZDoyXCIsXCJ4OjBcIixcIng6MVwiLFwieDoyXCJdIiwiZXhwIjoxNzUzNTYxODAwLCJpYXQiOjE3NTM1MzE4MDAsImlzcyI6ImFwaS5sb2dpbi5meWVycy5pbiIsIm5iZiI6MTc1MzUzMTgwMCwic3ViIjoiYXV0aF9jb2RlIn0.qvCe0YOusUY2mXpcZ-a4ZIhRgRZ69cf3lB1-RFO90bg&interval=1m&limit=100&ticker=BSE%3ASENSEX-INDEX
// https://fyers-stocks-node-express-render.onrender.com/api/fyersgetticker/close?authcode=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJUUkxWMkE2R1BMIiwidXVpZCI6IjZlYzNkZmNkZDJkNzQ5ZGJiNjg5YzU0ZmVlNDkwODU5IiwiaXBBZGRyIjoiIiwibm9uY2UiOiIiLCJzY29wZSI6IiIsImRpc3BsYXlfbmFtZSI6IlhWMzEzNjAiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiIzMDMwZjNjMDM2ZTUxYmE2YWNmZDg1YjQyMWM0MGY1NmRiOTQwODFlZTBlYjJjMzY3ZGE5OTExYiIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsImF1ZCI6IltcImQ6MVwiLFwiZDoyXCIsXCJ4OjBcIixcIng6MVwiLFwieDoyXCJdIiwiZXhwIjoxNzUzNTYxODAwLCJpYXQiOjE3NTM1MzE4MDAsImlzcyI6ImFwaS5sb2dpbi5meWVycy5pbiIsIm5iZiI6MTc1MzUzMTgwMCwic3ViIjoiYXV0aF9jb2RlIn0.qvCe0YOusUY2mXpcZ-a4ZIhRgRZ69cf3lB1-RFO90bg&interval=1m&limit=100&ticker=BSE%3ASENSEX-INDEX
export const stopSensexTickerData =   (symb ) => {
      // SOTP the  TICKER DEFAULT DATA POLL
       console.log("getSensexTickerData: _id  "+JSON.stringify( symb))
  return async (dispatch) =>{ 
       const res1 = StorageUtils._retrieve(CommonConstants.fyersToken);
       let tokenKey = '';  
       
       
     try { 
       if (res1.isValid && res1.data !== null) {
            
            tokenKey = res1.data['auth_code'];
         // ["NSE:NIFTY50-INDEX" , "NSE:NIFTYBANK-INDEX"]
                const params = new URLSearchParams({
                authcode:  tokenKey,   ///localStorage.getItem(tokenKey),
                 interval: '1m',
                 limit: '100',
                 ticker: symb
                });
                let hitClose = async () => {
                    let result =   await  fetch(FYERSAPITICKERURLCLOSE+`?${params.toString()}` , {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json"
                            } 
                            });
                   //data = await result.json(); WILL NOT WORK IF RES.END() AT SERVER 
                    return result.status

                }
                 console.log("socket close ticker request made ");
                hitClose().then(status => { 
                     if (status !==null && status !==undefined) {
                         let el = document.getElementById(SENSEXTICKERDOMID);
                      if(el !==null && el !== undefined){
                          // el.textContent = time + " :: "+ sym +" :: "+ price;
                              let timeEl = document.getElementById(SENSEXTICKERTIME);
                              if(timeEl !==null && timeEl !== undefined){
                                timeEl.textContent = "" ;
                              }
                              // SKIPED AS HEADING DIV CLARIFY the SYMBOL 
                            /* let symbolEl = document.getElementById("symbol");
                              if(symbolEl !==null && symbolEl !== undefined){
                                  symbolEl.textContent =   sym ;
                              }*/
                              // update price and color based on previus price 
                          let priceSpan = document.getElementById(SENSEXTICKERPRICE);
                              if(priceSpan !==null && priceSpan !== undefined){
                                  priceSpan.textContent = "CLOSED";
                               // updatePriceFromStream( price,SYMBOL);
                              }
                          }
                        //return;
                       }

                });
                 
               
                 
                
                    }
            else {
                console.log("User Not Logged In .");
            }
          }catch(eeror){
                    console.log("Ticker Socket failure .");
                   console.log("Remote tigger failed due to connection slow.");
                } 
         finally {
            dispatch(disableLoader())
        }             
    
    }
} 
export const getSensexTickerData = (_id ) => {
      // SAMPLE TICKER DEFAULT DATA 
       console.log("getSensexTickerData: _id  "+JSON.stringify( _id))
        
      StorageUtils._save (CommonConstants.tickerSensexDataCacheKey,CommonConstants.sampleTickerSensexDataVersion1);

    return async (dispatch) => {
        const dataFromCache = StorageUtils._retrieve(CommonConstants.tickerSensexDataCacheKey)
        if (dataFromCache.isValid && dataFromCache.data !== null) {
             console.log("getSensexTickerData: available  " )
            const parsedData = dataFromCache.data
            const parsedMetaData = dataFromCache.data ;
            const parsedSym  = parsedMetaData["symbol"];
             console.log("getSensexTickerData: symb " + parsedSym);
            if ( parsedSym === _id ||  parsedData.Symbol === _id ) {
                 console.log("getSensexTickerData: available exact  "+JSON.stringify( _id))

                dispatch(saveSensexTickerBook(parsedData))
                return;
            }else {
                 console.log("getSensexTickerData: available not exact symbol "+JSON.stringify( _id))
                  console.log("getSensexTickerData:  "+JSON.stringify(parsedData))
                   dispatch(saveSensexTickerBook([parsedData]))
            }
        }
        else {
             console.log("getSensexTickerData: unavailable  " )
        }

        dispatch(enableLoader())


        try {
             // FETCH TICKER DATA only when SUER LOGGED ON 
 
               // IFF Logged in fetch the TICKER Book 
         const res1 = StorageUtils._retrieve(CommonConstants.fyersToken);
        if (res1.isValid && res1.data !== null) {
            
            let auth_code = res1.data['auth_code'];
            if (auth_code&& auth_code !== null && auth_code !== undefined) {
                console.log("User is  Authorized ");
                console.log("User fetch  profile authoristaion ");
                  // fyersaccesstoken
                   const fetchAuthToken = async () => {

                     try {
                                          
                          const res = await API.get(FYERSAPITICKERACCESTOKEN , {params: { "auth_code" : auth_code }});
                          const text = await res.data ;
                          StorageUtils._save(CommonConstants.recentTickerToken, text)
                          return text;
                     }
                     catch(erer){
                      console.log("Auth token fetch Error ")
                         return '';
                     }

                   };
                const fetchTickerBook = async (acctoken) => {
                      for (let endP = 0 ; endP < TICKER_URL.length ; endP ++) { 
                       try {
                          const sym = 'BSE:SENSEX-INDEX';
                         const params = new URLSearchParams({
                            authcode: auth_code ,  //  localStorage.getItem(tokenKey),
                            interval: '1m',
                            limit: '100',
                            ticker:sym,
                            access_token: acctoken
                            });
                        
                        if (typeof EventSource !== "undefined") {
                              console.log("SSE is supported.");
                             let eventSource = undefined;
    //https://fyers-stocks-node-express-render.onrender.com/api/fyersgetticker?authcode=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJUUkxWMkE2R1BMIiwidXVpZCI6IjZlYzNkZmNkZDJkNzQ5ZGJiNjg5YzU0ZmVlNDkwODU5IiwiaXBBZGRyIjoiIiwibm9uY2UiOiIiLCJzY29wZSI6IiIsImRpc3BsYXlfbmFtZSI6IlhWMzEzNjAiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiIzMDMwZjNjMDM2ZTUxYmE2YWNmZDg1YjQyMWM0MGY1NmRiOTQwODFlZTBlYjJjMzY3ZGE5OTExYiIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsImF1ZCI6IltcImQ6MVwiLFwiZDoyXCIsXCJ4OjBcIixcIng6MVwiLFwieDoyXCJdIiwiZXhwIjoxNzUzNTYxODAwLCJpYXQiOjE3NTM1MzE4MDAsImlzcyI6ImFwaS5sb2dpbi5meWVycy5pbiIsIm5iZiI6MTc1MzUzMTgwMCwic3ViIjoiYXV0aF9jb2RlIn0.qvCe0YOusUY2mXpcZ-a4ZIhRgRZ69cf3lB1-RFO90bg&interval=1m&limit=100&ticker=BSE%3ASENSEX-INDEX
    //https://fyers-stocks-node-express-render.onrender.com/api/fyersgetticker/tickerpoll?authcode=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJUUkxWMkE2R1BMIiwidXVpZCI6IjZlYzNkZmNkZDJkNzQ5ZGJiNjg5YzU0ZmVlNDkwODU5IiwiaXBBZGRyIjoiIiwibm9uY2UiOiIiLCJzY29wZSI6IiIsImRpc3BsYXlfbmFtZSI6IlhWMzEzNjAiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiIzMDMwZjNjMDM2ZTUxYmE2YWNmZDg1YjQyMWM0MGY1NmRiOTQwODFlZTBlYjJjMzY3ZGE5OTExYiIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsImF1ZCI6IltcImQ6MVwiLFwiZDoyXCIsXCJ4OjBcIixcIng6MVwiLFwieDoyXCJdIiwiZXhwIjoxNzUzNTYxODAwLCJpYXQiOjE3NTM1MzE4MDAsImlzcyI6ImFwaS5sb2dpbi5meWVycy5pbiIsIm5iZiI6MTc1MzUzMTgwMCwic3ViIjoiYXV0aF9jb2RlIn0.qvCe0YOusUY2mXpcZ-a4ZIhRgRZ69cf3lB1-RFO90bg&interval=1m&limit=100&ticker=BSE%3ASENSEX-INDEX                        
                             eventSource = new EventSource(TICKER_URL[endP]+`?${params.toString()}`);  //+'/tickerpoll' not required 
                             if(eventSource !== null & eventSource !== undefined){

                                    console.log("EventSource not null ");
                                    console.log('EventSource URL:', eventSource.url);
                                    let urlisPollActual= false; // eventSource.url.indexOf("tickerpolldummy") > -1 ? false: true;
                                  
                                  
                                    eventSource.onmessage = (event) => {
                                    console.log('Live data:', event.data);
                                    let el = document.getElementById(SENSEXTICKERDOMID);  // GLOBAL DOM ID sensex-status
                                    let tickerData = JSON.parse(event.data);
                                    let sym = tickerData["symbol"];
                                    let price = tickerData["price"];
                                  
                                    let time = localISTDateTimeSec(tickerData["time"])
                                    sensexQue.push({time:time, price :price});
                                     updateBestMatches1(sensexQue);
                                    console.log("tick  "+JSON.stringify( { sym , price, time  }))
                                    if(el !==null && el !== undefined){
                                    // el.textContent = time + " :: "+ sym +" :: "+ price;
                                        let timeEl = document.getElementById(SENSEXTICKERTIME);
                                        if(timeEl !==null && timeEl !== undefined){
                                        timeEl.textContent = time ;
                                        }
                                        // SKIPPED AS the HEADING DIV CLARIFY the SYMBOL
                                        /*let symbolEl = document.getElementById(SENSEXTICKERSYMBOL);
                                        if(symbolEl !==null && symbolEl !== undefined){
                                            symbolEl.textContent =   sym ;
                                        }*/
                                        // update price and color based on previus price 
                                    let priceSpan = document.getElementById(SENSEXTICKERPRICE);
                                        if(priceSpan !==null && priceSpan !== undefined){

                                        updatePriceFromStream( price, SYMBOL);
                                       }
                                    }
                                   };

                                    eventSource.onerror = (err) => {
                                    console.error('Stream error or closed:', err);
                                    pollBtnClicked = false;
                                    let el = document.getElementById("status");
                                    if(el !==null && el !== undefined){
                                    el.textContent = " :: "+ err;
                                    }
                                    clearInterval(popupInterval);// close the polling else it will start a new hit to the backend 
                                    eventSource.close();
                                    };
                            ///// THIS ONLY for tHE ACTIVE TICKER DATA 
                                if(urlisPollActual ){
                                    eventSource.addEventListener("CustomEvent", (event) => {
                                    console.log("Client Data "+JSON.stringify(event.data))
                                    // strip the event: CustomEvent\n
                                    // remove the \n 
                                    let strCustomEvent = event.data;
                                        let stripEvent  ='';
                                        if(strCustomEvent !== '' && strCustomEvent !== undefined && strCustomEvent !== null){
                                            if( typeof strCustomEvent =='string'){
                                                let lent = "event: CustomEvent\n".length();
                                                stripEvent = strCustomEvent.substring(lent);
                                                console.log("Client stripEvent  "+JSON.stringify(stripEvent))
                                            }
                                            else {
                                                console.log("Client event data not string   ")
                                            }
                                        }
                                    console.log("Client dataC "+JSON.stringify(dataC))
                                    let el = document.getElementById("status");
                                    if(el !==null && el !== undefined){
                                    el.textContent = " :: "+ stripEvent;
                                    }
                                    else if ( globalReferenceElStatus !==null &&  globalReferenceElStatus !== undefined){
                                        globalReferenceElStatus.textContent = " :: "+ stripEvent;
                                    }
                                    else {
                                        console.log("element Status not found  ");
                                    }
                                    });
                                }//    urlisPollActual 
                                ///// THIS ONLY for tHE ACTIVE TICKER DATA 
                                    eventSource.addEventListener('stream-close', (e) => {
                                    const msg = JSON.parse(e.data);
                                    console.log('Stream closed:', msg.message);
                                    //pollBtnClicked = false;
                                        let el = document.getElementById("status");
                                    if(el !==null && el !== undefined){
                                        el.textContent = " :: "+  msg.message;
                                    }
                                     //   clearInterval(popupInterval);// close the polling else it will start a new hit to the backend 
                                    eventSource.close();
                                    });
                               } // eVENT SOURCE is NOT NULL UNDEFINED 
                        }
                        else {
                             console.warn("SSE not supported, fallback needed (e.g., polling or WebSocket).");


                          }
                       //  const res = await API.get(TICKER_URL[endP], {params: { "auth_code" : auth_code, "ticker":sym }});
                        // const text = await res.data ;
                        // const lines = text.split('\n').filter(Boolean);
                     if(bestMacthes1["bestMatches"] !==undefined && Array.isArray(bestMacthes1["bestMatches"]) )
                           {  
                             console.log("bestMacthes total recros " + bestMacthes1["bestMatches"].length);
                             console.log("bestMacthes 5 record " + JSON.stringify(bestMacthes1["bestMatches"].slice(0, 5)));
                              const lastFive = JSON.stringify(bestMacthes1["bestMatches"].slice(-5));
                              console.log("bestMacthes last 5 record "  + lastFive);
                                const bestMacthes = { bestMatches: [...bestMacthes1.bestMatches] };
                              StorageUtils._save(CommonConstants.recentSensexTickersKey, bestMacthes.bestMatches) //StorageUtils._save(CommonConstants.recentEquitiesKey);
                              // EMPTY the SAMPLE ticker Data 
                              StorageUtils._save(CommonConstants.tickerSensexDataCacheKey,CommonConstants.sampleTickerDataVersion1);
                              dispatch(saveSensexTickerBook(bestMacthes.bestMatches)); 
                            
                            } 
                      
                         // other option to store int the context 
                          // updateEquityState({ equities: parsed }); // ✅ Save in context
                
                       } catch (err) {
                         console.error("Company View TICKER BOOK  error:", err);
                       }
                      }
                     };
                     console.log("Company View tirgger ticker  BOOK ..");

                     fetchAuthToken().then(acToken => {
                        console.log("Ticker access token fetched ")
                         fetchTickerBook(acToken);

                     })

                    
              
                //clearInterval(globalUserCheck);
            }
            else{
                console.log("User is awaiting authorization ");
            }
        }
 
           
        } catch (err) {
            // @ts-ignore
            const {message} = err
            toast.error(message ? message : "Something went wrong!")
            console.log(err)

           // dispatch(saveCompanyData(null))
        } finally {
            dispatch(disableLoader())
        }
    }
}
