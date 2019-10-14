var resultado;
var identificadores = [];
var numero_usuarios;

const port = 3000;
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const base64ToImage = require('base64-to-image');
const Jimp = require('jimp');

const connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'dFup9BYSx2',
    password: 'P1hNpGNTfn',
    database: 'dFup9BYSx2',
    multipleStatements: true
});

connection.connect(function(error){
    if(!!error){
        console.log("Error en la conexion a la DB");
        console.log(error);
    }else{
        console.log("Conexion realizada con exito a la DB");
    }
});

function count_folders(){
    //Contamos el numero de directorios que hay en la carpeta DevImages
    console.log("Contando directorios");
    return new Promise(function(resolve, reject) 
    {
        fs.readdir(__dirname+'/public/JavaScript/DevImages', (err, files) => {

            if(err){
                reject(err);
            }else{
                numero_usuarios = 0;
                numero_usuarios = (files.length - 1);
                resolve(numero_usuarios);
            }
            
        })
    })
}

function execute_select(){

   return new Promise(function(resolve, reject) 
   {
        connection.query('SELECT * FROM USUARIOS_INFO', function(error, result){
            if(error)
            {
                reject(error);
            }
            else
            {   
                resolve(result);
            }
        })
   }) 
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.engine('html', require('ejs').renderFile);


app.get('/', function(request, response){
    response.render(__dirname + "/public/main.html");
})

app.get('/principal', function(request, response) {
    
    var select_promise = execute_select();

    select_promise.then(function(result){
        identificadores = [];
        resultado = [];
        resultado = result;

        for(var i=0; i<result.length; i++){
            identificadores.push(""+result[i].Identificador);
        }

        response.cookie('data', JSON.stringify(identificadores));
        response.render(__dirname + "/public/client.html");
    })
    
    console.log("Redirigiendo a pantalla inicial.html")
});


app.post('/redireccion', function(request, response){
    console.log('Post realizado, llamando a detallado...');
    response.cookie('data', JSON.stringify(resultado[parseInt(request.body.value)-1]))
    response.redirect('/detallado');
});


app.get('/detallado', function(request, response) {

    response.sendFile(__dirname + '/public/redireccion.html');
});


app.get('/sign_up', function(request, response) {
    response.sendFile(__dirname + '/public/sign_up_form.html');
});

app.get('/error', function(request, response) {
    response.sendFile(__dirname + '/public/error.html');
});

app.get('/callback', function(request, response){
    console.log("Entrando en callback")
    response.redirect('/')
});


app.post('/take_photo', function(request, response) {

    var count_promise;
    

    count_promise = count_folders();
    
    
    count_promise.then(function(result){

       numero_usuarios = result;
       console.log("Numero en usuarios: "+numero_usuarios);
       console.log("Numero en resultados: "+result);

        fs.mkdirSync(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1));

        
        var base64Str = ""+request.body.value_1;
        var path = __dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/';

        var optionalObj = {'fileName': '1', 'type':'jpg'};
        base64ToImage(base64Str,path,optionalObj)

        optionalObj = {'fileName': '2', 'type':'jpg'};
        base64Str = ""+request.body.value_2
        base64ToImage(base64Str,path,optionalObj)

        optionalObj = {'fileName': '3', 'type':'jpg'};
        base64Str = ""+request.body.value_3
        base64ToImage(base64Str,path,optionalObj)


        var nombre = String(request.body.value_nombre);
        var apellido = String(request.body.value_apellido);
        var direccion = String(request.body.value_direccion);
        var DNI = String(request.body.value_dni);

        connection.query("INSERT INTO USUARIOS_INFO (Nombre, Apellido, Direccion, DNI) VALUES ('"+nombre+"', '"+apellido+"','"+direccion+"','"+DNI+"')", function(error, result){
            if(error)
            {
                throw error;
            }
        });

        identificadores.push(""+(identificadores.length+1));
        response.cookie('data', JSON.stringify(identificadores));
        response.redirect('/principal')
    });
})

process.on('SIGINT', function () {
    console.log('Servicio interrumpido');
    process.exit(2);
});

app.listen(process.env.PORT || 3000, function(){
  console.log('Server: NodeJS');
  console.log('Port: '+port)
  console.log('Author: @MSDIEZ');
  console.log('License: MIT');
  console.log('Servidor activo...');
});



