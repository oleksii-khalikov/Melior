(function () {
  'use strict';

  angular.module('Melior').service('DataService', ['$http', function ($http) {

    this.findAll = findAll;
    this.save = save;
    this.sortedObjectsArrayByField = sortedObjectsArrayByField;
    this.remove = remove;

    function save(obj){
      return $http.post('/api/save', obj).then(function (res) {
        return res.data;
      })
    }

    function findAll() {
      return $http.get('/api/find-all').then(function (res) {
        return res.data;
      });
    }

    function sortedObjectsArrayByField(array, config){
      var sFieldId = config['sByField'];
      var bAsc = config.bDescending[sFieldId];
      config.bDescending[sFieldId] = !config.bDescending[sFieldId];

      function compare(a, b) {
        if(a < b) return -1;
        if(a > b) return 1;
        return 0
      }

      return array.sort(function (first, second) {
        return bAsc ? compare(first[sFieldId], second[sFieldId]) : compare(second[sFieldId], first[sFieldId]);
      });
    }

    function remove(aArray) {
      var aRemoveList = [];
      aArray.filter(function (oItem) {
        return oItem.bRemove;
      }).forEach(function (oItem) {
        aRemoveList.push(oItem._id);
      });
      var params = {
        lds: angular.toJson({
          array: aRemoveList
        })
      };
      if(aRemoveList.length > 0){
        return $http.delete('/api/delete-by-list', {params: params}).then(function (res) {
          return aArray.filter(function (oItem) {
            return !oItem.bRemove;
          })
        })
      }

    }

  }])
})();