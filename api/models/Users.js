/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

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
    email: 'string',
    firstName: 'string',
    lastName: 'string',
    status: {
      type: 'string',
      enum: ['admin', 'moderator', 'user'],
      defaultsTo: 'user'
    },
    dateRegistration: 'string',
    dateLastVisit: 'string'
  },

  newUser: function () {
    sails.log('add new user');
  },
  auth: function () {
    sails.log('user auth');
  }
};

