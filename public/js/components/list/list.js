(function() {
  angular.module('ContactList')
    .controller('ContactListController', ['$scope', 'Contacts', 'ConvertUtil', '$location', function($scope, Contacts, ConvertUtil, $location){
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
          $location.path('/edit/' + contact._id);
        });
      };
      $scope.viewContact = function viewContact(id) {
        $location.path('/contact/' + id);
      };
    }]);
})();

