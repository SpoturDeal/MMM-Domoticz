/* Magic Mirror
 * Module: MagicMirror-Domoticz-Module
 *
 * By SpoturDeal https://github.com/SpoturDeal
 * MIT Licensed.
 */
 Module.register('MMM-Domoticz', {
	defaults: {
        updateInterval: 45,                          // every 45 seconds
        apiBase: '192.168.xx.xxx',                   // the IPaddress of you Domoticz HC in your home network
        apiPort: 8088,                                 // just leave at 80
        apiEndpoint: 'json.htm?type=devices&filter=temp&used=true&order=Name',   // access to api
        moduleTitle: "Current temperatures Domoticz",  // You can adapt the following text to fit your language
        energyTitle: "Energy use",                   // The tile for the energy use part
        energyNow: "Currently",                      // Label to show current use
        energyTotal: "Total used",                   // Label for total registred energy used
        showItems: ['temperature']          // Currently available temperature, energy     
	},
	start: function() {
		Log.info('Starting module: ' + this.name);
		this.update();
		// refresh every x seconden
		setInterval(
			this.update.bind(this),
			this.config.updateInterval * 1000);
	},
	update: function(){
		this.sendSocketNotification(
			'DOMOTICZ_READ',
			'http://' + this.config.apiUser + ':' + this.config.apiPw + '@' + this.config.apiBase + ":" + this.config.apiPort + "/" + this.config.apiEndpoint);
	},
	render: function(data){
		var text = '<div>';
        var therm ='<header class="module-header">' + this.config.moduleTitle + '</header><table>';
        var powerUse=0;
        var usedEnergy=0;
        for (i=0;i<data.result.length;i++){
            var dev=data.result[i];
            
               therm += '<tr><td class="small">' + dev.Name + '</td><td class="small '+(dev.Temp< 0.6?'red':'')+'">' + parseFloat(dev.Temp).toFixed(1) + "&deg;</td></tr>";   
            
        }           
        therm += '</table>';
        
        //var power='<header class="module-header">' + this.config.energyTitle + '</header>';
        //power +='<table><tr><td class="small">' + this.config.energyNow + '</td><td class="small">' + powerUse.toFixed(2) +' Watt</td></tr>';
        //power +='<tr><td class="small">' + this.config.energyTotal +'</td><td class="small">' + usedEnergy.toFixed(2) +' kWh</td></tr></table>';
        
        text += (this.config.showItems.indexOf('temperature') !== -1?therm:'');
        //text += (this.config.showItems.indexOf('energy') !== -1?power:''); 
        text += '</div>';
        
		this.loaded = true;
		// only update dom if content changed
		if(this.dom !== text){
			this.dom = text;
			this.updateDom(this.config.animationSpeed);
		}
	},
	html: {
		loading: '<div class="dimmed light small">Loading Domoticz data ....</div>'
		
	},
	getScripts: function() {
		return [
			'String.format.js',
			'//cdnjs.cloudflare.com/ajax/libs/jquery/2.2.2/jquery.js'
		];
	},
	getStyles: function() {
		return ['domoticz.css'];
	},
	getDom: function() {
		var content = '';
		if (!this.loaded) {
			content = this.html.loading;
		}else if(this.data.position.endsWith("left")){
			content = '<ul class="flip">'+this.dom+'</ul>';
		}else{
			content = '<ul>'+this.dom+'</ul>';
		}
		return $('<div class="domoticz">'+content+'</div>')[0];
	},
    socketNotificationReceived: function(notification, payload) {
      if (notification === 'DOMOTICZ_DATA') {
          console.log('received DOMOTICZ_DATA');
		  this.render(payload);
      }
    }
});