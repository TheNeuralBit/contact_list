(function() {
  angular.module('ContactList').factory('Contacts', ['$http', function($http) {
    result = {};
    result.get = function get(id) {
      if (id === undefined)
        return $http.get('./api/contacts');
      else
        return $http.get('./api/contacts/' + id);
    };

    result.create = function create(contact) {
      return $http.post('./api/contacts/', contact);
    };

    result.update = function update(id, contact) {
      console.debug("Sending update:");
      console.debug(id);
      console.debug(contact);
      return $http.put('./api/contacts/' + id, contact);
    };

    result.delete = function delete_(id) {
      return $http.delete('./api/contacts/' + id);
    };

    return result;
  }]);
})();
