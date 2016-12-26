'use strict';
angular
  .module('iMusicApp')
  .config(config);

function config($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'home.html'
    })
    .when('/songs', {
      templateUrl: 'scripts/songs/song.html',
      controller: 'SongCtrl',
      controllerAs: 'vm'
    })
    .when('/playlists', {
      templateUrl: 'scripts/playlists/playlist.html',
      controller: 'PlaylistCtrl',
      controllerAs: 'vm'
    })
    .otherwise({
      redirectTo: '/404.html',
      templateUrl: '404.html'
    });
}
