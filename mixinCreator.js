const fs = require("fs");
const path = require("path");
const h2p = require("./pugConverter");
const { log } = require("console");

const route = "./components/marketing/sections/stats-sections";
const mixinName = "stat";
const dist = "./mixins";

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

fs.writeFileSync(path.resolve(path.join(dist, `${mixinName}.pug`)), "");

function indent(str, count = 1) {
  const tabs = Array(count).fill("  ");
  const arr = str.split("\n");
  const newArr = arr.map((line) => tabs.join("") + line);
  return newArr.join("\n");
}

function mixinCreator(filePath, id) {
  h2p(
    filePath,
    "",
    (pug) => {
      fs.appendFileSync(
        path.resolve(path.join(dist, `${mixinName}.pug`)),
        `\n\rmixin ${mixinName}${id}` + "\n" + indent(pug, 1)
      );
    },
    { log: true }
  );
}

const files = fs.readdirSync(route);
files.forEach((file, index) => {
  mixinCreator(path.join(__dirname, route, file), index + 1);
});
