var selectedYear = 2008;
var selectedAttribute = "";

document.addEventListener("DOMContentLoaded", function () {
    var width = 650,
        height = 800;

    var projection = d3.geoMercator()
        .scale(1000 * 2)
        .center([-120, 36])
        .translate([width / 2 - 160, height / 2 - 80]);

    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select("#chloroplethMap").append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("path")
        .datum(topojson.feature(jsonData, jsonData.objects.subunits))
        .attr("class", "land")
        .attr("d", path);

    svg.append("text")
        .attr("x", 270)
        .attr("y", 15)
        .attr("font-family", "Heiti SC")
        .attr("font-size", "16px")
        .attr("fill", "black")
        .text("Legend Scale");

    svg.selectAll(".subunit")
        .data(topojson.feature(jsonData, jsonData.objects.subunits).features)
        .enter()
        .append("path")
        .attr("class", function (d) {
            return "subunit " + d.properties.name;
        })
        .attr("d", path)
        .on("mouseover", function (event, d) { // Updated to D3 v6 syntax
            // Get mouse coordinates
            const [x, y] = d3.pointer(event);

            // Show tooltip
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html(d.properties.fullName)
                .style("left", (x + 10) + "px") // Position tooltip 10px to the right of the mouse pointer
                .style("top", (y + 250) + "px"); // Position tooltip 20px above the mouse pointer
        })
        .on("mouseout", function () {
            // Hide tooltip
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });


    svg.append("path")
        .datum(topojson.mesh(jsonData, jsonData.objects.subunits, function (a, b) {
            return a === b;
        }))
        .attr("d", path)
        .attr("class", "exterior-boundary");

    // Tooltip declaration
    var div = d3.select("#chloroplethMap").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // Event listener for year selection change
    var yearSelect = document.getElementById('year-select');
    yearSelect.addEventListener('change', function() {
        selectedYear = this.value;
        console.log('Selected Year:', selectedYear);
    });

    var radioButtons = document.querySelectorAll('input[type="radio"][name="age"]');
    radioButtons.forEach(function (radio) {
        radio.addEventListener("change", function () {
            selectedAttribute = this.value;
            console.log(selectedAttribute);
            displayLegend();
            switch (selectedAttribute) {
                case 'Employment':
                    updateMapColors(eMap[selectedYear]);
                    break;
                case 'Unemployment':
                    updateMapColors(uEMap[selectedYear]);
                    break;
                case 'Unemployment Rate':
                    updateMapColors(uRateMap[selectedYear]);
                    break;
                case 'Average Weekly Wages':
                    updateMapColors(avgMap[selectedYear]);
                    break;
            }
        });
    });

    function updateMapColors(data) {
        delete data["California"];

        var values = Object.values(data);
        var minValue = Math.min(...values);
        var maxValue = Math.max(...values);

        svg.selectAll(".subunit")
            .transition()
            .duration(1000)
            .style("fill", function (d) {
                var county = d.properties.name + " County"; // Modify county name format
                var value = data[county];
                var normalizedValue = (value - minValue) / (maxValue - minValue);
                if (normalizedValue <= 0.14) {
                    return "DarkRed";
                } else if (normalizedValue <= 0.28) {
                    return "FireBrick";
                } else if (normalizedValue <= 0.42) {
                    return "Crimson";
                } else if (normalizedValue <= 0.56) {
                    return "IndianRed";
                } else if (normalizedValue <= 0.70) {
                    return "LightCoral";
                } else if (normalizedValue <= 0.84) {
                    return "LightSalmon";
                } else {
                    return "LightPink";
                }
            });
    }

    var legendColors = ["DarkRed", "FireBrick", "Crimson", "IndianRed", "LightCoral", "LightSalmon", "LightPink"];
    var legendWidth = 20;
    var legendHeight = 20;
    var legendSpacing = 10;

    var legend = svg.selectAll(".legend")
        .data(legendColors)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            var height = legendHeight + legendSpacing;
            var offset = height * legendColors.length / 2;
            var horz = width - 400;
            var vert = i * height + 25;
            return "translate(" + horz + "," + vert + ")";
        });

    legend.append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", function (d) {
            return d;
        });

    function displayLegend() {
        legend.selectAll("text").remove();

        legend.append("text")
            .attr("x", legendWidth + legendSpacing)
            .attr("y", legendHeight - legendSpacing)
            .style("font-family", "Heiti SC")
            .style("font-size", "12px")
            .text(function (d, i) {
                switch (selectedAttribute) {
                    case 'Employment':
                        return getLegendText(eMap[selectedYear], i);
                    case 'Unemployment':
                        return getLegendText(uEMap[selectedYear], i);
                    case 'Unemployment Rate':
                        return getLegendText(uRateMap[selectedYear], i);
                    case 'Average Weekly Wages':
                        return getLegendText(avgMap[selectedYear], i);
                }
            });

        function getLegendText(data, i) {
            delete data["California"];
            var values = Object.values(data);
            var minValue = Math.min(...values);
            var maxValue = Math.max(...values);
            var base = Math.pow(maxValue / minValue, 1 / (6));

            return minValue * Math.pow(base, i);
        }
    }

});
