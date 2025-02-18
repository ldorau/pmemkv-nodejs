/*
 * Copyright 2017-2019, Intel Corporation
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in
 *       the documentation and/or other materials provided with the
 *       distribution.
 *
 *     * Neither the name of the copyright holder nor the names of its
 *       contributors may be used to endorse or promote products derived
 *       from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Main Node.js pmemkv class.
 *
 * It contains Node.js pmemkv public enum *constants* and class *db* with its
 * functions and members.
 *
 * @link   https://github.com/pmem/pmemkv-nodejs
 * @file   This files defines the *db* class and exports *constants* enum.
 * @since  1.0
 */

const pmemkv = require('bindings')('pmemkv');

/** @class Main Node.js pmemkv class, it provides functions to operate on data in database.
 *		If an error/exception is thrown from a method it will contain *status* variable.
 *		Possible statuses are enumerated in constants.status.
*/
class db {
	/**
	 * Creates an instance of db.
	 *
	 * @constructor
	 * @throws {Error} on any failure.
	 * @param {string} engine Name of the engine to work with.
	 * @param {object} config JSON like config with parameters specified for the engine.
	 */
	constructor(engine, config) {
		this._stopped = false;
		this._db = new pmemkv.db(engine, config);
		Object.defineProperty(this, '_db', {configurable: false, writable: false});
	}

	/**
	 * Stops the database.
	 */
	stop() {
		if (!this._stopped) {
			this._stopped = true;
			Object.defineProperty(this, '_stopped', {configurable: false, writable: false});
			this._db.stop();
		}
	}

	/**
	 * Returns value of *stopped* property.
	 *
	 * @return {boolean} true if stopped, false otherwise.
	 */
	get stopped() {
		return this._stopped;
	}

	/**
	 * Executes function for every record stored in db. Callback is called
	 *	only with the key of each record.
	 *
	 * @throws {Error} on any failure.
	 * @param {Function} callback - function to be called for every element stored in db.
	 *		It has only one param - key (for each returned element).
	 */
	get_keys(callback) {
		this._db.get_keys(callback);
	}

	/**
	 * Executes function for every record stored in db, whose keys are greater
	 *	than the given *key*. Callback is called only with the key of each record.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key - sets the lower bound for querying.
	 * @param {Function} callback - function to be called for each returned element.
	 *		It has only one param - key (for each returned element).
	 */
	get_keys_above(key, callback) {
		this._db.get_keys_above(key, callback);
	}

	/**
	 * Executes function for every record stored in db, whose keys are less than
	 *	the given *key*. Callback is called only with the key of each record.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key - sets the upper bound for querying.
	 * @param {Function} callback - function to be called for each returned element.
	 *		It has only one param - key (for each returned element).
	 */
	get_keys_below(key, callback) {
		this._db.get_keys_below(key, callback);
	}

	/**
	 * Executes function for every record stored in db, whose keys are
	 *	greater than the *key1* and less than the *key2*. Callback is
	 *	called only with the key of each record.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key1 - sets the lower bound for querying.
	 * @param {string} key2 - sets the upper bound for querying.
	 * @param {Function} callback - function to be called for each returned element.
	 *		It has only one param - key (for each returned element).
	 */
	get_keys_between(key1, key2, callback) {
		this._db.get_keys_between(key1, key2, callback);
	}

	/**
	 * Returns number of currently stored elements in db.
	 *
	 * @throws {Error} on any failure.
	 * @return {number|object} Number of records stored in db
	 *	or empty Value() if error occurred.
	 */
	get count_all() {
		return this._db.count_all();
	}

	/**
	 * Returns number of currently stored elements in db, whose keys are
	 *	greater than the given *key*.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key - sets the lower bound of counting.
	 * @return {number|object} Number of records in db matching query
	 *	or empty Value() if error occurred.
	 */
	count_above(key) {
		return this._db.count_above(key);
	}

	/**
	 * Returns number of currently stored elements in db, whose keys are
	 *	less than the given *key*.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key - sets the upper bound of counting.
	 * @return {number|object} Number of records in db matching query
	 *	or empty Value() if error occurred.
	 */
	count_below(key) {
		return this._db.count_below(key);
	}

	/**
	 * Returns number of currently stored elements in db, whose keys are
	 *	greater than the *key1* and less than the *key2*.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key1 - sets the lower bound of counting.
	 * @param {string} key2 - sets the upper bound of counting.
	 * @return {number|object} Number of records in db matching query
	 *	or empty Value() if error occurred.
	 */
	count_between(key1, key2) {
		return this._db.count_between(key1, key2);
	}

	/**
	 * Executes function for every record stored in db.
	 *
	 * @throws {Error} on any failure.
	 * @param {Function} callback - function to be called for every element stored in db.
	 */
	get_all(callback) {
		this._db.get_all(callback)
	}

	/**
	 * Executes function for every record stored in db, whose keys are
	 *	greater than the given *key*.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key - sets the lower bound for querying.
	 * @param {Function} callback - function to be called for each returned element.
	 */
	get_above(key, callback) {
		this._db.get_above(key, callback)
	}

	/**
	 * Executes function for every record stored in db, whose keys are
	 *	less than the given *key*.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key - sets the upper bound for querying.
	 * @param {Function} callback - function to be called for each returned element.
	 */
	get_below(key, callback) {
		this._db.get_below(key, callback)
	}

	/**
	 * Executes function for every record stored in db, whose keys are
	 *	greater than the *key1* and less than the *key2*.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key1 - sets the lower bound for querying.
	 * @param {string} key2 - sets the upper bound for querying.
	 * @param {Function} callback - function to be called for each returned element.
	 */
	get_between(key1, key2, callback) {
		this._db.get_between(key1, key2, callback)
	}

	/**
	 * Checks existence of record with given *key*.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key - record's key to query for.
	 * @return {boolean} True if record with given key exists, False otherwise.
	 */
	exists(key) {
		return this._db.exists(key);
	}

	/**
	 * Gets value of record with given *key*.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key - record's key to query for.
	 * @return {object} string with value stored for this key,
	 *	env.Undefined() if not found, or empty Value() if error.
	 */
	get(key) {
		return this._db.get(key);
	}

	/**
	 * Inserts a key-value pair into pmemkv database.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key - record's key; record will be put into database under its name.
	 * @param {string} value - data to be inserted into this new database record.
	 */
	put(key, value) {
		this._db.put(key, value);
	}

	/**
	 * Removes from database record with given *key*.
	 *
	 * @throws {Error} on any failure.
	 * @param {string} key - record's key to query for, to be removed.
	 * @return {boolean} True if pmemkv returned status OK, False if status NOT_FOUND.
	 */
	remove(key) {
		return this._db.remove(key);
	}
}

module.exports = db;
module.exports.constants = pmemkv.constants;
