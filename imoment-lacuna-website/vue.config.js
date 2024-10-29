const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/lacuna/' : '/lacuna/',
  outputDir: '../public/lacuna',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
    },
    404: {
      entry: 'src/main.js',
      template: 'public/404.html',
      filename: '404.html',
    }
  }
})
