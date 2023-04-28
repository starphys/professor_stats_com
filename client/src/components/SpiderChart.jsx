import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'react-chartjs-2'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const createDatasets = (data) => {
  return data.filter(sample => sample).map((sample, i) => ({
    data: sample.values,
    label: sample.label,
    backgroundColor: `rgba(64, ${224 - (10 * i)}, ${208 - (10 * i)}, 0.2)`,
    borderColor: `rgba(64, ${224 - (10 * i)}, ${208 - (10 * i)}, 0.8)`,
    borderWidth: 2
  }))
}

function SpiderChart ({ labels, data1, data2, data3, style }) {
  const [data, setData] = useState([data1, data2, data3])

  useEffect(() => {
    setData([data1, data2, data3])
  }, [data1, data2, data3])

  const chartData = {
    labels,
    datasets: createDatasets(data)
  }
  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom'
      }
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1
        },
        angleLines: {
          color: 'deepskyblue'
        },
        grid: {
          color: 'deepskyblue'
        },
        pointLabels: {
          color: 'deepskyblue'
        }

      }
    }
  }
  return (
    <div style={style}>
      <Radar
        data={chartData}
        options={chartOptions}
      />
    </div>
  )
}

export default SpiderChart
