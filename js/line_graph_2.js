
var margin_line = {top: 10, right: 20, bottom: 20, left: 40},
	 width_line = 930 - margin_line.left - margin_line.right,
	 height_line = 75 - margin_line.top - margin_line.bottom;

var parseDate = d3.time.format("%Y-%m").parse;

var formatting = d3.time.format("%m %y");

var bisectDate = d3.bisector(function(d) { return d.date; }).left,
	 formatValue = d3.format(","),
	 dateFormatter = d3.time.format("%m/%d/%y");


var x_line = d3.scale.ordinal()
			.rangeBands([0, width_line]);

var y_line  = d3.scale.linear()
	 .range([height_line , 0]);

var color = d3.scale.category10();

var xAxis_line = d3.svg.axis()
	 .scale(x_line)
	 .orient("bottom")
	 .tickFormat(function(d) {
	 	// console.log(d)
	 	if (d.getMonth() + 1 == 1) {
	 		return d.getFullYear();
	 	}
 		if ((d.getMonth() + 1 == 3) && d.getFullYear() == 2015) {
 			return d.getFullYear();
 		}
	 	return d.getMonth() + 1;
	 });

// console.log(xAxis_line)

function formatYLabel(num) {
	if (num >= 1000000) {
		return Math.round(d/1000000) + 'M'
	} 
	if (num >= 1000) {
		return Math.round(d/1000) + 'K'
	}  

	return num
}

var yAxis_line = d3.svg.axis()
	 .scale(y_line)
	 .orient("left")
	 .tickFormat(function(num) {
	 		if (num >= 1000000) {
				return Math.round(num/1000000) + 'M'
			} 
			if (num >= 1000) {
				return Math.round(num/1000) + 'K'
			}  
			return num
		})
	 .ticks(3);

var line = d3.svg.line()
	 .interpolate("basis")
	 .x(function(d) { return x_line(d.date); })
	 .y(function(d) { return y_line(d.likes); });

var svg_line = d3.select("#svg_line")
	 .attr("width", width_line + margin_line.left + margin_line.right)
	 .attr("height", height_line + margin_line.top + margin_line.bottom)
	 .append("g")
	 .attr("transform", "translate(" + margin_line.left + "," + margin_line.top + ")");

start_month = 0
start_year = 0
end_month = 3000
end_year = 3000

function update_line_graph(start_month, start_year, end_month, end_year) {
	d3.csv("like_dislike.csv", function(error, data) {

		var data = data.filter(function(d) {
			// console.log(d.year)
			// console.log(d.month)
			// console.log(start_month)
			// console.log(start_year)
			// console.log(end_month)
			// console.log(end_year)
			d_year = parseInt(d.date.substring(0,4))
			d_month = parseInt(d.date.substring(5,8))
			start_year = parseInt(start_year)
			start_month = parseInt(start_month)
			end_year = parseInt(end_year)
			end_month = parseInt(end_month)
			// console.log('XXX')
			if (d_year > end_year || d_year < start_year) {
				// console.log('AAA ' + d_year + ' ' + d_month)
				console.log('AAA ' + end_year + ' ' + start_year)
				return 0;
			}
			if (d_year == end_year && d_month > end_month) {
				// console.log('BBB ' + d_year + ' ' + d_month)
				return 0;
			} 
			if (d_year == start_year && d_month < start_month) {
				// console.log('CCC ' + d_year + ' ' + d_month)
				return 0;
			} 
			// console.log('DDD ' + d_year + ' ' + d_month)

			return 1;
		});

		console.log(data)

	  // console.log(data)
	  if (error) throw error;

	  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

	  data.forEach(function(d) {
		 d.date = parseDate(d.date);
	  });

	  var aspect = color.domain().map(function(name) {
		 return {
			name: name,
			values: data.map(function(d) {
			  return {date: d.date, likes: +d[name]};
			})
		 };
	  });

		x_line.domain(data.map(function(d){ return d.date}))

	  y_line.domain([
		 d3.min(aspect, function(c) { return d3.min(c.values, function(v) { return v.likes; }); }),
		 d3.max(aspect, function(c) { return d3.max(c.values, function(v) { return v.likes; }); })
	  ]);

	  svg_line.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height_line + ")")
			.call(xAxis_line);

	  svg_line.append("g")
			.attr("class", "y axis")
			.call(yAxis_line)
		 .append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Amount");

	  var aspect = svg_line.selectAll(".city")
			.data(aspect)
			.enter().append("g")
			.attr("class", "like");

	  aspect.append("path")
			.attr("class", "line")
			.attr("d", function(d) { return line(d.values); })
			.style("stroke", function(d) { return color(d.name); });

			  // console.log("A")
	  // Text part
	  aspect.append("text")
			.datum(function(d) { //console.log(d);
				return {name: d.name, value: d.values[d.values.length - 1]}; })
			.attr("transform", function(d) { return "translate(" + x_line(d.value.date) + "," + y_line(d.value.likes) + ")"; })
			.attr("x", 3)
			.attr("dy", ".35em")
			.text(function(d) { return d.name; });

	  // // 

	  // var focus = svg_line.append("g")
			// 		.attr("class", "focus")
			// 		.style("display", "none");

			//   focus.append("circle")
			// 		.attr("r", 5);

			//   focus.append("rect")
			// 		.attr("class", "tooltip")
			// 		.attr("width", 100)
			// 		.attr("height", 50)
			// 		.attr("x", 10)
			// 		.attr("y", -22)
			// 		.attr("rx", 4)
			// 		.attr("ry", 4);

			//   focus.append("text")
			// 		.attr("class", "tooltip-date")
			// 		.attr("x", 18)
			// 		.attr("y", -2);

			//   focus.append("text")
			// 		.attr("x", 18)
			// 		.attr("y", 18)
			// 		.text("Likes:");

			//   focus.append("text")
			// 		.attr("class", "tooltip-likes")
			// 		.attr("x", 60)
			// 		.attr("y", 18);

			//   svg_line.append("rect")
			// 		.attr("class", "overlay")
			// 		.attr("width", width_line)
			// 		.attr("height", height_line)
			// 		.on("mouseover", function() { focus.style("display", null); })
			// 		.on("mouseout", function() { focus.style("display", "none"); })
			// 		.on("mousemove", mousemove);

			//   function mousemove() {
			//   		x_line.invert(1)
			// 		var x0 = x_line.invert(d3.mouse(this)[0]),
			// 			 i = bisectDate(data, x0, 1),
			// 			 d0 = data[i - 1],
			// 			 d1 = data[i],
			// 			 d = x0 - d0.date > d1.date - x0 ? d1 : d0;
			// 		console.log(d)
			// 		focus.attr("transform", "translate(" + x_line(d.date) + "," + x_line(d.like) + ")");
			// 		focus.select(".tooltip-date").text(dateFormatter(d.date));
			// 		focus.select(".tooltip-likes").text(formatValue(d.like));
			//   }
	});
}

update_line_graph(start_month, start_year, end_month, end_year);

d3.selectAll(".filter").on("click", function(d){
	svg.selectAll("*").remove();

	svg_line.selectAll("*").remove();
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
	update_line_graph(start_month, start_year, end_month, end_year);

});