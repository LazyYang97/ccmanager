         //backup account button
        function backupacc(){

            function onInitFs(fs) {
              console.log('Opened file system: ' + fs.name);
            }

            function errorHandler(e) {
              var msg = '';

              switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR:
                  msg = 'QUOTA_EXCEEDED_ERR';
                  break;
                case FileError.NOT_FOUND_ERR:
                  msg = 'NOT_FOUND_ERR';
                  break;
                case FileError.SECURITY_ERR:
                  msg = 'SECURITY_ERR';
                  break;
                case FileError.INVALID_MODIFICATION_ERR:
                  msg = 'INVALID_MODIFICATION_ERR';
                  break;
                case FileError.INVALID_STATE_ERR:
                  msg = 'INVALID_STATE_ERR';
                  break;
                default:
                  msg = 'Unknown Error';
                  break;
              };

              console.log('Error: ' + msg);
            }

            //request file system persistent and call OnInitFs and errorHandler function above
            window.requestFileSystem(window.PERSISTENT, 50*1024*1024, onInitFs, errorHandler);

            //fail function for websqldump
            function fail(){
                console.log("Something went wrong");
            }

            //Backup accounts table using websqldump
            websqldump.export({
              database: 'ccmanagerdb',
                table: 'accounts',
                dataonly: true,
                linebreaks: true,
                success: function(sql) {
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
                    console.log("got main dir",dir);
                    dir.getFile("accounts.sql", {create:true}, function(file) {
                        console.log("got the file", file);
                        logOb = file;
                        console.log("App Started");

                        if(!logOb) return;
                        var log = sql;
                        console.log("going to log "+log);
                        logOb.createWriter(function(fileWriter) {

                            fileWriter.seek(fileWriter.length);

                            var blob = new Blob([log], {type:'text/plain'});
                            fileWriter.write(blob);
                            console.log("Backup should be created");
                            alert("Backup created, use list test to confirm!")
                        }, fail);

                    });
                });
              }
            });


        }
        //Backup accounts ends here

        //backup transaction button
        function backuptran(){

            function onInitFs(fs) {
              console.log('Opened file system: ' + fs.name);
            }

            function errorHandler(e) {
              var msg = '';

              switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR:
                  msg = 'QUOTA_EXCEEDED_ERR';
                  break;
                case FileError.NOT_FOUND_ERR:
                  msg = 'NOT_FOUND_ERR';
                  break;
                case FileError.SECURITY_ERR:
                  msg = 'SECURITY_ERR';
                  break;
                case FileError.INVALID_MODIFICATION_ERR:
                  msg = 'INVALID_MODIFICATION_ERR';
                  break;
                case FileError.INVALID_STATE_ERR:
                  msg = 'INVALID_STATE_ERR';
                  break;
                default:
                  msg = 'Unknown Error';
                  break;
              };

              console.log('Error: ' + msg);
            }

            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

            window.requestFileSystem(window.PERSISTENT, 50*1024*1024 /*50MB*/, onInitFs, errorHandler);

            function fail(){
                console.log("Something went wrong");
            }

            //Backup transactions table uisng websqldump
            websqldump.export({
              database: 'ccmanagerdb',
                table: 'transactions',
                dataonly: true,
                linebreaks: true,
                success: function(sql) {
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
                    console.log("got main dir",dir);
                    dir.getFile("transactions.sql", {create:true}, function(file) {
                        console.log("got the file", file);
                        logOb = file;
                        console.log("App Started");

                        if(!logOb) return;
                        var log = sql;
                        console.log("going to log "+log);
                        logOb.createWriter(function(fileWriter) {

                            fileWriter.seek(fileWriter.length);

                            var blob = new Blob([log], {type:'text/plain'});
                            fileWriter.write(blob);
                            console.log("Backup should be created");
                            alert("Backup created, use list test to confirm!")
                        }, fail);

                    });
                });
              }
            });

        }
        //Backup transactions ends here


        //backup promotions data button
        function backuppromo(){

            function onInitFs(fs) {
              console.log('Opened file system: ' + fs.name);
            }

            function errorHandler(e) {
              var msg = '';

              switch (e.code) {
                case FileError.QUOTA_EXCEEDED_ERR:
                  msg = 'QUOTA_EXCEEDED_ERR';
                  break;
                case FileError.NOT_FOUND_ERR:
                  msg = 'NOT_FOUND_ERR';
                  break;
                case FileError.SECURITY_ERR:
                  msg = 'SECURITY_ERR';
                  break;
                case FileError.INVALID_MODIFICATION_ERR:
                  msg = 'INVALID_MODIFICATION_ERR';
                  break;
                case FileError.INVALID_STATE_ERR:
                  msg = 'INVALID_STATE_ERR';
                  break;
                default:
                  msg = 'Unknown Error';
                  break;
              };

              console.log('Error: ' + msg);
            }

            window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

            window.requestFileSystem(window.PERSISTENT, 50*1024*1024 /*50MB*/, onInitFs, errorHandler);

            function fail(){
                console.log("Something went wrong");
            }

            //Backup promotions table uisng websqldump
            websqldump.export({
              database: 'ccmanagerdb',
                table: 'promotions',
                dataonly: true,
                linebreaks: true,
                success: function(sql) {
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
                    console.log("got main dir",dir);
                    dir.getFile("promotions.sql", {create:true}, function(file) {
                        console.log("got the file", file);
                        logOb = file;
                        console.log("App Started");

                        if(!logOb) return;
                        var log = sql;
                        console.log("going to log "+log);
                        logOb.createWriter(function(fileWriter) {

                            fileWriter.seek(fileWriter.length);

                            var blob = new Blob([log], {type:'text/plain'});
                            fileWriter.write(blob);
                            console.log("Backup should be created");
                            alert("Backup created, use list test to confirm!")
                        }, fail);

                    });
                });
              }
            });

            //Backup promorelatedacc table uisng websqldump
            websqldump.export({
              database: 'ccmanagerdb',
                table: 'promorelatedacc',
                dataonly: true,
                linebreaks: true,
                success: function(sql) {
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
                    console.log("got main dir",dir);
                    dir.getFile("promorelatedacc.sql", {create:true}, function(file) {
                        console.log("got the file", file);
                        logOb = file;
                        console.log("App Started");

                        if(!logOb) return;
                        var log = sql;
                        console.log("going to log "+log);
                        logOb.createWriter(function(fileWriter) {

                            fileWriter.seek(fileWriter.length);

                            var blob = new Blob([log], {type:'text/plain'});
                            fileWriter.write(blob);
                            console.log("Backup should be created");
                            alert("Backup created, use list test to confirm!")
                        }, fail);

                    });
                });
              }
            });

            //Backup promoexpcat table uisng websqldump
            websqldump.export({
              database: 'ccmanagerdb',
                table: 'promoexpcat',
                dataonly: true,
                linebreaks: true,
                success: function(sql) {
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
                    console.log("got main dir",dir);
                    dir.getFile("promoexpcat.sql", {create:true}, function(file) {
                        console.log("got the file", file);
                        logOb = file;
                        console.log("App Started");

                        if(!logOb) return;
                        var log = sql;
                        console.log("going to log "+log);
                        logOb.createWriter(function(fileWriter) {

                            fileWriter.seek(fileWriter.length);

                            var blob = new Blob([log], {type:'text/plain'});
                            fileWriter.write(blob);
                            console.log("Backup should be created");
                            alert("Backup created, use list test to confirm!")
                        }, fail);

                    });
                });
              }
            });

            //Backup promorewards table uisng websqldump
            websqldump.export({
              database: 'ccmanagerdb',
                table: 'promorewards',
                dataonly: true,
                linebreaks: true,
                success: function(sql) {
                window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(dir) {
                    console.log("got main dir",dir);
                    dir.getFile("promorewards.sql", {create:true}, function(file) {
                        console.log("got the file", file);
                        logOb = file;
                        console.log("App Started");

                        if(!logOb) return;
                        var log = sql;
                        console.log("going to log "+log);
                        logOb.createWriter(function(fileWriter) {

                            fileWriter.seek(fileWriter.length);

                            var blob = new Blob([log], {type:'text/plain'});
                            fileWriter.write(blob);
                            console.log("Backup should be created");
                            alert("Backup created, use list test to confirm!")
                        }, fail);

                    });
                });
              }
            });

        }
        //Backup promotions ends here


        //import account data button
        function readbackupacc(){

            var errorHandler = function (fileName, e) {
                var msg = '';

                switch (e.code) {
                    case FileError.QUOTA_EXCEEDED_ERR:
                        msg = 'Storage quota exceeded';
                        break;
                    case FileError.NOT_FOUND_ERR:
                        msg = 'File not found';
                        break;
                    case FileError.SECURITY_ERR:
                        msg = 'Security error';
                        break;
                    case FileError.INVALID_MODIFICATION_ERR:
                        msg = 'Invalid modification';
                        break;
                    case FileError.INVALID_STATE_ERR:
                        msg = 'Invalid state';
                        break;
                    default:
                        msg = 'Unknown error';
                        break;
                };
                console.log('Error (' + fileName + '): ' + msg);
            }


            function readFromFile(fileName) {
                var pathToFile = cordova.file.dataDirectory + fileName;
                window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();

                        reader.onloadend = function (e) {
                            console.log('Read ended');
                            console.log('Result: ' + reader.result);

                            var readerres = reader.result.toString();

                            var strreadres = readerres.replace(/`/g, '');

                                var queryArr = strreadres.split(';').map(function(item) {
                                      return item.trim();
                                    });

                                this.db = window.openDatabase('ccmanagerdb', '1.0', 'CCmanager DB', 2 * 1024 * 1024);


                                    this.db.transaction(
                                        function(tx){

                                            var i;
                                            for(i=0;i<queryArr.length;i++)
                                            {

                                               tx.executeSql(queryArr[i]+';', [],
                                                    function(tx, results){
                                                        //sucess
                                                        console.log("Table accounts restored");
                                                    },
                                                    function(tx, error){
                                                        console.log("Error while creating the table: " + error.message);
                                                    }
                                                );
                                            }
                                            console.log("Reading queryArr");

                                        },
                                        function(error){
                                            console.log("Transaction error: " + error.message);
                                        },
                                        function(){
                                            alert("Table accounts restored!");
                                        }
                                    );

                        };

                        reader.readAsText(file);
                    }, errorHandler.bind(null, fileName));
                });
            }

            readFromFile('accounts.sql');
        }

        //import transaction data button
        function readbackuptran(){

            var errorHandler = function (fileName, e) {
                var msg = '';

                switch (e.code) {
                    case FileError.QUOTA_EXCEEDED_ERR:
                        msg = 'Storage quota exceeded';
                        break;
                    case FileError.NOT_FOUND_ERR:
                        msg = 'File not found';
                        break;
                    case FileError.SECURITY_ERR:
                        msg = 'Security error';
                        break;
                    case FileError.INVALID_MODIFICATION_ERR:
                        msg = 'Invalid modification';
                        break;
                    case FileError.INVALID_STATE_ERR:
                        msg = 'Invalid state';
                        break;
                    default:
                        msg = 'Unknown error';
                        break;
                };
                console.log('Error (' + fileName + '): ' + msg);
            }


            function readFromFile(fileName) {
                var pathToFile = cordova.file.dataDirectory + fileName;
                window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();

                        reader.onloadend = function (e) {
                            console.log('Read ended');
                            console.log('Result: ' + reader.result);

                            var readerres = reader.result.toString();

                            var strreadres = readerres.replace(/`/g, '');

                                var queryArr = strreadres.split(';').map(function(item) {
                                      return item.trim();
                                    });

                                this.db = window.openDatabase('ccmanagerdb', '1.0', 'CCmanager DB', 2 * 1024 * 1024);


                                    this.db.transaction(
                                        function(tx){

                                            var i;
                                            for(i=0;i<queryArr.length;i++)
                                            {

                                               tx.executeSql(queryArr[i]+';', [],
                                                    function(tx, results){
                                                        //sucess
                                                        console.log("Table transactions restored");
                                                    },
                                                    function(tx, error){
                                                        console.log("Error while creating the table: " + error.message);
                                                    }
                                                );
                                            }
                                            console.log("Reading queryArr");

                                        },
                                        function(error){
                                            console.log("Transaction error: " + error.message);
                                        },
                                        function(){
                                            alert("Table transactions restored!");
                                        }
                                    );

                        };

                        reader.readAsText(file);
                    }, errorHandler.bind(null, fileName));
                });
            }

            readFromFile('transactions.sql');
        }

        //import promotions data button
        function readbackuppromo(){

            var errorHandler = function (fileName, e) {
                var msg = '';

                switch (e.code) {
                    case FileError.QUOTA_EXCEEDED_ERR:
                        msg = 'Storage quota exceeded';
                        break;
                    case FileError.NOT_FOUND_ERR:
                        msg = 'File not found';
                        break;
                    case FileError.SECURITY_ERR:
                        msg = 'Security error';
                        break;
                    case FileError.INVALID_MODIFICATION_ERR:
                        msg = 'Invalid modification';
                        break;
                    case FileError.INVALID_STATE_ERR:
                        msg = 'Invalid state';
                        break;
                    default:
                        msg = 'Unknown error';
                        break;
                };
                console.log('Error (' + fileName + '): ' + msg);
            }

            //import promotions data button
            function readFromFile(fileName) {
                var pathToFile = cordova.file.dataDirectory + fileName;
                window.resolveLocalFileSystemURL(pathToFile, function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();

                        reader.onloadend = function (e) {
                            console.log('Read ended');
                            console.log('Result: ' + reader.result);

                            var readerres = reader.result.toString();

                            var strreadres = readerres.replace(/`/g, '');

                                var queryArr = strreadres.split(';').map(function(item) {
                                      return item.trim();
                                    });

                                this.db = window.openDatabase('ccmanagerdb', '1.0', 'CCmanager DB', 2 * 1024 * 1024);


                                    this.db.transaction(
                                        function(tx){

                                            var i;
                                            for(i=0;i<queryArr.length;i++)
                                            {

                                               tx.executeSql(queryArr[i]+';', [],
                                                    function(tx, results){
                                                        //sucess
                                                        console.log("Insert promotions query successful");
                                                    },
                                                    function(tx, error){
                                                        console.log("Error while creating the table: " + error.message);
                                                    }
                                                );
                                            }
                                            console.log("Reading queryArr");

                                        },
                                        function(error){
                                            console.log("Transaction error: " + error.message);
                                        },
                                        function(){
                                            alert("Restoring 4 promotions related tables");
                                        }
                                    );

                        };

                        reader.readAsText(file);
                    }, errorHandler.bind(null, fileName));
                });
            }

            readFromFile('promotions.sql');
            setTimeout(readFromFile('promorelatedacc.sql'), 10);
            setTimeout(readFromFile('promoexpcat.sql'), 10);
            setTimeout(readFromFile('promorewards.sql'), 10);
        }

        //delete backup file button
        function deletebackup() {

            //delete accounts.sql backup file
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {

                dir.getFile("accounts.sql", {create: false}, function (fileEntry) {
                    fileEntry.remove(function (file) {
                        alert("accounts.sql removed!");
                    }, function (error) {
                        alert("error occurred: " + error.code);
                    }, function () {
                        alert("file does not exist");
                    });
                });
            });

            //delete transactions.sql backup file
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {

                dir.getFile("transactions.sql", {create: false}, function (fileEntry) {
                    fileEntry.remove(function (file) {
                        alert("transactions.sql removed!");
                    }, function (error) {
                        alert("error occurred: " + error.code);
                    }, function () {
                        alert("file does not exist");
                    });
                });
            });

            //delete promotions.sql backup file
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {

                dir.getFile("promotions.sql", {create: false}, function (fileEntry) {
                    fileEntry.remove(function (file) {
                        alert("promotions.sql removed!");
                    }, function (error) {
                        alert("error occurred: " + error.code);
                    }, function () {
                        alert("file does not exist");
                    });
                });
            });

            //delete promorelatedacc.sql backup file
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {

                dir.getFile("promorelatedacc.sql", {create: false}, function (fileEntry) {
                    fileEntry.remove(function (file) {
                        alert("promorelatedacc.sql removed!");
                    }, function (error) {
                        alert("error occurred: " + error.code);
                    }, function () {
                        alert("file does not exist");
                    });
                });
            });

            //delete promoexpcat.sql backup file
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {

                dir.getFile("promoexpcat.sql", {create: false}, function (fileEntry) {
                    fileEntry.remove(function (file) {
                        alert("promoexpcat.sql removed!");
                    }, function (error) {
                        alert("error occurred: " + error.code);
                    }, function () {
                        alert("file does not exist");
                    });
                });
            });

            //delete promorewards.sql backup file
            window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function (dir) {

                dir.getFile("promorewards.sql", {create: false}, function (fileEntry) {
                    fileEntry.remove(function (file) {
                        alert("promorewards.sql removed!");
                    }, function (error) {
                        alert("error occurred: " + error.code);
                    }, function () {
                        alert("file does not exist");
                    });
                });
            });

        }

        //drop table data button
        function dropdata() {
            this.db = window.openDatabase('ccmanagerdb', '1.0', 'CCmanager DB', 2 * 1024 * 1024);

            this.db.transaction(
            function(tx){
                tx.executeSql("DELETE FROM accounts;");
                tx.executeSql("DELETE FROM transactions;");
                tx.executeSql("DELETE FROM promotions;");
                tx.executeSql("DELETE FROM promorelatedacc;");
                tx.executeSql("DELETE FROM promoexpcat;");
                tx.executeSql("DELETE FROM promorewards;");
            },
            function(error){
                console.log("Transaction error: " + error.message);
            },
            function(){
                console.log("Drop table completed successfully");
            });
        }

        //list dir button
        function listDir(path){

          window.resolveLocalFileSystemURL(path,
                function (fileSystem) {
                  var reader = fileSystem.createReader();
                  reader.readEntries(
                    function (entries) {
                      console.log(entries);
                    },
                    function (err) {
                      console.log(err);
                    }
                  );
                }, function (err) {
                  console.log(err);
                }
              );

        }
