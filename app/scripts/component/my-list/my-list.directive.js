/**
 * Created by ndkhoa1 on 9/30/2016.
 *
 * data = your_data
 * config = {
 *  updateRows: your_function,  // add function for Sync button
 *  hideList: your_function,    // add function for Hide button
 *  header1: your_key,          // get row by your_data[your_key] to show on list
 *  header2: your_key           // get row by your_data[your_key] to show on list
 *  width: your_width           // customize width of list by 'width', using Angular Material's Layout flex
 * }
 *
 * @example
 * var array_song = [
 *  {
 *    name: ABC,
 *    artist: xyz
 *  }
 * ];
 * data = array_song;
 * config = {
 *  updateRows: updateSongsOfPlaylist
 *  hideList: hideDetails,
 *  header1: 'name',
 *  header2: 'artist',
 *  width : 70
 * }
 *
 * function updateSongsOfPlaylist() {
 *  // code
 * }
 * function hideDetails() {
 * // code
 * }
 */
(function () {
  'use strict';

  angular
    .module('iComponent')
    .directive('myList', myList);

  myList.$inject = ['myListConstant'];

  function myList(myListConstant) {
    var directive = {
      bindToController: myListConstant.BIND_TO_CONTROLLER,
      controller: 'myListController',
      controllerAs: 'vm',
      restrict: myListConstant.RESTRICT,
      scope: {
        data: '=',
        config: '='
      },
      templateUrl: myListConstant.TEMPLATE_URL
    };
    return directive;
  }
})();
