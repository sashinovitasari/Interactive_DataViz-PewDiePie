var marginView = {top:15 , right: 10, bottom: 20, left: 120},
    		widthView = 320 - marginView.left - marginView.right,
    		heightView = 95 - marginView.top - marginView.bottom;

		var svg_view = d3.select("#popu_views").append("svg")
			.attr("width", widthView + marginView.left + marginView.right)
    		.attr("height", heightView + marginView.top + marginView.bottom)
			.append("g")
    		.attr("transform", "translate(" + marginView.left + "," + marginView.top + ")");

start_month = 3
start_year = 2015
end_month = 12
end_year = 2017

function check_validity_view(sm, sy, em, ey,genre,data){
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

function count_views(sm, sy, em, ey,genre,data){
	//count value based on genre
	if (genre=="game") genre = "Game"
	else if (genre=="comedy") genre = "Komedi"
	else if (genre=="blog") genre = "Blog &amp; Orang"
	else if (genre=="ent") genre = "Hiburan"
	val = 0
	count = 0
	for (var i=0;i<data.length;i++){
		if (check_validity_view(sm, sy, em, ey,genre,data[i])){
			val+= parseInt(data[i].view)
			count+=1
		}		
	}
	return Math.round(val/count)
}

function update_view_graph(sm, sy, em, ey,genre) {
	d3.csv("data/popularity.csv", function(dataview){
		svg_view.selectAll("*").remove();
		// console.log(genre.indexOf('comedyh'))

		var plot_genre_view = []
		var plot_value_view = []
		var plot_color_view = []
		//count value based on genre
		if (genre.indexOf('game')!=-1){
			var val = count_views(sm,sy,em,ey,"game",dataview)
			plot_genre_view.push("Game")
			plot_value_view.push(val)
			plot_color_view.push("#ee474a")		
		}
		if (genre.indexOf('comedy')!=-1){
			var val = count_views(sm,sy,em,ey,"comedy",dataview)
			plot_genre_view.push("Comedy")
			plot_value_view.push(val)
			plot_color_view.push("#ee5e73")		
		}
		if (genre.indexOf('blog')!=-1){
			var val = count_views(sm,sy,em,ey,"blog",dataview)
			plot_genre_view.push("Blog & People")
			plot_value_view.push(val)
			plot_color_view.push("#f28b9b")		
		}
		if (genre.indexOf('ent')!=-1){
			var val = count_views(sm,sy,em,ey,"ent",dataview)
			plot_genre_view.push("Entertainment")
			plot_value_view.push(val)
			plot_color_view.push("#f7bec7")	
		}
		max_val = Math.max.apply(Math, plot_value_view)
		val_order = 1

		while (max_val > val_order){
			val_order *= 10
		}
		val_order /=10
		sym_order = ""
		var arr = [max_val,10000000]
		max_val = Math.max.apply(Math, arr)

		if (val_order>=1000000) sym_order = 'M'
		else if (val_order >= 1000) sym_order = "K"
		//VIEW VALUE SCALE
		var xScale_view = d3.scale.linear()
			.domain([0,max_val])
			.range([0,widthView]);

		var xAxis_view =  d3.svg.axis()
			.scale(xScale_view)
			.ticks(5)
			.tickFormat(function(d) {return Math.round(d/1000000)+sym_order})
		    .orient("bottom");

		//VIEW GENRE SCALE
		var yScale_view = d3.scale.ordinal()
			.domain(plot_genre_view)
			.rangeBands([0,heightView]);

		var yAxis_view = d3.svg.axis()
			.scale(yScale_view)
			.orient("left")


		//COLOR SCALE
		var colorScale_view = d3.scale.quantize()
			.domain([0,plot_genre_view.length])
			.range(plot_color_view);

		var divider = 2
		if (plot_genre_view.length==4) divider = plot_genre_view.length
		else if (plot_genre_view.length==4)	divider = 4
		
		var he_view = heightView/(plot_genre_view.length)

		svg_view.append('g')
			.attr('class', 'yView')
			.call(yAxis_view)
			.attr('transform', 'translate(-1,-10)')


		svg_view.append('g')
			.attr('class', 'xView')
			.attr('transform', 'translate(0,'+heightView+')')
			.call(xAxis_view)

		
		svg_view.selectAll("rectangle")
			.data(plot_value_view)
			.enter()
			.append("rect")
			.attr("class","rectangle")
			.attr("width", function(d,i){
				return (plot_value_view[i]/max_val)*widthView;
			})
			.attr("height", 10)
			.attr("x", 0)
			.attr("y", function(d,i){
				if (plot_genre_view.length==1) return he_view/2-13
				return (he_view)*i+(5*(4-plot_genre_view.length))-7
			})
			.style('fill',function(d,i){ return colorScale_view(i); })
			.append("title")
			.text(plot_genre_view);
		
		function update_view_graph() {
			return 1
		}
	});
}

update_view_graph(start_month, start_year, end_month, end_year,["game","comedy","blog","ent"]);
/*
d3.selectAll(".filter").on("change", function(d){
	svg_view.selectAll("*").remove();
	console.log('time filter called!');

	var e = document.getElementById("start_month");
	var start_month = e.selectedIndex + 1;
	var e = document.getElementById("end_month");
	var end_month = e.selectedIndex + 1;
	var e = document.getElementById("start_year");
	var start_year = e.options[e.selectedIndex].value;
	var e = document.getElementById("end_year");
	var end_year = e.options[e.selectedIndex].value;


	update_view_graph(start_month, start_year, end_month, end_year,genres);
});*/