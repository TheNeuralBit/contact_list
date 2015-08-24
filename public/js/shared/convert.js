(function() {
  angular.module('ContactList')
    // TODO: Make this a filter?
    .factory('ConvertUtil', function(){
      result = {};
      result.list_to_object = list_to_object;
      result.object_to_list = object_to_list;
      
      // function definitions //
      function list_to_object(lst, key_name, value_name) {
        // Default values
        if (key_name === undefined)
          key_name = 'key';
        if (value_name === undefined)
          value_name = 'value';

        var obj = {keys: [], data: {}};
        angular.forEach(lst, function(item) {
          obj.keys.push(item[key_name]);
          obj.data[item[key_name]] = item[value_name];
        });
        return obj;
      }

      function object_to_list(obj, key_name, value_name) {
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
      }

      return result;
    });
})();
