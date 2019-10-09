function get_user_data(){

    var request = new XMLHttpRequest();
    request.open('GET', '/', true);
    console.log(request.responseText);
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

    console.log(data.Nombre);

    } else {
    // handle data not found
    }

    document.getElementById('nombre').innerHTML = "Bienvenido " + data.Nombre;


}