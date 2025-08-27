import { Metadata } from 'next'
import React from 'react'

const Logo = ({ name }: { name: string }) => {
    return (
        <div className='bg-brandblue rounded-full flex justify-center items-center' style={{ width: 50, height: 50 }}>
            <p className='font-semibold text-xl text-white'>{name.substring(0, 2).toUpperCase()}</p>
        </div>
    )
}

export default Logo