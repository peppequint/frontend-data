const d3 = require('d3');
const data = require('../../data/data-oba.json');

function quantityData(data) {
  return d3
    .nest()
    .key(function(d) {
      return d.year;
    })
    .rollup(function(v) {
      return v.length;
    })
    .entries(data);
}

const detailedData = d3
  .nest()
  .key(d => d.year)
  .entries(data)
  .filter(y => y.key == 1950);

// console.log(detailedData);

// const dropdown = d3
//   .select('body')
//   .insert('select', 'svg')
//   .on('change', dropdownChange());

// dropdown
//   .selectAll('option')
//   .data(quantityData)
//   .enter()
//   .append('option')
//   .attr('value', function(d) {
//     return d.key;
//   })
//   .text(function(d) {
//     return d.key;
//   });

// function dropdownChange() {
//   console.log('nu moet de hele chart verwijderd worden en een nieuwe geplaatst worden');
// }

function updateChart(data) {
  console.log(data);

  var initData = quantityData(data);
  const margin = 60;
  const height = 600 - 2 * margin;
  const width = 1240 - 2 * margin;

  const svg = d3
    .select('body')
    .append('svg')
    .attr('width', 1240)
    .attr('height', 600);

  const barChart = svg.append('g').attr('transform', `translate(${margin + 20}, ${margin})`);

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, 150]);

  barChart.append('g').call(d3.axisLeft(yScale));

  const xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map(d => d.key))
    .padding(0.2);

  barChart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  const rectBars = barChart
    .selectAll()
    .data(initData)
    .enter()
    .append('g');

  rectBars
    .append('rect')
    .attr('class', 'bar')
    .attr('x', data => xScale(data.key))
    .attr('y', data => yScale(data.value))
    .attr('ry', 5)
    .attr('height', data => height - yScale(data.value))
    .attr('width', xScale.bandwidth());

  rectBars.on('mouseenter', function(value, i) {
    d3.select(this)
      .append('text')
      .attr('x', v => xScale(v.key) + 10)
      .attr('y', v => yScale(v.value) - 10)
      .attr('text-anchor', 'middle')
      .text(v => `${v.value}`);
  });

  rectBars.on('mouseleave', function() {
    d3.select(this)
      .select('text')
      .remove();
  });

  svg
    .append('text')
    .attr('x', -(height / 2) - margin)
    .attr('y', margin / 2)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Aantal boeken');

  svg
    .append('text')
    .attr('x', width / 2 + margin)
    .attr('y', margin * 10 - 10)
    .attr('text-anchor', 'middle')
    .text('Jaren');
}

const overall = data.filter(y => y.key > 1909 && y.key < 1951);
const postTwo = data.filter(y => y.key > 1946 && y.key < 1951);
const duringTwo = data.filter(y => y.key > 1938 && y.key < 1946);
const postOne = data.filter(y => y.key > 1919 && y.key < 1939);
const duringOne = data.filter(y => y.key > 1912 && y.key < 1919);

updateChart(overall);

d3.select('#timestamps').on('change', function() {
  const select = document.getElementById('timestamps');

  let options = select.options[select.selectedIndex].value;

  d3.selectAll('svg').remove();

  if (options == 'after-wwii') {
    updateChart(postTwo);
  }
});
