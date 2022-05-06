const mongoose = require('mongoose')

const TagsSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 10,
        minlength: 1,
    }
})

const Tags = mongoose.model('Tags', TagsSchema)


module.exports = Tags
