import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {TickerSliceProps, tickerSlice }  from '@/redux/slices/tickerSlice';
export interface TickerSensexSliceProps extends TickerSliceProps{
    
   
}
const initialState: TickerSensexSliceProps = {
    symbol: null,
    name: null,
    time:null,
    price:null,
     searchTickers: null,
     tickerBook: undefined,
}



const tickerSensexSlice = createSlice({
    name: "sensexticker",
    initialState,
    reducers: {
        saveSensexSymbol: (state, action) => {
            state.symbol=action.payload
        },
        saveSensexName: (state, action) => {
            state.name=action.payload
        },
         saveStockSensexTickers: (state, action) => {
            state.searchTickers=action.payload
        },
          saveSensexTickerBook: (state, action: PayloadAction<  any []   >) => {
                    // SAVE the data be it from CACHE or server 
                    // SAVE it in localStorage
                     console.log(" saveSensexTickerBook ")
                         console.log(" action.payload "+JSON.stringify(action.payload))
                  state.tickerBook = action.payload;
         },
    },
})

export const { saveSensexSymbol, saveSensexName ,saveStockSensexTickers: saveStockSensexTickers ,saveSensexTickerBook    } = tickerSensexSlice.actions;

export default tickerSensexSlice.reducer;