// Obtiene el estado del boton

// let btn = document.querySelector('button');
let btn = document.getElementById('cambiar');

// Funcion que da una alerta y cambia el nombre del titulo
function clicked() {
    alert('Haz clickeado!')
    
    let h1 = document.querySelector('h1');
    h1.textContent = "GodBye DOM";
}

// Escucha el evento y, cuando pasa, genera un cambio
btn.addEventListener('click', clicked)

