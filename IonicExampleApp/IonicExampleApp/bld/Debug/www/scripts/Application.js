var app = angular.module('ionExampleApp', ['ionic']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '/templates/home.html',

    });
    $stateProvider.state('detail', {
        url: '/detail/:productId',
     
        templateUrl: '/templates/detail.html',
        
    });
    $urlRouterProvider.otherwise('/');
});


app.controller('listController', function ($scope, $ionicActionSheet, $timeout,$state) {


    var self = this;
    self.showSheet = function (recordId, index) {

        var sheetforHide = $ionicActionSheet.show({
            buttons: [
                { text: 'Detay' },
            ],
            destructiveText: 'Sil',
            titleText: 'Başlık',
            cancelText: 'Vazgeç',
            cancel: function () {

            },
            buttonClicked: function (index) {
                switch (index) {
                    case 0:
                        $state.go('detail', {productId:recordId})
                        break;
                }
                return true;
            },
            destructiveButtonClicked: function () {

                for (var i = 0; i < self.products.length; i++) {
                    if (self.products[i].Id == recordId) {
                        self.products.splice(i, 1);
                    }
                }
                return true;
            }
        });
        $timeout(sheetforHide, 2000);
    };

    self.doRefresh = function () {
  
        self.products = [];
        restfull().shoes.getAll(self.products);
        $scope.$broadcast('scroll.refreshComplete');
       
    }
    self.products = [];
     restfull().shoes.getAll(self.products);
    console.log(self.products);
});


app.controller('detailController', function ($stateParams) {
    var self = this;
    self.product = restfull().shoes.getById($stateParams.productId);
});