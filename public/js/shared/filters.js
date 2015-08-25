(function() {
  angular.module('ContactList')
    .filter('capitalize', function() {
      return function(input) {
        if (input !== null)
          input = input.toLowerCase();
        return input.substring(0, 1).toUpperCase() + input.substring(1);
      };
    })
    .filter('listToObject', function(){
      return function(lst, key_name, value_name) {
        // Default values
        if (key_name === undefined)
          key_name = 'key';
        if (value_name === undefined)
          value_name = 'value';

        var obj = {keys: [], data: {}};
        angular.forEach(lst, function(item) {
          if (key_name in item) {
            obj.keys.push(item[key_name]);
            obj.data[item[key_name]] = item[value_name];
          }
        });
        return obj;
      };
    })
    .filter('objectToList', function() {
      return function(obj, key_name, value_name) {
        // Default values
        if (key_name === undefined)
          key_name = 'key';
        if (value_name === undefined)
          value_name = 'value';

        var lst = [];
        var item = {};
        angular.forEach(obj.keys, function(key) {
          item[key_name] = key;
          item[value_name] = obj.data[key];
          lst.push(angular.copy(item));
        });
        return lst;
      };
    });
})();
