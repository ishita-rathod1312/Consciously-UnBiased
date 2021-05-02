'use strict'

let blob, url  

let log = console.log.bind(console),
  id = val => document.getElementById(val),
  ul = id('ul'),
  start = id('start'),
  stop = id('stop'),
  stream,
  recorder,
  counter=1,
  chunks,
  media;

start.onclick = e => {
log('start clicked');
  media = { tag: 'audio',
          type: 'audio/wav',
          ext: '.wav',
          gUM: {audio: true}};
log('start 2');
  navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
log('start4');
    stream = _stream;
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
log('start3');
      chunks.push(e.data);
      if(recorder.state == 'inactive') { 
makeLink();
sendFile();
}
    };
  start.disabled = true;
  stop.removeAttribute('disabled');
  chunks=[];
  recorder.start();
    log('got media successfully');
  }).catch(log);
}

stop.onclick = e => {
  stop.disabled = true;
  recorder.stop();
  start.removeAttribute('disabled');
}

function blobToFile(theBlob, fileName){       
    return new File([blob], fileName, { lastModified: new Date().getTime(), type: media.type })
}

function sendFile(){

var form = new FormData();
form.append("data", blobToFile(blob, "download.wav"));

var settings = {
  "url": <FIREBASE_STORAGE_LINK_HERE>,
  "method": "POST",
  "timeout": 0,
  "processData": false,
  "mimeType": "multipart/form-data",
  "contentType": false,
  "data": form
};
$.ajax(settings).done(function (response) {
  console.log(response);
});

var requestOptions = {
  method: 'GET',
  redirect: 'follow'
};

fetch(<NGROK_LINK_HERE>, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
}

function makeLink(){
log('make link called');
  blob = new Blob(chunks, {type: media.type })
  url = URL.createObjectURL(blob)
}