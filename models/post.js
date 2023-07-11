const mongoose =  require('mongoose')
const ObjectId = mongoose.ObjectId
const User = require('./user');

const postSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    postBy: {
      type: Object,
      ref: 'User'
    },
    description: {
      type: String,
      required: true,
    },
    likesInfo: {
      likes: {
        type: Number,
        default: 0,
      },
      userList: [{
        type: ObjectId,
        ref: 'User'
      }]
    }
    ,
    image: {
      filename: {
        type: String,
        required: true,
      },
      contentType: {
        type: String,
        required: true,
      },
      data: {
        type: Buffer,
      },
    },
  });
  
  const Post = mongoose.model('Post', postSchema);
  
  module.exports = Post;