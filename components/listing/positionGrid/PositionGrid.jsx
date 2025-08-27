 
import React, {Suspense, useEffect , useState,useMemo} from "react";
import { ToggleLeft, Activity } from 'lucide-react';
import { CommonConstants } from "@/utils/constants";
import { StorageUtils } from "@/libs/cache";
import {disableLoader, enableLoader} from "@/redux/slices/miscSlice"
//import React, {useEffect, useState} from 'react'
import positionBook from './positionsample.json';
import './positionstyles.css'; // ✅ No 'positionstyles.'
import {useDispatch, useSelector} from 'react-redux';
import { getPositionData } from "./positionGridBook.actions";
import { orderBookData } from "./orderBook.actions";
import { savePositionBook } from '@/redux/slices/positionSlice';
import {API, FYERSAPI, FYERSAPILOGINURL} from "@/libs/client"

import StreamToggleButton from '../tradeGrid/StreamToggleButton';
import QuickOrderBook from '../quickorder/QuickOrderBook';
import CancelButton from './CancelButton';
import PlaceOrderButton from './PlaceOrderButton';
import FetchPositionButton from './FetchPositionButton';
import isEqual from 'lodash.isequal';
//CUSTOME HOOK to DETECT MOBILE 
//import { useIsMobile } from "./useIsMobile";
 import   useIsMobile   from "../tradeGrid/useIsMobile";

import  {  PositionBookMobileView as  MobileView }   from "./PositionBookMobileView";
const PositionRow = {
  symbol: undefined,
  productType: undefined,
  netQty:undefined,
  avgPrice: undefined,
  calPrf: undefined,
  totCh:undefined,
  ltp:  undefined,
  realized_profit: undefined,
  buyVal:  undefined,
  unrealized_profit:  undefined,
};
/*const  PositionRow {
  symbol: string;
  productType: string;
  netQty: string;
  avgPrice: string;
  totCh: string;
  ltp: string;
  realized_profit: string;
  buyVal: string;
  unrealized_profit: string;
}*/



const PositionGrid = ({   positionDataB   }) => {
  StorageUtils._save(CommonConstants.positionDataCacheKey,CommonConstants.samplePositionDataVersion1);
  // QUICK ORDER BOOK DEFAULT initialization 
   StorageUtils._save(CommonConstants.quickOrderBookDataCacheKey,CommonConstants.sampleOrderBookDataVersionNonString1);

   const currentPlatform = useSelector((state ) => state.misc.platformType)
   const [parsedData, setParsedData] = useState(() => JSON.parse(StorageUtils._retrieve(CommonConstants.positionDataCacheKey).data));
   // useState(() => []);//StorageUtils._retrieve(CommonConstants.positionDataCacheKey).data
     const [platformType, setPlatformType] = useState('1')
       const [isOrderPolling, setOrderPolling] = useState((prev ) => {
        let g = JSON.parse(StorageUtils._retrieve(CommonConstants.quickOrderBookPollingKey).data);
           if(g !== null && g !== undefined ){
              return g;
           }else {
            return false;
           }

        } );
   const [data, setData] = useState(positionDataB);
    //   const [positionData ,setPositionData] = useSelector((state ) => state.position.positionBook)
     let  positionData   = useSelector((state ) => state.position.positionBook)
   const [positions ,setTrades ] =  useState ([]);
     const [sortColumn, setSortColumn] = useState(null); // e.g., "symbol"
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" or "desc"
    let globalUserCheck  = undefined;
    let globalUserTrades  = undefined;
   const [userLogged , setUserLogged ] = useState(false);
   // CHECK MOBILE OR DESTOP
   const isMobile = useIsMobile();
  function parseDate(str) {
    // e.g., "14-Jul-2025 09:48:22"
    const [datePart, timePart] = str.split(" ");
    const [day, mon, year] = datePart.split("-");
    const monthMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const [hour, min, sec] = timePart.split(":").map(Number);
    return new Date(year, monthMap[mon], day, hour, min, sec);
  }
 const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
 const sortedData = useMemo(() => {
  if (!userLogged) return parsedData;
  if (!sortColumn) return parsedData;

  let dataToSort = [...parsedData];

  if (sortColumn === 'orderDateTime') {
    return dataToSort.sort((a, b) => {
      const timeA = parseDate(a[sortColumn]).getTime();
      const timeB = parseDate(b[sortColumn]).getTime();

      return sortDirection === "asc"
        ? timeA - timeB
        : timeB - timeA;
    });
  }
  dataToSort = dataToSort.filter( ord => parseInt(ord.avgPrice) !=0 &&  parseInt(ord.netQty)  !=0 &&  parseInt(ord.unrealized_profit) !=0  )

  return dataToSort.sort((a, b) => {
    const valA = a[sortColumn];
    const valB = b[sortColumn];

    const isNumeric = !isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB));

    if (isNumeric) {
      return sortDirection === "asc"
        ? parseFloat(valA) - parseFloat(valB)
        : parseFloat(valB) - parseFloat(valA);
    }

    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
}, [parsedData, sortColumn, sortDirection]);
const handleFetchComplete = (newData) => {
  if (!isEqual(parsedData, newData)) {
    setParsedData([...newData]);
  }
};

const getSortIndicator = (column) =>
    sortColumn === column ? (sortDirection === "asc" ? " ▲" : " ▼") : "";


     useEffect(() => {
           console.log("PositionTable:   " )
         
           // FETH The recentTRades from storage if above call succeeded data will be there
           let redentPositionData =  StorageUtils._retrieve(CommonConstants.recentPositionsKey)
            const dataFromCache = StorageUtils._retrieve(CommonConstants.positionDataCacheKey)
            let positions = undefined;
            if( redentPositionData['data'] !== ''  && redentPositionData['data'] !== null && redentPositionData['data'] !==undefined){
                     console.log(" recentTrades  position data empty "+JSON.stringify(redentPositionData))
                     let tr = JSON.parse((JSON.stringify(redentPositionData)));
                     if(tr !==null && tr !== undefined ){
                         if(tr['data'] !==null && tr['data']!== undefined ){
                           positions =tr['data'];
                            console.log(" positions SET to  tr['data'] ")

                         }
                     }
                     
            }else {
               console.log("position data fro cahce "+JSON.stringify(dataFromCache))
               positions = JSON.parse(dataFromCache.data) ;
            }
           let dataLocal   =   (positionDataB !== undefined && positionDataB.length !=0 ) ? positionDataB : positions;
            console.log("position data  "+JSON.stringify(dataLocal))
            console.log("position data length  "+ dataLocal.length )

             const validRow = Object.fromEntries(Object.keys(PositionRow).map(key => [key, undefined]));
               let isValidPositionJSON = false;
                try{
                      const parsedObject = JSON.parse(dataLocal);
                        console.log(parsedObject);
                        isValidPositionJSON= true;
                  }   
                  catch(err){
                        isValidPositionJSON = false;
                        console.log("no valid positions data re-login or refresh ");
                  }
            if (dataLocal !== null && Array.isArray(dataLocal) && isValidPositionJSON ){
              let pendingRow  =[];
                dataLocal.map(({ symbol, productType, netQty, avgPrice,calPrf,  totCh, ltp, realized_profit, buyVal, unrealized_profit }) => {
                  if (parseInt(netQty) !==0 && parseInt(unrealized_profit) !==0 ){
                        console.log(`  Qty ${netQty},  Unrealized ${unrealized_profit}`);
                      validRow.symbol = symbol; validRow.productType=productType;  validRow.netQty=netQty; validRow.avgPrice=avgPrice;
                    validRow.totCh=totCh; validRow.ltp=ltp; validRow.realized_profit=realized_profit; validRow.buyVal=buyVal;
                    validRow.unrealized_profit=unrealized_profit;validRow.calPrf=calPrf;
                   let ne = JSON.parse(JSON.stringify(validRow));
                                  pendingRow.push(ne);
                    return validRow;
                  }
              
              });
             /*   pendingRow = pendingRow.filter(item => item !== null);
              console.log("pendingRow data  "+JSON.stringify(pendingRow))
            // MAP  the dataLocal , check if the all fields are undefined 
            const blankRow = Object.fromEntries(Object.keys(PositionRow).map(key => [key, undefined]));
            pendingRow.map((allPosit ) => {
                let   symbol  = allPosit["symbol"] ;
              let  productType  = allPosit["productType"] ;
               let netQty  = allPosit["netQty"] ;
                let avgPrice  = allPosit["avgPrice"] ;
                 let totCh  = allPosit["totCh"] ;
                  let ltp  = allPosit["ltp"] ;
                   let realized_profit  = allPosit["realized_profit"] ;
               let  buyVal  = allPosit["buyVal"] ;
                let  unrealized_profit   = allPosit["unrealized_profit"] ;
             console.log(`${symbol}: Qty ${netQty}, LTP ${ltp}, Unrealized ${unrealized_profit}`);
                  blankRow.symbol = symbol;blankRow.productType=productType; blankRow.netQty=netQty;blankRow.avgPrice=avgPrice;
                  blankRow.totCh=totCh;blankRow.ltp=ltp;blankRow.realized_profit=realized_profit;blankRow.buyVal=buyVal;
                  blankRow.unrealized_profit=unrealized_profit;
              });
               pendingRow = pendingRow.filter(item => item !== null);
               */
                         console.log(`pendingRow `+JSON.stringify(pendingRow));    
           const isAllUndefined = Object.values(pendingRow).every(val => val === undefined);
           if(!isAllUndefined ) {
            try { 
              dataLocal  = pendingRow;
            let parsed = dataLocal /// JSON.parse(data);
             setParsedData(parsed);
             setData(dataLocal)
              console.log("position data typeof  "+ (typeof dataLocal ) )
               console.log("position data parsedData  "+ (typeof parsed ) )
            console.log("position data parsedData length  "+ (  parsed.length ) )
            /* parsed.map( rw => { 
                  console.log("   "+ JSON.stringify(rw) )  
                  console.log("  rw[0]  "+  rw[0] )  
                   console.log("symbol    "+  rw["symbol"] )  
             }   )*/
             }
             catch(er) {
                // show sample positions from json 
                  dataLocal  =   positionBook.value;
                   let parsed = positionBook.value;
                 setParsedData(parsed);
                  setData(dataLocal)
                console.log("sample  position data typeof  "+ (typeof dataLocal ) )
               console.log("sample position data parsedData  "+ (typeof parsed ) )
              console.log("sample position data parsedData length  "+ (  parsed.length ) )
             /*  parsed.map( rw => { 
                  console.log("   "+ JSON.stringify(rw) )  
                  console.log("sample  position  "+  rw[0] )  
                   console.log("sample symbol    "+  rw["symbol"] )  
             }   )*/

             }
            }
            else { 
                console.log("Postion stored or fetch and not FORMAT please re-fresh ")
            }
          }
          else {
            console.log("Positions fetched improper re-fresh the page ");
          }
       }, [positionDataB,savePositionBook]);
   /*{
    Instrument: positionDataB[0] || "SAMPLE",
    Quantity: positionDataB[1] || "102",
    Price: positionDataB[2] || "1202",
    "Trade Value": positionDataB[3] || "14203",
    "Product Type": positionDataB[4] || "F&O",
  };*/

    const logByPlatform = () => {
        // check platform type is alpha-vantage or fyers
        // currentPlatform
        if (currentPlatform !==  "fyers") {
            const apiKey = StorageUtils._retrieve(CommonConstants.platFormKey)
            if (apiKey.isValid && apiKey.data !== null) {
                
            }
            else {
                console.log("Fyers not logged in ");    
                try {
                    dispatch(enableLoader());

                   let fyerLoginProm =  ( async () => {
                        //{params: {function: 'TOP_GAINERS_LOSERS' , apikey:CommonConstants.apiKey}}

                      //let res =  await FYERSAPI.get('/fyerscallback' )
                      let res =   popupCenter(FYERSAPILOGINURL, "Fyers Signin")
                        return res;
                    }) ;
                    const result = Promise.all([    fyerLoginProm()]);
                     // run a interval to check the fyersToken 
                    globalUserCheck  =  setInterval( async() => {
                        let result =   await FYERSAPI.get('/fyersgloballogin' )
                        console.log("fyers login called ");
                        let data =    result.data.value;
                        StorageUtils._save(CommonConstants.fyersToken,data)
                        const res = StorageUtils._retrieve(CommonConstants.fyersToken);
                        if (res.isValid && res.data !== null) {
                           
                            let auth_code = res.data['auth_code'];
                            if (auth_code&& auth_code !== null && auth_code !== undefined) {
                                console.log("User is Authorized ");
                                setUserLogged (true);
                               clearInterval(globalUserCheck);
                               dispatch(orderBookData());
                            }
                            else{
                                console.log("User is awaiting authorization ");
                            }
                        }
                     },5000);

                   // const res = StorageUtils._retrieve(CommonConstants.fyersToken );
                    
                } catch (error) {
                    // @ts-ignore
                    const {message} = error
                    //toast.error(message ? message : "Something went wrong!")
                    console.log(error)
                    return error
                } finally {
                    dispatch(disableLoader())
                }

                //dispatch(loginFyers([]));
               
            }
           // const sortedData = [...gainers].sort((a: any, b: any) => {
           //     return parseFloat(b.change_amount) - parseFloat(a.change_amount)
           // })
           // dispatch(saveGainers(sortedData))
        } 

    }
      const dispatch = useDispatch();
    
        const popupCenter = (url , title ) => {
            const dualScreenLeft = window.screenLeft ?? window.screenX;
            const dualScreenTop = window.screenTop ?? window.screenY;
        
            const width =
              window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
        
            const height =
              window.innerHeight ??
              document.documentElement.clientHeight ??
              screen.height;
        
            const systemZoom = width / window.screen.availWidth;
        
            const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
            const top = (height - 550) / 2 / systemZoom + dualScreenTop;
        
            const newWindow = window.open(
              url,
              title,
              `width=${500 / systemZoom},height=${550 / systemZoom
              },top=${top},left=${left}`
            );
            newWindow?.window.addEventListener('load', () => {
                newWindow?.window.addEventListener('unload', () => {
                    console.log("unload the popup ")
                  // // clear the StorageUtils. fetchPositions
                  if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
                        //  localStorage.removeItem("yourKey");
                         StorageUtils._save(CommonConstants.fetchPositions, true);
                    } 


                   // ftech the globallogin boject 
                   let globaProm =    ( async () => { 
                     let login = await FYERSAPI.get('/fyersgloballogin'); 
                     console.log("fyers login called ");
                     return login;
                    }) 
                    const res = Promise.all([ globaProm()]);
                    res.then((values) => {
                        StorageUtils._save(CommonConstants.fyersToken,values)
                         console.log("fyers login token saved ")
                     //DON'T call immediately as Fyers Login make take time 
                     // so Using setTimeout or setInterval 
                       globalUserTrades  =  setInterval( async () => { 

                         //TRIIGER the position Book Fetch again 
                         //dispatch(getPositionData('adfg'));
                        let redentPositionData =  StorageUtils._retrieve(CommonConstants.recentPositionsKey)
                                const dataFromCache = StorageUtils._retrieve(CommonConstants.positionDataCacheKey)
                                if( redentPositionData !== null && redentPositionData !==undefined){
                    
                                }else {
                                console.log("position data fro cahce ")
                                redentPositionData = dataFromCache.data;
                                }
                                console.log(" PositionGrid after login state.position.positionBook "+JSON.stringify(positionData))
                            
                            
                                let positionLocal  =   positionData !== undefined? positionData : redentPositionData;

                        if ( positionLocal   !== null && positionLocal !==undefined){
                          let isValidPositionJSON = false;
                             try{
                                    const parsedObject = JSON.parse(positionLocal?.data);
                                      console.log(parsedObject);
                                      isValidPositionJSON= true;
                                }   
                                catch(err){
                                     isValidPositionJSON = false;
                                      console.log("no valid positions data re-login or refresh ");
                                }

                            if (positionLocal?.data !== null  && isValidPositionJSON ){
                               
                              console.log("positionLocal data   "+JSON.stringify(positionLocal));
                              

                             const validRow = Object.fromEntries(Object.keys(PositionRow).map(key => [key, undefined]));
                              let  pendingRow  = [];
                               positionLocal.map((onePos) => {
                               const { symbol, productType, netQty, avgPrice, calPrf ,  totCh, ltp, realized_profit, buyVal, unrealized_profit } = onePos;
                               if (parseInt(netQty) !==0 && parseInt(unrealized_profit) !==0 ){
                                      console.log(`  Qty ${netQty},  Unrealized ${unrealized_profit}`);
                                   validRow.symbol = symbol; validRow.productType=productType;  validRow.netQty=netQty; validRow.avgPrice=avgPrice;
                                 validRow.totCh=totCh; validRow.ltp=ltp; validRow.realized_profit=realized_profit; validRow.buyVal=buyVal;
                                 validRow.unrealized_profit=unrealized_profit;
                                 validRow.calPrf = calPrf;
                                   let ne = JSON.parse(JSON.stringify(validRow));
                                  pendingRow.push(ne);
                                 return validRow;
                               }
                            
                                
                            });

                            // MAP  the dataLocal , check if the all fields are undefined 
                          const blankRow = Object.fromEntries(Object.keys(PositionRow).map(key => [key, undefined]));
                         /* pendingRow.map((allPosit) => {
                                      let   symbol  = allPosit["symbol"] ;
                            let  productType  = allPosit["productType"] ;
                            let netQty  = allPosit["netQty"] ;
                              let avgPrice  = allPosit["avgPrice"] ;
                              let totCh  = allPosit["totCh"] ;
                                let ltp  = allPosit["ltp"] ;
                                let realized_profit  = allPosit["realized_profit"] ;
                            let  buyVal  = allPosit["buyVal"] ;
                              let  unrealized_profit   = allPosit["unrealized_profit"] ;
                                console.log(`${symbol}: Qty ${netQty}, LTP ${ltp}, Unrealized ${unrealized_profit}`);
                                blankRow.symbol = symbol;blankRow.productType=productType; blankRow.netQty=netQty;blankRow.avgPrice=avgPrice;
                                blankRow.totCh=totCh;blankRow.ltp=ltp;blankRow.realized_profit=realized_profit;blankRow.buyVal=buyVal;
                                blankRow.unrealized_profit=unrealized_profit;
                            });
                            */
                          

                          //=   /// Object.fromEntries(Object.keys( validRow).map(key => [key=="netQty", undefined]));

                          console.log(`pendingRow `+JSON.stringify(pendingRow));    

                        const isAllUndefined = Object.values(pendingRow).every(val => val === undefined);
                         
                          if(!isAllUndefined ) {      
                          //  setPositionData( blankRow);;
                            positionData = pendingRow;
                            if(positionData !==undefined &&  Array.isArray(positionData ) ){
                              console.log(`final valid positions  `+JSON.stringify(pendingRow));    
                                setTrades( positionData );
                                  setParsedData(positionData);
                            }
                            else if(redentPositionData.data !==undefined &&  Array.isArray(redentPositionData.data )) {
                            console.log("PositionGrid after login recenTrades  "+JSON.stringify(redentPositionData.data))
                                setTrades( redentPositionData.data );
                                   setParsedData(redentPositionData.data );
                            }
                          } 
                          else {
                              setTrades( [] );
                                  setParsedData([]);
                            console.log("Positions Data Improper refresh the Page ")
                              //StorageUtils._save(CommonConstants.fetchPositions, true);
                          } 
                          }  // positionLocalData.data
                        } // positionLocalData
                            clearInterval(globalUserTrades);
                         }   ,5000);

                    })
                   
                    // window.location.reload();
                });
            });
            
            newWindow?.focus();
          };
 const handleOrderBookPoll = () => {
  console.log("Poll Order Book enter ");
   const res = StorageUtils._retrieve(CommonConstants.fyersToken);
  if (res.isValid && res.data !== null) {
        let auth_code = res.data['auth_code'];
   if (auth_code&& auth_code !== null && auth_code !== undefined) {
      console.log("User is Authorized ");
      console.log("User is Authorized ");
     setOrderPolling((prev) => !prev);
     // Optionally, trigger your stream start/stop logic here
    if (isOrderPolling) {
       ///  fetchFreshOrdersToCancel();  will trigger in QuickOrder Book 
          console.log("stopped polling  orders ");
    } else {
         console.log("stopped polling  orders ");
      }
   }
   else {
        console.log("User not logged in ");
   } // AUTH CODE 
  }
};
   


  return (
    <div className="overflow-x-auto w-full bg-zinc-100">
        <br/>
        <br/>
      <h1 className='text-black font-semibold mb-2 dark:text-white text-lg'>Positions</h1>
      {/* <div className="hidden md:flex flex justify-between  relative items-center">*/}
        <div
             className={
              isMobile
                  ? "mb-2 md:flex flex justify-between relative items-center"
                  : "md:flex flex justify-between relative items-center"
               }
          > 
                 {/* 
                  <select className="p-2 rounded-lg bg-greylight dark:bg-greydark text-gretdark dark:text-white focus-visible:outline-none">
                  md:hidden
                 Alpha-Advantange or Fyers selection */}
                <select value={platformType} onChange={(e) => {
                                    if (e.target.value == '1') {
                                        console.log(" selected " + e.target.value)
                                    } else {
                                        logByPlatform()
                                        console.log(" selected " + e.target.value)
                                    }
                                    setPlatformType(e.target.value)
                  }}  
                    className='p-2 focus-visible:outline-none block  rounded-lg bg-greylight dark:bg-greydark text-gretdark  dark:active:text-green-700  '> {/* dark:text-white */}
                <option value={1}>Alph-Vantage</option>
                <option value={2}>Fyers</option>
               </select>
             </div>
       {/*  CLICK MARKET DATA   TICKER FOR 3 BANKNIFY NIFTY and SENSEX  */}      
   {/*  <div className="hidden md:flex relative items-center">
                   
                    
               <i className="iconsax" type="linear" stroke-width="1.5" icon="toggle-off-square">Stream MARKET DATA</i>

                <p id="sensex-status"> 
                <span id="sensex-time"  style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}> </span>
                <span id="sensex-symbol"  style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}> </span>
                <span id="sensex-price"  style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                    }}> </span>
             </p>
                 <p id="banknifty-status"> 
                <span id="banknifty-time"  style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                        }}> </span>
               <span id="banknifty-symbol"  style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                        }}> </span>
               <span id="banknifty-price"  style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                        }}> </span>
             </p>
            <p id="nifty-status"> 
                <span id="nifty-time"  style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                        }}> </span>
                <span id="nifty-symbol"  style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}> </span>
                <span id="nifty-price"  style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                      }}> </span>
             </p>
      </div> */}
       {/* Stream Market Data */}
        <div className="flex flex-col md:flex-row justify-between  gap-x-6 ml-auto">
         {/*  <div className="flex items-center text-sm text-black dark:text-white font-medium">
            <i className="iconsax mr-2" data-icon="toggle-off-square" />
            Stream MARKET DATAs
          </div>*/}

           <div className="max-h-[100px] overflow-y-auto  flex justify-start  divide-gray-200">
           {/*<BuyButton />*/}
           <div className="flex justify-between  gap-x-4 items-center">
            <div className="flex-shrink-0"><FetchPositionButton onFetchComplete={ handleFetchComplete}
                         sortedData={sortedData} /></div>

            <div className="ml-auto"> <StreamToggleButton /></div>
           </div>
          </div>
           

          <p id="sensex-status" className="flex gap-x-2 items-center">
            <div className="flex flex-col items-start gap-y-1">
            <div className="flex" >
              <div className="flex justify-start">
              SENSEX</div>
               <div className="flex justify-end" ><span id="sensex-time" className="px-4 rounded bg-gray-100">--</span></div> 
              
               </div>
            
           <div className="flex justify-start"> 
            <span id="sensex-symbol" className="px-1 py-1 rounded bg-gray-100">--</span>
            <span id="sensex-price" className="px-1 py-1 rounded bg-gray-100">--</span>
             </div>
             </div>
          </p>

          <p id="banknifty-status" className="flex gap-x-2 items-center">
             <div className="flex flex-col items-start gap-y-1">
            <div>BANKNIFTY </div>
            <div className="flex justify-start"> <span id="banknifty-time" className="px-1 py-1 rounded bg-gray-100">--</span>
            <span id="banknifty-symbol" className="px-1 py-1 rounded bg-gray-100">--</span>
            <span id="banknifty-price" className="px-1 py-1 rounded bg-gray-100">--</span>
            </div>
            </div>
          </p>

          <p id="nifty-status" className="flex gap-x-2 items-center">
             <div className="flex flex-col items-start gap-y-1">
             <div>  NIFTY </div>
             <div className="flex justify-start"><span id="nifty-time" className="px-1 py-1 rounded bg-gray-100">--</span>
            <span id="nifty-symbol" className="px-1 py-1 rounded bg-gray-100">--</span>
            <span id="nifty-price" className="px-1 py-1 rounded bg-gray-100">--</span>
            </div>
            </div>
          </p>
        </div>
          <br/>
          <div className="flex justify-end ">  
            <div  className="flex justify-between  gap-x-4 items-center"> 
              <button id="POLLORDERBOOK"
                onClick={handleOrderBookPoll}
                className={` flex items-start justify-start gap-2 px-1 py-2 rounded-lg mt-1 font-semibold
                    hover:bg-blue-200 bg-brandgreenlight dark:text-white   ${
                  isOrderPolling
                    ? 'bg-green-400 '
                    : 'bg-brandgreenlight dark:text-white'
                }`}
              >
              {isOrderPolling ? (
                  <Activity size={5} className=" animate-pulse " />
                ) : (
                  <ToggleLeft size={5} className="text-gray-500" />
                )}  
                   <span className="text-sm font-semibold font-medium" > {isOrderPolling ? 'Fetching' : 'Poll Orders'} </span>
              </button>
              <div className="flex justify-end">  
                 <QuickOrderBook orderBookDataB={[]} pollOrderBook ={isOrderPolling} />  {/* it will fetch the orderbook from the useeffect  */}
                </div>
            </div>
           </div>
             <br/>
{/*<div className="overflow-x-auto w-full">
  <table className="min-w-full table-auto text-sm border-collapse">
    <thead className="bg-gray-200 text-gray-700">
      <tr>
        <th className="px-4 py-2 text-left">Instrument</th>
        <th className="px-4 py-2 text-left">Product Type</th>
        <th className="px-4 py-2 text-left">Quantity</th>
        <th className="px-4 py-2 text-left">Price</th>
        <th className="px-4 py-2 text-left">Time</th>
        <th className="px-4 py-2 text-left">Trade Value</th>
        <th className="px-4 py-2 text-left">Buy/Sell</th>
      </tr>
    </thead>
    <tbody>
      <tr className="bg-green-300">
        <td className="px-4 py-2">NIFTY25JUL24500CE</td>
        <td className="px-4 py-2">INTRADAY</td>
        <td className="px-4 py-2">75</td>
        <td className="px-4 py-2">248.88</td>
        <td className="px-4 py-2">13:55:12</td>
        <td className="px-4 py-2">18666.00</td>
        <td className="px-4 py-2">BUY</td>
      </tr>
      <tr className="bg-green-300">
        <td className="px-4 py-2">NIFTY25JUL24500CE</td>
        <td className="px-4 py-2">INTRADAY</td>
        <td className="px-4 py-2">75</td>
        <td className="px-4 py-2">246.38</td>
        <td className="px-4 py-2">13:53:02</td>
        <td className="px-4 py-2">18478.50</td>
        <td className="px-4 py-2">BUY</td>
      </tr>
      <tr className="bg-green-300">
        <td className="px-4 py-2">NIFTY2580725100PE</td>
        <td className="px-4 py-2">INTRADAY</td>
        <td className="px-4 py-2">75</td>
        <td className="px-4 py-2">382.6</td>
        <td className="px-4 py-2">13:51:22</td>
        <td className="px-4 py-2">28695.00</td>
        <td className="px-4 py-2">SELL</td>
      </tr>
      <tr className="bg-red-300">
        <td className="px-4 py-2">NIFTY25JUL24500CE</td>
        <td className="px-4 py-2">INTRADAY</td>
        <td className="px-4 py-2">75</td>
        <td className="px-4 py-2">249.9</td>
        <td className="px-4 py-2">13:50:11</td>
        <td className="px-4 py-2">18742.50</td>
        <td className="px-4 py-2">SELL</td>
      </tr>
      <tr className="bg-green-300">
        <td className="px-4 py-2">NIFTY25JUL24500CE</td>
        <td className="px-4 py-2">INTRADAY</td>
        <td className="px-4 py-2">75</td>
        <td className="px-4 py-2">241.85</td>
        <td className="px-4 py-2">13:48:33</td>
        <td className="px-4 py-2">18138.75</td>
        <td className="px-4 py-2">BUY</td>
      </tr>
    </tbody>
  </table>
</div> */}

     {isMobile ? <MobileView sortedData={sortedData}
      userLogged={userLogged}
      handleSort={handleSort}
      getSortIndicator={getSortIndicator}
       /> : 
     (  
     <div className="overflow-x-auto w-full">  
    {/*  <table className="min-w-full text-sm text-left border border-gray-200 shadow-md rounded-lg overflow-hidden"> */} 
         <div className="grid grid-cols-11 bg-gray-100 text-gray-700 font-semibold text-sm ">
            <div className="py-1 px-1  cursor-pointer"  >SrNo </div>
            <div className="py-1 px-1  cursor-pointer" onClick={() => handleSort("symbol")}>Instrument{getSortIndicator("symbol")} </div>
            <div className="py-1 px-1  cursor-pointer" onClick={() => handleSort("productType")}>Product{getSortIndicator("productType")} </div>
            <div className="py-1 px-1  cursor-pointer" onClick={() => handleSort("netQty")}>Quantity{getSortIndicator("netQty")} </div>
            <div className="py-1 px-1  cursor-pointer" onClick={() => handleSort("avgPrice")}>Avg Price{getSortIndicator("avgPrice")} </div>
            <div className="py-1 px-1  cursor-pointer" onClick={() => handleSort("totCh")}>Total Charges{getSortIndicator("totCh")} </div>
            <div className="py-1 px-1  cursor-pointer" onClick={() => handleSort("ltp")}>LTP {getSortIndicator("ltp")} </div>
            <div className="py-1 px-1  cursor-pointer" onClick={() => handleSort("calPrf")}>Act {getSortIndicator("calPrf")} </div>
            <div className="py-1 px-1  cursor-pointer" onClick={() => handleSort("buyVal")}>Buy Value{getSortIndicator("buyVal")} </div>
            <div className="py-1 px-1  cursor-pointer" onClick={() => handleSort("realized_profit")}>Realized {getSortIndicator("realized_profit")} </div>
            <div className="py-1 px-1  cursor-pointer" onClick={() => handleSort("unrealized_profit")}>Unrealized{getSortIndicator("unrealized_profit")} </div>
  
        </div>
     
   {/*  
      <table className="min-w-full table-auto text-sm border-collapse">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("symbol")}>Instrument{getSortIndicator("symbol")}</th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("productType")}>Product Type{getSortIndicator("productType")}</th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("positiondQty")}>Quantity{getSortIndicator("positiondQty")}</th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("positionPrice")}>Price{getSortIndicator("positionPrice")}</th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("orderDateTime")}>Time{getSortIndicator("orderDateTime")}</th>
            <th className="py-2 px-4 border-b cursor-pointer" onClick={() => handleSort("positionValue")}>Trade Value{getSortIndicator("positionValue")}</th>
            <th className="py-2 px-4 border-b">Buy/Sell</th>
          </tr>
        </thead> */}
         {/* Table Body Rows  */}
    <div className="max-h-[400px] overflow-y-auto divide-y divide-gray-200">
       {/*  Example Row  */}
        { (Array.isArray(sortedData) &&  sortedData.length > 0 && userLogged  ) ? sortedData?.map((row, index) => (
      <div key={index}  className={`grid grid-cols-11 text-sm text-gray-800 hover:bg-gray-50 hover:bg-gray-50 bg-brandgreenlight transition ${row['side'] === '-1' ? 'position-row-sell' : 'position-row-buy'}`} >
        <div className="py-1 px-1 inline-block overflow-x-hidden h-auto  ">{index}</div>
        <div className="py-1 px-1 inline-block overflow-x-hidden  w-auto h-auto  ">{row["symbol"]}</div>
        <div className="py-1 px-1 inline-block  w-auto h-auto"> {row["productType"]}  </div>
        <div className="py-1 px-1 inline-block  w-auto h-auto">{row["netQty"]}</div>
        <div className="py-1 px-1 inline-block  w-auto h-auto">{row["avgPrice"]}</div>
        <div className="py-1 px-1 inline-block  w-auto h-auto">{row["totCh"]}</div>
        <div className="py-1 px-1 inline-block  w-auto h-auto">{row["ltp"]}</div>
        <div className={`"py-1 px-1 inline-block  w-auto h-auto  ${row['realized_profit'] <= 0 ? 'position-row-sell' : 'position-row-buy'}`  }>{row["calPrf"]}</div>
        <div className="py-1 px-1 inline-block  w-auto h-auto">{row["buyVal"]}</div>
        <div className={`py-1 px-1 inline-block  w-auto h-auto  ${row['realized_profit'] <= 0 ? 'position-row-sell' : 'position-row-buy'}`  }>{row["realized_profit"]}</div>
        <div className={`py-1 px-1 inline-block  w-auto h-auto  ${row['unrealized_profit'] <= 0 ? 'position-row-sell' : 'position-row-buy'}`  }>{row["unrealized_profit"]}</div>
       
        </div>  )) : (    <div className="grid grid-cols-8 text-sm text-gray-800 hover:bg-gray-50">No positions found</div>
          )}
      </div>
       <div className="max-h-[100px] overflow-y-auto   divide-gray-200">
           {/*<BuyButton />*/}
           <div className="flex justify-between items-center">
            <CancelButton/>

            <div className="ml-auto"><PlaceOrderButton /></div>
           </div>
      </div>

       {/* <tbody>
          { (Array.isArray(sortedData) &&  sortedData.length > 0 && userLogged  ) ? sortedData?.map((row, index) => (
            <tr key={index} className={`hover:bg-gray-50 transition ${row['side'] === '-1' ? 'position-row-sell' : 'position-row-buy'}`}>
              <td className="py-2 px-4 border-b">{row["symbol"]}</td>
              <td className="py-2 px-4 border-b">{row["productType"]}</td>
              <td className="py-2 px-4 border-b">{row["positiondQty"]}</td>
              <td className="py-2 px-4 border-b">{row["positionPrice"]}</td>
              <td className="py-2 px-4 border-b">{row["orderDateTime"]}</td>
              <td className="py-2 px-4 border-b">{row["positionValue"]}</td>
              <td className="py-2 px-4 border-b">{row['side'] === '-1' ? 'SELL' : 'BUY'}</td>
            </tr>
          )) : (
            <tr><td colSpan="7" className=" py-4">No positions found</td></tr>
          )}
        </tbody>
      </table>*/} 
    </div>
    )}   {/*  MOBILE or DESKTOP VIEW  */}
    </div>
  );
     
};

export default PositionGrid;
