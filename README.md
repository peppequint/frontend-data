<div align="center">
	<h1 align='center'>Frontend Data</h1>
	<img align='center' src="./docs/src/screen-rec.gif" width="800" />
</div>
<br>
<p align="center">
	A data visualisation about published German books around the 2 world wars.
	<br>
	<a href="https://peppequint.github.io/frontend-data/">Live demo</a>
</p>
<br>

## Table of contents
- [Install](#install)
- [Wiki](#wiki)
- [Concept](#concept)
- [API](#api)
- [Data](#data)
- [D3](#d3)
- [Sources](#sources)
- [Credits](#credits)

## Install
You must have [Node.js](https://nodejs.org/en/download/) installed on your computer to run this project. To install this project on your computer, please follow the steps below from your command line:

```shell
# Clone repository
git clone https://github.com/peppequint/frontend-data.git

# Go to the repository
cd frontend-data

# Install dependencies
npm install

# Compiles Javascript with Browserify
npm start
```

## Wiki
The documentations of this project can be found in the Wiki of this project. I try to explain what I did with the data of the public library of Amsterdam and how I used D3. Please, click the [link](https://github.com/peppequint/frontend-data/wiki) for details about this project.

## Concept
This concept is about the number of German books that has been published, specifically in the 20th century. The data of the public library of Amsterdam is used in this concept. With this data I created a visualisation to answer a few questions I asked myself. You can read more about the concept in the [documentation](https://github.com/peppequint/frontend-data/wiki/Concept).

## API
The OBA was so kind to let us use their API to fetch data. Unfortunately, the API isn't working anymore. It was a temporary key they gave to the students. However, I do have a JSON file with the data of the OBA. I modified the request to get the specific data that I wanted.

``` javascript
const public_key = process.env.DB_PUBLIC;
const secret_key = process.env.DB_SECRET;

const client = new OBAWrapper({
  public: public_key,
  secret: secret_key
});

client
  .get("search", {
    q: "buch",
    sort: "year",
    refine: true,
    facet: ["type(book)", "language(ger)"],
    count: 19429,
    log: true
  })
  .then().catch(err => console.log(err));
```

## Data
The data that returned from the API request wasn't clean. So, first I wrote some methods to clean up the data. These methods were intended to extract specific data from the large database that the OBA offered.
After all these methods were executed, I had a big JSON file which contains this data:
``` json
[
 {
  "title": "Der Jaguar",
  "author": "Scherling, Theo",
  "year": "2088"
 },
 {
  "title": "Mein schwules Auge",
  "author": "R. Hopf",
  "year": "2018"
 },
 {
  "title": "Unter MÃ¤nnern",
  "author": "Florian Mildenberger",
  "year": "2018"
 },
 {
  "title": "Olga",
  "author": "Schlink, Bernhard",
  "year": "2018"
 },
 ...
]
```

If you want to read more about these methods, please read the chapter in the [Wiki](https://github.com/peppequint/frontend-data/wiki/Data) about the data.

## D3
With the [D3](https://d3js.org/) library I am able to make a dynamic presentation of the data that I got from the public library of Amsterdam. I will explain what aspects I have used from D3. For specific information how certain D3 methods work and what it did with my data can be found in the [Wiki](https://github.com/peppequint/frontend-data/wiki/D3).


## Sources
- [Wrapper Maanlamp](https://github.com/maanlamp/node-oba-api-wrapper)
- [Learn JS Data](http://learnjsdata.com/group_data.html)
- [d3.ascending()](https://observablehq.com/@d3/d3-ascending)
- [Donut Chart](https://www.d3-graph-gallery.com/graph/donut_basic.html)
- [Rising Stack](https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/)
- [General update pattern](https://www.youtube.com/watch?v=IyIAR65G-GQ)
- [Hover arc](https://stackoverflow.com/questions/30816709/how-to-increase-size-of-pie-segment-on-hover-in-d3)
- [Label donut chart](https://travishorn.com/self-contained-d3-pie-chart-function-e5b7422be676)

## Credits
- [Joost Flick](https://github.com/joostflick)