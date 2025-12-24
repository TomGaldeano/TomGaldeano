
  function make_procesos() {
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
      document.querySelector('.gestion_llegada[data-index="' + i + '"]').innerText = llegada[i];
      document.querySelector('.gestion_ejecucion[data-index="' + i + '"]').innerText = ejecucion[i];
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
  make_procesos();
  });
