const fs = require(`fs`);
const url = require(`url`);
const http = require(`http`);

const jsonData = fs.readFileSync(`./data/data.json`, `utf-8`);
const data = JSON.parse(jsonData);

const homePage = fs.readFileSync(`./index.html`, `utf-8`);

const tempColors = fs.readFileSync(`./templates/tempColors.html`, `utf-8`);

const tempColor = fs.readFileSync(`./templates/tempColor.html`, `utf-8`);

const error404 = fs.readFileSync(`./error404.html`, `utf-8`);

const updateTemplate = (template, color) => {
  let update = template.replaceAll(`{%COLOR%}`, color.color);
  update = update.replaceAll(`{%VALUE%}`, color.value);
  return update;
};

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === `/`) {
    // res.end(homePage);
    const colorsListItems = data
      .map((color) => updateTemplate(tempColors, color))
      .join(``);

    const updatedHome = homePage.replace(`{%COLORS%}`, colorsListItems);
    // console.log(updatedHome);
    return res.end(updatedHome);
  }
  if (pathname === `/color`) {
    // console.log(query);

    // when url.parse does NOT have query set to TRUE, below line is needed to parse the query from the query id
    // const colorQuery = query.split(`=`)[1];
    const curColorObj = data.find((color) => color.color === query.id);

    const updatedColorPage = updateTemplate(tempColor, curColorObj);

    return res.end(updatedColorPage);
  }
  if (pathname === `/texas/:something`) {
    console.log(url.parse(req.url, true));
    res.end(`inside texas`);
  }
  return res.end(error404);
});

server.listen(3000, () => {
  console.log(`server is LISTENGING`);
});
