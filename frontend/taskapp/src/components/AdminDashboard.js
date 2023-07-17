import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function AdminDashboard({ tasks }) {
    const chartRef = useRef();

    useEffect(() => {
        if (tasks.length > 0) {
            drawChart();
        }
    }, [tasks]);

    const drawChart = () => {
        // Set up chart dimensions and margins
        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 20, bottom: 30, left: 50 };

        // Calculate the inner chart dimensions
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        // Create an SVG element
        const svg = d3
            .select(chartRef.current)
            .append('svg')
            .attr('width', width)
            .attr('height', height);

        // Create a chart group within the SVG
        const chartGroup = svg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        // Cleanup
        return () => {
            d3.select(chartRef.current).selectAll('svg').remove();
        };
    };

    return <div ref={chartRef}></div>;
}

export default AdminDashboard;
