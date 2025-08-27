// StreamToggleButton.jsx
import React, { useEffect, useState, useRef } from 'react';
import { ToggleLeft, Activity } from 'lucide-react';
//import { getSensexTickerData  ,updateTickerStatusFromCache ,stopSensexTickerData } from "./streamTicker.actions";
// ThreeSec HTTP FETCH 
 import { placeCancelOrder  ,updateTickerStatusFromCache ,stopSensexTickerData } from "./cancelOrder.actions";
import {useDispatch, useSelector} from 'react-redux';
import {StorageUtils} from "@/libs/cache";
import {CommonConstants} from "@/utils/constants";
import { orderBookData } from '../positionGrid/orderBook.actions';
import './buttonOverride.css'; 

const CancelOrderButton = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [threeSec , setThreeSec] = useState(0);
 const dispatch = useDispatch();
 const [ threeSecInterval , setThreeSecInterval] = useState(0);
 const [ threeSecOrderInterval , setThreeSecOrderInterval] = useState(0);
 const [recentOrderStatus , setRecentOrderStatus ] = useState( '');
    const [showOrdersModal, setOrdersShowModal] = useState(false);
    const [showNoPendingOrders, setShowNoPendingOrders] = useState(false);
    const [showLogonModal, setLogonModal] = useState(false);
    const [userAuthCode , setUserAuthCode]= useState(null);
   const [orderShort, setOrderShort] = useState({ id:'' , symbol:'' , qty: 0, limitPrice: 0 });
 // const [orderShortList, setOrderShortList] = useState<{ id:'' , symbol:'' , qty: 0, limitPrice: 0 }>([]);
  const [orderShortList, setOrderShortList] = useState ([]);

    const [  orderId , setOrderId ] = useState('');
 // initially chcel the user is logged in 

 // to handle the netlify timeout 
  const [status, setStatus] = useState('idle'); // idle | loading | timeout | polling | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
   const retryCount = useRef(0);
  const pollingInterval = useRef(null);
// to handle the netlify timeout 


  useEffect (() => {
     console.log("Initialise ");
      userLoggedIn();

 } , []);

 useEffect (() => {
     console.log("RESET ");
     setIsStreaming((prev) => !prev);

 } , [threeSecInterval]);

 useEffect (() => {
     console.log("Order Cancel Status ");
     setRecentOrderStatus((prev) => prev = '');

 } , [setThreeSecOrderInterval]);

const fetchFreshOrdersToCancel = () => {

       // CLEAR THE CACHE and FETCH 
        StorageUtils._save(CommonConstants.cancelOrderDataCacheKey,"");
       // CLEAR THE render cancel STAtUS
       setRecentOrderStatus((prev) => prev = '');
       // FETCH the ORDER BOOK DATA ALSO ONCE 
       dispatch(orderBookData(''));
       // RE-FRESH the cancel order CACHE localstore data
       //using timeout here to wait till the cancel order list is fetched from server 
       // this make keep poping pending order modal be sure 
       setTimeout( ()=> {   
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
      
}

 const fetchOrdersToCancel = () => { 
   // , JSON.stringify(pendingCancelableOrders) from orderBook.actions
  let ordersToCancel =   StorageUtils._retrieve(CommonConstants.cancelOrderDataCacheKey);
   if(ordersToCancel !==null && ordersToCancel !== undefined){
    let orderBook = ordersToCancel.data;
    if(orderBook !==null && orderBook !== undefined){
      let isValidCancelOrdersJSON = false;
     try {
          const parsedObject = JSON.parse(orderBook);
            console.log("fetchOrdersToCancel parsedObject " +parsedObject);
            isValidCancelOrdersJSON= true;
         if(Array.isArray(parsedObject) && parsedObject.length >0){
          // reset the orderList 
          let orderList = []
          // create list of short id , symbol qty , limitPrice objects 
           
           parsedObject.forEach(validOrd => { 
               let id = validOrd.id;
               let symbol = validOrd.symbol;
               let qty = validOrd.qty;
               let limitPrice = validOrd.limitPrice;
              const freshOrder = { ...orderShort, id: id, qty: qty , symbol:symbol, limitPrice:limitPrice }; // fresh copy
              console.log("New independent order:", freshOrder);
              orderList.push(freshOrder);

           })
           // set the new OrderShortList
            setOrderShortList( prev => prev= orderList);
         } 
         else {  // empty no pending orders then 
            setOrderShortList([]);
               console.log (" no fresh pending orders ");
         }  
      }   
      catch(err){
            isValidCancelOrdersJSON = false;
            console.log("no valid positions data re-login or refresh ");
      }

      console.log("ORDER BOOK BUTTON : OrderBook multiple orders saved to cancelOrderDataCacheKey  ");
    }
   }
   else {
       console.log (" the fresh pending orders are emtpy clearing the previous cahced order");
       setOrderShort(null);
       setOrderShortList([]);
   }           

 }

   const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Toggle all orders
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orderShortList.map(order => order.id)));
    }
    setSelectAll(!selectAll);
  };

  // Toggle individual order
  const handleCheckboxChange = (orderId) => {
    const updated = new Set(selectedOrders);
    if (updated.has(orderId)) {
      updated.delete(orderId);
    } else {
      updated.add(orderId);
    }
    setSelectedOrders(updated);
  };


 const userLoggedIn = () => {
         console.log("Cancel user login check  ");
      const res1 = StorageUtils._retrieve(CommonConstants.fyersToken);
        if (res1.isValid && res1.data !== null) {
          let auth_code = res1.data['auth_code'];
          if (auth_code&& auth_code !== null && auth_code !== undefined) {
              console.log("User is Authorized ");
             setUserAuthCode(prevcode => prevcode = auth_code);
          }
        }
 }
 const handleCancellation = () => {
  console.log("Cancel these:", Array.from(selectedOrders));
  let selecOrdArray = Array.from(selectedOrders);
   if(Array.isArray(selecOrdArray) &&  selecOrdArray.length > 0   ){
          let orderSel = selecOrdArray[0];
          console.log("before setStreaming Order ID "+JSON.stringify(orderSel));
            setOrderId((prevId )=> prevId = orderSel);
          console.log("before setStreaming Order ID state variable "+orderId);
   }
 setIsStreaming((prev) => !prev);

    // Optionally, trigger your stream start/stop logic here
    if (!isStreaming) {
      console.log("Cancel started");
      // const recentOrderPlace = StorageUtils._retrieve(CommonConstants.recentOrderPlaced);
        if(Array.isArray(selectedOrders) &&  selectedOrders.length > 0   ){
          let orderSel = selectedOrders[0];
         // setOrderId(orderSel);
          setOrderId((prevId )=> prevId = orderSel);//setOrderId( (prevId )=> prevId = orderActualtoDel.id);
          // orderSel is the order id not the orderlist index 
          // so select the order first 
          let orderActualtoDel =   orderShortList.filter(ords => pareseInt(ords.id) == parseInt(orderSel));
          // TRY CHEC the ORDER is parseable 
          try{
          const stringifiedObject = JSON.stringify(orderActualtoDel);
            console.log(stringifiedObject);
            isValidCancelOrdersJSON= true;

          }catch (eer){
            console.log("ISSUE in the ORDER fetched , malformed or order data corrupted re-fetch the cancel order list")
          }
        
          let orderLocStore = JSON.stringify(orderActualtoDel);
            console.log("order processing "+orderLocStore);
            /*recentOrderPlace {"isValid":true,"data":"{\"id\":\"25080200003993\",\"exchOrdId\":\"\",\"exchange\":10,\"symbol\":\"NSE:NIFTY2580724650PE\",\"limitPrice\":234.4,\"side\":-1}"}
            */ 
           StorageUtils._save(CommonConstants.recentOrderPlaced,orderLocStore);
           // let orde =    JSON.parse(recentOrderPlace.data);
           setOrderId( (prevId )=> prevId = orderActualtoDel.id);
            console.log("cancelling order id  "+orderActualtoDel.id);
        }
      //START THE THREE SEC INTEVAL 
     let threeSecTimeOut =   setTimeout (  () => {
         // make or dispatch action to the streamTicker.actions.js
			//			"symbol":"NSE:NIFTY2580724650PE",
        //TRIIGER the sensex ticker Book Fetch   
        dispatch(placeCancelOrder('NSE:NIFTY2580724650PE'));
      // IF ABOVE UPDATE's with LIVE DATA the BELLOW CACHE WILL PICK IT 
      // SO THE TICKERCHIP should be able to get the DATA from later on 
       //  dispatch(updateTickerStatusFromCache('BSE:SENSEX-INDEX'));

       },1000);
       setTimeout( () => {
         // WAIT for the STATUS of ORDER CANCELLATION TO BE UPDATED 
          console.log("Cancel status set");
            
         setRecentOrderStatus(status => { 
            const recentOrderStatus =   StorageUtils._retrieve(CommonConstants.recentCancelledOrderStatus);
                if(recentOrderStatus !==null && recentOrderStatus !== undefined ){ 
                        let errorStatus =    JSON.parse(recentOrderStatus.data);
                    if(errorStatus !==null && errorStatus !== undefined && errorStatus?.message !==undefined){ 
                         setTimeout( () => {
                            // RE-CLEAR the ORDER CANCEL STATUS after 4 SEC of DISPLAY 
                              setRecentOrderStatus('')
                              setThreeSecOrderInterval(1)
                            // close the orders Dialog if at all open 
                            // this is not possible as the refrence to setOrdersShowModal is not available here 
                            //  setOrdersShowModal(false);  
                            },4000);    
                        return   errorStatus.message;
                    }
                    else {
                          console.log("Unable to parse order status ");
                          return  'Status re-click Cancel Orders ';
                    }
                }
                else {
                  //  let  remoteParsedError  =     StorageUtils._retrieve(CommonConstants.remoteServerGeneralErrorKey  );
                  //     let error    = ((remoteParsedError!==null && remoteParsedError !==undefined) ? remoteParsedError?.data?.message: 'Check Server logs ' );
                  //      return error;
                   let  remoteParsedError  =     StorageUtils._retrieve(CommonConstants.remoteServerGeneralErrorKey  );
                      if((remoteParsedError!==null && remoteParsedError !==undefined) ){
                        console.log("Server error or delay detected ");
                         if( remoteParsedError?.data !==null && remoteParsedError?.data  !==undefined  ){
                            let eData = remoteParsedError?.data;
                             console.log("Server  parse  okay  ");
                              let error    = ( eData?.message? eData.message : 'Check Server logs/Re-click Cancel Orders ' );
                            return error;
                         }
                         else if ( remoteParsedError?.message!==null && remoteParsedError?.message  !==undefined  ){ 
                             let eData = remoteParsedError?.data;
                              console.log("Server  parse slight okay  ");
                              let error    = ( eData?.message? eData.message : 'Check Server logs/Re-click Cancel Orders ' );
                            return error;
                         }
                         else {
                          console.log("Server error parse failed  ");
                            return 'Status re-click Cancel Orders ';
                         }
                      }
                     
                     
                }
        });
         // close the orders Dialog if at all open  will not work in any timeout 
         // setOrdersShowModal(false);  

       }, 10000)
     setThreeSec(threeSecTimeOut);
        let after45SecClosePoll =   setTimeout (  () => {
             clearTimeout(threeSecTimeOut)
             clearTimeout(threeSecInterval)
            
             setIsStreaming((prev) => !prev);
        }, 10000);

    } else {
      console.log("Cancel stopped");
       //TRIIGER the sensex ticker Book Fetch  
       // this was used in the EVENT source to send a close request separately 
      //  dispatch(stopSensexTickerData('BSE:SENSEX-INDEX'));
       // Stop the three second Interval Immediately and then 
        clearTimeout(threeSecInterval)
    }
     // close the orders Dialog if at all open 
     setOrdersShowModal(false);  

 }

const handleToggle = () => {
  console.log("Cancel enter ");
  userLoggedIn();
  if (userAuthCode && userAuthCode !== null && userAuthCode !== undefined) {
    console.log("User is Authorized ");
       fetchFreshOrdersToCancel();
       if(orderShortList.length > 0  ){ 
         setOrdersShowModal(true);
       }
       else { 
          console.log("No Pending orders ");
          setShowNoPendingOrders(true); //setShowNoPendingOrders(false)
       }

   } else {
       console.log("User not logged in ");
       setLogonModal(true);
   }

  };

  return (
    <> 
    <button id="CANCELBUTTONID"
      onClick={handleToggle}
      className={` py-1 px-2 rounded-lg mt-1   font-semibold hover:bg-blue-200   ${
        isStreaming
          ? 'bg-green-400 '
          : 'bg-brandgreenlight dark:text-white'
      }`}
    >
   {/*   {isStreaming ? (
        <Activity size={5} className=" animate-pulse " />
      ) : (
        <ToggleLeft size={5} className="text-gray-500" />
      )} */}
      <span id="CANCELBUTTONSPAN" className="text-sm font-semibold font-medium">
        {isStreaming ? 'Cancelling' : 'CancelOrder'}
      </span>
    </button>
        <div id="CANCELSTATUS" className={` py-1 px-4  mt-1 text-sm font-semibold hover:bg-blue-200   ${
        isStreaming
          ? 'bg-green-400 '
          : ' dark:text-white'
      }`}>   {isStreaming ? `Processing ${orderId}` : `${recentOrderStatus} ` }  </div>


       {showOrdersModal && (
         <>
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40"></div>

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-[320px] max-w-[90%] border border-gray-200">
            <h3 className="text-sm font-semibold mb-2 text-gray-700 text-center">Pending Orders</h3>

            {/* Select All */}
            <label className="flex items-center space-x-2 mb-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <span>Select All</span>
            </label>

            <div className="max-h-40 overflow-y-auto space-y-2 mb-4">
              {orderShortList.map((order) => (
                <div key={order.id} className="flex items-center justify-between text-xs text-gray-700 bg-gray-100 p-2 rounded">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => handleCheckboxChange(order.id)}
                    />
                    <span>{order.symbol}</span>
                  </label>
                  <span>{order.qty} @ ₹{order.limitPrice}</span>
                </div>
              ))}
            </div>

            {/* Confirm button */}
            <div className="flex items-center justify-between space-x-2">
              <button
                onClick={handleCancellation}
                className="flex-1 bg-brandgreen p-1 px-3  transition-all mx-2   text-white text-sm py-1 rounded-lg hover:bg-green-700 transition"
              >
                Cancel Selected
              </button>
            </div>

            {/* Cancel modal */}
            <button
              onClick={() => setOrdersShowModal(false)}
              className="mt-3 text-xs text-gray-500 hover:text-gray-700 block mx-auto"
            >
              Close
            </button>
          </div>
        </div>
      </>
      )}

        {showLogonModal && (
        <>
          {/* Backdrop   backdrop-blur-sm too much blur */}
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40"></div> 
           {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* shadow-xl  not needed  */}
            <div className="bg-white rounded-xl  p-6 w-[300px] max-w-[90%] border border-gray-200">
            {/*  <h3 className="text-lg font-semibold mb-2 text-gray-800 text-center">Confirm Order</h3>*/}
               <div className="flex items-center justify-between space-x-2">
              <button   onClick={() => setLogonModal(false)} class="bg-brandgreen p-1 px-3  transition-all rounded-full mx-2 dark:bg-white">
                <p class="text-white text-xs font-semibold  ">User not Logged in </p></button>
               </div>
             </div>
          </div>
        </>
      )}
        
        {showNoPendingOrders && (
        <>
          {/* Backdrop   backdrop-blur-sm too much blur */}
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40"></div> 
           {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* shadow-xl  not needed  */}
            <div className="bg-white rounded-xl  p-6 w-[300px] max-w-[90%] border border-gray-200">
            {/*  <h3 className="text-lg font-semibold mb-2 text-gray-800 text-center">Confirm Order</h3>*/}
               <div className="flex items-center justify-between space-x-2">
              <button   onClick={() => setShowNoPendingOrders(false)} class="bg-brandgreen p-1 px-3  transition-all rounded-full mx-2 dark:bg-white">
                <p class="text-white text-xs font-semibold  ">No Pending Orders </p></button>
               </div>
             </div>
          </div>
        </>
      )}




    </>
  );
};

export default CancelOrderButton;
/*
SAMPLE ORDER BOOK ORDERS 

 "orderBook": [
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739853",
            "id": "25080400000792",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 1,
            "type": 1,
            "pan": "AGNPA7583R",
            "limitPrice": 221.75,
            "productType": "MARGIN",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 75,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724650PE",
            "description": "25 Aug 07 24650 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 09:01:21",
            "side": -1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 0,
            "filledQty": 0,
            "exchOrdId": "",
            "message": "",
            "ch": -105.35,
            "chp": -57.96423658872077,
            "lp": 76.4,
            "orderNumStatus": "25080400000792:1",
            "slNo": 1,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739853",
            "id": "25080400002118",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 5,
            "type": 1,
            "pan": "AGNPA7583R",
            "limitPrice": 221.75,
            "productType": "MARGIN",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724650PE",
            "description": "25 Aug 07 24650 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 09:14:01",
            "side": -1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 0,
            "filledQty": 0,
            "exchOrdId": "",
            "message": "ORA:AMO is stopped",
            "ch": -105.35,
            "chp": -57.96423658872077,
            "lp": 76.4,
            "orderNumStatus": "25080400002118:5",
            "slNo": 2,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739853",
            "id": "25080400002166",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 5,
            "type": 1,
            "pan": "AGNPA7583R",
            "limitPrice": 231.75,
            "productType": "MARGIN",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724650PE",
            "description": "25 Aug 07 24650 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 09:14:22",
            "side": -1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 0,
            "filledQty": 0,
            "exchOrdId": "1300000000000646",
            "message": "16447 Order entry not allowed in Pre-open",
            "ch": -105.35,
            "chp": -57.96423658872077,
            "lp": 76.4,
            "orderNumStatus": "25080400002166:5",
            "slNo": 3,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739857",
            "id": "25080400025294",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 2,
            "type": 2,
            "pan": "AGNPA7583R",
            "limitPrice": 184.75,
            "productType": "INTRADAY",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724750PE",
            "description": "25 Aug 07 24750 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 09:25:42",
            "side": 1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 184.75,
            "filledQty": 75,
            "exchOrdId": "1500000006875246",
            "message": "",
            "ch": -127.5,
            "chp": -51.69268193796878,
            "lp": 119.15,
            "orderNumStatus": "25080400025294:2",
            "slNo": 4,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739857",
            "id": "25080400025905",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 2,
            "type": 1,
            "pan": "AGNPA7583R",
            "limitPrice": 187.95,
            "productType": "MARGIN",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724750PE",
            "description": "25 Aug 07 24750 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 09:42:30",
            "side": -1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 187.95,
            "filledQty": 75,
            "exchOrdId": "1500000007062243",
            "message": "",
            "ch": -127.5,
            "chp": -51.69268193796878,
            "lp": 119.15,
            "orderNumStatus": "25080400025905:2",
            "slNo": 5,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739853",
            "id": "25080400002455",
            "instrument": 14,
            "offlineOrder": false,
            "source": "API",
            "status": 1,
            "type": 1,
            "pan": "AGNPA7583R",
            "limitPrice": 221.75,
            "productType": "MARGIN",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724650PE",
            "description": "25 Aug 07 24650 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 09:45:02",
            "side": -1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 0,
            "filledQty": 0,
            "exchOrdId": "1300000000021286",
            "message": "",
            "ch": -105.35,
            "chp": -57.96423658872077,
            "lp": 76.4,
            "orderNumStatus": "25080400002455:1",
            "slNo": 6,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739853",
            "id": "25080400065522",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 2,
            "type": 2,
            "pan": "AGNPA7583R",
            "limitPrice": 172.7,
            "productType": "INTRADAY",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724650PE",
            "description": "25 Aug 07 24650 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 09:47:51",
            "side": 1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 172.7,
            "filledQty": 75,
            "exchOrdId": "1300000022189337",
            "message": "",
            "ch": -105.35,
            "chp": -57.96423658872077,
            "lp": 76.4,
            "orderNumStatus": "25080400065522:2",
            "slNo": 7,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739853",
            "id": "25080400065720",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 2,
            "type": 1,
            "pan": "AGNPA7583R",
            "limitPrice": 177,
            "productType": "INTRADAY",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724650PE",
            "description": "25 Aug 07 24650 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 09:48:11",
            "side": -1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 177,
            "filledQty": 75,
            "exchOrdId": "1300000022286807",
            "message": "",
            "ch": -105.35,
            "chp": -57.96423658872077,
            "lp": 76.4,
            "orderNumStatus": "25080400065720:2",
            "slNo": 8,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739853",
            "id": "25080400077817",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 1,
            "type": 1,
            "pan": "AGNPA7583R",
            "limitPrice": 2.7,
            "productType": "INTRADAY",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724650PE",
            "description": "25 Aug 07 24650 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 10:04:46",
            "side": 1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 0,
            "filledQty": 0,
            "exchOrdId": "1300000026364636",
            "message": "",
            "ch": -105.35,
            "chp": -57.96423658872077,
            "lp": 76.4,
            "orderNumStatus": "25080400077817:1",
            "slNo": 9,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739857",
            "id": "25080400093102",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 5,
            "type": 2,
            "pan": "AGNPA7583R",
            "limitPrice": 0,
            "productType": "INTRADAY",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724750PE",
            "description": "25 Aug 07 24750 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 10:05:06",
            "side": 1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 0,
            "filledQty": 0,
            "exchOrdId": "",
            "message": "RED:Margin Shortfall:INR 67.53 Available:INR 14,387.47 for C-XV31360 [FYERS_RISK_CUG]",
            "ch": -127.5,
            "chp": -51.69268193796878,
            "lp": 119.15,
            "orderNumStatus": "25080400093102:5",
            "slNo": 10,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739857",
            "id": "25080400093706",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 1,
            "type": 2,
            "pan": "AGNPA7583R",
            "limitPrice": 165.15,
            "productType": "MARGIN",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724750PE",
            "description": "25 Aug 07 24750 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 10:12:40",
            "side": 1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 0,
            "filledQty": 0,
            "exchOrdId": "1500000030243770",
            "message": "",
            "ch": -127.5,
            "chp": -51.69268193796878,
            "lp": 119.15,
            "orderNumStatus": "25080400093706:1",
            "slNo": 11,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739853",
            "id": "25080400101417",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 2,
            "type": 2,
            "pan": "AGNPA7583R",
            "limitPrice": 140.45,
            "productType": "INTRADAY",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724650PE",
            "description": "25 Aug 07 24650 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 10:12:47",
            "side": 1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 140.45,
            "filledQty": 75,
            "exchOrdId": "1300000039371775",
            "message": "",
            "ch": -105.35,
            "chp": -57.96423658872077,
            "lp": 76.4,
            "orderNumStatus": "25080400101417:2",
            "slNo": 12,
            "orderTag": "2:Untagged"
        },
        {
            "clientId": "XV31360",
            "exchange": 10,
            "fyToken": "101125080739853",
            "id": "25080400108691",
            "instrument": 14,
            "offlineOrder": false,
            "source": "W",
            "status": 2,
            "type": 2,
            "pan": "AGNPA7583R",
            "limitPrice": 137.75,
            "productType": "INTRADAY",
            "qty": 75,
            "disclosedQty": 0,
            "remainingQuantity": 0,
            "segment": 11,
            "symbol": "NSE:NIFTY2580724650PE",
            "description": "25 Aug 07 24650 PE",
            "ex_sym": "NIFTY",
            "orderDateTime": "04-Aug-2025 10:20:17",
            "side": 1,
            "orderValidity": "DAY",
            "stopPrice": 0,
            "tradedPrice": 137.75,
            "filledQty": 75,
            "exchOrdId": "1300000043794605",
            "message": "",
            "ch": -105.35,
            "chp": -57.96423658872077,
            "lp": 76.4,
            "orderNumStatus": "25080400108691:2",
            "slNo": 13,
            "orderTag": "2:Untagged"
        },



*/