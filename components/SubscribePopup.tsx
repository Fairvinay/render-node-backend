// components/SubscribePopup.tsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HIDE_SUBSCRIPTION_POPUP } from '@/redux/slices/miscSlice'

export const SubscribePopup = () => {
  const dispatch = useDispatch()
  const show = useSelector((state: any) => state.misc.showSubscribePopup)

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md text-center">
        <h2 className="text-xl font-bold mb-2">API Limit Reached</h2>
        <p className="mb-4">Please subscribe to access more stock data and remove limits.</p>
        <button onClick={() => dispatch(HIDE_SUBSCRIPTION_POPUP())}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};
