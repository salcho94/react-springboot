const path = require('path');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        loader: "source-map-loader",
        exclude: /node_modules\/react-datepicker/, // ⚠️ react-datepicker의 source map 경고 무시
      },
    ],
  },
  ignoreWarnings: [/Failed to parse source map/], // 소스 맵 경고 무시
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return webpackConfig;
    },
    alias: {
      '@': path.resolve(__dirname, 'src/')
    },
    plugins: [
      new webpack.ProgressPlugin({
        handler: (percentage, message, ...args) => {
          message = `잠시만 기다려 주세요 ( · ❛ ֊ ❛) --->`;
          const barLength = 50;
          const completed = Math.round(percentage * barLength);
          const incomplete = barLength - completed;

          // 진행 바 문자열 생성
          const progressBar = ` [${'█'.repeat(completed)}${'░'.repeat(incomplete)}] ${Math.round(percentage * 100)}% `;

          // 터미널에서 진행 바 출력
          process.stdout.write(`${message} ${progressBar}\r`);
        },
      }),
    ],
  },
  devServer: {
    allowedHosts: ['localhost', 'js94.kro.kr'], // 허용된 호스트 추가
  },
};
