angular.module('myApp')

//Controller

.controller('ManagerController', function($scope){
    $scope.pageTitle = "Add Transaction";
    $scope.updateTitle = function(title){
        $scope.pageTitle = title;
    }

});
