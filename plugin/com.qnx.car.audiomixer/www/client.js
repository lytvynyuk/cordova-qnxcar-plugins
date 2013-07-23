/*
 * Copyright 2013  QNX Software Systems Limited
 * 
 * Licensed under the Apache License, Version 2.0 (the "License"). You
 * may not reproduce, modify or distribute this software except in
 * compliance with the License. You may obtain a copy of the License
 * at: http://www.apache.org/licenses/LICENSE-2.0.
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTIES OF ANY KIND, either express or implied.
 * This file may contain contributions from others, either as
 * contributors under the License or as licensors under other terms.
 * Please review this entire file for other proprietary rights or license
 * notices, as well as the applicable QNX License Guide at
 * http://www.qnx.com/legal/licensing/document_archive/current_matrix.pdf
 * for other information.
 */
 
/**
 * @name car.audiomixer
 * @static
 *
 * Controls the audio mixer 
 */
 
 /*
  * @author mlapierre
  * $Id: client.js 4326 2012-09-27 17:43:24Z mlapierre@qnx.com $
  */


var _self = {},
	_ID = 'com.qnx.car.audiomixer',
	_utils = cordova.require('cordova/utils'),
	_watches = {};


/** 
 * @property AudioMixerSetting An enumeration of audio mixer settings 
 * @example
 * //to refer to the volume setting
 * car.audiomixer.AudioMixerSetting.VOLUME  //returns 'volume'
 */
_self.AudioMixerSetting = require('./AudioMixerSetting');


/**
 * Handles update events for this extension
 * @param data {Array} The updated data provided by the event 
 * @private
 */
function onUpdate(data) {
	var keys = Object.keys(_watches);
	for (var i=0; i<keys.length; i++) {
		setTimeout(_watches[keys[i]](data), 0);
	}
}

/**
 * Watch for audio mixer changes
 * @param {Function} callback The function to be called when a change is detected
 * @return {Number} An id for the added watch
 * @example
 * 
 * //define a callback function
 * function myCallback(audioMixerItems) {
 *	  //iterate through the changed items
 *	  for (var i=0; i<audioMixerItems.length; i++) {
 *		  console.log("audio mixer item setting = " + audioMixerItems[i].setting + '\n' + //a car.audiomixer.AudioMixerSetting value
 *					  "audio mixer item zone = " + audioMixerItems[i].zone + '\n' +	   //a car.Zone value
 *					  "audio mixer item value = " + audioMixerItems[i].value + '\n\n');   //a numeric value
 *	  }
 * }
 * 
 * var watchId = car.audiomixer.watchAudioMixer(myCallback);
 */
_self.watchAudioMixer = function (callback) {
	var watchId = _utils.createUUID();
	
	_watches[watchId] = callback;
	if (Object.keys(_watches).length === 1) {
		window.cordova.exec(onUpdate, null, _ID, 'startEvents', null, false);
	}

	return watchId;
}


/**	
 * Stop watching audio mixer changes
 * @param {Number} watchId The watch id returned by car.audiomixer.watchAudioMixer
 * @example
 * 
 * car.audiomixer.cancelWatch(watchId);
 */
_self.cancelWatch = function (watchId) {
	if (_watches[watchId]) {
		delete _watches[watchId];
		if (Object.keys(_watches).length === 0) {
			window.cordova.exec(null, null, _ID, 'stopEvents', null, false);
		}
	}
}


/**
 * Return the audio mixer settings for a specific zone
 * If successful, it calls the successCallback with a Zone object for the specific zone.
 * @param {Function} successCallback The callback that is called with the result on success
 * @param {Function} errorCallback (Optional) The callback that is called if there is an error
 * @param {String} zone (Optional) The Zone to filter the results by
 * @see car.Zone
 * @example 
 *
 * //define your callback function(s)
 * function successCallback(audioMixerItems) {
 *	  //iterate through all the audio mixer items
 *	  for (var i=0; i<audioMixerItems.length; i++) {
 *		  console.log("audio mixer item setting = " + audioMixerItems[i].setting + '\n' + //a car.audiomixer.AudioMixerSetting value
 *					  "audio mixer item zone = " + audioMixerItems[i].zone + '\n' +	   //a car.Zone value
 *					  "audio mixer item value = " + audioMixerItems[i].value);			//a numeric value
 *	  }
 * }
 *
 * function errorCallback(error) {
 *	  console.log(error.code, error.msg);
 * }
 *
 * //optional: provide a car.Zone filter to retrieve only values for that zone.
 * //if omitted, settings for all zones will be returned
 * var zone = car.Zone.FRONT;
 *
 * //call the method
 * car.audiomixer.get(successCallback, errorCallback, zone);
 *
 * NOTE: considerations and being made for allowing an array of zones to be accepted
 *
 *
 * @example REST - single zone
 *
 * Request:
 * http://<car-ip>/car/audiomixer/get?zone=all
 *
 * Response:
 * {
 *	  code: 1,
 *	  data: [
 *		  { setting: 'volume', zone: 'all', value: 50 }
 *	  ]
 * }
 *
 *
 * @example REST - multi zone
 *
 * Request:
 * http://<car-ip>/car/audiomixer/get
 *
 * Success Response:
 * {
 *	  code: 1,
 *	  data: [
 *		  { setting: 'volume', zone: 'all', value: 50 },
 *		  { setting: 'bass', zone: 'all', value: 6 },
 *	  ]
 * }
 *
 * Error Response:
 * {
 *	  code: -1,
 *	  msg: "An error has occurred"
 * }
 */
_self.get = function(successCallback, errorCallback, zone) {
	var args = {};
	if (zone) {
		args.zone = (typeof zone == 'string' && zone.length > 0) ? zone : null;
	}
	window.cordova.exec(successCallback, errorCallback, _ID, 'get', args, false);
};


/**
 * Saves an audio mixer setting
 * @param {String} setting A car.audiomixer.AudioMixerSetting value   
 * @param {String} zone A car.Zone value   
 * @param {Number} value The value to save
 * @param {Function} successCallback (Optional) The callback that is called on success
 * @param {Function} errorCallback (Optional) The callback that is called if there is an error
 * @see car.audiomixer.AudioMixerSetting
 * @see car.Zone  
 *
 * //option 1: set the volume in the entire car to 50 using constants
 * car.audiomixer.set(car.audiomixer.AudioMixerSetting.VOLUME, car.Zone.ALL, 50);
 *
 * //option 2: set the volume in the entire car to 50 without using constants
 * car.audiomixer.set('volume', 'all', 50);
 *
 *
 * @example REST
 *
 * Request:
 * http://<car-ip>/car/audiomixer/set?setting=volume&zone=all&value=50
 *
 * Success Response:
 * {
 *	  code: 1
 * }
 *
 * Error Response:
 * {
 *	  code: -1,
 *	  msg: "An error has occurred"
 * }
 */
_self.set = function(setting, zone, value, successCallback, errorCallback) {
	var args = { 
		setting: setting, 
		zone: zone, 
		value: value 
	};
	window.cordova.exec(successCallback, errorCallback, _ID, 'set', args, false);
};


//Export
module.exports = _self;