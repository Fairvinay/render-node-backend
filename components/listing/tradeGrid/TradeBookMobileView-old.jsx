// components/MobileView.tsx
import React, {Suspense, useEffect , useState,useMemo} from "react";
import { CommonConstants } from "@/utils/constants";
import { StorageUtils } from "@/libs/cache"; 
import tradeBook from './tradesample.json';
import './tradestyles.css'; // ✅ No 'tradestyles.'
 // const TradeBookMobileView  =({ tradeDataB }) => {
export  const  TradeBookMobileView  =({ sortedData, userLogged, handleSort ,getSortIndicator }) => {
 /* StorageUtils._save(CommonConstants.tradeDataCacheKey,CommonConstants.sampleTradeDataVersion1);
 //  const currentPlatform = useSelector((state ) => state.misc.platformType)
   const [parsedData, setParsedData] = useState(() => JSON.parse(StorageUtils._retrieve(CommonConstants.tradeDataCacheKey).data));
  
  const [data, setData] = useState(tradeDataB);
    const [sortColumn, setSortColumn] = useState(null); // e.g., "symbol"
  const [sortDirection, setSortDirection] = useState("asc"); // "asc" or "desc"


    function parseDate(str) {
    // e.g., "14-Jul-2025 09:48:22"
    const [datePart, timePart] = str.split(" ");
    const [day, mon, year] = datePart.split("-");
    const monthMap = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const [hour, min, sec] = timePart.split(":").map(Number);
    return new Date(year, monthMap[mon], day, hour, min, sec);
  } 
 const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
 const sortedData = useMemo(() => {
  if (!userLogged) return parsedData;
  if (!sortColumn) return parsedData;

  const dataToSort = [...parsedData];

  if (sortColumn === 'orderDateTime') {
    return dataToSort.sort((a, b) => {
      const timeA = parseDate(a[sortColumn]).getTime();
      const timeB = parseDate(b[sortColumn]).getTime();

      return sortDirection === "asc"
        ? timeA - timeB
        : timeB - timeA;
    });
  }

  return dataToSort.sort((a, b) => {
    const valA = a[sortColumn];
    const valB = b[sortColumn];

    const isNumeric = !isNaN(parseFloat(valA)) && !isNaN(parseFloat(valB));

    if (isNumeric) {
      return sortDirection === "asc"
        ? parseFloat(valA) - parseFloat(valB)
        : parseFloat(valB) - parseFloat(valA);
    }

    return sortDirection === "asc"
      ? String(valA).localeCompare(String(valB))
      : String(valB).localeCompare(String(valA));
  });
}, [parsedData, sortColumn, sortDirection]);

const getSortIndicator = (column) =>
    sortColumn === column ? (sortDirection === "asc" ? " ▲" : " ▼") : "";
*/
  return ( 
       <div class="overflow-visible w-full">  
    {/*  <table className="min-w-full text-sm text-left border border-gray-200 shadow-md rounded-lg overflow-hidden"> */} 
      <table className="min-w-full table-auto text-sm border-collapse">
        <thead className="bg-gray-100 text-gray-700 font-semibold">
          <tr>
            <th className="py-1 px-2  cursor-pointer" onClick={() => handleSort("symbol")}>Instrument{getSortIndicator("symbol")}</th>
            <th className="py-1 px-2  cursor-pointer" onClick={() => handleSort("productType")}>Product Type{getSortIndicator("productType")}</th>
            <th className="py-1 px-2  cursor-pointer" onClick={() => handleSort("tradedQty")}>Quantity{getSortIndicator("tradedQty")}</th>
            <th className="py-1 px-2  cursor-pointer" onClick={() => handleSort("tradePrice")}>Price{getSortIndicator("tradePrice")}</th>
            <th className="py-1 px-2  cursor-pointer" onClick={() => handleSort("orderDateTime")}>Time{getSortIndicator("orderDateTime")}</th>
            <th className="py-1 px-2  cursor-pointer" onClick={() => handleSort("tradeValue")}>Trade Value{getSortIndicator("tradeValue")}</th>
            <th className="py-1 px-2 ">Buy/Sell</th>
          </tr>
        </thead>

        <tbody>
          { (Array.isArray(sortedData) &&  sortedData.length > 0 && userLogged  ) ? sortedData?.map((row, index) => (
            <tr key={index} className={`hover:bg-gray-50 transition ${row['side'] === '-1' ? 'trade-row-sell' : 'trade-row-buy'}`}>
              <td className="py-1 px-2 ">{row["symbol"]}</td>
              <td className="py-1 px-2 ">{row["productType"]}</td>
              <td className="py-1 px-2 ">{row["tradedQty"]}</td>
              <td className="py-1 px-2 ">{row["tradePrice"]}</td>
              <td className="py-1 px-2 ">{row["orderDateTime"]}</td>
              <td className="py-1 px-2 ">{row["tradeValue"]}</td>
              <td className="py-1 px-2 ">{row['side'] === '-1' ? 'SELL' : 'BUY'}</td>
            </tr>
          )) : (
            <tr><td colSpan="7" className="text-center py-4">No trades found</td></tr>
          )}
        </tbody>
      </table>
    </div>

  );

/*
  return (
 <div class="overflow-x-auto w-full"> 
  <div class="grid grid-cols-8 bg-gray-100 text-gray-700 font-semibold text-sm ">
            <div class="py-1 px-2  cursor-pointer"  >SrNo </div>
            <div class="py-1 px-2  cursor-pointer" onClick={() => handleSort("symbol")}>Instrument{getSortIndicator("symbol")} </div>
            <div class="py-1 px-2  cursor-pointer" onClick={() => handleSort("productType")}>Product{getSortIndicator("productType")} </div>
            <div class="py-1 px-2  cursor-pointer" onClick={() => handleSort("tradedQty")}>Quantity{getSortIndicator("tradedQty")} </div>
            <div class="py-1 px-2  cursor-pointer" onClick={() => handleSort("tradePrice")}>Price{getSortIndicator("tradePrice")} </div>
            <div class="py-1 px-2  cursor-pointer" onClick={() => handleSort("orderDateTime")}>Time{getSortIndicator("orderDateTime")} </div>
            <div class="py-1 px-2  cursor-pointer" onClick={() => handleSort("tradeValue")}>Trade Value{getSortIndicator("tradeValue")} </div>
 
            <div class="py-1 px-2">Buy/Sell</div>
        </div>


    <div className="space-y-4 p-2">
      {data.map((entry, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow-sm ${
            entry.action === "BUY" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <div className="font-bold text-sm">{entry.instrument}</div>
          <div className="text-xs text-gray-600">{entry.productType}</div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="font-semibold">Qty:</span> {entry.quantity}
            </div>
            <div>
              <span className="font-semibold">Price:</span> ₹{entry.price}
            </div>
            <div>
              <span className="font-semibold">Time:</span> {entry.time}
            </div>
            <div>
              <span className="font-semibold">Value:</span> ₹{entry.tradeValue}
            </div>
            <div className="col-span-2 mt-1">
              <span
                className={`px-2 py-1 rounded text-xs font-bold ${
                  entry.action === "BUY"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {entry.action}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
   </div>
  );*/
};

