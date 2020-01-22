<div align="center">
	<h1 align='center'>Frontend Data</h1>
	<!-- <img align='center' src="./public/src/img/screenshot-application.png" width="420" /> -->
</div>
<p align="center">
	A data visualisation about published German books around the 2 world wars.
	<br>
	<!-- <a href="https://browser-technologies-1819-pq.herokuapp.com/">Live demo</a> -->
</p>
<br>

## Table of contents
- [Install](#install)
- [Concept](#concept)
- [API](#api)
- [Data](#data)
- [D3](#d3)
- [Sources](#sources)

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

## Concept
This concept is about the number of German books that has been published, specifically in the 20th century. The data of the public library of Amsterdam is used in this concept. With this data I created a visualisation to answer a few questions. You can read more about the concept in the documentation (LINK WIKI).

## API
The OBA was so kind to let us use their API to fetch data. Unfortunately, the keys of the API doesn't work anymore. However, I do have a JSON file with the data of the OBA. I modified the request to get the specific data that I wanted.

``` javascript
client
  .get("search", {
    q: "buch", // only get the books
    sort: "year", // sorted at publication year
    refine: true,
    facet: ["type(book)", "language(ger)"], // only get books that are written in German
    count: 19429, // max. amount of books
    log: true
  })
```

## Data
The data that got back frmo the API wasn't clean. So, first I wrote some functions to clear the data. 

There are some results that do not have a title. In that case, when the title is ``undefined``, 'Unknown' must be used. 
Also, extra spaces are removed and the title is split whenever a certain punctuation shows up.
``` javascript 
// clean up string title of books
const cleanTitle = data => {
  const getTitle =
    typeof data.titles.title.$t === "undefined"
      ? "Unknown"
      : data.titles.title.$t;
  return getTitle.split(/[:,/]/)[0].trim();
};
```
This process also happens with the author of the book and year of publication.
``` javascript
// clean up string of author
const cleanAuthor = data => {
  const getAuthor =
    typeof data.authors === "undefined" ||
    typeof data.authors["main-author"] === "undefined"
      ? "Unknown"
      : data.authors["main-author"].$t;
  return getAuthor.split(/[/]/)[0].trim();
};

// clean up unknown years
const cleanYear = data => {
  const getYear =
    typeof data.publication === "undefined" ||
    typeof data.publication.year === "undefined" ||
    typeof data.publication.year.$t === "undefined"
      ? "Unknown"
      : data.publication.year.$t;
  return getYear;
};
```

After all, this cleaned up data will return and with data a JSON file will be written.
``` javascript
.then(items => {
    const listOfResults = items.map(books => getBookObject(books));
    fs.writeFileSync(
      "data/data-oba.json",
      JSON.stringify(listOfResults, null, 1),
      "utf8"
    );
})
```

## D3
With the [D3](https://d3js.org/) library I am able to make a dynamic presentation of the data that I got from the public library of Amsterdam. I will explain what aspects I have used from D3. For specific information how certain D3 functions work and what it did with my data can be found in the Wiki (also linked in the paragraphs).

### d3.nest()

### d3.enter()

### d3.update()

### d3.exit()

### D3 inspiration

## Sources
- [Wrapper Maanlamp](https://github.com/maanlamp/node-oba-api-wrapper)
- [Learn JS Data](http://learnjsdata.com/group_data.html)
- [Rising Stack](https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/)

## Credits
- [Joost Flick](https://github.com/joostflick)