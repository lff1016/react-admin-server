const express = require('express')
const Articles = require('../models/Articles')
const Users = require('../models/Users')
const Categories = require("../models/Categories");

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


module.exports = home
