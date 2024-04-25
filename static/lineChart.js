var selectedCounty = "Alameda County";
var selectedAttribute = "Labor Force";

function drawLineChart(county, attribute) {
    d3.select("#lineChart").html("");

var tooltip = d3.select("#lineChart").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var data = lcData[county][attribute];

var margin = { top: 150, right: 50, bottom: 100, left: 100 },
    width = 800 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

var x = d3.scaleLinear()
    .range([0, width])
    .domain([2008, 2008 + data.length - 1]);

var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data)]);

var line = d3.line()
    .x(function(d, i) { return x(2008 + i); })
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
    .attr("y", height + margin.bottom / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .style("font-family", "Heiti SC")
    .style("fill", "black")
    .text("Year");

svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
     .style("font-weight", "bold")
    .style("font-family", "Heiti SC")
    .style("fill", "rgba(111,10,229,0.79)")
    .text("Line Chart: " + selectedCounty + " vs " + selectedAttribute)
    .style("opacity", 0)
    .transition().duration(1500)
    .style("opacity", 1);

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
    .style("stroke", "black");

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
    .style("opacity", 1);

svg.selectAll("circle")
    .on("mouseover", function(d, i) {
        const [x, y] = d3.pointer(event);
        var countyName = selectedCounty;
        var tooltipText = countyName + ': ' + i;

        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html(tooltipText)
            .style("left", (x + 80) + "px")
            .style("top", (y + 970) + "px");
    })
    .on("mouseout", function() {
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    });

}

document.addEventListener("DOMContentLoaded", function () {
    // Event listener for year selection change
    var countySelect = document.getElementById('county-select');
    countySelect.addEventListener('change', function() {
        console.log("h2");
        selectedCounty = this.value;
        selectedAttribute = "Labor Force";
        drawLineChart(selectedCounty,selectedAttribute);
    });

    var attributeSelect = document.getElementById('attribute-select');
    attributeSelect.addEventListener('change', function() {
        console.log("h1");
        selectedAttribute = this.value;
        drawLineChart(selectedCounty,selectedAttribute);
    });
});
