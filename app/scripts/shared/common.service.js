/**
 * Created by ndkhoa1 on 10/10/2016.
 */
(function() {
    'use strict';

    angular
        .module('iMusicApp')
        .service('commonService', commonService);

    commonService.$inject = ['$mdToast', '$mdDialog', '$i18next'];

    function commonService($mdToast, $mdDialog, $i18next) {
      var service = {};

      service.showConfirm = showConfirm;
      service.showToast = showToast;

      function showConfirm(callback, i18nKeyTitle, i18nKeyContent) {
        var confirm = $mdDialog.confirm()
          .title($i18next(i18nKeyTitle))
          .textContent($i18next(i18nKeyContent))
          .clickOutsideToClose(true)
          .ok($i18next('common.ok'))
          .cancel($i18next('common.cancel'));

        $mdDialog.show(confirm)
          .then(function() {
            callback();
          });
      }

      function showToast(i18nKeyContent) {
        $mdToast.show(
          $mdToast.simple()
            .textContent($i18next(i18nKeyContent))
            .position("top right")
            .hideDelay(1000)
        );
      }

      return service;
    }
})();
