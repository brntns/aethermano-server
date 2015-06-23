'use strict';
var _ = require('lodash');
var debug = true;
var start = process.hrtime();

exports.Items = function(){
	this.itemData = {
    "width":16,
    "data":[]
  };

};
exports.Items.prototype = {
	create: function () {
		console.log('Creating Items...');
    this.createItem();
		console.log('Done Creating Items!');
	},
  createItem: function(){
    var phaseboots = {
      "name":"phaseers",
      "awesome": true
    };

    this.itemData.data.push(phaseboots)
  }
};
















