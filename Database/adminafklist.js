const { model, Schema } = require('mongoose')

const AdminAFK = new Schema({
    UserID: String,
    Key: Boolean,
})

module.exports = model('adminafk', AdminAFK)