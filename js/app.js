var app = angular.module('myApp',['onsen','angular-websql','angular.filter']);

app.controller('MainController',function($scope,$webSql,appService){

    $scope.checkAlertDialog = false;
    $scope.alertDialogBtnClicked = false;

    app.accountsController($scope,$webSql,appService);
    app.transactionController($scope,$webSql,appService);
    ons.disableAutoStyling();

    //Update Accounts & Transactions Toolbar Title
    $scope.updateAccTransTitle = function(title){
        $scope.acctransTitle = title;
    }


})

app.filter('range', function(){
    return function(input,min,max){
        min = parseInt(min);
        max = parseInt(max);
        for(var i=min;i<=max;i++)
            input.push(i);
        return input;
    }
});
