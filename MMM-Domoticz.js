/* Magic Mirror
 * Module: MagicMirror-Domoticz-Module
 * version 1.08 10th Januari 2019
 * By SpoturDeal https://github.com/SpoturDeal
 * MIT Licensed.
 */
 Module.register('MMM-Domoticz', {
	defaults: {
        updateInterval: 45,                          // every 45 seconds
        apiBase: '192.168.xx.xxx',                   // the IPaddress of you Domoticz HC in your home network
        apiPort: 8080,                               // just leave at 80
        moduleTitle: "My smart home by Domoticz",    //
        temperatureTitle:"Current temperatures",  // You can adapt the following text to fit your language
        energyTitle: "Energy used by",               // The tile for the energy use part
        batteryTitle: "Battery level",
        blindsTitle:  "Blinds",
        voltageTitle: "Voltage/Current",
        alarmTitle: "Current alarm status",
        coTitle: "CO2 level",
        energyNow: "Currently",                      // Label to show current use
        energyTotal: "Total used",                   // Label for total registred energy used
        energyToday: "Today used",                   // Label for energy used today
        showItems: ['temperature','energy','battery','co',
                    'blinds','humdity','baro','usage','voltage','alarm'],
        alarmOffLabel: "Disarmed",            
        batteryThreshold: 15,                        // if lower then threshold show
        coThreshold: 700,                            // if higher then threshold show
        subMenus: false,                             // true or false
        excludeDevices: ['none'],                    // Devices you don`t want to see
        textWhite: false,
        groupSensors:false                           // group the data from a single Sensor
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
    // recieved data
    var text = '<div>';
    var therm = ""; power = ""; batt = ""; co = ""; blinds = ""; humi=""; baro=""; tempName=""; volt=""; alarm="";
    // make separate tables if subMenus are required
    if (this.config.subMenus === true) {
       var therm ='<header class="module-header">' + this.config.temperatureTitle + '</header><table'+this.setTextColour()+'>';
       var power='<header class="module-header">' + this.config.energyTitle + '</header><table'+this.setTextColour()+'>';
       var batt ='<header class="module-header">' + this.config.batteryTitle + '</header><table'+this.setTextColour()+'>';
       var co ='<header class="module-header">' + this.config.coTitle + '</header><table'+this.setTextColour()+'>';
       var blinds ='<header class="module-header">' + this.config.moduleTitle + '</header><table'+this.setTextColour()+'>';
    } else {
       // make a single table without suBMenus
       text += '<header class="module-header">' + this.config.moduleTitle + '</header><table'+this.setTextColour()+'>';
    }
    // Set the counters to zero important if using submodules.
    var powerUse=0; usedEnergy=0; todayEnergy=0;
    var powerCount=0; tempCount=0; coCount=0; batteryCount=0;blindsCount=0;voltageCount=0;alarmCount=0;
    // loop the length of the received json file
    for (i=0;i<data.result.length;i++){
        // set for one device
        var dev=data.result[i];
        // Check if the device has been excluded. if not step through
        if (this.config.excludeDevices.indexOf(dev.Name) == -1) {
           // Device is reconized by Usage and only active if in config.js
           if (dev.Usage && this.config.showItems.indexOf('usage')!== -1 ){
              // add for current use
              wtt=dev.Usage.split(' ');
              if (wtt.length > 0){
                 powerUse += parseFloat(wtt[0]);
              }
              // add for total use
              wtt=dev.Data.split(' ');
              if (wtt.length > 0){
                 usedEnergy += parseFloat(wtt[0]);
              }
              // add for todays use
              wtt=dev.CounterToday.split(' ');
              if (wtt.length > 0){
                 todayEnergy += parseFloat(wtt[0]);
              }
           }
           if (dev.Type.indexOf('Temp') >- 1){
              // add to make sure temperature is added for display
              tempCount++;
              therm += '<tr><td class="small" >' + dev.Name  +'</td><td class="small '+ (dev.Temp< 0.6?'red':'')+'" >' + parseFloat(dev.Temp).toFixed(1);
              therm += '&deg; <i class="fa fa-thermometer-half"></i></td></tr>';
              // set a temporary name to prevent device names end double in groups
              tempName = dev.Name;
           } else if (dev.Data == "On" || dev.Data == "Set Level") {
              // add to make sure running device is added for display
              powerCount++
              cImage = parseInt(dev.CustomImage);
              // to select a different icon on the Mirror
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
              // add to make sure blinds are added for display
              blindsCount++;
              // use icons arrow up for open arrow down for close (no need for translation)
              blinds += '<tr><td class="small">' + dev.Name  +'</td><td class="small ' + (dev.Status=="Closed"?'yellow':'')+'"><i class="fa fa-arrow-' + (dev.Status=="Closed"?'down':'up') + '"></i></td></tr>';
          }
          if (dev.BatteryLevel <= this.config.batteryThreshold) {
              // add to make sure battery level is added for display
              batteryCount++;
              // On thresholt show half battery
              batteryIcon = "half"
              if (dev.BatteryLevel < this.config.batteryThreshold - 5){
                  // if 5% less then show quarter battery
                  batteryIcon = "quarter"
              } else if (dev.BatteryLevel < this.config.batteryThreshold - 10){
                  // if 10% less then show empty battery
                  batteryIcon = "empty"
              }
              // if level is 8% lower then threshold the color the device Name red
              batt += '<tr><td class="small '+(dev.BatteryLevel < this.config.batteryThreshold - 8?'red':'')+'">' + dev.Name + '</td><td class="small '+(dev.BatteryLevel< 15?'red':'') + '"><i class="fa fa-battery-' + batteryIcon + '"></i> ' + dev.BatteryLevel + '%</td></tr>';
          }
          if (dev.Type=="General"){
            if (dev.subType){
              if (dev.subType == "Voltage" || dev.subType == "Current"){
                 // For both current and voltage */
                 voltageCount++;
                 voltage += '<tr><td class="small">' + dev.Name  +'</td><td class="small ' + dev.Data+'"></td></tr>';
              }
            }
          }
          if (dev.Name == "Domoticz Security Panel"){
              // for domoticz alarm 
              alarmCount++;
              pts=dev.Data.split(' ');
              // The name Normal replaced by setting from config
              var disAm = 0;
              if (dev.Data=='Normal' || dev.Status=='Normal'){
                 var showTxt = this.config.alarmOffLabel;
                 if (!this.config.alarmOffLabel){
                    // force this label if config fails
                    showTxt='Disarmed';
                    disAm=1;
                 }
              } else {
                 var showTxt = dev.Status;
              }
              alarm += '<tr><td class="small">' + dev.Name  +'</td><td class="small '+(disAm==0?'red':'green') +'">' + showTxt +'</td></tr>';
          }
          if (dev.Type == "Air Quality"){
              pts=dev.Data.split(' ');
              if (pts[0] > this.config.coThreshold){
                 // add to make sure co2 is added for display
                 coCount++;
                 // if level is 300 above thresholt then color ppm in red
                 alarmLvl=this.config.coThreshold + 300;
                 co += '<tr><td class="small">' + dev.Name  +'</td><td class="small '+(pts[0] > alarmLvl?'red':'')+'">' + dev.Data + '</td></tr>';
              }
          }
          if (dev.Type.indexOf('Humidity') >- 1 && this.config.showItems.indexOf('humidity') !== -1){
              // add to make sure humidity is added to temperature for display
              if (this.config.groupSensors===true){
                 tempCount++;
                 var hookdir='└─';
                 if(this.data.position.endsWith("left")){
                     hookdir='─┘';
                 }
                 therm += '<tr><td class="small">' + (tempName != dev.Name?dev.Name:hookdir)  +'</td><td class="small">';
                 therm += parseInt(dev.Humidity) + '% <i class="fa fa-tint"></i></td></tr>';
                 // set a temporary name to prevent device names end double in groups
                 tempName = dev.Name;
              } else {
                 if (this.config.showItems.indexOf('humidity')){
                    humi += '<tr><td class="small">' + dev.Name  +'</td><td class="small">';
                    humi += parseInt(dev.Humidity) + '% <i class="fa fa-tint"></i></td></tr>';
                 }
              }
          }
          if (dev.Type.indexOf('Baro') >- 1 && this.config.showItems.indexOf('baro') !== -1){
              // add to make sure barometric pressure is added to temperature for display
              if (this.config.groupSensors===true){
                 tempCount++;
	               var hookdir='└─';
	               if(this.data.position.endsWith("left")){
	                   hookdir='─┘';
       	         }
                 therm += '<tr><td class="small">' + (tempName != dev.Name?dev.Name:hookdir)  +'</td><td class="small">';
                 therm += parseInt(dev.Barometer) + ' hPa</td></tr>';
              } else {
                 if (this.config.showItems.indexOf('baro')){
                    baro += '<tr><td class="small">' + dev.Name +'</td><td class="small">';
                    baro += parseInt(dev.Barometer) + ' hPa</td></tr>';
                 }
              }
          }
      }


    }
    therm += humi + baro;
    // for subMenu close all tables
    if (this.config.subMenus === true) {
       therm += '</table>';
       power += '</table>';
       batt += '</table>';
       blinds +='</table>';
       co += '</table>';
    }
    // Check which items are chose in config.js then add for Mirror
    if (tempCount >0 ){    text += (this.config.showItems.indexOf('temperature') !== -1?therm:''); }
    if (powerCount > 0){   text += (this.config.showItems.indexOf('energy') !== -1?power:''); }
    if (blindsCount > 0){  text += (this.config.showItems.indexOf('blinds') !== -1?blinds:'');  }
    if (alarmCount > 0){  text += (this.config.showItems.indexOf('alarm') !== -1?alarm:'');  }
    if (voltageCount > 0){  text += (this.config.showItems.indexOf('voltage') !== -1?voltage:'');  }
    if (batteryCount > 0){ text += (this.config.showItems.indexOf('battery') !== -1?batt:''); }
    if (coCount > 0){      text += (this.config.showItems.indexOf('co') !== -1?co:'');  }
    if (this.config.showItems.indexOf('usage')!== -1 ){
          if (this.config.subMenus === true) { text += '<table>'; }
          text += '<tr><td class="small">'+ this.config.energyNow +'</td><td class="small">' + parseFloat(powerUse).toFixed(1) + ' Watt</td></tr>';
          text += '<tr><td class="small">'+ this.config.energyToday +'</td><td class="small">' + parseFloat(todayEnergy).toFixed(3) + ' kWh</td></tr>';
          text += '<tr><td class="small">'+ this.config.energyTotal +'</td><td class="small">' + parseFloat(usedEnergy).toFixed(1) + ' kWh</td></tr>';
          if (this.config.subMenus === true) { text += '</table>'; }
    }
    // if there were no subMenus then we must close the single table
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
  setTextColour: function(){
    return (this.config.textWhite===true?' class="white" ':'');
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
