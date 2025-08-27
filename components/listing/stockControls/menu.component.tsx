"use client";
import React, {useState} from 'react'
import Chip from '../../common/textChip/chip.component'
import {useDispatch, useSelector} from 'react-redux';
import {changeTab} from '@/redux/slices/miscSlice';
import {disableLoader, enableLoader} from "@/redux/slices/miscSlice"
import {API, FYERSAPI, FYERSAPILOGINURL} from "@/libs/client"
import {GlobalState} from '@/redux/store';
import {saveActivelyTraded, saveGainers, saveLosers} from '@/redux/slices/stockSlice';
import { platform } from 'os';
import { StorageUtils } from '@/libs/cache';
import { CommonConstants } from '@/utils/constants';
import { AnyNode } from 'postcss';

const arr = [
    {key: 1, title: "Top Gainers"},
    {key: 2, title: "Top Losers"},
    {key: 3, title: "Top Traders"},
    {key: 4, title: "Positions"},
]
const sortMapper = [
    {key: 1, title: "Sort by percentage"},
    {key: 2, title: "Sort by price"},
]

const platformMapper = [
    {key: 1, title: "Alpha-Vantage"},
    {key: 2, title: "Fyers"},
]
const Menu = () => {
    const [sortType, setSortType] = useState('1')
    let globalUserCheck  :any = undefined;
    const [platformType, setPlatformType] = useState('1')
    const tab = useSelector((state: GlobalState) => state.misc.tab)
    const gainers = useSelector((state: GlobalState) => state.stock.gainers)
    const losers = useSelector((state: GlobalState) => state.stock.losers)
    const activelyTraded = useSelector((state: GlobalState) => state.stock.activelyTraded)
    const currentPlatform = useSelector((state: GlobalState) => state.misc.platformType)
    //const currentPlatform = useSelector((state: GlobalState) => state.misc.platformType)
    const dispatch = useDispatch();

    const popupCenter = (url:any, title:any) => {
        const dualScreenLeft = window.screenLeft ?? window.screenX;
        const dualScreenTop = window.screenTop ?? window.screenY;
    
        const width =
          window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;
    
        const height =
          window.innerHeight ??
          document.documentElement.clientHeight ??
          screen.height;
    
        const systemZoom = width / window.screen.availWidth;
    
        const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
        const top = (height - 550) / 2 / systemZoom + dualScreenTop;
    
        const newWindow = window.open(
          url,
          title,
          `width=${500 / systemZoom},height=${550 / systemZoom
          },top=${top},left=${left}`
        );
        newWindow?.window.addEventListener('load', () => {
            newWindow?.window.addEventListener('unload', () => {
                console.log("unload the popup ")
               // ftech the globallogin boject 
               let globaProm =    ( async () => { 
                 let login = await FYERSAPI.get('/fyersgloballogin'); 
                 console.log("fyers login called ");
                 return login;
                }) 
                const res = Promise.all([ globaProm()]);
                res.then((values) => {
                    StorageUtils._save(CommonConstants.fyersToken,values)
                     console.log("fyers login token saved ")
                })
               
                // window.location.reload();
            });
        });
        
        newWindow?.focus();
      };
    const sortByPercentage = () => {
        if (tab === "Top Gainers") {
            const sortedData = [...gainers].sort((a: any, b: any) => {

                return parseFloat(b.change_percentage) - parseFloat(a.change_percentage)
            })
            dispatch(saveGainers(sortedData))
        } else if (tab === 'Top Losers') {
            const sortedData = [...losers].sort((a: any, b: any) => {
                return parseFloat(b.change_percentage) - parseFloat(a.change_percentage)
            })
            dispatch(saveLosers(sortedData))
        } else {
            const sortedData = [...activelyTraded].sort((a: any, b: any) => {
                return parseFloat(b.change_percentage) - parseFloat(a.change_percentage)
            })
            dispatch(saveActivelyTraded(sortedData))
        }
    }
    const sortByPrice = () => {
        if (tab === "Top Gainers") {
            const sortedData = [...gainers].sort((a: any, b: any) => {
                return parseFloat(b.change_amount) - parseFloat(a.change_amount)
            })
            dispatch(saveGainers(sortedData))
        } else if (tab === 'Top Losers') {
            const sortedData = [...losers].sort((a: any, b: any) => {
                return parseFloat(b.change_amount) - parseFloat(a.change_amount)
            })
            dispatch(saveLosers(sortedData))
        } else {
            const sortedData = [...activelyTraded].sort((a: any, b: any) => {
                return parseFloat(b.change_amount) - parseFloat(a.change_amount)
            })
            dispatch(saveActivelyTraded(sortedData))
        }
    }
    const checkUserLogged = () => { 
                 // IFF Logged in cehck
        let logd = false;
         const res1 = StorageUtils._retrieve(CommonConstants.fyersToken);
        if (res1.isValid && res1.data !== null && res1.data !==undefined) {
            
            let auth_code = res1.data['auth_code'];
            if (auth_code&& auth_code !== null && auth_code !== undefined) {
                console.log("User is Authorized ");
                logd = true;
            }

        }
        return logd;
    }
    const logByPlatform = () => {
        // check platform type is alpha-vantage or fyers
        // currentPlatform
        if (currentPlatform !==  "fyers") {
            const apiKey = StorageUtils._retrieve(CommonConstants.platFormKey)
            if (apiKey.isValid && apiKey.data !== null) {
                
            }
            else {
                console.log("Fyers not logged in ");    
                try {
                    dispatch(enableLoader());

                   let fyerLoginProm =  ( async () => {
                        //{params: {function: 'TOP_GAINERS_LOSERS' , apikey:CommonConstants.apiKey}}
                        let res :any = undefined;
                     if (!checkUserLogged()) { 
                      //let res =  await FYERSAPI.get('/fyerscallback' )
                        res =   popupCenter(FYERSAPILOGINURL, "Fyers Signin")
                      }
                      else {
                        res = true;
                         StorageUtils._save(CommonConstants.globalUserCheck, 'false')
                      }
                        return res;
                    }) ;
                    const result = Promise.all([    fyerLoginProm()]);
                     // run a interval to check the fyersToken 
                    globalUserCheck  =  setInterval( async() => {

                        
                        let result =   await FYERSAPI.get('/fyersgloballogin' )
                        console.log("fyers login called ");
                        let data =    result.data.value;
                        StorageUtils._save(CommonConstants.fyersToken,data)
                        const res = StorageUtils._retrieve(CommonConstants.fyersToken);
                        if (res.isValid && res.data !== null && res.data !== undefined) {
                           
                            let auth_code = res.data['auth_code'];
                            if (auth_code&& auth_code !== null && auth_code !== undefined) {
                                console.log("User is Authorized ");
                               clearInterval(globalUserCheck);
                            }
                            else{
                                console.log("User is awaiting authorization ");
                            }
                        }
                     },5000);
                     // NOTE the globalUserCheck in the Storage and regularly clear it when user authenticated 
                        StorageUtils._save(CommonConstants.globalUserCheck, globalUserCheck)
           
                   // const res = StorageUtils._retrieve(CommonConstants.fyersToken );
                    
                } catch (error) {
                    // @ts-ignore
                    const {message} = error
                    //toast.error(message ? message : "Something went wrong!")
                    console.log(error)
                    return error
                } finally {
                    dispatch(disableLoader())
                }

                //dispatch(loginFyers([]));
               
            }
           // const sortedData = [...gainers].sort((a: any, b: any) => {
           //     return parseFloat(b.change_amount) - parseFloat(a.change_amount)
           // })
           // dispatch(saveGainers(sortedData))
        } 

    }


    return (
        <div className='flex flex-wrap gap-2 bg-white dark:bg-black items-center justify-between w-11/12 mx-auto my-3'>
            <select value={tab} onChange={(e) => {
                
                dispatch(changeTab(e.target.value))
               
            }}
                    className='p-2 focus-visible:outline-none block md:hidden rounded-lg bg-greylight dark:bg-greydark text-gretdark dark:text-white '>
                <option>Top Gainers</option>
                <option>Top Losers</option>
                <option>Top Trades</option>
                 <option>Positions</option>
            </select>


            <div className='hidden md:flex relative flex-wrap items-center justify-between'>
                {
                    arr.map(item => {
                        return <button key={item.key} onClick={() => {
                            dispatch(changeTab(item.title))
                        }} className={` mx-3 hover:scale-105 transition-all cursor-pointer toggle-tab`}>
                            <h1 className='text-md text-black dark:text-white font-semibold'>{item.title}</h1>
                        </button>
                    })
                }
                <div
                    className={`hidden md:block toggle-line ${tab === "Top Losers" ? 'move-line' : tab === 'Most Actively Traded' ? 'move-2next' : ''}`}></div>
            </div>
            <div className='hidden md:flex flex-wrap items-center justify-between'>
                {
                    sortMapper.map(item => {
                        return <Chip key={item.key} isSelected={sortType === String(item.key)} text={item.title}
                                     onClick={() => {
                                         if (item.key === 1) {
                                             sortByPercentage()
                                         } else {
                                             sortByPrice()
                                         }
                                         setSortType(String(item.key))
                                     }}/>
                    })
                }
            </div>
            <select value={sortType} onChange={(e) => {
                if (e.target.value == '1') {
                    sortByPercentage()
                } else {
                    sortByPrice()
                }
                setSortType(e.target.value)
            }}  
                    className='p-2 focus-visible:outline-none block md:hidden rounded-lg bg-greylight dark:bg-greydark text-gretdark  dark:active:text-green-700  '> {/* dark:text-white */}
                <option value={1}>Sort by Percentage</option>
                <option value={2}>Sort by Price</option>
            </select>
        

            <div className="hidden md:flex relative items-center">
                 {/* 
                  <select className="p-2 rounded-lg bg-greylight dark:bg-greydark text-gretdark dark:text-white focus-visible:outline-none">
                  md:hidden
                 Alpha-Advantange or Fyers selection */}
                <select value={platformType} onChange={(e) => {
                                    if (e.target.value == '1') {
                                        console.log(" selected " + e.target.value)
                                    } else {
                                        logByPlatform()
                                        console.log(" selected " + e.target.value)
                                    }
                                    setPlatformType(e.target.value)
                  }}  
                    className='p-2 focus-visible:outline-none block  rounded-lg bg-greylight dark:bg-greydark text-gretdark  dark:active:text-green-700  '> {/* dark:text-white */}
                <option value={1}>Alph-Vantage</option>
                <option value={2}>Fyers</option>
               </select>
             </div>


        </div>
    )
}

export default Menu
