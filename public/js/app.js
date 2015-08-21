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
    $scope.selected_type = "unclass";
    $scope.contact = {name: 'Brian Hulette', phones: [{type: 'unclass', phone: '(123)456-7890'}, {type: 'mobile', phone: '(789)123-4567'}]};
  }]);

  app.filter('capitalize', function() {
    return function(input, scope) {
      if (input !== null)
        input = input.toLowerCase();
      return input.substring(0,1).toUpperCase() + input.substring(1);
    };
  });

  app.directive('objectInput', function(){
    return {
      restrict: 'E',
      replace: true,
      scope: {object: '='},
      templateUrl: '/directives/dict_input.html',
      controller: 'ObjectInputController',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelController) {
        // parser/formatter to convert between model and view format
        // model format: [{type: unclass, phone: 123}, {type: secure, phone: 456}]
        // view format: {keys: [unclass, secure], data: {unclass: 123, secure: 456}}
        ngModelController.$parsers.push(function(data) {
          //convert data from view format to model format
          model_data = [];
          angular.forEach(data.keys, function(key) {
            model_data.push({type: key, phone: data.data[key]});
          });
          return model_data;
        });

        ngModelController.$formatters.push(function(data) {
          //convert data from model format to view format
          view_data = {keys: [], data: {}};
          angular.forEach(data, function(value) {
            view_data.keys.push(value.type);
            view_data.data[value.type] = value.phone;
          });
          return view_data;
        });
        
        // Whenever viewValue changes, update our scope
        ngModelController.$render = function() {
          scope.keys = ngModelController.$viewValue.keys;
          scope.data = ngModelController.$viewValue.data;
        };
        

        // Make sure changing the keys and/or data actually changes the view
        // (triggering a model change)
        function updateView() {
          ngModelController.$setViewValue({ keys: scope.keys, data: scope.data });
        }
        scope.$watch('keys', updateView, true);
        scope.$watch('data', updateView, true);
      }
    };
  });

  app.controller('ObjectInputController', ['$scope', function($scope) {
    $scope.status = {
       open: false,
       selected_key: ''
       };
    $scope.selectKey = function(new_type){
      $scope.status.selected_key = new_type;
    };
  }]);
})();
