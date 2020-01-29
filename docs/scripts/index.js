const d3 = require('d3');
let data = require('../../data/data.json');

const select = ['Overall', 'During World War I', 'Post World War I', 'During World War II', 'Post World War II'];

const margin = 30;
const height = 800 - margin;
const width = 1000 - margin;

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

const yLine = () => d3.axisLeft().scale(y);

const renderBarChart = () => {
  data = modifyData.barChart();

  data.sort((a, b) => d3.ascending(a.key, b.key));

  initOptions();
  scaleBarChart(data);
};

const updateBarChart = data => {
  graph.remove();
  graph = svg
    .append('g')
    .attr('transform', `translate(${margin + 30}, 0)`)
    .attr('class', 'graph');
  console.log(data);

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

  x.range([0, width - 20]).domain(data.map(d => d.key));
  y.range([height, 0]).domain([0, max + 10]);
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

  // graph
  //   .append('g')
  //   .attr('class', 'grid')
  //   .call(
  //     yLine()
  //       .tickSize(-width, 0, 0)
  //       .tickFormat('')
  //   );

  graph
    .append('text')
    .attr('x', -(height / 2) - margin)
    .attr('y', '-40')
    .attr('transform', 'rotate(-90)')
    .text('Aantal');

  graph
    .append('text')
    .attr('x', width / 2 + margin)
    .attr('y', height + margin * 2)
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
    .attr('fill', '#ed5f73')
    .attr('opacity', '0.25');

  bars
    .attr('x', d => x(d.key))
    .attr('width', x.bandwidth())
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
};

function changeOption() {
  switch (this.value) {
    case 'Overall':
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

const widthDonut = 500;
const heightDonut = 500;
const marginDonut = 40;

const fourth = widthDonut / 3;
const labelOffset = fourth * 1.5;

let dataDonut = {};

function createDataDonut(i) {
  const transformData = () => {
    return d3
      .nest()
      .key(d => d.year)
      .rollup(d => d)
      .entries(data);
  };

  let string;
  let year = transformData();

  year.map(d => {
    if (d.key == i) {
      string = d;
    }
  });
  let total = string.value;
  let array = [];

  total.map(d => array.push(d.title));
  let dataString = array.join();

  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const parseData = {};

  letters.forEach(letter => {
    let uppercase = letter.toUpperCase();

    let amountLowerCase = dataString.split(letter).length - 1;
    let amountUpperCase = dataString.split(uppercase).length - 1;

    parseData[letter] = amountLowerCase + amountUpperCase;
  });

  dataDonut = parseData;
}

createDataDonut('1920');

const radiusDonut = Math.min(widthDonut, heightDonut) / 2 - marginDonut;

let svgDonut = d3
  .select('.container')
  .append('svg')
  .attr('width', widthDonut)
  .attr('height', heightDonut)
  .append('g')
  .attr('transform', `translate(${widthDonut / 2}, ${heightDonut / 2 + 50})`)
  .attr('class', 'donut');

const color = d3.scaleOrdinal(d3.schemePastel1).domain(dataDonut);

const pie = d3.pie().value(d => d.value);

const data_ready = pie(d3.entries(dataDonut));

// difference arc states
function arc(inner, outer) {
  return d3
    .arc()
    .innerRadius(inner)
    .outerRadius(outer);
}

const parts = svgDonut
  .selectAll('.arc')
  .data(data_ready)
  .enter()
  .append('g')
  .attr('class', 'arc');

parts
  .append('path')
  .attr('d', arc(125, radiusDonut))
  .attr('fill', d => color(d.data.key))
  .attr('opacity', '0.25')
  .on('mouseover', function(d) {
    d3.select(this)
      .transition()
      .attr('d', arc(100, radiusDonut + 20))
      .attr('opacity', '1');
  })
  .on('mouseout', function(d) {
    d3.select(this)
      .transition()
      .attr('d', arc(125, radiusDonut))
      .attr('opacity', '0.25');
  });

parts.on('mouseenter', function(value) {
  d3.select(this)
    .append('text')
    .attr('transform', d => `translate(${arc(labelOffset, labelOffset).centroid(d)})`)
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

parts.on('mouseleave', function(value) {
  d3.select(this)
    .selectAll('.tooltip-donut, .tooltip-donut--letter')
    .remove();
});

renderBarChart();
