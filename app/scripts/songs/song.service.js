(function () {
  'use strict';

  angular
    .module('iMusicApp')
    .service('songService', ovService);

  ovService.$inject = ['songConstant', '$http', '$q'];

  function ovService(songConstant, $http, $q) {
    var service = {};

    service.cache = {
      view: {
        view: songConstant.VIEW.LIST,
        url: songConstant.TEMPLATE_URL.LIST
      },
      currentSong: {},
      query: {},
      listSelected: [],
      songTemp: {}
    };

    service.songs = null;

    /**
     * Load data from json file
     */
    service.loadData = loadData;

    /**
     * Get list of songs
     */
    service.getSongs = getSongs;

    /**
     * Get song by Id
     * */
    service.getSongById = getSongById;

    /**
     * Get list songs by array Id
     * */
    service.getSongsForPlaylist = getSongsForPlaylist;

    /**
     * Add a song
     */
    service.add = add;

    /**
     * Edit a song
     * */
    service.edit = edit;

    /**
     * Delete multiple songs
     * */
    service.deleteSongs = deleteSongs;

    service.deleteSong = deleteSong;

    function loadData() {
      var defer = $q.defer();
      $http.get(songConstant.API.GET_ALL_SONGS)
        .then(function (response) {
          service.songs = response.data;
          defer.resolve(service.songs);
        })
        .catch(function (error) {
          defer.reject(error);
        });

      return defer.promise;
    }

    /**
     * @return all songs
     * */
    function getSongs() {
      return service.songs;
    }

    /**
     * @retun a song
     * */
    function getSongById(_id) {
      for (var i = 0; i < service.songs.length; i++) {
        if (service.songs[i].id === _id) {
          return angular.copy(service.songs[i]);
        }
      }
      return null;
    }

    /**
     * @return an array songs with check is true
     * */
    function getSongsForPlaylist(ids) {
      var songs = [];
      for (var i = 0; i < ids.length; i++) {
        var song = getSongById(ids[i]);
        if (song) {
          song.check = true;
          songs.push(song);
        }
      }
      return songs;
    }

    function add(song) {
      song.id = service.songs.length + 1;
      service.songs.push(song);
    }

    function edit(song) {
      for (var i = 0; i < service.songs.length; i++) {
        if (service.songs[i].id === song.id) {
          service.songs[i].name = song.name;
          service.songs[i].artist = song.artist;
        }
      }
    }

    function deleteSong(id) {
      var result = false;
      for (var i = 0; i < service.songs.length; i++) {
        if (id === service.songs[i].id) {
          service.songs.splice(i, 1);
          result = true;
          break;
        }
      }
      return result;
    }

    function deleteSongs(ids) {
      var result = false;
      for (var i = 0; i < ids.length; i++) {
        for (var j = 0; j < service.songs.length; j++) {
          if (ids[i] === service.songs[j].id) {
            service.songs.splice(j, 1);
            result = true;
            break;
          }
        }
      }
      return result;
    }

    // Promise-based API
    return service;
  }

})();
