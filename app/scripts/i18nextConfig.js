/**
 * Created by ndkhoa1 on 10/6/2016.
 */
'use strict';

angular
  .module('jm.i18next')
  .config(['$i18nextProvider', function ($i18nextProvider) {
    $i18nextProvider.options = {
      lng: 'en',
      useCookie: false,
      useLocalStorage: false,
      debug: true,
      fallbackLng: 'en',
      resGetPath: 'locales/__lng__/__ns__.json',
      defaultLoadingValue: 'en'
    };
  }]);
