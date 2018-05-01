var marginlike = {top:15 , right: 15, bottom: 20, left: 10},
    		widthlike = 220 - marginlike.left - marginlike.right,
    		heightlike = 95 - marginlike.top - marginlike.bottom;

		var svg_like = d3.select("#popu_likes").append("svg")
			.attr("width", widthlike + marginlike.left + marginlike.right)
    		.attr("height", heightlike + marginlike.top + marginlike.bottom)
			.append("g")
    		.attr("transform", "translate(" + marginlike.left + "," + marginlike.top + ")");

start_month = 3
start_year = 2015
end_month = 12
end_year = 2017

function check_validity_like(sm, sy, em, ey,genre,data){
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

function count_likes(sm, sy, em, ey,genre,data){
	//count value based on genre
	if (genre=="game") genre = "Game"
	else if (genre=="comedy") genre = "Komedi"
	else if (genre=="blog") genre = "Blog &amp; Orang"
	else if (genre=="ent") genre = "Hiburan"
	val = 0
	count = 0
	for (var i=0;i<data.length;i++){
		if (check_validity_like(sm, sy, em, ey,genre,data[i])){
			val+= parseInt(data[i].like)
			count+=1
		}		
	}
	return Math.round(val/count)
}

function update_like_graph(sm, sy, em, ey,genre) {
	d3.csv("data/popularity.csv", function(datalike){
		svg_like.selectAll("*").remove();
		// console.log(genre.indexOf('comedyh'))

		var plot_genre_like = []
		var plot_value_like = []
		var plot_color_like = []
		//count value based on genre
		if (genre.indexOf('game')!=-1){
			var val = count_likes(sm,sy,em,ey,"game",datalike)
			plot_genre_like.push("Game")
			plot_value_like.push(val)
			plot_color_like.push("#ee474a")		
		}
		if (genre.indexOf('comedy')!=-1){
			var val = count_likes(sm,sy,em,ey,"comedy",datalike)
			plot_genre_like.push("Comedy")
			plot_value_like.push(val)
			plot_color_like.push("#ee5e73")		
		}
		if (genre.indexOf('blog')!=-1){
			var val = count_likes(sm,sy,em,ey,"blog",datalike)
			plot_genre_like.push("Blog & People")
			plot_value_like.push(val)
			plot_color_like.push("#f28b9b")		
		}
		if (genre.indexOf('ent')!=-1){
			var val = count_likes(sm,sy,em,ey,"ent",datalike)
			plot_genre_like.push("Entertainment")
			plot_value_like.push(val)
			plot_color_like.push("#f7bec7")	
		}
		max_val = Math.max.apply(Math, plot_value_like)

		while (max_val > val_order){
			val_order *= 10
		}
		val_order /=100
		sym_order = ""
		// console.log(max_val)
		var arr = [max_val,500000]
		max_val = Math.max.apply(Math, arr)
		// console.log(max_val)


		if (val_order>=1000000) sym_order = 'M'
		else if (val_order >= 1000) sym_order = "K"
		//like VALUE SCALE
		var xScale_like = d3.scale.linear()
			.domain([0,max_val])
			.range([0,widthlike]);

		var xAxis_like =  d3.svg.axis()
			.scale(xScale_like)
			.ticks(3)
			.tickFormat(function(d) {return Math.round(d/1000)+sym_order})
		    .orient("bottom");

		//like GENRE SCALE
		var yScale_like = d3.scale.ordinal()
			.domain(plot_genre_like)
			.rangeBands([0,heightlike]);

		var yAxis_like = d3.svg.axis()
			.scale(yScale_like)
			.orient("left")



		//COLOR SCALE
		var colorScale_like = d3.scale.quantize()
			.domain([0,plot_genre_like.length])
			.range(plot_color_like);

		var divider = 2
		if (plot_genre_like.length==4) divider = plot_genre_like.length
		else if (plot_genre_like.length==4)	divider = 4
		
		var he_like = heightlike/(plot_genre_like.length)

		svg_like.append('g')
			.attr('class', 'ylike')
			.call(yAxis_like)
			.attr('transform', 'translate(-1,-10)')


		svg_like.append('g')
			.attr('class', 'xlike')
			.attr('transform', 'translate(0,'+heightlike+')')
			.call(xAxis_like)

		
		svg_like.selectAll("rectangle")
			.data(plot_value_like)
			.enter()
			.append("rect")
			.attr("class","rectangle")
			.attr("width", function(d,i){
				return (plot_value_like[i]/max_val)*widthlike;
			})
			.attr("height", 10)
			.attr("x", 0)
			.attr("y", function(d,i){
				if (plot_genre_like.length==1) return he_like/2-13
				return (he_like)*i+(5*(4-plot_genre_like.length))-7
			})
			.style('fill',function(d,i){ return colorScale_like(i); })
			.append("title")
			.text(plot_genre_like);
		
		
		function update_like_graph() {
			return 1
		}
	});
}

update_like_graph(start_month, start_year, end_month, end_year,["game","comedy","blog","ent"]);
/*
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


	update_like_graph(start_month, start_year, end_month, end_year,genres);
});*/