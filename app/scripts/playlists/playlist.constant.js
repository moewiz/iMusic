/**
 * Created by ndkhoa1 on 9/28/2016.
 */
(function () {
  'use strict';

  angular
    .module('iMusicApp')
    .constant('playlistConstant', {
      API: {
        PATH: 'scripts/playlists/playlists.json'
      },
      TEMPLATE_URL: {
        ADD_PLAYLIST: 'scripts/playlists/templates/addPlaylist.html',
        SONGS_OF_PLAYLIST: 'scripts/playlists/templates/songsOfPlaylist.html',
        DIALOG_SONGS: 'scripts/playlists/templates/dialogSongs.html',
        EDIT: 'scripts/playlists/templates/editPlaylist.html',
        LIST: 'scripts/playlists/templates/list.html'
      },
      VALIDATE: {
        MAX_LENGTH: 32
      },
      VIEW: {
        ADD_PLAYLIST: 'add_playlist',
        SONGS_OF_PLAYLIST: 'songs_of_playlist',
        EDIT: 'edit',
        LIST: 'list'
      }
    });

})();

