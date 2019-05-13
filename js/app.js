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
    $scope.accgroups =[
        {type:"Credit Card", value:"creditcard"},
        {type:"Debit Card", value:"debitcard"},
        {type:"Cash", value:"cash"}
    ]
    $scope.cardtypes = ["Visa","Master"];

    //Update Toolbar Title(Acc&Trans)
    $scope.updateToolbar = function(title){
        $scope.acctransTitle = title;
    };

});


