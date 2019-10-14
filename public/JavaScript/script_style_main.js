function alta(){

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/sign_up", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  window.location = '/sign_up';
}

function acceso(){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/principal", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  window.location = '/principal';
}