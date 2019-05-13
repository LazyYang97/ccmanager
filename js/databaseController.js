app.expandControllerA = function($scope, $webSql){
    $scope.accountslist = [];
    $scope.countCreditCardAcc = '';
    $scope.countDebitCardAcc = '';
    $scope.countCashAcc = '';
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
    "type":"DATE"
    },
    "payment_due":{
        "type":"DATE"
    },
    "outstd_balance":{
        "type":"DOUBLE"
    },
    "annual_fee":{
        "type":"DOUBLE"
    },
    "balance":{
        "type":"DOUBLE"
    }

    });

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

    //Add New Account
    $scope.addNewAccount = function(selectedAccGroup,fourdigits,expiry,accname,selectedCardType,bank,sdate,paymentdd,obalance,annualfee,balance){
        $scope.db.insert('account',{"accname":accname,"accgroup":selectedAccGroup,"fourdigits":fourdigits,"expiry":expiry,"cardtype":selectedCardType,"bank":bank,"statement_date":sdate,"payment_due":paymentdd,"outstd_balance":obalance,"annual_fee":annualfee,"balance":balance}).then(function(results){
            acctransNavigator.popPage();
            $scope.accountslist = [];
            $scope.accountslistinit();
        });
    };

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

