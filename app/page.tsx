"use client";
import Header from '@/components/common/pageHeader/header.component';
import { ScreenLoader } from '@/components/loader/screenLoader/loader.component';
import Menu from '@/components/listing/stockControls/menu.component';
import { GlobalState } from '@/redux/store';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import { SubscribePopup } from '@/components/SubscribePopup'

const DynamicGrid = dynamic(() => import('../components/listing/stockGrid/grid.component'), {
  loading: () => <p>Loading...</p>,
})


export default function Home() {
  const isDarkMode = useSelector((state: GlobalState) => state.misc.isDarkMode)

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className='bg-white dark:bg-black '>
        <ScreenLoader />
        <Header />
        <Menu />
        <DynamicGrid />
           <SubscribePopup />
      </div>
    </div>
  )
}
