var didSelectOnce = false;

var yearSelect = document.getElementById("cmYearSelect");

var startYear = 2008;
var endYear = 2021;

for (var year = startYear; year <= endYear; year++) {
    var option = new Option(year, year);
    yearSelect.appendChild(option);
}

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

            var county = d.properties.name + " County";

            var value;

            switch (selectedAttribute) {
                case 'Employment':
                    value = eMap[selectedYear][county];
                    break;
                case 'Unemployment':
                    value = uEMap[selectedYear][county];
                    break;
                case 'Unemployment Rate':
                    value = uRateMap[selectedYear][county];
                    break;
                case 'Average Weekly Wages':
                    value = avgMap[selectedYear][county];
                    break;
                case 'Establishments':
                    value = estMap[selectedYear][county];
                    break;
                case 'Labor Force':
                    value = lMap[selectedYear][county];
                    break;
                case 'Expenditures Per Capita':
                    value = excapMap[selectedYear][county];
                    break;
                case 'Average Monthly Employment':
                    value = ameMap[selectedYear][county];
                    break;
                case 'Total Wages (All Workers)':
                    value = twMap[selectedYear][county];
                    break;
                case 'Estimated Population':
                    value = epMap[selectedYear][county];
                    break;
                case 'Total Expenditures':
                    value = texpMap[selectedYear][county];
                    break;

            }

            div.transition()
                .duration(200)
                .style("opacity", .9);

            if(didSelectOnce) {
                div.html("<div class='county'>" + county + "</div><div>" + selectedAttribute + ": " + value + "</div>")
                    .style("left", (x + 215) + "px")
                    .style("top", (y + 245) + "px");
            } else {
                div.html("<strong>" + county + "</strong>")
                .style("left", (x + 215) + "px")
                .style("top", (y + 245) + "px");
            }

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
    var yearSelect = document.getElementById('cmYearSelect');
    yearSelect.addEventListener('change', function() {
        didSelectOnce = true;
        selectedYear = this.value;
        drawHeatmap(selectedYear);
        switch (selectedAttribute) {
            case 'Employment':
                    setLegendText(eMap[selectedYear]);
                    updateMapColors(eMap[selectedYear]);
                    break;
            case 'Unemployment':
                    setLegendText(uEMap[selectedYear]);
                    updateMapColors(uEMap[selectedYear]);
                    break;
            case 'Unemployment Rate':
                    setLegendText(uRateMap[selectedYear]);
                    updateMapColors(uRateMap[selectedYear]);
                    break;
            case 'Average Weekly Wages':
                    setLegendText(avgMap[selectedYear]);
                    updateMapColors(avgMap[selectedYear]);
                    break;
            case 'Establishments':
                    setLegendText(estMap[selectedYear]);
                    updateMapColors(estMap[selectedYear]);
                    break;
            case 'Labor Force':
                    setLegendText(lMap[selectedYear]);
                    updateMapColors(lMap[selectedYear]);
                    break;
            case 'Expenditures Per Capita':
                    setLegendText(excapMap[selectedYear]);
                    updateMapColors(excapMap[selectedYear]);
                    break;
            case 'Average Monthly Employment':
                    setLegendText(ameMap[selectedYear]);
                    updateMapColors(ameMap[selectedYear]);
                    break;
            case 'Total Wages (All Workers)':
                    setLegendText(twMap[selectedYear]);
                    updateMapColors(twMap[selectedYear]);
                    break;
            case 'Estimated Population':
                    setLegendText(epMap[selectedYear]);
                    updateMapColors(epMap[selectedYear]);
                    break;
            case 'Total Expenditures':
                    setLegendText(texpMap[selectedYear]);
                    updateMapColors(texpMap[selectedYear]);
                    break;
        }
    });

    var attributeSelect = document.getElementById('cmAttributeSelect');
        attributeSelect.addEventListener('change', function() {
            didSelectOnce = true;
            selectedAttribute = this.value;
            drawTimeSeriesChart(selectedCounty,selectedAttribute);
            switch (selectedAttribute) {
                case 'Employment':
                    setLegendText(eMap[selectedYear]);
                    updateMapColors(eMap[selectedYear]);
                    break;
                case 'Unemployment':
                    setLegendText(uEMap[selectedYear]);
                    updateMapColors(uEMap[selectedYear]);
                    break;
                case 'Unemployment Rate':
                    setLegendText(uRateMap[selectedYear]);
                    updateMapColors(uRateMap[selectedYear]);
                    break;
                case 'Average Weekly Wages':
                    setLegendText(avgMap[selectedYear]);
                    updateMapColors(avgMap[selectedYear]);
                    break;
                case 'Establishments':
                    setLegendText(estMap[selectedYear]);
                    updateMapColors(estMap[selectedYear]);
                    break;
                case 'Labor Force':
                    setLegendText(lMap[selectedYear]);
                    updateMapColors(lMap[selectedYear]);
                    break;
                case 'Expenditures Per Capita':
                    setLegendText(excapMap[selectedYear]);
                    updateMapColors(excapMap[selectedYear]);
                    break;
                case 'Average Monthly Employment':
                    setLegendText(ameMap[selectedYear]);
                    updateMapColors(ameMap[selectedYear]);
                    break;
                case 'Total Wages (All Workers)':
                    setLegendText(twMap[selectedYear]);
                    updateMapColors(twMap[selectedYear]);
                    break;
                case 'Estimated Population':
                    setLegendText(epMap[selectedYear]);
                    updateMapColors(epMap[selectedYear]);
                    break;
                case 'Total Expenditures':
                    setLegendText(texpMap[selectedYear]);
                    updateMapColors(texpMap[selectedYear]);
                    break;

            }
    });

    var countySelect = document.getElementById('tcCountySelect');
        countySelect.addEventListener('change', function() {
            selectedCounty = this.value;
            drawTimeSeriesChart(selectedCounty,selectedAttribute);
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
                console.log("Normalized Value");
                console.log(normalizedValue);
                if (normalizedValue <= 0.14) {
                    return "LightPink";
                } else if (normalizedValue <= 0.28) {
                    return "LightSalmon";
                } else if (normalizedValue <= 0.42) {
                    return "LightCoral";
                } else if (normalizedValue <= 0.56) {
                    return "IndianRed";
                } else if (normalizedValue <= 0.70) {
                    return "Crimson";
                } else if (normalizedValue <= 0.84) {
                    return "FireBrick";
                } else {
                    return "DarkRed";
                }
            });
    }

});

function setLegendText(data) {
    for (var i = 1; i <= 7; i++) {
        // Get the reference to the element
        var legendLabelElement = document.getElementById("ll" + (i));
        // Set the text content
        legendLabelElement.textContent = parseFloat(getLegendText(data,i)).toFixed(2);
    }
}

function getLegendText(data, i) {
    delete data["California"];
    var values = Object.values(data);
    var minValue = Math.min(...values);
    var maxValue = Math.max(...values);
    var base = Math.pow(maxValue / minValue, 1 / (6));
    return minValue * Math.pow(base, i-1);
}
