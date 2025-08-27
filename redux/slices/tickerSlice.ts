import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TickerSliceProps {
    symbol:any,
    name:any,
    s? : any,
   code? :  any,
   message? : any,
   time:any,
   price:any,
     searchTickers: any,
   tickerBook:  any[]  | undefined,
   
}
const initialState: TickerSliceProps = {
    symbol: null,
    name: null,
    time:null,
    price:null,
     searchTickers: null,
     tickerBook: undefined,
}



export const tickerSlice = createSlice({
    name: "ticker",
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

export const { saveSymbol, saveName ,saveStockTickers: saveStockTickers ,saveTickerBook    } = tickerSlice.actions;
 // tickerSlice ;
export default tickerSlice.reducer;