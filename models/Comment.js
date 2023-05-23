const {model, Schema} = require('mongoose')

const commentSchema = new Schema(
    {
        author: {type: Schema.Types.ObjectId, ref:'User'},
        comment: String
    },
    {
        timestamps: true,
        timeseries: true
    }
)

module.exports = model('Comment', commentSchema)