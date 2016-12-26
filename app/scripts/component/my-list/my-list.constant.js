/**
 * Created by ndkhoa1 on 9/30/2016.
 */
(function () {
  'use strict';

  angular
    .module('iComponent')
    .constant('myListConstant', {
      TEMPLATE_URL: 'scripts/component/my-list/my-list.html',
      BIND_TO_CONTROLLER: true,
      RESTRICT: 'AE'
    });
})();
