

var marginlike = {top:20 , right: 20, bottom: 20, left: 60},
    widthlike = 300 - marginlike.left - marginlike.right,
    heightlike = 130 - marginlike.top - marginlike.bottom;

var svg_like = d3.select("#popu_likes").append("svg")
	.attr("width", widthlike + marginlike.left + marginlike.right)
    .attr("height", heightlike + marginlike.top + marginlike.bottom)
	.append("g")
    .attr("transform", "translate(" + marginlike.left + "," + marginlike.top + ")");

start_month = 0
start_year = 0
end_month = 3000
end_year = 3000
genres = ["game","comedy","blog","ent"]

function check_validity_likes(sm, sy, em, ey,genre,data){
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

function count_likes(start_month, start_year, end_month, end_year,genre,data){
	//count value based on genre
	if (genre=="game") genre = "Game"
	else if (genre=="comedy") genre = "Komedi"
	else if (genre=="blog") genre = "Blog &amp; Orang"
	else if (genre=="ent") genre = "Hiburan"
	val = 0
	count = 0
	for (var i=0;i<data.length;i++){
		if (check_validity_likes(start_month, start_year, end_month, end_year,genre,data[i])){
			val+= parseInt(data[i].like)
			count+=1
		}		
	}

	console.log(genre)
	return Math.round(val/count)
}

function numeric_format(val,order,sym){
	var res = Math.round(d/val_order_likes)+sym_order_likes
}
function update_like_graph(start_month, start_year, end_month, end_year,genre) {
	d3.csv("data/popularity.csv", function(datalike){
		// Get every column value
		var plot_genre_likes = []
		var plot_value = []
		var plot_color = []
		//count value based on genre
		if (genre["game"]!='undefined'){
			var val = count_likes(start_month,start_year,end_month,end_year,"game",datalike)
			plot_genre_likes.push("Game")
			plot_value.push(val)
			plot_color.push("#ee474a")		
		}
		if (genre["comedy"]!='undefined'){
			var val = count_likes(start_month,start_year,end_month,end_year,"comedy",datalike)
			plot_genre_likes.push("Comedy")
			plot_value.push(val)
			plot_color.push("#ee5e73")		
		}
		if (genre["blog"]!='undefined'){
			var val = count_likes(start_month,start_year,end_month,end_year,"blog",datalike)
			plot_genre_likes.push("Blog & People")
			plot_value.push(val)
			plot_color.push("#f28b9b")		
		}
		if (genre["ent"]!='undefined'){
			var val = count_likes(start_month,start_year,end_month,end_year,"ent",datalike)
			plot_genre_likes.push("Entertainment")
			plot_value.push(val)
			plot_color.push("#f7bec7")	
		}
		max_val = Math.max.apply(Math, plot_value)
		val_order_likes = 1

		while (max_val > val_order_likes){
			val_order_likes *= 10
		}
		val_order_likes /=10
		sym_order_likes = ""
		max_val = (Math.floor(max_val/(val_order_likes))+1)*val_order_likes

		if (val_order_likes>=1000000) sym_order_likes = 'M'
		else if (val_order_likes >= 1000) sym_order_likes = "K"
		
		console.log(max_val)
		//like VALUE SCALE
		var xScale_like = d3.scale.linear()
			.domain([0,max_val])
			.range([0,widthlike]);

		var xAxis_like =  d3.svg.axis()
			.scale(xScale_like)
			.ticks(3)
			.tickFormat(function(d) {return Math.round(d/val_order_likes)+sym_order_likes})
		    .orient("bottom");

		//like GENRE SCALE
		var yScale_like = d3.scale.ordinal()
				.domain(plot_genre_likes)
				.rangeBands([0,heightlike]);

		var yAxis_like = d3.svg.axis()
			.scale(yScale_like)
			.orient("left")

		svg_like.append('g')
			.attr('class', 'y axis')
			.call(yAxis_like)
		
		svg_like.append('g')
			.attr('class', 'x axis')
			.attr('transform', 'translate(0,'+heightlike+')')
			.call(xAxis_like)

		console.log(plot_value)
		svg_like.selectAll("rectangle")
			.data(plot_value)
			.enter()
			.append("rect")
			.attr("class","rectangle")
			.attr("width", function(d,i){
				return (plot_value[i]/max_val)*widthlike;
			})
			.attr("height", 15)
			.attr("x", 0)
			.attr("y", function(d,i){
				return (heightlike/plot_genre_likes.length)*i+2
			})
			.append("title")
			.text(plot_genre_likes);
		
		function update_like_graph() {
			return 1
		}
	});
}

update_like_graph(start_month, start_year, end_month, end_year,genres);

d3.selectAll(".filter").on("change", function(d){
	svg_like.selectAll("*").remove();
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


	update_like_graph(start_month, start_year, end_month, end_year,genres);
});