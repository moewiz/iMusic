/**
 * Created by ndkhoa1 on 9/22/2016.
 */
(function () {
  'use strict';

  angular
    .module('iComponent')
    .controller('OvTableController', OvTableController);

  OvTableController.$inject = [];

  function OvTableController() {
    var vm = this;
    vm.config.checkOnRow = vm.config.checkOnRow || false;
    // if provide a function for mappingFunc.getEditForm, show Edit button
    // Edit button use i18n key: 'component.ovTable.editButton'
    vm.isActiveEditBtn = angular.isFunction(vm.mappingFunc.getEditForm);
    // if provide a function for mappingFunc.deleteRow, show Delete button
    // Delete button use i18n key: 'component.ovTable.deleteButton'
    vm.isActiveDeleteBtn = angular.isFunction(vm.mappingFunc.deleteRow);
    // delete a row
    vm.deleteRow = deleteRow;
    // get edit form based on a clicked row
    vm.getEditForm = getEditForm;

    vm.sort = {
      // check sort button that active or not to show Sort button
      checkActiveSortBtn: checkActiveSortBtn,
      // when click column name, active sort for this column
      activeSortBtn: activeSortBtn,
      // reverse sort button, if that reversed, hide sort button
      toggleSortBtn: toggleSortBtn
    };

    vm.checkboxFunc = {
      // toggle checkbox
      toggleCheckbox: toggleCheckbox,
      // check checkbox is check or uncheck
      existsCheckbox: existsCheckbox,
      // -
      isIndeterminate: isIndeterminate,
      // check all checkbox is check or uncheck
      isCheckedAll: isCheckedAll,
      // toggle checkbox-all button
      toggleCheckboxAll: toggleCheckboxAll,
      // only this row is check
      selectOneRow: selectOneRow
    };

    function checkActiveSortBtn(key) {
      return key === vm.orderBy;
    }

    function activeSortBtn(key) {
      if (vm.sort.checkActiveSortBtn(key) && !vm.reverse) {
        vm.orderBy = null;
        return;
      }
      if (typeof key !== 'undefined' || key != null) {
        vm.orderBy = key;
      }
    }

    function toggleSortBtn(key) {
      if (typeof key !== 'undefined' || key != null) {
        vm.reverse = (vm.sort.checkActiveSortBtn(key)) ? !vm.reverse : false;
      }
    }

    function toggleCheckbox(row, event) {
      var idx = vm.output.listSelected.indexOf(row.id);
      if (idx > -1) {
        vm.output.listSelected.splice(idx, 1);
      } else {
        vm.output.listSelected.push(row.id);
      }
      // stop the bubbling
      // cross-brower event
      event = event || window.event;
      event.stopPropagation();
    }

    function existsCheckbox(row) {
      return vm.output.listSelected.indexOf(row.id) > -1;
    }

    function isIndeterminate() {
      return (vm.output.listSelected.length !== 0 &&
      vm.output.listSelected.length !== vm.data.length);
    }

    function isCheckedAll() {
      return (vm.output.listSelected.length === vm.data.length) && vm.data.length !== 0;
    }

    function toggleCheckboxAll() {
      if (vm.output.listSelected.length === vm.data.length) {
        vm.output.listSelected.length = 0;
      } else if (vm.output.listSelected.length === 0 || vm.output.listSelected.length > 0) {
        vm.output.listSelected.length = 0;
        for (var i = 0; i < vm.data.length; i++) {
          vm.output.listSelected.push(vm.data[i].id);
        }
      }
    }

    function selectOneRow(row) {
      vm.output.listSelected.length = 0;
      vm.output.listSelected.push(row.id);
    }

    function getEditForm(row, event) {
      selectOneRow(row);
      vm.mappingFunc.getEditForm(row);
      event.stopPropagation();
    }

    function deleteRow(row, event) {
      selectOneRow(row);
      vm.mappingFunc.deleteRow();
      event.stopPropagation();
    }
  }
})();
