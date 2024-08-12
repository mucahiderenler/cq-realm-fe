window.onload = function () {

     var game = new Phaser.Game(640, 480, Phaser.CANVAS, "", { preload: onPreload, create: onCreate });

     var hexagonWidth = 70;
     var hexagonHeight = 80;
     var gridSizeX = 17;
     var gridSizeY = 7;
     var columns = [Math.ceil(gridSizeX / 2), Math.floor(gridSizeX / 2)];
     var moveIndex;
     var sectorWidth = hexagonWidth;
     var sectorHeight = hexagonHeight / 4 * 3;
     var gradient = (hexagonHeight / 4) / (hexagonWidth / 2);
     var marker;
     var hexagonGroup;

     function onPreload() {
          game.load.image("hexagon", "hexagon.png");
          game.load.image("marker", "marker.png");
     }

     function onCreate() {
          hexagonGroup = game.add.group();
          game.stage.backgroundColor = "#ffffff"
          for (var i = 0; i < gridSizeY / 2; i++) {
               for (var j = 0; j < gridSizeX; j++) {
                    if (gridSizeY % 2 == 0 || i + 1 < gridSizeY / 2 || j % 2 == 0) {
                         var hexagonX = hexagonWidth * j / 2;
                         var hexagonY = hexagonHeight * i * 1.5 + (hexagonHeight / 4 * 3) * (j % 2);
                         var hexagon = game.add.sprite(hexagonX, hexagonY, "hexagon");
                         hexagonGroup.add(hexagon);
                    }
               }
          }
          hexagonGroup.x = (game.width - hexagonWidth * Math.ceil(gridSizeX / 2)) / 2;
          if (gridSizeX % 2 == 0) {
               hexagonGroup.x -= hexagonWidth / 4;
          }
          hexagonGroup.y = (game.height - Math.ceil(gridSizeY / 2) * hexagonHeight - Math.floor(gridSizeY / 2) * hexagonHeight / 2) / 2;
          if (gridSizeY % 2 == 0) {
               hexagonGroup.y -= hexagonHeight / 8;
          }
          marker = game.add.sprite(0, 0, "marker");
          marker.anchor.setTo(0.5);
          marker.visible = false;
          hexagonGroup.add(marker);
          moveIndex = game.input.addMoveCallback(checkHex, this);
     }

     function checkHex() {
          var candidateX = Math.floor((game.input.worldX - hexagonGroup.x) / sectorWidth);
          var candidateY = Math.floor((game.input.worldY - hexagonGroup.y) / sectorHeight);
          var deltaX = (game.input.worldX - hexagonGroup.x) % sectorWidth;
          var deltaY = (game.input.worldY - hexagonGroup.y) % sectorHeight;
          if (candidateY % 2 == 0) {
               if (deltaY < ((hexagonHeight / 4) - deltaX * gradient)) {
                    candidateX--;
                    candidateY--;
               }
               if (deltaY < ((-hexagonHeight / 4) + deltaX * gradient)) {
                    candidateY--;
               }
          }
          else {
               if (deltaX >= hexagonWidth / 2) {
                    if (deltaY < (hexagonHeight / 2 - deltaX * gradient)) {
                         candidateY--;
                    }
               }
               else {
                    if (deltaY < deltaX * gradient) {
                         candidateY--;
                    }
                    else {
                         candidateX--;
                    }
               }
          }
          placeMarker(candidateX, candidateY);
     }

     function placeMarker(posX, posY) {
          if (posX < 0 || posY < 0 || posY >= gridSizeY || posX > columns[posY % 2] - 1) {
               marker.visible = false;
          }
          else {
               marker.visible = true;
               marker.x = hexagonWidth * posX;
               marker.y = hexagonHeight / 4 * 3 * posY + hexagonHeight / 2;
               if (posY % 2 == 0) {
                    marker.x += hexagonWidth / 2;
               }
               else {
                    marker.x += hexagonWidth;
               }
          }
     }

}