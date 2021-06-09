Stream = require('node-rtsp-stream');
stream = new Stream({
  name: 'name',
  streamUrl: `rtsp://admin:abcd1234@192.168.0.22:554`,
  wsPort: 9999,
  ffmpegOptions: { // options ffmpeg flags
    '-stats': '', // an option with no neccessary value uses a blank string
    '-r': 30 // options with required values specify the value after the key
  }
})

// const onvif = require('node-onvif');

// let device = new onvif.OnvifDevice({
//   xaddr: 'http://192.168.0.22:2000/onvif/device_service',
//   user : 'admin',
//   pass : 'abcd1234'
// });
 
// // Initialize the OnvifDevice object
// device.init().then((info) => {
//   // Show the detailed information of the device.
//   let url = device.getUdpStreamUrl();
//   console.log(url);
// }).catch((error) => {
//   console.error(error);
// });