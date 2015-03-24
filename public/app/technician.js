/**
 * Created by NUIZ on 24/3/2558.
 */

"use strict";

var app = angular.module("technician-app", []);
app.controller('TaskController', ['$scope', function($scope){
    $scope.tasks = [];
    $scope.isLogin = false;

    var socket = io.connect();
    socket.on('update', function (data) {
        if(typeof data == "string"){
            data = JSON.parse(data);
        }
        $scope.tasks = data;
        $scope.$apply();
    });

    $scope.login = function(){
        var name = $scope.loginForm.name.trim();
        if(name == ""){
            return;
        }
        $scope.isLogin = true;
        $scope.name = name;
    };

    $scope.takeTask = function(task){
        if(task.status != "wait_technician"){
            alert("Can't take this job.");
            return;
        }

        if(!window.confirm("Do you want to take this job?")){
            return;
        }

        socket.emit("takeTask", {
            taskId: task._id,
            technician: {
                name: $scope.name
            }
        });
    };
}]);