// 连接数据库
const mongoose = require('mongoose')

    mongoose.connect('mongodb://lf:123@localhost:27017/l_blog')
    .then(() => console.log('数据库连接成功...请访问http://localhost:3003'))
    .catch((err) => console.log('数据库连接异常 ', err))
