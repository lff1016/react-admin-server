const mongoose = require('mongoose')
const Joi = require('joi')
const md5 = require('blueimp-md5')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 10
    },
    email: {
        type: String,
        required: true,
        //保证唯一
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['normal', 'admin']
    },
    // 头像
    avatar: {
        type: String,
        default:  '/public/img/avatar-default.png'
    },
    // 博客描述
    bio: {
        type: String,
        default: '',
        maxlength: 100
    },
    createTime: {
        type: Date,
        default: Date.now
    },
    authority: {
        type: Boolean,
        default: true // 默认 true 不禁用，有权限
    }
})

// 定义 Model（与集合对应，操作集合）
const User = mongoose.model('User', UserSchema)

// 将用户信息验证抽离出来
// const validUser = user => {
//     // 定义规则
//     const schema = Joi.object({
//         username: Joi.string().min(2).max(20).required().error(new Error('用户名不符合要求')),
//         password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,16}$')).required().error(new Error('密码不符合要求')),
//         email: Joi.string().email({minDomainSegments: 2, tlds: {allow: ['com', 'net']}}).required().error(new Error('邮箱不符合要求')),
//         // valid() 中直接传入允许输入的值，而不是数组
//         role: Joi.string().valid('normal', 'admin').required().error(new Error('角色非法')),
//         avatar: Joi.string().error(new Error('头像上传错误')),
//         bio: Joi.string().error(new Error('描述字数不能超过100字')),
//     })
//     return schema.validateAsync(user)
// }

// 初始化默认超级管理员用户: 陈树峰/1234
User.findOne({username: '陈树峰'}).then(user => {
    if (!user) {
        User.create(
            {
                username: '陈树峰',
                password: md5('1234'),
                email: '123@qq.com',
                role: 'admin',
                avatar: 'https://joeschmoe.io/api/v1/random'
            })
            .then(user => {
                console.log('初始化用户：用户名:陈树峰，密码：1234')
            })
    }
})


module.exports = User

