"use client";
import Chip from "@/components/common/textChip/chip.component";
import CompanyAbout from "@/components/company/companyAbout/about.component";
import Info from "@/components/common/insightBox/info.component";
import React, {Suspense, useEffect, useState} from "react";
import Header from "@/components/common/pageHeader/header.component";
import CompanyHeader from "@/components/company/companyDetails/details.component";
import  TradeTable  from "@/components/company/trade/TradeTable";
import {useSelector} from "react-redux";
import {GlobalState} from "@/redux/store";
import {getCompanyData} from "@/app/company/[slug]/company.actions";
import {useAppDispatch} from "@/providers/ReduxProvider";
import {ActionLoader} from "@/components/loader/actionLoader/loader.component";
import { getTradeData } from "../trade/tradeBook.actions";
import { CommonConstants } from "@/utils/constants";
import { StorageUtils } from "@/libs/cache";

const CompanyChart = React.lazy(() => import('@/components/company/priceChart/CompanyChart'))
const CompanyView = (props: any) => {
    const isDarkMode = useSelector((state: GlobalState) => state.misc.isDarkMode)

    const selectedCard = useSelector((state: GlobalState) => state.stock.selectedCard)
    const companyData = useSelector((state: GlobalState) => state.stock.companyData)
    const tradeData = useSelector((state: GlobalState) => state.trade.tradeBook)
   const [trades ,setTrades ] =  useState<any[]>([]);
    const dispatch = useAppDispatch();
    useEffect(() => {
        console.log("CompanyView: props._id  "+JSON.stringify(props._id))
         console.log("CompanyView: props._id 2 " )
        dispatch(getCompanyData(props._id))

        // FETHE TRAADE BOOK DATA 
        dispatch(getTradeData(props._id));
        // FETH The recentTRades from storage if above call succeeded data will be there
        let redentTradeData =  StorageUtils._retrieve(CommonConstants.recentTradesKey)
         const dataFromCache = StorageUtils._retrieve(CommonConstants.tradeDataCacheKey)
         if( redentTradeData !== null && redentTradeData !==undefined){

         }else {
            console.log("trade data fro cahce ")
            redentTradeData = dataFromCache;
         }
          console.log(" CompanyView state.trade.tradeBook "+JSON.stringify(tradeData))
       let tradeLocal  =   tradeData !== undefined? tradeData : redentTradeData;
       if(tradeData !==undefined &&  Array.isArray(tradeData ) ){
         setTrades( tradeData );
       }
       else if(redentTradeData.data !==undefined &&  Array.isArray(redentTradeData.data )) {
        console.log(" CompanyView recenTrades  "+JSON.stringify(redentTradeData.data))
          setTrades( redentTradeData.data );
       }
      
          console.log(" CompanyView trades  "+JSON.stringify(tradeLocal))

    }, [dispatch, props._id]); 
    // adding here tradeData cause lot's of server side fyersgettradebook calls 
    // , tradeData

    if (!companyData) {
        return <p>Loading...</p>
    }

    if (!selectedCard) {
        return <p>{`Can't`} load, please go back.</p>
    }
    else { 
         console.log("selectedCard:    "+JSON.stringify(selectedCard))
    }

    return (
        <div className={isDarkMode ? 'dark' : ''}>

            <div className={"bg-white dark:bg-black"}>
                <Header/>
                <CompanyHeader
                    Symbol={selectedCard.ticker || "Sample"}
                    price={selectedCard.price || "Demo"}
                    change_amount={selectedCard.change_amount || "abc"}
                    change_percentage={selectedCard.change_percentage || "ac"}
                    Exchange={selectedCard.exchange || "NSE"}
                    {...companyData}
                />
                <Suspense fallback={<ActionLoader/>}>
                   {/*  <CompanyChart Symbol={props._id}/>*/}
                </Suspense>
                <div className="flex flex-wrap gap-2 items-center w-10/12 mx-auto my-3">
                    <Chip isSelected={false} text={`SECTOR: ${companyData?.Sector  || "General"}`}/>
                    <Chip isSelected={false} text={`INDUSTRY: ${companyData?.Industry || "Listed"}`}/>
                </div>

                <CompanyAbout {...companyData} />
                <div className="flex gap-3 flex-wrap items-center justify-around w-10/12 mx-auto mt-4 py-4">
                       {/* text={`LISTING: ${tradeData?.Sector  || "TRADES"}`*/}
                  <TradeTable tradeDataB={ trades} />
                </div>
                <div className="flex gap-3 flex-wrap items-center justify-around w-10/12 mx-auto mt-4 py-4">
                    <Info title={'Price/Earning Ratio '} value={companyData?.PERatio}/>
                    <Info title={'PE to Growth Ratio'} value={companyData?.PEGRatio}/>
                    <Info title={'Dividend per share'} value={companyData?.DividendPerShare}/>
                    <Info title={'Currency'} value={companyData?.Currency}/>
                    <Info title={'Market Capitalization'} value={companyData?.Currency}/>
                </div>
            </div>

        </div>
    )


}

export default CompanyView
