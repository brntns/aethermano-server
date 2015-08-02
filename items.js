'use strict';
var _ = require('lodash');
var debug = true;
var start = process.hrtime();

exports.Items = function(){
	this.itemData = {};

};
exports.Items.prototype = {
  createItem: function(x,y,type,loc){
    var item = {
      "type":type,
			"x":x,
			"y":y,
			"location":loc
    };
    this.itemData = item;
  },
	clear: function clear(){
			this.itemData = {};
	}
};
