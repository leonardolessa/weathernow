'use strict';

/**
 * @ngdoc service
 * @name weatherApp.Weather
 * @description
 * # Weather
 * Factory in the weatherApp.
 */
angular.module('weatherApp')
  .factory('Weather', function ($http, $q) {
    var extPath = '//developers.agenciaideias.com.br/tempo/json/';
    var localPath = 'data/';
    var service = {
      info: info,
      states: states
    };

    function info(state, city) {
      var deferred = $q.defer();

      $http.get(extPath + city + '-' + state).then(function(response) {
        if (response.data.hasOwnProperty('erro')) {
          deferred.reject(response.data.erro);
        } else {
          deferred.resolve(response.data);
        }
      }, function() {
        deferred.reject('Houve algum problema com a conexão.');
      });

      return deferred.promise;
    }


    function states() {
      return $http.get(localPath + 'states-cities.json');
    }

    return service;
  });
