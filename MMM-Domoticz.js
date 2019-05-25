/* Magic Mirror
 * Module: MagicMirror-Domoticz-Module
 * version 1.23 25th May 2019
 * By SpoturDeal https://github.com/SpoturDeal
 * MIT Licensed.
 */
 Module.register('MMM-Domoticz', {
	defaults: {
        updateInterval: 45,                          // every 45 seconds
        apiBase: '192.168.xx.xxx',                   // the IPaddress of you Domoticz HC in your home network
        apiPort: 8080,                               // just leave at 80
        moduleTitle: "My smart home by Domoticz",    //
        temperatureTitle:"Current temperatures",     // You can adapt the following text to fit your language
        energyTitle: "Energy used by",               // The tile for the energy use part
        batteryTitle: "Battery level",
        blindsTitle:  "Blinds",
        voltageTitle: "Voltage/Current",
        alarmTitle: "Alarm system",
        alarmLabel: "Current alarm status",
        pulseLabel: "Pulse meters",
        coTitle: "CO2 level",
        sensorTitle: "Window/Door sensors",
        energyNow: "Currently",                      // Label to show current use
        energyTotal: "Total used",                   // Label for total registred energy used
        energyToday: "Today used",                   // Label for energy used today
        gasTotal: "Total used gas",                   // Label for total registred gas used
        gasToday: "Today used gas",                   // Label for gas used today
        waterTotal: "Total used H2O",                   // Label for total registred water used
        waterToday: "Today used H2O",                   // Label for water used today
        showItems: ['temperature','energy','battery','co',
                    'blinds','humdity','baro','usage','voltage','alarm','sensor','pulse'],
        alarmOffLabel: "Security Disarmed",
        alarmOnLabel: "Security Armed",            
        smartMeter: false,
        smartMeterOffset: 0,
        smartMeterGasOffset: 0,
        smartMeterWaterOffset: 0,
        batteryThreshold: 15,                        // if lower then threshold show
        coThreshold: 700,                            // if higher then threshold show
        subMenus: false,                             // true or false
        excludeDevices: ['none'],                    // Devices you don`t want to see
        onlyShowExcluded: false,                     // Only show the excluded devices
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
    var therm = ""; power = ""; batt = ""; co = ""; blinds = ""; humi=""; baro=""; tempName=""; volt=""; alarm=""; sensor="";pulse="";
    // set the most used html parts as variables
    var headClass='<header class="module-header sub-header">';
    var headTab='</header><table'+this.setTextColour()+' class="sub-header">';
    var trClassSmall='<tr><td class="small">';
    var trClassOpenSmall='<tr><td class="small ';
    var tdClassOpenSmall='</td><td class="small ';
    var tdEndOpenSmall='" >';
    var tdEndClassSmall='</td><td class="small">';
    var endLine='</td></tr>';
    var endTable='</table>';
    // make separate tables if subMenus are required
    if (this.config.subMenus === true) {
       therm = headClass + this.config.temperatureTitle + headTab;
       power = headClass + this.config.energyTitle + headTab;
       batt = headClass + this.config.batteryTitle + headTab;
       co = headClass + this.config.coTitle + headTab;
       blinds = headClass + this.config.moduleTitle + headTab;
       alarm = headClass + this.config.alarmTitle + headTab;
       sensor = headClass + this.config.sensorTitle + headTab;
       pulse = headClass + this.config.pulseLabel + headTab;
    } else {
       // make a single table without suBMenus
       text += headClass + this.config.moduleTitle + headTab;
    }
    // Set the counters to zero important if using submodules.
    var powerUse=0; usedEnergy=0; todayEnergy=0; usedGas=0; todayGas=0;usedWater=0;todayWater=0;
    var powerCount=0; tempCount=0; coCount=0; batteryCount=0;blindsCount=0;voltageCount=0;alarmCount=0;sensorCount=0;pulseCount=0;
    // loop the length of the received json file
    for (i=0;i<data.result.length;i++){
        // set for one device
        var dev=data.result[i];
        // Check if the device has been excluded. if not step through
        if ((this.config.excludeDevices.indexOf(dev.Name) == -1  && this.config.onlyShowExcluded === false) ||
             (this.config.excludeDevices.indexOf(dev.Name) >= -1  && this.config.onlyShowExcluded === true) ) {
           // Device is reconized by Usage and only active if in config.js
           if ((dev.Usage || dev.Type == "RFXMeter") && this.config.showItems.indexOf('usage')!== -1 ){
              if (this.config.smartMeter==false){
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
              } else {
                 if (dev.HardwareType == 'P1 Smart Meter USB' && dev.SubType == 'Energy'){
                    usedEnergy=dev.Counter - this.config.smartMeterOffset;
                    todayEnergy=dev.CounterToday
                    powerUse=dev.Usage
                 }
                 if (dev.HardwareType == 'P1 Smart Meter USB' && dev.SubType == 'Gas'){
                    usedGas=dev.Counter - this.config.smartMeterGasOffset;
                    wtt=dev.CounterToday.split(' ');
                    if (wtt.length > 0){
                      todayGas=wtt[0]
                    }
                 }
                 if (dev.HardwareType == 'S0 Meter USB' && dev.SubType == 'RFXMeter counter'){
                    wtt=dev.Counter.split(' ');
                    if (wtt.length > 0){
                      usedWater=wtt[0] - this.config.smartMeterWaterOffset;
                    }
                    wtt=dev.CounterToday.split(' ');
                    if (wtt.length > 0){
                      todayWater=wtt[0]
                    }
                 }   
              }
           }
           if (dev.Type.indexOf('Temp') >- 1){
              // add to make sure temperature is added for display
              tempCount++;
              therm += trClassSmall + dev.Name  + tdClassOpenSmall + (dev.Temp< 0.6?'red':'')+ tdEndOpenSmall + parseFloat(dev.Temp).toFixed(1);
              therm += '&deg; <i class="fa fa-thermometer-half"></i>' + endLine;
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
              power += trClassSmall + dev.Name + tdEndClassSmall+'<i class="fa ' + icon + '"></i>' + endLine;
          }
          if (dev.SwitchType == "Blinds" || dev.SwitchType == "Blinds Inverted"){
              // add to make sure blinds are added for display
              blindsCount++;
              // use icons arrow up for open arrow down for close (no need for translation)
              blinds += trClassSmall + dev.Name  + tdClassOpenSmall + (dev.Status=="Closed"?'yellow':'')+'"><i class="fa fa-arrow-' + (dev.Status=="Closed"?'down':'up') + '"></i>' + endLine;
          }
          if (dev.Type == "Light/Switch" && (dev.SwitchType == "Door Contact" || dev.SwitchType == "Contact")){
              // add to make sure sensors are added for display
              sensorCount++;
              // use icons toggle on for open toggle off for close (no need for translation)
              sensor += trClassSmall + dev.Name  + tdClassOpenSmall + (dev.Status=="Closed"?'green':'red')+'"><i class="fa fa-toggle-' + (dev.Status=="Closed"?'off':'on') + tdEndOpenSmall + endLine;
          }
          if (dev.HardwareName == "SO Pulse counter"){
              pulseCount++;
              pulse += trClassSmall + dev.Name  + tdEndClassSmall + dev.CounterToday + endLine; 
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
              batt += trClassOpenSmall +(dev.BatteryLevel < this.config.batteryThreshold - 8?'red':'')+'">' + dev.Name + tdClassOpenSmall +(dev.BatteryLevel< 15?'red':'') + '"><i class="fa fa-battery-' + batteryIcon + '"></i> ' + dev.BatteryLevel + '%'  + endLine;
          }
          if (dev.Type=="General"){
            if (dev.subType){
              if (dev.subType == "Voltage" || dev.subType == "Current"){
                 // For both current and voltage */
                 voltageCount++;
                 voltage += trClassSmall + dev.Name  + tdClassOpenSmall + dev.Data+'">' + endLine;
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
                 disAm = 1;
                 if (!this.config.alarmOffLabel){
                    // force this label if config fails
                    showTxt='Security Disarmed';
                 }
              } else {
                 var showTxt = this.config.alarmOnLabel;
                 if (!this.config.alarmOnLabel){
                    // force this label if config fails
                    showTxt=dev.Status;
                 }
              }
                            
              alarm += trClassOpenSmall +(disAm==0?'red':'')+ '">' + showTxt + tdEndClassSmall + '&nbsp;<i class="fa fa-'+(disAm==1?'un':'')+'lock"></i>'  + endLine;
              
          }
          if (dev.Type == "Air Quality"){
              pts=dev.Data.split(' ');
              if (pts[0] > this.config.coThreshold){
                 // add to make sure co2 is added for display
                 coCount++;
                 // if level is 300 above thresholt then color ppm in red
                 alarmLvl=this.config.coThreshold + 300;
                 co += trClassSmall + dev.Name  + tdClassOpenSmall +(pts[0] > alarmLvl?'red':'')+ tdEndOpenSmall + dev.Data  + endLine;
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
                 therm += trClassSmall + (tempName != dev.Name?dev.Name:hookdir) + tdEndClassSmall;
                 therm += parseInt(dev.Humidity) + '% <i class="fa fa-tint"></i>' + endLine;
                 // set a temporary name to prevent device names end double in groups
                 tempName = dev.Name;
              } else {
                 if (this.config.showItems.indexOf('humidity')){
                    humi += trClassSmall + dev.Name  + tdEndClassSmall;
                    humi += parseInt(dev.Humidity) + '% <i class="fa fa-tint"></i>' + endLine;
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
                 therm += trClassSmall + (tempName != dev.Name?dev.Name:hookdir)  + tdEndClassSmall;
                 therm += parseInt(dev.Barometer) + ' hPa' + endLine;
              } else {
                 if (this.config.showItems.indexOf('baro')){
                    baro += trClassSmall + dev.Name + tdEndClassSmall;
                    baro += parseInt(dev.Barometer) + ' hPa' + endLine;
                 }
              }
          }
      }


    }
    therm += humi + baro;
    // for subMenu close all tables
    if (this.config.subMenus === true) {
       therm += endTable;
       power += endTable;
       batt += endTable;
       blinds += endTable;
       co += endTable;
       alarm += endTable;
       sensor += endTable;
       pulse += endTable;
    }
    // Check which items are chose in config.js then add for Mirror
    if (tempCount >0 ){    text += (this.config.showItems.indexOf('temperature') !== -1?therm:''); }
    if (powerCount > 0){   text += (this.config.showItems.indexOf('energy') !== -1?power:''); }
    if (blindsCount > 0){  text += (this.config.showItems.indexOf('blinds') !== -1?blinds:'');  }
    if (alarmCount > 0){  text += (this.config.showItems.indexOf('alarm') !== -1?alarm:'');  }
    if (voltageCount > 0){  text += (this.config.showItems.indexOf('voltage') !== -1?voltage:'');  }
    if (batteryCount > 0){ text += (this.config.showItems.indexOf('battery') !== -1?batt:''); }
    if (coCount > 0){      text += (this.config.showItems.indexOf('co') !== -1?co:'');  }
    if (sensorCount > 0){  text += (this.config.showItems.indexOf('sensor') !== -1?sensor:'');  }
    if (pulseCount > 0){  text += (this.config.showItems.indexOf('pulse') !== -1?pulse:'');  }

    if (this.config.showItems.indexOf('usage')!== -1 ){
          if (this.config.subMenus === true) { text +=  endTable; }
          text += trClassSmall + this.config.energyNow + tdEndClassSmall + parseFloat(powerUse).toFixed(1) + ' Watt' + endLine;
          text += trClassSmall + this.config.energyToday + tdEndClassSmall + parseFloat(todayEnergy).toFixed(3) + ' kWh' + endLine;
          text += trClassSmall + this.config.energyTotal + tdEndClassSmall + parseFloat(usedEnergy).toFixed(1) + ' kWh' + endLine;
          if (usedGas > 5){
             text += trClassSmall + this.config.gasToday + tdEndClassSmall + parseFloat(todayGas).toFixed(3) + ' m3' + endLine;
             text += trClassSmall + this.config.gasTotal + tdEndClassSmall + parseFloat(usedGas).toFixed(1) + ' m3' + endLine;
          }
           if (usedWater > 5){
             text += trClassSmall + this.config.waterToday + tdEndClassSmall + parseFloat(todayWater).toFixed(3) + ' ltr' + endLine;
             text += trClassSmall + this.config.waterTotal + tdEndClassSmall + parseFloat(usedWater).toFixed(1) + ' m3' + endLine;
          }
          
          if (this.config.subMenus === true) { text += endTable; }
    }
    // if there were no subMenus then we must close the single table
    if (this.config.subMenus !== true) {
        text += endTable;
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