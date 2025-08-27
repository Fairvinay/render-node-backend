 
import React, {Suspense, useEffect , useState} from "react";
import { CommonConstants } from "@/utils/constants";
import { StorageUtils } from "@/libs/cache";
import { AnyAction } from "@reduxjs/toolkit";
//import React, {useEffect, useState} from 'react'


const OrderTable  = ({   orderDataB   }) => {
   let data = orderDataB;
   const [parsedData, setParsedData] = useState(() => JSON.parse(StorageUtils._retrieve(CommonConstants.orderDataCacheKey).data));
      useEffect(() => {
           console.log("OrderTable:   " )
         
           // FETH The recentTRades from storage if above call succeeded data will be there
           let redentTradeData =  StorageUtils._retrieve(CommonConstants.recentTradesKey)
            const dataFromCache = StorageUtils._retrieve(CommonConstants.orderDataCacheKey)
            let orders ='';
            if( dataFromCache === null ||  dataFromCache['data']  === ''  || dataFromCache['data']=== null || dataFromCache['data'] ===undefined){
                     console.log("orders fetched  trade data empty ")
            }else {
               console.log("orders fetched fro cahce "+JSON.stringify(dataFromCache['data']))
               orders = dataFromCache.data ;
            }
           data  =   (orderDataB !== undefined && orderDataB.length !=0 ) ? orderDataB : orders;
            console.log("orders data  "+JSON.stringify(data))
            console.log("orders data length  "+ data.length )
            let parsed = JSON.parse(data);
              setParsedData(parsed);
              console.log("orders data typeof  "+ (typeof data ) )
               console.log("orders data parsedData  "+ (typeof parsed ) )
            console.log("orders data parsedData length  "+ (  parsed.length ) )
             parsed.map( (rw ) => { 
                  console.log("   "+ JSON.stringify(rw) )  
                  console.log("  rw[0]  "+  rw[0] )  
                   console.log("symbol    "+  rw["symbol"] )  
             })


       }, [orderDataB]);
   /*{
    Instrument: tradeDataB[0] || "SAMPLE",
    Quantity: tradeDataB[1] || "102",
    Price: tradeDataB[2] || "1202",
    "Trade Value": tradeDataB[3] || "14203",
    "Product Type": tradeDataB[4] || "F&O",
  };*/

  return (
    <div className="overflow-x-auto w-full bg-zinc-100">
         <h1 className='text-black font-semibold mb-2 dark:text-white text-lg'>Order Book </h1>
         <p className='text-black text-sm leading-loose dark:text-white'>
            {new Date().toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }).replace(/(\d+)(?=,)/, (day) => {
              const suffix = ['th', 'st', 'nd', 'rd'];
              const v = day % 100;
              return day + (suffix[(v - 20) % 10] || suffix[v] || suffix[0]);
            }).replace(',', '')}
          </p>
      <table className="min-w-full text-sm text-left border border-gray-200 shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="py-2 px-4 border-b">Instrument</th>
            <th className="py-2 px-4 border-b">Exchange</th>
            <th className="py-2 px-4 border-b">Quantity</th>
            <th className="py-2 px-4 border-b">Last Price </th>
            <th className="py-2 px-4 border-b">Trade Price </th>
            <th className="py-2 px-4 border-b">Limit Price</th>
            <th className="py-2 px-4 border-b">Stop Price</th>
            <th className="py-2 px-4 border-b">Order Time</th>
            <th className="py-2 px-4 border-b">Validity </th>

          </tr>
        </thead> {/* parsedData.length ? parsedData : [[
            "SAMPLE","102" , "F&O", "1202", "14203"
          ]] */ }
        <tbody> 
         {parsedData.length > 0 ? parsedData.map((row , index ) => (
            <tr key={index} className="bg-white hover:bg-gray-50 transition">
            <td className="py-2 px-4 border-b">{row["symbol"]}</td>
            <td className="py-2 px-4 border-b">{` ${(row["exchange"] == '10 ') ? 'NSE': "BSE"}`}</td>
            <td className="py-2 px-4 border-b">{row["qty"]}</td>
             <td className="py-2 px-4 border-b">{row["lp"]}</td>
            <td className="py-2 px-4 border-b">{row["tradedPrice"]}</td>
            <td className="py-2 px-4 border-b">{row["limitPrice"]}</td>
            <td className="py-2 px-4 border-b">{row["stopPrice"]}</td>
            <td className="py-2 px-4 border-b">{row["orderDateTime"]}</td>
           
            <td className="py-2 px-4 border-b">{row["orderValidity"]}</td>
            
            </tr>
        )) : (
            <tr><td colSpan="5" className="text-center py-4">No orders found</td></tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
