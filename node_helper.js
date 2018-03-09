/* Magic Mirror
 * Module: MagicMirror-Domoticz-Module
 *
 * By SpoturdDeal https://github.com/
 * MIT Licensed.
 */
var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
  start: function () {
    console.log('Domoticz helper started ...');
  },
  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, url) {
    if (notification === 'DOMOTICZ_READ') {
      //console.log(notification);
      var self = this;
      
      request(url, function(error, response, body) {
        //console.log(body)
        if (!error && response.statusCode == 200) {
          self.sendSocketNotification('DOMOTICZ_DATA', JSON.parse(body));
        }
      });
    }
  }
});