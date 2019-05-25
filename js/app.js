var app = angular.module('myApp',['onsen','angular-websql','angular.filter']);

app.controller('MainController',function($scope,$webSql,appService){

    ons.disableAutoStyling();

    app.databaseController($scope,$webSql,appService);
    app.accountsController($scope,$webSql,appService);
    app.transactionsController($scope,$webSql,appService);
    app.promotionsController($scope,$webSql,appService);

    $scope.tempAccList = [];
    $scope.tempTransList = [];
    $scope.selectedAcc = [];
    $scope.selectedTrans = [];

    $scope.init = function(){
        $scope.cvtTodayDate = appService.cvtTodayDate;
        $scope.expensecategories = appService.expenseCategories;
        $scope.incomecategories = appService.incomeCategories;
        $scope.accgroups = appService.accountGroups;
        $scope.cardtypes = appService.cardTypes;
        $scope.rewardscategories = appService.rewardsCategories;
        $scope.showAllAccounts();
        $scope.showAllTransactions();
        $scope.checkIsAfterCutOff();
    }

    //Update the Balance of All Accounts
    $scope.updateAllAccBalance = function(){
        var accessor = function(obj){
            return obj['accid'];
        }
        var accessor2 = function(obj){
            return obj['transacc'];
        }
        var accessor3 = function(obj){
            return obj['fromtransacc'];
        }
        var accessor4 = function(obj){
            return obj['totransacc'];
        }
        if($scope.tempAccList.length != 0 && $scope.tempTransList.length != 0){
        $scope.acctransJoined = {};
        $scope.acctransJoined = _.hashLeftOuterJoin($scope.tempAccList,accessor,$scope.tempTransList,accessor2);

        $scope.fromtransJoined = _.hashLeftOuterJoin($scope.tempAccList,accessor,$scope.tempTransList,accessor3);

        $scope.totransJoined = _.hashLeftOuterJoin($scope.tempAccList,accessor,$scope.tempTransList,accessor4);

        $scope.expenseAccTransJoined = [];
        $scope.incomeAccTransJoined = [];
        for(var i in $scope.acctransJoined){
            if($scope.acctransJoined[i].transgroup == "expense"){
                $scope.expenseAccTransJoined.push($scope.acctransJoined[i]);
            }else if($scope.acctransJoined[i].transgroup == "income"){
                $scope.incomeAccTransJoined.push($scope.acctransJoined[i]);
            }
        }
        $scope.expenseJoined = _.groupBy($scope.expenseAccTransJoined,'accid');
        $scope.expenseTotal = [];
        for(var i in $scope.expenseJoined){
            var exp_total = _.sumBy($scope.expenseJoined[i],'transamount');
            var tempObject = {i,exp_total};
            $scope.expenseTotal.push(tempObject);
        }

        $scope.incomeJoined = _.groupBy($scope.incomeAccTransJoined,'accid');
        $scope.incomeTotal = [];
        for(var i in $scope.incomeJoined){
            var inc_total = _.sumBy($scope.incomeJoined[i],'transamount');
            var tempObject = {i,inc_total};
            $scope.incomeTotal.push(tempObject);
        }

        $scope.fromJoined = _.groupBy($scope.fromtransJoined,'accid');
        $scope.fromTotal = [];
        for(var i in $scope.fromJoined){
            var from_total = _.sumBy($scope.fromJoined[i],'transamount');
            var tempObject = {i,from_total};
            $scope.fromTotal.push(tempObject);
        }

        $scope.toJoined = _.groupBy($scope.totransJoined,'accid');
        $scope.toTotal = [];
        for(var i in $scope.toJoined){
            var to_total = _.sumBy($scope.toJoined[i],'transamount');
            var tempObject = {i,to_total};
            $scope.toTotal.push(tempObject);
        }
        var merged = _.merge(_.keyBy($scope.expenseTotal,'i'),_.keyBy($scope.incomeTotal,'i'),_.keyBy($scope.fromTotal,'i'),_.keyBy($scope.toTotal,'i'));
        var values = _.values(merged);
        var accessor5 = function(obj){
            return obj['i'];
        }
        $scope.mergedJoined = _.hashLeftOuterJoin(values,accessor5,$scope.tempAccList,accessor);
        $scope.summarise = []
        for(var j in $scope.mergedJoined){
            if($scope.mergedJoined[j].exp_total == null)
                $scope.mergedJoined[j].exp_total = 0;
            if($scope.mergedJoined[j].inc_total == null)
                $scope.mergedJoined[j].inc_total = 0;
            if($scope.mergedJoined[j].from_total == null)
                $scope.mergedJoined[j].from_total = 0;
            if($scope.mergedJoined[j].to_total == null)
                $scope.mergedJoined[j].to_total = 0;
            var sum = 0;

            if($scope.mergedJoined[j].accgroup != 'creditcard'){
                sum = $scope.mergedJoined[j].base_balance - $scope.mergedJoined[j].exp_total + $scope.mergedJoined[j].inc_total - $scope.mergedJoined[j].from_total + $scope.mergedJoined[j].to_total;
            }else if($scope.mergedJoined[j].accgroup == 'creditcard'){
                sum = $scope.mergedJoined[j].exp_total - $scope.mergedJoined[j].inc_total + $scope.mergedJoined[j].from_total - $scope.mergedJoined[j].to_total;
            }
            var accid = $scope.mergedJoined[j].accid;
            var accgroup = $scope.mergedJoined[j].accgroup;
            var tempObject = {accid , accgroup, sum};
            $scope.summarise.push(tempObject);
        }
        for(var i in $scope.summarise){
            if($scope.summarise[i].accgroup != "creditcard"){
                $scope.db.update("accounts",{"balance":$scope.summarise[i].sum},{"accid":$scope.summarise[i].accid});
            }else if($scope.summarise[i].accgroup == "creditcard"){
                $scope.db.update("accounts",{"outstd_amount":$scope.summarise[i].sum},{"accid":$scope.summarise[i].accid});
                }

            }
        }else if($scope.tempTransList.length == 0){
            for(var i in $scope.tempAccList){
                if($scope.tempAccList[i].accgroup != 'creditcard'){
                    $scope.db.update("accounts",{"balance":$scope.tempAccList[i].base_balance},{"accid":$scope.tempAccList[i].accid});
                }else if($scope.tempAccList[i].accgroup == 'creditcard'){
                    $scope.db.update("accounts",{"outstd_amount":0},{"accid":$scope.tempAccList[i].accid});
                }
            }
        }
        $scope.showAllAccounts();
    }

})

app.filter('range', function(){
    return function(input,min,max){
        min = parseInt(min);
        max = parseInt(max);
        for(var i=min;i<=max;i++)
            input.push(i);
        return input;
    }
});
