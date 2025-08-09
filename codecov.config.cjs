module.exports = {
  name: "Textile Ts",
  outputDir: "codecov",
  reports: [["codecov"]],
  entryFilter: {
    "**/node_modules/**": false,
    "**/src/**": true,
  },
};
