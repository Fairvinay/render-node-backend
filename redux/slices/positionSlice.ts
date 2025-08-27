import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PositionSliceProps {
    symbol:any,
    name:any,
    s? : any,
   code? :  any,
   message? : any,
     searchResults: any,
   positionBook:  any[]  | undefined,
   
}
const initialState: PositionSliceProps = {
    symbol: null,
    name: null,
     searchResults: null,
     positionBook: undefined,
}



const positionSlice = createSlice({
    name: "position",
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
          savePositionBook: (state, action: PayloadAction<  any []   >) => {
                  state.positionBook = action.payload;
         },
    },
})

export const { saveSymbol, saveName ,saveStockResults ,savePositionBook    } = positionSlice.actions;

export default positionSlice.reducer;