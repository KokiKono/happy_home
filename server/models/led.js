/**
 * Created by garbage on 2017/11/03.
 */

import {MilightController as Milight, commandsV6 as commands} from 'node-milight-promise';
import configFile from '../../config.json';

const config = configFile[process.env.NODE_ENV];

class LedModel {

    constructor(zone) {
        this.light = new Milight({
            ip: config.led.ip_address || '255.255.255.255',
            type: 'v6'
        });
        this.zone = zone;
    }

    off() {
        this.light.sendCommands(commands.rgbw.off(this.zone));
    }

    on() {
        this.light.sendCommands(commands.rgbw.on(this.zone), commands.rgb.whiteMode(this.zone), commands.rgbw.brightness(this.zone, 100));
    }
}
