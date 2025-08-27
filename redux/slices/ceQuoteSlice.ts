import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CEQuoteSliceProps {
    symbol:any,
    name:any,
    s? : any,
   code? :  any,
   message? : any,
     searchResults: any,
   quoteBook:  any[]  | undefined,
   
}
const initialState: CEQuoteSliceProps = {
    symbol: null,
    name: null,
     searchResults: null,
     quoteBook: undefined,
}



const quoteSlice = createSlice({
    name: "quote",
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
          saveQuoteBook: (state, action: PayloadAction<  any []   >) => {
                  state.quoteBook = action.payload;
         },
    },
})

export const { saveSymbol, saveName ,saveStockResults ,saveQuoteBook    } = quoteSlice.actions;

export default quoteSlice.reducer;