 
import React, {Suspense, useEffect , useState,useMemo} from "react";
import { CommonConstants } from "@/utils/constants";
import { StorageUtils } from "@/libs/cache";
 
import {disableLoader, enableLoader} from "@/redux/slices/miscSlice"
//import React, {useEffect, useState} from 'react'
import quickOrderBookBook from './quickOrderBooksample.json';
import './quickOrderBookstyles.css'; // ✅ No 'quickOrderBookstyles.'
import {useDispatch, useSelector} from 'react-redux';

import { orderBookData } from "../positionGrid/orderBook.actions";
import { saveOrderBook } from '@/redux/slices/orderBookSlice';
import { saveBuyOrderBook } from '@/redux/slices/buyOrderBookSlice';  
import {API, FYERSAPI, FYERSAPILOGINURL} from "@/libs/client"
 
import isEqual from 'lodash.isequal';
//CUSTOME HOOK to DETECT MOBILE 
//import { useIsMobile } from "./useIsMobile";
 import   useIsMobile   from "../tradeGrid/useIsMobile";
import { clearInterval } from "timers";
 const  otherOrderBookData = 
JSON.stringify([
    {'netQty': 1, 
    'qty': 1, 
    'avgPrice': 123.5, 
    'netAvg': 76300.5, 
    'side': -1,
    'productType': 'MARGIN', 
    'realized_profit': -670.58, 
    'unrealized_profit':-19030.99, 
    'pl': -19030.99,
    'ltp': 126.0, 
    'buyQty': 2, 
    'buyAvg': 72256.0, 
    'buyVal': 144512.0, 
    'sellQty': 1, 
    'sellAvg': 168.89, 
    'sellVal': 76000.5, 
    'slNo': 0, 
    'fyToken': '1120200831217406', 
    'crossCurrency': 'N', 
    'rbiRefRate': 1.0, 
    'qtyMulti_com': 1.0, 
    'segment': 20, 
    'symbol': 'NIFTY2581424400CE', 
    'id': 'NIFTY2581424400CE-MARGIN',
    "cfBuyQty": 0,
    "cfSellQty": 0,
    "dayBuyQty": 0,
    "daySellQty": 1,
    "exchange": 10      // a comma here will GIVE REAL NIGTH MARE when stringify -> parse -> stringify --> parse 
    },
     {'netQty': 1, 
    'qty': 1, 
    'avgPrice': 312.5, 
    'netAvg': 76300.5, 
    'side': 1,
    'productType': 'MARGIN', 
    'realized_profit': -670.58, 
    'unrealized_profit':-19030.99, 
    'pl': -19030.99,
    'ltp': 126.0, 
    'buyQty': 2, 
    'buyAvg': 72256.0, 
    'buyVal': 144512.0, 
    'sellQty': 1, 
    'sellAvg': 168.89, 
    'sellVal': 76000.5, 
    'slNo': 0, 
    'fyToken': '1120200831217406', 
    'crossCurrency': 'N', 
    'rbiRefRate': 1.0, 
    'qtyMulti_com': 1.0, 
    'segment': 20, 
    'symbol': 'NIFTY2581423400CE', 
    'id': 'NIFTY2581423400CE-MARGIN',
    "cfBuyQty": 0,
    "cfSellQty": 0,
    "dayBuyQty": 0,
    "daySellQty": 1,
    "exchange": 10      // a comma here will GIVE REAL NIGTH MARE when stringify -> parse -> stringify --> parse 
    }
  ]  


);

const otherObjOrderBookData  =  JSON.parse(otherOrderBookData);
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



const QuickOrderBook = ({  orderBookDataB , pollOrderBook  }) => {
   StorageUtils._save(CommonConstants.quickOrderBookDataCacheKey,CommonConstants.sampleOrderBookDataVersion1);
   //StorageUtils._save(CommonConstants.quickOrderBookDataCacheKey,CommonConstants.sampleOrderBookDataVersionNonString1);
   const currentPlatform = useSelector((state ) => state.misc.platformType)
   
   const [parsedData, setParsedData] = useState(() =>{ 
        // JSON.parse(StorageUtils._retrieve(CommonConstants.quickOrderBookDataCacheKey).data); 
          let g = JSON.parse(StorageUtils._retrieve(CommonConstants.quickOrderBookDataCacheKey).data);
                     if(g !== null && g !== undefined ){
                        console.log("parsed Data initialised "+JSON.stringify(g));
                        return g;
                     }else {
                       console.log("parsed Data const initialised "+JSON.stringify(g));
                      return CommonConstants.sampleOrderBookDataVersionNonString1;
                     }
          
               
      });
   // useState(() => []);//StorageUtils._retrieve(CommonConstants.quickOrderBookDataCacheKey).data
     const [platformType, setPlatformType] = useState('1')
     const [orderBookPollInterval, setOrderBookPollInterval] = useState(false);
     const [orderBookPollInt, setOrderGlobalPollInt] = useState(false);

   const [data, setData] = useState(orderBookDataB);
    //   const [quickOrderBookData ,setPositionData] = useSelector((state ) => state.quickOrderBook.quickOrderBookBook)
     let  quickOrderBookData   = useSelector((state ) => state.order.orderBook)
   const [positions ,setTrades ] =  useState ([]);
     const [sortColumn, setSortColumn] = useState(null); // e.g., "symbol"
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" or "desc"
    let globalUserCheck  = undefined;
    let globalUserTrades  = undefined;
   const [userLogged , setUserLogged ] = useState(false);
   // CHECK MOBILE OR DESTOP
   const isMobile = useIsMobile();

 let dispatch = useDispatch();

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
const fetchFreshOrdersToCancel = () => {
       // CLEAR THE CACHE and FETCH 
        StorageUtils._save(CommonConstants.quickOrderBookDataCacheKey,[]);
       // CLEAR THE render cancel STAtUS
       //setRecentOrderStatus((prev) => prev = '');
       // FETCH the ORDER BOOK DATA ALSO ONCE 
       dispatch(orderBookData(''));
       // RE-FRESH the cancel order CACHE localstore data
       //using timeout here to wait till the cancel order list is fetched from server 
       // this make keep poping pending order modal be sure 
      /* setTimeout( ()=> {   
           fetchOrdersToCancel()
           // then RE-SHOW the CANCEL MODAL 
            if(orderShortList.length > 0  ){ 
             setOrdersShowModal(true);
            }
           else if(!showNoPendingOrders ) { 
              console.log("No Pending orders ");
             setShowNoPendingOrders(true); //setShowNoPendingOrders(false)
            }
       },3500) ;
      */
}

  useEffect(() => {
    // Mock hardcoded string data
    const mockRawData = `
      [
        { "id": 1, "name": "Apple", "price": 120 },
        { "id": 2, "name": "Banana", "price": 60 }
      ]
    `;

    try {
      const data = otherObjOrderBookData; //JSON.parse(mockRawData); otherObjOrderBookData
      setParsedData(data); // ✅ Update state so it re-renders
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, []);
useEffect( () => {
  setInterval(() => {
      // CLEAR the DEFAULT ORDER polling int 
      clearInterval(orderBookPollInt);
      // store the interval for refrence and close the poll 
       setOrderGlobalPollInt((prev) => prev = false);
  }, 40000)

} , [])

useEffect(() => {
  StorageUtils._save(CommonConstants.fyersToken,data)
  const res = StorageUtils._retrieve(CommonConstants.fyersToken);
  if (res.isValid && res.data !== null) {
      
      let auth_code = res.data['auth_code'];
      if (auth_code&& auth_code !== null && auth_code !== undefined) {
          console.log("User is Authorized ");
          setUserLogged (true);
      }
  }
  const interval = setInterval(() => {
    const stored = JSON.stringify(CommonConstants.sampleOrderBookDataVersionNonString1);
    
    if (typeof stored === "string") {
      try {
        const parsed = JSON.parse(stored);
          const data = otherObjOrderBookData;
        setParsedData(data);
         console.log("Order Book fetching sample JSON Order Book storage: "+JSON.stringify(data ));

      } catch (err) {
        console.warn("Invalid JSON in storage:", err);
      }
    }
  }, 3000); // poll every 2 sec (or whatever is suitable)
  // store the interval for refrence and close the poll 
  setOrderGlobalPollInt((prev) => prev = interval);

  //return () => clearInterval(interval);
}, []);

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
}, [parsedData, setParsedData ,  sortColumn, sortDirection]);


const handleFetchComplete = (newData) => {
  if (!isEqual(parsedData, newData)) {
    setParsedData([...newData]);
  }
};

const getSortIndicator = (column) =>
    sortColumn === column ? (sortDirection === "asc" ? " ▲" : " ▼") : "";

 useEffect( () => {
  if(pollOrderBook){
   // BASEDD of POsitionGrid Poll Order book 
   // start the Interval to POOL the Orders 
   let pollOrderIntervalId = 
   setInterval(() => {
    // 
    // fetchFreshOrdersToCancel();

   } , 3000);
    setOrderBookPollInterval((prev) => prev = pollOrderIntervalId);

    }
    else {   // TOGGLE the polling of ORDER BOOK 
      clearInterval(orderBookPollInterval);

    }

 }, [pollOrderBook])
     useEffect(() => {
           console.log("OrderBook Table:   " )
         
           // FETH The recentTRades from storage if above call succeeded data will be there
           let redentOrderBookData =  StorageUtils._retrieve(CommonConstants.recentOrderBooksKey)
            const dataFromCache = StorageUtils._retrieve(CommonConstants.quickOrderBookDataCacheKey)
            let quickOrderBooks = undefined;
            if( redentOrderBookData['data'] !== ''  && redentOrderBookData['data'] !== null && redentOrderBookData['data'] !==undefined){
                     console.log(" recentTrades  quickOrderBook data empty "+JSON.stringify(redentOrderBookData))
                     let tr = JSON.parse((JSON.stringify(redentOrderBookData)));
                     if(tr !==null && tr !== undefined ){
                         if(tr['data'] !==null && tr['data']!== undefined ){
                           quickOrderBooks =tr['data'];
                            console.log(" quickOrderBooks SET to  tr['data'] ")

                         }
                     }
                     
            }else {
               console.log("quickOrderBook data fro cahce "+JSON.stringify(dataFromCache))
               quickOrderBooks = JSON.parse(dataFromCache.data) ;
            }
           let dataLocal   =   (orderBookDataB !== undefined && orderBookDataB.length !=0 ) ? orderBookDataB : quickOrderBooks;
            console.log("quickOrderBook data  "+JSON.stringify(dataLocal))
            console.log("quickOrderBook data length  "+ dataLocal.length )

             const validRow = Object.fromEntries(Object.keys(PositionRow).map(key => [key, undefined]));
               let isValidOrderBookJSON = false;
                try{
                     let parsedObject = undefined;
                      if (typeof dataLocal === "string") {
                              try {
                                 parsedObject = JSON.parse(dataLocal);
                                console.log("Parsed JSON:", parsedObject);
                              } catch (e) {
                                console.warn("Invalid JSON string:", e.message);
                              }
                      } else {
                         isValidOrderBookJSON= true;
                              console.warn("dataLocal is not a string, skipping JSON.parse");
                       }
                      
                       
                  }   
                  catch(err){
                        isValidOrderBookJSON = false;
                        console.log("no valid quickOrderBooks data re-login or refresh ");
                        // FYERS Staturday 9 Aug maintenence so hard coded testing 



                  }
            if (dataLocal !== null && Array.isArray(dataLocal) && isValidOrderBookJSON ){
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
              console.log("quickOrderBook data typeof  "+ (typeof dataLocal ) )
               console.log("quickOrderBook data parsedData  "+ (typeof parsed ) )
            console.log("quickOrderBook data parsedData length  "+ (  parsed.length ) )
            /* parsed.map( rw => { 
                  console.log("   "+ JSON.stringify(rw) )  
                  console.log("  rw[0]  "+  rw[0] )  
                   console.log("symbol    "+  rw["symbol"] )  
             }   )*/
             }
             catch(er) {
                // show sample quickOrderBooks from json 
                  dataLocal  =   quickOrderBookBook.value;
                   let parsed = quickOrderBookBook.value;
                 setParsedData(parsed);
                  setData(dataLocal)
                console.log("sample  quickOrderBook data typeof  "+ (typeof dataLocal ) )
               console.log("sample quickOrderBook data parsedData  "+ (typeof parsed ) )
              console.log("sample quickOrderBook data parsedData length  "+ (  parsed.length ) )
             /*  parsed.map( rw => { 
                  console.log("   "+ JSON.stringify(rw) )  
                  console.log("sample  quickOrderBook  "+  rw[0] )  
                   console.log("sample symbol    "+  rw["symbol"] )  
             }   )*/

             }
            }
            else { 
                console.log("Postion stored or fetch and not FORMAT please re-fresh ")
            }
          }
          else {
            console.log("OrderBooks fetched improper re-fresh the page ");
          }
       }, [positions]); // [orderBookDataB,saveOrderBook]  removed for testing
    
  
     // const dispatch = useDispatch();
    
 
  return (
   <div className="overflow-x-auto bg-zinc-100 border border-gray-300 rounded-md w-[420px]">
  {/* Table Header */}
  <div className="grid grid-cols-[minmax(140px,1fr)_repeat(3,minmax(50px,auto))] bg-gray-100 text-gray-700 font-medium text-[11px] border-b border-gray-300">
    <div
      className="py-[1px] px-1 cursor-pointer truncate"
      onClick={() => handleSort("symbol")}
    >
      Inst{getSortIndicator("symbol")}
    </div>
    <div
      className="py-[1px] px-1 cursor-pointer"
      onClick={() => handleSort("netQty")}
    >
      Qty{getSortIndicator("netQty")}
    </div>
    <div
      className="py-[1px] px-1 cursor-pointer"
      onClick={() => handleSort("avgPrice")}
    >
      Avg{getSortIndicator("avgPrice")}
    </div>
    <div
      className="py-[1px] px-1 cursor-pointer"
      onClick={() => handleSort("ltp")}
    >
      LTP{getSortIndicator("ltp")}
    </div>
  </div>

  {/* Table Body */}
  {/*  {Array.isArray(otherObjOrderBookData) && otherObjOrderBookData.length > 0 && userLogged   ? (   */}
  <div className="max-h-[200px] overflow-y-auto divide-y divide-gray-200 text-[11px] leading-[1.1rem]">
    {otherObjOrderBookData && otherObjOrderBookData.length > 0 ? (
    otherObjOrderBookData.map((row, index) => (
      <div
        key={index}
        className={`grid grid-cols-[minmax(140px,1fr)_repeat(3,minmax(50px,auto))]  text-gray-800 transition
          ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}
          hover:bg-gray-100
          ${row.side === -1 || row.side === "-1" ? "order-row-sell" : "order-row-buy"}`}
      >
        <div className="py-[1px] px-1 text-base font-bold truncate">{row.symbol}</div>
        <div className="py-[1px] px-1 text-base font-bold">{row.netQty}</div>
        <div className="py-[1px] px-1 text-base font-bold">{row.avgPrice}</div>
        <div className="py-[1px] px-1 text-base font-bold ">{row.ltp}</div>
      </div>
      ))
    ) : (
    <div className="grid grid-cols-4 text-[11px] text-gray-500 py-[1px] px-1">
      No orders
    </div>
  )}
</div>
</div>
  );
     
};

export default QuickOrderBook;
