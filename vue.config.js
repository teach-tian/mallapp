// 目录地址
const path = require('path')

module.exports = {
  // 对象和函数都可以，如果要控制开发环境可以选择函数
  configureWebpack:{
      resolve:{
        alias:{
          'assets':path.resolve('./src/assets'),
          'common':path.resolve('./src/common'),
          'components':path.resolve('./src/components'),
          'network':path.resolve('./src/network'),
          'views':path.resolve('./src/views')
        }
      }
    },
    devServer: {
      // host: '192.168.5.1',  //将浏览地址的本地服务修改为本机ip地址，用来到手机上测试
      // port: 8081,           //端口号
      disableHostCheck: true, //设置内网穿透
      proxy: {
        //配置跨域
          '/apis': {
              target: 'http://pv.sohu.com',// 搜狐的接口数据好像访问不了了，改为下面的
              ws: true,
              changOrigin: true,//允许跨域
              pathRewrite: {
                  '^/apis': ''//请求的时候使用这个api就可以
              }
          },
          '/apis2': {
            target: 'http://myip.ipip.net/',//
            ws: true,
            changOrigin: true,//允许跨域
            pathRewrite: {
                '^/apis': ''//请求的时候使用这个api就可以
            }
        }
      }
  },
 // 修改打包路径规则
  // publicPath: './',
  // outputDir: 'dist',
  // devServer: {
    // proxy: {
      // '/api': {
        // target: '',
        // ws: true,
        // changeOrigin: true
      // }
    // }
  // }
}
