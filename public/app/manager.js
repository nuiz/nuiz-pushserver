/**
 * Created by NUIZ on 24/3/2558.
 */

"use strict";

var app = angular.module("manager-app", []);
app.controller('TaskController', ['$scope', function($scope){
    $scope.tasks = [];

    var socket = io.connect();
    socket.on('update', function (data) {
        if(typeof data == "string"){
            data = JSON.parse(data);
        }
        $scope.tasks = data;
        $scope.$apply();
    });

    $scope.addTask = function(){
        socket.emit("addTask", $scope.addTaskForm);

        $scope.addTaskForm.name = "";
        $scope.addTaskForm.description = "";
    };

    $scope.removeTask = function(task){
        if(!window.confirm("Do you want remove this task?")){
            return;
        }

        socket.emit("removeTask", task);
    };
}]);