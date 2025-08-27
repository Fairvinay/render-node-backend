import {StorageUtils} from "@/libs/cache"
import {API} from "@/libs/client"
import {disableLoader, enableLoader} from "@/redux/slices/miscSlice"
import {saveCompanyData} from "@/redux/slices/stockSlice"
import { saveHoldingBook } from '@/redux/slices/holdingSlice';
import {CommonConstants} from "@/utils/constants"
import toast from "react-hot-toast"
import { FYERSAPINSECSV , FYERSAPIHOLDINGSURL  } from '@/libs/client';


 const HOLDINGS_URL  = [   FYERSAPIHOLDINGSURL  ] ;
 const parseLine = (line: string): Record<string, any>  => {
          const parts = line; //split(',');

          const costPrice = parts[0];            // clientId   "AMARA RAJA ENERGY MOB LTD"
       //   const ordertime = parts[1];                //orderDateTime
        //   const orderNumber = parts[2];           //  orderNumber
      //      const exchangeOrderNo = parts[3];           //  exchangeOrderNo
          const symbol = parts[3];           //  symbol
          const quantity = parts[5];           //  quantity
          const exchange = parts[6];           //  exchange
     //         const side = parts[5];           //  side
          const segment = parts[7];           //  segment
          const pl = parts[12];           //  productType
          const ltp = parts[13];           //  ltp
          const marketVal = parts[14];           //  marketVal
                const orderType = parts[15];           //  orderType
    //             const fyToken = parts[8];           //  fyToken
    //              const tradeNumber = parts[13];           //  tradeNumber
    //      const row = parts[14];           //  row
     //     const orderTag = parts[16];           //  orderTag

          //const symbol = parts[9];            // "NSE:ARE&M-EQ"
          const cleaned = symbol.replace(/^NSE:|[-_]EQ$/g, "");
          const sym = { "symbol": `${cleaned}`  };
          let qty = {  "quantity": quantity  };
          
          let type =  { "orderType": orderType };
         /* if(symbol.includes('NCD') || rawName.includes('NCD')){
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
          }*/
          const region =  { "4. region": "India/Bombay" };
          const marketOpen =  { "5. marketOpen": "09:15" };
          const marketClose =  { "6. marketClose": "15:30" };
          const timezone =  {"7. timezone": "UTC+5.5" };
          const currency =  {"8. currency": "INR" };
          const prodtype =  {"pl": pl };
          const price =  {"ltp": ltp };
          const tvalue =  {"costPrice": costPrice };
            
          const texchange =  {"exchange": exchange };
          const tmarketVal =  {"marketVal": marketVal };

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
        //  const name = rawName.split(' ').slice(0, 3).join(' '); // "AMARA RAJA ENERGY"
           // rw = {  "2. name": name  };

      return {  ...sym,
              
              ...type,
              ...qty,
              ...price,
              ...tvalue,
              ...prodtype ,
              ...texchange,
              ...tmarketVal
               
                };
   };

export const getHoldingData = (_id: string | string[]) => {
      // SAMPLE HOLDINGSS DEFAULT DATA 
       console.log("getHoldingData: _id  "+JSON.stringify( _id))
         let mt:any[] = [];
      StorageUtils._save (CommonConstants.tradeDataCacheKey,CommonConstants.sampleHoldingDataVersion1);
    return async (dispatch: Function) => {
        const dataFromCache = StorageUtils._retrieve(CommonConstants.tradeDataCacheKey)
        if (dataFromCache.isValid && dataFromCache.data !== null) {
             console.log("getHoldingData: available  " )
            const parsedData = dataFromCache.data
            const parsedMetaData = dataFromCache.data ;
            const parsedSym  = parsedMetaData["symbol"];
            if ( parsedSym === _id ||  parsedData.Symbol === _id ) {
                 console.log("getHoldingData: available exact  "+JSON.stringify( _id))

                dispatch(saveHoldingBook(parsedData))
                return;
            }else {
                 console.log("getHoldingData: available not exact symbol "+JSON.stringify( _id))
                  console.log("getHoldingData:  "+JSON.stringify(parsedData))
                   StorageUtils._save (CommonConstants.holdingsDataCacheKey,parsedData);
                   dispatch(saveHoldingBook(parsedData))
            }
        }
        else {
             console.log("getHoldingData: unavailable  " )
        }

        dispatch(enableLoader())


        try {
             // FETCH HOLDINGS DATA only when SUER LOGGED ON 
 
               // IFF Logged in fetch the TRade Book 
         const res1 = StorageUtils._retrieve(CommonConstants.fyersToken);
        if (res1.isValid && res1.data !== null) {
            
            let auth_code = res1.data['auth_code'];
            if (auth_code&& auth_code !== null && auth_code !== undefined) {
                console.log("User is Authorized ");
                const fetchHoldingBook = async () => {
                      for (let endP = 0 ; endP < HOLDINGS_URL.length ; endP ++) { 
                       try {
                      
                         const res = await API.get(HOLDINGS_URL[endP], {params: { "auth_code" : auth_code }});
                         const text = await res.data ;
                        // const lines = text.split('\n').filter(Boolean);
                           const bestMacthes1 = { bestMatches: [...mt] }; // 🔁 clone to avoid frozen reference
                            let json;
                            try {
                            json = JSON.parse(text);
                            console.log('Valid HOLDINGS BOOK :', json);
                            } catch (e) {
                              console.error('Invalid JSON:', e);
                            }
                            if( json !==null && json ! == undefined) { 
                            const lines = json["holdings"];
                           const parsed = lines.map((line:any) => {
                           //const [symbol, name, ...rest] = line.split(','); // modify based on CSV structure
                           const result = parseLine(line);
                           //console.log(result); 
                           let tradeRow: any |undefined;
                            if(result !=undefined)
                              {   
                                const stringMap: Record<string, string> = Object.fromEntries(
                                  Object.entries(result).map(([key, value]) => [key, String(value)])
                                      );
                                 if (!Object.isExtensible(bestMacthes1.bestMatches)) {
                                    console.warn("bestMatches array is frozen — recreating");
                                    bestMacthes1.bestMatches = [...bestMacthes1.bestMatches]; // force new clone
                                  }
                                 tradeRow =stringMap;
                               bestMacthes1.bestMatches.push(stringMap); // ✅ safe now
                            //  setLocalMatches(prev => [...prev, stringMap]); // ✅ state-based update
                                   //bestMacthes["bestMatches"].push( stringMap)
                              };
                              return tradeRow;
                           });
                           if(bestMacthes1["bestMatches"] !==undefined && Array.isArray(bestMacthes1["bestMatches"]) )
                           {  
                             console.log("bestMacthes total recros " + bestMacthes1["bestMatches"].length);
                             console.log("bestMacthes 5 record " + JSON.stringify(bestMacthes1["bestMatches"].slice(0, 5)));
                              const lastFive = JSON.stringify(bestMacthes1["bestMatches"].slice(-5));
                              console.log("bestMacthes last 5 record "  + lastFive);
                                const bestMacthes = { bestMatches: [...bestMacthes1.bestMatches] };
                              StorageUtils._save(CommonConstants.recentHoldingsKey, bestMacthes.bestMatches) //StorageUtils._save(CommonConstants.recentEquitiesKey);
                               dispatch(saveHoldingBook(bestMacthes.bestMatches)); 
                            
                            }
                         }  // HOLDINGS JSON is not NULL and UNDEFINED 
                         else {
                            console.error("Company View HOLDINGS BOOK NOT READ PROPERLY }:" );
                         }
                         // other option to store int the context 
                          // updateEquityState({ equities: parsed }); // ✅ Save in context
                
                       } catch (err) {
                         console.error("Company View HOLDINGS BOOK  error:", err);
                       }
                      }
                     };
                     console.log("Company View tirgger HOLDINGS  BOOK ..");
                     fetchHoldingBook();
              
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
