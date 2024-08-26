import React, { useEffect, useRef, useState } from 'react'
import { createChart, IChartApi } from 'lightweight-charts'

const CandlestickChart = () => {
    const chartContainerRef = useRef(null)
    const [chart, setChart] = useState(null)
    const [series, setSeries] = useState<any>(null)

    // Function to generate data
    const generateData = (
        numberOfCandles = 500,
        updatesPerCandle = 5,
        startAt = 100
    ) => {
        let randomFactor = 25 + Math.random() * 25
        const samplePoint = (i: number) =>
            i *
                (0.5 +
                    Math.sin(i / 1) * 0.2 +
                    Math.sin(i / 2) * 0.4 +
                    Math.sin(i / randomFactor) * 0.8 +
                    Math.sin(i / 50) * 0.5) +
            200 +
            i * 2

        const createCandle = (val: number, time: number) => ({
            time,
            open: val,
            high: val,
            low: val,
            close: val,
        })

        const updateCandle = (candle: any, val: number) => ({
            time: candle.time,
            close: val,
            open: candle.open,
            low: Math.min(candle.low, val),
            high: Math.max(candle.high, val),
        })

        randomFactor = 25 + Math.random() * 25
        const date = new Date(Date.UTC(2018, 0, 1, 12, 0, 0, 0))
        const numberOfPoints = numberOfCandles * updatesPerCandle
        const initialData = []
        const realtimeUpdates = []
        let lastCandle
        let previousValue = samplePoint(-1)
        for (let i = 0; i < numberOfPoints; ++i) {
            if (i % updatesPerCandle === 0) {
                date.setUTCDate(date.getUTCDate() + 1)
            }
            const time = date.getTime() / 1000
            let value = samplePoint(i)
            const diff = (value - previousValue) * Math.random()
            value = previousValue + diff
            previousValue = value
            if (i % updatesPerCandle === 0) {
                const candle = createCandle(value, time)
                lastCandle = candle
                if (i >= startAt) {
                    realtimeUpdates.push(candle)
                }
            } else {
                const newCandle = updateCandle(lastCandle, value)
                lastCandle = newCandle
                if (i >= startAt) {
                    realtimeUpdates.push(newCandle)
                } else if ((i + 1) % updatesPerCandle === 0) {
                    initialData.push(newCandle)
                }
            }
        }

        return {
            initialData,
            realtimeUpdates,
        }
    }

    useEffect(() => {
        const chartOptions = {
            layout: {
                textColor: 'white',
                background: { type: 'solid', color: 'black' },
            },
            height: 400,
        }

        const chartInstance = createChart(
            chartContainerRef.current!,
            chartOptions as any
        )
        setChart(chartInstance as any)

        const seriesInstance = chartInstance.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        })
        setSeries(seriesInstance)

        const data = generateData(2500, 20, 1000)
        seriesInstance.setData(data.initialData)
        chartInstance.timeScale().fitContent()
        chartInstance.timeScale().scrollToPosition(5, true)

        function* getNextRealtimeUpdate(realtimeData: any) {
            for (const dataPoint of realtimeData) {
                yield dataPoint
            }
            return null
        }

        const streamingDataProvider = getNextRealtimeUpdate(
            data.realtimeUpdates
        )
        const intervalID = setInterval(() => {
            const update = streamingDataProvider.next()
            if (update.done) {
                clearInterval(intervalID)
                return
            }
            seriesInstance.update(update.value)
        }, 100)

        const handleResize = () => {
            chartInstance.applyOptions({ height: 200 })
        }
        window.addEventListener('resize', handleResize)

        return () => {
            clearInterval(intervalID)
            window.removeEventListener('resize', handleResize)
            chartInstance.remove()
        }
    }, [])

    return <div ref={chartContainerRef} />
}

export default CandlestickChart
