(function () {
  'use strict';

  angular
    .module('iMusicApp')
    .service('playlistService', playlistService);

  playlistService.$inject = ['playlistConstant', 'songService', '$q', '$http'];

  function playlistService(playlistConstant, songService, $q, $http) {
    var service = {};

    service.cache = {
      view: {
        view: playlistConstant.VIEW.LIST,
        url: playlistConstant.TEMPLATE_URL.LIST
      },
      currentPlaylist: {
        name: "",
        songs: []
      },
      query: {},
      listSelected: [],
      songsOfPlaylist: [],
      playlistTemp: [],
      librarySongs: []
    };

    service.playlists = null;

    service.loadData = loadData;
    service.addPlaylist = addPlaylist;
    service.getSongsByPlaylistId = getSongsByPlaylistId;
    service.deletePlaylists = deletePlaylists;
    service.updateSongsOfPlaylist = updateSongsOfPlaylist;
    service.updatePlaylist = updatePlaylist;
    service.isExistedPlaylist = isExistedPlaylist;

    function loadData() {
      var defer = $q.defer();
      $http.get(playlistConstant.API.PATH)
        .then(function (response) {
          service.playlists = response.data;
          defer.resolve(service.playlists);
        })
        .catch(function (error) {
          defer.reject(error);
        });

      return defer.promise;
    }

    function addPlaylist(playlist) {
      var generator = new IDGenerator();
      playlist.id = generator.generate();
      while (checkExistedId(playlist.id)) {
        playlist.id = generator.generate();
      }
      service.playlists.push(playlist);
    }

    function IDGenerator() {
      this.length = 8; // 4 int + 8 random string
      this.timestamp = +new Date; // +new Date => Number
                                  // new Date => String
      this.generate = function() {
        var id = "";
        var ts = this.timestamp.toString();
        id = ts.substr(9,4);
        id += Math.random().toString(36).substr(2, this.length);
        return id;
      }
    }

    function checkExistedId(id) {
      for (var i = service.playlists.length - 1; i >= 0; i--) {
        if (service.playlists[i].id === id) {
          return true;
        }
      }
      return false;
    }

    function deletePlaylists(ids) {
      var result = false;
      for (var i = 0; i < ids.length; i++) {
        for (var j = 0; j < service.playlists.length; j++) {
          if (ids[i] === service.playlists[j].id) {
            service.playlists.splice(j, 1);
            result = true;
            break;
          }
        }
      }
      return result;
    }

    /**
     * @return an array song with check is true by playlist id
     * */
    function getSongsByPlaylistId(id) {
      for (var i = 0; i < service.playlists.length; i++) {
        if (service.playlists[i].id === id) {
          return (songService.getSongsForPlaylist(service.playlists[i].songs));
        }
      }
      return null;
    }

    /**
     * @return list songs id of playlist
     * */
    function updateSongsOfPlaylist(id, _songs) {
      for (var i = 0; i < service.playlists.length; i++) {
        if (service.playlists[i].id === id) {
          for (var j = 0; j < _songs.length; j++) {
            if (!_songs[j].check) {
              removeSong(service.playlists[i].songs, _songs[j].id);
            }
          }
          return service.playlists[i].songs;
        }
      }
      console.log("Cannot find this playlist: " + id);
      return null;
    }

    function removeSong(list, _id) {
      for (var i = list.length - 1; i >= 0; i--) {
        if (list[i] === _id) {
          list.splice(i, 1);
        }
      }
    }

    function updatePlaylist(newPlaylist, oldPlaylist) {
      var playlist = getPlaylistById(oldPlaylist.id);

      var arrayId = [];
      for (var i = newPlaylist.songs.length; i--;) {
        arrayId.push(newPlaylist.songs[i].id);
      }

      if (isExistedPlaylist(newPlaylist)) {
        playlist.name = oldPlaylist.name;
      } else {
        playlist.name = newPlaylist.name;
      }

      playlist.songs = arrayId;
      return playlist;
    }

    function isExistedPlaylist(playlistName, playlistNameTemp) {
      if (playlistName === playlistNameTemp) {
        return false;
      }
      for (var i = service.playlists.length; i--;) {
        if (service.playlists[i].name === playlistName) {
          return true;
        }
      }
      return false;
    }

    function getPlaylistById(id) {
      for (var i = service.playlists.length; i--;) {
        if (service.playlists[i].id === id) {
          return service.playlists[i];
        }
      }
      console.log("No playlist: " + id);
      return null;
    }

    return service;
  }
})();
