"use client";
import React, {useEffect, useState} from 'react'
import StockCard from '../stockCard/card.component'
import {useSelector} from 'react-redux';
import {GlobalState} from '@/redux/store';
import {ArrowDown2} from 'iconsax-react';
import {ScreenLoader} from '../../loader/screenLoader/loader.component';
import {fetchMoreStocks, fetchStockList} from './grid.actions';
import {useAppDispatch} from '@/providers/ReduxProvider';
import TradeTable from '@/components/company/trade/TradeTable';
import TradeGrid from '../tradeGrid/TradeGrid';
import PositionGrid from '../positionGrid/PositionGrid';
import { getPositionData } from '../positionGrid/positionGridBook.actions';
import { orderBookData } from '../positionGrid/orderBook.actions';
import { StorageUtils } from '@/libs/cache';
import { savePositionBook } from '@/redux/slices/positionSlice';
import { CommonConstants } from '@/utils/constants';

const StockGrid = () => {
    const gainers = useSelector((state: GlobalState) => state.stock.gainers)
    const losers = useSelector((state: GlobalState) => state.stock.losers)
    const activelyTraded = useSelector((state: GlobalState) => state.stock.activelyTraded)
    const tradeData = useSelector((state: GlobalState) => state.trade.tradeBook)
    const positionData = useSelector((state: GlobalState) => state.position.positionBook)
    const holdings = useSelector((state: GlobalState) => state.holding.holdingBook)
    const tab = useSelector((state: GlobalState) => state.misc.tab)
    const dispatch = useAppDispatch()
    const loader = useSelector((state: GlobalState) => state.misc.loader)
    const [positionOneFetch ,setPositionOneFetch ]= useState((  StorageUtils._retrieve(CommonConstants.fetchPositions).data ===  false  ? 1:0 )  );

    const fetchMoreData = async () => {
        dispatch(fetchMoreStocks(gainers, losers, activelyTraded))
    }

    useEffect(() => {
        dispatch(fetchStockList())
        // 

    }, [dispatch])

     useEffect(() => {
         handleCustomGridCols(tab)
    }, [tab])

    const handleFirstFetchPositions = () => {
        if(positionOneFetch <= 0){
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
         setPositionOneFetch(prev => prev+1);
          StorageUtils._save(CommonConstants.fetchPositions, false)
        // FETCH the ORDER BOOK DATA ALSO ONCE 
          dispatch(orderBookData(''));
        


        }
    }
    const handleCustomGridCols = (seletab:any) => { 
        let cls= `grid w-11/12 gap-4 mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-5 justify-between`;
        let  trdCls = `grid w-11/12 gap-4 mx-auto grid-cols-1 justify-between`;
        let clsUse = cls;
         if((seletab === "Top Gainers") || (seletab === "Top Losers") )
         {  clsUse = cls;

         } else if ((seletab === "Top Traders")) {   
            clsUse = trdCls;
         }
         else if((seletab === "Positions")){
              clsUse = trdCls;
            handleFirstFetchPositions();
         }
        return clsUse
    }

    if (!gainers || !losers) {
        return null;
    }
    return (
        <div> {/* sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-5  */}
            {/*<StockCard key={item.symbol} stock={item}/>*/}
            <div
                className={handleCustomGridCols(tab)}>
                {
                    tab === "Top Gainers" ? gainers.map((item: any) => {
                        return <StockCard key={item.symbol} stock={item}/>
                    }) : tab === "Top Losers" ? losers.map((item: any) => {
                        return <StockCard key={item.symbol} stock={item}/>  
                    }) :  tab === "Top Traders" ?   (  
                          <TradeGrid tradeDataB={tradeData} /> 
                     ) :  tab === "Positions" ?   (  
                          <PositionGrid positionDataB={positionData} /> 

                     ):    <>    </> 
                }


            </div>
            {
                loader ? <ScreenLoader/> : <h1 id="loadMore" onClick={() => fetchMoreData()}
                                               className=' text-black font-regular text-xl transition-all py-10 cursor-pointer p-2  dark:text-white flex items-center justify-center hover:mt-2'>Load
                    more <ArrowDown2 className='ml-2'/></h1>
            }

        </div>
    )
}

export default StockGrid
