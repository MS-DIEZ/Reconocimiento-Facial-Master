var capturas = [];


window.onload = function(){
    this.document.getElementById("formulario").style.display="none"
    this.startVideo()
}

function take_photo(){
    document.getElementById("formulario").style.display="block";
    document.getElementById("contenedor").style.display="none";
    document.getElementById("button_photo").style.display="none";
    
    capturas = [];
	var informacion = shoot();

	for(var i=0; i<3; i++){

		var informacion = shoot();
		capturas.push(informacion)
    }

    stopStreamedVideo(video)
    
}

function startVideo() {
    navigator.getUserMedia(
      { video: {} },
      stream => video.srcObject = stream,
      err => console.error(err)
    )
}

function stopStreamedVideo(videoElem) {
    let stream = videoElem.srcObject;
    let tracks = stream.getTracks();
  
    tracks.forEach(function(track) {
      track.stop();
    });
  
    videoElem.srcObject = null;
}

function submit_function(){

    var nombre = document.getElementById("nombre").value;
    var apellido = document.getElementById("apellido").value;
    var dni = document.getElementById("dni").value;
    var direccion = document.getElementById("direccion").value;

    if(nombre == "" || apellido == "" || dni == "" || direccion == ""){
        return false
    }else{
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/take_photo", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.withCredentials = true;

        xhr.onload = function () {
            // Do something with the retrieved data ( found in xmlhttp.response )
            window.location = "/principal"
        };

        
        xhr.send(JSON.stringify({
            value_1: capturas[0],
            value_2: capturas[1],
            value_3: capturas[2],

            value_nombre: nombre,
            value_apellido: apellido,
            value_dni: dni,
            value_direccion: direccion
        }));
    }
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
    output.appendChild(snapshots[0]);

	var dataURL = canvas.toDataURL();

	return(dataURL)
}