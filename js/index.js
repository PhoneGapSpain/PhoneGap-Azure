/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var myScroll, li;
function loaded() {
	myScroll = new iScroll('wrapperListado');
}

document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

/* * * * * * * *
 *
 * Use this for high compatibility (iDevice + Android)
 *
 */
document.addEventListener('DOMContentLoaded', function () { setTimeout(loaded, 200); }, false);

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        new FastClick(document.body);
        listado();
    }
};

var client = new WindowsAzure.MobileServiceClient(
    "https://phonegapazure.azure-mobile.net/",
    "zPykhYjMQcxXAGVjbVsanhQZIfCNSb95"
);

var tablaClientes = client.getTable("Clientes");

function mostrarFormulario(){
    $( "#tituloFormulario" ).html('Nuevo Cliente');
    $("#scrollerFormulario").html('<div class="fondoValor"><input id="valor" type="text" placeholder="Valor del item"></div><div class="boton" onclick="insertar()">Enviar</div>');
    mostrar();
}

function mostrar(){
    $( "#formulario" ).removeClass( "right" );
    $( "#formulario" ).addClass( "center" );
}

function volver(){
    $( "#formulario" ).removeClass( "center" );
    $( "#formulario" ).addClass( "right" );
}

/*MOSTRAR EL LISTADO DE CLIENTES*/
function listado(){
    li="";
    $('#placeToInsert').html("");
    tablaClientes.read().then(function (todoItems) {
        for (var i = 0; i < todoItems.length; i++) {
            li += '<li onclick="ficha(\''+todoItems[i].id+'\')"><div>'+todoItems[i].text+'</div></li>';
        }
    }).done(function (result) {
        $('#placeToInsert').append(li);
        myScroll.refresh();
    });  
}
/***********/

/*BUSQUEDA DESDE EL LISTADO DE CLIENTES*/
function busqueda(texto){
    if(texto==""){
        mostrar();
    }else{
        li="";
        $('#placeToInsert').html("");
        tablaClientes.where({
            text: texto
        }).read().then(function (todoItems) {
            for (var i = 0; i < todoItems.length; i++) {
                li += '<li onclick="ficha(\''+todoItems[i].id+'\')"><div>'+todoItems[i].text+'</div></li>';
            }
        }).done(function (result) {
            $('#placeToInsert').append(li);
            myScroll.refresh();
        });
    }
}
/***********/

/*INSERTAR NUEVO CLIENTE*/
function insertar(){
    tablaClientes.insert({ text: $( "#valor" ).val() }).done(function (results) {
        listado();
        volver();
    }); 
}
/***********/

/*MOSTRAR LA FICHA DE UN CLIENTE*/
function ficha(id){
    $( "#tituloFormulario" ).html('Ficha Cliente');
    $("#scrollerFormulario").html('<div class="fondoValor"><input id="valor" type="text" placeholder="Nombre"></div><div class="boton" onclick="modificar(\''+id+'\')">Modificar</div><div class="boton" onclick="eliminar(\''+id+'\')">Eliminar</div>');
    tablaClientes.where({
        id: id
    }).read().then(function (todoItems) {
        $("#valor").val(todoItems[0].text);
    }).done(function (result) {
        mostrar();
    });
}
/***********/

/*MODIFICAR UN CLIENTE*/
function modificar(id){
    tablaClientes.update({
        id: id,
        text: $( "#valor" ).val()
    }).done(function (result) {
        listado();
        volver(); 
    });
}
/***********/

/*ELIMINAR UN CLIENTE*/
function eliminar(id){
    tablaClientes.del({ 
        id: id 
    }).then(function (todoItems) {   
        listado();
        volver();
    });
}
/***********/

