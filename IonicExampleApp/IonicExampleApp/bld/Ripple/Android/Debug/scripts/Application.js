
// app isimli modulümüzü(projemizin kendisi) javasscript tarafında oluşturuyoruz ve projemizin ionic isimli başla bir module bağımlı olduğunu bildiriyoruz.
var app = angular.module('ionExampleApp', ['ionic']);

// ionic ile routing işlemleri angular js den biraz farklı burda artık fonkisyonumuz $stateProvider ve $urlRouterProvider servislerine bağımlı.

app.config(function ($stateProvider, $urlRouterProvider) {
    // ionic bize hem state hemde url ile routing imkanı sunar
    // state i javascript tarafında url'i ise html tarafında href ler ile kullanabiliriz.
    $stateProvider.state('home', {
        url: '/',
        templateUrl: '/templates/home.html',

    });
    // $stateProvider servisi fluid tasarlanmış tır yani fonkisyonun dönüş tipi yine kendisidir.
    $stateProvider.state('detail', {
        //burda paramatreli bir route yazdık ionic de angular jsde olduğu gibi parametreler : ile ifade edilir.
        //eğer adresimize href üzerinden gidiyorsak bildiğimiz queryString leri kullanabiliriz.
        // eğer javascript ile çalıştırıyorsak json nesnesi olarak gönderebiliriz.
        url: '/detail/:productId',
     
        templateUrl: '/templates/detail.html',
        
    });
    // url hiçbirine uymadığı zaman / adresine gidilecek.
    $urlRouterProvider.otherwise('/');
});


//aynı angularJs üzerinde olduğu gibi bir controller oluşturuyoruz burada controllerımız $scope $ionicActionSheet,$timeout ve $state servislerine bağımlı.7
// bağımlılıkları angularJs framework'u inject edecek.
app.controller('listController', function ($scope, $ionicActionSheet, $timeout,$state) {

    //controllerımıza dışarıdan erişimleri rahat yönetmek adına self isimli bir değişkene atıyoruz.
    //dilersek bu erişimleri $scope servisi üzerindende yönetebilirdik.
    var self = this;
  // controlleromza showSheet isimli bir fonksiyon ekledik. ve dışarıdan parametre olarak recordId ile index değerlerini istiyor.
    self.showSheet = function (recordId, index) {
        // $ionicActionSheet servisisnden yaralanarak bir action Sheet gösteriyoruz. bu fonskyion actionSheet i saklayabileceğimiz bir fonksiyon döndürür.
        var sheetforHide = $ionicActionSheet.show({
            // dilediğimiz kadar buton tanımlayabilir ve hatta bunlararın içine html yazabiliriz.
            buttons: [
                { text: 'Detay' },
            ],
            //ionic framework u bizim için sil ve vazgeç butonlarını kendisi oluşturuyor.
            destructiveText: 'Sil',
            titleText: 'Başlık',
            cancelText: 'Vazgeç',
            cancel: function () {
                return true;
            },
            // custom oluşturduğumuz buton tıklandığında buttonClicked callback'i tetiklenir. ve içine kaçıncı butona tıklandığı yazılır.
            buttonClicked: function (idx) {
                switch (idx) {
                    case 0:
                        //$state servisindeki go fonksiyonu routing üzerinde belirlediğimiz template'in render edilmesine yarar. ve json nesnesi içinde dilediğimiz parametreleri gönderebiliriz.
                        $state.go('detail', {productId:recordId})
                        break;
                }
                // actionsheet callbacklarinde true döndürürsek action sheet kapanır.
                return true;
            },
            //silme butonuna basıldığında çağrılacak callback
            destructiveButtonClicked: function () {
                // eğer gerçek bir restfull kullanıyor olsaydık bu işlemlere gerek kalmıyacaktı.
                for (var i = 0; i < self.products.length; i++) {
                    if (self.products[i].Id == recordId) {
                        self.products.splice(i, 1);
                    }
                }
                return true;
            }
        });
        //$timeout servisi içine girilen milisaniye sonra bir callback çalıştırır bizim callback'imiz ise $ionicActionSheet servisi ile oluşturduğumuz sheetforHide fonksiyonu.
        $timeout(sheetforHide, 2000);
    };
    // controllerımıuza doRefresh isimli bir fonksiyon ekliyoruz.
    self.doRefresh = function () {
  
        self.products = [];
        restfull().shoes.getAll(self.products);
        //işlemimiz bittiği zaman ioniğin listenerına refreshComplate i broadCast ediyoruz. 
        $scope.$broadcast('scroll.refreshComplete');
       
    }
    self.products = [];
     restfull().shoes.getAll(self.products);
 
});

// detailController isimli bir controller oluşturduk ve buda $stateParams servisine bağımlı.
app.controller('detailController', function ($stateParams) {
    var self = this;
                                            //$stateParams servisi ile eklemiş olduğumuz parametrelere                          ulaşabiliriz.
    self.product = restfull().shoes.getById($stateParams.productId);
});