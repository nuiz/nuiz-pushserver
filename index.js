/**
 * Created by NUIZ on 24/3/2558.
 */

"use strict";

var http = require("http");
var express = require("express");
var app = express();
var port = process.env.PORT || 5000;

app.use(express.static(__dirname + "/public/"));

var server = http.createServer(app);
server.listen(port);

console.log("http server listening on %d", port);

//var wss = new WebSocketServer({server: server});
//console.log("websocket server created");
//
//wss.on("connection", function(ws) {
//    var id = setInterval(function() {
//        ws.send(JSON.stringify(new Date()), function() {  });
//    }, 1000);
//
//    console.log("websocket connection open");
//
//    ws.on("close", function() {
//        console.log("websocket connection close");
//        clearInterval(id);
//    });
//});


//status = wait_technician, take


//var Client = (function(){
//    var autoId = 0;
//
//    function getAutoId(){
//        autoId++;
//        return autoId;
//    }
//
//    function TaskEntity(name, description){
//        this._id = getAutoId();
//        this.name = name;
//        this.description = description;
//        this.status = "wait_technician";
//    }
//
//    return TaskEntity;
//})();
//
//var ClientCollection = (function(){
//    var autoId = 0;
//
//    function getAutoId(){
//        autoId++;
//        return autoId;
//    }
//
//    function TaskEntity(name, description){
//        this._id = getAutoId();
//        this.name = name;
//        this.description = description;
//        this.status = "wait_technician";
//    }
//
//    return TaskEntity;
//})();

var TaskEntity = (function(){
    var autoId = 0;

    function getAutoId(){
        autoId++;
        return autoId;
    }

    function TaskEntity(){}

    TaskEntity.prototype.getAttr = function(){
        return {
            "_id": this._id,
            "name": this.name,
            "description": this.description,
            "status": this.status,
            "technician": this.technician
        };
    };

    TaskEntity.create = function(name, description){
        var newEntity = new TaskEntity();

        newEntity._id = getAutoId();
        newEntity.name = name;
        newEntity.description = description;
        newEntity.status = "wait_technician";
        newEntity.technician = null;

        return newEntity;
    };

    TaskEntity.loadFromJson = function(json){
        var jsonObj = JSON.parse(json);

        var newEntity = new TaskEntity();
        newEntity._id = jsonObj._id;
        newEntity.name = jsonObj.name;
        newEntity.description = jsonObj.description;
        newEntity.status = jsonObj.status;
        newEntity.technician = json.technician? json.technician: null;

        return newEntity;
    };
    return TaskEntity;
})();

var TaskCollection = (function(){
    function TaskCollection(){}

    var arr = [];

    TaskCollection.prototype.add = function(taskEntity){
        arr.push(taskEntity);
    };

    TaskCollection.prototype.find = function(_id){
        for(var i =0; i<arr.length; i++){
            if(arr[i]._id == _id)
                return arr[i];
        }
        return null;
    };

    TaskCollection.prototype.replace = function(_id, task){
        for(var i =0; i<arr.length; i++){
            if(arr[i]._id == _id){
                arr[i] = task;
                break;
            }
        }
    };

    TaskCollection.prototype.remove = function(_id){
        for(var i =0; i<arr.length; i++){
            if(arr[i]._id == _id)
                arr.splice(i, 1);
        }
        return null;
    };

    TaskCollection.prototype.getAttr = function(){
        var arrReturn = [];
        for(var i =0; i<arr.length;i++){
            arrReturn.push(arr[i].getAttr());
        }

        return arrReturn;
    };

    return new TaskCollection();
})();

// generate 5 task for test
TaskCollection.add(TaskEntity.create("test 1", "des 1"));
TaskCollection.add(TaskEntity.create("test 2", "des 2"));
TaskCollection.add(TaskEntity.create("test 3", "des 3"));
TaskCollection.add(TaskEntity.create("test 4", "des 4"));
TaskCollection.add(TaskEntity.create("test 5", "des 5"));

var io = require("socket.io")(server);

io.on("connection", function(socket){
    console.log("user connect", TaskCollection.getAttr());
    // emit update for init list
    socket.emit("update", TaskCollection.getAttr());

    socket.on("addTask", function(obj){
        var task = TaskEntity.create(obj.name, obj.description);
        TaskCollection.add(task);

        io.emit("update", TaskCollection.getAttr());
    });

    socket.on("removeTask", function(obj){
        TaskCollection.remove(obj._id);
        io.emit("update", TaskCollection.getAttr());
    });

    socket.on("takeTask", function(obj){
        var task = TaskCollection.find(obj.taskId);
        task.technician = {"name": obj.technician.name};
        task.status = "take";

        io.emit("update", TaskCollection.getAttr());
    });
});