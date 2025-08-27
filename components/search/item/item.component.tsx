"use client";
import React from 'react'
import Link from "next/link";
import {useAppDispatch} from "@/providers/ReduxProvider";
import {saveSelectedCard} from "@/redux/slices/stockSlice";
import {useSelector} from "react-redux";
import {GlobalState} from "@/redux/store";
import { FYERSAPI } from '@/libs/client';
import { StorageUtils } from '@/libs/cache';
import { CommonConstants } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import {saveCompanyData} from "@/redux/slices/stockSlice"

/*
{"message":"","code":200,"d":[{"n":"NSE:ICICIBANK-EQ","v":{"ask":0,"bid":1416.1,"chp":-0.64,"ch":-9.1,
"description":"NSE:ICICIBANK-EQ","exchange":"NSE","fyToken":"10100000004963",
"high_price":1421.5,"low_price":1403.6,"lp":1416.1,"open_price":1403.6,"original_name":"NSE:ICICIBANK-EQ",
"prev_close_price":1425.2,"short_name":"ICICIBANK-EQ","spread":0,"symbol":"NSE:ICICIBANK-EQ",
"tt":"1749945600","volume":7573103,"atp":1413.66},"s":"ok"}],
"s":"ok"}
*/
const getAlpaVantageStyleStock = (fyersQuote:any ) => {
      if(fyersQuote["d"] !== undefined && Array.isArray(fyersQuote["d"] )){
          let quoteArray = fyersQuote["d"] ; 
          let quoteEntry = quoteArray[0]["n"]; 
          let quoteVal = quoteArray[0]["v"];
          let ticker   = quoteVal["original_name"];
          let  volume  = quoteVal["volume"];
          let  price  = quoteVal["lp"] + ""; 
          let  change_amount   = quoteVal["ch"]+ "";
          let  change_percentage  = quoteVal["chp"]+"";
          let  exchange = quoteVal["exchange"];
         console.log("Fyers Qoute received for  "+quoteEntry );
          let fyersStock = {symbol : ticker  ,  ticker: ticker , volume: volume , price :price ,
               change_amount:change_amount , change_percentage:change_percentage ,exchange: exchange};
            return fyersStock ;

      }
      else { 
         console.log("Fyers Qoute parse failed  sending default  "  );
         let fyersStock = {symbol : "NSE:ICICIBANK-EQ"  ,  ticker: "NSE:ICICIBANK-EQ" , volume: "7573103" ,
           price :"1403.6" ,
               change_amount:"-9.1" , change_percentage:"-0.64" ,  exchange: "NSE" };
          return fyersStock ;
 
      }

}
const SearchCard = ({item}: { item: any }) => {
    const dispatch = useAppDispatch();
    const gainers = useSelector((state: GlobalState) => state.stock.gainers)
    const losers = useSelector((state: GlobalState) => state.stock.gainers)
      const router = useRouter();
      /*  <Link href={`/company/${ ticker}`} onClick={() => {
            dispatch(saveSelectedCard({...stock, ticker:ticker}))
        }}>
     */
    return (
        <Link href={{
            pathname: `/`
        }}
              onClick={() => {
                  let data;
                   ( async () => {
                    //{params: {function: 'TOP_GAINERS_LOSERS' , apikey:CommonConstants.apiKey}}
                     let tokenauth = StorageUtils._retrieve(CommonConstants.fyersToken);
                     let auth_code ='';
                    if (tokenauth.isValid && tokenauth.data !== null) {
                        console.log("User is Authorized ");
                          auth_code = tokenauth.data['auth_code'];
                    }
                  //let res =  await FYERSAPI.get('/fyerscallback' )
                   let symbol  = item['1. symbol'] ;
                   console.log("item['1. symbol']  "+symbol);
                  let sy = item['1. symbol'].substring(0, item['1. symbol'].indexOf(   "."));
                  
                   sy   = (sy=='' || sy === undefined) ? symbol: sy;
                   console.log("symbol "+sy);
                   // '/fyersgetquote' 
                  let res =     await FYERSAPI.get('/fyersquicklogin', {params: {auth_code :auth_code , symbol:sy , apikey:CommonConstants.apiKey}})
                  //  popupCenter(FYERSAPILOGINURL, "Fyers Signin")

                  let data = await res .data; 
                  console.log("click data "+JSON.stringify(data))
                  if( data ===undefined){
                    data =  gainers[0]; // gainers.map((elem: any) => elem.ticker === "SBET")
                    if (!data.length) {
                        data = losers.map((elem: any) => elem.ticker === item['1. symbol'])
                    }
                    if (data.length == 1) {
                        console.log( "click data length ==1 : "+JSON.stringify(data))
                        dispatch(saveSelectedCard(data[0]))
                    }
                    console.log( "click data "+JSON.stringify(data))
                    console.log( "click item "+JSON.stringify(item))
                    if( item !==undefined){
                       if (!data.length) {
                          let stock =  data['2. symbol'];
                          let ticker = stock;
                           StorageUtils._save (CommonConstants.companyDataCacheKey,data);
                          // this will allow the 
                          //  const dataFromCache = StorageUtils._retrieve(CommonConstants.companyDataCacheKey)
                          // to retrive properly when router hits `/company/${ticker}`
                           dispatch(saveCompanyData(data))

                           dispatch(saveSelectedCard({ ...stock, ticker:ticker }));
                             router.push(`/company/${ticker}`);
                         //  dispatch(saveSelectedCard(data))
                       }
                       else {  dispatch(saveSelectedCard(data[0]));
                       }
                    }
                  }
                  else {
                     console.log( "data not undefined "+JSON.stringify(data.length))
                      if (data.length === undefined) {
                          //let stock =    data["Meta Data"]["2. Symbol"]; //data['2. symbol'];
                          let stock =    data["Meta Data"]; // ["2. Symbol"]; //data['2. symbol'];
                          if(stock !== undefined){
                            let ticker = stock["2. Symbol"];
                            if(ticker !== undefined){
                             console.log( "stock "+JSON.stringify(stock))
                             console.log( "ticker "+JSON.stringify(ticker))
                             console.log( "{ ...stock, ticker:ticker } "+JSON.stringify({ ...stock, ticker:ticker }))
                             StorageUtils._save (CommonConstants.companyDataCacheKey,data);
                            // this will allow the 
                            //  const dataFromCache = StorageUtils._retrieve(CommonConstants.companyDataCacheKey)
                            // to retrive properly when router hits `/company/${ticker}`
                            //  dispatch(saveCompanyData(data))
                              // dispatch(saveSelectedCard({ ...stock, ticker:ticker }));
                             let quoteResponse =     await FYERSAPI.get('/fyersgetquote', {params: {auth_code :auth_code , symbol:sy , apikey:CommonConstants.apiKey}})
                            
                             let quoteData = await quoteResponse .data; 
                             let  alphaStock =   getAlpaVantageStyleStock(quoteData); 

                             dispatch(saveSelectedCard({ ...alphaStock, ticker:ticker }));
                              router.push(`/company/${ticker}`);
                            }
                            else {
                               console.log( "Meta Data / 2. Symbol not visible ticker not set ")
                            }
                            
                          }
                          else {
                             console.log( "/fyersquicklogin symbol  "+sy+" failed ")
                          }
                       //   let ticker = stock;
                         //  console.log( "stock "+JSON.stringify(stock))
                         //  console.log( "ticker "+JSON.stringify(ticker))
                         //   console.log( "{ ...stock, ticker:ticker } "+JSON.stringify({ ...stock, ticker:ticker }))
                         //  dispatch(saveSelectedCard({ ...stock, ticker:ticker }));
                         //    router.push(`/company/${ticker}`);
                         //  dispatch(saveSelectedCard(data))
                       }
                      
                  }
                  return res;
                }) ();
                //const result =  Promise.all([    fyerLoginProm()]);  
                //result.then((res) => {
                //    let data = res[0].data; 
                //    console.log("click data "+JSON.stringify(data))
               // });
                 // data = gainers.map((elem: any) => elem.ticker === item['1. symbol'])
                
              }}
              className='flex  flex-col md:flex-row hover:opacity-50 transition-all cursor-pointer items-center py-1 my-3 justify-between'>
            <div className='w-full md:w-auto'>
                <p className='text-sm text-black font-semibold dark:text-white'>{item['1. symbol']} ({item['8. currency']})</p>
                <p className='text-xs text-black dark:text-white'>{item['5. marketOpen']} - {item['6. marketClose']}</p>
            </div>
            <div className='text-left md:text-right w-full md:w-auto'>
                <p className='text-sm text-black dark:text-white'>{item['2. name']}</p>
                <p className='text-xs text-black dark:text-white'>{item['4. region']}</p>
            </div>
        </Link>
    )
}

export default SearchCard
