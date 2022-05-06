const mongoose = require('mongoose')

const CategoriesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 10,
        minlength: 1,
    }
})

const Categories = mongoose.model('Categories', CategoriesSchema)


module.exports = Categories
