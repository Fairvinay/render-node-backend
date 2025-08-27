import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {TickerSliceProps }  from '@/redux/slices/tickerSlice';
export interface TickerNiftySliceProps extends TickerSliceProps{
    
   
}
const initialState: TickerNiftySliceProps = {
    symbol: null,
    name: null,
    time:null,
    price:null,
     searchTickers: null,
     tickerBook: undefined,
}



const tickerNiftySlice = createSlice({
    name: "niftyticker",
    initialState,
    reducers: {
        saveSymbol: (state, action) => {
            state.symbol=action.payload
        },
        saveName: (state, action) => {
            state.name=action.payload
        },
         saveStockTickers: (state, action) => {
            state.searchTickers=action.payload
        },
          saveTickerBook: (state, action: PayloadAction<  any []   >) => {
                  state.tickerBook = action.payload;
         },
    },
})

export const { saveSymbol, saveName ,saveStockTickers: saveStockTickers ,saveTickerBook    } = tickerNiftySlice.actions;

export default tickerNiftySlice.reducer;