var attributesList = ["A1","A2","A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10", "A11"];

var attributeDict = {};

for (var i = 0; i < attributesData.length; i++) {
    attributeDict[attributesData[i]] = "A" + (i + 1);
}

function drawHeatmap(selectedYear) {
    d3.select("#heatMap").html("");

    var margin = {top: 30, right: 30, bottom: 30, left: 30},
        width = 375 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var svg = d3.select("#heatMap")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .range([0, width])
        .domain(attributesList)
        .padding(0.01);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .style("font-size", "11px")
        .style("font-family", "Heiti SC")
        .style("font-weight", "bold");


    var y = d3.scaleBand()
        .range([height, 0])
        .domain(attributesList)
        .padding(0.01);

    svg.append("g")
        .call(d3.axisLeft(y))
        .style("font-size", "11px")
        .style("font-weight", "bold")
        .style("font-family", "Heiti SC");


    var data = heatmapData[selectedYear];

    svg.selectAll()
    .data(data, function(d) { return d.group + ':' + d.variable; })
    .enter()
    .append("rect")
    .attr("x", function(d) { return x(attributeDict[d.group]); })
    .attr("y", function(d) { return y(attributeDict[d.variable]); })
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function(d) { return "white"; })
    .style("stroke", "black")
    .style("stroke-width", 1)
    .style("rx", 3)
    .style("ry", 3)
    .on("mouseover", function(event, d) {
        d3.select(this)
            .transition()
            .duration(200)
            .style("fill", "#add8e6"); // Change color to light blue on hover

        // Show tooltip with text
        tooltip.transition()
            .duration(200)
            .style("opacity", .9);
        tooltip.html("Value: " + d.value + "<br>" +
                     "Attribute1: " + d.group + "<br>" +
                     "Attribute2: " + d.variable)
            .style("left", (event.pageX) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
        d3.select(this)
            .transition()
            .duration(200)
            .style("fill", function(d) {
                // Revert to original color based on d.value
            if (d.value < 0) {
                    if (d.value <= -1) return "#8B0000"; // Darkest red for -1
                    else if (d.value > -1 && d.value <= -0.9) return "#B22222";
                    else if (d.value > -0.9 && d.value <= -0.8) return "#CD5C5C";
                    else if (d.value > -0.8 && d.value <= -0.7) return "#E9967A";
                    else if (d.value > -0.7 && d.value <= -0.6) return "#FA8072";
                    else if (d.value > -0.6 && d.value <= -0.5) return "#FFA07A";
                    else if (d.value > -0.5 && d.value <= -0.4) return "#FF6347";
                    else if (d.value > -0.4 && d.value <= -0.3) return "#FF4500";
                    else if (d.value > -0.3 && d.value <= -0.2) return "#FF0000";
                    else if (d.value > -0.2 && d.value <= -0.1) return "#CD5C5C";
                    else return "#FFA07A"; // Lightest red for -0.1
                }
                // Define the color scale for positive values (shades of green)
                else if (d.value > 0) {
                    if (d.value >= 1) return "#006400"; // Darkest green for 1
                    else if (d.value < 1 && d.value >= 0.9) return "#228B22";
                    else if (d.value < 0.9 && d.value >= 0.8) return "#32CD32";
                    else if (d.value < 0.8 && d.value >= 0.7) return "#98FB98";
                    else if (d.value < 0.7 && d.value >= 0.6) return "#90EE90";
                    else if (d.value < 0.6 && d.value >= 0.5) return "#7CFC00";
                    else if (d.value < 0.5 && d.value >= 0.4) return "#ADFF2F";
                    else if (d.value < 0.4 && d.value >= 0.3) return "#7FFF00";
                    else if (d.value < 0.3 && d.value >= 0.2) return "#00FF00";
                    else if (d.value < 0.2 && d.value >= 0.1) return "#32CD32";
                    else return "#90EE90"; // Lightest green for 0.1
                }
                // Return white for 0 correlation
                else {
                    return "#ffffff";
                }
            });

        // Hide tooltip
        tooltip.transition()
            .duration(500)
            .style("opacity", 0);
    })
    .transition()
    .delay(function(d, i) { return i * 50; })
    .duration(1000)
    .style("fill", function(d) {
        if (d.value < 0) {
            if (d.value <= -1) return "#8B0000"; // Darkest red for -1
            else if (d.value > -1 && d.value <= -0.9) return "#B22222";
            else if (d.value > -0.9 && d.value <= -0.8) return "#CD5C5C";
            else if (d.value > -0.8 && d.value <= -0.7) return "#E9967A";
            else if (d.value > -0.7 && d.value <= -0.6) return "#FA8072";
            else if (d.value > -0.6 && d.value <= -0.5) return "#FFA07A";
            else if (d.value > -0.5 && d.value <= -0.4) return "#FF6347";
            else if (d.value > -0.4 && d.value <= -0.3) return "#FF4500";
            else if (d.value > -0.3 && d.value <= -0.2) return "#FF0000";
            else if (d.value > -0.2 && d.value <= -0.1) return "#CD5C5C";
            else return "#FFA07A";
        }
        else if (d.value > 0) {
            if (d.value >= 1) return "#006400"; // Darkest green for 1
            else if (d.value < 1 && d.value >= 0.9) return "#228B22";
            else if (d.value < 0.9 && d.value >= 0.8) return "#32CD32";
            else if (d.value < 0.8 && d.value >= 0.7) return "#98FB98";
            else if (d.value < 0.7 && d.value >= 0.6) return "#90EE90";
            else if (d.value < 0.6 && d.value >= 0.5) return "#7CFC00";
            else if (d.value < 0.5 && d.value >= 0.4) return "#ADFF2F";
            else if (d.value < 0.4 && d.value >= 0.3) return "#7FFF00";
            else if (d.value < 0.3 && d.value >= 0.2) return "#00FF00";
            else if (d.value < 0.2 && d.value >= 0.1) return "#32CD32";
            else return "#90EE90";
        }
        else {
            return "#ffffff";
        }
    });

    var tooltip = d3.select("#heatMap").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
}


