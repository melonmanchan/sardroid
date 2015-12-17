'use strict';

/*
 * The "main" module of the whole app, so to speak...
 * Mostly handles setting up configuration variables
 * and wiring up the states, controllers and templates
 */

angular.module('sardroid', ['ionic', 'ngStorage', 'login', 'pascalprecht.translate', 'logout', 'contacts', 'userprofile', 'call', 'peerhandler', 'drawinghandler', 'audiohandler', 'sockethandler', 'confighandler'])

.run(function($ionicPlatform, $rootScope, $ionicSideMenuDelegate) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
                StatusBar.styleDefault();
            }

            // WARNING! Mega hack to disable side menu login
            // TODO: Fix this somehow?
            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams){
                    if (toState.name === 'login' ){
                        $rootScope.showRightMenu = false;
                        $ionicSideMenuDelegate._instances[0].right.isEnabled = false;
                    }
                    else {
                        $rootScope.showRightMenu = true;
                        $ionicSideMenuDelegate.canDragContent(true);
                        $ionicSideMenuDelegate._instances[0].right.isEnabled = true;
                    }

                    if (toState.name === 'call') {
                        $ionicSideMenuDelegate.canDragContent(false);
                    }
                    else {
                        $ionicSideMenuDelegate.canDragContent(true);
                    }

                });
            // Disable showing right menu by default
            $rootScope.showRightMenu = false;
            $ionicSideMenuDelegate._instances[0].right.isEnabled = false;
})
}).config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    $stateProvider
        .state('login', {
            cache: false,
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'})
        .state('tabs', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html'
        })
        .state('userprofile', {
            cache: false,
            url: '/userprofile',
            templateUrl: 'templates/userprofile.html',
            controller: 'UserProfileCtrl',
            params: { user: null }
        })
         .state('call', {
            cache: false,
            url: '/call',
            templateUrl: 'templates/call.html',
            controller: 'CallCtrl',
            params: { user: null }
         })
        .state('tabs.home', {
            url: '/home',
            views: {
                'home-tab': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('tabs.contacts', {
            url: '/contacts',
            views: {
                 'contacts-tab': {
                    templateUrl: 'templates/contacts.html',
                    controller: 'ContactsCtrl'
                }
            }
    });

    $translateProvider.
        useStaticFilesLoader({
            prefix: 'res/locales/',
            suffix: '.json'
        })
        .registerAvailableLanguageKeys(['en', 'fi'], {
        'en': 'en', 'en_GB': 'en', 'en_US': 'en',
        'fi': 'fi'
        })
        .preferredLanguage('en')
        .fallbackLanguage('en')
        .determinePreferredLanguage()
        .useSanitizeValueStrategy('sanitizeParameters')

    $urlRouterProvider.otherwise('/login');

});

