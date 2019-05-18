var app = angular.module('myApp',['onsen','angular-websql']);


app.controller('MainController',function($scope,$webSql,appService){

    $scope.checkAlertDialog = false;
    $scope.alertDialogBtnClicked = false;

    app.accountsController($scope,$webSql,appService);
    ons.disableAutoStyling();

    //Update Accounts & Transactions Toolbar Title
    $scope.updateAccTransTitle = function(title){
        $scope.acctransTitle = title;
    }


})

//Directive for Transactions List
app.directive('transactionsListItem',function(){
    var directive = {};
    directive.template = '<ng-include src="getTemplateUrl()">';
    directive.restrict = 'EA';
    directive.scope = {
        transaction : "=data"
    };
    directive.controller=function($scope){
        $scope.getTemplateUrl = function(){
            return "html/translistitem.html";
        }
    }
    return directive;
});

app.filter('range', function(){
    return function(input,min,max){
        min = parseInt(min);
        max = parseInt(max);
        for(var i=min;i<=max;i++)
            input.push(i);
        return input;
    }
});
