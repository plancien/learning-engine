require(['connector'], function(socket) {

    $(function() {
        socket.emit("ask gamesInfos");
        socket.emit("ask images names");
		
		socket.on('send images names', function(data) {//populate selects with all images in the image folder
            
			$("#bonusImg").html('');
			$("#malusImg").html('');
            
			var display = "";
			var imageTypes = [".jpeg",".jpg",".png",".gif"];
			for(var i=data.length-1; i>=0; i--){
				var imageName = data[i].replace("_"," ").replace("<","").replace(">","");
				for(var j=imageTypes.length-1; j>=0; j--){
					imageName = imageName.replace(imageTypes[j],"");
				}
				display += '<option value="images/' + data[i] + '">' + imageName + '</option>';
			}
			$("#bonusImg").html(display);
			$("#malusImg").html(display);
            
            var uploadFormulaire = '<h3>Utilisez vos images:</h3>\
                                    <form action="/upload" method="post" enctype="multipart/form-data">\
                                        <input type="file" name="uploadedImage"/>\
                                        <input type="submit"/>\
                                    </form>'
            $("#imageUploader").html(uploadFormulaire);
        });

        socket.on('inject css', function(data) {
            $("head").append("<link rel='stylesheet' type='text/css' href='" + data + "'>");
        });

        socket.on('inject template', function(data) {
            $("#modelParams").empty();
            $("#modelParams").append(data);
        });

        socket.on("send gamesInfos", function(infos) {

            for (var i = 0; i < infos.games.names.length; i++) {
                var $game = $(document.createElement('option'));
                $game.attr("id", infos.games.names[i]);
                $game.html(infos.games.names[i]);
                $game.data("description", infos.games.descriptions[i]);
                $game.data("fileName", infos.games.fileNames[i]);
                $("#gameList").append($game);
            }

            for (var j = 0; j < infos.models.names.length; j++) {
                var $model = $(document.createElement('option'));
                $model.attr("id", infos.models.names[j]);
                $model.html(infos.models.names[j]);
                $model.data("description", infos.models.descriptions[j]);
                $model.data("fileName", infos.models.fileNames[j]);
                $("#modelList").append($model);
            }

            $("#gameDescription").html(infos.games.descriptions[0]);
            $("#modelDescription").html(infos.models.descriptions[0]);
            socket.emit("ask template", infos.models.fileNames[0]);

            $("#gameList").change(function(e) {
                var description = $("#gameList option:selected").data("description");
                $("#gameDescription").html(description);
            });

            $("#modelList").change(function(e) {
                var description = $("#modelList option:selected").data("description");
                $("#modelDescription").html(description);

                socket.emit("ask template", $("#modelList option:selected").data("fileName"));
            });
            /* Cookie verification */
            if(localStorage.length > 0){
                $("#socialBar").css('display', 'none');
                $("#mainMenu").fadeIn('normal');
                $("#blocUser").html("Welcome my friend, "+localStorage.cookie+"");
                $('</br><button id="logout" class="button">Deconnexion</button>').appendTo("#blocUser");
                $("#logout").click(function(e) {
                    localStorage.clear();
                    $("#mainMenu").css('display', 'none');
                    $("#socialBar").fadeIn('normal');
                });
            }
            else{
                /* User name verification */
                $("#user button").click(function(e) {
                    var myRegex = /\W/; // Match every non character
                    var userName = $("#userName").val();

                    if (userName.match(myRegex) === null) {
                        localStorage.setItem("cookie",userName);
                        localStorage.setItem("userName",userName);
                        //localStorage.userName = userName;
                        
                        $(this).parent().css('display', 'none');
                        $("#mainMenu").fadeIn('normal');
                        $("#blocUser").html("Welcome my friend, "+userName+"");
                        $('</br><button id="logout" class="button">Deconnexion</button>').appendTo("#blocUser");
                        $("#logout").click(function(e) {
                            localStorage.clear();
                            $("#mainMenu").css('display', 'none');
                            $("#socialBar").fadeIn('normal');
                        });
                        var socket = io.connect();
                        socket.emit('nouveau_client', userName); // Create the server side tabs with users data 
                    } else {
                        $("#userAlert").html("Ce champ n'accepte pas de chiffre et de lettre sans espace!");
                    }
                });
            }
            $("#gameSelect button").click(function(e) {
                $("#mainMenu").hide();

                var gameSelectedName = $("#gameList option:selected").data("fileName");
                var gameSelectedPath = "games/" + gameSelectedName;

                socket.emit('ask css', gameSelectedName);


                require(['game', gameSelectedPath], function(game) {
                    game.init();
                });
            });

            $(".btnThemes").click(function(e){
                if($(this)[0].id == "rouge"){
                    $( "header" ).css( "background-color", "#E41D1D" );
                    $( "footer" ).css( "background-color", "#E41D1D" );
                }
                if($(this)[0].id == "jaune"){
                    $( "header" ).css( "background-color", "#E9F046" );
                    $( "footer" ).css( "background-color", "#E9F046" );
                }
                if($(this)[0].id == "violet"){
                    $( "header" ).css( "background-color", "#E946F0" );
                    $( "footer" ).css( "background-color", "#E946F0" );
                }
                if($(this)[0].id == "bleu"){
                    $( "header" ).css( "background-color", "#73C8E9" );
                    $( "footer" ).css( "background-color", "#73C8E9" );
                }
            });

            $("#gameCreation").submit(function(e) {
                e.preventDefault();

                $("#mainMenu").hide();

                var modelSelectedName = $("#modelList option:selected").data("fileName");
                var modelSelectedPath = "game_types/" + modelSelectedName;

                socket.emit('ask css', modelSelectedName);
                socket.on('inject css', function(data) {
                    $("head").append("<link rel='stylesheet' type='text/css' href='" + data + "'>");
                });

                var question = $("#question")[0].value;
                var params = {
                    bonusUrl: $("#bonusImg option:selected")[0].value,
                    malusUrl: $("#malusImg option:selected")[0].value
                };

                require(['game', modelSelectedPath], function(game, setGame) {
                    setGame(params);
                    game.init(question);
                });
            });

        });

    });

});
