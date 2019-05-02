angular.module('myApp')

//Controller

.controller('ManagerController', function($scope){

    //Update Toolbar Title
    $scope.pageTitle = "Add Transaction";
    $scope.updateTitle = function(title){
        $scope.pageTitle = title;
    }
});
