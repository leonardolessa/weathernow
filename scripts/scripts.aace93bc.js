"use strict";angular.module("weatherApp",["ngResource","ngRoute","localytics.directives"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).otherwise({redirectTo:"/"})}]),angular.module("weatherApp").controller("MainCtrl",["Weather",function(a){function b(a){for(var b=a?a:g.currentState,c=g.states.length,d=0;c>d;d++)if(g.states[d].initials===b)return g.activeState=g.states[d]}function c(){a.states().then(function(a){var c=a.data;g.states=c.states,b(g.currentState.initials),d()})}function d(b){a.info(g.currentState,g.currentCity).then(function(a){g.forecast=a,e(a),f(a)},function(a){console.log(a)})}function e(a){g.min=a.previsoes.reduce(function(a,b){return a.temperatura_min<b.temperatura_min?a:b}),g.max=a.previsoes.reduce(function(a,b){return a.temperatura_max>b.temperatura_max?a:b})}function f(a){}var g=this;g.setState=b,g.getInfo=d,g.currentCity="Blumenau",g.currentState="SC",c()}]),angular.module("weatherApp").factory("Weather",["$http","$q",function(a,b){function c(c,d){var f=b.defer();return a.get(e+d+"-"+c).then(function(a){a.data.hasOwnProperty("erro")?f.reject(a.data.erro):f.resolve(a.data)},function(){f.reject("Houve algum problema com a conexão.")}),f.promise}function d(){return a.get(f+"states-cities.json")}var e="//developers.agenciaideias.com.br/tempo/json/",f="data/",g={info:c,states:d};return g}]),angular.module("weatherApp").directive("loading",["$http",function(a){return{restrict:"A",link:function(b,c,d){b.isLoading=function(){return a.pendingRequests.length>0},b.$watch(b.isLoading,function(a){a?c.show():c.hide()})}}}]),angular.module("weatherApp").run(["$templateCache",function(a){a.put("views/main.html",'<section class="content-header"> <h1>Previsão do tempo</h1> </section> <section class="content content-all"> <div class="overlay-all" data-loading> <i class="glyphicon glyphicon-refresh glyphicon-spin"></i> </div> <div class="box box-default"> <div class="box-header with-border"> <h3 class="box-title">Opções</h3> </div> <div class="box-body"> <div class="row"> <div class="col-md-6"> <select chosen ng-model="main.currentState" ng-options="state.initials as state.name for state in main.states" ng-change="main.setState(main.currentState)"> <option value="">Selecione o seu estado</option> </select> {{main.currentState}} <select chosen ng-model="main.currentCity" ng-options="city as city for city in main.activeState.cities track by city"> <option value="">Selecione a sua cidade</option> </select> <input type="checkbox" id=""> Lembrar <button class="btn btn-primary pull-right" ng-disabled="!main.currentState || !main.currentCity" ng-click="main.getInfo()">Enviar</button> </div> </div> </div><!-- /.box-body --> </div> <div class="row"> <div class="col-xs-12" ng-show="main.forecast"> <h1 class="h2">Tempo para: {{ main.forecast.cidade }}</h1> <div class="row-no-padding box-weather-wrapper"> <div class="box-weather col-xs-12 col-sm-4"> <div class="box box-success"> <div class="box-header with-border"> <h3 class="box-title">{{main.forecast.agora.descricao}}</h3> <p class="box-date">Hoje</p> </div> <div class="box-body"> <img ng-src="{{main.forecast.agora.imagem}}" class="center-block" alt=""> <h2 class="temp-now">{{main.forecast.agora.temperatura}} ºC</h2> <div class="max-and-min"> <span class="max-temp"> <i class="glyphicon glyphicon-arrow-up text-red"></i> {{main.forecast.previsoes[0].temperatura_max}} ºC </span> <span class="min-temp"> <i class="glyphicon glyphicon-arrow-down text-light-blue"></i> {{main.forecast.previsoes[0].temperatura_min}} ºC </span> </div> </div> </div> </div> <div class="box-weather col-xs-6 col-sm-4 col-md-2" ng-repeat="ft in main.forecast.previsoes" ng-if="!$first"> <div class="box"> <div class="box-header with-border"> <h3 class="box-title">{{ft.descricao}}</h3> <p class="box-date">{{ft.data}}</p> </div> <div class="box-body"> <img ng-src="{{ft.imagem}}" class="center" alt=""> <span class="max-temp"> <i class="glyphicon glyphicon-arrow-up text-red"></i> {{ft.temperatura_max}} ºC </span> <span class="min-temp"> <i class="glyphicon glyphicon-arrow-down text-light-blue"></i> {{ft.temperatura_min}} ºC </span> </div> </div> </div> </div> </div> </div> {{main.max}} <div class="row" ng-show="main.max && main.min"> <div class="col-xs-12 col-md-4"> <div class="box"> <div class="box-header with-border"> <h3 class="box-title">Mínima e Máxima</h3> <p>Em {{main.forecast.cidade}}</p> </div> <div class="box-body"> <div class="row"> <div class="col-xs-6 text-center"> <p>{{main.min.data}}</p> <img ng-src="{{main.min.imagem}}" alt=""> <span class="min-temp"> <i class="glyphicon glyphicon-arrow-down text-light-blue"></i> {{main.min.temperatura_min}} ºC </span> </div> <div class="col-xs-6 text-center"> <p>{{main.max.data}}</p> <img ng-src="{{main.max.imagem}}" alt=""> <span class="max-temp"> <i class="glyphicon glyphicon-arrow-up text-red"></i> {{main.max.temperatura_max}} ºC </span> </div> </div> </div> </div> </div> </div> </section>')}]);