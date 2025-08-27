"use client";
import React, { useState } from 'react'

export interface TickerChipProps {
  text: any;
  onClick?: () => void;
  isSelected: boolean;
}
const TickerChip = ({ text, onClick, isSelected }: TickerChipProps) => {

  const [ time , setTime] = useState((text:any ) =>  text.time);
  const [ price ,setPrice] = useState ((text:any ) =>  text.price);



  return (
    <button onClick={onClick} className={`${isSelected ? 'bg-brandgreen' : 'bg-brandgreenlight'} p-1 px-3  transition-all rounded-full mx-2 dark:bg-white`}>
      <p className={`${isSelected ? 'text-white' : 'text-brandgreen'} text-xs font-semibold  `}>{time}</p> :: 
       <p className={`${isSelected ? 'text-white' : 'text-brandgreen'} text-xs font-semibold  `}>{price}</p>
    </button>
  )
}

export default TickerChip

/* usage 
  <TickerChip isSelected={false} text={tickerData}/>
*/