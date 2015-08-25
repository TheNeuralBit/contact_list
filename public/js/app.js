(function() {
  var app = angular.module('ContactList', ['alerter', 'smart-table', 'ngRoute', 'ui.bootstrap']);

  app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: './js/components/list/list.html',
        controller: 'ContactListController'
      })
      .when('/contact/:contact_id', {
        templateUrl: './js/components/contact/contact.html',
        controller: 'ContactController'
      })
      .when('/edit/:contact_id', {
        templateUrl: './js/components/contact/edit.html',
        controller: 'ContactController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
})();
