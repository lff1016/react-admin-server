// 实现头像文件的上传路由
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// __dirname: /routers， ..：代表上一级，/admin_server
const dirPath = path.join(__dirname,'..', 'public/avatar')

// 设置保存规则
const storage = multer.diskStorage({
    // destination：字段设置上传路径，可以为函数
    destination: function (req, file, cb) {
        // fs.existsSync: 以同步的方法检测目录是否存在
        if (!fs.existsSync(dirPath)) {
            fs.mkdir(dirPath, function (err) {
                if (err) {
                    console.log(err)
                } else {
                    cb(null, dirPath)
                }
            })
        } else {
            cb(null, dirPath)
        }
    },
    // filename：设置文件保存的文件名
    filename: function (req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, file.fieldname + '-' + Date.now() + ext)
    }
})

// 创建 Multer 实例
const upload = multer({storage})
const uploadSingle = upload.single('avatar') // 请求参数名

module.exports = function avatarUpload(admin) {
    // 上传图片
    admin.post('/admin/img/upload', (req, res) => {
        uploadSingle(req, res, function (err) {
            if (err) {
                console.log(err)
                return res.send({status: 1, msg: '上传文件失败'})
            }
            let file = req.file
            res.send({
                status: 0,
                data: {
                    name: file.filename,
                    url: 'http://localhost:3001/upload/' + file.filename
                }
            })
        })
    })

    // 删除图片
    admin.post('/admin/img/delete', (req, res) => {
        const {name} = req.body
        fs.unlink(path.join(dirPath, name), (err) => {
            if (err) {
                console.log(err)
                res.send({status: 1, msg: '删除文件失败'})
            } else {
                res.send({status: 0})
            }
        })
    })

}
