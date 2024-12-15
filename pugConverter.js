const fs = require("fs");
const h2p = require("html2pug");

function pugBeauty(str, options) {
  // Regular expression to capture classes with a colon (e.g., sm:text-4xl)
  const classesWithColon = str.match(/\.([\w\d\-]+:[\w\d\-]+)/g);

  // Regular expression to capture classes with a slash (e.g., border-white/20)
  const classesWithSlash = str.match(/\.([\w\d\-]+\/[\d]+)/g);

  const normalClass = new RegExp(/\.[\w\d\-]+/gi);

  // const allclasses = str.match(/\.[\w\d\-]+:?\/?[\w\d\-]+/gi);
  const attributePlace = str.match(
    /\(([\w\d\-]+\=[\w\d\-\:\?\.\&\'\"\/]+\,?\s?)+\)/gim
  );
  let newPugLine = str;
  let specialClasses = [];

  if (options?.debug) {
    console.log(str);
  }

  if (classesWithColon) {
    // remove colon classes
    classesWithColon.forEach((cls) => {
      newPugLine = newPugLine.replace(cls, "");
    });
    // attach specialClasses in class attribute
    specialClasses = [...specialClasses, ...classesWithColon];
  }

  if (classesWithSlash) {
    // remove slash classes
    classesWithSlash.forEach((cls) => {
      newPugLine = newPugLine.replace(cls, "");
    });
    // attach specialClasses in class attribute
    specialClasses = [...specialClasses, ...classesWithSlash];
  }

  if (attributePlace) {
    // if attrbute already exitst
  } else {
    // newPugLine all special classes removed
    const normalClassesArr = newPugLine?.match(normalClass);
    const lastClass = normalClassesArr?.[normalClassesArr?.length - 1];

    newPugLine = newPugLine.replace(
      lastClass,
      `${lastClass}${
        specialClasses.length > 1
          ? `(class="${specialClasses.map((cl) => cl.slice(1)).join(" ")}")`
          : ""
      }`
    );
  }

  return newPugLine;
}

module.exports = function html2Pug(htmlPath, dist, fn = () => {}, options) {
  const html = fs.readFileSync(htmlPath, { encoding: "utf-8" });
  const rawPUG = h2p(html, { fragment: true });

  if (options?.debug) {
    console.dir("raw Pug is here");
    console.log(rawPUG);
  }

  const arr = rawPUG.split("\n").map((str) => pugBeauty(str, options));

  if (options?.debug) {
    console.dir("all lines of pug");
    console.log(arr);
  }

  const pug = arr.join("\n");
  if (options?.log) {
    console.log(`${pug}`);
    console.dir(`wrote to ${dist}.pug`);
  }
  if (dist) {
    fs.writeFileSync(`${dist}.pug`, pug);
  } else {
    fn(pug);
  }
};
// h2p(
//   "./components/marketing/sections/stats-sections",
//   "",
//   (pug) => {
//     console.log(pug);
//   },
//   {
//     log: true,
//     debug: true,
//   }
// );
// console.log(
//   pugBeauty(
//     ".absolute.-ml-2.h-px.w-screen.-translate-x-full.bg-gray-900/10.sm:-ml-4.lg:static.lg:-mr-6.lg:ml-8.lg:w-auto.lg:flex-auto.lg:translate-x-0(aria-hidden='true')"
//   )
// );

// console.log(
//   pugBeauty(
//     ".bg-white.sm:py-32.py-24.sm:py-32.bg-white/10.sm:py-32 Hello World"
//   )
// );
