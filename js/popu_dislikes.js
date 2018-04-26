

var margindislike = {top:20 , right: 20, bottom: 20, left: 60},
    widthdislike = 300 - margindislike.left - margindislike.right,
    heightdislike = 130 - margindislike.top - margindislike.bottom;

var svg_dislike = d3.select("#popu_dislikes").append("svg")
	.attr("width", widthdislike + margindislike.left + margindislike.right)
    .attr("height", heightdislike + margindislike.top + margindislike.bottom)
	.append("g")
    .attr("transform", "translate(" + margindislike.left + "," + margindislike.top + ")");

start_month = 0
start_year = 0
end_month = 3000
end_year = 3000
genres = ["game","comedy","blog","ent"]

function check_validity_dislike(sm, sy, em, ey,genre,data){
	if (data.category == genre){
		if ((data.year<=ey) && (data.year>=sy)){
			if ((data.month<=em) && (data.month>=sm)) return 1
			if ((data.month<sm) && (data.year<=ey)) return 1
			if ((data.month>sm) && (data.year>=sy)) return 1
			return 0
		}
	}
	return 0
}

function count_dislikes(start_month, start_year, end_month, end_year,genre,data){
	//count value based on genre
	if (genre=="game") genre = "Game"
	else if (genre=="comedy") genre = "Komedi"
	else if (genre=="blog") genre = "Blog &amp; Orang"
	else if (genre=="ent") genre = "Hiburan"
	val = 0
	count = 0
	for (var i=0;i<data.length;i++){
		if (check_validity_dislike(start_month, start_year, end_month, end_year,genre,data[i])){
			val+= parseInt(data[i].dislike)
			count+=1
		}		
	}

	console.log(val)
	return Math.round(val/count)
}

function update_dislike_graph(start_month, start_year, end_month, end_year,genre) {
	d3.csv("data/popularity.csv", function(datadislike){
		// Get every column value

		var plot_genre_dislike = []
		var plot_value_dislike = []
		var plot_color_dislike = []
		//count value based on genre
		if (genre["game"]!='undefined'){
			var val = count_dislikes(start_month,start_year,end_month,end_year,"game",datadislike)
			plot_genre_dislike.push("Game")
			plot_value_dislike.push(val)
			plot_color_dislike.push("#ee474a")		
		}
		if (genre["comedy"]!='undefined'){
			var val = count_dislikes(start_month,start_year,end_month,end_year,"comedy",datadislike)
			plot_genre_dislike.push("Comedy")
			plot_value_dislike.push(val)
			plot_color_dislike.push("#ee5e73")		
		}
		if (genre["blog"]!='undefined'){
			var val = count_dislikes(start_month,start_year,end_month,end_year,"blog",datadislike)
			plot_genre_dislike.push("Blog & People")
			plot_value_dislike.push(val)
			plot_color_dislike.push("#f28b9b")		
		}
		if (genre["ent"]!='undefined'){
			var val = count_dislikes(start_month,start_year,end_month,end_year,"ent",datadislike)
			plot_genre_dislike.push("Entertainment")
			plot_value_dislike.push(val)
			plot_color_dislike.push("#f7bec7")	
		}
		max_val = Math.max.apply(Math, plot_value_dislike)
		val_order = 1

		while (max_val > val_order){
			val_order *= 10
		}
		val_order /=10
		sym_order = ""
		max_val = (Math.floor(max_val/(val_order))+1)*val_order

		if (val_order>=1000000) sym_order = 'M'
		else if (val_order >= 1000) sym_order = "K"
		//dislike VALUE SCALE
		var xScale_dislike = d3.scale.linear()
			.domain([0,max_val])
			.range([0,widthdislike]);

		var xAxis_dislike =  d3.svg.axis()
			.scale(xScale_dislike)
			.ticks(3)
			.tickFormat(function(d) {return Math.round(d/val_order)+sym_order})
		    .orient("bottom");

		//dislike GENRE SCALE
		var yScale_dislike = d3.scale.ordinal()
				.domain(plot_genre_dislike)
				.rangeBands([0,heightdislike]);

		var yAxis_dislike = d3.svg.axis()
			.scale(yScale_dislike)
			.orient("left")

		svg_dislike.append('g')
			.attr('class', 'y axis')
			.call(yAxis_dislike)
		
		svg_dislike.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,'+heightdislike+')')
			.call(xAxis_dislike)

		console.log(plot_value_dislike)
		svg_dislike.selectAll("rectangle")
			.data(plot_value_dislike)
			.enter()
			.append("rect")
			.attr("class","rectangle")
			.attr("width", function(d,i){
				return (plot_value_dislike[i]/max_val)*widthdislike;
			})
			.attr("height", 15)
			.attr("x", 0)
			.attr("y", function(d,i){
				return (heightdislike/plot_genre_dislike.length)*i+2
			})
			.append("title")
			.text(plot_genre_dislike);
		
		function update_dislike_graph() {
			return 1
		}
	});
}

update_dislike_graph(start_month, start_year, end_month, end_year,genres);

d3.selectAll(".filter").on("change", function(d){
	svg_dislike.selectAll("*").remove();
	console.log('time filter called!');

	var e = document.getElementById("start_month");
	var start_month = e.selectedIndex + 1;
	var e = document.getElementById("end_month");
	var end_month = e.selectedIndex + 1;
	var e = document.getElementById("start_year");
	var start_year = e.options[e.selectedIndex].value;
	var e = document.getElementById("end_year");
	var end_year = e.options[e.selectedIndex].value;


	var e = document.getElementById("start_month");
	var start_month = e.selectedIndex + 1;
	var e = document.getElementById("end_month");
	var end_month = e.selectedIndex + 1;
	var e = document.getElementById("start_year");
	var start_year = e.options[e.selectedIndex].value;
	var e = document.getElementById("end_year");
	var end_year = e.options[e.selectedIndex].value;


	update_dislike_graph(start_month, start_year, end_month, end_year,genres);
});