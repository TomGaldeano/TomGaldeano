let boton = document.querySelector("#jugar")
let num = Math.round(Math.random()*100);
let numIntentos = 0;
const valor = document.querySelector("input")
const msg = document.querySelector("#estado")
const nueva =document.querySelector("#new")
let gano = false;
valor.addEventListener("input",()=>{
    let digitos = valor.value.replace(/\D/g, '');
    valor.value=digitos
})
boton.addEventListener("click",() => {
      
    if (valor.value != num && numIntentos<10 && valor.value != ""&& !gano){
        numIntentos++
        let indice = document.querySelector('.X[data-index="'+numIntentos+'"]')
        indice.classList.add("morado")
        let intentos = document.getElementById("intentos")
        intentos.innerHTML+= " "+valor.value;

        if(numIntentos==10){
            msg.style.backgroundColor = "#e8f061"
            msg.innerHTML="HAS PERDIDO"
        }
        else if(valor.value<num){
            msg.style.backgroundColor = "#f15d59"
            msg.innerHTML=valor.value+" ES MENOR"
        }else if(valor.value>num){
            msg.style.backgroundColor = "#f15d59"
            msg.innerHTML=valor.value+" ES MAYOR"
        }}else if(valor.value==num){
            msg.style.backgroundColor = "#5adc37"
            msg.innerHTML="HAS GANADO"
            gano = true;
    }

})
nueva.addEventListener("click",()=>{
    num = Math.round(Math.random()*100);
    for(let i = 1;i<11;i++){
        let indice = document.querySelector('.X[data-index="'+i+'"]')
        indice.classList.remove("morado")
    }
    numIntentos=0
    let intentos = document.getElementById("intentos")
    intentos.innerHTML = "Intentos Realizados:"
    msg.innerHTML=""
    msg.style.backgroundColor="white"
    valor.value=""

})
