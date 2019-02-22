/*
 * moleculer
 * Copyright (c) 2019 MoleculerJS (https://github.com/moleculerjs/moleculer)
 * MIT Licensed
 */

"use strict";

const { pick } = require("lodash");
const BaseMetric = require("./base");
const METRIC = require("../constants");

/**
 * Information metric.
 *
 * @class InfoMetric
 * @extends {BaseMetric}
 */
class InfoMetric extends BaseMetric {

	/**
	 * Creates an instance of InfoMetric.
	 * @param {Object} opts
	 * @param {MetricRegistry} registry
	 * @memberof InfoMetric
	 */
	constructor(opts, registry) {
		super(opts, registry);
		this.type = METRIC.TYPE_INFO;

		this.clear();
	}

	/**
	 * Set value.
	 *
	 * @param {*} value
	 * @param {Object?} labels
	 * @param {Number?} timestamp
	 * @returns
	 * @memberof InfoMetric
	 */
	set(value, labels, timestamp) {
		const hash = this.hashingLabels(labels);
		let item = this.values.get(hash);
		if (item) {
			item.value = value;
			item.timestamp = timestamp == null ? Date.now() : timestamp;
		} else {
			item = {
				value,
				labels: pick(labels, this.labelNames),
				timestamp: timestamp == null ? Date.now() : timestamp
			};
			this.values.set(hash, item);
		}
		this.changed(labels);

		return item;
	}

	/**
	 * Reset item by labels.
	 *
	 * @param {Object} labels
	 * @param {Number?} timestamp
	 * @returns
	 * @memberof InfoMetric
	 */
	reset(labels, timestamp) {
		return this.set(null, labels, timestamp);
	}

	/**
	 * Reset all items.
	 *
	 * @param {Number?} timestamp
	 * @memberof InfoMetric
	 */
	resetAll(timestamp) {
		Object.keys(this.values).forEach(hash => {
			this.values[hash].value = null;
			this.values[hash].timestamp = timestamp == null ? Date.now() : timestamp;
		});
		this.setDirty();
	}

	/**
	 * Generate a snapshot.
	 *
	 * @returns {Array<Object>}
	 * @memberof InfoMetric
	 */
	generateSnapshot() {
		const snapshot = Array.from(this.values.values()).map(item => {
			return {
				value: item.value,
				labels: item.labels,
				timestamp: item.timestamp
			};
		});

		return snapshot;
	}
}

module.exports = InfoMetric;
