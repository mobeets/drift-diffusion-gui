var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 400 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var xScale = d3.scale.log().range([0, width]);
var yScale = d3.scale.log().range([height, 0]);

var xValue = function(d) { return d.i; }
var yValue = function(d) { return d.thresh; }
var xMap = function(d) { return xScale(xValue(d));}
var yMap = function(d) { return yScale(yValue(d));}

var xAxis = d3.svg.axis()
    .scale(xScale)
    .ticks(5, ",.1s")
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(5, ",.1s")
    .orient("left");

var svg = d3.select("#chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var color = d3.scale.category10();

var allData;
var curS;
var curK;
var curA;
var maxS;
var maxK;
var maxA;

function prepData(d) {
  // T,TND,N,S,K,A,i,thresh
  d.T = +d.T;
  d.TND = +d.TND;
  d.N = +d.N;
  d.S = +d.S;
  d.K = +d.K;
  d.A = +d.A;
  d.i = (+d.i + 1)*1000; // values play nice with log
  d.thresh = (+d.thresh + 1)*100; // values play nice with log
  if (isNaN(d.thresh)) {
    d.thresh = 1;
  }
}

function initData(data) {

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

  xScale.domain(d3.extent(data, xValue)).nice();
  yScale.domain(d3.extent(data, yValue)).nice();
  
}

function showData(data) {
  var circle = svg.selectAll(".dot").data(data);

  circle.enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(1); });

  circle.exit().remove();

  circle
    .transition()
    .duration(400)
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(1); });
}

function filterAndShowData() {
  showData(allData.filter(function (d) { return (d.S == curS) && (d.K == curK) && (d.A == curA); }));
}

function updateS(evt, value) {
  curS = +value;
  filterAndShowData();
  $('#s1val').html(curS);
}
function updateK(evt, value) {
  curK = +value;
  filterAndShowData();
  $('#s2val').html(curK);
}
function updateA(evt, value) {
  curA = +value;
  filterAndShowData();
  $('#s3val').html(curA);
}

function initSliderS(id) {
  d3.select(id).call(d3.slider().min(curS).max(maxS).step(1).on("slide", updateS));
  $('#s1val').html(curS);
}
function initSliderK(id) {
  d3.select(id).call(d3.slider().min(curK).max(maxK).step(1).on("slide", updateK));
  $('#s2val').html(curK);
}
function initSliderA(id) {
  d3.select(id).call(d3.slider().min(curA).max(maxA).step(1).on("slide", updateA));
  $('#s3val').html(curA);
}
function initSliders() {
  initSliderS('#slider1');
  initSliderK('#slider2');
  initSliderA('#slider3');
}
function initBounds(data) {
  curS = d3.min(data, function(d) { return d.S; });
  curK = d3.min(data, function(d) { return d.K; });
  curA = d3.min(data, function(d) { return d.A; });
  maxS = d3.max(data, function(d) { return d.S; });
  maxK = d3.max(data, function(d) { return d.K; });
  maxA = d3.max(data, function(d) { return d.A; });
  console.log([curS, curK, curA, maxS, maxK, maxA]);
}

function loadData(data) {
  // allData = data;
  // initData();
  // $.when(initData(allData)).then();
  $.when(initBounds(data)).then(initData(data)).then(initSliders());
  $('#nparticles').html(allData[0].N);
  $('#stimulus').html(allData[0].cohs);
  $('#timesteps').html(allData[0].T);
  $('#timedelay').html(allData[0].TND);
  filterAndShowData();
}

$(function() {
  d3.csv("static/data.csv", function (error, data) {
    data.forEach(prepData);
    allData = data;
    loadData(allData);
  });
});
