/**
 * Created by ndkhoa1 on 9/27/2016.
 */
(function () {
  'use strict';

  angular
    .module('iMusicApp')
    .constant('songConstant', {
      API: {
        GET_ALL_SONGS: 'scripts/songs/songs.json'
      },
      TEMPLATE_URL: {
        ADD: 'scripts/songs/templates/addAndEdit.html',
        EDIT: 'scripts/songs/templates/addAndEdit.html',
        LIST: 'scripts/songs/templates/list.html'
      },
      VALIDATE: {
        MAX_LENGTH: 32
      },
      VIEW: {
        ADD: 'add',
        EDIT: 'edit',
        LIST: 'list'
      }
    });

})();

