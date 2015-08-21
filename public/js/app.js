(function() {
  var app = angular.module('ContactList', ['smart-table', 'ngRoute', 'ui.bootstrap']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: './views/list.html',
        controller: 'ContactListController'
      })
      .when('/contact/:contact_id', {
        templateUrl: './views/contact.html',
        controller: 'ContactController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
  
  app.factory('Contacts', ['$http', function($http) {
    result = {};
    result.get = function(id) {
      if (id === undefined)
        return $http.get('./api/contacts');
      else
        return $http.get('./api/contacts/' + id);
    };

    result.create = function(contact) {
      return $http.post('./api/contacts/', contact);
    };

    result.update = function(id, contact) {
      console.debug("Sending update:");
      console.debug(contact);
      return $http.put('./api/contacts/' + id, contact);
    };

    result.delete = function(id) {
      return $http.delete('./api/contacts/' + id);
    };

    return result;
  }]);

  app.controller('ContactListController', ['$scope', 'Contacts', function($scope, Contacts){
    console.log('Creating ContactListController');
    $scope.contacts_api = Contacts;
    Contacts.get().success(function(data) { $scope.contacts = data; });
  }]);

  app.controller('ContactController', ['$scope', '$routeParams', 'Contacts', function($scope, $routeParams, Contacts){
    console.log('Creating ContactController');
    $scope.contacts_api = Contacts;
    $scope.contact_id = $routeParams.contact_id;
    //Contacts.get($scope.contact_id).success(function(data) { $scope.contact = data; });
    $scope.contact = {name: 'Brian Hulette', phones: {unclass: '(123)456-7890', mobile: '(789)123-4567'}};
  }]);

  app.filter('capitalize', function() {
    return function(input, scope) {
      if (input !== null)
        input = input.toLowerCase();
      return input.substring(0,1).toUpperCase() + input.substring(1);
    };
  });
})();
