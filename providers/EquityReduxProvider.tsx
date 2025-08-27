import React, { createContext, useEffect, useState } from 'react';
import {AppDispatch, store} from '@/redux/store';
import {Provider, useDispatch, useSelector} from 'react-redux';
import { saveEquities } from '@/redux/slices/equitySlice';
import { StorageUtils } from '@/libs/cache';
import { CommonConstants } from '@/utils/constants';
import { FYERSAPINSECSV } from '@/libs/client';

const CustomContext = createContext<any>(null);
//const EquityContext = React.createContext<any>(null);

export const EquityReduxProvider = ({children}: { children: React.ReactNode }) => {
   const [fyersQuery, setFyersQuery] = useState( '');
   // const [equityState, setEquityState] = useState ( );
   const [equityState, setEquityState] = useState(() => ({
     ...store
    }));

    const updateEquityState = (newData: Partial<typeof store>) => {
          setEquityState(prev => ({
            ...prev,
            ...newData
          }));
    } ;
     let mt:any[] = [];
       //  const bestMacthes = { "bestMatches" :mt };
      let bestMacthes = { bestMatches: [...mt] }; // 🔁 clone to avoid frozen reference
  const [matches, setMatches] = useState<typeof bestMacthes>( );
  const [localMatches, setLocalMatches] = useState<any[]>([]);
  const [csvData, setCsvData] = useState<typeof bestMacthes>( );
 // const CSV_URL = 'https://drive.google.com/uc?export=download&id=1UjjQcDHiRIPxbzZOTZaWrLQjKtVzZjp_';
  const CSV_URL  = [   FYERSAPINSECSV +'/NSE_CM.csv' ] ; //'http://localhost:8888/NSE_CM.csv' ,
  const dispatch = useDispatch();

 // // Example usage
 //const line = "1010000000100,AMARA RAJA ENERGY MOB LTD,0,1,0.05,INE885A01032,0915-1530|1815-1915:,2023-11-28,,NSE:ARE&M-EQ,10,10,100,ARE&M,100,-1.0,XX,1010000000100,None";
 //const result = parseLine(line);
  const parseLine = (line: string): Record<string, any>  => {
          const parts = line.split(',');

          const rawName = parts[1];            // "AMARA RAJA ENERGY MOB LTD"
          const symbol = parts[9];            // "NSE:ARE&M-EQ"
          const cleaned = symbol.replace(/^NSE:|[-_]EQ$/g, "");
          const sym = { "1. symbol": `${cleaned}`  };
          let rw = {  "2. name": rawName  };
          
          let type =  { "3. type": "ETF" };
          if(symbol.includes('NCD') || rawName.includes('NCD')){
            type =  { "3. type": "NCD" };
          }
          else if(symbol.includes('EQ')){
             type =  { "3. type": "Equity" };
          }
          else if(symbol.includes('BOND')){
             type =  { "3. type": "BOND" };
          }
           else if(symbol.includes('NAV')){
             type =  { "3. type": "BOND" };
          }
           else if(symbol.includes('INDEX')){
             type =  { "3. type": "INDEX" };
          }
          const region =  { "4. region": "India/Bombay" };
          const marketOpen =  { "5. marketOpen": "09:15" };
          const marketClose =  { "6. marketClose": "15:30" };
          const timezone =  {"7. timezone": "UTC+5.5" };
          const currency =  {"8. currency": "INR" };
          const matchScore =  {"9. matchScore": "0.6250" };

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
            rw = {  "2. name": name  };

      return {  ...sym,
              ...rw,
              ...type,
              ...region,
              ...marketOpen,
              ...marketClose,
              ...timezone,
              ...currency,
              ...matchScore  };
   };
     // Fetch CSV once
   useEffect(() => {
     const fetchCSV = async () => {
      for (let endP = 0 ; endP < CSV_URL.length ; endP ++) { 
       try {
      
         const res = await fetch(CSV_URL[endP]);
         const text = await res.text();
         const lines = text.split('\n').filter(Boolean);
          const bestMacthes1 = { bestMatches: [...mt] }; // 🔁 clone to avoid frozen reference
         const parsed = lines.map(line => {
           //const [symbol, name, ...rest] = line.split(','); // modify based on CSV structure
           const result = parseLine(line);
           //console.log(result); 
           let kt =  Object.keys(result);
            let symbol ='';//Object(result)?.hasProperty["1. symbol"];
           let name  =''; //Object(result)?.hasProperty["2. name"];
           kt.forEach( k => {  //console.log("result ke "+kt); 
                  //console.log(`Key: ${k}, Value: ${result[k]}`);
                 if(symbol == undefined){
                   if(k==='1. symbol'  ){
                        symbol = result[k]
                   }
                    if(  k==='2. name' ){
                        name = result[k]
                   }
                 }
           })                  
          
           if(result !=undefined)
              {  
                
                const stringMap: Record<string, string> = Object.fromEntries(
                  Object.entries(result).map(([key, value]) => [key, String(value)])
                      );
                 if (!Object.isExtensible(bestMacthes1.bestMatches)) {
                    console.warn("bestMatches array is frozen — recreating");
                    bestMacthes1.bestMatches = [...bestMacthes1.bestMatches]; // force new clone
                  }

               bestMacthes1.bestMatches.push(stringMap); // ✅ safe now
              setLocalMatches(prev => [...prev, stringMap]); // ✅ state-based update
            
                   //bestMacthes["bestMatches"].push( stringMap)
              };
              return {  symbol, name };
           });
           if(bestMacthes1["bestMatches"] !==undefined && Array.isArray(bestMacthes1["bestMatches"]) )
           {  
             console.log("bestMacthes total recros " + bestMacthes1["bestMatches"].length);
             console.log("bestMacthes 5 record " + JSON.stringify(bestMacthes1["bestMatches"].slice(0, 5)));
              const lastFive = JSON.stringify(bestMacthes1["bestMatches"].slice(-5));
              console.log("bestMacthes last 5 record "  + lastFive);
                const bestMacthes = { bestMatches: [...bestMacthes1.bestMatches] };
            /* if (!Object.isExtensible(bestMacthes.bestMatches)) {
                    console.warn("bestMatches array is frozen — recreating");
                    bestMacthes.bestMatches = [...bestMacthes1.bestMatches]; // force new clone
              }*/
              StorageUtils._save(CommonConstants.recentEquitiesKey, bestMacthes) //StorageUtils._save(CommonConstants.recentEquitiesKey);
             
               setCsvData(bestMacthes);
               dispatch(saveEquities(bestMacthes)); 
            
            }
           
          // other option to store int the context 
          // updateEquityState({ equities: parsed }); // ✅ Save in context

       } catch (err) {
         //console.error("CSV fetch error:", err);
         console.log("CSV fetch error:", err);
       }
      }
     };
     console.log("EquityReduxProvider initiating fetche CSV ..");
     fetchCSV();
     
   }, []);
   // other option }, [updateEquityState]);
  
     // Filter when query changes
   useEffect(() => {
     if (fyersQuery.length < 3) {
       setMatches({ bestMatches : []});
       return;
     }
 
     const prefix = fyersQuery.toLowerCase().slice(0, 3);
 
     const filtered = csvData?.bestMatches.filter(
     (item : any)=> item["2. name"].toLowerCase().startsWith(prefix)
     ).slice(0, 5);
      console.log("EquityReduxProvider filtering fetche CSV ..");
      if( filtered !==undefined)
          { setMatches({ bestMatches :  filtered}); }
   }, [fyersQuery, csvData]);


    return (
        <CustomContext.Provider value={{ equityState, updateEquityState }}>{children}</CustomContext.Provider>
    )
}
//export const useEquity = () => React.useContext(CustomContext);
export const useEquity = () => {
   console.log("EquityReduxProvider use equity set ..");
  return useSelector((state: any) => state.equity); // strongly type with RootState if available
};
export const useAppDispatch: () => AppDispatch = useDispatch;
