/* 
 * Title: User Handler
 * Description: Handler to handle user related routes
 * Author: Sanjoy Paul
 * Date: 7/7/2023
 * 
*/

// dependencies
const data = require('../../lib/data');
const { hash, parseJSON } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ['get', 'post', 'put', 'delete'];

  if (acceptedMethods.includes(requestProperties.method)) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }

};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
  const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
  const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
  const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
  const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;
  const tosAgreement = typeof requestProperties.body.tosAgreement === 'boolean' ? requestProperties.body.tosAgreement : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    // make sure that the user doesn't already exists
    data.read('users', phone, (err) => {
      if (err) {
        let userObj = {
          firstName, 
          lastName,
          phone,
          password: hash(password),
          tosAgreement
        };

        // store the user to db
        data.create('users', phone, userObj, (err2) => {
          if (!err2) {
            callback(200, {
              message: 'User was created successfully!',
            })
          } else {
            callback(500, {
              error: 'Could not create user!',
            })
          }
        })
      } else {
        callback(500, {
          error: 'There was a problem in server side',
        })
      }
    })
  } else {
    // 400 - client request problem
    callback(400, {
      error: 'You have a problem in your request',
    });
  }
};

// @TODO - Authentication
handler._users.get = (requestProperties, callback) => {
  // check the phone number is valid
  const phone = typeof requestProperties.queryStringObj.phone === 'string' && requestProperties.queryStringObj.phone.trim().length === 11 ? requestProperties.queryStringObj.phone : false;

  if (phone) {
    // lookup the user
    data.read('users', phone, (err, user) => {
      const userData = {...parseJSON(user)};
      if (!err && user) {
        delete userData.password;
        callback(200, userData);
      } else {
        callback(404, {
          error: 'Requested user was not found',
        });
      }
    })
  } else {
    callback(404, {
      error: 'Requested user was not found',
    });
  }
};

// @TODO - Authentication
handler._users.put = (requestProperties, callback) => {
  const firstName = typeof requestProperties.body.firstName === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;
  const lastName = typeof requestProperties.body.lastName === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;
  const phone = typeof requestProperties.body.phone === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
  const password = typeof requestProperties.body.password === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

  if (phone) {
    if (firstName || lastName || password) {
      // lookup the user
      data.read('users', phone, (err, userData) => {
        const user = { ...parseJSON(userData) };
        if (!err && user) {
          if (firstName) {
            user.firstName = firstName;
          }
          if (lastName) {
            user.lastName = lastName;
          }
          if (password) {
            user.password = hash(password);
          }

          // store to database
          data.update('users', phone, user, (err2) => {
            if (!err2) {
              callback(200, {
                message: 'User was updated successfully!',
              });
            } else {
              callback(500, {
                error: 'There was problem in server side!',
              });
            }
          });
        } else {
          callback(400, {
            error: 'You have a problem in your request!'
          })
        }
      });
    } else {
      callback(400, {
        error: 'You have a problem in your request!',
      });
    }
  } else {
    callback(400, {
      error: 'Invalid phone number. Please try again later!',
    });
  }
};

// @TODO - Authentication
handler._users.delete = (requestProperties, callback) => {
  // check the phone number is valid
  const phone = typeof requestProperties.queryStringObj.phone === 'string' && requestProperties.queryStringObj.phone.trim().length === 11 ? requestProperties.queryStringObj.phone : false;

  if (phone) {
    // lookup the user
    data.read('users', phone, (err, userData) => {
      if (!err && userData) {
        data.delete('users', phone, (err2) => {
          if (!err2) {
            callback(200, {
              message: 'User was successfully deleted!'
            });
          } else {
            callback(500, {
              error: 'There was a server side error!',
            });
          }
        })
      } else {
        callback(500, {
          error: 'There was a server side error!',
        });
      }
    })
  } else {
    callback(400, {
      error: 'There was a problem in your request!',
    });
  }
};

module.exports = handler;