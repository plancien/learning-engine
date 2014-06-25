define([], function(){
    "use strict";
    
    function createImageChooser(data) {
        var display = "";
        for(var i=data.length-1; i>=0; i--){
            display += '<option value="' + data[i].url + '" data-img-src="' + data[i].url + '">' + data[i].name + '</option>';
        }

        $(".bonusImg").html(display).imagepicker();
        $(".malusImg").html(display).imagepicker();
    }

    function injectCSS(url) {
        $("head").append("<link rel='stylesheet' type='text/css' href='" + url+ "'>");
    }

    //TODO: Refactor
    function replaceOptionTemplate(html) {
        $(".modelParams").empty();
        $(".modelParams").append(html);
    }


    function createGameSelection(infos) {
        console.log(infos)
        var $gamelist = $(".modelList");
        $gamelist.empty();
        for (var i = 0; i < infos.length; i++) {(function(i) {
            console.log($gamelist)
            var $game = $('<option value="'+infos[i].name+'">'+infos[i].name+'</option>');
            $gamelist.change(function() {
                if ($gamelist.val()===infos[i].name) {
                    showGameInfo(infos[i])
                }
            });
            $gamelist.append($game);
        })(i)}
        $gamelist.change();
    }

    function showGameInfo(game) {
        $(".modelDescription").html(game.gameDescription);
    }

    function createSessionsButtons(sessions) {
        var display = "";
        $.each(sessions,function(name,value) {
            display += '<li><a href="/?info=' + name + '" >' + value.game + ' : '+ value.question +'</a></li>';
        });
        $("#gameSessions ul").html(display);
    }

    function showEducatorMenu(game) {
        $("#educatorView h2").text(game.name+" : "+game.game);
        $("#educatorView h3").text(game.question);
        $("#educatorView a").attr("href","/?session="+game.name);
        var $players = $("#educatorView ul.players")
        var that = this;
        $.each(game.players,function(i,name) {
            var $li = $("<li>"+name+"</li>");
            $players.append($li);
            if (that) {
                that.on("update score", function(scorerName,score) {
                    if (name===scorerName) {
                        $li.text(name+" : "+score+"pts.");
                    }
                });
            }
        });
        $("#educatorView button.delete").on("click",function() {
            console.log("ok")
            that.emit("delete session",game.name);
        });

        var $images = $("#educatorView div.images");
        console.log(game.bonus,$images);
        for (var i = game.bonus.length - 1; i >= 0; i--) {
            console.log($img,"fff");
            var $img = $("<img src='"+game.bonus[i]+"' class='selected-image good-image'>");
            console.log($img);
            $images.append($img)

        };
        for (var i = game.malus.length - 1; i >= 0; i--) {
            $images.append("<img src='"+game.malus[i]+"' class='selected-image wrong-image'>")
        };
    }

    return {
        createImageChooser: createImageChooser,
        injectCSS: injectCSS,
        createGameSelection: createGameSelection,
        createSessionsButtons: createSessionsButtons,
        showEducatorMenu: showEducatorMenu
    }
});
