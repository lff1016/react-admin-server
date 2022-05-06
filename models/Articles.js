// 文章页面
const mongoose = require('mongoose')
// const Categories = require('./Categories')
// const Tags = require('./Tags')

// 创建文章集合规则
const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        maxlength: 20,
        minlength: 2,
        required: true,
        trim: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    tags:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags'
    }],
    publishDate: {
        type: Date,
        default: Date.now
    },
    coverImg: {
        type: Array,
        default: []
    },
    content: {
        type: String,
        required: true
    },
    status: { // 文章的状态，
        type: Number,
        enum: [0, 1] // 0 为草稿，1 为发表
    }
})
//  根据规则创建集合
const Articles = mongoose.model('Articles', articleSchema)


// async function main() {
//     const article1 = await Articles.findOne({title: '我的第1篇帖子'})
//     const article2 = await Articles.findOne({title: '我的第2篇帖子'})
//     const article3 = await Articles.findOne({title: '我的第3篇帖子'})
    // const cat1 = await Categories.findOne({name: 'react相关'})
    // const cat2 = await Categories.findOne({name: 'vue相关'})
    // article1.category = cat1
    // article2.category = cat1
    // article3.category = cat2
    // const tag1 = await Tags.findOne({name: '框架'})
    // const tag2 = await Tags.findOne({name: 'JS'})
    // const tag3 = await Tags.findOne({name: '组件库'})
    // article1.tags = [tag1, tag2]
    // article2.tags = [tag1, tag3]
    // article3.tags = [tag1, tag2, tag3]
    // 3. 保存文章的修改
    // await article1.save()
    // await article2.save()
    // await article3.save()
// }
// main()

// 将集合作为模块成员进行导出
module.exports = Articles
