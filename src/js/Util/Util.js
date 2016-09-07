'use strict';
var _ = require('lodash');
var util = {
  merge_object : function (obj1,obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
      obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
      obj3[attrname] = obj2[attrname];
    }
    return obj3;
  },
  extend: function (bool, obj1, obj2) {
    for (var attrname in obj2) {
      if (obj1[attrname]) {
        obj1[attrname] = bool? obj2[attrname] : obj1[attrname];
      } else {
        obj1[attrname] = obj2[attrname];
      }
    }
  },
  apisSorter : {
    alpha : function(a,b) {
      return a.name.localeCompare(b.name);
    }
  },
  operationsSorters : {
    alpha : function(a,b) {
      return a.path.localeCompare(b.path);
    },
    method : function(a,b) {
      return a.method.localeCompare(b.method);
    }
  },
  parseHeadersType: function (headers) {
    var map = {
      'string': {
        'date-time': 'dateTime',
        'date'     : 'date'
      }
    };

    _.forEach(headers, function (header) {
      var value;
      header = header || {};
      value = map[header.type] && map[header.type][header.format];
      if (!_.isUndefined(value)) {
        header.type = value;
      }
    });

    return headers;
  },

  contains: function (produces, type) {
    var filter = produces.filter(function (val) {
      if (val.indexOf(type) > -1) {
        return true;
      }
    });

    return filter.length;
  },

  parseResponseHeaders: function (data) {
    var HEADERS_SEPARATOR = '; ';
    var headers = _.clone(data);

    _.forEach(headers, function (header) {
      var other = [];
      _.forEach(header, function (value, key) {
        var properties = ['type', 'description'];
        if (properties.indexOf(key.toLowerCase()) === -1) {
          other.push(key + ': ' + value);
        }
      });

      other.join(HEADERS_SEPARATOR);
      header.other = other;
    });

    return headers;
  }
};

util.parsePaths = function(paths) {
  //group by route.
  var key;
  var routes = [];
  for (key in paths) {
    // paths[key].operationsArray.sort(sorterFn);
    // debugger;
    console.log(key);
  }
  console.log(routes);
};
module.exports = util;
