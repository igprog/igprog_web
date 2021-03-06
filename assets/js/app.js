﻿/*!
app.js
(c) 2019 - 2020 IG PROG, www.igprog.hr
*/
angular.module('app', [])

.factory('f', ['$http', ($http) => {
    return {
        post: (service, method, data) => {
            return $http({
                url: '../' + service + '.asmx/' + method,
                method: 'POST',
                data: data
            }).then((response) => {
                return JSON.parse(response.data.d);
            }, (response) => {
                return response.data.d;
            });
        }
    }
}])

.controller('appCtrl', ['$scope', '$http', '$rootScope', 'f', function ($scope, $http, $rootScope, f) {

    var getConfig = () => {
        $http.get('../config/config.json')
          .then(function (response) {
              $rootScope.config = response.data;
          });
    };
    getConfig();
    $scope.year = (new Date).getFullYear();
}])

.controller('contactCtrl', ['$scope', '$http', '$rootScope', 'f', function ($scope, $http, $rootScope, f) {
    var service = 'Mail';
    $scope.showAlert = false;
    $scope.sendicon = 'far fa-envelope';
    $scope.sendicontitle = 'Pošalji';

    var init = () => {
        f.post(service, 'Init', {}).then((d) => {
            $scope.d = d;
        });
    }
    init();

    $scope.send = (d) => {
        $scope.isSendButtonDisabled = true;
        $scope.sendicon = 'fa fa-spinner fa-spin';
        $scope.sendicontitle = 'Šaljem';
        d.subject = 'Upit';

        f.post(service, 'Send', { x: d }).then((d) => {
            if (d.resp === 'OK') {
                $scope.showAlert = true;
                $scope.sendicon = 'far fa-envelope';
                $scope.sendicontitle = 'Pošalji';
                window.location.hash = 'contact';
            } else {
                $scope.showAlert = false;
                $scope.sendicon = 'far fa-envelope';
                $scope.sendicontitle = 'Pošalji';
                alert(d.resp);
            }
        });
    }

}])

.directive('cardDirective', () => {
    return {
        restrict: 'E',
        scope: {
            link: '=',
            domain: '=',
            product: '=',
            shortdesc: '=',
            img: '='
        },
        templateUrl: '../assets/partials/directive/card.html'
    };
})

;