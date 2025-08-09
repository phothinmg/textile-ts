module.exports = {
  name: "Textile Ts",
  outputDir: "coverage",
  reports: [["codecov"]],
  entryFilter: {
    "**/node_modules/**": false,
    "**/src/**": true,
  },
};
