import { GlobalState } from '@/redux/store'
import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux'

export const ScreenLoader = () => {
    const loader = useSelector((state: GlobalState) => state.misc.loader)

    return (
        <div className={`${!loader?'hidden':''} loader-overlay bg-white dark:bg-black flex items-center justify-center`}>
            <Image src={require('@/public/loader.gif')} alt="logo" className='rounded-lg' width={40} height={40} />
        </div>
    )
}
