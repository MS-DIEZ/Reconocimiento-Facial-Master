var verificacion_aleatoria = [];
var check_verificacion = [];
var timer;
var tiempo_total = 4;
var contador_verificacion = 0; 
var flag_fallo = 0;
var detector_movimiento = 0;
var timer_activo = 0;
var intervalo_ejecucion;
var tiempo_timer = 0;
var flag_prueba = 0;
var labeledFaceDescriptors;

const total_movimientos = 3;
var contador = 5;
var intervalo;


Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/JavaScript/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/JavaScript/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/JavaScript/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/JavaScript/models'),
  faceapi.nets.ssdMobilenetv1.loadFromUri('/JavaScript/models')
]).then(startVideo)


/*Comprobacion de vida del usuario*/
/*
  1 - Giro Derecha
  2 - Giro Izquierda
  3 - Boca Abierta
  0 - Se comprobaran las emociones del usuario para asegurar que es el
*/

function cargar_aleatorio(){

  verificacion_aleatoria = [];
  for(let i = 1; i <= 3; i++){
    verificacion_aleatoria.push(Math.floor(Math.random() * 3) + 1);
  }
}

cargar_aleatorio();


function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

function loadLabeledImages(data) {
  const labels = data;

  return Promise.all(
    labels.map(async label => {
      const descriptions = []
      for(let i = 1; i <= 3; i++) {
        const img = await faceapi.fetchImage(`/JavaScript/DevImages/${label}/${i}.jpg`)
       // const img = faceapi.nets.ssdMobilenetv1.loadFromUri(`/JavaScript/DevImages/${label}/${i}.jpg`)
        

        const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
        descriptions.push(detections.descriptor)
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions)
    })
  )
}

function redirect_error(){
  
  
  
  intervalo = setInterval(function(){

    document.getElementById("video").style.visibility = "hidden";
    document.getElementById("canvas").style.visibility = "hidden";
    document.getElementById('informacion').innerHTML = "Tiempo de espera agotado... Redirigiendo en "+contador+" segundos";

    contador = contador - 1;

    if(contador == 0){
      clearInterval(intervalo);
      var xhr = new XMLHttpRequest();

      xhr.open("POST", "/error", true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      window.location = '/error';
      xhr.send(JSON.stringify({
        value: usuario
      }));
    }
  }, 1000)

}

function match_finded(usuario){

  var xhr = new XMLHttpRequest();
  
  xhr.open("POST", "/redireccion", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  window.location = '/detallado';
  xhr.send(JSON.stringify({
      value: usuario
  }));
}



function timer_verificacion(){
  
  if(tiempo_total==0){
    timer_activo = 0;
    tiempo_total = 5;
  }else{
    timer_activo = 1;
    tiempo_total-=1;
    document.getElementById('informacion').innerHTML = "";
    document.getElementById('informacion').innerHTML = "Espere...";
    setTimeout("timer_verificacion()",1000);
  }
}

function detalle_verificacion(indice){

  document.getElementById('informacion').innerHTML = "";
  switch(indice){
    case 1:
      document.getElementById('informacion').innerHTML = "Realice giro a la derecha";
    break;
    case 2:
      document.getElementById('informacion').innerHTML = "Realice giro a la izquierda";
    break;
    case 3:
      document.getElementById('informacion').innerHTML = "Realice apertura de boca";
    break;
  }
}

//Pasamos las distancias y el tipo de movimiento
function comprobar_movimiento(euclidean_boca, euclidean_derecha, euclidean_izquierda, movimiento_realizado){
  var movimiento;

  if(euclidean_boca > 70){
    movimiento = 3;
  }

  if(euclidean_derecha < 40){
    movimiento = 1;
  }

  if(euclidean_izquierda < 40){
    movimiento = 2;
  }

  if(movimiento == movimiento_realizado){
    contador_verificacion++;
    timer_verificacion();

  }else{
    document.getElementById('informacion').innerHTML = "El movimiento es incorrecto, comience de nuevo...";
    cargar_aleatorio();
    contador_verificacion = 0;
    flag_fallo = 1;
    timer_verificacion();
  }
}

function get_user_data(){
  var request = new XMLHttpRequest();
  request.open('GET', '/', true);
}

const getCookie = (name) => {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
};

const deleteCookie = (name) => {
  document.cookie = name + '=; max-age=0;';
};

const parseObjectFromCookie = (cookie) => {
  const decodedCookie = decodeURIComponent(cookie);
  return JSON.parse(decodedCookie);
};


window.onload = function(){

  let dataCookie = getCookie('data');
  var data;

  deleteCookie('data');
  if (dataCookie) {
    data = parseObjectFromCookie(dataCookie);
    // work with data. `data` is equal to `visitCard` from the server

  } else {
    // handle data not found
  }


  const video = document.getElementById('video')
  video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  //const canvas = document.getElementById("canvas_id");
  document.getElementById("canvas").append(canvas)
  //document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  
  

  
  intervalo_ejecucion = setInterval(async () => {
    
    if(flag_prueba == 0){
      labeledFaceDescriptors = await loadLabeledImages(data)
      flag_prueba = 1;
    }
    
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors().withFaceExpressions();


    //--------------------------------------------------------------------
    
   
    euclidean_derecha = faceapi.euclideanDistance([detections[0].landmarks.positions[4].x, detections[0].landmarks.positions[4].y], [detections[0].landmarks.positions[59].x, detections[0].landmarks.positions[59].y]);
    euclidean_izquierda = faceapi.euclideanDistance([detections[0].landmarks.positions[12].x, detections[0].landmarks.positions[12].y], [detections[0].landmarks.positions[55].x, detections[0].landmarks.positions[55].y]);
    euclidean_boca = faceapi.euclideanDistance([detections[0].landmarks.positions[62].x, detections[0].landmarks.positions[62].y], [detections[0].landmarks.positions[66].x, detections[0].landmarks.positions[66].y]);
   

    if(timer_activo == 0){

    
      if(euclidean_boca > 70){
        detector_movimiento = 1;
      }

      if(euclidean_derecha < 40){
        detector_movimiento = 1;
      }

      if(euclidean_izquierda < 40){
        detector_movimiento = 1;
      }

      if(!(euclidean_boca >> 70) && !(euclidean_derecha < 40) && !(euclidean_izquierda < 40)){
        detector_movimiento = 0;
      }

      switch(contador_verificacion){
        case 0:
            detalle_verificacion(verificacion_aleatoria[0]);
          break;
        case 1:
            detalle_verificacion(verificacion_aleatoria[1]);
          break;
        case 2:
            detalle_verificacion(verificacion_aleatoria[2]);
          break;
      }
    }

    //console.log(contador_verificacion)

    if(detector_movimiento == 1 && timer_activo == 0){
      comprobar_movimiento(euclidean_boca, euclidean_derecha, euclidean_izquierda, verificacion_aleatoria[contador_verificacion]);
    }  

    //--------------------------------------------------------------------
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))

    results.forEach((result, i) => {
      
      const box = resizedDetections[i].detection.box
      const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })

      //Cambiar a los usuarios que existan en la DB

      if(result.label != "unknow"){
        if(total_movimientos == contador_verificacion){          
          match_finded(result.label);
        }

      }
      canvas.getContext('2d').clearRect(0,0, canvas.width, canvas.height);
      drawBox.draw(canvas)

      const resizedResults = faceapi.resizeResults(detections, displaySize)
      faceapi.draw.drawFaceLandmarks(canvas, resizedResults)


      const minProbability = 0.05
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections, minProbability)
      tiempo_timer = tiempo_timer + 100;
      
      if(tiempo_timer == 10000){
        clearInterval(intervalo_ejecucion);
        redirect_error();
      }

    })
    
  }, 1000)
})
  
}
