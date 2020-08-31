module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  env: {
    development: {
      plugins: ["dynamic-import-node"],
    },
  },
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        style: true,
      },
      "vant",
    ],
  ],
};
