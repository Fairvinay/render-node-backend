import axios from "axios";
import {NEXT_PUBLIC_API_KEY } from '../config'
const excludedFunctions = ['SYMBOL_SEARCH']
const isThrowError = false;
export default function addInterceptor(_API: any) {
    _API.interceptors.request.use((config: any) => {

        if (!navigator.onLine) {
            new axios.Cancel("No Internet Connection")
        }
        config.params = {
            ...config.params,
            apikey: process.env.NEXT_PUBLIC_API_KEY !== undefined ? process.env.NEXT_PUBLIC_API_KEY : NEXT_PUBLIC_API_KEY
        }

        console.log("API called with params: ", config.params)
        return config;
    })

    _API.interceptors.response.use((response: any) => {
            var customError: any = "abc";
            console.log(response.data)
            if (response.data) {
                if (response.data.hasOwnProperty("Error Message")) {
                    customError = new Error('Invalid Key Provided');
                } else if (response.data.hasOwnProperty("Information")) {
                    customError = new Error('API Limit Reached');
                }

                if (customError !== "abc" && !excludedFunctions.includes(response.config.params.function)) {
                    if (isThrowError) {
                        throw customError;
                    }
                    location.replace('error')
                }
            }
            return response
        },
        (error: any) => {
            return Promise.reject(error);
        })

    return _API;
}
