app.promotionsController = function($scope,$webSql,appService){

    //New Promo Page
    $scope.showNewPromoPage = function(index){
        if(index == 1){
            $scope.newpromoview = 'html/newpromopg1.html';
        }else if(index == 2){
            $scope.newpromoview = 'html/newpromopg2.html';
        }else if(index == 3){
            $scope.newpromoview = 'html/newpromopg3.html';
        }else if(index == 4){
            $scope.newpromoview = 'html/newpromopg4.html';
        }

    }

    //Get Selected Related Accounts
    $scope.relatedAcc = [];
    $scope.toggleRelatedAccSelection = function toggleRelatedAccSelection(account,name){
        var idx = $scope.relatedAcc.indexOf(account);
        if(idx > -1){
            $scope.relatedAcc.splice(idx,1);
        }else{
            $scope.relatedAcc.push(account);
        }
    }

    //Get Selected Expense Categories
    $scope.relatedExpCategories = [];
    $scope.toggleExpSelection = function(cat){
        var idx = $scope.relatedExpCategories.indexOf(cat);
        if(idx > -1){
            $scope.relatedExpCategories.splice(idx,1);
        }else{
            $scope.relatedExpCategories.push(cat);
        }
    }

    //Get Selected Related Rewards
    $scope.relatedRewards = [];
    $scope.toggleRewardsSelection = function(rewards){
        var idx = $scope.relatedRewards.indexOf(rewards);
        if(idx > -1){
            $scope.relatedRewards.splice(idx,1);
        }else{
            $scope.relatedRewards.push(rewards);
        }
    }
    //Set the New Promos forms to default
    $scope.setNewPromosFormDefault = function(){
        $scope.newpromo.promotitle="";
        $scope.newpromo.minspend = 0;
        $scope.relatedExpCategories = [];
        $scope.relatedAcc = [];
        $scope.relatedRewards = [];
    }

    $scope.newpromo = {};
    //New Promo Submit
    $scope.submitNewPromo = function(){
        $scope.createNewPromotion();
        $scope.selectPromotion('create');
        $scope.showAllPromos();
        $scope.toastmsg = "Created "+ $scope.newpromo.promotitle;
        promosNavigator.popPage();
    }
    $scope.showAllPromos = function(){
        $scope.selectPromotion('show');
        $scope.performPromotionJoins();
    }

    //Insert New Promotion in to Database
    $scope.createNewPromotion = function(){
        if($scope.newpromo.minspend=='' || $scope.newpromo.minspend == 'undefined')
            $scope.newpromo.minspend = 0;
        $scope.db.insert("promotions",{
            "promotitle":$scope.newpromo.promotitle,
            "minspend":$scope.newpromo.minspend
        })
        $scope.selectPromotion('create');
    }

    //Select Promotions from Database
    $scope.tempPromoList = [];
    $scope.selectPromotion = function(state){
        $scope.db.selectAll("promotions",[{operator:"ORDER BY",postOperator:'DESC',columns:['promoid']}])
        .then(function(results){
            $scope.tempPromoList = [];
            for(var i = 0; i<results.rows.length;i++){
                $scope.tempPromoList.push(results.rows.item(i));
            }
            if(state == 'create')
                $scope.createRelatedAccItems();
            else if(state == 'show')
                $scope.selectRelatedAccItems();
        })
    }

    //Insert New Related Accounts into Database
    $scope.createRelatedAccItems = function(){
        for(var i in $scope.relatedAcc){
            $scope.db.insert("promorelatedacc",{
            "accid" : $scope.relatedAcc[i],
            "promoid" : $scope.tempPromoList[0].promoid,
            });
        }
        $scope.createRelatedExpCatItems();
    }

    //Select Related Accounts from Database
    $scope.tempPromoRelatedAccList = [];
    $scope.selectRelatedAccItems = function(){
        $scope.db.selectAll("promorelatedacc")
        .then(function(results){
            $scope.tempPromoRelatedAccList = [];
            for(var i = 0; i<results.rows.length;i++){
                $scope.tempPromoRelatedAccList.push(results.rows.item(i));
            }
            $scope.selectRelatedExpCat();
        })
    }

    //Insert New Related Expense Categories into Database
    $scope.createRelatedExpCatItems = function(){
        for(var i in $scope.relatedExpCategories){
            $scope.db.insert("promoexpcat",{
            "category" : $scope.relatedExpCategories[i],
            "promoid" : $scope.tempPromoList[0].promoid,
            });
        }
        $scope.createPromoRewardsItem();
    }

    //Select Related Expense Categories from Database
    $scope.tempRelatedExpCatList = [];
    $scope.selectRelatedExpCat = function(){
        $scope.db.selectAll("promoexpcat")
        .then(function(results){
            $scope.tempRelatedExpCatList = [];
            for(var i = 0; i<results.rows.length;i++){
                $scope.tempRelatedExpCatList.push(results.rows.item(i));
            }
            $scope.selectPromoRewards();
        })
    }

    //Insert New Promotions Rewards into Database
    $scope.createPromoRewardsItem = function(){
        for(var i in $scope.relatedRewards){
            $scope.db.insert("promorewards",{
            "rewardtype" : $scope.relatedRewards[i],
            "promoid" : $scope.tempPromoList[0].promoid,
            });
        }
        $scope.setNewPromosFormDefault();
    }

    //Select the Related Rewards from Database
    $scope.tempPromoRewardsList = [];
    $scope.selectPromoRewards = function(){
        $scope.db.selectAll("promorewards")
        .then(function(results){
            $scope.tempPromoRewardsList = [];
            for(var i = 0; i<results.rows.length;i++){
                $scope.tempPromoRewardsList.push(results.rows.item(i));
            }
            $scope.performPromotionJoins();
        })
    }

    //Perform Join to join the Promotions Related Arrays
    $scope.promotionJoined = {};
    $scope.performPromotionJoins = function(){
        var accessor = function(obj){
            return obj['promoid']
        }
        var accessor2 = function(obj){
            return obj['accid']
        }
        $scope.init();
        $scope.promotionJoined = {};
        $scope.promotionJoined = _.hashInnerJoin($scope.tempPromoList,accessor,$scope.tempPromoRelatedAccList,accessor);
        $scope.promotionJoined = _.hashInnerJoin($scope.promotionJoined, accessor, $scope.tempRelatedExpCatList, accessor);
        $scope.promotionJoined = _.hashInnerJoin($scope.promotionJoined,accessor,$scope.tempPromoRewardsList,accessor);
        $scope.promotionJoined = _.hashLeftOuterJoin($scope.promotionJoined,accessor2,$scope.tempAccList,accessor2);
    }

    //Delete Promotion
    $scope.deletePromo = function(id,promoname){
        ons.notification.confirm({message: "Are you sure you want to delete this promotion?",callback:function(idx){
            switch(idx){
                case 0:
                    ons.notification.confirm.hide();
                    break;
                case 1:
                    $scope.toastmsg = "Deleted";
                    $scope.db.del("promotions",{"promoid":id});
                    $scope.db.del("promorelatedacc",{"promoid":id});
                    $scope.db.del("promoexpcat",{"promoid":id});
                    $scope.db.del("promorewards",{"promoid":id});
                    $scope.showAllPromos();
                    toast.show();
                    break;
            }
        }});
    }

    //Suggest Features
    $scope.suggestAccList = {};
    $scope.suggestionsFeatures = function(selectedCat,spendamount){
        var suggestResults = [];
        var categoryfilteredPromo = _.filter($scope.promotionJoined,{'category':selectedCat});
        var minspendFiltered = _.filter(categoryfilteredPromo,({minspend})=>minspend<=spendamount);
        console.log(minspendFiltered);
        var groupedAccPromo = _.groupBy(minspendFiltered,'accid');
        var rewardsRelated = []
        for(var i in groupedAccPromo){
            var rate = 0;
            if(_.some(groupedAccPromo[i],{"category":selectedCat})){
                rate = rate + 4;
            }
            if(_.some(groupedAccPromo[i],{"rewardtype":"CashRebate"})){
                rate = rate + 2;
                rewardsRelated.push({i,rewards:'CashRebate'});
            }
            if(_.some(groupedAccPromo[i],{"rewardtype":"Points"})){
                rate = rate + 2;
                rewardsRelated.push({i,rewards:'Points'});
            }
            if(_.some(groupedAccPromo[i],{"rewardtype":"Discount"})){
                rate = rate + 2;
                rewardsRelated.push({i,rewards:'Discount'});
            }
            if(_.some(groupedAccPromo[i],{"rewardtype":"LuckyDraw"})){
                rate = rate + 1;
                rewardsRelated.push({i,rewards:'LuckyDraw'});
            }
            var tempObject = {i,rate}
            suggestResults.push(tempObject);
        }
        var accessor = function(obj){
            return obj['accid']
        }
        var accessor2 = function(obj){
            return obj['i']
        }
        var accessor3 = function(obj){
            return obj['id']
        }
        var recommendedRated = [];
        for(var i in suggestResults){
            var id = suggestResults[i].i
            if(suggestResults[i].rate == (_.maxBy(suggestResults,'rate').rate)){
                var tempObject = {id,suggest:"Highly Recommended"};
                recommendedRated.push(tempObject);

            }else{
                var tempObject = {id,suggest:"Recommended"}
                recommendedRated.push(tempObject);
            }
        }
        var rewardsResultsJoined = _.hashInnerJoin(rewardsRelated,accessor2,recommendedRated,accessor3)
        $scope.suggestAccList = _.hashInnerJoin($scope.tempAccList,accessor,rewardsResultsJoined,accessor2);
    }

    //Select Suggested Account
    $scope.selectSuggestedAccount = function(id){
        console.log(id);
        $scope.transsubmitted.transacc = parseInt(id);
        newTransNavigator.popPage();
    }

}
