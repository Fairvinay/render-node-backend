// FetchPositionButton.jsx
import React, { useState } from 'react';
import { ToggleLeft, Activity } from 'lucide-react';
//import { getSensexTickerData  ,updateTickerStatusFromCache ,stopSensexTickerData } from "./streamTicker.actions";
// ThreeSec HTTP FETCH 
// import { getSensexTickerData  ,updateTickerStatusFromCache ,stopSensexTickerData } from "./threeSecCEQuote.actions";
import {useDispatch, useSelector} from 'react-redux';
import {StorageUtils} from "@/libs/cache";
import {CommonConstants} from "@/utils/constants";
import './buttonOverride.css'; 
import { getPositionData } from '../positionGrid/positionGridBook.actions';
import { orderBookData } from '../positionGrid/orderBook.actions';
import { savePositionBook } from '@/redux/slices/positionSlice';

const FetchPositionButton = ({ onFetchComplete, sortedData }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [threeSec , setThreeSec] = useState(0);
   const [showModal, setShowModal] = useState(false);
 const dispatch = useDispatch();
  const handlePositions = () => {
     console.log("Fetch Position enter ");
const res1 = StorageUtils._retrieve(CommonConstants.fyersToken);
  if (res1.isValid && res1.data !== null) {
    let auth_code = res1.data['auth_code'];
    if (auth_code&& auth_code !== null && auth_code !== undefined) {
        console.log("User is Authorized ");
        // fetchTradeBook();
             setIsStreaming((prev) => !prev);
    // Optionally, trigger your stream start/stop logic here
    if (!isStreaming) {
      console.log("Fetch Position started");
      //START THE THREE SEC INTEVAL 
     let threeSecInterval =   setInterval (  () => {
         // make or dispatch action to the streamTicker.actions.js
       //TRIIGER the position and order Book Fetch  

           // FETHE POSITION BOOK DATA 
               dispatch(getPositionData(''));
           // WE have to place this in a time out as the get Position make take time to fetch 
           setTimeout( () => {
                // FETH The recentTRades from storage if above call succeeded data will be there
               let redentPositionData =  StorageUtils._retrieve(CommonConstants.recentPositionsKey)
               const dataFromCache2 = StorageUtils._retrieve(CommonConstants.positionDataCacheKey)
               if( redentPositionData !== null && redentPositionData !==undefined  &&  Array.isArray(redentPositionData.data )){
                       console.log(" GRID aCTIONS recenPositions  "+JSON.stringify(redentPositionData.data))
       
               }else {
                   console.log("positions data from cahce ")
                   redentPositionData = dataFromCache2;
               }
                dispatch( savePositionBook(([...redentPositionData.data])));
                onFetchComplete([...redentPositionData.data]);
                //setPositionOneFetch(prev => prev+1);
                  StorageUtils._save(CommonConstants.fetchPositions, true)
               // FETCH the ORDER BOOK DATA ALSO ONCE 
                 dispatch(orderBookData(''));


           } , 5000);             
             
      //  dispatch(getSensexTickerData('BSE:SENSEX-INDEX'));
      // IF ABOVE UPDATE's with LIVE DATA the BELLOW CACHE WILL PICK IT 
      // SO THE TICKERCHIP should be able to get the DATA from later on 
      //   dispatch(updateTickerStatusFromCache('BSE:SENSEX-INDEX'));

       },3000);
     setThreeSec(threeSecInterval);
        let after45SecClosePoll =   setTimeout (  () => {
             clearInterval(threeSecInterval)
             setIsStreaming((prev) => !prev);
        }, 10000);

    } else {
      console.log("Fetch position stopped");
       //TRIIGER the sensex ticker Book Fetch  
       // this was used in the EVENT source to send a close request separately 
      //  dispatch(stopSensexTickerData('BSE:SENSEX-INDEX'));
       // Stop the three second Interval Immediately and then 
        clearInterval(threeSecInterval)
    }
    }
    else {
       console.log("User not Authorised ");
      // setShowModal(true);

    }
  } else {
       console.log("User not Logged in ");
       setShowModal(true);

    }
   

  };

  return (
    <>  
    <button
      onClick={handlePositions}
      className={`flex items-center gap-2 px-3 py-2  rounded-md  shadow-sm  border transition duration-200 ${
        isStreaming
          ? 'bg-primary green hover:bg-green-800 border-green-700'
          : 'bg-gray-100 border-gray-300 text-gray-600'
      }`}
    >
      {isStreaming ? (
        <Activity size={20} className=" animate-pulse " />
      ) : (
        <ToggleLeft size={20} className="text-gray-500" />
      )}
      <span className="text-sm font-semibold font-medium">
        {isStreaming ? 'Fetching' : 'Positions'}
      </span>
    </button>
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
                 
                <button
                  
                  className="flex-1 bg-brandgreen-600  py-1 rounded-lg hover:bg-green-700 transition"
                >
                 User Not Logged
                </button>
 
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

export default FetchPositionButton;
