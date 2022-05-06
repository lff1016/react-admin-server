// 说说的文档模型
const mongoose = require('mongoose')

// 创建说说规则
const  SaysSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    }
})


// 创建集合
const Says = mongoose.model('Says', SaysSchema)


// 将集合作为模块成员进行导出
module.exports = Says
