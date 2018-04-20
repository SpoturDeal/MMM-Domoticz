/* Magic Mirror
 * Module: MagicMirror-Domoticz-Module
 * version 1.05 20th April 2018
 * By SpoturDeal https://github.com/SpoturDeal
 * MIT Licensed.
 */
 Module.register('MMM-Domoticz', {
	defaults: {
        updateInterval: 45,                          // every 45 seconds
        apiBase: '192.168.xx.xxx',                   // the IPaddress of you Domoticz HC in your home network
        apiPort: 8080,                               // just leave at 80
        moduleTitle: "My smart home",                //
        temperatureTitle:"Current temperatures Domoticz",  // You can adapt the following text to fit your language
        energyTitle: "Energy used by",                 // The tile for the energy use part
        batteryTitle: "Battery level",
        blindsTitle:  "Blinds",
        coTitle: "CO2 level",
        energyNow: "Currently",                      // Label to show current use
        energyTotal: "Total used",                   // Label for total registred energy used
        showItems: ['temperature','energy','battery','co','blinds'],
        batteryThreshold: 15,                        // if lower then threshold show
        coThreshold: 700,                            // if higher then threshold show
        subMenus: true,                              // true or false
        excludeDevices: ['none']                     // Devices you don`t want to see
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
			'http://' + this.config.apiUser + ':' + this.config.apiPw + '@' + this.config.apiBase + ":" + this.config.apiPort + '/json.htm?type=devices&used=true&order=Name');
	},
	render: function(data){

    var text = '<div>';
    var therm = ""; power = ""; batt = ""; co = ""; blinds = ""; humi="";
    if (this.config.subMenus === true) {
       var therm ='<header class="module-header">' + this.config.temperatureTitle + '</header><table>';
       var power='<header class="module-header">' + this.config.energyTitle + '</header><table>';
       var batt ='<header class="module-header">' + this.config.batteryTitle + '</header><table>';
       var co ='<header class="module-header">' + this.config.coTitle + '</header><table>';
       var blinds ='<header class="module-header">' + this.config.moduleTitle + '</header><table>';
    } else {
       text += '<header class="module-header">' + this.config.moduleTitle + '</header><table>';
    }
    var powerUse=0; usedEnergy=0;
    var powerCount=0; tempCount=0; coCount=0; batteryCount=0;blindsCount=0;
    for (i=0;i<data.result.length;i++){
        var dev=data.result[i];
        if (this.config.excludeDevices.indexOf(dev.Name) == -1) {
           if (dev.Type.indexOf('Temp') >- 1){
              tempCount++;
              therm += '<tr><td class="small">' + dev.Name  +'</td><td class="small '+ (dev.Temp< 0.6?'red':'')+'">' + parseFloat(dev.Temp).toFixed(1);
              therm += '&deg; <i class="fa fa-thermometer-half"></i></td></tr>';
           } else if (dev.Data == "On" || dev.Data == "Set Level") {
              powerCount++
              cImage = parseInt(dev.CustomImage);
              switch (cImage) {
                case 1:
                    icon="fa-plug"
                    break;
                case 2:
                    icon="fa-television"
                    break;
                case 9:
                    icon="fa-power-off"
                    break;
                case 17:
                    icon="fa-desktop"
                    break;
                default:
                    icon="fa-lightbulb-o"
              }
              power += '<tr><td class="small">' + dev.Name + '</td><td class="small "><i class="fa ' + icon + '"></i></td></tr>';
           }
          if (dev.SwitchType == "Blinds" || dev.SwitchType == "Blinds Inverted"){
              blindsCount++;
              blinds += '<tr><td class="small">' + dev.Name  +'</td><td class="small ' + (dev.Status=="Closed"?'yellow':'')+'"><i class="fa fa-arrow-' + (dev.Status=="Closed"?'down':'up') + '"></i></td></tr>';
          }
          if (dev.BatteryLevel <= this.config.batteryThreshold) {
              batteryCount++;
              batteryIcon = "fa-battery-half"
              if (dev.BatteryLevel < 15){
                  batteryIcon = "fa-battery-quarter"
              }
              batt += '<tr><td class="small '+(dev.BatteryLevel< 15?'red':'')+'">' + dev.Name + '</td><td class="small '+(dev.BatteryLevel< 15?'red':'') + '"><i class="fa ' + batteryIcon + '"></i> ' + dev.BatteryLevel + '%</td></tr>';
          }
          if (dev.Type == "Air Quality"){
              pts=dev.Data.split(' ');
              if (pts[0] > this.config.coThreshold){
                 coCount++;
                 alarmLvl=this.config.coThreshold + 200;
                 co += '<tr><td class="small">' + dev.Name  +'</td><td class="small '+(pts[0] > alarmLvl?'red':'')+'">' + dev.Data + '</td></tr>';
              }
          }
          if (dev.Type.indexOf('Humidity') >- 1){
              tempCount++;
              humi += '<tr><td class="small">' + dev.Name  +'</td><td class="small">';
              humi += parseInt(dev.Humidity) + '% <i class="fa fa-tint"></i></td></tr>';
          }
      }


    }
    therm += humi;
    if (this.config.subMenus === true) {
       therm += '</table>';
       power += '</table>';
       batt += '</table>';
       blinds +='</table>';
       co += '</table>';
    }
    //power +='<table><tr><td class="small">' + this.config.energyNow + '</td><td class="small">' + powerUse.toFixed(2) +' Watt</td></tr>';
    //power +='<tr><td class="small">' + this.config.energyTotal +'</td><td class="small">' + usedEnergy.toFixed(2) +' kWh</td></tr></table>';
    if (tempCount >0 ){    text += (this.config.showItems.indexOf('temperature') !== -1?therm:''); }
    if (powerCount > 0){   text += (this.config.showItems.indexOf('energy') !== -1?power:''); }
    if (batteryCount > 0){ text += (this.config.showItems.indexOf('battery') !== -1?batt:''); }
    if (blindsCount > 0){  text += (this.config.showItems.indexOf('blinds') !== -1?blinds:'');  }
    if (coCount > 0){      text += (this.config.showItems.indexOf('co') !== -1?co:'');  }
    if (this.config.subMenus !== true) {
        text +='</table>';
    }
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
		return ['domoticz.css',
            'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'];
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
