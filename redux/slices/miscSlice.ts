import { createSlice } from "@reduxjs/toolkit";

export interface MiscSliceProps {
    loader: boolean,
    isDarkMode: boolean,
    tab: string,
    recentSearches: any,
     showSubscribePopup:boolean
    platformType: string
}
const initialState:MiscSliceProps = {
    loader: false,
    isDarkMode: false,
    tab: "Top Gainers",
    recentSearches: [],
    showSubscribePopup: false,
    platformType: "alpha-vantage"
}


const miscSlice = createSlice({
    name: "misc",
    initialState: initialState,
    reducers: {
        toggleMode: (state) => {
            state.isDarkMode=!state.isDarkMode
        },
        changeTab: (state, action) => {
            state.tab=action.payload
        },
        changePlatformType: (state, action) => {
           if(action.payload !==undefined && action.payload !== null && action.payload !== '') {
            if(action.payload  === 'fyers'){
                state.platformType='fyers'
            }
            else{
                state.platformType='alpha-vantage'
            }
           }
           //  state.platformType=action.payload

        },
        enableLoader: (state ) => {
            state.loader=true
        },
        disableLoader: (state ) => {
            state.loader=false
        },
        saveRecentSearches: (state, action) => {
            state.recentSearches=action.payload
        },
          
    SHOW_SUBSCRIPTION_POPUP: (state) => {
      state.showSubscribePopup = true;
    },
    HIDE_SUBSCRIPTION_POPUP: (state) => {
      state.showSubscribePopup = false;
    }
    
    }
})

export const { toggleMode, saveRecentSearches, enableLoader, disableLoader, changeTab, SHOW_SUBSCRIPTION_POPUP, HIDE_SUBSCRIPTION_POPUP } = miscSlice.actions;

export default miscSlice.reducer;