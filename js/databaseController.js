app.expandControllerA = function($scope, $webSql){
    $scope.selectedAcc = [];
    $scope.accountslist = [];
    $scope.transactionsList = [];

    //Get Credit Card Account Count
    $scope.getCountCreditCardAcc = function(){
        var count = 0;
        for(i=0;i<$scope.accountslist.length;i++){
            if($scope.accountslist[i].accgroup=='creditcard'){
                count++;
            }
        }
        return count;
    }

    //Get Debit Card Account Count
    $scope.getCountDebitCardAcc = function(){
        var count = 0;
        for(i=0;i<$scope.accountslist.length;i++){
            if($scope.accountslist[i].accgroup=='debitcard'){
                count++;
            }
        }
        return count;
    }

    //Get Debit Card Account Count
    $scope.getCountCashAcc = function(){
        var count = 0;
        for(i=0;i<$scope.accountslist.length;i++){
            if($scope.accountslist[i].accgroup=='cash'){
                count++;
            }
        }
        return count;
    }

    //Get Cash Total Balance
    $scope.getCashTotalBalance = function(){
        var sum = 0;
        for(i=0;i<$scope.accountslist.length;i++){
            if($scope.accountslist[i].accgroup=='cash'){
                sum += $scope.accountslist[i].balance;
            }
        }
        return sum;
    }

    //Get Debit Card Total Balance
    $scope.getDebitCardTotalBalance = function(){
        var sum = 0;
        for(i=0;i<$scope.accountslist.length;i++){
            if($scope.accountslist[i].accgroup=='debitcard'){
                sum += $scope.accountslist[i].balance;
            }
        }
        return sum;

    }

    //Get Credit Card Outstanding Amount Total
    $scope.getOutstandingTotal = function(){
        var sum = 0;
        for(i=0;i<$scope.accountslist.length;i++){
            if($scope.accountslist[i].accgroup=='creditcard'){
                sum += $scope.accountslist[i].outstd_balance;
            }
        }
        return sum;

    }

    //Expiry Formatting
    $scope.extractExpiryMonth = function(expiry){
        var expiryMonth = expiry.substring(0,2);
        return expiryMonth;
    }
    $scope.extractExpiryYear = function(expiry){
        var expiryYear = expiry.substring(3,5);
        return expiryYear;
    }
    $scope.extractStatementDate = function(statement_date){
        var statementDate = statement_date.substring(0,2);
        return statementDate;
    }

    //Database Initialization
    $scope.db = $webSql.openDatabase('ccmanagerdb','1.0','CCManagerDB', 2*1024*1024);

    //Create Account Table
    $scope.db.createTable('account',{
    "accid":{
        "type":"INTEGER",
        "null":"NOT NULL",
        "primary":true,
        "auto_increment":true
    },
    "accname":{
        "type":"TEXT",
        "null":"NOT NULL"
    },
    "accgroup":{
        "type":"TEXT",
        "null":"NOT NULL"
    },
    "fourdigits":{
        "type":"INTEGER"
    },
    "expiry":{
        "type":"TEXT"
    },
    "cardtype":{
        "type":"TEXT",
    },
    "bank":{
        "type":"TEXT"
    },
    "statement_date":{
    "type":"TEXT"
    },
    "payment_due":{
        "type":"TEXT"
    },
    "annual_fee":{
        "type":"DOUBLE"
    },
    "balance":{
        "type":"DOUBLE"
    },
    "outstd_balance":{
        "type":"DOUBLE"
    },
    "due_amount":{
        "type":"DOUBLE"
    },
    "cut_off_date":{
        "type":"DATE"
    },
    "next_due_date":{
        "type":"DATE"
    },
    "settled":{
    "type":"BIT"
    }

    });

    //Accounts List Initialization
    $scope.selectAllAccounts = function(){
        $scope.accountslist = [];
        $scope.db.selectAll("account").then(function(results){
       for(i=0;i<results.rows.length;i++){
            $scope.accountslist.push(results.rows.item(i));
       }
    });
    }

    //Select One Account
    $scope.selectOneAccount = function(id){
        $scope.db.select("account",{
            "accid":id
        }).then(function(results){
            for(i=0;i<results.rows.length;i++){
                $scope.selectedAcc = [];
                $scope.selectedAcc.push(results.rows.item(i));
            }
        });
    }

    //Add New Account
    $scope.addNewAccount = function(selectedAccGroup,fourdigits,expirymonth,expiryyear,accname,selectedCardType,bank,sdate,paymentdd,annualfee,balance){
        var expiry = expirymonth + "/" + expiryyear;
        var outstd_balance = 0;
        var due_amount = 0;
        var settled = 0;
        var statement_date = sdate + new Date().toString(" MMM yyyy");
        var payment_due = paymentdd + new Date().toString(" MMM yyyy");
        var cut_off_date = sdate + new Date().addMonths(1).toString(" MMM yyyy");
        var next_due_date = paymentdd + new Date().addMonths(1).toString(" MMM yyyy")
        $scope.db.insert('account',{"accname":accname,"accgroup":selectedAccGroup,"fourdigits":fourdigits,"expiry":expiry,"cardtype":selectedCardType,"bank":bank,"statement_date":statement_date,"payment_due":payment_due,"annual_fee":annualfee,"balance":balance,"cut_off_date":cut_off_date,"next_due_date":next_due_date,"outstd_balance":outstd_balance,"due_amount":due_amount,"settled":settled}).then(function(results){

            $scope.selectAllAccounts();
            acctransNavigator.popPage();
        });
    };

    //Edit Account
    $scope.updateAccount = function(selectedAccID,selectedAccGroup,fourdigits,expirymonth,expiryyear,accname,selectedCardType,bank,sdate,paymentdd,annualfee,balance){

        var expiry = expirymonth + "/" + expiryyear;

        var statement_date = sdate + new Date().toString(" MMM yyyy");
        var payment_due = paymentdd + new Date().toString(" MMM yyyy");
        var cut_off_date = sdate + new Date().addMonths(1).toString(" MMM yyyy");
        var next_due_date = paymentdd + new Date().addMonths(1).toString(" MMM yyyy")

        $scope.db.update('account',{"accname":accname,"accgroup":selectedAccGroup,"fourdigits":fourdigits,"expiry":expiry,"cardtype":selectedCardType,"bank":bank,"statement_date":statement_date,"payment_due":payment_due,"annual_fee":annualfee,"balance":balance,"cut_off_date":cut_off_date,"next_due_date":next_due_date},
            {
                "accid":selectedAccID
            }
        );
        $scope.selectAllAccounts();
        $scope.selectOneAccount(selectedAccID);
        acctransNavigator.popPage();
    }

    //Delete Account
    $scope.deleteAccount = function(id){
        $scope.db.del('account',{
            "accid":id
        })
        $scope.selectedAcc = [];
        $scope.selectAllAccounts();
        acctransNavigator.popPage();
    }

    //Create Transaction Table
    $scope.db.createTable('transactions',{
    "transacid":{
        "type":"INTEGER",
        "null":"NOT NULL",
        "primary":true,
        "auto_increment":true
    },
    "transgroup":{
        "type":"TEXT",
        "null":"NOT NULL"
    },
    "transdate":{
        "type":"DATE",
        "null":"NOT NULL"
    },
    "transcategory":{
        "type":"TEXT"
    },
    "accid":{
        "type":"INTEGER"
    },
    "from_accid":{
        "type":"INTEGER"
    },
    "to_accid":{
        "type":"INTEGER"
    },
    "amount":{
        "type":"INTEGER"
    },
    "desc":{
        "type":"TEXT"
    }
    });

    //Add New Transaction and Perform Calculation
    $scope.addNewTransaction = function(transgroup,transcategory,transdate,accid,from_accid,to_accid,amount,desc){
        $scope.db.insert('transactions',
            {
                "transgroup":transgroup,
                "transcategory":transcategory,
                "transdate":transdate,
                "accid":accid,
                "from_accid":from_accid,
                "to_accid":to_accid,
                "amount":amount,
                "desc":desc
        }).then(function(results){
            var sum = 0;
            if(transgroup == 'expense'){
                amount = -Math.abs(amount);
            }
            if($scope.selectedAcc[0].accgroup=='creditcard'){
               sum = $scope.selectedAcc[0].outstd_balance + amount;
                $scope.db.update("account",{
                    "outstd_balance":sum
                },{"accid":accid});
            }else{
                sum = $scope.selectedAcc[0].balance + amount;
                $scope.db.update("account",{
                    "balance":sum
                },{"accid":accid});
            }
            $scope.selectAllTransaction();
            $scope.selectAllAccounts();
            acctransTab.setActiveTab(1);
            mainTab.setActiveTab(1);

        });
    }

    //Select All Transaction
    $scope.selectAllTransaction = function(){
        $scope.transactionsList = [];
        $scope.db.selectAll("transactions").then(function(results){
            for(i=0;i<results.rows.length;i++){
                $scope.transactionsList.push(results.rows.item(i));
            }

        })

    }
}

