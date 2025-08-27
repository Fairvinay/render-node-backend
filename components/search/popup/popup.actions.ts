import {API, FYERSAPI} from "@/libs/client"
import {saveRecentSearches} from "@/redux/slices/miscSlice"
import {saveResults} from "@/redux/slices/stockSlice"
import {StorageUtils} from "@/libs/cache";
import {CommonConstants} from "@/utils/constants";
import {NEXT_PUBLIC_API_KEY } from '../../../config'
import React, { useState, useEffect } from 'react';
import { saveStockResults } from "@/redux/slices/equitySlice";
const CSV_URL = 'https://drive.google.com/uc?export=download&id=1UjjQcDHiRIPxbzZOTZaWrLQjKtVzZjp_';


export const fetchSearchResults = (_query: string, equities:any,  setTypes: Function, setLoading: Function, _recentSearches: any) => {
 
  /*  const [fyersQuery, setFyersQuery] = useState(_query ?? '');
  const [matches, setMatches] = useState<{ symbol: string; name: string }[]>([]);
  const [csvData, setCsvData] = useState<{ symbol: string; name: string }[]>([]);
   
    // Fetch CSV once
  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const res = await fetch(CSV_URL);
        const text = await res.text();
        const lines = text.split('\n').filter(Boolean);
        const parsed = lines.map(line => {
          const [symbol, name, ...rest] = line.split(','); // modify based on CSV structure
          return { symbol, name };
        });
        setCsvData(parsed);
      } catch (err) {
        console.error("CSV fetch error:", err);
      }
    };

    fetchCSV();
  }, []);
 
    // Filter when query changes
  useEffect(() => {
    if (fyersQuery.length < 3) {
      setMatches([]);
      return;
    }

    const prefix = fyersQuery.toLowerCase().slice(0, 3);

    const filtered = csvData.filter(
      item => item.name?.toLowerCase().startsWith(prefix)
    ).slice(0, 5);

    setMatches(filtered);
  }, [fyersQuery, csvData]);
 */

    return async (dispatch: Function) => {
        try {
            setLoading(true)
            let tokenauth = StorageUtils._retrieve(CommonConstants.fyersToken);
             let auth_code ='';
             if (tokenauth.isValid && tokenauth.data !== null) {
                       console.log("User is Authorized ");
                      auth_code = tokenauth.data['auth_code'];
                console.log("equities "+JSON.stringify(equities));
                 console.log("_query "+JSON.stringify(_query));
                 let nsesym = `NSE:${_query.toUpperCase()}`;
                  console.log(" searching in euities for  "+JSON.stringify(nsesym));
                  if(equities !==undefined && equities.bestMatches !== null && equities.bestMatches !== undefined){
                const uniqueTypes: Array<string> = Array.from(new Set(equities.bestMatches.map((item: any) =>  item['3. type']
                 )));
                const uniqueSearches: Array<string> = Array.from(new Set(equities.bestMatches.map((item: any) => {
                   if (item['2. name'].indexOf(_query.toUpperCase()) > -1 ) {
                     console.log(" item['2. name'] "+JSON.stringify(item['2. name'])+ "_query "+JSON.stringify(_query.toUpperCase()));
                      return item;
                   }  
                    } 
                 )));
                const uniqueTypesArr = ['All', ...uniqueTypes]
                 console.log(" fyers uniqueTypesArr "+JSON.stringify(uniqueTypesArr));
                 
                let  uniqS = uniqueSearches.filter(
                     (s) => s && typeof s === 'object' && Object.values(s).every(v => v != null)
                  );
                  console.log(" uniqueSearches "+JSON.stringify(uniqS));
              // not needed as equities already in the global state.
                 //dispatch(saveStockResults(uniqueSearches))
                  dispatch(saveResults(uniqS))
                //dispatch(saveRecentSearches(uniqS))
                 setTypes([...uniqueTypesArr])
                if (_recentSearches) {
                  //  console.log("_recentSearches "+JSON.stringify(_recentSearches))
                    if (_recentSearches.includes(_query)) {   return  }  
                    dispatch(saveRecentSearches([..._recentSearches, _query]));
                    StorageUtils._save(CommonConstants.recentSearchesKey, [..._recentSearches, _query])
                } else {
                    if( uniqueSearches !== null && uniqueSearches !=undefined) {
                       //console.log("set recentSearches == uniqueSearches "+JSON.stringify(uniqS));
                         dispatch(saveRecentSearches([_query]));
                    }
                    else  if( uniqueTypes !== null && uniqueTypes !=undefined) {
                     // console.log(" fyers set recentSearches ==  uniqueTypesArr "+JSON.stringify(uniqueTypesArr));
                         dispatch(saveRecentSearches([_query]));
                    }
                    else {
                    
                      
                    }
                   
                }       
                 }

             }
             else {  // use the regular alph-vantage process 
               const res = await API.get('/', {params: {function: 'SYMBOL_SEARCH', keywords: _query, apikey: NEXT_PUBLIC_API_KEY }})
              const uniqueTypes: Array<string> = Array.from(new Set(res.data.bestMatches.map((item: any) => item['3. type'])))
               const uniqueTypesArr = ['All', ...uniqueTypes]
              console.log("alpha-vantage uniqueTypesArr "+JSON.stringify(uniqueTypesArr));
               console.log("alpha-vantage bestMatches "+JSON.stringify(res.data.bestMatches));
              dispatch(saveResults(res.data.bestMatches))
              setTypes([...uniqueTypesArr])
              if (_recentSearches) {
                  if (_recentSearches.includes(_query)) return
                  dispatch(saveRecentSearches([..._recentSearches, _query]));
                  StorageUtils._save(CommonConstants.recentSearchesKey, [..._recentSearches, _query])
              } else {
                  dispatch(saveRecentSearches([_query]));
              } 


             }





        } catch (error) {
              console.log("second try alpha-vantage error  " +JSON.stringify(error));
             const res = await API.get('/', {params: {function: 'SYMBOL_SEARCH', keywords: _query, apikey: NEXT_PUBLIC_API_KEY }})
            if(res.data.bestMatches != null && res.data.bestMatches !== undefined) {
            const uniqueTypes: Array<string> = Array.from(new Set(res.data.bestMatches.map((item: any) => item['3. type'])))
            const uniqueTypesArr = ['All', ...uniqueTypes]
            console.log("second try alpha-vantage uniqueTypesArr "+JSON.stringify(uniqueTypesArr));
              console.log("second try alpha-vantage bestMatches "+JSON.stringify(res.data.bestMatches));
            dispatch(saveResults(res.data.bestMatches))
            setTypes([...uniqueTypesArr])
            if (_recentSearches) {
                if (_recentSearches.includes(_query)) return
                dispatch(saveRecentSearches([..._recentSearches, _query]));
                StorageUtils._save(CommonConstants.recentSearchesKey, [..._recentSearches, _query])
            } else {
                dispatch(saveRecentSearches([_query]));
            } 
             }
            return error
        } finally {
            setLoading(false)
        }
    }
}
