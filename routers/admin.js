// 博客管理后台的路由
const express = require('express')
const md5 = require('blueimp-md5')

const Users = require('../models/Users')
const Articles = require('../models/Articles')
const Categories = require('../models/Categories')
const Tags = require('../models/Tags')
const Says = require('../models/Says')
// const { userList } = require('../db/index')

// 借用 express 开启路由
const admin = express.Router()

// login 登录界面
admin.post('/login',(req, res) => {
  const {username, password} = req.body
  // 根据 username, password 查询用户
  Users.findOne({username, password: md5(password)})
      .then(user => {
        if (user) { // 如果用户存在，登录成功
          // 生成一个cookie：userid：user._id，并交给浏览器保存
          res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
          // 只有管理员才能正常登录
          if (user.role === 'admin') {
            res.send({status: 0, data: user})
          } else {
            res.send({status: 2, msg: '只有管理员才能进入后台！'})
          }
        } else { // 登录失败
          res.send({status: 1, msg: '用户名或密码错误！'})
        }
      })
      .catch(error => {
        console.log('登录错误', error)
        res.send({status: 1, msg: '登陆异常, 请重新尝试'})
  })
})

// 获取文章列表
admin.get('/admin/article/list', async (req, res) => {
    const articles = await Articles.find({}).populate('category').populate('tags')

    // 聚合查询，给文章新增加字段
    const count = await Articles.aggregate([
        {
            $group: {
                _id: '$status',
                total: {$sum: 1}
            }
        }
    ])
    if (articles) {
        res.send({status: 0, data: {articlesList: articles, count}})
    } else {
        res.send({status: 1, msg: '获取文章异常, 请重新尝试'})
    }
})

// 添加文章
admin.post('/admin/article/add', (req, res) => {
    const {article} = req.body
    Articles.create(article)
        .then(article => {
            res.send({status: 0, data: article})
        })
        .catch(error => {
            console.log('添加文章错误', error)
            res.send({status: 1, msg: '添加文章异常, 请重新尝试'})
        })
})

// 编辑（更新）文章
admin.post('/admin/article/update', (req, res) => {
    const {article} = req.body
    console.log(article)
    Articles.findOneAndUpdate({_id: article._id}, article, {}, (err, data) => {
        if (err) {
            console.log('更新文章错误', err)
            res.send({status: 1, msg: '更新文章异常, 请重新尝试'})
        } else {
            console.log('data', data)
            res.send({status: 0})
        }
    })
})

// 删除文章
admin.post('/admin/article/delete', (req, res) => {
    const {_id} = req.body
    Articles.deleteOne({_id})
        .then(() => {
            res.send({status: 0})
        })
        .catch(error => {
            console.log('删除文章异常', error)
            res.send({status: 1, msg: '删除文章异常, 请重新尝试'})
        })
})

// 添加分类
admin.post('/admin/category/add', async (req, res) => {
    const {name} = req.body
    // 根据分类名查找有没有该分类
    const category = await Categories.findOne({name: name})
    if (!category) { // 如果没有，新创建一个分类
        Categories.create({ name: name})
            .then(category => {
                res.send({status: 0, data: category})
            })
            .catch(error => {
                console.error('添加分类异常', error)
                res.send({status: 1, msg: '添加分类异常, 请重新尝试'})
            })
    } else {
        res.send({status: 3, msg: '分类已存在'})
    }
})

// 修改分类
admin.post('/admin/category/update', (req, res) => {
    const {categoryId, categoryName} = req.body
    Categories.findOneAndUpdate({_id: categoryId}, {name: categoryName})
        .then(oldCategory => {
            res.send({status: 0})
        })
        .catch(error => {
            console.log('更新分类错误', error)
            res.send({status: 1, msg: '更新分类异常, 请重新尝试'})
        })
})

// 获取所有分类(并进行统计，各分类下的文章数目，默认为0)
admin.get('/admin/category/list', (req, res) => {
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

// 删除分类
admin.post('/admin/category/delete', (req, res) => {
    const {_id} = req.body
    Categories.deleteOne({_id: _id})
        .then(() => {
            res.send({status: 0})
        })
})

// 获取所有标签
admin.get('/admin/tags/list', async (req, res) => {
    Tags.aggregate([
        {
            $lookup: {
                from: 'articles',
                localField: '_id',
                foreignField: 'tags',
                as: 't_articles'
            }
        }
    ], (err, tags) => {
        if (err) {
            console.log(err)
        } else {
            if (tags) {
                res.send({status: 0, data: tags})
            }
        }
    })
})

// 修改分类
admin.post('/admin/tags/edit', (req, res) => {
    const {_id, name} = req.body
    Tags.findOneAndUpdate({_id: _id}, {name: name})
        .then(() => {
            res.send({status: 0})
        })
        .catch(error => {
            console.log('更新标签错误', error)
            res.send({status: 1, msg: '更新标签异常, 请重新尝试'})
        })
})

// 添加标签
admin.post('/admin/tags/add', async (req, res) => {
    const {name} = req.body
    const tag = await Tags.findOne({name: name})
    if (!tag) {
        Tags.create({name: name})
            .then(tag => {
                res.send({status: 0, data: tag})
            })
            .catch(error => {
                console.log('添加标签异常', error)
                res.send({status: 1, msg: '添加标签异常, 请重新尝试'})
            })
    } else {
        res.send({status: 3, msg: '标签已存在'})
    }
})

// 删除标签
admin.post('/admin/tags/delete', (req, res) => {
    const {_id} = req.body
    Tags.deleteOne({_id: _id})
        .then(() => {
            res.send({status: 0})
        })
})

// 获取说说列表
admin.get('/admin/says/list', async (req, res) => {
    const says = await Says.find({})
    if (says) {
        res.send({status: 0, data: says})
    } else {
        res.send({status: 1, msg: '获取说说列表失败'})
    }
})

// 添加说说
admin.post('/admin/says/add', (req, res) => {
    const say = req.body
    Says.create(say)
        .then(say => {
            res.send({status: 0})
        })
        .catch(error => {
            console.log('添加说说失败', error)
            res.send({status: 1, msg: '添加说说失败'})
        })
})

// 修改说说
admin.post('/admin/says/update', (req, res) => {
    const say = req.body
    Says.findOneAndUpdate({_id: say._id}, say)
        .then(oldSay => {
            res.send({status: 0})
        })
        .catch(error => {
            console.log('更新说说失败', error)
            res.send({status: 1, msg: '更新说说失败'})
        })
})

// 删除说说
admin.post('/admin/says/delete', (req, res) => {
    const {_id} = req.body
    console.log(_id)
    Says.deleteOne({_id})
        .then(say => {
            res.send({status: 0})
        })
        .catch(error => {
            console.log('删除说说失败', error)
            res.send({status: 1, msg: '删除说说失败'})
        })
})

require('./file-upload')(admin)

module.exports = admin
