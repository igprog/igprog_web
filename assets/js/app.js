/*!
app.js
(c) 2017 IG PROG, www.igprog.hr
*/
angular.module('app', [])


.controller('appCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {

    var getConfig = function () {
        $http.get('./config/config.json')
          .then(function (response) {
              $rootScope.config = response.data;
          });
    };
    getConfig();

    $scope.today = new Date;
   
}])

.controller('contactCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $scope.showAlert = false;
    $scope.sendicon = 'fa fa-paper-plane-o';
    $scope.sendicontitle = 'Pošalji';

    $scope.d = {
        name: '',
        email: '',
        message: ''
    }

    $scope.send = function (d) {
        if ($rootScope.config.backend == undefined) { $rootScope.getConfig(); }
        $scope.isSendButtonDisabled = true;
        $scope.sendicon = 'fa fa-spinner fa-spin';
        $scope.sendicontitle = 'Šaljem';
        $http({
            url: 'Mail.asmx/Send',
            method: 'POST',
            data: { name: d.name, email: d.email, messageSubject: 'Upit', message: d.message }
        })
       .then(function (response) {
           $scope.showAlert = true;
           $scope.sendicon = 'fa fa-paper-plane-o';
           $scope.sendicontitle = 'Pošalji';
           window.location.hash = 'contact';
       },
       function (response) {
           $scope.showAlert = false;
           $scope.sendicon = 'fa fa-paper-plane-o';
           $scope.sendicontitle = 'Pošalji';
           alert(response.data.d);
       });
    }

}])


;