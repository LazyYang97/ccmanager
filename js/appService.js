//Services
app.service('appService',['$webSql',function($webSql){
    this.todayDate = new Date();
    this.cvtTodayDate = new Date(this.todayDate).toISOString().split("T")[0];

    this.accountGroups = {
        creditcard:{"label":'Credit Card'},
        debitcard:{"label":'Debit Card'},
        cash:{"label":'Cash'}
    }

    this.cardTypes = {
        Visa:{label:'Visa'},
        Master:{label:'Master'}
    };

    this.expenseCategories = {
        Movie:{label:'Movie'},
        Petrol:{label:'Petrol'},
        Food:{label:'Food'},
        Other:{label:'Other'}
    };

    this.incomeCategories = {
        Bonus:{label:'Bonus'},
        Cashback:{label:'Cashback'},
        Salary:{label:'Salary'},
        Other:{label:'Other'}
    };

    this.rewardsCategories = {
        Points:{label:'Points'},
        CashRebate:{label:'Cash Rebate'},
        Discount:{label:'Discount'},
        LuckyDraw:{label:'Lucky Draw'}
    };

    this.defNewAccForm = {
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
    }

    //GET Default Edit Acc Form
    this.getDefEditAccForm = function(account){
        var editAccForm = {};
        var sdate = new Date(account.statement_date).getDate();
        var paymentdd = new Date(account.payment_due_date).getDate();
        editAccForm = {
                "selectedAccGroup":account.accgroup,
                "accname":account.accname,
                "fourdigits":account.fourdigits,
                "expirymonth":account.expirymonth,
                "expiryyear":account.expiryyear,
                "selectedCardType":account.cardtype,
                "bank":account.bank,
                "sdate":sdate,
                "paymentdd":paymentdd,
                "annualfee":account.annual_fee,
                "balance":account.balance
        }
        return editAccForm;

    }

        this.defNewTransForm = {
            "transdate" : this.cvtTodayDate,
            "transgroup" : 'expense',
            "transcategory" : "",
            "transamount":0,
            "transdesc":"",
            "transacc":"",
            "fromtransacc":"",
            "totransacc":"",
            "transnotes":""
        }

    this.getDefEditTransForm = function(trans){
        editTransForm = {
            "transdate" : trans.transdate,
            "transgroup" : trans.transgroup,
            "transcategory" : trans.transcategory,
            "transamount":trans.transamount,
            "transdesc":trans.transdesc,
            "transacc":trans.transacc,
            "fromtransacc":trans.fromtransacc,
            "totransacc":trans.totransacc,
            "transnotes":trans.transnotes
        }
        return editTransForm;
    }
}])
