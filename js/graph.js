var data = [30, 86, 168, 281, 303, 365];


document.write('aaa')

d3.select(".main_graph")
  .selectAll("div")
  .data(data)
    .enter()
    .append("div")	
    .style("width", function(d) { return d + "px"; })
    .text(function(d) { return d; });

document.write('aaaaaa')

