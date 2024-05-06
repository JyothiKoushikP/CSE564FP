document.addEventListener("DOMContentLoaded", function () {
   
    // Define variables
    let xVariable;
    let yVariable;

    populateDropdowns();

    // Function to populate dropdowns
    function populateDropdowns() {
        const attributes = Object.keys(data[0]).slice(2); // Exclude first two values
        const xDropdown = document.getElementById('x-variable');
        const yDropdown = document.getElementById('y-variable');
        attributes.forEach(attribute => {
            const option = document.createElement('option');
            option.text = attribute;
            xDropdown.add(option.cloneNode(true));
            yDropdown.add(option.cloneNode(true)); 
        });
        xDropdown.addEventListener('change', updatePlot);
        yDropdown.addEventListener('change', updatePlot);
    }

    function updatePlot() {
        // Get selected variables from dropdowns
        xVariable = document.getElementById('x-variable').value;
        yVariable = document.getElementById('y-variable').value;
        // Remove existing plot
        d3.select('#scatter-plot-matrix').selectAll('*').remove();
        // Render scatter plot matrix with selected variables
        renderScatterPlotMatrix();
    }

    // Function to render scatter plot matrix
    function renderScatterPlotMatrix() {
        // Define dimensions and margins
        const margin = { top: 70, right: 20, bottom: 60, left: 100 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create SVG container
        const svg = d3.select('#scatter-plot-matrix')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Add heading
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -40)
            .attr('text-anchor', 'middle')
            .style("font-weight", "bold")
            .style("font-family", "Heiti SC")
             .style("fill", "rgba(154,9,55,0.79)")
            .style("font-size", "18px")
            .text(xVariable + ' vs ' + yVariable);

        // Define scales for numerical variables
        const xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[xVariable]), d3.max(data, d => d[xVariable])])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d[yVariable]), d3.max(data, d => d[yVariable])])
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
            .attr('cx', d => xScale(d[xVariable])) // Move to final x position
            .attr('cy', d => yScale(d[yVariable])) // Move to final y position
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
            .attr('transform', `translate(${(width / 2) + 20}, ${height + margin.top - 20})`)
            .style("font-family", "Heiti SC")
            .style("font-weight", "bold")
             .style("fill", "rgba(8,73,136,0.79)")
            .style("font-size", "14px")
            .text(xVariable);

        // Y Axis label
        svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('transform', `translate(${-margin.left + 35}, ${height / 2}) rotate(-90)`)
            .style("font-family", "Heiti SC")
            .style("font-weight", "bold")
            .style("fill", "rgba(8,73,136,0.79)")
            .style("font-size", "14px")
            .text(yVariable);
    }
});
