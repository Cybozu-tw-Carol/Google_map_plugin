const path = require('path')
const KintonePlugin = require('@kintone/webpack-plugin-kintone-plugin')

module.exports = {
  // 指定需要以 webpack 打包的 JavaScript 檔案
  entry: {
    customize: './src/js/customize.js',
    config: './src/js/config.js',
  },
  // 指定 webpack 打包後的檔案輸出位置（plugin/js 資料夾下）與檔名
  output: {
    path: path.resolve(__dirname, 'plugin', 'js'),
    filename: '[name].js',
  },
  //css載入
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  // 外掛打包相關設定
  plugins: [
    new KintonePlugin({
      manifestJSONPath: './plugin/manifest.json',
      privateKeyPath: './dist/private.ppk',
      pluginZipPath: './dist/plugin.zip',
    }),
  ],
}