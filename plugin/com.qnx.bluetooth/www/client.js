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
 * @name qnx.bluetooth
 * @static
 *
 * @deprecated
 */


var _ID = "com.qnx.bluetooth";

/*
 * Exports are the publicly accessible functions
 */
module.exports = {

	/** Defines all allowed Profile ID for current device*/
	SERVICE_ALL: "ALL",

	/**
	 * Connect to specified service on device with specified MAC address
	 * @param {String} service Service identifier
	 * @param {String} mac MAC address of the device
	 * */
	connectService:function (service, mac) {
		window.cordova.exec(null, null, _ID, 'connectService', { service:service, mac:mac });
	},

	/**
	 * Return a list of paired devices
	 * @return {Object} The currently paired device, or null
	 */
	getPaired:function () {
   		var value = null,
			success = function (data, response) {
				value = data;
			},
			fail = function (data, response) {
				throw data;
			};

		try {
			window.cordova.exec(success, fail, _ID, 'getPaired', null);
			return value;
		} catch (e) {
			console.error(e);
		}
	},
};