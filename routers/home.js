const express = require('express')

// 借用 express 开启路由
const home = express.Router()

// /login 登录界面
home.get('/home', (req, res) => {
  console.log('请求登录');
})


module.exports = home