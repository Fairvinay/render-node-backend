import {StorageUtils} from "@/libs/cache"
import {API} from "@/libs/client"
import {disableLoader, enableLoader} from "@/redux/slices/miscSlice"
import {saveCompanyData} from "@/redux/slices/stockSlice"
import { saveCancelOrderBook } from '@/redux/slices/orderBookSlice';  

import {CommonConstants} from "@/utils/constants"
import toast from "react-hot-toast"
import { FYERSAPINSECSV ,FYERSAPITHREESECQUOTE , FYERSAPIORDERBOOKSURL ,  FYERSAPITICKERACCESTOKEN, 
     FYERSAPICANCELORDER} from '@/libs/client';
//,   FYERSAPICANCELURL , FYERSAPICANCELURLCLOSE

 const CANCEL_URL  = [   FYERSAPICANCELORDER  ] ;
 let  pollBtnClicked = false;
 let  popupInterval  = false;

 let CANCELBUTTONID = 'CANCELBUTTONID';
 let CANCELBUTTONSPAN = 'CANCELBUTTONSPAN';
 let SENSEXCANCELTIME = 'sensex-time';
 let SENSEXCANCELPRICE = 'sensex-price';
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
    //  console.warn("ORDER BOOK JSON  "+ JSON.stringify(stringMap));
    }
                              
    bestMacthes1.bestMatches.push(stringMap); // ✅ safe now
  }
}

function updatePriceFromStream(newPriceStr,sym) {
  const newPrice = parseFloat(newPriceStr);
  const priceElement = document.getElementById(SENSEXCANCELPRICE);
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
       let dataFromCache = StorageUtils._retrieve(CommonConstants.threeSecSensexDataCacheKey)
 if (dataFromCache.isValid && dataFromCache.data !== null &&  dataFromCache.data !== undefined) {
             console.log("updateTickerStatusFromCache  SensexTickerData: available  " )
     console.log('CACHE data:', dataFromCache.data);
        let parseAll = JSON.parse(dataFromCache.data);
        console.log('parseAll: ', JSON.stringify(parseAll));
        let el = document.getElementById(SENSEXCANCELDOMID);
         let dArray = dataFromCache.data["d"] ? dataFromCache.data["d"] : (  parseAll.d ? parseAll.d : '') ;
      if(dArray !==undefined && dArray !==null && Array.isArray(dArray)){
             console.log("dArray from cache available  " +JSON.stringify(dArray))
        let firstObj = dArray[0];
        let vObj =  firstObj["v"];
        let parsedData =  vObj;
        let parsedMetaData =vObj;

       //let tickerData = JSON.parse(dataFromCache.data);
        let sym = parsedMetaData["symbol"];
        let price = parsedMetaData["lp"];
        
        let time = localISTDateTimeSec(parsedMetaData["time"])
        // NO NEED to pUSH in active sensex queue
       // sensexQue.push({time:time, price :price});
       // NO NEED to EVEN have a LRU LIST of BEST MATCHES 
        //    updateBestMatches1(sensexQue);
        console.log("tick  "+JSON.stringify( { sym , price, time  }))
        if(el !==null && el !== undefined){
        // el.textContent = time + " :: "+ sym +" :: "+ price;
            let timeEl = document.getElementById(SENSEXCANCELTIME);
            if(timeEl !==null && timeEl !== undefined){
            timeEl.textContent = time ;
            }
            // SKIPED AS HEADING DIV CLARIFY the SYMBOL 
           /* let symbolEl = document.getElementById("symbol");
            if(symbolEl !==null && symbolEl !== undefined){
                symbolEl.textContent =   sym ;
            }*/
            // update price and color based on previus price 
        let priceSpan = document.getElementById(SENSEXCANCELPRICE);
            if(priceSpan !==null && priceSpan !== undefined){

            updatePriceFromStream( price,SYMBOL);
            }
        }
     } // dArray CHECK 
      else {
             console.log("dArray from cache not present or not array  " )
      }
    }
    else {
        console.log("No SENSEX CACHE DATA");
    }

    //  return (dispatch, getState) => {
    // // Now dispatch is defined
    // const { ticker } = getState();
    //     dispatch({ type: 'UPDATE_CANCEL', payload: ticker });
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
      // SOTP the  ORDER BOOK DEFAULT DATA POLL
       console.log("orderBookData: _id  "+JSON.stringify( symb))
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
                    let result =   await  fetch(FYERSAPICANCELURLCLOSE+`?${params.toString()}` , {
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
                         let el = document.getElementById(SENSEXCANCELDOMID);
                      if(el !==null && el !== undefined){
                          // el.textContent = time + " :: "+ sym +" :: "+ price;
                              let timeEl = document.getElementById(SENSEXCANCELTIME);
                              if(timeEl !==null && timeEl !== undefined){
                                timeEl.textContent = "" ;
                              }
                              // SKIPED AS HEADING DIV CLARIFY the SYMBOL 
                            /* let symbolEl = document.getElementById("symbol");
                              if(symbolEl !==null && symbolEl !== undefined){
                                  symbolEl.textContent =   sym ;
                              }*/
                              // update price and color based on previus price 
                          let priceSpan = document.getElementById(SENSEXCANCELPRICE);
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
export const parseOrderBook = (orderB ) => {
    let orderFirst = undefined;
    let orderRecent = undefined;
    let mutlipleOrders = false;
    if(  orderB !== null && orderB !== undefined ) {
        // check orderBook array 
        let ob =(  orderB.orderBook ?  orderB.orderBook : (orderB["orderBook"] ?   orderB["orderBook"] : null) ) ;
        if( ob !== null && ob !== undefined ) {
           console.log("ORDER BOOK BUTTON : OrderBook orders exist ");
            // get FIRST ORDER 
            if( Array.isArray(ob)  ) {
                orderFirst = ob[0];
                mutlipleOrders =true;
            }
            else {
                 orderFirst = ob
            }
          if(  orderFirst !== null && orderFirst !== undefined ) {   
              // destrcutre the order with the needed field 
              const { id, exchOrdId ,exchange , symbol , side , limitPrice , tradedPrice , filledQty } = orderFirst;
              // save to the recentOrderPlaced
              if(parseInt(filledQty) ==0 ){
                 let orderNotExe = { id, exchOrdId, exchange, symbol, limitPrice, side};
                StorageUtils._save(CommonConstants.recentOrderPlaced, JSON.stringify(orderNotExe));
                orderRecent = orderNotExe;
                let pendingCancelableOrders = [];
                pendingCancelableOrders.push(orderRecent);
                // even single order check the status it must be pending 
                pendingCancelableOrders =  pendingCancelableOrders.filter(odSingle => parseInt(odSingle.status) == 6);
                console.log("pending orders actual with status 6 "+JSON.stringify(pendingCancelableOrders));
                 StorageUtils._save(CommonConstants.cancelOrderDataCacheKey, JSON.stringify(pendingCancelableOrders))
                console.log("saved the first non -executed order recentOrderPlaced")               
              }
              if(mutlipleOrders ){
                // store only the ORDER that have status = 6 pending meaning they are in the workking tab
                let pendingCancelableOrders =  ob.filter(odSingle => parseInt(odSingle.status) == 6);
                if (pendingCancelableOrders.length > 0){ 
                // SAVE them in the 
                 StorageUtils._save(CommonConstants.cancelOrderDataCacheKey, JSON.stringify(pendingCancelableOrders))
                console.log("ORDER BOOK BUTTON : OrderBook multiple orders saved to cancelOrderDataCacheKey  ");
                 const  {  id, exchOrdId, exchange, symbol, limitPrice, side }  = pendingCancelableOrders[0];
                    let orderNotExe =  {  id, exchOrdId, exchange, symbol, limitPrice, side } ;
                    StorageUtils._save(CommonConstants.recentOrderPlaced, JSON.stringify(orderNotExe));
                    orderRecent = orderNotExe;
                   console.log("saved the first pending order to be cancelled in  recentOrderPlaced")  

                }


              }


          }
          else{
             console.log("ORDER BOOK BUTTON : OrderBook orders either are cacelled or not fetched ");
          }
        }
         else{
             console.log("ORDER BOOK BUTTON : OrderBook array could  not fetched ");
          }
    }
    else {
         console.log("ORDER BOOK BUTTON : OrderBook request either failed or stopped ");
    }
    return orderRecent; 
}
export const orderBookData = (_id ) => {
      // SAMPLE ORDER BOOK DEFAULT DATA 
       console.log("orderBookData: _id  "+JSON.stringify( _id))
      // THIS CAUSE OVERRIDE DEFAULT SAMPLE DATA   
      //StorageUtils._save (CommonConstants.threeSecSensexDataCacheKey,CommonConstants.sampleThreeSecSensexDataVersion1);

    return async (dispatch) => {
        const dataFromCache = StorageUtils._retrieve(CommonConstants.cancelOrderDataCacheKey)
        if (dataFromCache.isValid && dataFromCache.data !== null) {
             console.log("orderBookData: available  " )
             let parseAll = undefined
             try { 
               parseAll = JSON.parse(dataFromCache.data);
             }catch(ee){
              console.log(" parse issue of fetched order ")
             }
              console.log('parseAll: ', JSON.stringify(parseAll));

           // let dArray = dataFromCache.data["d"];
          let dArray = dataFromCache.data["d"] ? dataFromCache.data["d"] : ( (parseAll !== undefined ? ( parseAll.d ? parseAll.d : '') : '') ) ;
          if(dArray !==undefined && dArray !==null && Array.isArray(dArray)){
             console.log("dArray from cache available  " +JSON.stringify(dArray))

            let firstObj = dArray[0];
            let vObj =  firstObj ; //["v"];
            const parsedData =  vObj;
            const parsedMetaData =vObj;
            const parsedOrderId  = parsedMetaData["id"];
             console.log("orderBookData: order_id " + parsedOrderId);
            if ( parsedOrderId === _id ||  parsedData.id === _id ) {
                 console.log("orderBookData: orders available to cancel  "+JSON.stringify( _id))

                dispatch(saveCancelOrderBook(parsedData))
                // THIS RETUNRN CAUSING PROBLEM not FIRING the BELOW fyersgetbsecequote SENSEX QUOTE LIVE
               // return;
            }else {
                 console.log("orderBookData: order avaiable  "+JSON.stringify( _id)+" not found ")
                  console.log("orderBookData:  "+JSON.stringify(parsedData))
                   dispatch(saveCancelOrderBook([parsedData]))
            }
          } // dArray CHECK 
          else {
             console.log("dArray from cache not present or not array  " )
          }
        }
        else {
             console.log("orderBookData: unavailable  " )
        }

       // dispatch(enableLoader())


        try {
             // FETCH ORDER BOOK DATA only when SUER LOGGED ON 
 
               // IFF Logged in fetch the ORDER BOOK Book 
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
                          StorageUtils._save(CommonConstants.recentCancelledOrderToken, text)
                          // GET THe ORDER BOOK 
                           const resorderbook = await API.get(FYERSAPIORDERBOOKSURL , {params: { "auth_code" : auth_code }});
                            const orderData = await resorderbook.data ;
                          // PARSE and SEGREGATE ORDER BOOK fill recentOrderPlaced
                           let orderRecent =     parseOrderBook (orderData); 
                           if(orderRecent !== null && orderRecent !== undefined){
                             let el = document.getElementById(CANCELBUTTONID);  // GLOBAL DOM ID sensex-status
                               if(el !==null && el !== undefined){
                                el.removeAttribute("disabled");
                                 el.setAttribute("enabled","true");
                                  let cancelButtonSpan = document.getElementById(CANCELBUTTONSPAN);
                                    if(cancelButtonSpan !==null && cancelButtonSpan !== undefined){
                                        cancelButtonSpan.textContent = 'Cancel Orders' ;
                                    }
                               }
                           }else {
                             //DISABLE the CANCELL BUTTON 
                             // SET CANCELLED BUTTON IN GREE 
                               console.log("Order Book is empty");
                              let el = document.getElementById(CANCELBUTTONID);  // GLOBAL DOM ID sensex-status
                               if(el !==null && el !== undefined){
                                 el.removeAttribute("enabled");
                                 el.setAttribute("disabled","true");
                                  let cancelButtonSpan = document.getElementById(CANCELBUTTONSPAN);
                                    if(cancelButtonSpan !==null && cancelButtonSpan !== undefined){
                                        cancelButtonSpan.textContent = 'No Orders' ;
                                    }
                               }
                           }

                          return text;
                     }
                     catch(erer){
                      console.log("Auth token fetch Error ")
                         return '';
                     }

                   };
               // READ ORDER FROM THE RECENT positions response 
                  const recentOrderPlace = StorageUtils._retrieve(CommonConstants.recentOrderPlaced);
             if(recentOrderPlace !==null && recentOrderPlace !== undefined ){
                 let order_id =    recentOrderPlace.id;
                     console.log("Order selected for CANCELLATION "+order_id);

              if(order_id !==null && order_id !== undefined) {  
                const fetchCANCELORDERStatus = async (acctoken) => {
                      for (let endP = 0 ; endP < CANCEL_URL.length ; endP ++) { 
                       try {
                          const sym = 'NSE:SENSEX-INDEX';
                         const params = new URLSearchParams({
                            authcode: auth_code ,  //  localStorage.getItem(tokenKey),
                            interval: '1m',
                            limit: '100',
                            ticker:sym,
                            id : order_id,
                            access_token: acctoken
                            });
                        
                      //   const res = await API.get(FYERSAPICANCELACCESTOKEN , {params: { "auth_code" : auth_code }});
                     //    const res = await API.get(FYERSAPITHREESECQUOTE , {params: { "auth_code" : auth_code ,"symbol":'SENSEX-INDEX'}});
                         const res = await API.get(FYERSAPICANCELORDER , {params: {"auth_code" : auth_code, "id" : order_id, "access_token" : acctoken ,"symbol":'SENSEX-INDEX'}});
                       // Axios auto-parses JSON
                      const responseData = res.data;
                      let resJSON = responseData;
                     // Safe parsing
                  /* {    
                    code: 1103,
                    message: 'Successfully cancelled order',
                    s: 'ok', 
                    id: '52104097626'
                    }        
                    */
                        console.log("resJSON "+JSON.stringify(resJSON));
                        console.log("resJSON?code "+JSON.stringify(resJSON?.code));
                        console.log("message "+ resJSON?.message );
                        console.log("id  "+resJSON.id);
                      
                      if (resJSON?.code && resJSON?.message  && resJSON.id ) {
                            const cancelData = resJSON ;         // Full object with n, v, s
                                                                     // Only the "v" part with pricing info

                            // Optional: destructure needed fields
                            const {
                              code, // last price
                               message, // change percentage
                             id ,  // change in value
                             s  
                            } = cancelData;
                  
                         /*     const text = await res.data ;   
                            let parseAll = JSON.parse(text);
                         console.log('text: ', JSON.stringify(text));
                          console.log('parseAll: ', JSON.stringify(parseAll));
                       let dArray = dataFromCache.data["d"] ? dataFromCache.data["d"] : (  parseAll.d ? parseAll.d : '') ;
                           // let dArray = text.data["d"];
                   if(dArray !==undefined && dArray !==null && Array.isArray(dArray)){
                     console.log("dArray from server available  " +JSON.stringify(dArray))
                            let firstObj = dArray[0];
                            let vObj =  firstObj["v"];
                            let parsedData =  vObj;
                            let parsedMetaData =vObj;*/


                        if (typeof id !== "undefined" && typeof s !== "undefined" && s === 'ok') {
                              console.log("ORDER BOOK ORDER SUCCESS ");
                             let eventSource = undefined;
    //https://fyers-stocks-node-express-render.onrender.com/api/fyersgetticker?authcode=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJUUkxWMkE2R1BMIiwidXVpZCI6IjZlYzNkZmNkZDJkNzQ5ZGJiNjg5YzU0ZmVlNDkwODU5IiwiaXBBZGRyIjoiIiwibm9uY2UiOiIiLCJzY29wZSI6IiIsImRpc3BsYXlfbmFtZSI6IlhWMzEzNjAiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiIzMDMwZjNjMDM2ZTUxYmE2YWNmZDg1YjQyMWM0MGY1NmRiOTQwODFlZTBlYjJjMzY3ZGE5OTExYiIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsImF1ZCI6IltcImQ6MVwiLFwiZDoyXCIsXCJ4OjBcIixcIng6MVwiLFwieDoyXCJdIiwiZXhwIjoxNzUzNTYxODAwLCJpYXQiOjE3NTM1MzE4MDAsImlzcyI6ImFwaS5sb2dpbi5meWVycy5pbiIsIm5iZiI6MTc1MzUzMTgwMCwic3ViIjoiYXV0aF9jb2RlIn0.qvCe0YOusUY2mXpcZ-a4ZIhRgRZ69cf3lB1-RFO90bg&interval=1m&limit=100&ticker=BSE%3ASENSEX-INDEX
    //https://fyers-stocks-node-express-render.onrender.com/api/fyersgetticker/tickerpoll?authcode=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiJUUkxWMkE2R1BMIiwidXVpZCI6IjZlYzNkZmNkZDJkNzQ5ZGJiNjg5YzU0ZmVlNDkwODU5IiwiaXBBZGRyIjoiIiwibm9uY2UiOiIiLCJzY29wZSI6IiIsImRpc3BsYXlfbmFtZSI6IlhWMzEzNjAiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiIzMDMwZjNjMDM2ZTUxYmE2YWNmZDg1YjQyMWM0MGY1NmRiOTQwODFlZTBlYjJjMzY3ZGE5OTExYiIsImlzRGRwaUVuYWJsZWQiOiJOIiwiaXNNdGZFbmFibGVkIjoiTiIsImF1ZCI6IltcImQ6MVwiLFwiZDoyXCIsXCJ4OjBcIixcIng6MVwiLFwieDoyXCJdIiwiZXhwIjoxNzUzNTYxODAwLCJpYXQiOjE3NTM1MzE4MDAsImlzcyI6ImFwaS5sb2dpbi5meWVycy5pbiIsIm5iZiI6MTc1MzUzMTgwMCwic3ViIjoiYXV0aF9jb2RlIn0.qvCe0YOusUY2mXpcZ-a4ZIhRgRZ69cf3lB1-RFO90bg&interval=1m&limit=100&ticker=BSE%3ASENSEX-INDEX                        
                             let urlisPollActual= false; // eventSource.url.indexOf("tickerpolldummy") > -1 ? false: true;
                              // SET the CACHE  recentCancelledOrder
                               StorageUtils._save(CommonConstants.recentCancelledOrder,JSON.stringify(responseData));
                             
                                   // SET CANCELLED BUTTON IN GREE 
                                    let el = document.getElementById(CANCELBUTTONID);  // GLOBAL DOM ID sensex-status
                                    let tickerData = quoteValue;
                                    let sym = 'SENSEX-INDEX';  // tickerData["symbol"];
                                    let orderid =id //  tickerData["lp"];
                                   
                                     let time =  localISTDateTimeSec(tt) ;// localISTDateTimeSec(tt)//tickerData["tt"]
                                    sensexQue.push({time:time, orderid :orderid});
                                      console.log('time '+JSON.stringify(time) + "order_id  "+ orderid);  
                                   //  updateBestMatches1(sensexQue);
                                    console.log("order cancelled  "+JSON.stringify( { sym , orderid, time  }))
                                    if(el !==null && el !== undefined){
                                    // el.textContent = time + " :: "+ sym +" :: "+ price;
                                        let cancelButtonSpan = document.getElementById(CANCELBUTTONSPAN);
                                        if(cancelButtonSpan !==null && cancelButtonSpan !== undefined){
                                           cancelButtonSpan.textContent = 'can '+orderid ;
                                        }
                                        // SKIPPED AS the HEADING DIV CLARIFY the SYMBOL
                                        /*let symbolEl = document.getElementById(SENSEXCANCELSYMBOL);
                                        if(symbolEl !==null && symbolEl !== undefined){
                                            symbolEl.textContent =   sym ;
                                        }*/
                                        // update price and color based on previus price 
                                   // let priceSpan = document.getElementById(SENSEXCANCELPRICE);
                                     //   if(priceSpan !==null && priceSpan !== undefined){
                                      
                                        //      priceElement.textContent = price;

                                      // SKIPPED FOR NOW 
                                       // updatePriceFromStream( price, SYMBOL);
                                      // }
                                    }
                        }     else {
                             console.warn("ORDER to ORDER BOOK NOT  availalbe  (e.g., polling or WebSocket).");


                          }
  
                    /* if(bestMacthes1["bestMatches"] !==undefined && Array.isArray(bestMacthes1["bestMatches"]) )
                           {  
                             console.log("bestMacthes total recros " + bestMacthes1["bestMatches"].length);
                             console.log("bestMacthes 5 record " + JSON.stringify(bestMacthes1["bestMatches"].slice(0, 5)));
                              const lastFive = JSON.stringify(bestMacthes1["bestMatches"].slice(-5));
                              console.log("bestMacthes last 5 record "  + lastFive);
                                const bestMacthes = { bestMatches: [...bestMacthes1.bestMatches] };
                              StorageUtils._save(CommonConstants.recentSensexTickersKey, bestMacthes.bestMatches) //StorageUtils._save(CommonConstants.recentEquitiesKey);
                              // EMPTY the SAMPLE ticker Data 
                              StorageUtils._save(CommonConstants.threeSecSensexDataCacheKey,CommonConstants.sampleThreeSecSensexDataVersion1);
                              dispatch(saveQuoteBook(bestMacthes.bestMatches)); 
                            
                            } 
                       */     
                   } // dArray is not a ARRAY 
                   else { 
                       console.log("Unable to ORDER BOOK ORDER  please check  "+order_id  );
                   }
                         // other option to store int the context 
                          // updateEquityState({ equities: parsed }); // ✅ Save in context
                
                      
                      
                     }catch (err ){
                       console.log("Exception CANCELLING ORDER  please check  "+JSON.stringify(err)  );
                     }
                    
                   } //FOR LOOP 
                  }
                   
                } // ORDER ID is NULL or UNDEFINED 
                 fetchAuthToken().then(async aces_token   => { 
                        // WE JUST FETCH The ORDER BOOK 
                     //  await  fetchCANCELORDERStatus(aces_token);


                     });
              } // ORDER BOOK ORDER CONDITON 

                     console.log("ORDER BOOK ORDER TRIGGER  ..");
                    
                    //  fetchAuthToken().then(acToken => {
                    //     console.log("Ticker access token fetched ")
                       

                    //  })

                    
              
                //clearInterval(globalUserCheck);
       
 
           
        }  else  {
            // @ts-ignore
             console.log("User not Authorised ")

           // dispatch(saveCompanyData(null))
        }
    }  // AUTH CODE CHECL 
    else { 
          console.log("User not logged  ")
    }
 } // TRY 
    finally {
            dispatch(disableLoader())
        }
    }
}
