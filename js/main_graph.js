

var margin = {top: 30, right: 40, bottom: 130, left: 60},
    width = 1050 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("#main_graph")
	.append("svg")
	.attr("width", width + margin.left + margin.right	)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "main_graph")
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("fill", "#808080")



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
		var y = d3.scale.linear()
				.domain([0, d3.max(data, function(d){
					return +d.subscriber_gain*1.25
				})])
				.range([height, 0]);
		var x = d3.scale.ordinal()
				.domain(data.map(function(d){ return d.month + " " + d.year.substring(2,4);}))
				.rangeBands([0, width]);

		// // filter year
		// var data = data.filter(function(d) {
		// 	// console.log(d.year)
		// 	// console.log(d.month)
		// 	// console.log(start_month)
		// 	// console.log(start_year)
		// 	// console.log(end_month)
		// 	// console.log(end_year)
		// 	if (d.year > end_year || d.year < start_year) {
		// 		return 0;
		// 	}
		// 	if (d.year == end_year && d.month > end_month) {
		// 		return 0;
		// 	} 
		// 	if (d.year == start_year && d.month < start_month) {
		// 		return 0;
		// 	} 

		// 	return 1;
		// });

		// Get every column value
		var elements = Object.keys(data[0])
			.filter(function(d){
				return ((d != "month") & (d != "year"));
			});
		var y = d3.scale.linear()
				.domain([0, d3.max(data, function(d){
					return +d.subscriber_gain*1.25
				})])
				.range([height, 0]);
		var x = d3.scale.ordinal()
				.domain(data.map(function(d){ return d.month + " " + d.year.substring(2,4);}))
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
	    	.style("font-size", "9px")
	      	.style("text-anchor", "end")
	      	.attr("dx", "+0.9em")
	      	.attr("dy", "+1em")
	      	.attr("transform" );

	 	svg.append("g")
	    	.attr("class", "y axis")
	    	.call(yAxis);

		svg.selectAll("rectangle")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", function(d){
				if (d.year == 2015) {
					return "rectangle y2015";
				};
				if (d.year == 2016) {
					return "rectangle y2016";
				};
				if (d.year == 2017) {
					return "rectangle y2017";
				};
				return "rectangle"
			})

			.attr("width", width/data.length - 4)
			.attr("height", function(d){
				length = d.subscriber_gain
				if (d.year > end_year || d.year < start_year) {
					length = 0;
				}
				if (d.year == end_year && d.month > end_month) {
					length = 0;
				} 
				if (d.year == start_year && d.month < start_month) {
					length = 0;
				} 
				return height - y(+length);
			})

			.attr("x", function(d, i){
				return (width / data.length) * i + 4;
			})
			.attr("y", function(d){
				length = d.subscriber_gain
				return y(+length);
			})
	        .on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
			.append("title")
			.text(function(d){
				return "THIS IS THE HOVER";
			});
	});
}

function handleMouseOver(d, i) {  // Add interactivity
    // Use D3 to select element, change color and size
    // Specify where to put label of text
	coordinates = d3.mouse(this);
    svg.append("text")
    .attr({
		id: "hover_info",  // Create an id for text so we can select it later for removing on mouseout
        x: function() { return coordinates[0]+10; },
        y: function() { return coordinates[1]-10; }
    })
    .text(function() {
      return "THIS IS THE COOL HOVER";  // Value of the text
    });
  }

function handleMouseOut(d, i) {
    // Use D3 to select element, change color back to normal
    // Select text by id and then remove
    d3.select("#hover_info").remove();  // Remove text location
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