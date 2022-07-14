const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
const morgan = require('morgan')

// 连接数据库
require('./models/connect')

const admin = require('./routers/admin')
const home = require('./routers/home')

// 创建服务器
const app = express()



// 配置解析 post body 请求
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 开放静态资源
app.use(express.static(path.join(__dirname, 'public')))

// 配置路由请求路径
app.use('/admin', admin)
app.use('/home', home)
// 配置 cookie
app.use(cookieParser())

// 打印每次请求的数据
// 11. 设置不同的环境变量
if (process.env.NODE_ENV === 'development') {
  console.log('当前是开发环境')
  // 打印请求
  app.use(morgan('dev'))
} else {
  console.log('当前是生产环境')
  app.use(morgan('dev'))
}

// 监听端口，开启服务器
app.listen(3003, () => {
  console.log('mock的服务器开启了...');
})
