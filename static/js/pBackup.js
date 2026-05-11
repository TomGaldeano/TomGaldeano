const CANVAS_WIDTH = 1400;
    const CANVAS_HEIGHT = 1200;
    const canvas = document.getElementById('bolas');
    const ctx = canvas.getContext('2d');

    const btn7 = document.querySelector("#btn7");
    const ciudadaes = document.querySelector("#ciudades")
    const divs = [document.querySelector("#b1"), document.querySelector("#b2"),
    document.querySelector("#b3"), document.querySelector("#b4"), document.querySelector("#b5")];
    const form = new Map([["email", document.querySelector("#email")],
    ["edad", document.querySelector("#edad")], ["nombre", document.querySelector("#nombre")],
    ["aficion1", document.querySelector("#aficion1")], ["aficion2", document.querySelector("#aficion2")],
    ["aficion3", document.querySelector("#aficion3")], ["poner", document.querySelector("#ponerAficiones")],
    ["quitar", document.querySelector("#quitarAficiones")], ["limpiar", document.querySelector("#limpiar")],
    ["submit", document.querySelector("#submit")]
    ]);
    const bolas = new Array()
    const tabla = new Map([["add", document.querySelector("#add")],
    ["last", document.querySelector("#dellast")],
    ["selected", document.querySelector("#delall")],
    ["body", document.querySelector("#body")]
    ]);
    divs[0].addEventListener("click", () => {
      divs[0].classList.add("red")
    })
    divs[1].addEventListener("mouseover", () => {
      divs[1].classList.toggle("aqua")
      divs[1].classList.toggle("red")
    })
    divs[2].addEventListener("click", () => {
      divs[2].classList.toggle("aqua")
      divs[2].classList.toggle("red")
    })
    divs[4].addEventListener("click", () => {
      divs[3].classList.toggle("right")
    })
    form.get("limpiar").addEventListener("click", () => {
      form.get("email").item = ""
      form.get("edad").value = ""
      form.get("nombre").value = ""
    })
    form.get("edad").addEventListener('input', () => {
      let digits = form.get("edad").value.replace(/\D/g, '');
      if (digits.length >= 0) formatted = digits.slice(0, 3);
      form.get("edad").value = formatted
    });
    form.get("poner").addEventListener("change", () => {
      form.get("aficion1").checked = true
      form.get("aficion2").checked = true
      form.get("aficion3").checked = true
    });
    form.get("quitar").addEventListener("change", () => {
      form.get("aficion1").checked = false
      form.get("aficion2").checked = false
      form.get("aficion3").checked = false
    });
    tabla.get("add").addEventListener("click", () => {
      tabla.get("body").innerHTML += "<tr class='temp'><td>jon</td><td>ff</td><td>12</td><td><input class='del' type='checkbox'></td></tr>"
    });
    tabla.get("last").addEventListener("click", () => {
      let tmp = Array.from(document.querySelectorAll(".temp"));
      let del = tmp.pop();
      del.remove();
    });
    tabla.get("selected").addEventListener("click", () => {
      let tmp = Array.from(document.querySelectorAll(".temp"));
      let remove = Array.from(document.querySelectorAll(".del"));
      let death = new Array();
      for (let i = 0; i < tmp.length; i++) {
        if (remove[i].checked) {
          death.push(tmp[i])
        }
      }
      death.forEach(element => {
        element.remove()
      })
    });
    class Node {
      constructor(item,next=null) {
        this.item = item;
        this.next = next;
      }
      getItem() {
        return this.item
      }
      getNext() {
        return this.next
      }
      setItem(item) {
        this.item = item
      }
      setNext(next){
        this.next = next
      }
    }
    class LinkedList {
      constructor() {
        this.first = new Node(null,null)
        this.last = this.first
        this.numItems = 0;
      }
      getlength(){
        return this.numItems
      }
      getitem(index) {
        if (index >= 0 && index < this.numItems) {
          let cursor = this.first.getNext()
          for (let i = 0; i < index; i++) {
            cursor = cursor.getNext()
          }          
          return cursor.getItem()
        }
      }
      append(item) {
        const newNode = new Node(item);
        this.last.setNext(newNode)
        this.last=newNode
        this.numItems++
      }
      remove(item) {
        if (!this.first) return;

        if (this.first.item === item) {
          this.first = this.first.next;
          this.numItems--;
          return;
        }
        let current = this.first;
        while (current.next && current.next.item !== item) {
          current = current.next;
        }

        if (current.next) {
          current.next = current.next.next;
          this.numItems--;
        }
      }
      delitem(index){
        let cursor = this.first
        if (this.numItems==1 && index==0){
            this.first= new Node(null,null)
            this.last = this.first
            this.numItems=0
        }else if(index < this.numItems){
            for(let i = 0;i<index;i++){
                cursor = cursor.getNext()
            }
            let cursor2 = cursor.getNext()
            cursor.setNext(cursor2.getNext())
            this.numItems--;
        }else if (index==this.numItems) {
            for(let i = 0;i<index-2;i++){
                cursor = cursor.getNext()
            }
            this.last=cursor.getNext()
            this.numItems=0
        }
      }
      find(item) {
        let current = this.first;
        while (current) {
          if (current.item === item) {
            return current;
          }
          current = current.next;
        }
        return null;
      }
    }
    const paises = new LinkedList()
    paises.append(new Map([["pais", "es"], ["ciudades", ["Madrid", "Barcelona"]]]))
    paises.append(new Map([["pais", "en"], ["ciudades", ["Londres", "Bristol"]]]))
    paises.append(new Map([["pais", "pt"], ["ciudades", ["Porto", "Lisboa"]]]))
    const cities = new LinkedList()
    
    btn7.addEventListener("click",()=>{
        while(cities.getlength()>0){
            let tmp = cities.getitem(0)
            tmp.remove()
            cities.delitem(0)
        }
        let lista_pais = document.querySelectorAll(".pais")
        for(let i = 0;i<paises.getlength();i++){
            if (lista_pais[i].checked) {
                const map = paises.getitem(i)
                map.get("ciudades").forEach(element => {
                    ciudadaes.innerHTML += "<li class='city plain-li'>"+element+"</li>"
                });
            }
        }
        document.querySelectorAll(".city").forEach(el => {
            cities.append(el)
        });
    })
    
    class Bola {
      constructor() {
        this.rad = Math.ceil(Math.random() * 5) + 5;
        this.pos = [Math.ceil(Math.random() * (CANVAS_WIDTH - 20) + 5), Math.ceil(Math.random() * (CANVAS_HEIGHT - 20) + 5)]
        this.dir = [Math.random() + 0.2, Math.random() + 0.2]
      }
      get_dir() {
        return this.dir
      }
      get_pos() {
        return this.pos
      }
      get_rad() {
        return this.rad
      }
      dibuja() {
        ctx.beginPath();
        ctx.arc(this.pos[0], this.pos[1], this.rad, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      }
      mueve_bola(bolas) {
        this.resuelve_colision()
        this.choque(bolas)
        this.pos = [this.pos[0] + this.dir[0], this.dir[1] + this.pos[1]]
        this.dibuja()
      }
      resuelve_colision() {
        if ((this.pos[0] - this.rad + this.dir[0]) < 0) { //colision izquierda
          this.dir[0] *= -1
        }
        if ((this.pos[1] - this.rad + this.dir[1]) < 0) { // colision arriba
          this.dir[1] *= -1
        }
        if ((this.pos[0] + this.rad + this.dir[0]) > CANVAS_WIDTH) { // collision derecha
          this.dir[0] *= -1
        }
        if ((this.pos[1] + this.rad + this.dir[1]) > CANVAS_HEIGHT) { //collision abajp
          this.dir[1] *= -1
        }
      }
      intersecciona(bola, plus = 0) {
        if (this === bola) {
          return false;
        }
        let dist = Math.sqrt(Math.pow(this.pos[0] - bola.get_pos()[0], 2) + Math.pow(this.pos[1] - bola.get_pos()[1], 2))
        if (dist > (this.rad + bola.get_rad() + plus)) {
          return false;
        }
        return true;
      }
      choque(bolas) {
        bolas.forEach(e => {
          if (this.intersecciona(e)) {
            this.dir = [this.dir[0] * -1, this.dir[1] * -1]
          }
        })
      }
    }
    function crea_bolas() {
      let bola = new Bola();
      let valida = true
      while (bolas.length < 100) {
        bolas.forEach(e => {
          if (e.intersecciona(bola, 2))
            valida = false
        });
        if (valida) {
          bolas.push(bola)
        }
        valida = true
        bola = new Bola()
      }
    };
    function mueve_bolas(bolas) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      bolas.forEach(e => {
        e.mueve_bola(bolas)
      });
    }
    crea_bolas()
    setInterval(mueve_bolas, 10, bolas)