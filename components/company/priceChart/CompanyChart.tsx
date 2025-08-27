import React, {useEffect, useState} from 'react'
import {Line} from "@ant-design/charts";
import {ScreenLoader} from '../../loader/screenLoader/loader.component';
import {useAppDispatch} from '@/providers/ReduxProvider';
import {fetchChartData} from './chart.actions';
import {ActionLoader} from '@/components/loader/actionLoader/loader.component';

export interface ChartProps {
    Symbol: string
}

const ranges = [
    {
        text: '24H',
        value: "TIME_SERIES_INTRADAY"
    }, {
        text: '1D',
        value: "TIME_SERIES_DAILY"
    }, {
        text: '1W',
        value: "TIME_SERIES_WEEKLY"
    }, {
        text: '1M',
        value: "TIME_SERIES_MONTHLY"
    },
]


const Chart = ({Symbol}: ChartProps) => {
    const [chartData, setChartData] = useState<Array<any> | null>(null)
    const [axisMin, setAxisMin] = useState(0);
    const [axisMax, setAxisMax] = useState(0);
    const [fetchFn, setFunction] = useState('TIME_SERIES_DAILY')
    const dispatch = useAppDispatch()
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        function fetchData() {
            dispatch(fetchChartData(setIsLoading, fetchFn, Symbol, setChartData, setAxisMin, setAxisMax))
        }

        fetchData()
    }, [Symbol, dispatch, fetchFn])

    if (!chartData) {
        return <ScreenLoader/>
    }
    return (
        <div className='w-10/12 mx-auto my-5'>
            <Line  className="dark:lavender"
                data={chartData.reverse()}
                height={300}
                padding="auto"
                xField="Date"
                yField="Close"
                tooltip={{
                    showMarkers: false
                }}
                xAxis={{
                    tickCount: 5,
                }}
                yAxis={{
                    grid: {line: {style: {lineWidth: 0}}},
                    min: axisMin,
                    max: axisMax,
                }}
                smooth
            />

            <div className='flex flex-wrap w-full md:w-1/2 lg:w-1/3 mx-auto gap-2 items-center my-10 justify-around'>
                {
                    ranges.map((item) => {
                        return <div key={item.value} onClick={() => {
                            setFunction(item.value)
                        }}
                                    className={`${fetchFn === item.value ? 'bg-brandgreen text-white border-2 border-brandgreen' : 'bg-white dark:lavender border-2 border-brandgreen text-brandgreen'} hover:bg-brandgreenlight cursor-pointer py-1 rounded-full flex items-center justify-center w-full sm:w-1/2 md:w-1/4 lg:w-1/5`}
                                    style={{height: 40, width: 40}}>  {/* bg-black */}
                            <span className={`text-xs font-semibold`}>{isLoading && fetchFn === item.value ?
                                <ActionLoader/> : item.text}</span>
                        </div>
                    })
                }
            </div>
        </div>
    )
}

export default Chart
