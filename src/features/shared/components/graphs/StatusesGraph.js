import { useGetProjectsStatuses } from "features/shared/hooks/useAnalitics"
import { withQuery } from "./GraphWrapper"
import Plot from "react-plotly.js";
import { useTheme } from "features/shared/contexts/ThemeContext";


const statusMap = {
  Pending: "Ожидает одобрения",
  Approved: "Одобрен",
  Unapproved: "Отклонён"
};

function mapStatuses(data) {
  if (!Array.isArray(data)) {
    console.warn("mapStatuses ожидает массив, пришло:", data);
    return [];
  }
  return data.map(item => ({
    ...item,
    statusName: statusMap[item.statusName] || item.statusName
  }));
}

function countStatuses(data) {
  const counts = {};
  data.forEach(d => {
    const status = d.statusName;
    counts[status] = (counts[status] || 0) + 1;
  });
  return counts;
}

const StatusesGraph = ({ data }) => {
    const mappedData = mapStatuses(data);

    const { isNightTheme } = useTheme()
    const colors = {
        light: { text: "#000", grid: "#D9D9D9", bar: "#337BCC" },
        dark: { text: "#fff", grid: "#444", bar: "#337BCC" }
    };
    const theme = isNightTheme ? colors.dark : colors.light;

    const counts = countStatuses(mappedData);
    const xValues = Object.keys(counts);
    const yValues = Object.values(counts);

    const layout = {
      title: {
        text: "Число проектов по статусам",
        font: { size: 22, color: theme.text },
        x: 0.5, 
        xanchor: "center",
       
      },
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)", 
      margin: {
        t: 35,
        b: 25,
        l: 20, 
        r: 0   
      },
      font: {family: `'Roboto Flex', sans-serif`, color: theme.text},  
      yaxis: {
        automargin: true, 
        title: {text : "Количество проектов", standoff: 10},
        gridcolor: theme.grid,
        tick0: 0,
        dtick: 1,
        tickformat: "d",
      },
      xaxis: {
        title: "Cтатус проекта",
        type: "category",
        linecolor: theme.grid,  
        linewidth: 1.3,  
        color: theme.text,
      },
      bargap: 0.2,
    };

    const plotData =[
        {
          x: xValues,
          y: yValues,
          type: "bar",
          text: yValues,
          textposition: "outside",
          cliponaxis: false,
          marker: { color: theme.bar, line: { color: theme.text, width: 1 } },
          textfont: { color: theme.text, size: 16 }
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

export default withQuery(StatusesGraph, useGetProjectsStatuses)