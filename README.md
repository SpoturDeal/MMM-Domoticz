# MMM-Domiticz

This <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> module allows you read data from your Domiticz Home Center


## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/spoturdeal/MMM-Domoticz.git`.
2. Add the module inside `config.js` placing it where you prefer ;)


## Config


|Option|Description|
|---|---|
|`updateInterval`|How fast do you like updates.<br>**Type:** `Integer`<br>**Default:** <i>45</i>| seconds |
|`apiBase`|The IP Address of your Domoticz.<br>**Type:** `string`<br>**Default:** <i>192.168.xxx.xxx</i>|
|`apiPort`|The port your Domiticz uses.<br>**Type:** `Integer`<br>**Default:** <i>8080</i>|
|`apiUser`| The username you use to login on your Domoticz. <br>**Type:** `string`<br>**Default:** <i>XXXX</i>|
|`apiPw`| The password you use to login.. <br>**Type:** `string`<br>**Default:** <i>xxxx</i>|
|`energyTitle`| Energy title. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>Energy used by</i>|
|`batteryTitle`| Battery title. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>Battery level</i>|
|`coTitle`| CO2 title. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>CO2 level</i>|
|`blindsTitle`| Blinds title. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>Blinds</i>|
|`voltageTitle`| Voltage title. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>Voltage/Current</i>|
|`alarmTitle`| Alarm title. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>Alarm system</i>|
|`alarmLabel`| Alarm label. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>Current alarm status:</i>|
|`energyNow`| The text for the energy you currently use. <br>**Type:** `string`<br>**Default:** <i>Currently</i>|
|`energyTotal`| The text of total energy used. <br>**Type:** `string`<br>**Default:** <i>Total used</i>|
|`energyToday`| The text of total energy used today. <br>**Type:** `string`<br>**Default:** <i>Today used</i>|
|`gasTotal`| The text of total gas used. <br>**Type:** `string`<br>**Default:** <i>Total gas used</i>|
|`gasToday`| The text of total gas used today. <br>**Type:** `string`<br>**Default:** <i>Today used gas</i>|
|`waterTotal`| The text of total water used. <br>**Type:** `string`<br>**Default:** <i>Total H2O used</i>|
|`waterToday`| The text of total water used today. <br>**Type:** `string`<br>**Default:** <i>Today used H2O</i>|
|`moduleTitle`| Defines the headline text.<br/>**Type:** `string`<br>**Default:** <i>My smart home by Domoticz</i>|
|`temperatureTitle`| Defines the temperature text.<br/>**Type:** `string`<br>**Default:** <i>Current temperatures Domoticz</i>|
|`batteryThreshold`|Below this value it will be shown.<br>**Type:** `Integer`<br>**Default:** <i>15</i>||
|`coThreshold`|Above this level in ppm it will be shown.<br>**Type:** `Integer`<br>**Default:** <i>700</i>|
|`showItems`| The items you like to show. <br> **Type** `array`<br> One of the following: `temperature, energy,battery,co,blinds,humidity,baro,usage,voltage,alarm,sensor,pulse` <br> **Default** <i>`temperature, energy`</i> |
|`subMenus`| Set if you want separate menus.<br/>**Type:** `boolean`<br>**Options:** true, false<br>**Default:** <i>true</i>|
|`smartMeter`| Set to true if you use a P1 USB smart meter.<br/>**Type:** `boolean`<br>**Options:** true, false<br>**Default:** <i>false</i>|
|`smartMeterOffset`| Set the beginning value of your smart meter.<br/>**Type:** `integer`<br>**Default:** <i>0</i>|
|`smartMeterGasOffset`| Set the beginning value of your smart gas meter.<br/>**Type:** `integer`<br>**Default:** <i>0</i>|
|`smartMeterWaterOffset`| Set the beginning value of your smart water meter.<br/>**Type:** `integer`<br>**Default:** <i>0</i>|
|`excludeDevices`| The device you like to show wich are ON. <br> **Type** `array`<br> One of the following: `Livingroom`, `Garden lights` <br> **Default** <i>`none`</i> |
|`onlyShowExcluded`| Only shows the devices that are in the excludedDevices array.<br>(For backward compatibility didn't change the name  excludedDevice setting)<br>**Type** `boolean`<br> **Default** <i>`false`</i> |
|`textWhite`| Set the text colour to white instead of grey. <br> **Type** `boolean`: true of false <br> **Default** <i>false</i> |
|`alarmOffLabel`|Label if alarm is off. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>Security Disarmed</i>|
|`alarmOnLabel`|Label if alarm is armed. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>Security Armed</i>|
|`groupSensors`| Group the values of one sensor. If **true** the name will not repeat and a hook is shown. On position left it sometimes give strange effects.<br> **Type** `boolean`: true of false <br> **Default** <i>false</i> |

Here is an example of an entry in `config.js`
```
{
	module: "MMM-Domoticz",
	position: "top_right",   // see mirror setting for options
	config: {          
		updateInterval: 45, // every 45 seconds
		apiBase: '192.168.xxx.xxx',
		apiPort: 8080,
		apiUser: "XXXX",
    		apiPw: "xxxx",
		moduleTitle: "My smart home by Domoticz",
		energyTitle: "Energy used by",
		batteryTitle: "Battery level",
		coTitle: "CO2 level",
		blindsTitle: "Blinds",
		energyNow: "Currently using",
		energyTotal: "Energy used",
		energyToday: "Energy used today",
		batteryThreshold: 20,
    		coThreshold: 650,
		subMenus: true,
		smartMeter: false,
		smartMeterOffset: 0,
		showItems: ['temperature','energy','battery','co','blinds','humidity','baro','usage','voltage','alarm','sensor','pulse'],   
		excludeDevices: ['none','add your own'],  // Device that will not be shown
		onlyShowExcluded: false, // if true only exluded devices are shown
		textWhite: false,
		alarmOffLabel: "Disabled",
		groupSensors: false
	}
}
```

## Screenshots
#### Display type: details
![Screenshot of detail mode](/screendomoticz.png?raw=true )

## Use an ESP32 WiFi module to controll your shutters
<a href="https://github.com/SpoturDeal/ESP32Stepper">Control your shutter with WiFi asnd ESP32 module</a>

## 22th April 2018
Added Humidity and Barometric pressure. Must be added in config.js to be shown grouped on the sensors name.

## 23th April 2018
Added current use of Watts please update config.js showItems with 'usage'
Added total and todays use of energy in kWh.

## 24th October 2018
Added alarm status requested by jacha05
Added Voltage and current requested by offgridonrocker
Changed error in example config.js (typo in excludedDevices is now excludeDevices).

## 15th Januari 2019
Added Alarm system texts update the config if needed
Re-Added Sensors made by BlackCatDeployment
Restructured layout scripts. 

## 21st May 2019 v1.18
Added support for SmartMeter p1 through USB
Added SmartMeter offset requested by 1kOhm
Changed excluded device to make it possible to only show selected Device requested by RienduPre
Changed power usage metering if using a smartmeter requested by RienduPre

## 25th May 2019 v1.23
Added smartMeter for Gas and Water
Added support for SO pulse meters

The MIT License (MIT)
=====================

Copyright © 2018 SpoturDeal - Carl

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the “Software”), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

**The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability,
fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability,
whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.**
