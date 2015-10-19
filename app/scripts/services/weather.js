'use strict';

/**
 * @ngdoc service
 * @name weatherApp.Weather
 * @description
 * # Weather
 * Factory in the weatherApp.
 */
angular.module('weatherApp')
  .factory('Weather', function ($http, $q, localStorageService) {
    var extPath = '//developers.agenciaideias.com.br/tempo/json/';
    var localPath = 'data/';
    var defaultCity = localStorageService.get('city') || 'Blumenau';
    var defaultState = localStorageService.get('state') || 'SC';
    var beachAverage = 25;
    var service = {
      forecast: forecast,
      states: states,
      minMax: minMax,
      weekend: weekend,
      chart: chart,
      defaultOptions: defaultOptions,
      toggle: toggle,
      checkData: checkData
    };
    var result;

    function defaultOptions() {
      return {
        city: defaultCity,
        state: defaultState,
        remember: localStorageService.length() > 0
      };
    }

    function getExternal(state, city) {
      var deferred = $q.defer();

      $http.get(extPath + city + '-' + state).then(function(response) {
        if (response.data.hasOwnProperty('erro')) {
          deferred.reject(response.data.erro);
        } else {
          result = response.data;
          deferred.resolve(result);
        }
      }, function() {
        deferred.reject('Houve algum problema com a conexão.');
      });

      return deferred.promise;
    }

    function getInternal() {
        var deferred = $q.defer();
        deferred.resolve(localStorageService.get('resultData'));
        return deferred.promise;
    }

    function forecast(state, city) {
      if (localStorageService.get('city') == city) {
        return getInternal();
      }
      return getExternal(state, city);
    }


    function states() {
      return $http.get(localPath + 'states-cities.json');
    }

    function minMax(data) {
      var temp = {};

      temp.min = data.reduce(function(prev, curr) {
        return prev.temperatura_min <= curr.temperatura_min ? prev : curr;
      });

      temp.max = data.reduce(function(prev, curr) {
        return prev.temperatura_max >= curr.temperatura_max ? prev : curr;
      });

      return temp;
    }

    function weekend(data) {
      var pattern = /^(Domingo|Sábado|Sexta)/;
      var sum = 0;
      var weekend = data.filter(function(el) {
        return pattern.test(el.data);
      });
      var len = weekend.length;

      if (len < 1) {
        return;
      }

      for (var i = 0; i < len; i++) {
        sum += weekend[i].temperatura_max;
      }

      return {
        is: sum / len > beachAverage,
        value: sum / len
      };
    }

    function chart(data) {
      return data.map(function(el) {
        var m = el.data.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        var date = (m) ? new Date(m[3], m[2]-1, m[1]) : null;
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        //morris receives YYYY-MM-DD

        return {
          data: year + '-' + month + '-' + day,
          min: parseInt(el.temperatura_min),
          max: parseInt(el.temperatura_max)
        };
      });
    }

    function toggle(location, checked) {
      if (checked) {
        localStorageService.set('resultData', result);
        localStorageService.set('city', location.city);
        localStorageService.set('state', location.state);
      } else {
        localStorageService.remove('resultData', 'city', 'state');
      }
    }

    function checkData(location) {
      return location.city == localStorageService.get('city');
    }

    return service;
  });
