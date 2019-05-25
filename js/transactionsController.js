app.transactionsController = function($scope,$webSql,appService){

    //Set the default form of new transaction
    $scope.transsubmitted = {};
    $scope.setDefaultNewTransForm = function(current,id){
    }

    //Create new transaction
    $scope.createNewTransaction = function(transgroup){
        var newTrans = [];
        $scope.transsubmitted.transgroup = transgroup;
        newTrans.push($scope.transsubmitted);

        if(newTrans[0].transgroup == 'transfer'){
            newTrans[0].transacc = '';
            newTrans[0].transcategory = 'Transfer';
        }else if(newTrans[0].transgroup != 'transfer'){
            newTrans[0].fromtransacc='';
            newTrans[0].totransacc='';
        }

        if(newTrans[0].transamount == ''||newTrans[0].transamount == 'undefined'){
            newTrans[0].transamount = 0;
        }

        $scope.db.insert('transactions',{
             "transgroup":newTrans[0].transgroup,
             "transcategory":newTrans[0].transcategory,
             "transdate":newTrans[0].transdate,
             "transamount":newTrans[0].transamount,
             "transacc":newTrans[0].transacc,
             "fromtransacc":newTrans[0].fromtransacc,
             "totransacc":newTrans[0].totransacc,
             "transdesc":newTrans[0].transdesc,
             "transnotes":newTrans[0].transnotes
         })

        $scope.init();
        $scope.toastmsg = "Added Transaction ("+ newTrans[0].transdesc +")";
        toast.show();
        $scope.transsubmitted = angular.copy(appService.defNewTransForm);
        mainTab.setActiveTab(1);
        acctransTabbar.setActiveTab(1);
    }

    //Set Default Edit Transaction Form
    $scope.edittrans = {};
    $scope.setDefEditTransForm = function(trans){
        $scope.edittrans = angular.copy(appService.getDefEditTransForm(trans));

    }
    //Edit Selected Transaction
    $scope.editSelectedTransaction = function(trans){
        var editTrans = [];

        if($scope.edittrans.transgroup == 'transfer'){
            $scope.edittrans.transacc = '';
            $scope.transcategory = 'Transfer';
        }else if($scope.edittrans.transgroup != 'transfer'){
            $scope.edittrans.fromtransacc='';
            $scope.edittrans.totransacc='';
        }

        if($scope.edittrans.transamount == ''||$scope.edittrans.transamount == 'undefined'){
            $scope.edittrans.transamount = 0;
        }
        if($scope.transsubmitted.transdesc == 'undefined')
            $scope.transsubmitted.transdesc = "";
        if($scope.transsubmitted.transnotes == 'undefined')
            $scope.transsubmitted.transnotes = "";

        editTrans.push($scope.edittrans);


        $scope.db.update('transactions',{
             "transgroup":editTrans[0].transgroup,
             "transcategory":editTrans[0].transcategory,
             "transdate":editTrans[0].transdate,
             "transamount":editTrans[0].transamount,
             "transacc":editTrans[0].transacc,
             "fromtransacc":editTrans[0].fromtransacc,
             "totransacc":editTrans[0].totransacc,
             "transdesc":editTrans[0].transdesc,
             "transnotes":editTrans[0].transnotes
         },{"transid":trans.transid});

        $scope.init();
        $scope.showSelectedTransaction(trans);
        $scope.toastmsg = "Edit Transaction ("+ editTrans[0].transdesc +")";
        toast.show();
        acctransNavigator.popPage();
    }

    //Show All Transactions
    $scope.showAllTransactions = function(){
        $scope.db.selectAll("transactions").then(function(results){
            $scope.tempTransList = []
            for(var i=0;i<results.rows.length;i++){
                $scope.tempTransList.push(results.rows.item(i));
                }
            $scope.updateAllAccBalance();
            })
    }

    //Show Selected Transaction
    $scope.showSelectedTransaction = function(trans){
        $scope.selectedTrans = [];
        $scope.db.select("transactions",{ "transid":trans.transid }).then(function(results){
            for(var i=0;i<results.rows.length;i++){
                $scope.selectedTrans.push(results.rows.item(i));
            }
        })
    }

    //Delete Selected Transaction
    $scope.deleteSelectedTrans = function(trans){
        ons.notification.confirm({message: "Are you sure you want to delete this transaction?",callback:function(idx){
            switch(idx){
                case 0:
                    ons.notification.confirm.hide();
                    break;
                case 1:
                    $scope.db.del("transactions",{"transid":trans.transid});
                    $scope.init();
                    $scope.toastmsg = "Deleted " + trans.transdesc;
                    toast.show();
                    acctransNavigator.popPage();
                    break;
            }
        }});
    }

    //Convert Date Format of Transaction List
    $scope.convertTransDateFormat = function(date){
        date = new Date(date).toString("dd MMM yyyy");
        return date;
    }
    //Convert Date Format of Transaction List
    $scope.convertAccIDToName = function(id){
        for(var i in $scope.tempAccList){
            if($scope.tempAccList[i].accid == id){
                return $scope.tempAccList[i].accname + " " +$scope.tempAccList[i].fourdigits;
            }
        }
    }

    //Get Total Expense by Day
    $scope.getTotalExpByDay = function(value,isaccount){
        if(isaccount == 0){
            var temp = _.filter(value,{'transgroup':'expense'});
            var sum = _.sumBy(temp,'transamount');
            return sum;
        }else if(isaccount == 1 && $scope.selectedAcc.length!=0){
            var sum = 0;
            var temp = _.filter(value,{'transgroup':'expense'});
            var id = $scope.selectedAcc[0].accid;
            var temp2 = _.filter(temp,{'transacc':id});
            sum = _.sumBy(temp2,'transamount');
            return sum;
        }
    }

    //Get Total Income by Day
    $scope.getTotalIncByDay = function(value,isaccount){
        if(isaccount == 0){
            var temp = _.filter(value,{'transgroup':'income'});
            var sum = _.sumBy(temp,'transamount');
            return sum;

        }else if(isaccount==1 && $scope.selectedAcc.length!=0){
            var sum = 0;
            var temp = _.filter(value,{'transgroup':'income'});
            var temp2 = _.filter(temp,{'transacc':$scope.selectedAcc[0].accid});
            sum = _.sumBy(temp2,'transamount');
            return sum;
        }
    }

    //Transaction List Month Year Title
    $scope.transListMonthYear = new Date().toString("MMM yyyy");

    //Display Transaction Control by Month Year
    $scope.displayTransListControl = function(type){
        if(type=="prev")
            $scope.transListMonthYear = new Date($scope.transListMonthYear).addMonths(-1).toString("MMM yyyy");
        else if(type=="next")
            $scope.transListMonthYear = new Date($scope.transListMonthYear).addMonths(1).toString("MMM yyyy");
    }

    //Display Transaction of Current Month
    $scope.displayTransOfCurrentMonth = function(key){
        var date = new Date(key).toString("MMM yyyy");
        if(date == $scope.transListMonthYear)
            return true;
        else
            return false;
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
