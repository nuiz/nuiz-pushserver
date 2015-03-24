/**
 * Created by NUIZ on 24/3/2558.
 */

"use strict";

var app = angular.module("manager-app", []);
app.controller('TaskController', ['$scope', function($scope){
    $scope.tasks = [];

    var socket = io.connect();
    socket.on('update', function (msg) {
        if(typeof  msg == "string"){
            $scope.tasks = JSON.parse(msg);
            $scope.$apply();
        }
    });
}]);