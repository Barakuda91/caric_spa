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
    sails.log(currentName+'.newUser');

    sails.models.users.create({
      username: 'Barakuda',
      passwordHash: '1111',
      email: 'barakudatm@gmail.com',
      firstName: 'Alexksandr',
      lastName: 'Istomin',
      status: 'admin'
    }).exec(function (err, finn){
      console.log(err, finn)
    });
  },
  auth: function () {
    sails.log(currentName+'.auth');

  }
};
