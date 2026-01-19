
  function make_tabla(proceso) {
    const randMax = 6;
    const llegada = [Math.floor(Math.random() * randMax),
    Math.floor(Math.random() * randMax),
    Math.floor(Math.random() * randMax),
    Math.floor(Math.random() * randMax),
    Math.floor(Math.random() * randMax)];
    const ejecucion = [Math.floor(Math.random() * randMax + 3),
    Math.floor(Math.random() * randMax + 3),
    Math.floor(Math.random() * randMax + 3),
    Math.floor(Math.random() * randMax + 3),
    Math.floor(Math.random() * randMax + 3)];
    for (let i = 0; i < 5; i++) {
      document.querySelector('.'+proceso+'_llegada[data-index="' + i + '"]').innerText = llegada[i];
      document.querySelector('.'+proceso+'_ejecucion[data-index="' + i + '"]').innerText = ejecucion[i];
    }

  }
  function make_marcos() {
  const randMax = 9;
  for(let i = 0; i<15;i++){
    document.querySelector('.marcoshead[data-index="' + i + '"]').innerText = Math.floor(Math.random() * randMax);
  }
  }
  make_marcos();
  document.addEventListener('DOMContentLoaded', function () {
  make_tabla("proceso");
  make_tabla("dinamica");
  make_tabla("estatica");
  });

function fifo(opcion){
  if (opcion=="proceso") {   
    let llegadas = {};
    let duraciones = {};
    let cont = 0
    for(let i=0;i<5;i++){
      llegadas[i] = document.querySelector("")
    }
  } else {

  }
  
}
function srj(){

}
function srt(){

}
function robin(){

}
function lfu(){

}
function optimal(){

}
function best_fit(opcion){
  if (opcion = "estatica") {
    
  } else {

  }
}
function worst_fit(){
  if (opcion = "estatica") {
    
  } else {
    
  }
}
function next_fit(){
  if (opcion = "estatica") {
    
  } else {
    
  }
}
function first_fit(){
  if (opcion = "estatica") {
    
  } else {
    
  }
}
function comprobar(proceso){
  if (proceso=="gestion"){
    let opcion = document.getElementById("opcion_proceso")
    if (opcion.value="fifo") {
      fifo("proceso");
    } else if (opcion.value == "srj"){
      srj();
    } else if (opcion.value == "srt"){
      srt();
    } else if (opcion.value == "robin") {
      robin();
    }
  } else if (proceso=="dinamica") {
    let opcion = document.getElementById("opcion_dinamica");
    if (opcion.value="best") {
      best_fit("dinamica");
    } else if (opcion.value == "worst"){
      worst_fit("dinamica");
    } else if (opcion.value == "next"){
      next_fit("dinamica");
    } else if (opcion.value == "first") {
      first_fit("dinamica");
    }
  } else if(proceso == "estatica"){
    let opcion = document.getElementById("opcion_estatica");
    if (opcion.value="best") {
      best_fit("estatica");
    } else if (opcion.value == "worst"){
      worst_fit("estatica");
    } else if (opcion.value == "next"){
      next_fit("estatica");
    } else if (opcion.value == "first") {
      first_fit("estatica");
    }
    
  } else if(proceso == "marcos"){
    let opcion = document.getElementById("opcion_marcos");
    if (opcion.value == "fifo") {
      fifo("marcos");
    } else if (opcion.value == "lfu"){
      lfu()
    }else if (opcion.value == "optimal") {
      optimal()
    }else if (opcion.value == "lru") {
      lru()
    }
  } 
}