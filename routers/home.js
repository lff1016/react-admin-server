const express = require('express')
const Articles = require('../models/Articles')
const Users = require('../models/Users')
const Categories = require("../models/Categories")
const Comments = require("../models/comments")
const Says = require("../models/Says")

// 借用 express 开启路由
const home = express.Router()

// 获取 admin 的信息
home.get('/adminUser', (req, res) => {
    Users.findOne({role: 'admin'})
        .then(user => {
            res.send({status: 0, data: user})
        })
        .catch(error => {
            console.log('请求用户出错', error)
            res.send({status: 1, msg: '获取管理员用户异常, 请重新尝试'})
        })
})

// 获取文章
home.get('/articles', (req, res) => {
    // 获取所有已发布的文章
    Articles.find({status: 1}, null, {sort: {publishDate: -1}}).populate('category').populate('tags')
        .then(articles => {
            res.send({status: 0, data: articles})
        })
        .catch(error => {
            console.log('获取文章出错', error)
            res.send({status: 1, msg: '获取文章异常, 请重新尝试'})
        })
})

// 获取分类列表
home.get('/category/list', (req, res) => {
    // 将分类和文章关联起来，添加字段 c_articles: 展示分类下的文章数
    Categories.aggregate([
        {
            $lookup: {
                from: 'articles', // 关联的集合
                localField: '_id', // 此集合关联的字段
                foreignField: 'category', // 外部集合关联的字段
                as: 'c_articles' // 结果字段
            }
        }
    ], (err, categories) => {
        if (err) {
            console.log('获取分类错误', err)
            res.send({status: 1, msg: '创建分类异常, 请重新尝试'})
        } else {
            if (categories) {
                res.send({status: 0, data: categories})
            } else {
                res.send({status: 2, msg: '还没有分类哦~'})
            }
        }
    })
})

// 添加用户
home.post('/user/add', async (req, res) => {
    const {username, email, avatar} = req.body
    console.log(avatar)
    let user = await Users.findOne({username})
    if (!user) {
        Users.create({username, email, avatar})
            .then(user => {
                res.send({status: 0, data: user})
            })
            .catch(err => {
                console.log('创建用户失败', err)
                res.send({status: 1, msg: '添加用户异常，请重试'})
            })
    } else {
        res.send({status: 2, data: user})
    }
})

// 获取该文章下的评论列表（包括回复，前端进行筛选评论和回复）
home.get('/comment/list', (req, res) => {
    const aid = req.query.aid

    Comments.find({aid, isShow: true}).populate('uid')
        .then(comments => {
            if(comments) {
                res.send({status: 0, data: comments})
            } else {
                res.send({status:1, msg: '该文章下没有评论'})
            }

        })
        .catch(err => {
            console.log('请求评论列表错误', err)
            res.send({status:1, msg: '该文章下没有评论'})
        })

/*    Comments.find({aid}).populate('uid')
        .then(comments => {
            res.send({status: 0, data: comments || []})
        })
        .catch(err => {
            console.log('请求评论列表错误', err)
            res.send({status: 1, msg: '获取评论异常，请重试'})
        })*/
    // console.log('comments', comments)
    // if(comments) {
    //     res.send({status: 0, data: comments})
    // } else {
    //     res.send({status:1, msg: '该文章下没有评论'})
    // }
})

// 添加评论
home.post('/comment/add', async (req, res) => {
    // const {aid, content, uid, isReplay, replayId} = req.body

    Comments.create(req.body)
        .then(comments => {
            res.send({status: 0, data: comments})
        })
        .catch(err => {
            console.log('添加评论失败', err)
            res.send({status: 1, msg: '添加评论失败，请重试！'})
        })

/*    if (replayId !== "0") { // 评论
        console.log('if进来了', replayId)
        // const comment = await Comments.findOneAndUpdate({_id: replayId})
        Comments.findOneAndUpdate({_id: replayId}, {
            $push: {
                replays: {
                    content: replays.content,
                    uid: replays.uid,
                    replayId: replays.replayId
                }
            }
        },(err, data) => {
            if (err) {
                res.send({status: 1, msg: '添加回复出错，请重试！'})
                console.log('添加回复出错，请重试！', err)
            } else {
                console.log('data', data)
                res.send({status: 0, data})
            }
        })
    } else { // 回复
        console.log('else进来了')
        Comments.create({aid, uid, replayId, content})
            .then(comment => {
                res.send({status: 0, data: comment})
            })
            .catch(err => {
                console.log('添加评论异常', err)
                res.send({status: 1, msg: '添加评论异常，请重试'})
            })
    }*/

})

// 获取说说列表
home.get('/says/list', (req, res) => {
    Says.find({}, null, {sort: {publishDate: -1}})
        .then(says => {
            res.send({status: 0, data: says})
        })
        .catch(err => {
            console.log('获取说说异常，请重试', err)
            res.send({status: 1, msg: '获取说说异常，请重试'})
        })
})


module.exports = home
