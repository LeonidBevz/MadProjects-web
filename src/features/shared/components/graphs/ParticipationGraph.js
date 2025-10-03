import { useGetUserCommits } from "features/shared/hooks/useAnalitics";
import { withQuery } from "./GraphWrapper";
import Plot from "react-plotly.js";
import { useTheme } from "features/shared/contexts/ThemeContext";

const ParticipationGraph = ({ data }) => {
  const { isNightTheme } = useTheme();
  const colors = {
    light: { text: "#000", bg: "#fff" },
    dark: { text: "#fff", bg: "rgba(0,0,0,0)" }
  };
  const theme = isNightTheme ? colors.dark : colors.light;

  const labels = data.map(d => d.name);   // имена участников
  const values = data.map(d => Number(d.commits)); // число коммитов

  const layout = {
    title: {
      text: "Количество коммитов по участникам",
      font: { size: 22, color: theme.text },
      x: 0.5,
      xanchor: "center"
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { family: `'Roboto Flex', sans-serif`, color: theme.text },
    showlegend: true,
    legend: {
      font: { color: theme.text },
      orientation: "h",
      y: -0.2
    }
  };

  const plotData = [
    {
      type: "pie",
      labels: labels,
      values: values,
      hole: 0.7, // пончиковая диаграмма
      textinfo: "label+percent",
      textposition: "inside",
      insidetextfont: { color: "#fff", size: 14 },
      marker: {
        line: { color: theme.bg, width: 2 }
      }
    }
  ];

  return (
    <Plot
      data={plotData}
      layout={layout}
      style={{ width: "100%", height: "400px", marginTop: "1rem" }}
      useResizeHandler={true}
    />
  );
};

export default withQuery(ParticipationGraph, useGetUserCommits);
