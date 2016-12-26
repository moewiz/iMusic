/**
 * Created by ndkhoa1 on 10/3/2016.
 */
(function () {
  'use strict';

  angular
    .module('iComponent')
    .controller('myListController', myListController);

  myListController.$inject = [];

  function myListController() {
    var vm = this;

    // show/hide Sync button if user uncheck/check on row
    vm.isEnableSyncButton = isEnableSyncButton;
    // if provide a function for updateRows, show Sync button
    // Sync button use i18n key: 'component.myList.syncBtn'
    vm.activateSyncBtn = angular.isFunction(vm.config.updateRows);
    // if provide a function for hideList, show Hide button
    // Hide button use i18n key: 'component.myList.hideDetails'
    vm.activateHiddenBtn = angular.isFunction(vm.config.hideList);

    function isEnableSyncButton() {
      for (var i = vm.data.length; i--;) {
        if (vm.data[i].check === false) {
          return true;
        }
      }
      return false;
    }
  }

})();
