angular.module('myApp')

//Controller

.controller('ManagerController', function($scope){
    //Initialization
    $scope.expamount = '0';
    $scope.incamount = '0';
    $scope.transfamount = '0';
    $scope.annualfee = '0';
    $scope.obalance = '0';
    $scope.balance = '0';
    $scope.date= new Date();

    $scope.updateToolbar = function(title){
        $scope.acctransTitle = title;

    }
});
