import {StorageUtils} from "@/libs/cache"
import {API} from "@/libs/client"
import {disableLoader, enableLoader} from "@/redux/slices/miscSlice"
import {saveCompanyData} from "@/redux/slices/stockSlice"
import { saveTradeBook } from '@/redux/slices/tradeSlice';
import {CommonConstants} from "@/utils/constants"
import toast from "react-hot-toast"
import { FYERSAPINSECSV , FYERSAPITRADEBOOKURL} from '@/libs/client';


 const TRADE_URL  = [   FYERSAPITRADEBOOKURL  ] ;
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
            const tradedQty =  (parts['tradedQty']!==undefined ?  parts['tradedQty']: "");            //10  tradedQty
           //  console.log("parts.tradedQty "+parts['tradedQty']);  
                const tradePrice =  (parts['tradePrice']!==undefined ?  parts['tradePrice']: "");           //11  tradePrice
            //     console.log("parts.tradePrice "+parts['tradePrice']);  
                 const tradeValue =  (parts['tradeValue'] !==undefined ?  parts['tradeValue']: "");           //12  tradeValue
            //      console.log("parts.tradeValue "+parts['tradeValue']);  
                  const tradeNumber =  (parts['tradeNumber'] !==undefined ?  parts['tradeNumber']: "");           //13  tradeNumber
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
          let qty = {  "tradedQty": tradedQty  };
          
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
          const price =  {"tradePrice": tradePrice };
          const tvalue =  {"tradeValue": tradeValue };
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
             //   console.log("trade line "+JSON.stringify(trads))
      return trads;
   };

export const getTradeData = (_id: string | string[]) => {
      // SAMPLE TRADES DEFAULT DATA 
       console.log("getTradeData: _id  "+JSON.stringify( _id))
         let mt:any[] = [];
      StorageUtils._save (CommonConstants.tradeDataCacheKey,CommonConstants.sampleTradeDataVersion1);
    return async (dispatch: Function) => {
        const dataFromCache = StorageUtils._retrieve(CommonConstants.tradeDataCacheKey)
        if (dataFromCache.isValid && dataFromCache.data !== null) {
             console.log("getTradeData: available  " )
            const parsedData = dataFromCache.data
            const parsedMetaData = dataFromCache.data ;
            const parsedSym  = parsedMetaData["symbol"];
            if ( parsedSym === _id ||  parsedData.Symbol === _id ) {
                 console.log("getTradeData: available exact  "+JSON.stringify( _id))

                dispatch(saveTradeBook(parsedData))
                return;
            }else {
                 console.log("getTradeData: available not exact symbol "+JSON.stringify( _id))
                  console.log("getTradeData:  "+JSON.stringify(parsedData))
                   dispatch(saveTradeBook(parsedData))
            }
        }
        else {
             console.log("getTradeData: unavailable  " )
        }

        dispatch(enableLoader())


        try {
             // FETCH TRADE DATA only when SUER LOGGED ON 
 
               // IFF Logged in fetch the TRade Book 
         const res1 = StorageUtils._retrieve(CommonConstants.fyersToken);
        if (res1.isValid && res1.data !== null) {
            
            let auth_code = res1.data['auth_code'];
            if (auth_code&& auth_code !== null && auth_code !== undefined) {
                console.log("User is Authorized ");
                const fetchTradeBook = async () => {
                      for (let endP = 0 ; endP < TRADE_URL.length ; endP ++) { 
                       try {
                      
                         const res = await API.get(TRADE_URL[endP], {params: { "auth_code" : auth_code }});
                         const text = await res.data ;
                        // const lines = text.split('\n').filter(Boolean);
                           const bestMacthes1 = { bestMatches: [...mt] }; // 🔁 clone to avoid frozen reference
                            let json: any |undefined;
                            try {
                            json = JSON.parse(text);
                            console.log('Valid TRADE BOOK :', json);
                            } catch (e) {
                               json =  text ;
                             console.log('  TRADE BOOK :', JSON.stringify(json));  
                                 console.log('  BOOK :', JSON.stringify(json['tradeBook']));  
                             // console.error('Invalid JSON:', e);
                            }
                          if( json !== null && json !== undefined) { 
                            let lines = json['tradeBook'] ;
                                console.log('lines :', JSON.stringify (lines));  

                          const parsed = lines.map((line:any) => {
                           //const [symbol, name, ...rest] = line.split(','); // modify based on CSV structure
                           const result =  parseLine(line); // ;undefined
                           //console.log('line  :', JSON.stringify (line));  
                           //console.log(result); 
                           let tradeRow: any |undefined;
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
                                  //  console.warn("TRADE JSON  "+ JSON.stringify(stringMap));
                                  }
                                 tradeRow =stringMap;
                               bestMacthes1.bestMatches.push(stringMap); // ✅ safe now
                            //  setLocalMatches(prev => [...prev, stringMap]); // ✅ state-based update
                                   //bestMacthes["bestMatches"].push( stringMap)
                              } 
                            else {
                                console.log("parseed  result is null ")
                            }
                               return tradeRow;
                            });
                           if(bestMacthes1["bestMatches"] !==undefined && Array.isArray(bestMacthes1["bestMatches"]) )
                           {  
                             console.log("bestMacthes total recros " + bestMacthes1["bestMatches"].length);
                             console.log("bestMacthes 5 record " + JSON.stringify(bestMacthes1["bestMatches"].slice(0, 5)));
                              const lastFive = JSON.stringify(bestMacthes1["bestMatches"].slice(-5));
                              console.log("bestMacthes last 5 record "  + lastFive);
                                const bestMacthes = { bestMatches: [...bestMacthes1.bestMatches] };
                              StorageUtils._save(CommonConstants.recentTradesKey, bestMacthes.bestMatches) //StorageUtils._save(CommonConstants.recentEquitiesKey);
                              // EMPTY the SAMPLE trade Data 
                              StorageUtils._save(CommonConstants.tradeDataCacheKey,CommonConstants.sampleTradeDataEmpty1);
                              dispatch(saveTradeBook(bestMacthes.bestMatches)); 
                            
                            } 
                         }  // TRADE JSON is not NULL and UNDEFINED 
                         else {
                            console.error("Company View TRADE BOOK NOT READ PROPERLY }:" );
                         }
                         // other option to store int the context 
                          // updateEquityState({ equities: parsed }); // ✅ Save in context
                
                       } catch (err) {
                         console.error("Company View TRADE BOOK  error:", err);
                       }
                      }
                     };
                     console.log("Company View tirgger trade  BOOK ..");
                     fetchTradeBook();
              
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
