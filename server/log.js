/**
 * Created by kokikono on 2017/11/14.
 */
import log4js from 'log4js';

log4js.configure('log4js.json');

export const eventLogger = log4js.getLogger('event');
export const motionLogger = log4js.getLogger('motion');
