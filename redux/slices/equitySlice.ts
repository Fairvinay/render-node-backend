import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface EquitySliceProps {
    symbol:any,
    name:any,
     searchResults: any,
    equities: { bestMatches: any[] } | undefined;  // ✅ new
}
const initialState:EquitySliceProps = {
    symbol: null,
    name: null,
     searchResults: null,
     equities: undefined,
}



const equitySlice = createSlice({
    name: "equity",
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
          saveEquities: (state, action: PayloadAction<{bestMatches: any [] } >) => {
                  state.equities = action.payload;
         },
    },
})

export const { saveSymbol, saveName ,saveStockResults ,saveEquities    } = equitySlice.actions;

export default equitySlice.reducer;