/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app",
  ignoredRouteFiles: ["**/.*"],
  server: "./server.js",
  serverBuildPath: "build/index.js",
  serverModuleFormat: "cjs",
  devServerBroadcastDelay: 100,
  routes: () => ({}),
};
