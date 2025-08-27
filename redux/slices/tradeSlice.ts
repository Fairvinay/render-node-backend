import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TradeSliceProps {
    symbol:any,
    name:any,
    s? : any,
   code? :  any,
   message? : any,
     searchResults: any,
   tradeBook:  any[]  | undefined,
   
}
const initialState: TradeSliceProps = {
    symbol: null,
    name: null,
     searchResults: null,
     tradeBook: undefined,
}



const tradeSlice = createSlice({
    name: "trade",
    initialState,
    reducers: {
        saveSymbol: (state, action) => {
            state.symbol=action.payload
        },
        saveName: (state, action) => {
            state.name=action.payload
        },
         saveStockResults: (state, action) => {
            state.searchResults=action.payload
        },
          saveTradeBook: (state, action: PayloadAction<  any []   >) => {
                  state.tradeBook = action.payload;
         },
    },
})

export const { saveSymbol, saveName ,saveStockResults ,saveTradeBook    } = tradeSlice.actions;

export default tradeSlice.reducer;