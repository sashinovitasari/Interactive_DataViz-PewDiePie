

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 930 - margin.left - margin.right,
    height = 360 - margin.top - margin.bottom;

var svg = d3.select("#main_graph").append("svg")
	.attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "main_graph_svg")
	.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

start_month = 0
start_year = 0
end_month = 3000
end_year = 3000
var x;
var y;

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
		y = d3.scale.linear()
				.domain([0, d3.max(data, function(d){
					return +d.subscriber_gain
				}) * 1.1])
				.range([height, 0]);

		x = d3.scale.ordinal()
				.domain(data.map(function(d){ return d.month + " " + d.year.substring(2,4);}))
				.rangeBands([0, width]);

		var xAxis = d3.svg.axis()
			.scale(x)
		    .orient("bottom")
		    .tickFormat(function(d) {
		    	if (d == '3 15') {
		    		return '2015'
		    	} 
		    	if (d == '1 16') {
		    		return '2016'
		    	} 
		    	if (d == '1 17') {
		    		return '2017'
		    	} 
		    	return d.substring(0,2)

			});		    

		var yAxis = d3.svg.axis()
			.scale(y)
		    .orient("left")
		    .ticks(3)
		    .tickFormat(function(num) {
	 			if (num >= 1000000) {
					return Math.round(num/1000000) + 'M'
				} 
				if (num >= 1000) {
					return Math.round(num/1000) + 'K'
				}  
				return num
			});

		svg.append("g")
	    	.attr("class", "x axis")
	    	.attr("transform", "translate(0," + height + ")")
	    	.call(xAxis)
	    	.selectAll("text")
	    	.style("font-size", "10px")
	      	.style("text-anchor", "end")
	      	.attr("dx", function(d) {
		    	if (d == '3 15') {
		      		return "+1em"
		    	} 
		    	if (d == '1 16') {
		      		return "+1em"
		    	} 
		    	if (d == '1 17') {
	    	  		return "+1.1em"
		    	} 
		    	if ((d.substring(0,2) == '10') || (d.substring(0,2) == '11') || (d.substring(0,2) == '12')) {
		    		return "0.4em"
		    	}
	      		return "+0.2em"
	      	})
	      	.attr("dy", "+1.05em")
	      	.attr("transform");

	 	svg.append("g")
	    	.attr("class", "y axis")
	    	.call(yAxis);

		svg.selectAll("rectangle")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", function(d){
				if (d.year == '2015') {
					return 'rectangle y2015'
				}
				if (d.year == '2016') {
					return 'rectangle y2016'
				}
				if (d.year == '2017') {
					return 'rectangle y2017'
				}
				return "rectangle"
			})
			.attr("width", width/data.length - 4)
			.attr("height", function(d){
				return height - y(+d.subscriber_gain);
			})
			.attr("x", function(d, i){
				return (width / data.length) * i + 4;
			})
			.attr("y", function(d){
				return y(+d.subscriber_gain);
			})
			.on("mouseover", handleMouseOver)
            .on("mouseout", handleMouseOut)
			.append("title")
			.text(function(d){
				return d.month;
			})

		function update_main_graph() {
			return 1
		}
	});
}
update_main_graph(start_month, start_year, end_month, end_year);

d3.selectAll(".filter").on("click", function(d){
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

// Create Event Handlers for mouse

function handleMouseOver(d) {  // Add interactivity
	// while (d3.select(".detail_text_title").empty() != true) {
	//     d3.select(".detail_text_title").remove();  // Remove text location
	// }
	// while (d3.select(".detail_text_sentence").empty() != true) {
	//     d3.select(".detail_text_sentence").remove();  // Remove text location
	// }
	while (d3.select(".detail_text_no_event").empty() != true) {
	    d3.select(".detail_text_no_event").remove();  // Remove text location
	}
	while (d3.select(".detail_div").empty() != true) {
	    d3.select(".detail_div").remove();  // Remove text location
	}

	// DETAIL PART
    var match_event = []
    x = d3.mouse(this)[0] + 20
    // y_hover = d3.mouse(this)[1] - 
	y_hover = y(d.subscriber_gain) - 50
	d3.tsv('data/event.txt', function(data) {
		for (id in data) {
			// console.log(data[id])
			if (d.year == data[id].year) {
				if (d.month == data[id].month) {
					match_event.push(data[id])
					// console.log(match_event)
				}
			}
		}

		// selecting
	    detail_text_div = d3.select(".hover_info_div").append("div").attr("class", "detail_div")

	    console.log("AAA" )

	    detail_text_div.append("p").attr("class", "month_year_name").text(monthNames[parseInt(d.month)-1] + ' ' + d.year)

   		detail_text_div.append("ol")
   		id_show = 1
	   	for (id_event in match_event) {
	   		detail_text_div.append("b").attr("class", "detail_text_title").text(id_show+". "+match_event[id_event].ttitle)
	   		detail_text_div.append("div").attr("class", "detail_text_sentence").text(match_event[id_event].detail)
	   		detail_text_div.append("br")
	   		id_show+=1
	   	}
	   	if (d3.select(".detail_text_sentence").empty()) {
	   		detail_text_div.append("p").attr("class", "detail_text_no_event").text("No special event in this month")
	   	}
	})

	// BOX PART
    var match_event = []
    x = d3.mouse(this)[0] + 20
    // y_hover = d3.mouse(this)[1] - 
	y_hover = y(d.subscriber_gain) - 50

    var text = svg.append("text")
    .attr("id", "hover_bar")
    .attr("fill", "white")
    .attr("font-size", "15")
    .attr("x", function(d) {
    	return x;
    }).attr("y", function(d) {
    	return y_hover; // - count_line*20;
    })

    text.append("tspan").attr("x", x+5).attr("dy","1.2em").text("Month/Year : " + d.month + '-' + d.year)
    text.append("tspan").attr("x", x+5).attr("dy","1.2em").text("Subcriber gain  : " + d.subscriber_gain)
    text.append("tspan").attr("x", x+5).attr("dy","1.2em").text("Subcriber total : " + d.subscriber_total)

	var bbox = text.node().getBBox();

	var rect = svg.append("rect")
	    .attr("id", "hover_bar_box")
	    .attr("x", bbox.x - 5)
	    .attr("y", bbox.y - 5)
	    .attr("width", bbox.width + 10)
	    .attr("height", bbox.height + 10)
	    .style("fill", "#000")
	    .style("fill-opacity", "0.2")
	    .style("stroke", "#fff")
	    .style("stroke-width", "1.5px");
  }



function handleMouseOut(d) {
	while (d3.select("#hover_bar").empty() != true) {
	    d3.select("#hover_bar").remove();  // Remove text location
	}
	while (d3.select("#hover_bar_box").empty() != true) {
	    d3.select("#hover_bar_box").remove();  // Remove text location
	}

}