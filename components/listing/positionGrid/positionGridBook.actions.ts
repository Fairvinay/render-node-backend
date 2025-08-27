import {StorageUtils} from "@/libs/cache"
import {API} from "@/libs/client"
import {disableLoader, enableLoader} from "@/redux/slices/miscSlice"
import {saveCompanyData} from "@/redux/slices/stockSlice"
import { savePositionBook } from '@/redux/slices/positionSlice';
import {CommonConstants} from "@/utils/constants"
import toast from "react-hot-toast"
import { FYERSAPINSECSV , FYERSAPIPOSITIONBOOKURL} from '@/libs/client';
import { useState } from "react";


 const POSITION_URL  = [   FYERSAPIPOSITIONBOOKURL  ] ;
 const parseLine = (line: string): Record<string, any>  => {
          let parts:any  = line; //split(',');
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
           // const tradedQty =  (parts['tradedQty']!==undefined ?  parts['tradedQty']: "");            //10  tradedQty
            let qtyS =  (parts['netQty']!==undefined ?  parts['netQty']: "");            //10  tradedQty
           //  console.log("parts.tradedQty "+parts['tradedQty']);  
                const ltp =  (parts['ltp']!==undefined ?  parts['ltp']: "");           //11  tradePrice
                let  avgPrice =  (parts['netAvg']!==undefined ?  parts['netAvg']: "");           //11  tradePrice
                   avgPrice  = parseFloat(avgPrice).toFixed(2);
                let  gstBROSTTETC =  (parts['netAvg']!==undefined ?  parts['netAvg']: "");           //11  tradePrice
                 let sym1  = (parts['symbol']!==undefined ? parts['symbol']: "");   
                 let brkCh = 20*2*(parseFloat(qtyS)/75);
                 let f = parseFloat(avgPrice);
                   let stt:number = ((f* parseFloat(qtyS))* (0.15/100))  ; //f+ (f * (0.1/100)
                 let sttCh = (f *  0.001).toFixed(2);
                 let pp = parseFloat(ltp);
                  let exChturnoverNSE = (parseFloat(((f* parseFloat(qtyS))* 0.0003503).toFixed(2)) )  + (parseFloat((pp* parseFloat(qtyS)* 0.0003503).toFixed(2)) )
                  let exChturnoverBSE = (parseFloat(((f* parseFloat(qtyS))* 0.000325).toFixed(2)) )  + (parseFloat((pp* parseFloat(qtyS)* 0.000325).toFixed(2)) )

                  let exCh :number = ((sym1.indexOf("NIFTY") >-1) ? exChturnoverNSE: exChturnoverBSE);
                  let clearCh:number = parseFloat((f * 0.00009).toFixed(2));
                  let sebiTurn:number = (0.003*f);
                  let nseipft :number= (0.003*f);
                  let gst = parseFloat(((0.18)*(brkCh + exCh+clearCh+sebiTurn +nseipft )).toFixed(2));
                  let stmDty =  parseFloat((f * 0.00003).toFixed(2));
                     console.log(" gst:"+gst)
                     console.log(" stmDty:"+stmDty)
                     console.log(" stt:"+stt)
                     console.log(" brkCh:"+brkCh)
                     console.log(" exCh:"+exCh)
                     console.log(" clearCh:"+clearCh)

                  let totalCh =  parseFloat((Math.round(gst) + stmDty +   Math.round(stt) + Math.round(brkCh) +Math.round(exCh)).toFixed(2)) ;
                      console.log(" totalCh "+totalCh)
                      let netP = (  parseFloat(ltp) - f ) ;
                       console.log(" netP "+netP)
                       console.log("parseFloat(qtyS) "+parseFloat(qtyS))
                  let actProf =  ((netP > 0 ?     (netP *  parseFloat(qtyS)) - totalCh : (netP *  parseFloat(qtyS)) - totalCh)).toFixed(2);
                   console.log("  (netP *  parseFloat(qtyS)) - totalCh " + ((netP *  parseFloat(qtyS)) - totalCh).toFixed(2));
                 
                  console.log(" actProf "+actProf)

            //     console.log("parts.tradePrice "+parts['tradePrice']);  
            //     const tradeValue =  (parts['tradeValue'] !==undefined ?  parts['tradeValue']: "");           //12  tradeValue
                 const buyVal =  (parts['buyVal'] !==undefined ?  parts['buyVal']: "");           //12  tradeValue
            //      console.log("parts.tradeValue "+parts['tradeValue']);  
            //      const tradeNumber =  (parts['tradeNumber'] !==undefined ?  parts['tradeNumber']: "");           //13  tradeNumber
                  let realized_profit =  (parts['realized_profit'] !==undefined ?  parts['realized_profit']: "");           //13  tradeNumber
                     realized_profit  = parseFloat(realized_profit).toFixed(2);
                   let unrealized_profit =  (parts['unrealized_profit'] !==undefined ?  parts['unrealized_profit']: "");           //13  tradeNumber
                        unrealized_profit = parseFloat(unrealized_profit).toFixed(2);
                  //      console.log("parts.tradeNumber "+parts['tradeNumber']);  
         const row =  (parts['row']!==undefined ?  parts['row']: "");          //  row 14
       //   console.log("parts.row "+parts['row']);  
                 const symbol = (parts['symbol']!==undefined ? parts['symbol']: "");           //  symbol
               //   console.log("parts.symbol "+parts['symbol']);  
                  const orderTag = (parts['orderTag']!==undefined ? parts['orderTag']: "");            // 16  orderTag
                //   console.log("parts.orderTag "+parts['orderTag']);  

          //const symbol = parts[9];            // "NSE:ARE&M-EQ"
          const cleaned =  symbol.replace(/^NSE:|[-_]EQ$/g, "");
          const sym = { "symbol": `${cleaned}`  };
        //  let qty = {  "tradedQty": tradedQty  };
          let qty = {  "netQty": qtyS  };
          
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
          const price =  {"ltp": ltp };
          const tavgPrice =  {"avgPrice": avgPrice };
                
          const totCh =  {"totCh": totalCh };  //   let totalCh = gst+stmDty+sttCh;
 
          const actPrf =  {"calPrf": actProf };  //   let totalCh = gst+stmDty+sttCh;

          const tvalue =  {"buyVal": buyVal };
          const trealized_profit =  {"realized_profit": realized_profit };
          const tunrealized_profit =  {"unrealized_profit": unrealized_profit };
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
              ...tvalue,
              ...price,
              ...tavgPrice,
              ...totCh,
              ...actPrf,
              ...trealized_profit,
              ...tunrealized_profit,
              ...prodtype ,
              ...tsegment,
              ...tside,
              ...tordertime
                };
             //   console.log("position line "+JSON.stringify(trads))
      return trads;
   };

export const getPositionData = (_id: string | string[]) => {
      // SAMPLE TRADES DEFAULT DATA 
       console.log("getPositionData: _id  "+JSON.stringify( _id))
      // const [fetchPositions, setFetchPositions] = useState([]);
         let mt:any[] = [];
      StorageUtils._save (CommonConstants.positionDataCacheKey,CommonConstants.samplePositionDataVersion1);
    return async (dispatch: Function) => {
        const dataFromCache = StorageUtils._retrieve(CommonConstants.positionDataCacheKey)
        if (dataFromCache.isValid && dataFromCache.data !== null) {
             console.log("getPositionData: available  " )
            const parsedData = dataFromCache.data
            const parsedMetaData = dataFromCache.data ;
            const parsedSym  = parsedMetaData["symbol"];
            if ( parsedSym === _id ||  parsedData.Symbol === _id ) {
                 console.log("getPositionData: available exact  "+JSON.stringify( _id))

                dispatch(savePositionBook(parsedData))
                return;
            }else {
                 console.log("getPositionData: available not exact symbol "+JSON.stringify( _id))
                  console.log("getPositionData:  "+JSON.stringify(parsedData))
                   dispatch(savePositionBook(parsedData))
            }
        }
        else {
             console.log("getPositionData: unavailable  " )
        }

        dispatch(enableLoader())


        try {
             // FETCH POSITION DATA only when SUER LOGGED ON 
 
               // IFF Logged in fetch the TRade Book 
         const res1 = StorageUtils._retrieve(CommonConstants.fyersToken);
        if (res1.isValid && res1.data !== null) {
            
            let auth_code = res1.data['auth_code'];
            if (auth_code&& auth_code !== null && auth_code !== undefined) {
                console.log("User is Authorized ");
                const fetchPositionBook = async () => {
                      for (let endP = 0 ; endP < POSITION_URL.length ; endP ++) { 
                       try {
                      
                         const res = await API.get(POSITION_URL[endP], {params: { "auth_code" : auth_code }});
                         const text = await res.data ;
                        // const lines = text.split('\n').filter(Boolean);
                           const bestMacthes1 = { bestMatches: [...mt] }; // 🔁 clone to avoid frozen reference
                            let json: any |undefined;
                            try {
                            json = JSON.parse(text);
                            console.log('Valid POSITION BOOK :', json);
                            } catch (e) {
                               json =  text ;
                             console.log('  POSITION BOOK :', JSON.stringify(json));  
                                 console.log('  BOOK :', JSON.stringify(json.netPositions));  
                             // console.error('Invalid JSON:', e);
                            }
                          if( json !== null && json !== undefined) { 
                            let lines = json.netPositions ; //json['netPositions'] ;
                                console.log('lines :', JSON.stringify (lines));  

                          const parsed = lines.map((line:any) => {
                           //const [symbol, name, ...rest] = line.split(','); // modify based on CSV structure
                           const result =  parseLine(line); // ;undefined
                           //console.log('line  :', JSON.stringify (line));  
                           //console.log(result); 
                           let positionRow: any |undefined;
                           if(result !==undefined)
                              {   
                                const stringMap: Record<string, string> = Object.fromEntries(
                                  Object.entries(result).map(([key, value]) => [key, String(value)])
                                      );
                                 if (!Object.isExtensible(bestMacthes1.bestMatches)) {
                                    console.warn("bestMatches array is frozen — recreating");
                                    bestMacthes1.bestMatches = [...bestMacthes1.bestMatches]; // force new clone
                                  }
                                  else {
                                     console.warn("bestMatches array is  not frozen ");
                                  //  console.warn("POSITION JSON  "+ JSON.stringify(stringMap));
                                  }
                                 // GET ONLY THOSE where the  
                                 // "netAvg": 0,
                                 //  "netQty": 0,
                                 // "side": 0,
                                 //  "qty": 0,   
                                    // all are not ZERO 
                              const convertedMap: Record<string, string | number> = Object.fromEntries(
                                 Object.entries(stringMap).map(([key, value]) => {
                                    const num = Number(value);
                                    if(key ==='avgPrice' &&  parseInt(value) ==0 )
                                     {
                                          return [];
                                     } 
                                      if(key ==='ltp' &&  parseInt(value) ==0 )
                                     {   return [];
                                     }
                                      if(key ==='netQty' &&  parseInt(value) ==0 )
                                     {    return [];
                                     }
                                     else { 
                                         return [key, isNaN(num) ? value : num];
                                     }
                                 })
                                 );
                                /* const convertedRows = convertedMap.map(row => ({
                                    ...row,
                                    avgPrice: Number(row.avgPrice),
                                    ltp: Number(row.ltp),
                                    netQty: Number(row.netQty)
                                    }));

                                  const stringMapNonZeroRows = convertedMap.filter(
                                     ({ avgPrice , ltp , netQty  }) => avgPrice  !== '0' ||  ltp   !== '0' || netQty
                                       !== '0'
                                    );  */
                                    console.log("valid position with no netQty 0  "+JSON.stringify(convertedMap));
                                 positionRow =convertedMap;
                               bestMacthes1.bestMatches.push(convertedMap); // ✅ safe now
                            //  setLocalMatches(prev => [...prev, stringMap]); // ✅ state-based update
                                   //bestMacthes["bestMatches"].push( stringMap)
                              } 
                            else {
                                console.log("parseed  result is null ")
                            }
                               return positionRow;
                            });
                           if(bestMacthes1["bestMatches"] !==undefined && Array.isArray(bestMacthes1["bestMatches"]) )
                           {  
                             console.log("bestMacthes total recros " + bestMacthes1["bestMatches"].length);
                             console.log("bestMacthes 5 record " + JSON.stringify(bestMacthes1["bestMatches"].slice(0, 5)));
                              const lastFive = JSON.stringify(bestMacthes1["bestMatches"].slice(-5));
                              console.log("bestMacthes last 5 record "  + lastFive);
                                const bestMacthes = { bestMatches: [...bestMacthes1.bestMatches] };
                              StorageUtils._save(CommonConstants.recentPositionsKey, bestMacthes.bestMatches) //StorageUtils._save(CommonConstants.recentEquitiesKey);
                              // EMPTY the SAMPLE position Data 
                             // StorageUtils._save(CommonConstants.positionDataCacheKey,CommonConstants.samplePositionDataEmpty1);
                              StorageUtils._save (CommonConstants.positionDataCacheKey, bestMacthes.bestMatches);
                              dispatch(savePositionBook(bestMacthes.bestMatches)); 
                              // DISABLE the LOAD MORE BELLOW as we have to show the BUY and SELL BUTTON 
                              dispatch(disableLoader())
                            } 
                         }  // POSITION JSON is not NULL and UNDEFINED 
                         else {
                            console.error("Company View POSITION BOOK NOT READ PROPERLY }:" );
                         }
                         // other option to store int the context 
                          // updateEquityState({ equities: parsed }); // ✅ Save in context
                
                       } catch (err) {
                         console.error("Company View POSITION BOOK  error:", err);
                       }
                      }
                     };
                     console.log("Company View tirgger position  BOOK ..");
                     fetchPositionBook();
              
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
