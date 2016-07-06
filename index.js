d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(err, data) {
    var margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width = 895 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;

    var y = d3.scaleLinear().range([height, 0]);
    var x = d3.scaleTime().domain([new Date(data.data[0][0]), new Date(data.data[data.data.length - 1][0])]).range([0, width]);

    var chart = d3.select("#chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    y.domain([0, data.data[data.data.length - 1][1]]);

    var barWidth = width / data.data.length;

    var bar = chart.selectAll("g")
        .data(data.data)
        .enter().append("g")
        .attr("transform", function(d, i) {
            return "translate(" + i * barWidth + ",0)";
        });

    var tooltip = d3.select("#tooltip")
        .style("visibility", "hidden");

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    bar.append("rect")
        .attr("y", function(d) {
            return y(d[1]);
        })
        .attr("height", function(d) {
            return height - y(d[1]); })
        .attr("width", barWidth)
        .on("mouseover", function(d) {
            tooltip.select("#gdp span").text("$" + d[1]);
            tooltip.select("span#month").text(months[d[0].split("-")[1] - 1]);
            tooltip.select("span#year").text(d[0].split("-")[0]);
            tooltip.style("visibility", "visible");
            return;
        })
        .on("mousemove", function() {
            return tooltip.style("top", (d3.event.pageY - 10) + "px")
                .style("left", (d3.event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            return tooltip.style("visibility", "hidden");
        });

    var xAxis = d3.axisBottom(x).ticks(d3.timeYear.every(5));

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0, " + height + ")")
        .call(xAxis);

    var yAxis = d3.axisLeft(y);

    chart.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    d3.select("div#unit p").text(data.description);
});
