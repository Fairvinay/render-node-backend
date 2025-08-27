import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderBookSliceProps {
    symbol:any,
    name:any,
    s? : any,
   code? :  any,
   message? : any,
     searchResults: any,
   orderBook:  any[]  | undefined,
   
}
const initialState: OrderBookSliceProps = {
    symbol: null,
    name: null,
     searchResults: null,
     orderBook: undefined,
}



const orderBookSlice = createSlice({
    name: "orderbook",
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
          saveCancelOrderBook: (state, action: PayloadAction<  any []   >) => {
                  state.orderBook = action.payload;
         },
          saveOrderBook: (state, action: PayloadAction<  any []   >) => {
                  state.orderBook = action.payload;
         },
    },
})

export const { saveSymbol, saveName ,saveStockResults ,saveCancelOrderBook , saveOrderBook   } = orderBookSlice.actions;

export default orderBookSlice.reducer;