var resultado;
var identificadores = [];
var numero_usuarios;
var tiempo_total;

var timer_activo = 0;
var timer_contador = 0;
var tiempo_total = 3;

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
    database: 'dFup9BYSx2'
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
        connection.query('SELECT * FROM Usuarios', function(error, result){
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
//app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
//app.use(bodyParser.json())
app.engine('html', require('ejs').renderFile);


app.get('/', function(request, response) {
    
    console.log("Redireccion /")
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

    //response.sendFile(__dirname + '/public/sign_up.html');
    response.sendFile(__dirname + '/public/sign_up_form.html');
});

app.get('/error', function(request, response) {

    response.sendFile(__dirname + '/public/error.html');
    //response.redirect('redireccion.html');
});

app.get('/callback', function(request, response){
    console.log("Entrando en callback")
    response.redirect('/')
});


app.post('/take_photo', function(request, response) {

    var count_promise;
    

    count_promise = count_folders();
    
    
    count_promise.then(function(result){

       var select_promise;
       var webcam_promise;

       numero_usuarios = result;
       console.log("Numero en usuarios: "+numero_usuarios);
       console.log("Numero en resultados: "+result);

       try{

        if (fs.existsSync(__dirname+'/'+'1.jpg')) {

            fs.unlinkSync(__dirname+'/'+'1.jpg');
            fs.unlinkSync(__dirname+'/'+'2.jpg');
            fs.unlinkSync(__dirname+'/'+'3.jpg');
        }
        } catch(err){
            console.error("No existen los ficheros")
        }

        fs.mkdirSync(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1));

        

        var base64Str = ""+request.body.value_1;
        var path = __dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/';

        var optionalObj = {'fileName': '1', 'type':'png'};
        base64ToImage(base64Str,path,optionalObj)

        optionalObj = {'fileName': '2', 'type':'png'};
        base64Str = ""+request.body.value_2
        base64ToImage(base64Str,path,optionalObj)

        optionalObj = {'fileName': '3', 'type':'png'};
        base64Str = ""+request.body.value_3
        base64ToImage(base64Str,path,optionalObj)

        
        


        Jimp.read(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+1+'.png', (err, imagen) => {
            if (err) throw err;

            imagen
            .resize(1280, 720) // resize
            .quality(60) // set JPEG quality
            .write(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+1+".jpg"); // save
        });

        Jimp.read(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+2+'.png', (err, imagen) => {
            if (err) throw err;

            imagen
            .resize(1280, 720) // resize
            .quality(60) // set JPEG quality
            .write(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+2+".jpg"); // save
        });


        Jimp.read(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+3+'.png', (err, imagen) => {
            if (err) throw err;

            imagen
            .resize(1280, 720) // resize
            .quality(60) // set JPEG quality
            .write(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+3+".jpg"); // save
        });



        connection.query('INSERT INTO Usuarios (Nombre) VALUES ('+(numero_usuarios+1)+')', function(error, result){
            if(error)
            {
            throw error;
            }
        });


        fs.unlink(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+1+'.png', (err) => {
          if (err) throw err;
          console.log(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+1+'.png was deleted');
        });

        fs.unlink(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+2+'.png', (err) => {
          if (err) throw err;
          console.log(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+2+'.png was deleted');
        });

        fs.unlink(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+3+'.png', (err) => {
          if (err) throw err;
          console.log(__dirname+'/public/JavaScript/DevImages/'+(numero_usuarios+1)+'/'+3+'.png was deleted');        
        });



        /*
        var select_promise = execute_select();
        
        
        select_promise.then(function(result){
            identificadores = [];
            for(var i=0; i<result.length; i++){
                identificadores.push(""+result[i].Identificador);
            }

            response.cookie('data', JSON.stringify(identificadores));
            response.redirect('/callback');
        })
        */
       
        identificadores.push(""+(identificadores.length+1));

        response.cookie('data', JSON.stringify(identificadores));
        response.redirect('/')
        //response.render(__dirname + "/public/client.html");
        
    })
});

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



