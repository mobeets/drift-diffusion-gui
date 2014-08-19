var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// var legend = svg.selectAll(".legend")
//   .data(color.domain())
// .enter().append("g")
//   .attr("class", "legend")
//   .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

// legend.append("rect")
//   .attr("x", width - 18)
//   .attr("width", 18)
//   .attr("height", 18)
//   .style("fill", color);

// legend.append("text")
//   .attr("x", width - 24)
//   .attr("y", 9)
//   .attr("dy", ".35em")
//   .style("text-anchor", "end")
//   .text(function(d) { return d; });

function showData(error, data) {
  data.forEach(function(d) {
    // T,TND,N,S,K,A,i,thresh
    d.T = +d.T;
    d.TND = +d.TND;
    d.N = +d.N;
    d.S = +d.S;
    d.K = +d.K;
    d.A = +d.A;
    d.i = +d.i;
    d.thresh = +d.thresh;
  });

  x.domain(d3.extent(data, function(d) { return d.i; })).nice();
  y.domain(d3.extent(data, function(d) { return d.thresh; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("duration");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("threshold")

  svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return 1; }) // x(d.sepalWidth);
      .attr("cy", function(d) { return 1; }) // y(d.sepalLength);
      .style("fill", function(d) { return color(1); }); // color(d.species);

}

d3.tsv("static/data.csv", showData);

function slider(id) {
    d3.select(id).call(d3.slider().min(1).max(2).step(1).on("slide", function(evt, value) {
      d3.select(id + 'textmin').text(value[ 0 ]);
      d3.select(id + 'textmax').text(value[ 1 ]);
    }));
}

$(function() {
    slider('#slider1');
    slider('#slider2');
    slider('#slider3');
});
