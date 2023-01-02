const mongoose = require('mongoose') 

const reportSchema = mongoose.Schema({
    content : {
        type : String
    }
})

const reportModel = mongoose.model('reportReasons',reportSchema)

module.exports = reportModel