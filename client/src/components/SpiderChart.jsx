import React, { useContext, useEffect, useState } from 'react'
import { LabelsContext } from '../App'
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
  const backColors = [
    'rgba(64, 224, 208, 0.2)',
    'rgba(208, 64, 224, 0.2)',
    'rgba(224, 208, 64, 0.2)'
  ]
  const borderColors = [
    'rgba(64, 224, 208, 1)',
    'rgba(208, 64, 224, 1)',
    'rgba(224, 208, 64, 1)'
  ]
  return data.filter(sample => sample).map((sample, i) => ({
    data: sample.values,
    label: sample.label,
    backgroundColor: backColors[i],
    borderColor: borderColors[i],
    borderWidth: 2
  }))
}

function SpiderChart ({ data1, data2, data3, style, detail }) {
  const labels = useContext(LabelsContext)
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
        position: 'bottom',
        display: detail
      }
    },
    scales: {
      r: {
        suggestedMin: 0,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
          display: detail
        },
        angleLines: {
          color: 'deepskyblue'
        },
        grid: {
          color: 'deepskyblue'
        },
        pointLabels: {
          color: 'deepskyblue',
          display: detail
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
