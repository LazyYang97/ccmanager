app.databaseController = function($scope,$webSql,appService){
    //Create Database
    $scope.db = $webSql.openDatabase('ccmanagerdb', '1.0', 'CCmanager DB', 2 * 1024 * 1024);

    //Create Accounts Table
    $scope.db.createTable('accounts',{
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
            "settlestatus":{
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
            "due_amount_updated":{
                "type":"BIT"
            },
            "balance":{
                "type":"DOUBLE"
            },
            "base_balance":{
                "type":"DOUBLE"
            }
        });

        //CREATE Table for Transactions
        $scope.db.createTable('transactions',{
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
            },
            "transnotes":{
                "type":"TEXT"
            }
    });

    //Create Promotions Related Tables
    $scope.db.createTable('promotions',{
            "promoid":{
                "type":"INTEGER",
                "null":"NOT NULL",
                "primary":true,
                "auto_increment":true
            },
            "promotitle":{
                "type":"TEXT"
            },
            "minspend":{
                "type":"DOUBLE"
            }
    })
    $scope.db.createTable('promorelatedacc',{
            "promorelatedaccid":{
                "type":"INTEGER",
                "null":"NOT NULL",
                "primary":true,
                "auto_increment":true
            },
            "accid":{
                "type":"INTEGER"
            },
            "promoid":{
                "type":"INTEGER"
            }
    })
    $scope.db.createTable('promoexpcat',{
         "promoexpcatid":{
                "type":"INTEGER",
                "null":"NOT NULL",
                "primary":true,
                "auto_increment":true
            },
            "category":{
                "type":"text"
            },
            "promoid":{
                "type":"INTEGER"
            }
    })
    $scope.db.createTable('promorewards',{
         "promorewardsid":{
                "type":"INTEGER",
                "null":"NOT NULL",
                "primary":true,
                "auto_increment":true
            },
            "rewardtype":{
                "type":"TEXT"
            },
            "promoid":{
                "type":"INTEGER"
            }
    })
}
