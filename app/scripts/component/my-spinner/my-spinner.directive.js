/**
 * Created by ndkhoa1 on 10/12/2016.
 */
(function () {
  'use strict';

  angular
    .module('iComponent')
    .directive('mySpinner', mySpinner);

  mySpinner.$inject = [];

  /* @ngInject */
  function mySpinner() {
    var directive = {
      restrict: 'A',
      transclude: true,
      scope: {
        mySpinner: '='
      },
      template: '<div ng-if="mySpinner" class="spinner-container"><md-progress-circular md-mode="indeterminate"></md-progress-circular></div>' +
      '<div ng-transclude ng-hide="mySpinner"></div>'
    };
    return directive;
  }


})();

