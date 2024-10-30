import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { cityService } from '../services/cityService';

const DataVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const x = d3.scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height - margin.bottom, margin.top]);

    const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    const updateChart = () => {
      const data = cityService.getCityData();
      const chartData = [
        { name: 'Population', value: data.population },
        { name: 'Happiness', value: data.happiness },
        { name: 'Funds', value: data.funds / 10000 }, // Scaled down for visibility
        { name: 'Employment', value: data.employmentRate },
        { name: 'Education', value: data.educationLevel },
        { name: 'Crime Rate', value: data.crimeRate },
      ];

      x.domain(chartData.map(d => d.name));
      y.domain([0, d3.max(chartData, d => d.value) || 0]);

      svg.select(".x-axis").call(xAxis as any);
      svg.select(".y-axis").call(yAxis as any);

      svg.selectAll(".bar")
        .data(chartData)
        .join("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.name) || 0)
        .attr("y", d => y(d.value))
        .attr("height", d => y(0) - y(d.value))
        .attr("width", x.bandwidth())
        .attr("fill", "steelblue");
    };

    svg.append("g").attr("class", "x-axis");
    svg.append("g").attr("class", "y-axis");

    const interval = setInterval(updateChart, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg ref={svgRef} width="600" height="400"></svg>
  );
};

export default DataVisualization;
