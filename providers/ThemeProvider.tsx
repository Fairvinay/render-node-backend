import React from 'react';
import {GlobalState} from '@/redux/store';
import {useSelector} from 'react-redux';


export const ThemeProvider = ({children}: { children: React.ReactNode }) => {
    const isDarkMode = useSelector((state: GlobalState) => state.misc.isDarkMode)
    return (
        <div className={isDarkMode ? `dark` : ''}>{children}</div>
    )
}
