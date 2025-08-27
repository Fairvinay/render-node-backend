// StreamToggleButton.jsx
import React, { useEffect, useState } from 'react';
import { ToggleLeft, Activity } from 'lucide-react';
//import { getSensexTickerData  ,updateTickerStatusFromCache ,stopSensexTickerData } from "./streamTicker.actions";
// ThreeSec HTTP FETCH 
 import { placeBuyOrder  ,updateTickerStatusFromCache ,stopSensexTickerData } from "./placeBuyOrder.actions";
import {useDispatch, useSelector} from 'react-redux';
import {StorageUtils} from "@/libs/cache";
import {CommonConstants} from "@/utils/constants";
import './buttonOverride.css'; 

const PlaceOrderButton = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [threeSec , setThreeSec] = useState(0);
 const dispatch = useDispatch();
 const [ threeSecInterval , setThreeSecInterval] = useState(0);
 const [ threeSecOrderInterval , setThreeSecOrderInterval] = useState(0);
 const [recentOrderStatus , setRecentOrderStatus ] = useState( '');
const [tradeSet, setTradeSet] = useState({ qty: 0, price: 0 });
 const [showModal, setShowModal] = useState(false);
   
    const [  orderId , setOrderId ] = useState('');
 useEffect (() => {
     console.log("Place RESET ");
     setIsStreaming((prev) => !prev);

 } , [threeSecInterval]);

 useEffect (() => {
     console.log("Place Order Status ");
     setRecentOrderStatus((prev) => prev = '');

 } , [setThreeSecOrderInterval]);



  const handleToggle = () => {
    setIsStreaming((prev) => !prev);

    // Optionally, trigger your stream start/stop logic here
    if (!isStreaming) {
      console.log("Placing started");
      // const recentOrderPlace = StorageUtils._retrieve(CommonConstants.recentOrderPlaced);
      //  if(recentOrderPlace !==null && recentOrderPlace !== undefined ){
      //      console.log("order processing "+JSON.stringify(recentOrderPlace));
            /*recentOrderPlace {"isValid":true,"data":"{\"id\":\"25080200003993\",\"exchOrdId\":\"\",\"exchange\":10,\"symbol\":\"NSE:NIFTY2580724650PE\",\"limitPrice\":234.4,\"side\":-1}"}
            */ 
      //      let orde =    JSON.parse(recentOrderPlace.data);
    //       setOrderId( (prevId )=> prevId = orde.id );
    //    }
      //START THE THREE SEC INTEVAL 
     let threeSecTimeOut =   setTimeout (  () => {
         // make or dispatch action to the streamTicker.actions.js
			//			"symbol":"NSE:NIFTY2580724650PE",
        //TRIIGER the sensex ticker Book Fetch   
    //    dispatch(placeCancelOrder('NSE:NIFTY2580724650PE'));
      // IF ABOVE UPDATE's with LIVE DATA the BELLOW CACHE WILL PICK IT 
      // SO THE TICKERCHIP should be able to get the DATA from later on 
       //  dispatch(updateTickerStatusFromCache('BSE:SENSEX-INDEX'));

       },1000);
       setTimeout( () => {
         // WAIT for the STATUS of ORDER PLACEMENT TO BE UPDATED 
          console.log("Place Buy Order status set");
            
         setRecentOrderStatus(status => { 
           let recentOrderStatus =   StorageUtils._retrieve(CommonConstants.recentBuyOrderStatus);
                 recentOrderStatus = (recentOrderStatus !==null && recentOrderStatus !== undefined ) ? recentOrderStatus :
                          StorageUtils._retrieve(CommonConstants.recentBuyledOrderStatus);
                if(recentOrderStatus !==null && recentOrderStatus !== undefined ){ 
                        let errorStatus =    JSON.parse(recentOrderStatus.data);
                    if(errorStatus !==null && errorStatus !== undefined && errorStatus?.message !==undefined){ 
                         setTimeout( () => {
                            // RE-CLEAR the ORDER PLACEMENT STATUS after 4 SEC of DISPLAY 
                              setRecentOrderStatus('')
                              setThreeSecOrderInterval(1)
                            },4000);    
                        return   errorStatus.message;
                    }
                    else {
                        return '';
                    }
                    }
                else {
                    return '';
                }
        });
       

       }, 10000)
     setThreeSec(threeSecTimeOut);
        let after45SecClosePoll =   setTimeout (  () => {
             clearTimeout(threeSecTimeOut)
             clearTimeout(threeSecInterval)
            
             setIsStreaming((prev) => !prev);
        }, 10000);

    } else {
      console.log("Place Order stopped");
       //TRIIGER the sensex ticker Book Fetch  
       // this was used in the EVENT source to send a close request separately 
      //  dispatch(stopSensexTickerData('BSE:SENSEX-INDEX'));
       // Stop the three second Interval Immediately and then 
        clearTimeout(threeSecInterval)
    }
  };
  const setBuyOrder = () => {
    const qtyNum = Number(tradeSet.qty);
    const priceNum = Number(tradeSet.price);
     const _id = 'NIFTY2581424400CE';
     const sym = 'NIFTY2581424400CE';

    if (qtyNum <= 0 || priceNum <= 0) {
        alert("Enter valid Qty and Price for Buy");
        return;
    }

    dispatch(placeBuyOrder({_id:'NIFTY2581424400CE', qty: qtyNum, price: priceNum, symbol: sym }));

    // Optional: Wait 3 sec for response
    setTimeout(() => {
        console.log("Buy order response awaited for 3 seconds");
        // You can check state or show confirmation here
    }, 3000);

    setShowModal(false);
} ;

const setSellOrder = () => {
  const qtyNum = Number(tradeSet.qty);
  const priceNum = Number(tradeSet.price);

  if (qtyNum <= 0 || priceNum <= 0) {
    alert("Enter valid Qty and Price for Sell");
    return;
  }

  dispatch(placeSellOrder({ qty: qtyNum, price: priceNum }));

  setTimeout(() => {
    console.log("Sell order response awaited for 3 seconds");
  }, 3000);

  setShowModal(false);
};





  return (
    <> 
    <button id="PLACEORDERBUTTONID"
      onClick={() => {  setShowModal(true); handleToggle(); }}  
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
      <span id="PLACEORDERBUTTONSPAN" className="text-sm font-semibold font-medium">
        {isStreaming ? 'Placing' : 'Place Order'}
      </span>
    </button>
      {/*  <div id="PLACEORDERSTATUS" className={` py-1 px-4  mt-1 text-sm font-semibold hover:bg-blue-200   ${
        isStreaming
          ? 'bg-green-400 '
          : ' dark:text-white'
      }`}>   {isStreaming ? `Processing ${orderId}` : `${recentOrderStatus} ` }  </div>*/}

     {showModal && (
        <>
          {/* Backdrop   backdrop-blur-sm too much blur */}
          <div className="fixed inset-0 bg-black bg-opacity-40 z-40"></div> 

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* shadow-xl  not needed  */}
            <div className="bg-white rounded-xl  p-6 w-[300px] max-w-[90%] border border-gray-200">
            {/*  <h3 className="text-lg font-semibold mb-2 text-gray-800 text-center">Confirm Order</h3>*/}

              <div className="flex items-center justify-between space-x-2">
                  {/* Input left of BUY */}
                <input
                  type="text"
                  placeholder="Qty"
                   value={tradeSet.qty}
                onChange={(e) => setTradeSet({ ...tradeSet, qty: e.target.value })}
                  className="w-16 text-sm px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {/*  flex-1 bg-brandgreen-600  py-1 rounded-lg hover:bg-green-700 transition
                 */}
                <button
                 onClick={setBuyOrder}
                  className="flex-1 bg-brandgreen p-1 px-1  transition-all mx-2   text-white text-sm py-1 rounded-lg hover:bg-green-700 transition"
                >
                  BUY
                </button>

                <button
                 onClick={setSellOrder}
                  className="flex-1 bg-brandgreenlight p-1 px-1  transition-all rounded-full mx-2 dark:bg-white"
                >
                  SELL
                </button>
                {/* flex-1 bg-red-600   py-1 rounded-lg hover:bg-red-700 transition*/ }
                {/* Input right of SELL */}
                <input
                  type="text"
                  placeholder="Price"
                   value={tradeSet.price}
                    onChange={(e) => setTradeSet({ ...tradeSet, price: e.target.value })}
                  className="w-16 text-sm px-2 py-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700 block mx-auto"
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}

 


    </>
  );
};

export default PlaceOrderButton;
