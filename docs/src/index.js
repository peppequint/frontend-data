const d3 = require('d3');
const data = require('../../data/data-oba.json');

var titles = [];

data.map(el => titles.push(el.title)
)

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
  var initData = quantityData(data);

  const sortYear = initData.filter(y => y.key > 1909 && y.key < 1961);

  // console.log(sortYear);
  

  const margin = 60;
  const height = 900 - 2 * margin;
  const width = 1720 - 2 * margin;

  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  function gridlines() {
    return d3.axisLeft(y).ticks(10);
  }

  const svg = d3
    .select('main')
    .append('svg')
    .attr('width', 1720)
    .attr('height', 900);

  const barChart = svg.append('g').attr('transform', `translate(${margin + 20}, ${margin})`);

  const yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, 200]);

  barChart.append('g').call(d3.axisLeft(yScale));

  const xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(sortYear.map(d => d.key))
    .padding(0.5);

  barChart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(d3.axisBottom(xScale));

  const rectBars = barChart
    .selectAll()
    .data(sortYear)
    .enter()
    .append('g');

  rectBars
    .append('rect')
    .attr('class', 'bar')
    .attr('x', data => xScale(data.key))
    .attr('y', data => yScale(data.value))
    .attr('rx', 3)
    .attr('ry', 0)
    .attr('height', data => height - yScale(data.value))
    .attr('width', xScale.bandwidth());

  rectBars.on('mouseenter', function(value, i) {
    d3.select(this)
      .append('text')
      .attr('x', v => xScale(v.key) + 8)
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
    .attr('class', 'axis')
    .text('Aantal boeken');

  svg
    .append('text')
    .attr('x', width / 2 + margin)
    .attr('y', margin * 15 - 10)
    .attr('text-anchor', 'middle')
    .attr('class', 'axis')
    .text('Jaren');

  svg
    .append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(${margin + 20}, ${margin})`)
    .call(
      gridlines()
        .tickSize(-width)
        .tickFormat('')
    );
}

const overall = data;

const postTwo = data.filter(y => y.key > 1946 && y.key < 1951);
console.log(postTwo);

const duringTwo = data.filter(y => y.key > 1938 && y.key < 1946);
const postOne = data.filter(y => y.key > 1919 && y.key < 1939);
const duringOne = data.filter(y => y.key > 1912 && y.key < 1919);

updateChart(data, overall);

d3.select('#timestamps').on('change', function() {
  const select = document.getElementById('timestamps');

  let options = select.options[select.selectedIndex].value;

  d3.selectAll('svg').remove();

  if (options == 'overall') {
    updateChart(overall);
  } else if (options == 'after-wwii') {
    updateChart(data, postTwo)
  } else if (options == 'during-wwii') {
    updateChart(data, duringTwo) 
  } else if (options == 'post-wwi') {
    updateChart(data, postOne)
  } else if (options == 'during-wwi') {
    updateChart(data, duringOne)
  }
});
