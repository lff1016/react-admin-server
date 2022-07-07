// 用户评论模型
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
    isReplay: { // 是否是回复
        type: Boolean,
        default: false
    },
    // 回复给哪个评论
    replayId: {
        type: String,
        default: '0' // 0的话就是直接评论
    },
    key:{
        type: String,
        unique: true
    },
    isShow: {
        type: Boolean,
        default: false
    },
   /* replays: [
        {
            content: {
                type: String
            },
            isReplay: { // 是否是回复
                type: Boolean,
                default: true
            },
            // 来自哪个用户的回复
            uid: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            // 回复给谁？
            replayId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            },
            publishDate: {
                type: Date,
                default: Date.now
            },
            isShow: {
                type: Boolean,
                default: false
            }
        }
    ]*/
})

// 定义 Model
const Comments = mongoose.model('Comments', commentSchema)

module.exports = Comments
