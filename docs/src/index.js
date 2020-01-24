const d3 = require('d3');
let data = require('../../data/data.json');

const select = ['Overall', 'During World War I', 'Post World War I', 'During World War II', 'Post World War II'];

const margin = 30;
const height = 920 - margin;
const width = 1420 - margin;

const svg = d3
  .select('.container')
  .append('svg')
  .attr('height', height)
  .attr('width', width);

const graph = svg
  .append('g')
  .attr('transform', `translate(${margin}, 0)`)
  .attr('class', 'graph');

const x = d3.scaleBand().padding(0.2);
const y = d3.scaleLinear();

const createVisualisation = () => {
  data = transform(data);
  data.sort(sort);
  options();
  scales(data);
};

const transform = () => {
  return d3
    .nest()
    .key(d => d.year)
    .rollup(d => d.length)
    .entries(data)
    .filter(y => y.key > 1909 && y.key < 1951);
};

// https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
const sort = (a, b) => {
  const compareA = a.key;
  const compareB = b.key;

  let comparison = 0;

  if (compareA > compareB) {
    comparison = 1;
  } else if (compareA < compareB) {
    comparison = -1;
  }

  return comparison;
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

const scales = data => {
  let max = d3.max(data, d => +d.value);

  x.range([0, width - 20]).domain(data.map(d => d.key));
  y.range([height, 0]).domain([0, max + 20]);
  axis(data);
};

const axis = data => {
  // y
  graph
    .append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y));

  // x
  graph
    .append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(x))

  graph
    .append('text')
    .attr('x', -(height / 2) - margin)
    .attr('y', '0')
    .attr('transform', 'rotate(-90)')
    .text('Aantal');

  graph
    .append('text')
    .attr('x', width / 2 + margin)
    .attr('y', margin * 10 * 3)
    .text('Jaren');

  draw(data);
};

const draw = data => {
  const bars = graph
    .selectAll()
    .data(data)
    .enter()
    .append('rect')
    .attr('href', d => d.key)
    .attr('class', 'bars')
    .attr('x', d => x(d.key))
    .attr('y', d => y(d.value))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.value));
};

function changeOption() {
  if (this.value == 'Overall') {
    let selected = data.filter(y => y.key > 1910 && y.key < 1951);
    scales(selected);
  } else if (this.value == 'Post World War II') {
    let selected = data.filter(y => y.key > 1945 && y.key < 1951);
    scales(selected);
  } else if (this.value == 'During World War II') {
    let selected = data.filter(y => y.key > 1938 && y.key < 1946);
    scales(selected);
  } else if (this.value == 'Post World War I') {
    let selected = data.filter(y => y.key > 1918 && y.key < 1939);
    scales(selected);
  } else if (this.value == 'During World War I') {
    let selected = data.filter(y => y.key > 1913 && y.key < 1919);
    scales(selected);
  }
}

createVisualisation();
