var app = angular.module('myApp',['onsen','angular-websql']);

//Controller
app.controller('ManagerController', function($scope,$webSql){
    app.expandControllerA( $scope, $webSql);
    //Initialization
    $scope.incamount = '0';
    $scope.transfamount = '0';

    //New Account Field Initialization
    $scope.obalance = '0';
    $scope.balance = '0';
    $scope.annualfee = '0';
    $scope.transdate= new Date();
    $scope.accgroups ={
        "Credit Card":"creditcard",
        "Debit Card":"debitcard",
        "Cash":"cash"
            }
    $scope.cardtypes = ["Visa","Master"];

    $scope.dates = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31"];

    $scope.expensecategories = ["Movie","Food","Petrol","Other"];
    //Update Toolbar Title(Acc&Trans)
    $scope.updateToolbar = function(title){
        $scope.acctransTitle = title;
    };
});

//Directive for Account List
app.directive('accountListItem',function(){
    var directive = {};
    directive.template = '<ng-include src="getTemplateUrl()"/>';
    directive.restrict = 'EA';
    directive.scope = {
        account : "=data"
    };
    directive.controller = function($scope){
        $scope.getTemplateUrl = function(){
            if($scope.account.accgroup == "creditcard"){
                return "html/creditcardacclist.html";
            }
            else{
                return "html/otheracclist.html";
            }
        }
    }
    return directive;
});

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

