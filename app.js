const fs = require("fs");
const path = require("path");
const { cwd } = require("process");

const initHTML = fs.readFileSync(path.join(__dirname, "./init.html"), {
  encoding: "utf-8",
});

const fullPath = path.join(
  __dirname,
  "components/marketing/sections/blog-sections"
);

let htmlFilesText = "";

function fileReader(fileName) {
  const stat = fs.statSync(fileName);

  if (stat.isDirectory()) {
    const dirs = fs.readdirSync(fileName);
    for (const dir of dirs) {
      fileReader(path.join(fileName, dir));
      // console.log(path.join(fileName, dir));
    }
  }
  if (stat.isFile()) {
    htmlFilesText += `<h1 class="fileName">${fileName}</h1> \n\r ${fs.readFileSync(
      fileName,
      {
        encoding: "utf-8",
      }
    )} \n\r`;
  }
}

fileReader(fullPath);

const html = initHTML.split("DO NOT REMOVE THIS TEXT");

fs.writeFileSync(
  "./index.html",
  `${html[0]} \n ${htmlFilesText} \n ${html[1]}`
);

console.log("successfully compiled");
