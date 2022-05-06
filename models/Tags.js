const mongoose = require('mongoose')

const TagsSchema = new mongoose.Schema({
    name: {type: String}
})

const Tags = mongoose.model('Tags', TagsSchema)


module.exports = Tags
