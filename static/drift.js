var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var x = d3.scale.log()
    .range([0, width]);

var y = d3.scale.log()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(20, ",.1s")
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var allData;
var curS = 1;
var curK = 1;
var curA = 1;

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

function initData(data) {
  data.forEach(function(d) {
    // T,TND,N,S,K,A,i,thresh
    d.T = +d.T;
    d.TND = +d.TND;
    d.N = +d.N;
    d.S = +d.S;
    d.K = +d.K;
    d.A = +d.A;
    d.i = (+d.i + 1)*1000;
    d.thresh = (+d.thresh)*100;
    if (isNaN(d.thresh)) {
      d.thresh = "1";
    }
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
      .text("threshold");

}

function showData (data) {
  var circle = svg.selectAll(".dot").data(data);
  circle.enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.i); }) // x(d.sepalWidth);
      .attr("cy", function(d) { return y(d.thresh); }) // y(d.sepalLength);
      .style("fill", function(d) { return color(1); }); // color(d.species);  
  circle.exit().remove();
  console.log([curS, curK, curA]);
  console.log(data);
}

function filterAndShowData() {
  curData = allData.filter(function (d) { return (d.S == curS) && (d.K == curK) && (d.A == curA); });
  showData(curData);
}

function loadData(error, data) {
  allData = data;
  initData(allData);
  filterAndShowData();
}

d3.csv("static/data.csv", loadData);

function updateS(evt, value) {
  curS = +value;
  filterAndShowData();
}
function updateK(evt, value) {
  curK = +value;
  filterAndShowData();
}
function updateA(evt, value) {
  curA = +value;
  filterAndShowData();
}

function initSliderS(id) {
  d3.select(id).call(d3.slider().min(1).max(4).step(1).on("slide", updateS));
}
function initSliderK(id) {
  d3.select(id).call(d3.slider().min(1).max(4).step(1).on("slide", updateK));
}
function initSliderA(id) {
  d3.select(id).call(d3.slider().min(1).max(4).step(1).on("slide", updateA));
}

$(function() {
    initSliderS('#slider1');
    initSliderK('#slider2');
    initSliderA('#slider3');
});
