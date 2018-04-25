

var margin = {top: 30, right: 30, bottom: 60, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#main_graph").append("svg")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

start_month = 0
start_year = 0
end_month = 3000
end_year = 3000

function update_main_graph(start_month, start_year, end_month, end_year) {
	// console.log(start_month)
	// console.log(start_year)
	// console.log(end_month)
	// console.log(end_year)
	d3.tsv("data/growths.tsv", function(error, data){

		// filter year
		var data = data.filter(function(d) {
			// console.log(d.year)
			// console.log(d.month)
			// console.log(start_month)
			// console.log(start_year)
			// console.log(end_month)
			// console.log(end_year)
			if (d.year > end_year || d.year < start_year) {
				return 0;
			}
			if (d.year == end_year && d.month > end_month) {
				return 0;
			} 
			if (d.year == start_year && d.month < start_month) {
				return 0;
			} 

			return 1;
		});
		// Get every column value
		var elements = Object.keys(data[0])
			.filter(function(d){
				return ((d != "month") & (d != "year"));
			});
		var y = d3.scale.linear()
				.domain([0, d3.max(data, function(d){
					return +d.subscriber_gain
				})])
				.range([height, 0]);
		var x = d3.scale.ordinal()
				.domain(data.map(function(d){ return d.month + " " + d.year;}))
				.rangeBands([0, width]);

		var xAxis = d3.svg.axis()
			.scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
		    .orient("left");

		svg.append("g")
	    	.attr("class", "x axis")
	    	.attr("transform", "translate(0," + height + ")")
	    	.call(xAxis)
	    	.selectAll("text")
	    	.style("font-size", "8px")
	      	.style("text-anchor", "end")
	      	.attr("dx", "-.8em")
	      	.attr("dy", "-.55em")
	      	.attr("transform", "rotate(-90)" );

	 	svg.append("g")
	    	.attr("class", "y axis")
	    	.call(yAxis);
		svg.selectAll("rectangle")
			.data(data)
			.enter()
			.append("rect")
			.attr("class","rectangle")
			.attr("width", width/data.length - 2)
			.attr("height", function(d){
				return height - y(+d.subscriber_gain);
			})
			.attr("x", function(d, i){
				return (width / data.length) * i + 4;
			})
			.attr("y", function(d){
				return y(+d.subscriber_gain);
			})
			.append("title")
			.text(function(d){
				return d.month;
			});

		function update_main_graph() {
			return 1
		}
	});
}
update_main_graph(start_month, start_year, end_month, end_year);

d3.selectAll(".filter").on("change", function(d){
	svg.selectAll("*").remove();
	console.log('time filter called!');

	var e = document.getElementById("start_month");
	var start_month = e.selectedIndex + 1;
	var e = document.getElementById("end_month");
	var end_month = e.selectedIndex + 1;
	var e = document.getElementById("start_year");
	var start_year = e.options[e.selectedIndex].value;
	var e = document.getElementById("end_year");
	var end_year = e.options[e.selectedIndex].value;


	update_main_graph(start_month, start_year, end_month, end_year);
});