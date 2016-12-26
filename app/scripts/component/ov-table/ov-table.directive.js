/**
 * Created by ndkhoa1 on 9/21/2016.
 */
(function () {
  'use strict';

  angular
    .module('iComponent')
    .directive('ovTable', ovTable);

  ovTable.$inject = ['ovTableConstant'];

  function ovTable(ovTableConstant) {
    var directive = {
      restrict: 'AE',
      templateUrl: ovTableConstant.TEMPLATE_URL,
      scope: {
        data: '=', // [ {}, {}, {}, {}, ...]
        config: '=', // { columns: [{}, {}, {}, {}], filter: {} ]
        output: '=', // { listSelected: [], ...}
        mappingFunc: '=' // { fn, fn, fn, fn }
      },
      controller: 'OvTableController',
      controllerAs: 'vm',
      bindToController: true
    };
    return directive;
  }

})();
