# MMM-Domiticz

This <a href="https://github.com/MichMich/MagicMirror">MagicMirror</a> module allows you read data from your Domiticz Home Center


## Installation
1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/spoturdeal/MMM-Domoticz.git`.
2. Add the module inside `config.js` placing it where you prefer ;)


## Config


|Option|Description|
|---|---|
|`updateInterval`|How fast do you like updates.<br>**Type:** `Integer`<br>**Default:** <i>45</i>| seconds 
|`apiBase`|The IP Address of your Domoticz.<br>**Type:** `string`<br>**Default:** <i>192.168.xxx.xxx</i>|
|`apiPort`|The port your Domiticz uses.<br>**Type:** `Integer`<br>**Default:** <i>8080</i>|
|`apiUser`| The username you use to login on your Domoticz. <br>**Type:** `string`<br>**Default:** <i>XXXX</i>
|`apiPw`| The password you use to login.. <br>**Type:** `string`<br>**Default:** <i>xxxx</i>
|`energyTitle`| Energy title. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>Energy used by</i>
|`batteryTitle`| Battery title. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>Battery level</i>
|`coTitle`| CO2 title. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>CO2 level</i>
|`blindsTitle`| Blinds title. <br>**Type:** `string`<br>**Options:** Anything<br/>**Default:** <i>Blinds</i>
|`energyNow`| The text for the energy you currently use. <br>**Type:** `string`<br>**Default:** <i>Currently</i>
|`energyTotal`| The text of total energy used. <br>**Type:** `string`<br>**Default:** <i>Energy used</i>
|`moduleTitle`| Defines the headline text.<br/>**Type:** `string`<br>**Default:** <i>Current temperatures Domiticz</i>
|`batteryThreshold`|Below this value it will be shown.<br>**Type:** `Integer`<br>**Default:** <i>15</i>|
|`coThreshold`|Above this level in ppm it will be shown.<br>**Type:** `Integer`<br>**Default:** <i>700</i>|
|`showItems`| The items you like to show. <br> **Type** `array`<br> One of the following: `temperature, energy` <br> **Default** <i>`temperature, energy`</i> |
|`subMenus`| Set if you want separate menus.<br/>**Type:** `boolean`<br>**Options:** true, flase<br>**Default:** <i>true</i>
|`excludeDevices`| The device you like to show wich are ON. <br> **Type** `array`<br> One of the following: `Livingroom`, `Garden lights` <br> **Default** <i>`none`</i> |

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
		moduleTitle: "Current temperatures Domiticz",
		energyTitle: "Energy used by",
		batteryTitle: "Battery level",
		coTitle: "CO2 level",
		blindsTitle: "Blinds",
		energyNow: "Currently",
		energyTotal: "Energy used",
		batteryThreshold: 20,
                coThreshold: 650,
		subMenus: true,
		showItems: ['temperature','energy','battery','co','blinds'],   // possible items  temperature, energy
		excludedDevices: ['none','add your own']  // Device that will not be shown
	}
}
```

## Screenshots
#### Display type: details
![Screenshot of detail mode](/screendomoticz.png?raw=true )

## Use an ESP32 WiFi module to controll your shutters 
<a href="https://github.com/SpoturDeal/ESP32Stepper">Control your shutter with WiFi asnd ESP32 module</a>


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
