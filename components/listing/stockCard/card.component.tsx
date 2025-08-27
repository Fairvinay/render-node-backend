import React from 'react'
import Logo from '../../common/stockLogo/logo.component'
import Link from 'next/link'
import {useDispatch} from 'react-redux'
import {saveSelectedCard} from '@/redux/slices/stockSlice'
import {DocumentDownload} from 'iconsax-react'

const StockCard = ({stock}: { stock: any }) => {
    const dispatch = useDispatch()
    const {ticker, volume, price, change_amount, change_percentage} = stock

    function triggerDownload() {
    let ALPHA_URL =`https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&symbol=${ticker}&horizon=3month&apikey=demo`

        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = `/download?next_url=${encodeURIComponent(ALPHA_URL)}`;
        document.body.appendChild(iframe);
        setTimeout(() => document.body.removeChild(iframe), 10000);
   }
   async function handleDownload() {
         const response = await fetch(`/download?next_url=https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&symbol=${ticker}&horizon=3month&apikey=demo`);
         const blob = await response.blob();
         const url = window.URL.createObjectURL(blob);



        const link = document.createElement('a');
    // href={`/download?next_url=https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&symbol=${ticker}&horizon=3month&apikey=demo`}
                        
       //link.href = `/download?next_url=https://www.alphavantage.co/query?function=EARNINGS_CALENDAR&symbol=${ticker}&horizon=3month&apikey=demo`
        link.href =  url;
        //link.setAttribute('download', 'NSE_CM.csv');  Optional: suggest filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
     // `/company/${'IBM'}`
     //  
    return (
      
      
            <div className='rounded-xl mx-auto transition-all  p-4 border-2 border-greylight  my-3'
                 style={{maxWidth: 300}}> {/* cursor-pointer */}
                <div className='flex items-start justify-between'>

                   {typeof ticker === 'string' && ticker.trim() !== '' && <Logo name={ticker} />}
                    <p className='text-right font-semibold text-black dark:text-white'>{volume}+ available </p>
                </div>
                 <div className="flex justify-between items-center">
                  <h1 className='text-black dark:text-white text-lg font-semibold mt-2'>{ticker}</h1>
                  <div className="ml-auto"><h1 className='text-black  text-white text-lg font-semibold mt-2'>
                    <span className='bg-brandblue p-1 px-2 rounded-lg'>
                        {/*  <Link href={`company${ ticker}`} onClick={() => { */}
                                    <a  href={`/company/${ ticker}`} onClick={() => {
                            dispatch(saveSelectedCard({...stock, ticker:ticker}))
                        }}></a>   Chart
                           {/* </Link> */}
                         
                    </span>
                    
                    </h1>
                     </div> 
                 </div>
                <h1 className='text-black dark:text-white text-md font-semibold '>
                    ${price}
                    {change_amount.includes('-')
                        ? <span className='text-sm ml-2 text-red'>{change_amount}▼</span>
                        : <span className='text-sm ml-2 text-green'>+{change_amount}▲</span>
                    }
                </h1>
                
                {/*  <Link    style={{fontSize: 9, width: 'fit-content'}}*/}
              <a
                     href="#" rel="noopener noreferrer"
                    title=' Company earnings expected in the next 3 months'
                    className='text-xs text-white w-1/2 flex items-center justify-end ml-auto bg-brandblue p-1 px-2 rounded-lg'>
                   <button onClick={triggerDownload}>   Download Report
                    <DocumentDownload className='ml-2' size={12}/></button>
                   </a> {/* </Link>  */}
               
            </div>
          
      
    )
}

export default StockCard
