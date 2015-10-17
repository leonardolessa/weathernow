'use strict';

/**
 * @ngdoc service
 * @name weatherApp.Weather
 * @description
 * # Weather
 * Factory in the weatherApp.
 */
angular.module('weatherApp')
  .factory('Weather', function ($http) {
    var extPath = '//developers.agenciaideias.com.br/tempo/json/';
    var localPath = 'data/';

    // Public API here
    return {
      info: function (state, city) {
        return $http.get(extPath + city + '-' + state);
      },

      states: function() {
        return $http.get(localPath + 'states-cities.json');
      }
    };
  });
