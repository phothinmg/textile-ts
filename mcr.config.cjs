module.exports = {
  name: "Textile Ts",
  outputDir: "docs/mcr",
  report:['lcovonly'],
  entryFilter: {
    "**/node_modules/**": false,
    "**/src/**": true,
  },
};
