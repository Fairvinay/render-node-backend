import {StorageUtils} from "@/libs/cache"
import {API} from "@/libs/client"
import {disableLoader, enableLoader} from "@/redux/slices/miscSlice"
import {saveCompanyData} from "@/redux/slices/stockSlice"
import {CommonConstants} from "@/utils/constants"
import toast from "react-hot-toast"

export const getCompanyData = (_id: string | string[]) => {
      // SAMPLE TOP GANERS DEFAULT DATA 
       console.log("getCompanyData: _id  "+JSON.stringify( _id))
      StorageUtils._save (CommonConstants.stockDataCacheKey,CommonConstants.sampleDataVersion1);
    return async (dispatch: Function) => {
        const dataFromCache = StorageUtils._retrieve(CommonConstants.companyDataCacheKey)
        if (dataFromCache.isValid && dataFromCache.data !== null) {
             console.log("getCompanyData: available  " )
            const parsedData = dataFromCache.data
            const parsedMetaData = dataFromCache.data["Meta Data"];
            const parsedSym  = parsedMetaData["2. Symbol"];
            if ( parsedSym === _id ||  parsedData.Symbol === _id ) {
                 console.log("getCompanyData: available exact  "+JSON.stringify( _id))

                dispatch(saveCompanyData(parsedData))
                return;
            }else {
                 console.log("getCompanyData: available not exact symbol "+JSON.stringify( _id))
                  console.log("getCompanyData:  "+JSON.stringify(parsedData))
            }
        }
        else {
             console.log("getCompanyData: unavailable  " )
        }

        dispatch(enableLoader())


        try {
            const res = await API.get('/', {params: {function: 'OVERVIEW', symbol: _id}})

            let compData = res.data;
             if (compData["2. Symbol"] == _id) { 
                     console.log("fresh data fetched : _id  "+JSON.stringify( _id))
                   dispatch(saveCompanyData(res.data));
                   StorageUtils._save(CommonConstants.companyDataCacheKey, res.data);
                 }
             // Handle rate limit error string inside response
           /* if (
                res.data?.Information?.includes("We have detected your API key") ||
                res.data.Note?.includes("Thank you for using Alpha Vantage") // fallback
            ) {
                dispatch({ type: 'SHOW_SUBSCRIPTION_POPUP' }); // dispatch popup
                 StorageUtils._save(CommonConstants.companyDataCacheKey, res.data)
               // dispatch(saveCompanyData(null));
            }*/ else {
                // check company Data contains proper Symbol and Time Series Data 
                // else dont's set it 
                let compData = res.data;
                if (compData["2. Symbol"] == _id) { 
                     console.log("fresh data fetched : _id  "+JSON.stringify( _id))
                   dispatch(saveCompanyData(res.data));
                   StorageUtils._save(CommonConstants.companyDataCacheKey, res.data);
                 }
            }
           // dispatch(saveCompanyData(res.data))
           
        } catch (err) {
            // @ts-ignore
            const {message} = err
            toast.error(message ? message : "Something went wrong!")
            console.log(err)

           // dispatch(saveCompanyData(null))
        } finally {
            dispatch(disableLoader())
        }
    }
}
