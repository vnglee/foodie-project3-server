const {model, Schema} = require('mongoose')

const postSchema = new Schema(
    {
        author: {type: Schema.Types.ObjectId, ref: 'User'},
        post: String,
        likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
        image: String,
        comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
        type: {type: String, default: "general"}
    },
    {
        timestamps: true,
        timeseries: true
    }
)

module.exports = model('Post', postSchema)