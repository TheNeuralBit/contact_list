(function() {
  angular.module('ContactList')
    .directive('objectInput', ['$filter', function($filter){
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
          var objectToList = $filter('objectToList');
          var listToObject = $filter('listToObject');

          scope.input_element = element.find('input')[0];

          // parser/formatter to convert between model and view format
          // model format: [{type: unclass, phone: 123}, {type: secure, phone: 456}]
          // view format: {keys: [unclass, secure], data: {unclass: 123, secure: 456}}
          ngModelController.$parsers.push(function(data) {
            //convert data from view format to model format
            var rtrn = objectToList(data, key, value);
            return rtrn;
          });

          ngModelController.$formatters.push(function(data) {
            //convert data from model format to view format
            var rtrn = listToObject(data, key, value);
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
    }])
    .directive('focusOn', function() {
      return function(scope, elem, attr) {
        scope.$on(attr.focusOn, function(e) {
          elem[0].focus();
        });
      };
    })
    .controller('ObjectInputController', ['$scope', function($scope) {
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
