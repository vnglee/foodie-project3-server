const {model, Schema} = require('mongoose')

const userSchema = new Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        profilePic: {type: String, default: 'https://pwco.com.sg/wp-content/uploads/2020/05/Generic-Profile-Placeholder-v3-300x300.png'}
    },
    {
        timestamps: true,
        timeseries: true
    }
)

module.exports = model('User', userSchema)
