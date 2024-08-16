import { AUTO, Game, Scale } from 'phaser';
import { Village } from './scenes/Village'
import { Map } from './scenes/Map'
//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1250,
    height: 1100,
    parent: 'game-container',
    backgroundColor: '#808080',
    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
    },
    scene: [
        Village,
        Map,
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
