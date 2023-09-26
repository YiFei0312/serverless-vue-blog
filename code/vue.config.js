const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy:{
      '/api':{
        target:'http://192.168.51.3:80',//产生跨域的地址
        changeOrigin:true
      }
    }
  }
})