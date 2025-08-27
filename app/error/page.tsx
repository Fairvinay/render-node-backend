import React from 'react'
import Image from 'next/image'
import ErrorImage from '@/public/error.gif'
const Error = () => {
    console.log("This is server side rendered")
    return (
        <div className='flex items-center justify-center h-screen w-screen'>
            <div className='text-center'>

                <Image
                    src={ErrorImage}
                    width={150}
                    className='mx-auto'
                    height={150}
                    alt="error"
                    loading='lazy'
                />
                <p className='text-md font-semibold'>We {`couldn't`} process your request!</p>
                <p className='text-sm mb-4'>Please try again later</p>
                <a href='/' className='p-2 text-sm rounded-lg bg-brandgreen text-white px-3'>
                    Go Back!
                </a>
            </div>
        </div>
    )
}

export default Error