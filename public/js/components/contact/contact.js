(function() {
  angular.module('ContactList')
    .controller('ContactController', ['$scope', '$routeParams', 'Contacts', '$location', 'DeleteModal', function($scope, $routeParams, Contacts, $location, DeleteModal){
      var contact_id = $routeParams.contact_id;
      $scope.contact = {};
      $scope.original_contact = {};
      $scope.clean = true;
      $scope.submit = submit;
      $scope.deleteContact = deleteContact;

      Contacts.get(contact_id).success(function(data) { 
        delete data._v;
        $scope.contact = data; 
        $scope.original_contact = angular.copy(data);
      });
      function check_clean() {
        $scope.clean =  angular.equals($scope.contact, $scope.original_contact); 
        console.log('checked clean');
        console.log($scope.contact);
        console.log($scope.original_contact);
        console.log($scope.clean);
      }
      $scope.$watch('contact', check_clean, true);
      
      function submit() {
        Contacts.update(contact_id, $scope.contact).success(function(data) {
          delete data._v;
          $scope.original_contact = data;
          check_clean();
        });
      }
        
      function deleteContact(id, contact) {
        DeleteModal.try_delete(id, contact)
          .then(function() {
            // If we actually delete the contact, navigate back to the list
            $location.path('/');
          });
      }
    }]);
})();

