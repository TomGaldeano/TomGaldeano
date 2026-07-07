// ========================
// Table generation helpers
// ========================

function make_tabla(proceso) {
  const randMax = 6;
  const llegada = [];
  const ejecucion = [];
  for (let i = 0; i < 5; i++) {
    llegada.push(Math.floor(Math.random() * randMax));
    ejecucion.push(Math.floor(Math.random() * randMax) + 3);
  }
  for (let i = 0; i < 5; i++) {
    document.querySelector('.' + proceso + '_llegada[data-index="' + i + '"]').innerText = llegada[i];
    document.querySelector('.' + proceso + '_ejecucion[data-index="' + i + '"]').innerText = ejecucion[i];
  }
  // Clear result fields
  clearResults(proceso);
}

function make_tabla_memoria(tipo) {
  const randMax = 6;
  for (let i = 0; i < 5; i++) {
    document.querySelector('.' + tipo + '_llegada[data-index="' + i + '"]').innerText = Math.floor(Math.random() * randMax);
    document.querySelector('.' + tipo + '_duracion[data-index="' + i + '"]').innerText = Math.floor(Math.random() * randMax) + 3;
    const maxSize = tipo === 'estatica' ? 6 : 7;
    document.querySelector('.' + tipo + '_tamaño[data-index="' + i + '"]').innerText = Math.floor(Math.random() * maxSize) + 1;
  }
  clearResults(tipo);
}

function clearResults(proceso) {
  document.querySelectorAll('.' + proceso + '_espera').forEach(el => {
    if (el.tagName === 'INPUT') el.value = '';
    else el.innerText = '';
  });
  document.querySelectorAll('.' + proceso + '_retorno').forEach(el => {
    if (el.tagName === 'INPUT') el.value = '';
    else el.innerText = '';
  });
  document.querySelectorAll('.' + proceso + '_fin').forEach(el => {
    if (el.tagName === 'INPUT') el.value = '';
    else el.innerText = '';
  });
}

function make_marcos() {
  const randMax = 9;
  for (let i = 0; i < 15; i++) {
    document.querySelector('.marcoshead[data-index="' + i + '"]').innerText = Math.floor(Math.random() * randMax);
  }
  document.querySelectorAll(".marco").forEach(element => {
    element.value = "";
  });
}

// ========================
// Data extraction helpers
// ========================

function getTableData(proceso) {
  const llegadas = [];
  const duraciones = [];
  for (let i = 0; i < 5; i++) {
    llegadas.push(parseInt(document.querySelector('.' + proceso + '_llegada[data-index="' + i + '"]').innerText));
    duraciones.push(parseInt(document.querySelector('.' + proceso + '_ejecucion[data-index="' + i + '"]').innerText));
  }
  return { llegadas, duraciones };
}

function getMemoriaData(tipo) {
  const llegadas = [];
  const duraciones = [];
  const tamaños = [];
  for (let i = 0; i < 5; i++) {
    llegadas.push(parseInt(document.querySelector('.' + tipo + '_llegada[data-index="' + i + '"]').innerText));
    duraciones.push(parseInt(document.querySelector('.' + tipo + '_duracion[data-index="' + i + '"]').innerText));
    tamaños.push(parseInt(document.querySelector('.' + tipo + '_tamaño[data-index="' + i + '"]').innerText));
  }
  return { llegadas, duraciones, tamaños };
}

function getMarcos() {
  const refs = [];
  for (let i = 0; i < 15; i++) {
    refs.push(parseInt(document.querySelector('.marcoshead[data-index="' + i + '"]').innerText));
  }
  return refs;
}

function writeResults(proceso, espera, retorno, fin) {
  for (let i = 0; i < 5; i++) {
    document.querySelector('.' + proceso + '_espera[data-index="' + i + '"]').value = espera[i];
    document.querySelector('.' + proceso + '_retorno[data-index="' + i + '"]').value = retorno[i];
    document.querySelector('.' + proceso + '_fin[data-index="' + i + '"]').value = fin[i];
  }
}

// ====================================
// Process Scheduling Algorithms
// ====================================

function fifo(opcion) {
  if (opcion === "proceso") {
    const { llegadas, duraciones } = getTableData("proceso");

    // Create process indices sorted by arrival time, then by index for ties
    const indices = [0, 1, 2, 3, 4];
    indices.sort((a, b) => llegadas[a] - llegadas[b] || a - b);

    const espera = Array(5).fill(0);
    const retorno = Array(5).fill(0);
    const fin = Array(5).fill(0);

    let currentTime = 0;
    for (const i of indices) {
      if (currentTime < llegadas[i]) {
        currentTime = llegadas[i];
      }
      espera[i] = currentTime - llegadas[i];
      fin[i] = currentTime + duraciones[i];
      retorno[i] = fin[i] - llegadas[i];
      currentTime = fin[i];
    }

    writeResults("proceso", espera, retorno, fin);
  } else {
    // Page replacement FIFO (marcos)
    const refs = getMarcos();
    const numFrames = 4;
    const frames = [];
    const ans = [];

    for (let i = 0; i < refs.length; i++) {
      const page = refs[i];
      if (!frames.includes(page)) {
        if (frames.length >= numFrames) {
          frames.shift();
        }
        frames.push(page);
      }
      // Build snapshot padded to numFrames with null
      const snapshot = [];
      for (let f = 0; f < numFrames; f++) {
        snapshot.push(f < frames.length ? frames[f] : null);
      }
      ans.push(snapshot);
    }
    rellenaMarco(ans);
  }
}

// SJF (Shortest Job First) — non-preemptive
function srj() {
  const { llegadas, duraciones } = getTableData("proceso");

  const espera = Array(5).fill(0);
  const retorno = Array(5).fill(0);
  const fin = Array(5).fill(0);
  const done = Array(5).fill(false);

  let currentTime = 0;
  let completed = 0;

  while (completed < 5) {
    // Find all arrived, not-done processes
    let bestIdx = -1;
    let bestDuration = Infinity;

    for (let i = 0; i < 5; i++) {
      if (!done[i] && llegadas[i] <= currentTime) {
        if (duraciones[i] < bestDuration || (duraciones[i] === bestDuration && llegadas[i] < llegadas[bestIdx])) {
          bestDuration = duraciones[i];
          bestIdx = i;
        }
      }
    }

    if (bestIdx === -1) {
      // No process available; advance time to next arrival
      let nextArrival = Infinity;
      for (let i = 0; i < 5; i++) {
        if (!done[i] && llegadas[i] < nextArrival) {
          nextArrival = llegadas[i];
        }
      }
      currentTime = nextArrival;
    } else {
      espera[bestIdx] = currentTime - llegadas[bestIdx];
      fin[bestIdx] = currentTime + duraciones[bestIdx];
      retorno[bestIdx] = fin[bestIdx] - llegadas[bestIdx];
      currentTime = fin[bestIdx];
      done[bestIdx] = true;
      completed++;
    }
  }

  writeResults("proceso", espera, retorno, fin);
}

// SRT (Shortest Remaining Time) — preemptive SJF
function srt() {
  const { llegadas, duraciones } = getTableData("proceso");

  const remaining = [...duraciones];
  const espera = Array(5).fill(0);
  const retorno = Array(5).fill(0);
  const fin = Array(5).fill(0);
  const done = Array(5).fill(false);

  let currentTime = 0;
  let completed = 0;

  // Find the maximum possible time to prevent infinite loop
  const maxTime = Math.max(...llegadas) + duraciones.reduce((a, b) => a + b, 0) + 1;

  while (completed < 5 && currentTime < maxTime) {
    let bestIdx = -1;
    let bestRemaining = Infinity;

    for (let i = 0; i < 5; i++) {
      if (!done[i] && llegadas[i] <= currentTime && remaining[i] > 0) {
        if (remaining[i] < bestRemaining || (remaining[i] === bestRemaining && llegadas[i] < llegadas[bestIdx])) {
          bestRemaining = remaining[i];
          bestIdx = i;
        }
      }
    }

    if (bestIdx === -1) {
      currentTime++;
    } else {
      remaining[bestIdx]--;
      currentTime++;
      if (remaining[bestIdx] === 0) {
        done[bestIdx] = true;
        fin[bestIdx] = currentTime;
        retorno[bestIdx] = fin[bestIdx] - llegadas[bestIdx];
        espera[bestIdx] = retorno[bestIdx] - duraciones[bestIdx];
        completed++;
      }
    }
  }

  writeResults("proceso", espera, retorno, fin);
}

// Round Robin (quantum = 2)
function robin() {
  const { llegadas, duraciones } = getTableData("proceso");
  const quantum = 2;

  const remaining = [...duraciones];
  const espera = Array(5).fill(0);
  const retorno = Array(5).fill(0);
  const fin = Array(5).fill(0);
  const done = Array(5).fill(false);
  const inQueue = Array(5).fill(false);

  // Sort processes by arrival for initial queue building
  const indices = [0, 1, 2, 3, 4];
  indices.sort((a, b) => llegadas[a] - llegadas[b] || a - b);

  let currentTime = 0;
  let completed = 0;
  const queue = [];

  // Add initially arrived processes
  for (const i of indices) {
    if (llegadas[i] <= currentTime) {
      queue.push(i);
      inQueue[i] = true;
    }
  }

  const maxTime = Math.max(...llegadas) + duraciones.reduce((a, b) => a + b, 0) + 1;

  while (completed < 5 && currentTime < maxTime) {
    if (queue.length === 0) {
      currentTime++;
      // Check if new processes arrive
      for (const i of indices) {
        if (!done[i] && !inQueue[i] && llegadas[i] <= currentTime) {
          queue.push(i);
          inQueue[i] = true;
        }
      }
      continue;
    }

    const proc = queue.shift();
    const execTime = Math.min(quantum, remaining[proc]);
    currentTime += execTime;
    remaining[proc] -= execTime;

    // Add newly arrived processes during this execution (before re-queuing current)
    for (const i of indices) {
      if (!done[i] && !inQueue[i] && i !== proc && llegadas[i] <= currentTime) {
        queue.push(i);
        inQueue[i] = true;
      }
    }

    if (remaining[proc] === 0) {
      done[proc] = true;
      fin[proc] = currentTime;
      retorno[proc] = fin[proc] - llegadas[proc];
      espera[proc] = retorno[proc] - duraciones[proc];
      completed++;
    } else {
      queue.push(proc);
    }
  }

  writeResults("proceso", espera, retorno, fin);
}

// ====================================
// Memory Management Algorithms
// (Static = fixed partitions, Dynamic = variable partitions)
// Both use same logic: schedule processes into memory
// with partitions of fixed sizes for static, variable for dynamic
// ====================================

// For memory management: we simulate scheduling processes that need
// a certain amount of memory (tamaño). The algorithms determine
// which memory partition to assign based on fit strategy.
// We treat them as scheduling with arrival + size/duration:
//   - Processes arrive at t=llegada
//   - Each process runs for tamaño time units
//   - The fit strategy determines scheduling order among ready processes

function memoryScheduleEstatica(strategy) {
  const { llegadas, duraciones, tamaños } = getMemoriaData("estatica");
  const espera = Array(5).fill(0);
  const retorno = Array(5).fill(0);
  const fin = Array(5).fill(0);
  
  const partitions = [
    { id: 0, size: 2, process: null, timeRemaining: 0 },
    { id: 1, size: 4, process: null, timeRemaining: 0 },
    { id: 2, size: 6, process: null, timeRemaining: 0 }
  ];
  
  let currentTime = 0;
  let completed = 0;
  let lastAllocatedIdx = 0; // For Next Fit
  
  const started = Array(5).fill(false);
  
  while (completed < 5) {
    // Free partitions whose processes are done
    for (let p of partitions) {
      if (p.process !== null) {
        if (fin[p.process] <= currentTime) {
          p.process = null;
        }
      }
    }
    
    // Get arrived, not-started processes
    const ready = [];
    for (let i = 0; i < 5; i++) {
      if (!started[i] && llegadas[i] <= currentTime) {
        ready.push(i);
      }
    }
    
    // Sort ready processes by arrival time (FIFO for memory queue)
    ready.sort((a, b) => llegadas[a] - llegadas[b] || a - b);
    
    for (let proc of ready) {
      const sizeReq = tamaños[proc];
      let chosenPartitionIdx = -1;
      
      const availablePartitions = partitions.map((p, index) => ({...p, index}))
        .filter(p => p.process === null && p.size >= sizeReq);
        
      if (availablePartitions.length > 0) {
        if (strategy === "first") {
          chosenPartitionIdx = availablePartitions[0].index;
        } else if (strategy === "best") {
          availablePartitions.sort((a, b) => a.size - b.size || a.index - b.index);
          chosenPartitionIdx = availablePartitions[0].index;
        } else if (strategy === "worst") {
          availablePartitions.sort((a, b) => b.size - a.size || a.index - b.index);
          chosenPartitionIdx = availablePartitions[0].index;
        } else if (strategy === "next") {
          let found = -1;
          for (let i = 0; i < partitions.length; i++) {
            const idx = (lastAllocatedIdx + i) % partitions.length;
            if (partitions[idx].process === null && partitions[idx].size >= sizeReq) {
              found = idx;
              break;
            }
          }
          chosenPartitionIdx = found;
        }
      }
      
      if (chosenPartitionIdx !== -1) {
        partitions[chosenPartitionIdx].process = proc;
        started[proc] = true;
        espera[proc] = currentTime - llegadas[proc];
        fin[proc] = currentTime + duraciones[proc];
        retorno[proc] = fin[proc] - llegadas[proc];
        
        lastAllocatedIdx = chosenPartitionIdx;
        completed++;
      }
    }
    
    let nextTime = Infinity;
    for (let p of partitions) {
      if (p.process !== null && fin[p.process] > currentTime && fin[p.process] < nextTime) {
        nextTime = fin[p.process];
      }
    }
    for (let i = 0; i < 5; i++) {
      if (!started[i] && llegadas[i] > currentTime && llegadas[i] < nextTime) {
        nextTime = llegadas[i];
      }
    }
    
    if (nextTime !== Infinity) {
      currentTime = nextTime;
    } else if (completed < 5) {
      currentTime++;
    }
  }
  
  writeResults("estatica", espera, retorno, fin);
}

function memoryScheduleDinamica(strategy) {
  const { llegadas, duraciones, tamaños } = getMemoriaData("dinamica");
  const espera = Array(5).fill(0);
  const retorno = Array(5).fill(0);
  const fin = Array(5).fill(0);
  
  let blocks = [{ start: 0, size: 7, process: null }];
  
  let currentTime = 0;
  let completed = 0;
  let lastAllocatedStart = 0;
  
  const started = Array(5).fill(false);
  
  function mergeFreeBlocks() {
    for (let i = 0; i < blocks.length - 1; i++) {
      if (blocks[i].process === null && blocks[i+1].process === null) {
        blocks[i].size += blocks[i+1].size;
        blocks.splice(i+1, 1);
        i--;
      }
    }
  }

  while (completed < 5) {
    let changed = false;
    for (let b of blocks) {
      if (b.process !== null) {
        if (fin[b.process] <= currentTime) {
          b.process = null;
          changed = true;
        }
      }
    }
    if (changed) mergeFreeBlocks();
    
    const ready = [];
    for (let i = 0; i < 5; i++) {
      if (!started[i] && llegadas[i] <= currentTime) {
        ready.push(i);
      }
    }
    
    ready.sort((a, b) => llegadas[a] - llegadas[b] || a - b);
    
    for (let proc of ready) {
      const sizeReq = tamaños[proc];
      let chosenBlockIdx = -1;
      
      const freeBlocks = blocks.map((b, index) => ({...b, index}))
        .filter(b => b.process === null && b.size >= sizeReq);
        
      if (freeBlocks.length > 0) {
        if (strategy === "first") {
          chosenBlockIdx = freeBlocks[0].index;
        } else if (strategy === "best") {
          freeBlocks.sort((a, b) => a.size - b.size || a.start - b.start);
          chosenBlockIdx = freeBlocks[0].index;
        } else if (strategy === "worst") {
          freeBlocks.sort((a, b) => b.size - a.size || a.start - b.start);
          chosenBlockIdx = freeBlocks[0].index;
        } else if (strategy === "next") {
          let found = -1;
          for (let fb of blocks) {
            if (fb.process === null && fb.size >= sizeReq && fb.start >= lastAllocatedStart) {
              found = blocks.indexOf(fb);
              break;
            }
          }
          if (found === -1) {
            for (let fb of blocks) {
              if (fb.process === null && fb.size >= sizeReq) {
                found = blocks.indexOf(fb);
                break;
              }
            }
          }
          chosenBlockIdx = found;
        }
      }
      
      if (chosenBlockIdx !== -1) {
        const block = blocks[chosenBlockIdx];
        
        if (block.size > sizeReq) {
          blocks.splice(chosenBlockIdx, 1, 
            { start: block.start, size: sizeReq, process: proc },
            { start: block.start + sizeReq, size: block.size - sizeReq, process: null }
          );
          lastAllocatedStart = block.start;
        } else {
          block.process = proc;
          lastAllocatedStart = block.start;
        }
        
        started[proc] = true;
        espera[proc] = currentTime - llegadas[proc];
        fin[proc] = currentTime + duraciones[proc];
        retorno[proc] = fin[proc] - llegadas[proc];
        
        completed++;
      }
    }
    
    let nextTime = Infinity;
    for (let b of blocks) {
      if (b.process !== null && fin[b.process] > currentTime && fin[b.process] < nextTime) {
        nextTime = fin[b.process];
      }
    }
    for (let i = 0; i < 5; i++) {
      if (!started[i] && llegadas[i] > currentTime && llegadas[i] < nextTime) {
        nextTime = llegadas[i];
      }
    }
    
    if (nextTime !== Infinity) {
      currentTime = nextTime;
    } else if (completed < 5) {
      currentTime++;
    }
  }
  
  writeResults("dinamica", espera, retorno, fin);
}

function best_fit(opcion) {
  if (opcion === "estatica") memoryScheduleEstatica("best");
  else memoryScheduleDinamica("best");
}
function worst_fit(opcion) {
  if (opcion === "estatica") memoryScheduleEstatica("worst");
  else memoryScheduleDinamica("worst");
}
function next_fit(opcion) {
  if (opcion === "estatica") memoryScheduleEstatica("next");
  else memoryScheduleDinamica("next");
}
function first_fit(opcion) {
  if (opcion === "estatica") memoryScheduleEstatica("first");
  else memoryScheduleDinamica("first");
}

// ====================================
// Page Replacement Algorithms
// ====================================

// LRU (Least Recently Used)
function lru() {
  const refs = getMarcos();
  const numFrames = 4;
  const frames = [];
  const ans = [];

  for (let i = 0; i < refs.length; i++) {
    const page = refs[i];
    const idx = frames.indexOf(page);
    if (idx !== -1) {
      // Page hit — move to end (most recently used)
      frames.splice(idx, 1);
      frames.push(page);
    } else {
      // Page fault
      if (frames.length >= numFrames) {
        frames.shift(); // Remove least recently used (front)
      }
      frames.push(page);
    }
    const snapshot = [];
    for (let f = 0; f < numFrames; f++) {
      snapshot.push(f < frames.length ? frames[f] : null);
    }
    ans.push(snapshot);
  }
  rellenaMarco(ans);
}

// LFU (Least Frequently Used)
function lfu() {
  const refs = getMarcos();
  const numFrames = 4;
  const frames = [];
  const freq = {};  // page -> frequency count
  const ans = [];

  for (let i = 0; i < refs.length; i++) {
    const page = refs[i];

    if (frames.includes(page)) {
      // Page hit — increase frequency
      freq[page] = (freq[page] || 0) + 1;
    } else {
      // Page fault
      if (frames.length >= numFrames) {
        // Find least frequently used page
        let minFreq = Infinity;
        let victimIdx = 0;
        for (let f = 0; f < frames.length; f++) {
          const pFreq = freq[frames[f]] || 0;
          if (pFreq < minFreq) {
            minFreq = pFreq;
            victimIdx = f;
          }
        }
        delete freq[frames[victimIdx]];
        frames.splice(victimIdx, 1);
      }
      frames.push(page);
      freq[page] = 1;
    }

    const snapshot = [];
    for (let f = 0; f < numFrames; f++) {
      snapshot.push(f < frames.length ? frames[f] : null);
    }
    ans.push(snapshot);
  }
  rellenaMarco(ans);
}

// Optimal (replace the page that won't be used for the longest time)
function optimal() {
  const refs = getMarcos();
  const numFrames = 4;
  const frames = [];
  const ans = [];

  for (let i = 0; i < refs.length; i++) {
    const page = refs[i];

    if (!frames.includes(page)) {
      // Page fault
      if (frames.length >= numFrames) {
        // Find the page whose next use is farthest in the future
        let farthest = -1;
        let victimIdx = 0;
        for (let f = 0; f < frames.length; f++) {
          let nextUse = refs.indexOf(frames[f], i + 1);
          if (nextUse === -1) {
            // This page is never used again — best victim
            victimIdx = f;
            break;
          }
          if (nextUse > farthest) {
            farthest = nextUse;
            victimIdx = f;
          }
        }
        frames.splice(victimIdx, 1);
      }
      frames.push(page);
    }

    const snapshot = [];
    for (let f = 0; f < numFrames; f++) {
      snapshot.push(f < frames.length ? frames[f] : null);
    }
    ans.push(snapshot);
  }
  rellenaMarco(ans);
}

// ====================================
// Fill page frame results into table
// ====================================

function rellenaMarco(ans) {
  for (let i = 0; i < 15; i++) {
    document.querySelector('.marco1[data-index="' + i + '"]').firstElementChild.value = ans[i][0] != null ? ans[i][0] : '';
    document.querySelector('.marco2[data-index="' + i + '"]').firstElementChild.value = ans[i][1] != null ? ans[i][1] : '';
    document.querySelector('.marco3[data-index="' + i + '"]').firstElementChild.value = ans[i][2] != null ? ans[i][2] : '';
    document.querySelector('.marco4[data-index="' + i + '"]').firstElementChild.value = ans[i][3] != null ? ans[i][3] : '';
  }
}

// ====================================
// Resolver — dispatches to correct algorithm
// ====================================

function resolver(proceso) {
  if (proceso === "gestion") {
    const opcion = document.getElementById("opcion_proceso");
    if (opcion.value === "fifo") {
      return fifo("proceso");
    } else if (opcion.value === "srj") {
      return srj();
    } else if (opcion.value === "srt") {
      return srt();
    } else if (opcion.value === "robin") {
      return robin();
    }
  } else if (proceso === "dinamica") {
    const opcion = document.getElementById("opcion_dinamica");
    if (opcion.value === "best") {
      return best_fit("dinamica");
    } else if (opcion.value === "worst") {
      return worst_fit("dinamica");
    } else if (opcion.value === "next") {
      return next_fit("dinamica");
    } else if (opcion.value === "first") {
      return first_fit("dinamica");
    }
  } else if (proceso === "estatica") {
    const opcion = document.getElementById("opcion_estatica");
    if (opcion.value === "best") {
      return best_fit("estatica");
    } else if (opcion.value === "worst") {
      return worst_fit("estatica");
    } else if (opcion.value === "next") {
      return next_fit("estatica");
    } else if (opcion.value === "first") {
      return first_fit("estatica");
    }
  } else if (proceso === "marcos") {
    const opcion = document.getElementById("opcion_marcos");
    if (opcion.value === "fifo") {
      fifo("marcos");
    } else if (opcion.value === "lfu") {
      lfu();
    } else if (opcion.value === "optimal") {
      optimal();
    } else if (opcion.value === "lru") {
      lru();
    }
  }
}

// ====================================
// Initialization & Event Listeners
// ====================================

document.addEventListener('DOMContentLoaded', function () {
  make_tabla("proceso");
  make_tabla_memoria("dinamica");
  make_tabla_memoria("estatica");
  make_marcos();
});

// Resolver buttons
document.querySelector("#resolver_proceso").addEventListener("click", () => {
  resolver("gestion");
});
document.querySelector("#resolver_estatica").addEventListener("click", () => {
  resolver("estatica");
});
document.querySelector("#resolver_dinamica").addEventListener("click", () => {
  resolver("dinamica");
});
document.querySelector("#resolver_marcos").addEventListener("click", () => {
  resolver("marcos");
});

// Nuevo (new random data) buttons
document.querySelector("#nuevo_proceso").addEventListener("click", () => {
  make_tabla("proceso");
});
document.querySelector("#nuevo_estetica").addEventListener("click", () => {
  make_tabla_memoria("estatica");
});
document.querySelector("#nuevo_dinamica").addEventListener("click", () => {
  make_tabla_memoria("dinamica");
});
document.querySelector("#nuevo_marcos").addEventListener("click", () => {
  make_marcos();
});
