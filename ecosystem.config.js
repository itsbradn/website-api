module.exports = {
  apps: [
    {
      name: "bradn-api",
      script: "./dist/index.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
