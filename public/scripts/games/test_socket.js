/*

@name 
    [TEST] Chat
@endName

@description
    Testing game for the socket - eventbus.
@endDescription

*/

define([
    'event_bus',
    "connector",
], function(eventBus,socket) {

    

    eventBus.on('init', function(_container) {
        var container = _container;
        var div =  document.createElement("div");
        var form = document.createElement("form");
        var input = document.createElement("input");
        var submit = document.createElement("input");
        form.appendChild(input);
        form.appendChild(submit);
        submit.type = "submit";
        form.addEventListener("submit",function(e) {
            e.preventDefault();
            console.log(localStorage.userName,input.value);
            socket.publish("chat - new message",localStorage.userName,input.value)
        });
        container.append($(form));
        container.append($(div));

        socket.on("chat - new message",function(sender, text) {
            var p = document.createElement("p");
            var s = document.createElement("span");
            var n = document.createElement("em");
            n.textContent = sender+" : ";
            
            s.textContent=text;
            p.appendChild(n);
            p.appendChild(s);
            container.append($(p));
            console.log(sender,text);
        });
    });

    

    return true;
});
