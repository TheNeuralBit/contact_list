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

    result.list_to_object = function list_to_object(lst, key_name, value_name) {
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
    };

    result.object_to_list = function object_to_list(obj, key_name, value_name) {
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

    return result;
  });

  app.controller('ContactListController', ['$scope', 'Contacts', 'ConvertUtil', '$location', function($scope, Contacts, ConvertUtil, $location){
    $scope.contacts_api = Contacts;
    $scope.refresh_contacts = function(data) {
      Contacts.get().success(function(data) { 
        $scope.contacts = [];
        for (var idx = 0; idx < data.length; idx++) {
          data[idx].phones = ConvertUtil.list_to_object(data[idx].phones, 'type', 'phone');
          data[idx].emails = ConvertUtil.list_to_object(data[idx].emails, 'type', 'email');
          $scope.contacts.push(data[idx]);
        }
      });
    };
    $scope.refresh_contacts();

    $scope.header = "All Contacts";
    $scope.search_value = '';
    $scope.$watch('search_value', function() {
      if ($scope.search_value === "") {
        $scope.header = "All Contacts";
      } else {
        $scope.header = "Contacts Matching '" + $scope.search_value + "'";
      }
    });
    $scope.deleteContact = function deleteContact(id) {
      console.log('Deleting ' + id);
      Contacts.delete(id);
      $scope.refresh_contacts();
    };
    $scope.createNew = function createNew() {
      Contacts.create({}).success(function(contact) {
        console.log('Created ' + contact._id + '!');
        var path = '/contact/' + contact._id;
        $location.path(path);
      });
    };
  }]);

  app.controller('ContactController', ['$scope', '$routeParams', 'Contacts', '$location', function($scope, $routeParams, Contacts, $location){
    var contact_id = $routeParams.contact_id;
    Contacts.get(contact_id).success(function(data) { 
      delete data._v;
      $scope.contact = data; 
      $scope.original_contact = angular.copy(data);
    });
    $scope.clean = true;
    function check_clean() {
      $scope.clean =  angular.equals($scope.contact, $scope.original_contact); 
      console.log('checked clean');
      console.log($scope.contact);
      console.log($scope.original_contact);
      console.log($scope.clean);
    }
    $scope.$watch('contact', check_clean, true);
    $scope.submit = function submit() {
      Contacts.update(contact_id, $scope.contact).success(function(data) {
        delete data._v;
        $scope.original_contact = data;
        check_clean();
      });
    };
    $scope.deleteContact = function deleteContact() {
      Contacts.delete(contact_id);
      $location.path('/');
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
      scope: {object: '=', placeholder: '@'},
      templateUrl: '/directives/dict_input.html',
      controller: 'ObjectInputController',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModelController) {
        var key   = attrs.key   || 'key';
        var value = attrs.value || 'value';

        scope.input_element = element.find('input')[0];

        // parser/formatter to convert between model and view format
        // model format: [{type: unclass, phone: 123}, {type: secure, phone: 456}]
        // view format: {keys: [unclass, secure], data: {unclass: 123, secure: 456}}
        ngModelController.$parsers.push(function(data) {
          //convert data from view format to model format
          var rtrn = ConvertUtil.object_to_list(data, key, value);
          return rtrn;
        });

        ngModelController.$formatters.push(function(data) {
          //convert data from model format to view format
          var rtrn = ConvertUtil.list_to_object(data, key, value);
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

  app.directive('focusOn', function() {
    return function(scope, elem, attr) {
       scope.$on(attr.focusOn, function(e) {
           elem[0].focus();
       });
    };
  });

  app.controller('ObjectInputController', ['$scope', function($scope) {
    $scope.status = {
       open: false,
       selected_key: '',
       new_type: ''
       };
    $scope.selectKey = function(new_type){
      $scope.status.selected_key = new_type;
      $scope.status.open = false;
      $scope.$broadcast('focusInput');
    };

    $scope.createNewType = function() {
      if ($scope.status.new_type === '')
        return;
      var new_type = $scope.status.new_type.toLowerCase();
      $scope.status.new_type = '';
      $scope.keys.push(new_type);
      $scope.data[new_type] = '';
      $scope.selectKey(new_type);
    };
  }]);
})();
