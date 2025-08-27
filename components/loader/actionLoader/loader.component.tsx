import Image from 'next/image'
import React from 'react'

export const ActionLoader = () => {
    return (
        <div className=''>
            <Image src={require('@/public/loader.gif')} alt="logo" className='mx-auto' width={20} height={20} />
        </div>
    )
}
