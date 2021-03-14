const { createClient } = require("node-thinkgear-sockets");
const { audio } = require('system-control');
const brain = createClient({ enableRawOutput: false });
const debounce = require('debounce');

// focus mode is on by default
let focus = true;
let blink = false;
// Volume high or low
let high = false;

if(process.argv.length > 2){
    blink = process.argv[2] === '-blink';
}

/**
 * Debounce toggle by 5 secs
 * to keep from spamming volume change
 */
const toggle = debounce(()=>{
    if(high){
        audio.volume(99)
    }else{
        audio.volume(20)
    }
    high = !high
}, 5000, true);

// default volume to 50%
audio.volume(50)
brain.connect();

// Focus logic
if(focus){
    brain.on('data', data=>{
        const attention = data && data.eSense && data.eSense.attention 
        if(attention > 77){
            toggle(attention)
        }
    })
}

// Blink logic
if(blink){
    brain.on('blink_data', data=>{
        const blinkStrength = data && data.blinkStrength
        if(blinkStrength > 65){
            toggle(attention)
        }
    })
}
