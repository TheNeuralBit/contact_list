(function() {
angular.module('ContactList')
  .controller('ModalController', function($scope, $modalInstance, contact) {
      $scope.contact = contact;
      $scope.ok = ok;
      $scope.cancel = cancel;

      // function definitions //
      function ok() {
        $modalInstance.close();
      }

      function cancel() {
        $modalInstance.dismiss('cancel');
      }
    })
  .factory('DeleteModal', ['$modal', '$q', 'Contacts', function($modal, $q, Contacts) {
      factory = {};
      factory.try_delete = try_delete;

      function try_delete(contact) {
        var delete_modal = $modal.open({
          templateUrl: 'js/components/delete_modal/delete.html',
          controller: 'ModalController',
          resolve: {
            contact: function() {
              return contact;
            }
          }
        });

      return delete_modal.result.then(function() {
          console.log('Deleting ' + contact._id);
          Contacts.delete(contact._id);
        }, function(reason) {
          console.log("rejected!!");
          return $q.reject(reason);
        });
      }

      return factory;
    }]);
})();
