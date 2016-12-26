(function() {
  'use strict';

  angular
    .module('iMusicApp')
    .controller('PlaylistCtrl', PlaylistCtrl);

  PlaylistCtrl.$inject = ['$scope', 'playlistConstant','$mdSidenav', 'songService', 'playlistService', 'commonService', '$mdDialog', '$timeout'];

  function PlaylistCtrl($scope, playlistConstant, $mdSidenav, songService, playlistService, commonService, $mdDialog, $timeout) {
    $mdSidenav('sidebar').close();
    var vm = this;
    vm.cache = playlistService.cache;
    vm.validate = playlistConstant.VALIDATE;
    // breadcrumbs
    vm.breadcrumbs = [
      {
        i18nKey: 'common.playlist',
        href: '#/playlists'
      }
    ];
    // ov-table
    // config
    vm.configPlaylist = {
      columns: [
        {
          checkbox: true
        }, {
          i18nKey: 'common.name',
          key: 'name'
        }, {
          action: true
        }
      ],
      filter: vm.cache.query,
      checkOnRow: false
    };
    // my-list
    // config
    vm.configSong = {
      updateRows: updateSongsOfPlaylist,
      hideList: hideDetails,
      header1: 'name',
      header2: 'artist',
      width: "70"
    };
    // output
    vm.retrieveOVTable = {
      listSelected: vm.cache.listSelected
    };
    // clear form field
    vm.clearTextfield = clearTextfield;
    // cancel button, refresh page
    vm.showAndRefreshList = showAndRefreshList;
    // check view add
    vm.isFormAdd = isFormAdd;
    // check view edit
    vm.isFormEdit = isFormEdit;
    // get template showToast
    vm.showToast = commonService.showToast;
    // get template showConfirm
    vm.showConfirm = commonService.showConfirm;
    // pass validate is show, otherwise, hide Create button
    vm.isDisableCreateButton = isDisableCreateButton;
    // pass validate is show, otherwise, hide Apply button
    vm.isDisableApplyButton = isDisableApplyButton;
    // need at least 1 row selected to show Delete button
    vm.isDisableDeleteButton = isDisableDeleteButton;
    /**
     *  @return songs for playlist by array contain song's id
     */
    vm.getSongsForPlaylist = getSongsForPlaylist;
    // create custom dialog template - show list of songs on library
    vm.showCustomDialog = showCustomDialog;

    vm.mappingFunc = {
      // display form add playlist
      getAddPlaylistForm: getAddPlaylistForm,
      // display form edit playlist
      getEditForm: getEditForm,
      // function create playlist
      createPlaylist: createPlaylist,
      // function update playlist
      updatePlaylist: updatePlaylist,
      // mapping to ov-table component, delete a song
      deleteRow: deletePlaylist,
      // delete multiple playlists
      deleteMultiPlaylists: deleteMultiPlaylists,
      // Form Edit Playlist: move all songs from library to current playlist
      addAllSongs: addAllSongs,
      // Form Edit Playlist: move all songs from current playlist to library
      removeAllSongs: removeAllSongs,
      // Form Edit Playlist: move a song from library to current playlist
      addSong: addSong,
      // Form Edit Playlist: move a song from current playlist to library
      removeSong: removeSong,
      // show my-list component
      showDetails: showDetails,
      // hide my-list component
      hideDetails: hideDetails
    };

    // initialize data, view, ...
    function active() {
      vm.songsOfPlaylist = [];
      if (!playlistService.playlists && !songService.songs) {
        vm.spinner = true;
        playlistService.loadData()
          .then(function (data) {
            vm.playlists = data;
          })
          .catch(function (error) {
            vm.playlists = [];
            console.log(error);
          });

        songService.loadData()
          .then(function (data) {
            vm.songs = data;
          })
          .catch(function (error) {
            vm.songs = [];
            console.log(error);
          })
          .finally(function () {
            $timeout(function() {
              vm.spinner = false;
            }, 1500);
          });
      } else if (!playlistService.playlists) {
        vm.songs = songService.songs;
        vm.spinner = true;
        playlistService.loadData()
          .then(function (data) {
            vm.playlists = data;
          })
          .catch(function (error) {
            vm.playlists = [];
            console.log(error);
          })
          .finally(function () {
            $timeout(function() {
              vm.spinner = false;
            }, 1500);
          });
      } else {
        vm.playlists = playlistService.playlists;
        vm.songs = songService.songs;
      }

      vm.myLink = vm.cache.view.url;
    }

    function showDetails() {
      vm.showDetails = (vm.retrieveOVTable.listSelected.length === 1) ? true : false;
    }

    function hideDetails() {
      vm.showDetails = false;
    }

    function getAddPlaylistForm() {
      vm.cache.view = {
        view: playlistConstant.VIEW.ADD_PLAYLIST,
        url: playlistConstant.TEMPLATE_URL.ADD_PLAYLIST
      };
      vm.clearTextfield();
      vm.myLink = vm.cache.view.url;
    }

    function createPlaylist(event) {
      if (vm.cache.currentPlaylist.name === null) {
        vm.showToast('playlist.notification.playlistCantEmpty');
        return 0;
      }
      for (var i = 0; i < vm.playlists.length; i++) {
        if (vm.cache.currentPlaylist.name === vm.playlists[i].name) {
          vm.showToast('playlist.notification.playlistExisted');
          return 0;
        }
      }
      //custom dialog list of songs
      vm.showCustomDialog(event, vm.songs, addSongToPlaylistCallback);
    }

    function addSongToPlaylistCallback(songs) {
      vm.cache.currentPlaylist.songs = [];
      if(typeof songs !== 'undefined' || songs != null) {
        for (var i = 0; i < songs.length; i++) {
          if (songs[i].check) {
            vm.cache.currentPlaylist.songs.push(songs[i].id);
          }
        }
      }
      playlistService.addPlaylist(vm.cache.currentPlaylist);
      vm.showToast('common.success');
      vm.showAndRefreshList();
    }

    // sync songs of playlist
    function updateSongsOfPlaylist(songs) {
      var arrayId;
      var playlistId = vm.retrieveOVTable.listSelected[0];
      arrayId = playlistService.updateSongsOfPlaylist(playlistId, songs);
      vm.songsOfPlaylist = angular.copy(vm.getSongsForPlaylist(arrayId));
    }

    function getEditForm(row) {
      vm.cache.view = {
        view: playlistConstant.VIEW.EDIT,
        url: playlistConstant.TEMPLATE_URL.EDIT
      };
      vm.cache.currentPlaylist = angular.copy(row);
      vm.cache.currentPlaylist.songs = vm.getSongsForPlaylist(vm.cache.currentPlaylist.songs);
      vm.cache.playlistTemp = angular.copy(vm.cache.currentPlaylist);
      vm.cache.librarySongs = myFilterSongs(vm.songs, vm.cache.currentPlaylist.songs);
      vm.myLink = vm.cache.view.url;
    }

    function myFilterSongs(_listSource, _listFilter) {
      var result = angular.copy(_listSource);

      for (var i = _listSource.length; i--;) {
        for (var j = _listFilter.length; j--;) {
          if (_listSource[i].id === _listFilter[j].id) {
            result.splice(i, 1);
          }
        }
      }

      return angular.copy(result);
    }

    function updatePlaylist() {
      if (playlistService.isExistedPlaylist(vm.cache.currentPlaylist.name, vm.cache.playlistTemp.name)) {
        vm.showToast('playlist.notification.playlistExisted');
        return 0;
      } else {
        if (playlistService.updatePlaylist(vm.cache.currentPlaylist, vm.cache.playlistTemp)) {
          vm.showToast('common.success');
          vm.showAndRefreshList();
        } else {
          vm.showToast('playlist.notification.failed');
          return 0;
        }
      }
    }

    function deletePlaylist() {
      vm.showConfirm(deletePlaylistCallback, 'playlist.confirm.deleteTitle', 'playlist.confirm.deleteContent');
    }

    function deleteMultiPlaylists() {
      vm.showConfirm(deletePlaylistCallback, 'playlist.confirm.deleteMultiTitle', 'playlist.confirm.deleteMultiContent');
    }

    function deletePlaylistCallback() {
      if (playlistService.deletePlaylists(vm.retrieveOVTable.listSelected)) {
        vm.showToast('common.success');
      } else {
        vm.showToast('playlist.notification.failed');
      }
      vm.showAndRefreshList();
    }

    function addAllSongs() {
      vm.cache.currentPlaylist.songs = angular.copy(vm.songs);
      vm.cache.librarySongs = [];
    }

    function removeAllSongs() {
      vm.cache.librarySongs = angular.copy(vm.songs);
      vm.cache.currentPlaylist.songs = [];
    }

    function addSong(song) {
      if (isExistedSong(vm.cache.currentPlaylist.songs, song)) {
        vm.showToast('playlist.notification.songExisted');
        return 0;
      } else {
        vm.cache.currentPlaylist.songs.push(song);
        // remove song in library songs view
        removeSongFromPlaylist(vm.cache.librarySongs, song);
        return 1;
      }
    }

    function removeSong(song) {
      removeSongFromPlaylist(vm.cache.currentPlaylist.songs, song);
      vm.cache.librarySongs.push(song);
    }

    function removeSongFromPlaylist(list, song) {
      for (var i = list.length; i--;) {
        if (list[i].name === song.name) {
          list.splice(i, 1);
          break;
        }
      }
    }

    function isExistedSong(list, song) {
      if (list.length === 0) {
        return false;
      }

      for (var i = list.length; i--;) {
        if (list[i].id === song.id) {
          return true;
        }
      }

      return false;
    }

    function showAndRefreshList() {
      vm.playlists = playlistService.playlists;
      vm.clearTextfield();
      vm.retrieveOVTable.listSelected.length = 0;
      vm.cache.view = {
        view: playlistConstant.VIEW.LIST,
        url: playlistConstant.TEMPLATE_URL.LIST
      };
      vm.myLink = vm.cache.view.url;
    }

    function isFormAdd() {
      return vm.cache.view.view === playlistConstant.VIEW.ADD_PLAYLIST;
    }

    function isFormEdit() {
      return vm.cache.view.view === playlistConstant.VIEW.EDIT;
    }

    function clearTextfield() {
      vm.cache.currentPlaylist = {};
    }

    function isDisableCreateButton() {
      return vm.cache.currentPlaylist.name ? false: true;
    }

    function isDisableApplyButton(playlist) {
      return !vm.cache.currentPlaylist.name || angular.equals(vm.cache.currentPlaylist, playlist);
    }

    function isDisableDeleteButton() {
      return !(vm.retrieveOVTable.listSelected.length > 0);
    }

    function getSongsForPlaylist(ids) {
      return songService.getSongsForPlaylist(ids);
    }

    function showCustomDialog(event, songs, callback) {
      var dialog = {
        controller: DialogController,
        templateUrl: playlistConstant.TEMPLATE_URL.DIALOG_SONGS,
        parent: angular.element(document.body),
        //targetEvent: event, // show dialog from targetEvent to center screen
        locals: {
          items: songs
        },
        fullscreen: true // Only for -xs, -sm breakpoints.
      };

      $mdDialog.show(dialog)
        .then(function(answer) {
          callback(answer);
        });
    }

    function DialogController($scope, $mdDialog, items) {
      $scope.songs = [];

      angular.forEach(items, function(value, key) {
        items[key].check = false;
        $scope.songs.push(value);
      });

      $scope.skip = function() {
        $mdDialog.hide();
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }

    // show list songs of playlist
    $scope.$watchCollection('vm.retrieveOVTable.listSelected', function(newVal, oldVal) {
      if (newVal.length === 1) {
        vm.songsOfPlaylist = angular.copy(playlistService.getSongsByPlaylistId(newVal[0]));
        vm.showDetails = true;
      } else {
        vm.songsOfPlaylist.length = 0;
        vm.showDetails = false;
      }
    });

    // initialize data, view,...
    active();
  }
})();
