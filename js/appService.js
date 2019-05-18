//Services
app.service('appService',['$webSql',function($webSql){
    var vm = this;
    var tempAccList = {};
    //Acounts Groups
    var tempAccGroups ={
        creditcard:{"type":'creditcard',"label":'Credit Card',"quantity":0,"totaloutstd":0},
        debitcard:{"type":'debitcard',"label":'Debit Card',"quantity":0,"totalbalance":0},
        cash:{"type":'cash',"label":'Cash',"quantity":0,"totalbalance":0}
    };
    //GET Accounts Groups
    vm.getAccGroups = function(){
        return tempAccGroups;
    }

    //Card Types
    var cardTypes = [
        {type:'visa',label:'Visa'},
        {type:'master',label:'Master'}
    ];
    //GET Card Types
    vm.getCardTypes = function(){
        return cardTypes;
    }
    // Default New Acc Form
    var defNewAccForm = {
        "accname":"",
        "fourdigits":"",
        "expirymonth":"",
        "expiryyear":"",
        "selectedCardType":"",
        "bank":"",
        "sdate":"",
        "paymentdd":"",
        "annualfee":0,
        "balance":0,
        "selectedAccGroup":""
    };
    //GET Default New Acc Form
    vm.getDefaultNewAccForm = function(){
        return defNewAccForm;
    }

    //CREATE Database
    vm.db = $webSql.openDatabase('ccmanagerDB','1.0','CCManager DB',2*1024*1024);

    //CREATE Accounts Table
    vm.db.createTable('accounts',{
            "accid":{
                "type":"INTEGER",
                "null":"NOT NULL",
                "primary":true,
                "auto_increment":true
            },
            "accgroup":{
                "type":"TEXT"
            },
            "accname":{
                "type":"TEXT"
            },
            "fourdigits":{
                "type":"INTEGER"
            },
            "expiry":{
                "type":"TEXT"
            },
            "cardtype":{
                "type":"TEXT"
            },
            "bank":{
                "type":"TEXT"
            },
            "statement_date":{
                "type":"DATE"
            },
            "payment_due_date":{
                "type":"DATE"
            },
            "cut_off_date":{
                "type":"DATE"
            },
            "next_due_date":{
                "type":"DATE"
            },
            "status":{
                "type":"BIT"//1 for settled, 0 for unsettled
            },
            "annual_fee":{
                "type":"NUMBER"
            },
            "outstd_amount":{
                "type":"NUMBER"
            },
            "due_amount":{
                "type":"NUMBER"
            },
            "balance":{
                "type":"NUMBER"
            }
        });

    //INSERT into Account Table
    vm.insertIntoAccount = function(data){
        var expiry = data.expirymonth + '/' + data.expiryyear;
        var sdate = data.sdate +" "+ new Date().toString("MMM yyyy");
        var paymentdd = data.paymentdd +" "+ new Date().toString("MMM yyyy");
        var cut_off_date = data.sdate +" "+ new Date().addMonths(1).toString("MMM yyyy");
        var next_due_date = data.paymentdd +" "+ new Date().addMonths(1).toString("MMM yyyy");

        vm.db.insert('accounts',{
            "accgroup":data.selectedAccGroup,
            "accname":data.accname,
            "fourdigits":data.fourdigits,
            "expiry":expiry,
            "cardtype":data.selectedCardType,
            "bank":data.bank,
            "statement_date":sdate,
            "payment_due_date":paymentdd,
            "cut_off_date":cut_off_date,
            "next_due_date":next_due_date,
            "status":0,
            "annual_fee":data.annualfee,
            "outstd_amount":0,
            "due_amount":0,
            "balance":data.balance
        })
    };
    //GET All Accounts from Account Table
    vm.getAllAccounts = function(){
        tempAccList = [];
        vm.db.selectAll("accounts").then(function(results){
            for(var i=0;i<results.rows.length;i++){
                tempAccList.push(results.rows.item(i));
            }
        })
        return tempAccList;
    }

    //GET One Account from Account Table
    vm.getOneAcc = function(id){
        var selected = [];
        vm.db.select("accounts",{ "accid":id }).then(function(results){
            for(var i=0;i<results.rows.length;i++){
                selected.push(results.rows.item(i));
            }

        })
        return selected;
    }

    //GET Accounts Groups Count
    vm.getCountAccGroups = function(){
        tempAccGroups['creditcard'].quantity = 0;
        tempAccGroups['debitcard'].quantity = 0;
        tempAccGroups['cash'].quantity = 0;
        for(var i in tempAccList){
           if(tempAccList[i].accgroup == 'creditcard'){
                tempAccGroups['creditcard'].quantity++;
           }
           else if(tempAccList[i].accgroup == 'debitcard'){
                tempAccGroups['debitcard'].quantity++;
           }
           else if(tempAccList[i].accgroup == 'cash')
                tempAccGroups['cash'].quantity++;
        }
        return tempAccGroups;
    }

    //GET Accounts Groups Total Balance
    vm.getAccGroupsTotalBalance = function(){
        tempAccGroups['creditcard'].totaloutstd = 0;
        tempAccGroups['debitcard'].totalbalance = 0;
        tempAccGroups['cash'].totalbalance = 0;
        for(var i in tempAccList){
           if(tempAccList[i].accgroup == 'creditcard'){
                tempAccGroups['creditcard'].totaloutstd+=tempAccList[i].outstd_amount;
           }
           else if(tempAccList[i].accgroup == 'debitcard'){
                tempAccGroups['debitcard'].totalbalance += tempAccList[i].balance;
           }
           else if(tempAccList[i].accgroup == 'cash')
                tempAccGroups['cash'].totalbalance += tempAccList[i].balance;
        }
        return tempAccGroups;
    }

    //DELETE an Account from Account Table
    vm.deleteAccount = function(id){
        vm.db.del("accounts",{"accid":id});
    }

    vm.updateAccount = function(id){
        vm.db
    }


}])
