import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface HoldingSliceProps {
    symbol:any,
    name:any,
    s? : any,
   code? :  any,
   message? : any,
     searchResults: any,
   holdingBook:  any[]  | undefined,
   
}
const initialState: HoldingSliceProps = {
    symbol: null,
    name: null,
     searchResults: null,
     holdingBook: undefined,
}



const holdingSlice = createSlice({
    name: "holding",
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
          saveHoldingBook: (state, action: PayloadAction<  any []   >) => {
                  state.holdingBook = action.payload;
         },
    },
})

export const { saveSymbol, saveName ,saveStockResults ,saveHoldingBook    } = holdingSlice.actions;

export default holdingSlice.reducer;