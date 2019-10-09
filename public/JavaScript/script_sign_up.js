
Promise.all([

]).then(startVideo)

function take_photo(){

	var capturas = [];
	var informacion = shoot();

	for(var i=0; i<3; i++){

		var informacion = shoot();
		capturas.push(informacion)
	}


    console.log(informacion)
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/take_photo", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    window.location = '/callback';

    xhr.send(JSON.stringify({
      value_1: capturas[0],
      value_2: capturas[1],
      value_3: capturas[2]
  }));
    
}


function capture(video, scaleFactor) {
    if(scaleFactor == null){
        scaleFactor = 1;
    }
    var w = video.videoWidth * scaleFactor;
    var h = video.videoHeight * scaleFactor;
    var canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
    var ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, w, h);
    return canvas;
} 
 

function shoot(){
	var scaleFactor = 0.6;
	var snapshots = [];
    var video  = document.getElementById('video');
    var output = document.getElementById('output');
    var canvas = capture(video, scaleFactor);
        canvas.onclick = function(){
            window.open(this.toDataURL());
        };
    snapshots.unshift(canvas);
    output.innerHTML = '';

    console.log(snapshots)

    output.appendChild(snapshots[0]);
    /*
    for(var i=0; i<4; i++){
        output.appendChild(snapshots[i]);
    }
    */
	var dataURL = canvas.toDataURL();
	console.log(dataURL)

	return(dataURL)
}

function startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
}