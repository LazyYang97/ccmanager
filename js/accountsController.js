app.accountsController = function($scope,$webSql,appService){

    $scope.submitted={};
    $scope.selectedAcc = [];
    $scope.accFormName = "";
    accountsInit();

    function accountsInit(){
        $scope.cardtypes = appService.getCardTypes();
        $scope.AccountsList = appService.getAllAccounts();
        $scope.accgroups = appService.getAccGroups();

    }

    //SET the New Acc Form & Edit Acc Form to Default
    $scope.setDefaultAccForms = function(current,formname,selectedacc){
        if(formname=='addaccForm'){
            $scope.accFormName = formname;
            $scope.submitted = angular.copy(appService.getDefaultNewAccForm());
            $scope.submitted.selectedAccGroup = current;

        }else if(formname=='editaccForm'){
            $scope.accFormName = formname;
            var sdate = new Date(selectedacc.statement_date).getDate();
            var paymentdd = new Date(selectedacc.payment_due_date).getDate();
            var editAccForm = {};
            if(current == selectedacc.accgroup)
            {   editAccForm = {
                "selectedAccGroup":current,
                "accname":selectedacc.accname,
                "fourdigits":selectedacc.fourdigits,
                "expirymonth":selectedacc.expirymonth,
                "expiryyear":selectedacc.expiryyear,
                "selectedCardType":selectedacc.cardtype,
                "bank":selectedacc.bank,
                "sdate":sdate,
                "paymentdd":paymentdd,
                "annualfee":selectedacc.annual_fee,
                "balance":selectedacc.balance
            }
            }else{
                editAccForm = {
                "selectedAccGroup":current,
                "accname":selectedacc.accname,
                "fourdigits":"",
                "expirymonth":"",
                "expiryyear":"",
                "selectedCardType":"",
                "bank":"",
                "sdate":"",
                "paymentdd":"",
                "annualfee":"",
                "balance":selectedacc.balance
                }

            }
            $scope.submitted = angular.copy(editAccForm);

        }
    }

    //CREATE New Account
    $scope.createNewAccount = function(){
        var newAcc = [];
        newAcc.push($scope.submitted);
        appService.insertIntoAccount(newAcc[0]);
        accountsInit();
        $scope.toastmsg = "Added Account ("+ newAcc[0].accname+")";
        toast.show();
        acctransNavigator.popPage();

    }

    //EDIT Selected Account
    $scope.editSelectedAccount = function(id){
        var editAcc = [];
        editAcc.push($scope.submitted);
        appService.updateSelectedAccount(id,editAcc[0]);
        accountsInit();
        $scope.toastmsg = "Edited " + editAcc[0].accname;
        toast.show();
        acctransNavigator.popPage();

    }

    $scope.showAllAccounts = function(){
        $scope.AccountsList = appService.getAllAccounts();
    }

    //SHOW Selected Account in Account Profile
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

    //CHECK Accounts Group Quantity
    $scope.checkAccGroupCount = function(data){
        var temp = appService.getCountAccGroups();
        return temp[data].quantity;
    }

    //SHOW Total Balance & Total Outstanding Amount
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
