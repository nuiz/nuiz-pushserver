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


//status = wait_technician, wait_comfirm


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
            "status": this.status
        };
    };

    TaskEntity.create = function(name, description){
        var newEntity = new TaskEntity();

        newEntity._id = getAutoId();
        newEntity.name = name;
        newEntity.description = description;
        newEntity.status = "wait_technician";

        return newEntity;
    };

    TaskEntity.loadFromJson = function(json){
        var jsonObj = JSON.parse(json);

        var newEntity = new TaskEntity();
        newEntity._id = jsonObj._id;
        newEntity.name = jsonObj.name;
        newEntity.description = jsonObj.description;
        newEntity.status = jsonObj.status;

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

var io = require("socket.io")(server);

io.on("connection", function(socket){
    // emit update for init list
    socket.emit("update", TaskCollection.getAttr());

    socket.on("addTask", function(from, msg){
        var obj = JSON.stringify(msg);
        var task = TaskEntity.create(obj.name, obj.description);
        TaskCollection.add(task);

        io.emit("update", TaskCollection.getAttr());
    });
});