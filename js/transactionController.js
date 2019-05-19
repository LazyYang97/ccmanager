app.transactionController = function($scope,$webSql,appService){

    $scope.transsubmitted = {}
    $scope.transFormName = '';
    $scope.TransList = [];
    transInit();

    //Transactions Initialization
    function transInit(){
        $scope.expensecategories = appService.getExpenseCategories();
        $scope.incomecategories = appService.getIncomeCategories();
        $scope.TransList = appService.getAllTransactions();
        console.log($scope.TransList);

    }

    //SET the New Transaction Form and Edit Transaction Form to Default
    $scope.setDefaultTransForms = function(current,formname,selectedtrans){
        if(formname=='addTransForm'){
            $scope.transFormName = formname;
            $scope.transsubmitted = angular.copy(appService.getDefaultNewTransForm());
            $scope.transsubmitted.selectedTransGroup = current;

        }else if(formname=='editTransForm'){
            $scope.transFormName = formname;
            console.log($scope.transFormName);
            var tempTransForm = {};
            if(current == selectedtrans.accgroup){
                tempTransForm = {
                    "selectedTransGroup":current,
                    "transcategory":selectedtrans.transcategory,
                    "transdate":selectedtrans.transdate,
                    "transamount":selectedtrans.transamount,
                    "transacc":selectedtrans.transacc,
                    "fromtransacc":selectedtrans.fromtransacc,
                    "totransaccs":selectedtrans.totransaccs,
                    "transdesc":selectedtrans.transdesc
                }
            }else{
                tempTransForm = {
                    "selectedTransGroup":current,
                    "transcategory":"",
                    "transdate":selectedtrans.transdate,
                    "transamount":selectedtrans.transamount,
                    "transacc":"",
                    "fromtransacc":"",
                    "totransaccs":"",
                    "transdesc":selectedtrans.transacc
                }
            }
            $scope.transsubmitted = angular.copy(tempTransForm);
        }
    }

    //CREATE New Transaction
    $scope.createNewTransaction = function(){
        var newTrans = [];
        newTrans.push($scope.transsubmitted);
        appService.insertIntoTransactions(newTrans[0]);
        transInit();
        $scope.toastmsg = "Added Transaction ("+ newTrans[0].transdesc +")";
        toast.show();
        $scope.transsubmitted = angular.copy(appService.getDefaultNewTransForm());
        mainTab.setActiveTab(1);
        acctransTabbar.setActiveTab(1);

    }

    //Formatting Date for Transaction List
    $scope.formatTransListDate = function(date){
        var formatted = new Date(date).toString("dd MMM");
        return formatted;
    }

    $scope.editSelectedAccount = function(id){
        var editTrans = [];
        editTrans.push($scope.transsubmitted);
        appService.updateSelectedTransactions(id,editTrans[0]);
        transInit();
        $scope.toastmsg = "Edited";
        toast.show();
        acctransNavigator.popPage();
    }
}

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
