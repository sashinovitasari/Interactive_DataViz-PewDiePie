var margindislike = {top:15 , right: 20, bottom: 20, left: 10},
    		widthdislike = 190 - margindislike.left - margindislike.right,
    		heightdislike = 95 - margindislike.top - margindislike.bottom;

var svg_dislike = d3.select("#popu_dislikes").append("svg")
			.attr("width", widthdislike + margindislike.left + margindislike.right)
    		.attr("height", heightdislike + margindislike.top + margindislike.bottom)
			.append("g")
    		.attr("transform", "translate(" + margindislike.left + "," + margindislike.top + ")");

start_month = 3
start_year = 2015
end_month = 12
end_year = 2017

function check_validity_dislike(sm, sy, em, ey,genre,data){
	if (data.category == genre){
		if (data.year > ey || data.year < sy) {
				return 0;
			}
			if (data.year == ey && data.month > em) {
				return 0;
			} 
			if (data.year == sy && data.month < sm) {
				return 0;
			} 

			return 1;
	}
	return 0
}

function count_dislikes(sm, sy, em, ey,genre,data){
	//count value based on genre
	if (genre=="game") genre = "Game"
	else if (genre=="comedy") genre = "Komedi"
	else if (genre=="blog") genre = "Blog &amp; Orang"
	else if (genre=="ent") genre = "Hiburan"
	val = 0
	count = 0
	for (var i=0;i<data.length;i++){
		if (check_validity_dislike(sm, sy, em, ey,genre,data[i])){
			val+= parseInt(data[i].dislike)
			count+=1
		}		
	}
	// console.log(val/count)
	return Math.round(val/count)
}

function update_dislike_graph(sm, sy, em, ey,genre) {
	// console.log(sm)
	// console.log(em)
	d3.csv("data/popularity.csv", function(datadislike){
		svg_dislike.selectAll("*").remove();
		// console.log(genre.indexOf('comedyh'))

		var plot_genre_dislike = []
		var plot_value_dislike = []
		var plot_color_dislike = []
		//count value based on genre
		if (genre.indexOf('game')!=-1){
			var val = count_dislikes(sm,sy,em,ey,"game",datadislike)
			plot_genre_dislike.push("Game")
			plot_value_dislike.push(val)
			plot_color_dislike.push("#ee474a")		
		}
		if (genre.indexOf('comedy')!=-1){
			var val = count_dislikes(sm,sy,em,ey,"comedy",datadislike)
			plot_genre_dislike.push("Comedy")
			plot_value_dislike.push(val)
			plot_color_dislike.push("#ee5e73")		
		}
		if (genre.indexOf('blog')!=-1){
			var val = count_dislikes(sm,sy,em,ey,"blog",datadislike)
			plot_genre_dislike.push("Blog & People")
			plot_value_dislike.push(val)
			plot_color_dislike.push("#f28b9b")		
		}
		if (genre.indexOf('ent')!=-1){
			var val = count_dislikes(sm,sy,em,ey,"ent",datadislike)
			plot_genre_dislike.push("Entertainment")
			plot_value_dislike.push(val)
			plot_color_dislike.push("#f7bec7")	
		}
		
		max_val = Math.max.apply(Math, plot_value_dislike)

		while (max_val > val_order){
			val_order *= 10
		}
		val_order /=100
		sym_order = ""
		// console.log(max_val)
		var arr = [max_val,4000]
		max_val = Math.max.apply(Math, arr)
		// console.log(max_val)

		if (val_order>=1000000) sym_order = 'M'
		else if (val_order >= 1000) sym_order = "K"
		//dislike VALUE SCALE
		var xScale_dislike = d3.scale.linear()
			.domain([0,max_val])
			.range([0,widthdislike]);

		var xAxis_dislike =  d3.svg.axis()
			.scale(xScale_dislike)
			.ticks(5)
			.tickFormat(function(d) {return Math.round(d/1000)+sym_order})
		    .orient("bottom");

		//dislike GENRE SCALE
		var yScale_dislike = d3.scale.ordinal()
			.domain(plot_genre_dislike)
			.rangeBands([0,heightdislike]);

		var yAxis_dislike = d3.svg.axis()
			.scale(yScale_dislike)
			.orient("left")

		//COLOR SCALE
		var colorScale_dislike = d3.scale.quantize()
			.domain([0,plot_genre_dislike.length])
			.range(plot_color_dislike);

		var divider = 2
		if (plot_genre_dislike.length==4) divider = plot_genre_dislike.length
		else if (plot_genre_dislike.length==4)	divider = 4
		
		var he_dislike = heightdislike/(plot_genre_dislike.length)

		svg_dislike.append('g')
			.attr('class', 'ydislike')
			.call(yAxis_dislike)
			.attr('transform', 'translate(-1,-10)')


		svg_dislike.append('g')
			.attr('class', 'xdislike')
			.attr('transform', 'translate(0,'+heightdislike+')')
			.call(xAxis_dislike)

		
		svg_dislike.selectAll("rectangle")
			.data(plot_value_dislike)
			.enter()
			.append("rect")
			.attr("class","rectangle")
			.attr("width", function(d,i){
				return (plot_value_dislike[i]/max_val)*widthdislike;
			})
			.attr("height", 10)
			.attr("x", 0)
			.attr("y", function(d,i){
				// console.log(he_dislike*i)
				if (plot_genre_dislike.length==1) return he_dislike/2-13
				return (he_dislike)*i+(5*(4-plot_genre_dislike.length))-7
			})
			.style('fill',function(d,i){ return colorScale_dislike(i); })
			.append("title")
			.text(plot_genre_dislike);
		
		
		function update_dislike_graph() {
			return 1
		}
	});
}

update_dislike_graph(start_month, start_year, end_month, end_year,["game","comedy","blog","ent"]);
/*
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


	update_dislike_graph(start_month, start_year, end_month, end_year,genres);
});*/