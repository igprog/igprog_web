﻿/*!
admin.js
(c) 2017 IG PROG, www.igprog.hr
*/
angular.module('app', [])

.controller('adminCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    var getConfig = function () {
        $http.get('./config/config.json')
          .then(function (response) {
              $rootScope.config = response.data;
          });
    };
    getConfig();

    $scope.islogin = false;
    var d = new Date();
    $scope.year = d.getFullYear();

    $scope.toggleTpl = function (x) {
        $scope.tpl = x;
    };
    $scope.toggleTpl('login');

    init = function () {
        $scope.user = {
            username: '',
            password: ''
        }
    }
    init();

    $scope.login = function (u) {
        $http({
            url: 'Admin.asmx/Login',
            method: 'POST',
            data: {username: u.username, password: u.password }
        })
         .then(function (response) {
             $scope.islogin = JSON.parse(response.data.d);
             if ($scope.islogin == true) {
                 $scope.toggleTpl('programPrehraneWeb');
             } else {
                 alert('error login');
             }
         },
         function (response) {
             $scope.islogin = false;
             alert(response.data.d);
         });
    }

    $scope.logout = function () {
        $scope.islogin = false;
        $scope.toggleTpl('login');
        init();
    }

}])

.controller('applicationCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    var load = function () {
        $http({
            url: $rootScope.config.backend + 'Instal.asmx/Load',
            method: 'POST',
            data: ''
        })
         .then(function (response) {
             $scope.d = JSON.parse(response.data.d);
         },
         function (response) {
             alert(response.data.d);
         });
        }
    load();

}])

.controller('webAppCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.showDetails = false;
    $scope.loading = false;
    $scope.limit = 10;
    $scope.page = 1;
    $scope.searchQuery = '';

    var total = function () {
        $scope.loading = true;
        $http({
            url: $rootScope.config.backend + 'Users.asmx/Total',
            method: 'POST',
            data: ''
        })
        .then(function (response) {
            $scope.t = JSON.parse(response.data.d);
            $scope.loading = false;
        },
        function (response) {
            $scope.loading = false;
            alert(response.data.d);
        });
    }
    total();

    var load = function () {
        $scope.loading = true;
        $http({
            url: $rootScope.config.backend + 'Users.asmx/Load',
            method: 'POST',
            data: { limit: $scope.limit, page: $scope.page }
        })
        .then(function (response) {
            $scope.loading = false;
            $scope.d = JSON.parse(response.data.d);
        },
        function (response) {
            $scope.loading = false;
            alert(response.data.d);
        });
    }
    //load();

    $scope.search = function () {
        $scope.loading = true;
        $scope.page = 1;
        $http({
            url: $rootScope.config.backend + 'Users.asmx/Search',
            method: 'POST',
            data: { query: $scope.searchQuery, limit: $scope.limit, page: $scope.page }
        })
        .then(function (response) {
            $scope.d = JSON.parse(response.data.d);
            $scope.loading = false;
        },
        function (response) {
            $scope.loading = false;
            alert(response.data.d);
        });
    }
    $scope.search();

    $scope.update = function (user) {
        $http({
            url: $rootScope.config.backend + 'Users.asmx/Update',
            method: 'POST',
            data: { x: user }
        })
            .then(function (response) {
                load();
                total();
                alert(response.data.d);
            },
            function (response) {
                alert(response.data.d);
            });
    }

    $scope.remove = function(user) {
        var r = confirm("Briši " + user.firstName + " "  + user.lastName + "?");
        if (r == true) {
            remove(user);
        } else {
        }
    }

    var remove = function (user) {
        $http({
            url: $rootScope.config.backend + 'Users.asmx/Delete',
            method: 'POST',
            data: { x: user }
        })
            .then(function (response) {
                load();
                total();
                alert(response.data.d);
            },
            function (response) {
                alert(response.data.d);
            });
    }

    $scope.idxStart = 0;
    $scope.idxEnd = 10;
    $scope.setPage = function (x) {
        $scope.idxStart = 0 + x;
        $scope.idxEnd = 10 + x;
    }

    $scope.showAllPages = function () {
        $scope.idxStart = 0;
        $scope.idxEnd = $scope.d.length;
    }


    google.charts.load('current', { 'packages': ['line'] });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Aktivacije');
        data.addColumn('number', 'Postotak licenci');
        data.addColumn('number', 'Licence');
        $http({
            url: $rootScope.config.backend + 'Users.asmx/TotalList',
            method: 'POST',
            data: ''
        })
        .then(function (response) {
            var tl = JSON.parse(response.data.d);
            angular.forEach(tl, function (value, key) {
                data.addRows([
                       [key, value.licencepercentage, value.licence]
                ]);
            })
            var options = {
                chart: {
                    title: 'Pregled registracija i aktivacija'
                },
                height: 250
            };
            var chart = new google.charts.Line(document.getElementById('chart_ppweb'));
            chart.draw(data, google.charts.Line.convertOptions(options));
        },
        function (response) {
            alert(response.data.d);
        });
    }

    $scope.nextPage = function() {
        $scope.page = $scope.page + 1;
        load();
    }

    $scope.prevPage = function () {
        if ($scope.page > 1) {
            $scope.page = $scope.page - 1;
            load();
        }
    }

}])

.controller('ordersCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    var load = function () {
        $http({
            url: $rootScope.config.backend + 'Orders.asmx/Load',
            method: 'POST',
            data: ''
        })
     .then(function (response) {
         $scope.orders = JSON.parse(response.data.d);
     },
     function (response) {
         alert(response.data.d);
     });
    }
    load();

}])


;
