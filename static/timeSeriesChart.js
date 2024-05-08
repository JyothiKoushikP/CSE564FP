function drawTimeSeriesChart(county, attribute) {
        d3.select("#tsChart").html("");

        document.getElementById("tcHeading").innerText = "Time Series Chart (" + selectedCounty + " vs " + attributeX + ")";

        var tooltip = d3.select("#tsChart").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var data = lcData[county][attribute];


        var margin = { top: 60, right: 50, bottom: 150, left: 155 },
            width = 800 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .range([0, width])
            .domain([2008, 2008 + data.length - 1]);

        var y = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data)]);

        var line = d3.line()
            .x(function(d, i) { return x(2008 + i); })
            .y(function(d) { return y(d); });

        var svg = d3.select("#tsChart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var xAxis = d3.axisBottom(x)
            .tickFormat(d3.format("d"))
            .tickPadding(10);

        var yAxis = d3.axisLeft(y)
            .tickPadding(10);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll('line')
             .style("font-size", "12px")
            .style("font-family", "Heiti SC")
            .style("font-weight", "bold")
            .style("stroke", "black");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom / 2 - 17)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .style("font-family", "Heiti SC")
            .style("fill", "black")
            .text("Year");

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left / 2 - 15)
            .attr("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("font-size", "14px")
            .style("font-family", "Heiti SC")
            .style("fill", "black")
            .text(attribute);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .selectAll('line')
            .style("stroke", "black")
            .style("font-size", "12px")
            .style("font-family", "Heiti SC")
            .style("font-weight", "bold");

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "none");

        // Add fade-in animation for the line
        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .attr("fill", "none")
            .attr("stroke", "#ff6600") // brighter orange color
            .attr("stroke-width", 3) // thicker line
            .style("opacity", 0) // Initial opacity for line
            .transition().duration(1500) // Animation duration
            .style("opacity", 1)
            .style("stroke-dasharray", ("none"));

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d, i) { return x(2008 + i); })
            .attr("cy", function(d) { return y(d); })
            .attr("r", 5)
            .attr("fill", "#0b67b4") // brighter orange color
            .style("pointer-events", "all")
            .style("opacity", 0)
            .transition().duration(1500) // Animation duration
            .style("opacity", 1)


        svg.selectAll("circle")
            .on("mouseover", function(d, i) {
                const [x, y] = d3.pointer(event);
                var tooltipText = county + ': ' + i;

                tooltip.transition()
                    .duration(200)
                    .style("opacity", .9);
                tooltip.html(tooltipText)
                    .style("left", (x + 80) + "px")
                    .style("top", (y + 570) + "px");
            })
            .on("mouseout", function() {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

        svg.append("path")
            .datum(data)
            .attr("class", "area")
            .attr("d", d3.area()
                .x(function(d, i) { return x(2008 + i); })
                .y0(height)
                .y1(function(d) { return y(d); }))
            .style("fill", "blue")
            .style("opacity", 0.3);

}

