import React from 'react';
import {AppDispatch, store} from '@/redux/store';
import {Provider, useDispatch} from 'react-redux';


export const ReduxProvider = ({children}: { children: React.ReactNode }) => {
    return (
        <Provider store={store}>{children}</Provider>
    )
}
export const useAppDispatch: () => AppDispatch = useDispatch;
