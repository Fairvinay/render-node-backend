import React from 'react'

const Info = ({ title, value }: { title: string, value: string }) => {
  return (
    <div className='rounded-lg border-2 p-3 w-100 border-greylight mr-1 ' style={{ minWidth: 180 }}>
      <p className='text-black font-semibold dark:text-white text-sm'>{title}</p>
      <p className='text-black dark:text-white text-md'>{value}</p>
    </div>
  )
}

export default Info