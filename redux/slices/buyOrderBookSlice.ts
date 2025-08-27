import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BuyOrderBookSliceProps {
    symbol:any,
    name:any,
    s? : any,
   code? :  any,
   message? : any,
     searchResults: any,
     price: any,
     qty: any,

   buyOrderBook:  any[]  | undefined,
   
}
const initialState: BuyOrderBookSliceProps = {
    symbol: null,
    name: null,
     searchResults: null,
      price: null,
     qty: null,
     buyOrderBook: undefined,
}



const buyOrderBookSlice = createSlice({
    name: "buyorderbook",
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
          saveBuyOrderBook: (state, action: PayloadAction<  any []   >) => {
                  state.buyOrderBook= action.payload;
         },
    },
})

export const { saveSymbol, saveName ,saveStockResults ,saveBuyOrderBook    } = buyOrderBookSlice.actions;

export default buyOrderBookSlice.reducer;