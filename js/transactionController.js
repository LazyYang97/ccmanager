app.transactionController = function($scope,$webSql,appService){

    $scope.transsubmitted = {}
    $scope.transeditsubmitted = {}
    transInit();

    //Transactions Initialization
    function transInit(){
        $scope.expensecategories = appService.getExpenseCategories();
        $scope.incomecategories = appService.getIncomeCategories();
        $scope.TransList = appService.getAllTransactions();
        $scope.currentMonthYear = new Date().toString("MMM yyyy");

    }

    //SET the New Transaction Form to Default
    $scope.setDefaultTransForms = function(current){
        $scope.transsubmitted = angular.copy(appService.getDefaultNewTransForm());
        $scope.transsubmitted.selectedTransGroup = current;

    }

    //SET the Edit Transaction Form to Default
    $scope.setDefaultEditTransForms = function(current, selectedtrans){
         var tempForm = {
            "transdate":selectedtrans.transdate,
            "selectedTransGroup":current,
            "transamount":0,
            "transcategory":"",
            "transdesc":selectedtrans.transdesc,
            "transacc":"",
            "fromtransacc":"",
             "totransacc":""

         }
        $scope.transeditsubmitted = angular.copy(tempForm);
    }

    //CREATE New Transaction
    $scope.createNewTransaction = function(){
        var newTrans = [];
        if($scope.transsubmitted.selectedTransGroup == "expense"){
                $scope.transsubmitted.transamount = -Math.abs($scope.transsubmitted.transamount);
        }else if($scope.transsubmitted.selectedTransGroup == "income"){
                $scope.transsubmitted.selectedTransGroup == Math.abs($scope.transsubmitted.transamount);
        }
        newTrans.push($scope.transsubmitted);
        if($scope.transsubmitted.selectedTransGroup == "transfer"){
            appService.updateAccBalanceForTransfer(newTrans[0].fromtransacc,newTrans[0].totransacc,newTrans[0].transamount);
        }else{
            appService.updateAccBalance("createtrans",newTrans[0]);
        }
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
        var formatted = new Date(date).toString("dd MMM yyyy");
        return formatted;
    }

    //EDIT Selected Transactions
    $scope.editSelectedTrans = function(data){
        var editTrans = [];
        editTrans.push($scope.transeditsubmitted);
        appService.updateAccBalance("edittrans",data,editTrans[0]);
        appService.updateSelectedTransactions(data.transid,editTrans[0]);
        transInit();
        $scope.toastmsg = "Saved";
        toast.show();
        acctransNavigator.popPage();
    }

    //DELETE Selected Transaction
    $scope.deleteSeletedTrans = function(data){
        ons.notification.confirm({message: "Are you sure you want to delete this transaction?",callback:function(idx){
            switch(idx){
                case 0:
                    ons.notification.confirm.hide();
                    break;
                case 1:
                    appService.updateAccBalance("deletetrans",data);
                    appService.deleteTransaction(data.transid);
                    transInit();
                    acctransNavigator.popPage();
                    $scope.toastmsg = "Deleted";
                    toast.show();
                    break;
            }
        }});
    }

    //Control to show the Next/Previous Month
    $scope.displayTransListControl = function(action){
        if(action == 'prev')
            $scope.currentMonthYear = new Date($scope.currentMonthYear).addMonths(-1).toString("MMM yyyy");
        else if(action == 'next')
            $scope.currentMonthYear = new Date($scope.currentMonthYear).addMonths(1).toString("MMM yyyy");

    }

    //Display the transaction list by Month
    $scope.displayTransListData = function(key){
        var formatted = new Date(key).toString("MMM yyyy");
        if(formatted == $scope.currentMonthYear)
            return true;
        else
            return false;
    }

    //GET total expenses by day
    $scope.getTotalExpenseByDay = function(value){
        var sum = 0;
        for(var i in value){
            if(value[i].transgroup == 'expense')
                sum += value[i].transamount;
        }
        return sum;
    }

    //GET total income by day
    $scope.getTotalIncomeByDay = function(value){
        var sum = 0;
        for(var i in value){
            if(value[i].transgroup == 'income')
                sum += value[i].transamount;
        }
        return sum;
    }

    //GET Related Account Name
    $scope.getTransAccName = function(id){
        var name = '';
        for(var i in $scope.AccountsList){
            if(id == $scope.AccountsList[i].accid){
                name = $scope.AccountsList[i].accname;
            }
        }
        return name;
    }
    $scope.transListItemInit = function(data){

    }
}

//Directive for Transactions List
app.directive('transactionsListItem',function(){
    var directive = {};
    directive.template = '<ng-include src="getTemplateUrl()">';
    directive.restrict = 'EA';
    directive.scope = {
        transaction : "=data",
        relatedaccname : "=relatedacc",
        fromaccname : "=fromacc",
        toaccname : "=toacc"
    };
    directive.controller=function($scope){
        $scope.getTemplateUrl = function(){
            return "html/translistitem.html";
        }
    }
    return directive;
});
