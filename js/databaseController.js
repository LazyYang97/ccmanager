app.expandControllerA = function($scope, $webSql){
    $scope.selectedAcc = [];
    $scope.accountslist = [];
    $scope.countCreditCardAcc = '';
    $scope.countDebitCardAcc = '';
    $scope.countCashAcc = '';
    $scope.getID = '';

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
        "type":"DATE"
    },
    "cardtype":{
        "type":"TEXT",
    },
    "bank":{
        "type":"TEXT"
    },
    "statement_date":{
    "type":"INTEGER"
    },
    "payment_due":{
        "type":"INTEGER"
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
    $scope.accountslistinit = function(){
        $scope.db.selectAll("account").then(function(results){
       for(i=0;i<results.rows.length;i++){
            $scope.accountslist.push(results.rows.item(i));
       }
        for(i=0;i<$scope.accountslist.length;i++){
            if($scope.accountslist[i].accgroup=='creditcard'){
                $scope.countCreditCardAcc++;
            }else if($scope.accountslist[i].accgroup=='debitcard'){
                $scope.countDebitCardAcc++;
            }else if($scope.accountslist[i].accgroup=='cash'){
                $scope.countCashAcc++;
            }
        }
    });
    }

    //Account Profile Initialization
    $scope.accountProfileInit = function(id){
        $scope.db.select("account",{
            "accid":id
        }).then(function(results){
            for(i=0;i<results.rows.length;i++){
                $scope.selectedAcc = [];
                $scope.selectedAcc.push(results.rows.item(i));
                console.log($scope.selectedAcc);
            }
        });
    }
    //Add New Account
    $scope.addNewAccount = function(selectedAccGroup,fourdigits,expiry,accname,selectedCardType,bank,sdate,paymentdd,annualfee,balance){
        var expiry = new Date(expiry).toString('dd/yy');
        var outstd_balance = 0;
        var due_amount = 0;
        var settled = 0;
        $scope.db.insert('account',{"accname":accname,"accgroup":selectedAccGroup,"fourdigits":fourdigits,"expiry":expiry,"cardtype":selectedCardType,"bank":bank,"statement_date":sdate,"payment_due":paymentdd,"annual_fee":annualfee,"balance":balance,"cut_off_date":sdate,"next_due_date":paymentdd,"outstd_balance":outstd_balance,"due_amount":due_amount,"settled":settled}).then(function(results){

            acctransNavigator.popPage();
            $scope.accountslist = [];
            $scope.accountslistinit();
        });
    };

    //Update Account
    $scope.updateAccount = function(selectedAccID,selectedAccGroup,fourdigits,expiry,accname,selectedCardType,bank,sdate,paymentdd,annualfee,balance){

        $scope.db.update('account',{"accname":accname,"accgroup":selectedAccGroup,"fourdigits":fourdigits,"expiry":expiry,"cardtype":selectedCardType,"bank":bank,"statement_date":sdate,"payment_due":paymentdd,"annual_fee":annualfee,"balance":balance,"cut_off_date":sdate,"next_due_date":paymentdd},
            {
                "accid":selectedAccID
            }
        );
        $scope.accountslist = [];
        $scope.accountslistinit();
        $scope.accountProfileInit(selectedAccID);
        acctransNavigator.popPage();
    }

    //Delete Account
    $scope.deleteAccount = function(id){
        $scope.db.del('account',{
            "accid":id
        })
        $scope.accountslist = [];
        $scope.accountslistinit();
        acctransNavigator.popPage();
    }
}

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

