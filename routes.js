/* 
 * Title: Routes
 * Description: Application Routes
 * Author: Sanjoy Paul
 * Date: 7/5/2023
 * 
*/

// dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');

const routes = {
  'sample': sampleHandler,
  'user': userHandler
};

module.exports = routes;
