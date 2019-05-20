//Services
app.service('appService',['$webSql',function($webSql){
    ///////////////////////////////////////////////////////////////////////
    ////////////////////////////For Accounts///////////////////////////////
    ///////////////////////////////////////////////////////////////////////

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
            "expirymonth":{
                "type":"INTEGER"
            },
            "expiryyear":{
                "type":"INTEGER"
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
                "type":"DOUBLE"
            },
            "outstd_amount":{
                "type":"DOUBLE"
            },
            "due_amount":{
                "type":"DOUBLE"
            },
            "balance":{
                "type":"DOUBLE"
            }
        });

    //INSERT into Account Table
    vm.insertIntoAccount = function(data){
        var sdate = "";
        if(data.sdate != "")
            sdate = data.sdate +" "+ new Date().toString("MMM yyyy");

        var paymentdd = "";
        if(data.paymentdd != "")
            paymentdd = data.paymentdd +" "+ new Date().toString("MMM yyyy");

        var cut_off_date = "";
        if(data.sdate != "")
            cut_off_date = data.sdate +" "+ new Date().addMonths(1).toString("MMM yyyy");

        var next_due_date = "";
        if(data.paymentdd != "")
            next_due_date = data.paymentdd +" "+ new Date().addMonths(1).toString("MMM yyyy");

        vm.db.insert('accounts',{
            "accgroup":data.selectedAccGroup,
            "accname":data.accname,
            "fourdigits":data.fourdigits,
            "expirymonth":data.expirymonth,
            "expiryyear":data.expiryyear,
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

    //UPDATE selected Account
    vm.updateSelectedAccount = function(selectedacc,data){
        var sdate = "";
        if(data.sdate != "")
            sdate = data.sdate +" "+ new Date().toString("MMM yyyy");

        var paymentdd = "";
        if(data.paymentdd != "")
            paymentdd = data.paymentdd +" "+ new Date().toString("MMM yyyy");

        var cut_off_date = "";
        if(data.sdate != "")
            cut_off_date = data.sdate +" "+ new Date().addMonths(1).toString("MMM yyyy");

        var next_due_date = "";
        if(data.paymentdd != "")
            next_due_date = data.paymentdd +" "+ new Date().addMonths(1).toString("MMM yyyy");

        vm.db.update("accounts",{
            "accgroup":data.selectedAccGroup,
            "accname":data.accname,
            "fourdigits":data.fourdigits,
            "expirymonth":data.expirymonth,
            "expiryyear":data.expiryyear,
            "cardtype":data.selectedCardType,
            "bank":data.bank,
            "statement_date":sdate,
            "payment_due_date":paymentdd,
            "cut_off_date":cut_off_date,
            "next_due_date":next_due_date,
            "status":selectedacc.status,
            "annual_fee":data.annualfee,
            "outstd_amount":selectedacc.outstd_amount,
            "due_amount":selectedacc.due_amount,
            "balance":data.balance
        },{"accid":selectedacc.accid});

    }

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

    ///////////////////////////////////////////////////////////////////////
    //////////////////////////For Transactions/////////////////////////////
    ///////////////////////////////////////////////////////////////////////

    var tempTransList = [];

    //Transactions Categories
    var expenseCategories = {
        Movie:{label:'Movie'},
        Petrol:{label:'Petrol'},
        Other:{label:'Other'}
    }
    var incomeCategories = {
        Bonus:{label:'Bonus'},
        Cashback:{label:'Cashback'},
        Other:{label:'Other'}
    }

    //GET Expense Categories
    vm.getExpenseCategories = function(){
        return expenseCategories;
    }

    //GET Income Categories
    vm.getIncomeCategories = function(){
        return incomeCategories;
    }

    //Default New Transactions Form
    var currentDate = new Date();
    currentDate = new Date(currentDate).toISOString().split("T")[0];
    var defNewTransForm = {
        "transdate" : currentDate,
        "selectedTransGroup" : "",
        "transcategory" : "",
        "transamount":0,
        "transdesc":"",
        "transacc":"",
        "fromtransacc":"",
        "totransacc":""
    }

    //GET Default New Transaction Form
    vm.getDefaultNewTransForm = function(){
        return defNewTransForm;
    }

    //CREATE Transaction Table
    vm.db.createTable('transactions',{
            "transid":{
                "type":"INTEGER",
                "null":"NOT NULL",
                "primary":true,
                "auto_increment":true
            },
            "transgroup":{
                "type":"TEXT",
                "null":"NOT NULL"
            },
            "transcategory":{
                "type":"TEXT"
            },
            "transdate":{
                "type":"DATE",
                "null":"NOT NULL"
            },
            "transamount":{
                "type":"DOUBLE"
            },
            "transacc":{
                "type":"INTEGER"
            },
            "fromtransacc":{
                "type":"INTEGER"
            },
            "totransacc":{
                "type":"INTEGER"
            },
            "transdesc":{
                "type":"TEXT"
            }
    });

    //INSERT new transaction
    vm.insertIntoTransactions = function(data){
        if(data.selectedTransGroup == 'transfer')
            data.transcategory = "Transfer";

        vm.db.insert('transactions',{
           "transgroup":data.selectedTransGroup,
           "transcategory":data.transcategory,
           "transdate":data.transdate,
           "transamount":data.transamount,
           "transacc":data.transacc,
           "fromtransacc":data.fromtransacc,
           "totransacc":data.totransacc,
           "transdesc":data.transdesc
       })

    }

    //GET All Transactions
    vm.getAllTransactions = function(){
        tempTransList = [];
        vm.db.selectAll("transactions",[
            {operator:"ORDER BY",postOperator:'DESC',columns:['transdate'] }
        ]).then(function(results){
            for(var i=0;i<results.rows.length;i++){
                tempTransList.push(results.rows.item(i));
            }
        })
        return tempTransList;
    }

    //UPDATE selected Transaction
    vm.updateSelectedTransactions = function(id,data){
        if(data.selectedTransGroup == 'transfer')
            data.transcategory = "Transfer";
        var amount = 0;
        if(data.selectedTransGroup == "expense")
            amount = -Math.abs(data.transamount);
        else if(data.selectedTransGroup == "income")
            amount = Math.abs(data.transamount);

        vm.db.update('transactions',{
           "transgroup":data.selectedTransGroup,
           "transcategory":data.transcategory,
           "transdate":data.transdate,
           "transamount":amount,
           "transacc":data.transacc,
           "fromtransacc":data.fromtransacc,
           "totransacc":data.totransacc,
           "transdesc":data.transdesc
       },{"transid":id})
    }

    //DELETE Transaction
    vm.deleteTransaction = function(id){
        vm.db.del("transactions",{"transid":id});
    }

    //UPDATE Account Balance After Added Transaction(Expense, Income)
    vm.updateAccBalance = function(type,trans,newtrans){
        var tempBalance = 0;
        var prevTransAmount = 0;
        for(var i in tempAccList){
            tempBalance = 0;
            prevTransAmount = 0;
            tempBalance = tempAccList[i].balance;
            console.log(tempBalance);
        if(type=="createtrans"){
                if(tempAccList[i].accid == trans.transacc){
                    tempBalance = tempBalance + trans.transamount;
                    console.log(trans);
                    vm.db.update("accounts",{"balance":tempBalance},{
                "accid":tempAccList[i].accid});
                    break;
                }
        }else if(type=="edittrans"){
            for(var j in tempTransList){
                if(tempTransList[j].transid == trans.transid){
                    prevTransAmount = tempTransList[j].transamount;
                    }
                }
                if(tempAccList[i].accid == trans.transacc){
                    tempBalance -= prevTransAmount;
                    tempBalance += newtrans.transamount;
                    vm.db.update("accounts",{"balance":tempBalance},{
                "accid":tempAccList[i].accid});
                    break;
                }
        }else if(type=="deletetrans"){
            for(var j in tempTransList){
                if(tempTransList[j].transid == trans.transid){
                    prevTransAmount = tempTransList[j].transamount;
                }
            }if(tempAccList[i].accid == trans.transacc){
                    tempBalance -= prevTransAmount;
                    vm.db.update("accounts",{"balance":tempBalance},{
                "accid":tempAccList[i].accid});
                    break;
                    }
                }
            }
        }
        //UPDATE Account Balance for Transfer
        vm.updateAccBalanceForTransfer = function(from,to,amount){
            var frombalance = 0;
            var tobalance = 0;
            for(var i=0;i<tempAccList.length;i++){
                if(tempAccList[i].accid == from){
                    frombalance = tempAccList[i].balance;
                }else if(tempAccList[i].accid == to){
                    tobalance = tempAccList[i].balance;
                }
            }
            frombalance = frombalance - amount;
            tobalance += amount;
            vm.db.update("accounts",{"balance":frombalance},{"accid":from});
            vm.db.update("accounts",{"balance":tobalance},{"accid":to});


        }

}])
