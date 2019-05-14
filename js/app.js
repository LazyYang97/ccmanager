var app = angular.module('myApp',['onsen','angular-websql']);

//Controller
app.controller('ManagerController', function($scope,$webSql){
    app.expandControllerA( $scope, $webSql);
    //Initialization
    $scope.expamount = '0';
    $scope.incamount = '0';
    $scope.transfamount = '0';

    //New Account Field Initialization
    $scope.obalance = '0';
    $scope.balance = '0';
    $scope.annualfee = '0';
    $scope.date= new Date();
    $scope.accgroups ={
        "Credit Card":"creditcard",
        "Debit Card":"debitcard",
        "Cash":"cash"
            }
    $scope.cardtypes = ["Visa","Master"];

    $scope.dates = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    $scope.nowMonthYear = new Date().toString("MMMM yyyy");
    $scope.nextMonthYear = new Date().addMonths(1).toString("MMMM yyyy");
    //Update Toolbar Title(Acc&Trans)
    $scope.updateToolbar = function(title){
        $scope.acctransTitle = title;
    };

});


