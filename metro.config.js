const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

process.env.EXPO_ROUTER_APP_ROOT = process.env.EXPO_ROUTER_APP_ROOT || "./src/app";

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: path.resolve(__dirname, "./src/global.css"),
  configPath: path.resolve(__dirname, "./tailwind.config.js"),
});
