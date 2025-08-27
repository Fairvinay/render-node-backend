import { API } from "@/libs/client"
import { CommonConstants } from "@/utils/constants"
import toast from "react-hot-toast/headless"
import { convertDateToReadable } from "./chart.functions"
import { StorageUtils } from "@/libs/cache"
const mapper = {
    "TIME_SERIES_DAILY": "Time Series (Daily)",
    "TIME_SERIES_WEEKLY": "Weekly Time Series",
    "TIME_SERIES_MONTHLY": "Monthly Time Series",
    "TIME_SERIES_INTRADAY": "Time Series (5min)"
}

export const fetchChartData = (
    setLoading: Function,
    fetchFn: any,
    Symbol: string,
    setChartData: Function,
    setAxisMin: Function,
    setAxisMax: Function,
) => {

    return async (dispatch: Function) => {
        try {
            setLoading(true)
            let res;
            // check Fyers Tokem 
            // check Company Data Local Storeage presetn 
            let cmpSymMatch= false; let    parsedData:any = undefined;
              const dataFromCache = StorageUtils._retrieve(CommonConstants.companyDataCacheKey)
             if (dataFromCache.isValid && dataFromCache.data !== null) {
                 console.log("company Data Available  : "  );
                 //    "2. Symbol"
                   parsedData = dataFromCache.data
                if (parsedData.Symbol.indexOf(Symbol) > -1 ) {
                     console.log("company Data Available for  : "+JSON.stringify(Symbol)  );
                     cmpSymMatch = true;
                }
             }
            if (fetchFn === "TIME_SERIES_INTRADAY" && !cmpSymMatch) {
                console.log("chart action fetchFn : "+JSON.stringify(fetchFn) )
                console.log("chart action Symbol : "+JSON.stringify(Symbol) )
                res = await API.get('/', { params: { function: fetchFn, symbol: Symbol, interval:'5min' } })
            } else {
                 console.log("chart action fetchFn : "+JSON.stringify(fetchFn) )
                  console.log("chart action Symbol : "+JSON.stringify(Symbol) )
                 // res = await API.get('/', { params: { function: fetchFn, symbol: Symbol } })
                 res =  {  data :  parsedData };
            }
                // @ts-ignore
                const chartDates = res.data[mapper[fetchFn]]
                const chartDateAndClose = Object.keys(chartDates).map((date: string) => {
                    return {
                        Date: convertDateToReadable(date),
                        Close: parseFloat(chartDates[date][CommonConstants.closeDataKey])
                    }
                })
                setChartData(chartDateAndClose)
                setAxisMin(Math.min(...chartDateAndClose.map((item: any) => item.Close)))
                setAxisMax(Math.max(...chartDateAndClose.map((item: any) => item.Close)))
        } catch (err) {
            toast.error("Something went wrong!")
        } finally {
            setLoading(false)
        }
    }
}