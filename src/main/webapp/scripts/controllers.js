'use strict';

/* Controllers */

ntipaMashupApp.controller('MainController', function ($scope) {
    });



//controllers manage an object $scope in AngularJS (this is the view model)
ntipaMashupApp.controller('PlumbCtrl', function($scope) {

    // define a module with library id, schema id, etc.
    function module(library_id, schema_id, title, description, x, y) {
        this.library_id = library_id;
        this.schema_id = schema_id;
        this.title = title;
        this.description = description;
        this.x = x;
        this.y = y;
    }

    // module should be visualized by title, icon
    $scope.library = [];

    // library_uuid is a unique identifier per module type in the library
    $scope.library_uuid = 0; 

    // state is [identifier, x position, y position, title, description]
    $scope.schema = [];

    // schema_uuid should always yield a unique identifier, can never be decreased
    $scope.schema_uuid = 0; 

    // todo: find out how to go back and forth between css and angular
    $scope.library_topleft = {
            x: 15,
            y: 145,
            item_height: 50,
            margin: 5,
    };

    $scope.module_css = {
            width: 150,
            height: 100, // actually variable
    };

    $scope.redraw = function() {
        $scope.schema_uuid = 0;
        jsPlumb.detachEveryConnection();
        $scope.schema = [];
        $scope.library = [];

     
        var functions = [
        'RicercaGoogle',
        'VisualizzaGeoMappa',
        'AggregaDati',
        'SommaSequenza',
        'MostraGrafici',
        'CampoRicerca',
        'Meteo',
        'InviaOffice360',
        'ApriViewPdf',
        'ApriChat',
        'RiconosciTestoDaVoce',
        'OcrDocumento',
        'ThumbnailDocumento',
        'ConvertiDocumento',
        'ListaUtenti',
        'RicercaDocumentale',
        'ClusterRicerca',
        'ClusterRicerca',];
        var x,y = 0;

        angular.forEach(functions, function(funct) {

       //  x = x + $scope.library_topleft.x+$scope.library_topleft.margin;
        // y = y + $scope.library_topleft.y+$scope.library_topleft.margin;


         $scope.addModuleToLibrary(funct, funct , x,  y);
  


        });

         };

    // add a module to the library
    $scope.addModuleToLibrary = function(title, description, posX, posY) {
        console.log("Add module " + title + " to library, at position " + posX + "," + posY);
        var library_id = $scope.library_uuid++;
        var schema_id = -1;
        var m = new module(library_id, schema_id, title, description, posX, posY);
        $scope.library.push(m);
    };

    // add a module to the schema
    $scope.addModuleToSchema = function(library_id, posX, posY) {
        console.log("Add module " + title + " to schema, at position " + posX + "," + posY);
        var schema_id = $scope.schema_uuid++;
        var title = "Unknown";
        var description = "Likewise unknown";
        for (var i = 0; i < $scope.library.length; i++) {
            if ($scope.library[i].library_id == library_id) {
                title = $scope.library[i].title;
                description = $scope.library[i].description;
            }
        }
        var m = new module(library_id, schema_id, title, description, posX, posY);
        $scope.schema.push(m);
    };

    $scope.removeState = function(schema_id) {
        console.log("Remove state " + schema_id + " in array of length " + $scope.schema.length);
        for (var i = 0; i < $scope.schema.length; i++) {
            // compare in non-strict manner
            if ($scope.schema[i].schema_id == schema_id) {
                console.log("Remove state at position " + i);
                $scope.schema.splice(i, 1);
            }
        }
    };

    $scope.init = function() {
        jsPlumb.bind("ready", function() {
            console.log("Set up jsPlumb listeners (should be only done once)");
            jsPlumb.bind("connection", function (info) {
                $scope.$apply(function () {
                    console.log("Possibility to push connection into array");
                });
            });
        });
    }
});

ntipaMashupApp.controller('AdminController', function ($scope) {
    });

ntipaMashupApp.controller('LanguageController', function ($scope, $translate, LanguageService) {
        $scope.changeLanguage = function (languageKey) {
            $translate.use(languageKey);

            LanguageService.getBy(languageKey).then(function(languages) {
                $scope.languages = languages;
            });
        };

        LanguageService.getBy().then(function (languages) {
            $scope.languages = languages;
        });
    });

ntipaMashupApp.controller('MenuController', function ($scope) {
    });

ntipaMashupApp.controller('LoginController', function ($scope, $location, AuthenticationSharedService) {
        $scope.rememberMe = true;
        $scope.login = function () {
            AuthenticationSharedService.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            });
        }
    });

ntipaMashupApp.controller('LogoutController', function ($location, AuthenticationSharedService) {
        AuthenticationSharedService.logout();
    });

ntipaMashupApp.controller('SettingsController', function ($scope, Account) {
        $scope.success = null;
        $scope.error = null;
        $scope.settingsAccount = Account.get();

        $scope.save = function () {
            Account.save($scope.settingsAccount,
                function (value, responseHeaders) {
                    $scope.error = null;
                    $scope.success = 'OK';
                    $scope.settingsAccount = Account.get();
                },
                function (httpResponse) {
                    $scope.success = null;
                    $scope.error = "ERROR";
                });
        };
    });

ntipaMashupApp.controller('RegisterController', function ($scope, $translate, Register) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.errorUserExists = null;
        $scope.register = function () {
            if ($scope.registerAccount.password != $scope.confirmPassword) {
                $scope.doNotMatch = "ERROR";
            } else {
                $scope.registerAccount.langKey = $translate.use();
                $scope.doNotMatch = null;
                Register.save($scope.registerAccount,
                    function (value, responseHeaders) {
                        $scope.error = null;
                        $scope.errorUserExists = null;
                        $scope.success = 'OK';
                    },
                    function (httpResponse) {
                        $scope.success = null;
                        if (httpResponse.status === 304 &&
                                httpResponse.data.error && httpResponse.data.error === "Not Modified") {
                            $scope.error = null;
                            $scope.errorUserExists = "ERROR";
                        } else {
                            $scope.error = "ERROR";
                            $scope.errorUserExists = null;
                        }
                    });
            }
        }
    });

ntipaMashupApp.controller('ActivationController', function ($scope, $routeParams, Activate) {
        Activate.get({key: $routeParams.key},
            function (value, responseHeaders) {
                $scope.error = null;
                $scope.success = 'OK';
            },
            function (httpResponse) {
                $scope.success = null;
                $scope.error = "ERROR";
            });
    });

ntipaMashupApp.controller('PasswordController', function ($scope, Password) {
        $scope.success = null;
        $scope.error = null;
        $scope.doNotMatch = null;
        $scope.changePassword = function () {
            if ($scope.password != $scope.confirmPassword) {
                $scope.doNotMatch = "ERROR";
            } else {
                $scope.doNotMatch = null;
                Password.save($scope.password,
                    function (value, responseHeaders) {
                        $scope.error = null;
                        $scope.success = 'OK';
                    },
                    function (httpResponse) {
                        $scope.success = null;
                        $scope.error = "ERROR";
                    });
            }
        };
    });

ntipaMashupApp.controller('SessionsController', function ($scope, resolvedSessions, Sessions) {
        $scope.success = null;
        $scope.error = null;
        $scope.sessions = resolvedSessions;
        $scope.invalidate = function (series) {
            Sessions.delete({series: encodeURIComponent(series)},
                function (value, responseHeaders) {
                    $scope.error = null;
                    $scope.success = "OK";
                    $scope.sessions = Sessions.get();
                },
                function (httpResponse) {
                    $scope.success = null;
                    $scope.error = "ERROR";
                });
        };
    });

 ntipaMashupApp.controller('MetricsController', function ($scope, MetricsService, HealthCheckService, ThreadDumpService) {

        $scope.refresh = function() {
            HealthCheckService.check().then(function(promise) {
                $scope.healthCheck = promise.data;
            },function(promise) {
                $scope.healthCheck = promise.data;
            });

            $scope.metrics = MetricsService.get();

            $scope.metrics.$get({}, function(items) {

                $scope.servicesStats = {};
                $scope.cachesStats = {};
                angular.forEach(items.timers, function(value, key) {
                    if (key.indexOf("web.rest") != -1 || key.indexOf("service") != -1) {
                        $scope.servicesStats[key] = value;
                    }

                    if (key.indexOf("net.sf.ehcache.Cache") != -1) {
                        // remove gets or puts
                        var index = key.lastIndexOf(".");
                        var newKey = key.substr(0, index);

                        // Keep the name of the domain
                        index = newKey.lastIndexOf(".");
                        $scope.cachesStats[newKey] = {
                            'name': newKey.substr(index + 1),
                            'value': value
                        };
                    }
                });
            });
        };

        $scope.refresh();

        $scope.threadDump = function() {
            ThreadDumpService.dump().then(function(data) {
                $scope.threadDump = data;

                $scope.threadDumpRunnable = 0;
                $scope.threadDumpWaiting = 0;
                $scope.threadDumpTimedWaiting = 0;
                $scope.threadDumpBlocked = 0;

                angular.forEach(data, function(value, key) {
                    if (value.threadState == 'RUNNABLE') {
                        $scope.threadDumpRunnable += 1;
                    } else if (value.threadState == 'WAITING') {
                        $scope.threadDumpWaiting += 1;
                    } else if (value.threadState == 'TIMED_WAITING') {
                        $scope.threadDumpTimedWaiting += 1;
                    } else if (value.threadState == 'BLOCKED') {
                        $scope.threadDumpBlocked += 1;
                    }
                });

                $scope.threadDumpAll = $scope.threadDumpRunnable + $scope.threadDumpWaiting +
                    $scope.threadDumpTimedWaiting + $scope.threadDumpBlocked;

            });
        };

        $scope.getLabelClass = function(threadState) {
            if (threadState == 'RUNNABLE') {
                return "label-success";
            } else if (threadState == 'WAITING') {
                return "label-info";
            } else if (threadState == 'TIMED_WAITING') {
                return "label-warning";
            } else if (threadState == 'BLOCKED') {
                return "label-danger";
            }
        };
    });

ntipaMashupApp.controller('LogsController', function ($scope, resolvedLogs, LogsService) {
        $scope.loggers = resolvedLogs;

        $scope.changeLevel = function (name, level) {
            LogsService.changeLevel({name: name, level: level}, function () {
                $scope.loggers = LogsService.findAll();
            });
        }
    });

ntipaMashupApp.controller('AuditsController', function ($scope, $translate, $filter, AuditsService) {
        $scope.onChangeDate = function() {
            AuditsService.findByDates($scope.fromDate, $scope.toDate).then(function(data){
                $scope.audits = data;
            });
        };

        // Date picker configuration
        $scope.today = function() {
            // Today + 1 day - needed if the current day must be included
            var today = new Date();
            var tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1); // create new increased date

            $scope.toDate = $filter('date')(tomorrow, "yyyy-MM-dd");
        };

        $scope.previousMonth = function() {
            var fromDate = new Date();
            if (fromDate.getMonth() == 0) {
                fromDate = new Date(fromDate.getFullYear() - 1, 0, fromDate.getDate());
            } else {
                fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, fromDate.getDate());
            }

            $scope.fromDate = $filter('date')(fromDate, "yyyy-MM-dd");
        };

        $scope.today();
        $scope.previousMonth();

        AuditsService.findByDates($scope.fromDate, $scope.toDate).then(function(data){
            $scope.audits = data;
        });
    });

