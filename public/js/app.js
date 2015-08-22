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

  app.factory('ConvertUtil', function(){
    result = {};

    result.list_to_object = function list_to_object(lst) {
      var obj = {keys: [], data: {}};
      angular.forEach(lst, function(value) {
        obj.keys.push(value.type);
        obj.data[value.type] = value.phone;
      });
      return obj;
    };

    result.object_to_list = function object_to_list(obj) {
      var lst = [];
      angular.forEach(obj.keys, function(key) {
        lst.push({type: key, phone: obj.data[key]});
      });
      return lst;
    };

    return result;
  });

  app.controller('ContactListController', ['$scope', 'Contacts', 'ConvertUtil', function($scope, Contacts, ConvertUtil){
    $scope.contacts_api = Contacts;
    Contacts.get().success(function(data) { 
      $scope.contacts = [];
      for (var idx = 0; idx < data.length; idx++) {
        data[idx].phones = ConvertUtil.list_to_object(data[idx].phones);
        $scope.contacts.push(data[idx]);
      }
    });
  }]);

  app.controller('ContactController', ['$scope', '$routeParams', 'Contacts', function($scope, $routeParams, Contacts){
    var contact_id = $routeParams.contact_id;
    Contacts.get(contact_id).success(function(data) { 
      $scope.contact = data; 
      $scope.original_contact = angular.copy(data);
    });
    $scope.clean = true;
    $scope.$watch('contact', function() {
      $scope.clean =  angular.equals($scope.contact, $scope.original_contact); 
    }, true);
    $scope.submit = function submit() {
      Contacts.update(contact_id, $scope.contact).success(function(data) {
        $scope.original_contact = data;
      });
    };
  }]);

  app.filter('capitalize', function() {
    return function(input, scope) {
      if (input !== null)
        input = input.toLowerCase();
      return input.substring(0,1).toUpperCase() + input.substring(1);
    };
  });

  app.directive('objectInput', ['ConvertUtil', function(ConvertUtil){
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
          var rtrn = ConvertUtil.object_to_list(data);
          return rtrn;
        });

        ngModelController.$formatters.push(function(data) {
          //convert data from model format to view format
          var rtrn = ConvertUtil.list_to_object(data);
          return rtrn;
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
  }]);

  app.controller('ObjectInputController', ['$scope', function($scope) {
    $scope.status = {
       open: false,
       selected_key: '',
       new_type: ''
       };
    $scope.selectKey = function(new_type){
      $scope.status.selected_key = new_type;
    };

    $scope.createNewType = function() {
      if ($scope.new_tpye === '')
        return;
      $scope.keys.push($scope.status.new_type);
      $scope.data[$scope.status.new_type] = '';
      $scope.selectKey($scope.status.new_type);
      $scope.status.new_type = '';
      $scope.status.open = false;
    };
  }]);
})();
