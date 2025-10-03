import { useGetProjectsCommits } from "features/shared/hooks/useAnalitics" 
import { withQuery } from "./GraphWrapper"
import Plot from "react-plotly.js"
import { useTheme } from "features/shared/contexts/ThemeContext"

const CommitsInProjectGraph = ({ data, projectId }) => {
  const { isNightTheme } = useTheme()
  
  const guap_colors = ['rgb(231, 15, 71)', 'rgb(0, 184, 238)', 'rgb(0, 152, 170)', 'rgb(80, 45, 127)', 'rgb(139, 35, 70)', 'rgb(0, 90, 170)']
  const colors = {
    light: { text: "#000", grid: "#D9D9D9", bar: "#337BCC", highlight: 'rgb(231, 15, 71)'},
    dark: { text: "#fff", grid: "#444", bar: "#337BCC", highlight: 'rgb(231, 15, 71)'}
  }
  const theme = isNightTheme ? colors.dark : colors.light

  const xValues = data.map(d => d.title)
  const yValues = data.map(d => Number(d.count))

  const maxY = Math.max(...yValues)
  const desiredTicks = 5
  let step = Math.ceil(maxY / desiredTicks)

  if (step < 1) step = 1    

  const layout = {
    title: {
      text: "Число коммитов по проектам",
      font: { size: 22, color: theme.text },
      x: 0.5,
      xanchor: "center"
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { t: 35, b: 80, l: 50, r: 20 },
    font: { family: `'Roboto Flex', sans-serif`, color: theme.text },
    yaxis: {
      automargin: true,
      title: { text: "Количество коммитов", standoff: 10 },
      gridcolor: theme.grid,
      tick0: 0,
      step: step,
      tickformat: "d",
    },
    xaxis: {
      title: "Проект",
      type: "category",
      automargin: true,
      tickangle: -45,
      linecolor: theme.grid,
      linewidth: 1.3,
      tickfont: { color: theme.text, size: 12 }
    },
    bargap: 0.2
  }

  const plotData = [
    {
      x: xValues,
      y: yValues,
      type: "bar",
      text: yValues,
      textposition: "outside",
      cliponaxis: false,
      marker: { color: theme.bar, line: { color: theme.text, width: 1 } },
      textfont: { color: theme.text, size: 14 }
    }
  ]

  return (
    <Plot
      data={plotData}
      layout={layout}
      style={{ width: "100%", height: "400px", marginTop: "1rem" }}
      useResizeHandler={true}
    />
  )
}

export default withQuery(CommitsInProjectGraph, useGetProjectsCommits)