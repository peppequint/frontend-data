const d3 = require('d3');
let data = require('../../data/data.json');

const select = ['Overall', 'During World War I', 'Post World War I', 'During World War II', 'Post World War II'];

const margin = 30;
const height = 920 - margin;
const width = 1420 - margin;

let svg = d3
  .select('.container')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

let graph = svg
  .append('g')
  .attr('transform', `translate(${margin + 30}, 0)`)
  .attr('class', 'graph');

const x = d3.scaleBand().padding(0.2);
const y = d3.scaleLinear();

const t = d3.transition().duration(200);

const updateBarChart = data => {
  graph.remove();
  graph = svg
    .append('g')
    .attr('transform', `translate(${margin + 30}, 0)`)
    .attr('class', 'graph');
  console.log(data);

  scaleBarChart(data);
};

const createVisualisation = () => {
  data = modifyData.barChart();

  data.sort((a, b) => d3.ascending(a.key, b.key));

  options();
  scaleBarChart(data);
};

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

const options = () => {
  const form = d3
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

  x.range([0, width - 20]).domain(data.map(d => d.key));
  y.range([height, 0]).domain([0, max + 20]);
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

  graph
    .append('text')
    .attr('x', -(height / 2) - margin)
    .attr('y', '-40')
    .attr('transform', 'rotate(-90)')
    .text('Aantal');

  graph
    .append('text')
    .attr('x', width / 2 + margin)
    .attr('y', margin * 10.5 * 3)
    .text('Jaren');

  drawBarChart(data);
};

const drawBarChart = data => {
  const bars = graph
    .selectAll()
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'bars');

  bars
    .append('rect')
    .attr('class', 'rect-bar')
    .attr('x', d => x(d.key))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('y', d => y(d.value));

  bars.on('mouseenter', function(value) {
    d3.select(this)
      .append('text')
      .attr('x', v => x(v.key) + 13)
      .attr('y', v => y(v.value) - 13)
      .attr('text-anchor', 'middle')
      .text(v => `${v.value}`)
      .attr('class', 'tooltip-value');
  });

  bars.on('mouseleave', function() {
    d3.select(this)
      .select('text')
      .remove();
  });
};

function changeOption() {
  switch (this.value) {
    case 'Overall':
      console.log(data);

      updateBarChart(data.filter(y => y.key > 1910 && y.key < 1951));
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

createVisualisation();
