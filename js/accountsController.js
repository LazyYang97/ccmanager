app.accountsController = function($scope,$webSql,appService){

    //Set New Acc Forms to Default
    $scope.newaccsubmitted = {};
    $scope.setDefaultNewAccForms = function(current){
        $scope.newaccsubmitted = angular.copy(appService.defNewAccForm);
        $scope.newaccsubmitted.selectedAccGroup = current;
    }

    //Create New Accounts
    $scope.createNewAccount = function(){
        var newAcc = [];
        newAcc.push($scope.newaccsubmitted);
        var sdate = "";
        if(newAcc[0].sdate != "")
            sdate = newAcc[0].sdate +" "+ new Date().toString("MMM yyyy");

        var paymentdd = "";
        if(newAcc[0].paymentdd != "")
            paymentdd = newAcc[0].paymentdd +" "+ new Date().toString("MMM yyyy");

        var cut_off_date = "";
        if(newAcc[0].sdate != "")
            cut_off_date = newAcc[0].sdate +" "+ new Date().addMonths(1).toString("MMM yyyy");

        var next_due_date = "";
        if(newAcc[0].paymentdd != "")
            next_due_date = newAcc[0].paymentdd +" "+ new Date().addMonths(1).toString("MMM yyyy");

        $scope.db.insert('accounts',{
                "accgroup":newAcc[0].selectedAccGroup,
                "accname":newAcc[0].accname,
                "fourdigits":newAcc[0].fourdigits,
                "expirymonth":newAcc[0].expirymonth,
                "expiryyear":newAcc[0].expiryyear,
                "cardtype":newAcc[0].selectedCardType,
                "bank":newAcc[0].bank,
                "statement_date":sdate,
                "payment_due_date":paymentdd,
                "cut_off_date":cut_off_date,
                "next_due_date":next_due_date,
                "settlestatus":0,
                "annual_fee":newAcc[0].annualfee,
                "outstd_amount":0,
                "due_amount":0,
                "due_amount_updated":0,
                "balance":newAcc[0].balance,
                "base_balance":newAcc[0].balance
            })
        $scope.init();
        $scope.toastmsg = "Added Account ("+ newAcc[0].accname+")";
        toast.show();
        acctransNavigator.popPage();
    }

    //Show All Accounts
    $scope.showAllAccounts = function(){
        $scope.db.selectAll("accounts").then(function(results){
        $scope.tempAccList = [];
        for(var i=0;i<results.rows.length;i++){
            $scope.tempAccList.push(results.rows.item(i));
            }
        })
    }

    //Show Selected Account
    $scope.showSelectedAcc = function(account){
        $scope.selectedAcc = [];
        $scope.db.select("accounts",{ "accid":account.accid }).then(function(results){
            for(var i=0;i<results.rows.length;i++){
                $scope.selectedAcc.push(results.rows.item(i));
            }
        })
    }

    //Delete Selected Account
    $scope.deleteSelectedAccount = function(account){
        ons.notification.confirm({message: "Are you sure you want to delete this account?",callback:function(idx){
            switch(idx){
                case 0:
                    ons.notification.confirm.hide();
                    break;
                case 1:
                    $scope.db.del("accounts",{"accid":account.accid});
                    $scope.selectedAcc = [];
                    $scope.init();
                    $scope.showAllPromos();
                    acctransNavigator.popPage();
                    $scope.toastmsg = "Deleted " + account.accname;
                    toast.show();
                    break;
            }
        }});
    }

    //Show Credit Card Details if Selected Account is Credit Card
    $scope.showCreditCardDetails = function(data){
        if(data == 'creditcard'){
            $scope.showDetails = false;
            return true;
        }else{
            $scope.showDetails = false;
            return false;
        }
    }

    //Set the default form of edit account
    $scope.editaccsubmitted = {};
    $scope.setDefaultEditAccForm = function(account){
        $scope.editaccsubmitted = angular.copy(appService.getDefEditAccForm(account));
    }

    //Edit Selected Account
    $scope.editSelectedAccount = function(account){
        var editAcc = [];
        editAcc.push($scope.editaccsubmitted);
        if(editAcc[0].selectedAccGroup == 'cash'){
            editAcc[0].fourdigits = "";
            editAcc[0].expirymonth = "";
            editAcc[0].expiryyear = "";
            editAcc[0].selectedCardType = "";
            editAcc[0].bank = "";
            editAcc[0].sdate = "";
            editAcc[0].paymentdd = "";
            editAcc[0].annualfee = "";
            account.due_amount = "";
            account.outstd_amount = "";
            account.settlestatus = "";
        }else if(editAcc[0].selectedAccGroup == 'debitcard'){
            editAcc[0].sdate = "";
            editAcc[0].paymentdd = "";
            editAcc[0].annualfee = "";
            account.due_amount = "";
            account.outstd_amount = "";
            account.settlestatus = "";
        }
        var sdate = "";
        if(editAcc[0].sdate != "")
            sdate = editAcc[0].sdate +" "+ new Date().toString("MMM yyyy");

        var paymentdd = "";
        if(editAcc[0].paymentdd != "")
            paymentdd = editAcc[0].paymentdd +" "+ new Date().toString("MMM yyyy");

        var cut_off_date = "";
        if(editAcc[0].sdate != "")
            cut_off_date = editAcc[0].sdate +" "+ new Date().addMonths(1).toString("MMM yyyy");

        var next_due_date = "";
        if(editAcc[0].paymentdd != "")
            next_due_date = editAcc[0].paymentdd +" "+ new Date().addMonths(1).toString("MMM yyyy");


        $scope.db.update("accounts",{
            "accgroup":editAcc[0].selectedAccGroup,
            "accname":editAcc[0].accname,
            "fourdigits":editAcc[0].fourdigits,
            "expirymonth":editAcc[0].expirymonth,
            "expiryyear":editAcc[0].expiryyear,
            "cardtype":editAcc[0].selectedCardType,
            "bank":editAcc[0].bank,
            "statement_date":sdate,
            "payment_due_date":paymentdd,
            "cut_off_date":cut_off_date,
            "next_due_date":next_due_date,
            "settlestatus":account.settlestatus,
            "annual_fee":editAcc[0].annualfee,
            "outstd_amount":account.outstd_amount,
            "due_amount":account.due_amount,
            "due_amount_updated":account.due_amount_updated,
            "balance":editAcc[0].balance,
            "base_balance":editAcc[0].balance,
        },{"accid":account.accid});

        $scope.init();
        $scope.showSelectedAcc(account);
        $scope.toastmsg = "Edited " + editAcc[0].accname;
        toast.show();
        acctransNavigator.popPage();
    }


    $scope.payment = {};
    $scope.payType = 0;
    //Set Settle Payment Form
    $scope.setSettlePaymentForm = function(type){
        if(type == 'outstanding'){
            $scope.paymenttitle = 'Outstanding';
            $scope.payType = 0;
            $scope.payment.payamount = $scope.selectedAcc[0].outstd_amount;
        }else if(type == 'due'){
            $scope.paymenttitle = 'Due';
            $scope.payType = 1;
            $scope.payment.payamount = $scope.selectedAcc[0].due_amount;
        }
    }

    //Settle Payment
    $scope.settlePayment = function(account){
        var newPayment = [];
        newPayment.push($scope.payment);
        if($scope.payType == 0){
            var oustdamount = account.outstd_amount;
            var totaloutstd = oustdamount - newPayment[0].payamount;
            var fromaccbalance = 0;
            for(var i in $scope.tempAccList[i]){
                if($scope.tempAccList[i].accid == newPayment[0].paymentacc){
                    if($scope.tempAccList[i].accgroup != 'creditcard'){
                        fromaccbalance = $scope.tempAccList[i].balance;
                        fromaccbalance = fromaccbalance - newPayment[0].payamount;
                        console.log(fromaccbalance);
                        $scope.db.update('accounts',{"balance":fromaccbalance},{"accid":newPayment[0].paymentacc});
            }else if($scope.tempAccList[i].accgroup == 'creditcard'){
                        fromaccbalance = $scope.tempAccList[i].outstd_amount;
                        fromaccbalance = fromaccbalance + newPayment[0].payamount;
                        $scope.db.update('accounts',{"outstd_amount":fromaccbalance},{"accid":newPayment[0].paymentacc});
                    }
                }
            }
            $scope.db.update('accounts',{"outstd_amount":totaloutstd},{"accid":account.accid});

            $scope.db.insert('transactions',{
                "transgroup":"payment",
                "transcategory":"Payment",
                "transdate":appService.cvtTodayDate,
                "transacc":"",
                "fromtransacc":newPayment[0].paymentacc,
                "totransacc":account.accid,
                "transamount":newPayment[0].payamount,
                "transdesc":"Pay Outstanding Amount",
                "transnotes":""
            })
        }else if($scope.payType == 1){

            var dueamount = account.due_amount;
            var totaldueamount = dueamount - newPayment[0].payamount;
            var fromaccbalance = 0;
            for(var i in $scope.tempAccList[i]){
                if($scope.tempAccList[i].accid == newPayment[0].paymentacc)
                    if($scope.tempAccList[i].accgroup != 'creditcard'){
                        fromaccbalance = $scope.tempAccList[i].balance;
                        fromaccbalance = fromaccbalance - newPayment[0].payamount;
                        $scope.db.update('accounts',{"balance":fromaccbalance},{"accid":newPayment[0].paymentacc});
            }else if($scope.tempAccList[i].accgroup == 'creditcard'){
                        fromaccbalance = $scope.tempAccList[i].outstd_amount;
                        fromaccbalance = fromaccbalance + newPayment[0].payamount;
                        $scope.db.update('accounts',{"outstd_amount":fromaccbalance},{"accid":newPayment[0].paymentacc});
            }
        }
            $scope.db.update('accounts',{"due_amount":totaldueamount},{"accid":account.accid});

            $scope.db.insert('transactions',{
                "transgroup":"payment",
                "transcategory":"Payment",
                "transdate":appService.cvtTodayDate,
                "transacc":"",
                "fromtransacc":newPayment[0].paymentacc,
                "totransacc":account.accid,
                "transamount":newPayment[0].payamount,
                "transdesc":"Pay Due Amount",
                "transnotes":""
            })
        }
        $scope.payment = [];
        $scope.init();
        $scope.showSelectedAcc(account);
        acctransNavigator.popPage();
    }

    //Check the date of all the cards are after cut off
    $scope.checkIsAfterCutOff = function(){
        for(var i in $scope.tempAccList){
            if($scope.tempAccList[i].accgroup == 'creditcard'){
            var today = appService.todayDate;
            var cutoffdate = new Date($scope.tempAccList[i].cut_off_date);
            var compareDate = Date.compare(today,cutoffdate);
            if(compareDate == 1){
                //Update Settle Status and Due Amount Updated Status
                $scope.db.update("accounts",{"settlestatus":0,"due_amount_updated":0},{"accid":$scope.tempAccList[i].accid});
                }
            }
        }
        $scope.showAllAccounts();
        $scope.updateAccDueAmounts();
    }

    //Update All Accounts Due Amount
    $scope.updateAccDueAmounts = function(){
        for(var i in $scope.tempAccList){
            if($scope.tempAccList[i].accgroup == 'creditcard'){
            var today = appService.todayDate;
            var cutoffdate = new Date($scope.tempAccList[i].cut_off_date);
            var compareDate = Date.compare(today,cutoffdate);
           if(compareDate == 1 && $scope.tempAccList[i].due_amount_updated == 0){
                var due_amount = $scope.tempAccList[i].due_amount;
                due_amount = due_amount + $scope.tempAccList[i].outstd_amount;
                $scope.db.update("accounts",{"due_amount":due_amount,"due_amount_updated":1},{"accid":$scope.tempAccList[i].accid});
                }
            }
        }
        $scope.showAllAccounts();
        $scope.updateAllAccAllDates();
    }

    //Update All Accounts Dates(Statement Dates, Payment Due Dates, Cut off Date, Next Due Date)
    $scope.updateAllAccAllDates = function(){
        for(var i in $scope.tempAccList){
            if($scope.tempAccList[i].accgroup == 'creditcard'){
            var today = appService.todayDate;
            var cutoffdate = new Date($scope.tempAccList[i].cut_off_date);
            var compareDate = Date.compare(today,cutoffdate);
            if(compareDate == 1){
                var newsdate = $scope.tempAccList[i].cut_off_date;
                var newpaymentdd = $scope.tempAccList[i].next_due_date;
                var newcutoff = new Date(newsdate).addMonths(1).toString("dd MMM yyyy");
                var newnextdue = new Date(newpaymentdd).addMonths(1).toString("dd MMM yyyy");
                $scope.db.update("accounts",{"statement_date":newsdate,"payment_due_date":newpaymentdd,"cut_off_date":newcutoff,"next_due_date":newnextdue},{"accid":$scope.tempAccList[i].accid});
                }
            }
        }
        $scope.showAllAccounts();
    }

    //Convert the Acc Type Name
    $scope.convertAccTypeLabel = function(type){
        for(var i in $scope.accgroups){
            if($scope.accgroups.hasOwnProperty(i)){
                if(type == i)
                    return $scope.accgroups[i].label;
            }
        }
    }
    //Convert Status to Text
    $scope.cvtStatusToText = function(account){
        if(account.settlestatus == 0){
            return "Not Settled"
        }else{
            return "Settled"
        }
    }

    //Calculate Total Payable Amount
    $scope.getTotalPayableAmount = function(){
        var temp = _.filter($scope.tempAccList,{'accgroup':'creditcard'});
        var sum = _.sumBy(temp,'due_amount');
        return sum;
    }

    //Calculate Total Outstanding Amount
    $scope.getTotalOutstdAmount = function(){
        var temp = _.filter($scope.tempAccList,{'accgroup':'creditcard'});
        var sum = _.sumBy(temp,'outstd_amount');
        return sum;
    }

    //Calculate Total Debit Card Balance
    $scope.getDebitTotalBalance = function(){
        var temp = _.filter($scope.tempAccList,{'accgroup':'debitcard'});
        var sum = _.sumBy(temp,'balance');
        return sum;
    }

    //Calculate Total Cash Balance
    $scope.getCashTotalBalance = function(){
        var temp = _.filter($scope.tempAccList,{'accgroup':'cash'});
        var sum = _.sumBy(temp,'balance');
        return sum;
    }

    //Calculate Days Left
    $scope.calculateDaysLeft = function(data){
        var oneDay = 24*60*60*1000;
        var firstDate = appService.todayDate.getTime();
        var secondDate = new Date(data);
        var secondDateTime = secondDate.getTime();
        var diffDays = Math.round((firstDate - secondDateTime)/(oneDay));
        if(appService.todayDate.getMonth() <= secondDate.getMonth())
            diffDays = -diffDays;
        return diffDays + " days";
    }

    $scope.setSettled = function(account){
        if(account.settlestatus == 0){
            account.settlestatus = 1;
            $scope.db.update("accounts",{"settlestatus":1},{"accid":account.accid});
        }else{
            account.settlestatus = 0;
            $scope.db.update("accounts",{"settlestatus":0},{"accid":account.accid});
        }

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
               return 'html/accountslistitem.html';
        }
    }
    return directive;
})
