app.accountsController = function($scope,$webSql,appService){

    $scope.submitted={};
    $scope.selectedAcc = [];
    accountsInit();

    function accountsInit(){
        $scope.cardtypes = appService.getCardTypes();
        $scope.AccountsList = appService.getAllAccounts();
        $scope.accgroups = appService.getAccGroups();

    }
    //Set the New Acc Form to Default
    $scope.setDefaultAccForms = function(current){
        $scope.submitted = angular.copy(appService.getDefaultNewAccForm());
        $scope.submitted.selectedAccGroup = current;
    }

    //Create New Account
    $scope.createNewAccount = function(){
        var newAcc = [];
        newAcc.push($scope.submitted);
        appService.insertIntoAccount(newAcc[0]);
        accountsInit();
        $scope.toastmsg = "Added "+ newAcc[0].accname;
        toast.show();
        acctransNavigator.popPage();

    }

    //Show Selected Account in Account Profile
    $scope.showSelectedAcc = function(id){
        $scope.selectedAcc = appService.getOneAcc(id);
    }

    //SHOW Credit Card Details
    $scope.showCreditCardDetails = function(data){
        if(data == 'creditcard'){
            $scope.showDetails = true;
            return true;
        }else{
            $scope.showDetails = false;
            return false;
        }
    }

    //Check Accounts Group Quantity
    $scope.checkAccGroupCount = function(data){
        var temp = appService.getCountAccGroups();
        return temp[data].quantity;
    }

    //Show Total Balance & Total Outstanding Amount
    $scope.showAccGroupsTotalBalance = function(data){
        var temp = appService.getAccGroupsTotalBalance();
        if(data == 'creditcard')
            return temp[data].totaloutstd;
        else
            return temp[data].totalbalance;
    }

    //DELETE selected Account
    $scope.deleteSelectedAccount = function(account){
        appService.deleteAccount(account.accid);
        $scope.toastmsg = "Deleted (" + account.accname + ")";
        accountsInit();
        toast.toggle();
        acctransNavigator.popPage();
    }

    //EDIT selected Account
    $scope.editSelectedAccount = function(){
        appService.up
    }

}

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
           if($scope.account.accgroup == 'creditcard'){
               return 'html/creditcardacclist.html';
            }
            else{
                return 'html/otheracclist.html';
            }
        }
    }
    return directive;
})
