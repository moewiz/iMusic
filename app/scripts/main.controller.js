/**
 * Created by ndkhoa1 on 9/7/2016.
 */
(function () {
  'use strict';

  angular
    .module('iMusicApp')
    .controller('mainCtrl', mainCtrl);

  mainCtrl.$inject = ['$scope', '$mdSidenav', '$location', '$i18next'];

  /* @ngInject */
  function mainCtrl($scope, $mdSidenav, $location, $i18next) {
    $scope.toggleSidenav = toggleSidenav;
    $scope.isSelected = isSelected;
    $scope.selectedLanguage = 'en';
    $scope.languages = [
      {
        title: 'English',
        key: 'en'
      }, {
        title: 'Tiếng Việt',
        key: 'vi'
      }
    ];

    $scope.$watch('selectedLanguage', function (){
      $i18next.options.lng = $scope.selectedLanguage;
    });

    function toggleSidenav(componentId) {
      $mdSidenav(componentId).toggle();
    }

    function isSelected(url) {
      return (url === $location.path());
    }
  }

})();
