(function() {
  angular.module('alerter', [])
    .factory('Alerter', function() {
      var factory = {};
      factory.alerts = [];
      factory.addAlert = addAlert;

      // function definitions //
      function addAlert(message, type, timeout) {
        if (type === undefined)
          type = '';
        factory.alerts.push({message: message, type: type, timeout: timeout});
      }

      return factory;
    })
    .controller('AlertBinController', ['$scope', 'Alerter', function($scope, Alerter) {
      $scope.alerts = Alerter.alerts;
      $scope.closeAlert = closeAlert;

      function closeAlert(idx) {
        $scope.alerts.splice(idx, 1);
      }
    }])
    .directive('alertBin', function() {
      return {
        restrict: 'EA',
        template: '<alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)" dismiss-on-timeout="{{alert.timeout}}">{{alert.message}}</alert>',
        controller: 'AlertBinController'
      };
    });
})();
