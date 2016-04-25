// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var mymap = angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform, $location, $rootScope, $ionicPopup) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
    
    //主页面显示退出提示框
    $ionicPlatform.registerBackButtonAction(function (e) {

        e.preventDefault();

        function showConfirm() {
            var confirmPopup = $ionicPopup.confirm({
                title: '<strong>退出应用?</strong>',
                template: '你确定要退出应用吗?',
                okText: '退出',
                cancelText: '取消'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    if(navigator.app){
                            navigator.app.exitApp();
                    }else if(navigator.device){
                            navigator.device.exitApp();
                    }
                } else {
                    // Don't close
                }
            });
        }

        // Is there a page to go back to?
        if ($location.path() == '/app/playlists' || $location.path() == '/app/search' || $location.path() == '/app/browse') {
            showConfirm();
        } else if ($rootScope.$viewHistory.backView ) {
            console.log('currentView:', $rootScope.$viewHistory.currentView);
            // Go back in history
            $rootScope.$viewHistory.backView.go();
        } else {
            // This is the last page: Show confirmation popup
            showConfirm();
        }

        return false;
    }, 101);
    
})

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
    
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');
    
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
  
  .state('app.update', {
    url: '/update',
    views: {
      'menuContent': {
        templateUrl: 'templates/update.html',
          controller: 'UpdatePictureCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
          controller: 'SearchCtrl'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller: 'BrowseCtrl'
        }
      }
    })
  
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          cache: false,
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/playlists');
    
});
