// 评论/回复集合
const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    // 评论来自哪个文章
    aid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Articles'
    },
    content: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date,
        default: Date.now
    },
    // 评论/回复来自哪个用户
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    },
    // 回复给哪个评论
    replyId: {
        type: String,
        default: 0 // 0的话就是直接评论
    }
    // // 回复
    // replay: [
    //     {
    //         // 回复来自哪个用户
    //         from: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'users'
    //         },
    //         // 回复给哪个用户
    //         to: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'users'
    //         },
    //         content: {
    //             type: String,
    //             require: true
    //         }
    //     }
    // ]
})

// 定义 Model
const Comments = mongoose.model('Comments', commentSchema)

module.exports = Comments
