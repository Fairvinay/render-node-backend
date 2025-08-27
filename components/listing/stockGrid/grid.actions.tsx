import { getHoldingData } from "@/components/company/holdings/holdings.actions"
import { getTradeData } from "@/components/company/trade/tradeBook.actions"
import {StorageUtils} from "@/libs/cache"
import {API} from "@/libs/client"
import {disableLoader, enableLoader} from "@/redux/slices/miscSlice"
import {saveActivelyTraded, saveGainers, saveLosers , saveHoldingData } from "@/redux/slices/stockSlice"
import { saveTradeBook } from "@/redux/slices/tradeSlice"
import {CommonConstants} from "@/utils/constants"
import toast from "react-hot-toast"
import { getPositionData } from "../positionGrid/positionGridBook.actions"
import { savePositionBook } from "@/redux/slices/positionSlice"

export const fetchStockList = () => {
   //  _save: (key: string, value: any) => {
    StorageUtils._save (CommonConstants.stockDataCacheKey,CommonConstants.sampleData);
   
       let globalUserCheck  :any = undefined;
    return async (dispatch: Function) => {
        const dataFromCache = StorageUtils._retrieve(CommonConstants.stockDataCacheKey)
        if (dataFromCache.isValid && dataFromCache.data !== null) {
            let res = dataFromCache.data
            
            if(res ===undefined){
                res = JSON.parse(CommonConstants.sampleData);
            }
            if( typeof res === 'string'){
                console.log(" parsing data string ");
                 res = JSON.parse(CommonConstants.sampleDataVersion1);
            }
            console.log(dataFromCache, res, "thid data")

               if (Array.isArray(res?.top_gainers)) {
                dispatch(saveGainers(res.top_gainers));
                }
                if (Array.isArray(res?.top_losers)) {
                dispatch(saveLosers(res.top_losers));
                }
          //  dispatch(saveGainers(res.top_gainers))
         //   dispatch(saveLosers(res.top_losers))
          //  dispatch(saveActivelyTraded(res.most_actively_traded))
            return;
        }
        // IFF Logged in fetch the TRade Book 
         const res = StorageUtils._retrieve(CommonConstants.fyersToken);
        if (res.isValid && res.data !== null) {
            
            let auth_code = res.data['auth_code'];
            if (auth_code&& auth_code !== null && auth_code !== undefined) {
                console.log("User is Authorized ");
                //clearInterval(globalUserCheck);
            }
            else{
                console.log("User is awaiting authorization ");
            }
        }

        try {
            dispatch(enableLoader())
            const res = await API.get('/', {params: {function: 'TOP_GAINERS_LOSERS' , apikey:CommonConstants.apiKey}})
            StorageUtils._save(CommonConstants.stockDataCacheKey, res.data)
            dispatch(saveGainers(res.data.top_gainers))
            dispatch(saveLosers(res.data.top_losers))
            dispatch(saveActivelyTraded(res.data.most_actively_traded))
             // FETHE TRAADE BOOK DATA 
            dispatch(getTradeData(''));
            // FETH The recentTRades from storage if above call succeeded data will be there
            let redentTradeData =  StorageUtils._retrieve(CommonConstants.recentTradesKey)
            const dataFromCache = StorageUtils._retrieve(CommonConstants.tradeDataCacheKey)
            if( redentTradeData !== null && redentTradeData !==undefined  &&  Array.isArray(redentTradeData.data )){
                 console.log(" GRID aCTIONS recenTrades  "+JSON.stringify(redentTradeData.data))

            }else {
                console.log("trade data fro cahce ")
                redentTradeData = dataFromCache;
            }
            dispatch( saveTradeBook(([...redentTradeData.data])));





        } catch (error) {
            // @ts-ignore
            const {message} = error
            toast.error(message ? message : "Something went wrong!")
            console.log(error)
            return error
        } finally {
            dispatch(disableLoader())
        }
    }
}

export const fetchMoreStocks = (_gainers: any, _losers: any, _activelyTraded: any) => {
    return async (dispatch: Function) => {
        dispatch(enableLoader())
        try {
            const res = await API.get('/', {params: {function: 'TOP_GAINERS_LOSERS' , apikey:CommonConstants.apiKey}})
            console.log(res.data)
            dispatch(saveGainers([..._gainers, ...res.data.top_gainers]))
            dispatch(saveLosers([..._losers, ...res.data.top_losers]))
            dispatch(saveActivelyTraded([..._activelyTraded, ...res.data.most_actively_traded]))
            dispatch(getHoldingData);
             const resholdings =   StorageUtils._retrieve(CommonConstants.holdingsDataCacheKey)
            console.log("holdings " + resholdings.data)
            if(resholdings !== null && resholdings.data !==null && resholdings.data !==undefined) { 
                 console.log("saved holdings data  " + resholdings.data)
             dispatch(saveHoldingData([ ...resholdings.data]))
             }

              // FETHE TRAADE BOOK DATA 
            dispatch(getTradeData(''));
            // FETH The recentTRades from storage if above call succeeded data will be there
            let redentTradeData =  StorageUtils._retrieve(CommonConstants.recentTradesKey)
            const dataFromCache = StorageUtils._retrieve(CommonConstants.tradeDataCacheKey)
            if( redentTradeData !== null && redentTradeData !==undefined  &&  Array.isArray(redentTradeData.data )){
                 console.log(" GRID aCTIONS recenTrades  "+JSON.stringify(redentTradeData.data))

            }else {
                console.log("trade data fro cahce ")
                redentTradeData = dataFromCache;
            }
            dispatch( saveTradeBook(([...redentTradeData.data])));

            let fetchPostion =  StorageUtils._retrieve(CommonConstants.fetchPositions).data;

            if(fetchPostion ===true){  
               // FETHE POSITION BOOK DATA 
            dispatch(getPositionData(''));
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
             }   


        } catch (error) {
            console.log(error)
            return error
        } finally {
            dispatch(disableLoader())
        }
    }
}
