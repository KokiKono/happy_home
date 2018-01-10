/**
 * Created by i4M1k0SU on 2017/11/03.
 */

// Important Notes:
// *  Instead of providing the global broadcast address which is the default, you should provide the IP address
//    of the Milight Controller for unicast mode. Don't use the global broadcast address on Windows as this may give
//    unexpected results. On Windows, global broadcast packets will only be routed via the first network adapter. If
//    you want to use a broadcast address though, use a network-specific address, e.g. for `192.168.0.1/24` use
//    `192.168.0.255`.
// *  Note, for the v6 command set each command must be provided with a zone parameter as shown in the example below!

import {MilightController as Milight, commandsV6 as commands} from 'node-milight-promise';
import config from '../../config.json';

export const MAX_BRIGHTNESS = 100;
export const PRESET_WHITE_PULSE = 0x01;
export const PRESET_COLOR_PULSE = 0x02;
export const PRESET_COLOR_STROBO = 0x03;
export const PRESET_COLOR_STROBO_DARK = 0x04;
export const PRESET_RED_ALERT = 0x05;
export const PRESET_GREEN_ALERT = 0x06;
export const PRESET_BLUE_ALERT = 0x07;
export const PRESET_ALL = 0x08;
export const PRESET_COLOR_GRADATION = 0x09;
export const COLOR_RED = [0xFF, 0x00, 0x00];
export const COLOR_GREEN = [0x00, 0xFF, 0x00];
export const COLOR_BLUE = [0x00, 0x00, 0xFF];
export const COLOR_PINK = [0xFE, 0x2E, 0xF7];

export default class LedModel {

    constructor(zone) {
        this.light = new Milight({
            ip: config.led.ip_address || '255.255.255.255',
            type: 'v6'
        });
        this.zone = zone;
    }

    on() {
        this.light.sendCommands(commands.rgbw.on(this.zone));
    }

    off() {
        this.light.sendCommands(commands.rgbw.off(this.zone));
    }

    link() {
        this.light.sendCommands(commands.rgbw.link(this.zone));
    }

    unlink() {
        this.light.sendCommands(commands.rgbw.unlink(this.zone));
    }

    pause(time) {
        if (time > 0) this.light.pause(time);
    }

    setBrightness(brightness) {
        this.light.sendCommands(commands.rgbw.brightness(this.zone, brightness));
    }

    setHue(hue) {
        this.light.sendCommands(commands.rgbw.hue(this.zone, hue));
    }

    setColor(r, g, b) {
        this.light.sendCommands(commands.rgbw.rgb(this.zone, r, g, b));
    }

    setPreset(preset) {
        this.light.sendCommands(commands.rgbw.effectMode(this.zone, preset))
    }

    speedUp() {
        this.light.sendCommands(commands.rgbw.effectSpeedUp(this.zone));
    }

    speedDown() {
        this.light.sendCommands(commands.rgbw.effectSpeedDown(this.zone));
    }

    rhythmStrobo() {
        this.off();
        this.pause(200);

        for (let x = 0; x < 2; x++) {
            this.on();
            this.pause(200);
            this.off();
            this.pause(200);
        }

        for (let x = 0; x < 2; x++) {
            this.on();
            this.pause(20);
            this.off();
            this.pause(20);
        }

        this.on();
    }

    white() {
        this.light.sendCommands(commands.rgbw.whiteMode(this.zone));
    }

    night() {
        this.light.sendCommands(commands.rgbw.nightMode(this.zone));
    }

    pink() {
        this.light.sendCommands(commands.rgbw.rgb(this.zone, COLOR_PINK[0], COLOR_PINK[1], COLOR_PINK[2]));
    }
    blue() {
        this.light.sendCommands(commands.rgbw.rgb(this.zone, 0, 0, 0xff));
    }

    close() {
        this.light.close().then(() => {
            console.log("All command have been executed - closing Milight");
        });
    }
}
