/**
 * Created by ndkhoa1 on 9/20/2016.
 *
 * @example
 *  data = [
 *    {
 *      i18nKey: 'common.playlist',
 *      href: '#/playlists'
 *    }
 *  ];
 *
 */
(function() {
  'use strict';

  ovBreadcrumbs.$inject = ['ovBreadcrumbsConstant'];
  angular.module('iComponent')
    .directive('ovBreadcrumbs', ovBreadcrumbs);

  function ovBreadcrumbs(ovBreadcrumbsConstant) {
    var directive = {
      restrict: 'AE',
      templateUrl: ovBreadcrumbsConstant.TEMPLATE_URL,
      scope: {
        data: '='
      }
    };

    return directive;
  }
})();
