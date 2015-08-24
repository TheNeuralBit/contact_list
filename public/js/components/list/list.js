(function() {
  angular.module('ContactList')
    .controller('ContactListController', ['$scope', 'Contacts', 'ConvertUtil', '$location', 'DeleteModal', function($scope, Contacts, ConvertUtil, $location, DeleteModal){
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
      $scope.deleteContact = DeleteModal.try_delete;

      $scope.$watch('search_value', function() {
        if ($scope.search_value === "") {
          $scope.header = "All Contacts";
        } else {
          $scope.header = "Contacts Matching '" + $scope.search_value + "'";
        }
      });
      $scope.createNew = function createNew() {
        Contacts.create({}).success(function(contact) {
          console.log('Created ' + contact._id + '!');
          $location.path('/edit/' + contact._id);
        });
      };
      $scope.viewContact = function viewContact(id) {
        $location.path('/contact/' + id);
      };

      function deleteContact(id, contact) {
        DeleteModal.try_delete(id, contact).then(function() {
          // If contact is deleted, refresh current list of contacts
          $scope.refresh_contacts();
        });
      }
    }]);
})();

