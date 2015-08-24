(function() {
  angular.module('ContactList')
    .controller('ContactController', ['$scope', '$routeParams', 'Contacts', '$location', function($scope, $routeParams, Contacts, $location){
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
})();

