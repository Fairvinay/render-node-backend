import axios from "axios";

const API = axios.create({
    baseURL: 'https://www.alphavantage.co/query',
    timeout: 25000  // netlify times out in 30 secs 
})
const FYERSAPI = axios.create({
   //   baseURL: 'https://store-stocks.netlify.app/.netlify/functions/netlifystockfyersbridge/api'
  //baseURL: 'http://fyers-stocks-node-express-render.onrender.com/.netlify/functions/netlifystockfyersbridge/api'
  baseURL: 'https://fyers-stocks-node-express-render.onrender.com/api'
})
//const FYERSAPILOGINURL = 'https://store-stocks.netlify.app/.netlify/functions/netlifystockfyersbridge/api/fyerscallback'
//const FYERSAPINSECSV = 'https://store-stocks.netlify.app';
//const FYERSAPILOGINURL = 'http://fyers-stocks-node-express-render.onrender.com/.netlify/functions/netlifystockfyersbridge/api/fyerscallback'
const FYERSAPILOGINURL = 'https://fyers-stocks-node-express-render.onrender.com/api/fyerscallback'
const FYERSAPITRADEBOOKURL = 'https://fyers-stocks-node-express-render.onrender.com/api/fyersgettradebook'
const FYERSAPIPOSITIONBOOKURL = 'https://fyers-stocks-node-express-render.onrender.com/api/fyersgetpositionbook'
const FYERSAPIHOLDINGSURL = 'https://fyers-stocks-node-express-render.onrender.com/api/fyersgetholdings'
const FYERSAPIORDERBOOKSURL = 'https://fyers-stocks-node-express-render.onrender.com/api/fyersgetorderbook'
const FYERSAPICANCELORDER = 'https://fyers-stocks-node-express-render.onrender.com/api/fyerscancelorder'
const FYERSAPIBUYORDER = 'https://fyers-stocks-node-express-render.onrender.com/api/fyersplacebuyorder'
const FYERSAPISELLORDER = 'https://fyers-stocks-node-express-render.onrender.com/api/fyersplacesellorder'

const FYERSAPITICKERURL = 'https://fyers-stocks-node-express-render.onrender.com/api/fyersgetticker'
const FYERSAPITHREESECQUOTE = 'https://fyers-stocks-node-express-render.onrender.com/api/fyersgetbsecequote'
const FYERSAPITICKERACCESTOKEN = 'https://fyers-stocks-node-express-render.onrender.com/api/fyersaccesstoken'
const FYERSAPITICKERURLCLOSE = 'https://fyers-stocks-node-express-render.onrender.com/api/close'
const FYERSAPINSECSV = 'https://fyers-stocks-node-express-render.onrender.com';

export { API , FYERSAPI ,FYERSAPILOGINURL , FYERSAPINSECSV , FYERSAPITRADEBOOKURL ,FYERSAPIHOLDINGSURL ,
  FYERSAPICANCELORDER,FYERSAPIBUYORDER,FYERSAPISELLORDER
  ,FYERSAPIORDERBOOKSURL ,FYERSAPITICKERURL , FYERSAPITICKERURLCLOSE ,FYERSAPITICKERACCESTOKEN,FYERSAPITHREESECQUOTE,FYERSAPIPOSITIONBOOKURL
};