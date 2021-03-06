
console.log("hai :)")

//define chart margins
let svg_line = d3.select("#svg_line"),
	margin_line = {top: 0, right: 0, bottom: 0, left: 0},
	width_line = svg_line.attr("width") - margin_line.left - margin_line.right,
	height_line = svg_line.attr("height") - margin_line.top - margin_line.bottom,
	g_line = svg_line.append("g").attr("transform", "translate(" + margin.left + "," +margin.top + ")");

//define time format
let parseYear = d3.time.format("%Y");

//define scales
let x_line = d3.scaleTime().range([0, width]),
	y_line = d3.scaleLinear().range([height, 0]),
	//color scale
	z_line = d3.scaleOrdinal(d3.schemeCategory20);

//define line generator
let line = d3.line()
	.curve(d3.curveBasis)
	.x(function(d) { return x(d.year); })
	.y(function(d) { return y(d.subscriptionCount); });

//load data
d3.csv("phoneSubscriptionData.csv", type, function(error, data) {
	if(error) throw error;

	//parse data
	let countries = data.columns.slice(1).map(function(id) {
		return {
			id: id,
			values: data.map(function(d) {
				return {year: d.year, subscriptionCount: d[id]};
			})
		};
	});

	//define x axis
	x.domain(d3.extent(data, function(d) { return d.year; }));

	//define y axis
	y.domain([
		d3.min(countries, function(c) { return d3.min(c.values, function (d) { return d.subscriptionCount; }); }),
		d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.subscriptionCount; }); })
	]);

	//define color scale
	z.domain(countries.map(function(c) { return c.id; }));

	//append x axis
	g.append("g")
		.attr("class", "axis axis-x")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x));

	//append y axis
	g.append("g")
		.attr("class", "axis axis-y")
		.call(d3.axisLeft(y))
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -50)
		.attr("x", -125)
		.attr("dy", "0.9em")
		.attr("fill", "#000")
		.text("Subscriptions per 100 Inhabitants");

	//append country data to svg
	let country = g.selectAll(".country")
		.data(countries)
		.enter()
		.append("g")
		.attr("class", "country");

	//append country path to svg
	country.append("path")
		.attr("class", "line")
  			.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d) { return z(d.id); })
		.style("stroke-linecap", "round");

	//append country labels to svg
	country.append("text")
		.datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
		.attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.subscriptionCount) + ")"; })
		.attr("x", 3)
		.attr("dy", "0.35em")
		.style("font", "11px sans-serif")
		.text(function(d) { return d.id; });
	
});

//bind with multiseries data
function type(d, _, columns) {
	d.year = parseYear(d.year);
	//iterate through each column
	for(var i = 1, n = columns.length, c; i < n; ++i)
		//bind column data to year
		d[c = columns[i]] = +d[c];
		return d;
}

//define chart title
let title = svg.append("g")
	.attr("class", "title");
title.append("text")
	.attr("x", (width/2.25))
	.attr("y", 65)
	.attr("text-anchor", "middle")
	.style("font", "20px sans-serif")
	.text("Mobile Phone Subscriptions in North Africa");

//define the data source
let source = svg.append("g")
	.attr("class", "source");
source.append("text")
	.attr("x", 0)
	.attr("y", 500)
	.attr("text-anchor", "left")
	.style("font", "12px monospace")
	.text("Source: UN Data, Millennium Development Goals Database")