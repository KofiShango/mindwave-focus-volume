const { createClient } = require("node-thinkgear-sockets");
const { audio } = require('system-control');
const brain = createClient({ enableRawOutput: false });
const debounce = require('debounce');

let focus = true;
let blink = false;
if(process.argv.length > 2){
    console.log(process.argv[2] === '-blink')
    blink = process.argv[2] === '-blink'
}
const toggle = debounce(()=>{
    if(high){
        audio.volume(99)
    }else{
        audio.volume(20)
    }
    high = !high
}, 5000, true);

brain.connect();
audio.volume(50)
let high = false

if(focus){
    brain.on('data', data=>{
        const attention = data && data.eSense && data.eSense.attention 
        if(attention > 77){
            toggle(attention)
        }
    })
}

if(blink){
    brain.on('blink_data', data=>{
        console.log(data)
        const blinkStrength = data && data.blinkStrength
        if(blinkStrength > 65){
            toggle(attention)
        }
    })
}

