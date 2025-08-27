import React, { useEffect } from 'react'
import Logo from '../../common/stockLogo/logo.component'
import { StorageUtils } from '@/libs/cache';
import { CommonConstants } from '@/utils/constants';

export interface CompanyHeaderProps {
    Symbol: string,
    Name: string,
    AssetType: string,
    Exchange: string,
    change_amount: any,
    change_percentage: any,
    price: any

}

const CompanyHeader = (props: CompanyHeaderProps) => {
    const {change_amount, price, change_percentage, Symbol, Name, Exchange, AssetType} = props;
    let dolarRup = "$";
    useEffect( () => {
        // check if Fyer Login and company Data available 
        let tokenauth = StorageUtils._retrieve(CommonConstants.fyersToken);
        let auth_code ='';
        if (tokenauth.isValid && tokenauth.data !== null) {
            dolarRup = "₹";
            console.log("Fyers user logged ");
        }

    },[])
    return (
        <div
            className='bg-white  dark:bg-black p-5 md:p-3 flex flex-col md:flex-row justify-between items-center w-full md:w-10/12 mx-auto'>
            <div
                className='flex flex-col w-full md:w-auto md:mr-auto  mx-auto md:mx-0  gap-3 md:flex-row justify-between items-center'>

                <div className='w-full md:w-auto'>
                    <Logo name={Symbol}/>
                </div>
                <div className='w-full md:w-auto'>
                    <h1 className='text-black dark:text-white text-lg font-semibold'>{Name}</h1>
                    <h1 className='text-black dark:text-white text-md font-semibold'>{Symbol}, {AssetType}</h1>
                    <h1 className='text-black dark:text-white text-sm font-semibold'>{Exchange}</h1>
                </div>
            </div>
            <div
                className='flex flex-wrap mt-3 w-full mx-auto md:mx-0 md:w-auto md:mt-0 md:block items-center justify-between'>
                <h1 className=' text-black dark:text-white text-xl font-semibold text-right'>{ dolarRup} {price}</h1>
                {
                    change_amount.includes('-')
                        ? <span className='text-sm  text-red'>{change_amount} ({change_percentage}) ▼</span>
                        : <span className='text-sm  text-green'>+{change_amount} ({change_percentage})▲</span>
                }
            </div>
        </div>
    )
}

export default CompanyHeader
