const d3 = require('d3');
let data = require('../../data/data.json');
let dataDonut = {};

// GENERAL VARIABLES

const margin = 40;

const t = d3.transition().duration(200);

const x = d3.scaleBand().padding(0.2);
const y = d3.scaleLinear();

const height = 800 - margin;
const width = 1000 - margin;

const size = (width / 2) * 1.25;

const radius = Math.min(size, size) / 2 - margin;

const color = d3.scaleOrdinal(d3.schemePastel1).domain(dataDonut);

const third = size / 3;
const label = third * 1.5;

const horizontal = () => d3.axisLeft().scale(y);

const select = ['Overall', 'During World War I', 'Post World War I', 'During World War II', 'Post World War II'];

const modifyData = {
  barChart: () => {
    return d3
      .nest()
      .key(d => d.year)
      .rollup(d => d.length)
      .entries(data)
      .filter(y => y.key > 1909 && y.key < 1951);
  },
  donutChart: () => {
    return d3
      .nest()
      .key(d => d.year)
      .rollup(d => d)
      .entries(data);
  }
};

// BAR CHART

const barChart = d3
  .select('.container')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

let graph = barChart
  .append('g')
  .attr('transform', `translate(${margin + 30}, 0)`)
  .attr('class', 'graph');

const renderBarChart = () => {
  data = modifyData.barChart();

  data.sort((a, b) => d3.ascending(a.key, b.key));

  initOptions();
  scaleBarChart(data);
};

const initOptions = () => {
  return d3
    .select('form')
    .append('select')
    .on('change', changeOption)
    .selectAll('option')
    .data(select)
    .enter()
    .append('option')
    .attr('value', d => d)
    .text(d => d);
};

const scaleBarChart = data => {
  let max = d3.max(data, d => +d.value);

  y.range([height, 0]).domain([0, max]);
  x.range([0, width - 20]).domain(data.map(d => d.key));

  axisBarChart(data);
};

const axisBarChart = data => {
  // y
  graph
    .append('g')
    .attr('class', 'y-axis')
    .transition(t)
    .call(d3.axisLeft(y));

  // x
  graph
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .transition(t)
    .call(d3.axisBottom(x));

  // horizontal lines
  graph
    .append('g')
    .attr('class', 'grid')
    .call(
      horizontal()
        .tickSize(-width + 19, 0, 0)
        .tickFormat('')
    );

  graph
    .append('text')
    .attr('x', -(height / 2) - margin)
    .attr('y', '-40')
    .attr('transform', 'rotate(-90)')
    .text('Aantal');

  graph
    .append('text')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 1.5)
    .attr('text-anchor', 'end')
    .text('Jaren');

  drawBars(data);
};

const drawBars = data => {
  const bars = graph
    .selectAll()
    .data(data)
    .enter()
    .append('g')
    .attr('id', d => d.key)
    .attr('class', 'bars')
    .append('rect')
    .attr('class', 'rect-bar')
    .attr('y', d => y(0))
    .attr('height', 0)
    .attr('x', d => x(d.key))
    .attr('width', x.bandwidth())
    .attr('fill', '#ed5f73')
    .attr('opacity', '0.25');

  bars
    .transition(t)
    .attr('height', d => height - y(d.value))
    .attr('y', d => y(d.value));

  bars
    .on('mouseover', function(d) {
      d3.select(this)
        .transition()
        .attr('opacity', '1');
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .attr('opacity', '0.25');
    });

  bars
    .on('mouseenter', function(value) {
      document.querySelector('.bar-chart--text').textContent = `In het jaar ${value.key} zijn er ${value.value} boeken gepubliceerd.`;
      d3.select(this)
        .transition(t)
        .style('opacity', '1')
        .attr('class', 'tooltip-value');
    })
    .on('mouseleave', function() {
      d3.select(this)
        .select('text')
        .remove();
    });

  // bars.on('click', function(value) {
  //   renderDonutChart(value.key)

  // })
};

const updateBarChart = data => {
  graph.remove();

  graph = barChart
    .append('g')
    .attr('transform', `translate(${margin + 30}, 0)`)
    .attr('class', 'graph');
  console.log(data);

  scaleBarChart(data);
};

function changeOption() {
  switch (this.value) {
    case 'Overall':
      updateBarChart(data.filter(y => y.key > 1909 && y.key < 1951));
      break;
    case 'Post World War II':
      updateBarChart(data.filter(y => y.key > 1945 && y.key < 1951));
      break;
    case 'During World War II':
      updateBarChart(data.filter(y => y.key > 1938 && y.key < 1946));
      break;
    case 'Post World War I':
      updateBarChart(data.filter(y => y.key > 1918 && y.key < 1939));
      break;
    case 'During World War I':
      updateBarChart(data.filter(y => y.key > 1913 && y.key < 1919));
      break;
    default:
      console.log('Error occured');
  }
}

// DONUT CHART

const donutChart = d3
  .select('.container')
  .append('svg')
  .attr('width', size)
  .attr('height', size)
  .append('g')
  .attr('transform', `translate(${size / 2 + 25}, ${size / 2 + 25})`)
  .attr('class', 'donut');

// modify data
const renderDonutChart = selected => {
  let specificYear;
  // hier wat anders op verzinnen
  const transformData = () => {
    return d3
      .nest()
      .key(d => d.year)
      .rollup(d => d)
      .entries(data);
  };
  console.log(transformData());

  transformData().map(data => {
    if (data.key === selected) {
      specificYear = data;
    }
  });

  let stringOfTitles = [];

  specificYear.value.map(d => stringOfTitles.push(d.title));

  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

  letters.forEach(letter => {
    let amountLowerCase = stringOfTitles.join().split(letter).length - 1;
    let amountUpperCase = stringOfTitles.join().split(letter.toUpperCase()).length - 1;

    dataDonut[letter] = amountLowerCase + amountUpperCase;
  });

  drawArcs(dataDonut);
};

const drawArcs = data => {
  // difference arc states
  const arcProps = (inner, outer) => {
    return d3
      .arc()
      .innerRadius(inner)
      .outerRadius(outer);
  };

  const pie = d3.pie().value(d => d.value);
  const arcs = pie(d3.entries(data));

  const arc = donutChart
    .selectAll('.arc')
    .data(arcs)
    .enter()
    .append('g')
    .attr('class', 'arc');

  arc
    .append('path')
    .attr('d', arcProps(125, radius))
    .attr('fill', d => color(d.data.value))
    .attr('opacity', '0.25')
    .on('mouseover', function(d) {
      d3.select(this)
        .transition()
        .attr('d', arcProps(100, radius + 20))
        .attr('opacity', '1');
    })
    .on('mouseout', function(d) {
      d3.select(this)
        .transition()
        .attr('d', arcProps(125, radius))
        .attr('opacity', '0.25');
    });

  arc.on('mouseenter', function(value) {
    d3.select(this)
      .append('text')
      .attr('transform', d => `translate(${arcProps(label, label).centroid(d)})`)
      .attr('y', -2)
      .attr('x', -2)
      .style('alignment-baseline', 'middle')
      .text(v => `${value.data.key}`)
      .attr('class', 'tooltip-donut');

    d3.select(this)
      .append('text')
      .attr('dy', '0em')
      .attr('text-anchor', 'middle')
      .text(v => `${value.data.value}x`)
      .attr('class', 'tooltip-donut--letter');
  });

  arc.on('mouseleave', function(value) {
    d3.select(this)
      .selectAll('.tooltip-donut, .tooltip-donut--letter')
      .remove();
  });
};

renderDonutChart('1915');
renderBarChart();
