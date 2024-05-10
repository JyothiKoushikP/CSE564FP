let newData = data.map(entry => ({
    "Area Name": entry["Area Name"],
    "value": entry["Unemployment Rate"]
  }));

  updateRadialPlot(newData);

document.getElementById("cmAttributeSelect").addEventListener("change", function() {
    attributeX = this.value;
    let newData = data.map(entry => ({
      "Area Name": entry["Area Name"],
      "value": entry[attributeX]
    }));

    updateRadialPlot(newData);
  });
  function updateRadialPlot(newData) {
    d3.select("#radial-plot svg").remove();

const margin = {top: 20, right: 100, bottom: 60, left: 80},
      width = 460 - margin.left - margin.right,
      height = 460 - margin.top - margin.bottom,
      innerRadius = 90,
      outerRadius = Math.min(width, height) / 2;

const svg = d3.select("#radial-plot")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${width/2+margin.left}, ${height/2+margin.top})`);

const x = d3.scaleBand()
  .range([0, 2 * Math.PI])
  .align(0)
  .domain(newData.map(d => d["Area Name"]));

const y = d3.scaleRadial()
  .range([innerRadius, outerRadius])
  .domain([d3.min(newData, d => d.value), d3.max(newData, d => d.value)]);

svg.append("g")
  .selectAll("path")
  .data(newData)
  .join("path")
  .attr("fill", "#69b3a2")
  .attr("d", d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(d => y(d.value))
    .startAngle(d => x(d["Area Name"]))
    .endAngle(d => x(d["Area Name"]) + x.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius)
  );

  function getUniqueAreaNames(newData) {
    const areaNames = new Set();
    newData.forEach(d => areaNames.add(d["Area Name"]));
    areaNames.delete("California");
    return Array.from(areaNames);
  }
  const uniqueAreaNames = getUniqueAreaNames(newData);

svg.append("g")
    .selectAll("g")
    .data(uniqueAreaNames)
    .enter()
    .append("g")
    .attr("text-anchor", "middle") // Center-align text
    .attr("transform", d => {
        const angle = (x(d) + x.bandwidth() / 2) * 180 / Math.PI - 90;
        const employment = newData.find(entry => entry["Area Name"] === d)["value"];
        console.log()
        const radius = y(employment) + 47.5; // Adjust radius based on value value
        return `rotate(${angle}) translate(${radius},0) rotate(${angle > 90 ? -180 : 0})`;
    })
    .append("text")
    .text(d => (d.split(" County"))[0])
    .style("font-size", "11px") // Adjust font size as needed
    .attr("alignment-baseline", "middle")
    .attr("transform", d => {
        const angle = (x(d) + x.bandwidth() / 2) * 180 / Math.PI - 90;
        return angle > 90 ? "rotate(180)" : null; // Rotate text if needed
    });

  // Define color scale
const color = d3.scaleOrdinal()
.domain(newData.map(d => d["Area Name"]))
.range(d3.schemeCategory10);

svg.append("text")
    .attr("x", width / 2 - 120)
    .attr("y", -180)
    .attr("text-anchor", "middle")
    .text("Radial Chart " + "(" + attributeX + ")")
    .style("color", "#790a31") // Apply the color
    .style("font-family", "'Heiti SC', monospace")
    .style("text-align", "center")
    .style("font-size", "14px")
    .style("margin-top", "-10px")
    .style("margin-bottom", "20px")
    .style("text-shadow", "1px 1px 2px rgba(0, 0, 0, 0.3)")
    .style("letter-spacing", "1px")
    .style("font-weight", "900")
    .style("display", "inline");

svg.append("g")
.selectAll("path")
.data(newData)
.join("path")
.attr("fill", d => color(d["Area Name"]))
.attr("d", d3.arc()
  .innerRadius(innerRadius)
  .outerRadius(d => y(d.value))
  .startAngle(d => x(d["Area Name"]))
  .endAngle(d => x(d["Area Name"]) + x.bandwidth())
  .padAngle(0.01)
  .padRadius(innerRadius)
).on("mouseover", function(event, d) {
  d3.select(this).attr("fill", "orange"); // Change color on hover
  // Show tooltip with additional information
  tooltip.transition()
    .duration(200)
    .style("opacity", .9);
  tooltip.html(`<strong>${d["Area Name"]}</strong><br>${attributeX}: ${d.value}`)
    .style("left", (event.pageX) + "px")
    .style("top", (event.pageY - 28) + "px");
}).on("mouseout", function() {
  d3.select(this).attr("fill", d => color(d["Area Name"])); // Revert color on mouseout
  // Hide tooltip
  tooltip.transition()
    .duration(500)
    .style("opacity", 0);
}).on("click", function(event, d) {
    selectedCounty = d['Area Name'];
    drawTimeSeriesChart(selectedCounty,attributeX);
});

// Define tooltip
const tooltip = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

// Add animation to transitions
svg.selectAll("path")
.transition()
.duration(1000)
.attrTween("d", function(d) {
  const i = d3.interpolate(0, y(d.value));
  return function(t) {
    d.outerRadius = i(t);
    return d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(d.outerRadius)
      .startAngle(x(d["Area Name"]))
      .endAngle(x(d["Area Name"]) + x.bandwidth())
      .padAngle(0.01)
      .padRadius(innerRadius)(d);
  };
});
  }
