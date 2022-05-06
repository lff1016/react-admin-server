// multer 文件上传，可指定文件上传路径
const multer = require('multer')
const path = require('path')
const fs = require('fs')

let uploadFn = (req, res , dest) => {

    const dirPath = path.join(__dirname,'..', `public/upload/${dest}`)

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // fs.existsSync: 以同步的方法检测目录是否存在
            if (!fs.existsSync(dirPath)) {
                fs.mkdir(dirPath, function (err) {
                    if (err) {
                        console.log('创建文件夹错误',err)
                    } else {
                        cb(null, dirPath)
                    }
                })
            } else {
                cb(null, dirPath)
            }
        },
        filename:  function (req, file, cb) {
            let ext = path.extname(file.originalname)
            cb(null, file.fieldname + '-' + Date.now() + ext)
        }
    })

    // 创建 Multer 实例
    const upload = multer({storage}).single(`${dest}`) // 请求参数名

    return new Promise((resolve, reject) => {
        upload(req, res, err => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            resolve()
        })
    })
}

module.exports = {uploadFn}
