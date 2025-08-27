 
import React, {Suspense, useEffect , useState} from "react";
import { CommonConstants } from "@/utils/constants";
import { StorageUtils } from "@/libs/cache";
//import React, {useEffect, useState} from 'react'


const HoldingsTable
 = ({   holdingsDataB   }) => {
   let data = holdingsDataB;
   const [parsedData, setParsedData] = useState(() => JSON.parse(StorageUtils._retrieve(CommonConstants.holdingsDataCacheKey).data));
      useEffect(() => {
           console.log("HoldingsTable:   " )
         
           // FETH The recentTRades from storage if above call succeeded data will be there
           let redentTradeData =  StorageUtils._retrieve(CommonConstants.recentTradesKey)
            const dataFromCache = StorageUtils._retrieve(CommonConstants.holdingsDataCacheKey)
            let holdings ='';
            if( dataFromCache === null ||  dataFromCache['data']  === ''  || dataFromCache['data']=== null || dataFromCache['data'] ===undefined){
                     console.log("holdings fetched  trade data empty ")
            }else {
               console.log("holdings fetched fro cahce "+JSON.stringify(dataFromCache['data']))
               holdings = dataFromCache.data ;
            }
           data  =   (holdingsDataB !== undefined && holdingsDataB.length !=0 ) ? holdingsDataB : holdings;
            console.log("holdings data  "+JSON.stringify(data))
            console.log("holdings data length  "+ data.length )
            let parsed = JSON.parse(data);
              setParsedData(parsed);
              console.log("holdings data typeof  "+ (typeof data ) )
               console.log("holdings data parsedData  "+ (typeof parsed ) )
            console.log("holdings data parsedData length  "+ (  parsed.length ) )
             parsed.map( rw => { 
                  console.log("   "+ JSON.stringify(rw) )  
                  console.log("  rw[0]  "+  rw[0] )  
                   console.log("symbol    "+  rw["symbol"] )  
             })


       }, [holdingsDataB]);
   /*{
    Instrument: tradeDataB[0] || "SAMPLE",
    Quantity: tradeDataB[1] || "102",
    Price: tradeDataB[2] || "1202",
    "Trade Value": tradeDataB[3] || "14203",
    "Product Type": tradeDataB[4] || "F&O",
  };*/

  return (
    <div className="overflow-x-auto w-full bg-zinc-100">
         <h1 className='text-black font-semibold mb-2 dark:text-white text-lg'>Holdings Book </h1>
      <table className="min-w-full text-sm text-left border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="py-2 px-4 border-b">Instrument</th>
            <th className="py-2 px-4 border-b">Exchange</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Cost Price</th>
            <th className="py-2 px-4 border-b">Market Price</th>
            <th className="py-2 px-4 border-b">Market Value</th>
            <th className="py-2 px-4 border-b">Profit/Loss</th>

          </tr>
        </thead> {/* parsedData.length ? parsedData : [[
            "SAMPLE","102" , "F&O", "1202", "14203"
          ]] */ }
        <tbody> 
         {parsedData.length > 0 ? parsedData.map((row, index) => (
            <tr key={index} className="bg-white hover:bg-gray-50 transition">
            <td className="py-2 px-4 border-b">{row["symbol"]}</td>
            <td className="py-2 px-4 border-b">{` ${(row["exchange"] == '10 ') ? 'NSE': "BSE"}`}</td>
            <td className="py-2 px-4 border-b">{row["quantity"]}</td>
            <td className="py-2 px-4 border-b">{row["costPrice"]}</td>
            <td className="py-2 px-4 border-b">{row["ltp"]}</td>
            <td className="py-2 px-4 border-b">{row["marketVal"]}</td>
            <td className="py-2 px-4 border-b">{row["pl"]}</td>
            </tr>
        )) : (
            <tr><td colSpan="5" className="text-center py-4">No holdings found</td></tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default HoldingsTable;
