// Side navigation
function w3_open() {
  var x = document.getElementById("mySidebar");
  x.style.width = "30%";
  x.style.fontSize = "20px";
  x.style.paddingTop = "10%";
  x.style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
}

/*
function redirect_sign_up(){
  window.location.replace("sign_up.html");

}
*/

function redirect_sign_up(){

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/sign_up", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  window.location = '/sign_up';

}