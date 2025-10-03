import { withQuery } from "./GraphWrapper";
import Plot from "react-plotly.js";
import { useTheme } from "features/shared/contexts/ThemeContext";
import { useGetProjectsMarks } from "features/shared/hooks/useAnalitics";

const marksMap = {
  "null": "Не оценён",
  "2": "Неудовлетворительно",
  "3": "Удовлетворительно",
  "4": "Хорошо",
  "5": "Отлично"
};

function mapMarks(data) {
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(item => ({
    ...item,
    mark: marksMap[item.mark] || item.mark
  }));
}

function countMarks(data) {
  const counts = {};
  data.forEach(d => {
    const mark = d.mark;
    counts[mark] = (counts[mark] || 0) + 1;
  });
  return counts;
}

const MarksGraph = ({ data }) => {
  const mappedData = mapMarks(data);

  const { isNightTheme } = useTheme();
  const colors = {
    light: { text: "#000", grid: "#D9D9D9", bar: "#337BCC" },
    dark: { text: "#fff", grid: "#444", bar: "#337BCC" }
  };
  const theme = isNightTheme ? colors.dark : colors.light;

  const counts = countMarks(mappedData);
  const xValues = Object.keys(counts);
  const yValues = Object.values(counts);

  const layout = {
    title: {
      text: "Распределение оценок по проектам",
      font: { size: 22, color: theme.text },
      x: 0.5,
      xanchor: "center",
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    margin: { t: 35, b: 40, l: 50, r: 20 },
    font: { family: `'Roboto Flex', sans-serif`, color: theme.text },
    yaxis: {
      automargin: true,
      title: { text: "Количество проектов", standoff: 10 },
      gridcolor: theme.grid,
      tick0: 0,
      dtick: 1,
      tickformat: "d",
    },
    xaxis: {
      title: "Оценка",
      type: "category",
      linecolor: theme.grid,
      linewidth: 1.3,
      color: theme.text,
    },
    bargap: 0.2,
  };

  const plotData = [
    {
      x: xValues,
      y: yValues,
      type: "bar",
      text: yValues,
      textposition: "outside",
      cliponaxis: false,
      marker: { color: theme.bar, line: { color: theme.text, width: 1 } },
      textfont: { color: theme.text, size: 16 },
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

export default withQuery(MarksGraph, useGetProjectsMarks);
