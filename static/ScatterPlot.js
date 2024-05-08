function renderScatterPlotMatrix() {
        d3.select("#scatter-plot-matrix").html("");
        // Define dimensions and margins
        const margin = { top: 150, right: 160, bottom: 80, left: 100 };
        const width = 625  - margin.right;
        const height = 390  - margin.bottom;

        // Create SVG container
        const svg = d3.select('#scatter-plot-matrix')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Define scales for numerical variables
        const xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[attributeX]), d3.max(data, d => d[attributeX])])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[attributeY]), d3.max(data, d => d[attributeY])])
            .range([height, 0]);

        // Define color scale for circles
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Render circles for numerical variables with animation
        svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', width / 2) // Start from the center
            .attr('cy', height / 2) // Start from the center
            .attr('r', 0) // Start with radius 0
            .style('fill', (d, i) => colorScale(i)) // Assign color based on index
            .transition() // Add transition for animation
            .delay((d, i) => i * 5) // Delay each circle animation
            .duration(500) // Duration of animation
            .attr('cx', d => xScale(d[attributeX])) // Move to final x position
            .attr('cy', d => yScale(d[attributeY])) // Move to final y position
            .attr('r', 4); // Increase radius to final value

        // Render x-axis for numerical variables
        svg.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));

        // Render y-axis for numerical variables
        svg.append('g')
            .call(d3.axisLeft(yScale));

        // X Axis label
        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(${(width / 2) + 20}, ${height + margin.top - 112})`)
            .style("font-family", "Heiti SC")
            .style("font-weight", "bold")
             .style("fill", "rgba(8,73,136,0.79)")
            .style("font-size", "14px")
            .text(attributeX);

        // Y Axis label
        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(${-margin.left + 35}, ${height / 2}) rotate(-90)`)
            .style("font-family", "Heiti SC")
            .style("font-weight", "bold")
            .style("fill", "rgba(8,73,136,0.79)")
            .style("font-size", "14px")
            .text(attributeY);

        document.getElementById("sp").innerText = "Scatter plot (" + attributeX + " vs " + attributeY + ")";

}