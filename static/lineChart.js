function drawLineChart() {
    var data = [
        147, 164, 567,
    ];

    var margin = { top: 40, right: 20, bottom: 60, left: 70 },
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scaleLinear()
        .range([0, width])
        .domain([0, data.length - 1]);

    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(data)]);

    var line = d3.line()
        .x(function(d, i) { return x(i); })
        .y(function(d) { return y(d); });

    var svg = d3.select("#lineChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var xAxis = d3.axisBottom(x)
        .tickFormat(d3.format("d"))
        .tickSize(-height)
        .tickPadding(10);

    var yAxis = d3.axisLeft(y)
        .tickSize(-width)
        .tickPadding(10);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll('line')
        .style("stroke", "black");

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", -margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-family", "Heiti SC")
        .style("fill", "red")
        .text("Line Chart")
        .style("opacity", 0)
        .transition().duration(1500)
        .style("opacity", 1);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height + margin.bottom / 2 + 25)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-family", "Heiti SC")
        .style("fill", "blue")
        .text("X Axis Title")
        .style("opacity", 0)
        .transition().duration(1500)
        .style("opacity", 1);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -margin.left / 2 - 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("font-family", "Heiti SC")
        .style("fill", "blue")
        .text("Y Axis Title")
        .style("opacity", 0)
        .transition().duration(1500)
        .style("opacity", 1);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll('line')
        .style("stroke", "black");

    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "white");

    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .style("opacity", 0) // Initial opacity for line
        .transition().duration(1500) // Animation for line
        .style("opacity", 1)
        .style("stroke-dasharray", ("none"));

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d, i) { return x(i); })
        .attr("cy", function(d) { return y(d); })
        .attr("r", 5)
        .attr("fill", "red")
        .style("pointer-events", "all")
        .style("opacity", 0)
        .transition().duration(1500)
        .style("opacity", 1);

    svg.selectAll("circle")
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut)
        .on("click", handleClick);

    function handleMouseOver() {
        // Add mouseover event handling here
    }

    function handleMouseOut() {
        // Add mouseout event handling here
    }

    function handleClick() {
        // Add click event handling here
    }
}

