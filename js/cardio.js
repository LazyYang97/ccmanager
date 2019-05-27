function scan(){

        CardIO.scan({
            "requireExpiry": true,
            "requireCVV": false,
            "requirePostalCode": false,
            "restrictPostalCodeToNumericOnly": true
        },
        onCardIOComplete,
        onCardIOCancel
        );

         var onCardIOCancel = function() {
                console.log("card.io scan cancelled");
              };

        var onCardIOComplete = function(response) {
                console.log("card.io scan complete");
                for (var i = 0, len = cardIOResponseFields.length; i < len; i++) {
                  var field = cardIOResponseFields[i];
                  console.log(field + ": " + response[field]);

                  //fields added by CardIO
                  //cardType: Visa
                  //redactedCardNumber: **** **** **** 9123
                  //cardNumber: 40006263456789123
                  //expiryMonth: 12
                  //expiryYear: 2021
                  //cvv: undefined
                  //postalCode: undefined

                  //set value for input fields
                  //var last4digits = cardIOResponseFields[2].toString().substring(last4digits.length - 4, last4digits.length);

                  //document.getElementById("cardnumb").value = 123456;
                  //alert(last4digits);

                  //document.getElementById("expiry").value = cardIOResponseFields[3] + "." + cardIOResponseFields[4];

                  //if(cardIOResponseFields[0]=="Visa"){
                    //document.getElementById("type").selectedIndex = "0";
                    //}
                }
//                alert("TESTING");
//                var strCardNum = response[cardIOResponseFields[2]].toString();
//                var strLast4Digits = strCardNum.substring(strCardNum.length - 4, strCardNum.length);
//                //alert(strLast4Digits);
//                var last4digits = Number(strLast4Digits);
//                //alert(last4digits);
//                document.getElementById("cardnumb").value = last4digits;
//
//                var expiryMonth = response[cardIOResponseFields[3]];
//                //alert(expiryMonth);
//                var strExYear = response[cardIOResponseFields[4]].toString();
//                //alert(strExYear);
//                var str2DigitsYear = strExYear.substring(strExYear.length - 2, strExYear.length);
//                //alert(str2DigitsYear);
//                document.getElementById("expiry").value = "" + expiryMonth + "." + str2DigitsYear;
//
//                var cardType = response[cardIOResponseFields[0]].toString();
//                if(cardType=="Visa"){
//                    document.getElementById("type").selectedIndex = "0";
//                }
              };
}
