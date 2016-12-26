(function() {
  'use strict';

  angular
    .module('iMusicApp')
    .controller('SongCtrl', SongCtrl);

  SongCtrl.$inject = ['songService', 'songConstant', '$mdSidenav', 'commonService', '$timeout'];

  function SongCtrl(songService, songConstant, $mdSidenav, commonService, $timeout) {
    $mdSidenav('sidebar').close();
    var vm = this;
    vm.cache = songService.cache;
    vm.validate = songConstant.VALIDATE;
    // ov-breadcrumbs
    vm.breadcrumbs = [
      {
        i18nKey: 'common.song',
        href: '#/songs'
      }
    ];
    // ov-table
    // config
    vm.config = {
      columns: [
        {
          checkbox: true
        }, {
          i18nKey: 'common.name',
          key: 'name'
        }, {
          i18nKey: 'common.artist',
          key: 'artist' // if not enter key, bind by name.
        },
        {
          action: true
        }
      ],
      filter: vm.cache.query,
      checkOnRow: true
    };
    // output
    vm.retrieveOVTable = {
      listSelected: vm.cache.listSelected
    };

    vm.mappingFunc = {
      // display form add song
      getAddForm: getAddForm,
      // display form edit song
      getEditForm: getEditForm,
      // function create song
      createSong: createSong,
      // function update song
      editSong: editSong,
      // mapping to ov-table component, delete a song
      deleteRow: deleteSong,
      // delete multiple songs
      deleteMultiSongs: deleteMultiSongs
    };
    // song name field required
    vm.isDisableCreateButton = isDisableCreateButton;
    // check name field modify
    vm.isDisableApplyButton = isDisableApplyButton;
    // checkbox must be checked
    vm.isDisableDeleteButton = isDisableDeleteButton;
    // cancel button, load songs from service, refresh page
    vm.showAndRefreshList = showAndRefreshList;
    // show confirm dialog
    vm.showConfirm = commonService.showConfirm;
    // show toast
    vm.showToast = commonService.showToast;
    // init form field
    vm.initTextfield = initTextfield;
    // clear form field
    vm.clearTextfield = clearTextfield;
    // check view add
    vm.isFormAdd = isFormAdd;
    // check view edit
    vm.isFormEdit = isFormEdit;

    function activate() {
      if (!songService.getSongs()) {
        vm.spinner = true;
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
            }, 1024);
            // vm.spinner = false;
          });
      } else {
        vm.songs = songService.getSongs();
      }
      vm.myLink = vm.cache.view.url;
    }

    function getAddForm() {
      vm.cache.view = {
        view: songConstant.VIEW.ADD,
        url: songConstant.TEMPLATE_URL.ADD
      };
      vm.clearTextfield();
      vm.myLink = vm.cache.view.url;
    }

    function getEditForm(song) {
      vm.cache.view = {
        view: songConstant.VIEW.EDIT,
        url: songConstant.TEMPLATE_URL.EDIT
      };
      vm.initTextfield(song);
      vm.cache.songTemp = angular.copy(song);
      vm.myLink = vm.cache.view.url;
    }

    function createSong() {
      for (var i = 0; i < vm.songs.length; i++) {
        if (vm.cache.currentSong.name === vm.songs[i].name) {
          vm.showToast('song.notification.failed');
          return 0;
        }
      }
      songService.add(vm.cache.currentSong);
      vm.showToast('common.success');
      vm.showAndRefreshList();
    }

    function editSong() {
      if (vm.cache.currentSong.name) {
        songService.edit(vm.cache.currentSong);
        vm.showToast('common.success');
        vm.showAndRefreshList();
      } else {
        vm.showToast('song.view.songCantEmpty');
        return 0;
      }
    }

    function deleteSong() {
      vm.showConfirm(deleteMultiSongsCallback, 'song.confirm.delete_title', 'song.confirm.delete_content');
    }

    // delete song
    // function deleteSongCallback() {
    //   if (songService.deleteSong(vm.deletedSongId)) {
    //     vm.showToast('common.success');
    //   } else {
    //     vm.showToast('song.notification.deleted_failed');
    //   }
    //   vm.showAndRefreshList();
    // }

    function deleteMultiSongs() {
      vm.showConfirm(deleteMultiSongsCallback, 'song.confirm.delete_multi_title', 'song.confirm.delete_multi_content');
    }

    // delete songs
    function deleteMultiSongsCallback() {
      if (songService.deleteSongs(vm.retrieveOVTable.listSelected)) {
        vm.showToast('common.success');
      } else {
        vm.showToast('song.notification.deleted_failed');
      }
      vm.showAndRefreshList();
    }

    function isDisableCreateButton() {
      return (vm.cache.currentSong.name) ? false : true;
    }

    function isDisableApplyButton(song) {
      return angular.equals(vm.cache.currentSong, song) || !(vm.cache.currentSong.name);
    }

    function isDisableDeleteButton() {
      return !(vm.retrieveOVTable.listSelected.length > 0);
    }

    function showAndRefreshList() {
      vm.songs = songService.getSongs();
      vm.clearTextfield();
      vm.retrieveOVTable.listSelected.length = 0;
      vm.cache.view = {
        view: songConstant.VIEW.LIST,
        url: songConstant.TEMPLATE_URL.LIST
      };
      vm.myLink = vm.cache.view.url;
    }

    function initTextfield(song) {
      vm.cache.currentSong = angular.copy(song);
    }

    function clearTextfield() {
      vm.cache.currentSong = {};
    }

    function isFormAdd() {
      return vm.cache.view.view === songConstant.VIEW.ADD;
    }

    function isFormEdit() {
      return vm.cache.view.view === songConstant.VIEW.EDIT;
    }

    // load data
    activate();
  }

})();
