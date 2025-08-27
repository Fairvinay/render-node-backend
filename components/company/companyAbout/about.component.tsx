import React from 'react'

export interface CompanyAboutProps {
  Name: string;
  Description: string;
}
const CompanyAbout = ({ Name, Description }: CompanyAboutProps) => {
  return (
    <div className='w-10/12 bg-greylight dark:bg-greydark p-3 rounded-xl mx-auto my-5'>
      <h1 className='text-black font-semibold mb-2 dark:text-white text-lg'>About {Name} </h1>
      <p className='text-black text-sm leading-loose dark:text-white'>{Description}</p>
    </div>
  )
}

export default CompanyAbout