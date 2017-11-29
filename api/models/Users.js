/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var currentName = 'UsersModel';
module.exports = {

  attributes: {
    username: {
      type: 'string',
      required: true
    },
    passwordHash: {
      type: 'string',
      required: true
    },
    email:  {
      type: 'string',
      required: true
    },
    status: {
      type: 'string',
      enum: ['admin', 'moderator', 'user'],
      defaultsTo: 'user'
    },
    language: {
      type: 'string',
      enum: ['ru', 'en', 'ua'],
      defaultsTo: 'ru'
    }
  }
};
