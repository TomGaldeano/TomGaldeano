
// ============================================================
//  HEX KINGDOMS  –  hexKingdoms.js
//  Turn-based hex strategy. Single troop type (stacks).
//  Cities generate troops for their owner every turn.
// ============================================================
(function () {
  "use strict";

  // ── Config ────────────────────────────────────────────────
  const COLS        = 20;
  const ROWS        = 14;
  const MOVE_RANGE  = 3;
  const CITY_GROW   = 3;   // +troops on occupied city per turn
  const CITY_SPAWN  = 3;   // troops spawned on empty owned city
  const MAX_STACK   = 20;
  const BORDER      = 12;  // decorative border px

  // Terrain IDs
  const T = { PLAIN: 0, MOUNTAIN: 1, WATER: 2, CITY: 3 };
  const COST = { [T.PLAIN]:1, [T.WATER]:99, [T.CITY]:1 };

  // 4 AI+player factions; 4 = neutral (cities only, never acts)
  const NEUTRAL = 4;
  const FACTIONS = [
    { name:"North", color:"#4a90d9", dark:"#1e4f8a" },
    { name:"East",  color:"#c0392b", dark:"#7b1a14" },
    { name:"South", color:"#27ae60", dark:"#145c32" },
    { name:"West",  color:"#e67e22", dark:"#8c4a0e" },
  ];
  // Where each faction's capital sits (corner positions)
  const HOME = [
    { r:1,        c:1        },   // North
    { r:1,        c:COLS-2   },   // East
    { r:ROWS-2,   c:1        },   // South
    { r:ROWS-2,   c:COLS-2   },   // West
  ];

  const TSTYLE = {
    [T.PLAIN]:    { base:"#7ab648", edge:"#5a9030" },
    [T.WATER]:    { base:"#4a9eda", edge:"#2a6eaa" },
    [T.CITY]:     { base:"#f0dea0", edge:"#b09040", icon:"🏛" },
  };

  // ── State ─────────────────────────────────────────────────
  let canvas, ctx;
  let grid   = [];   // [r][c] = { terrain, owner, stack }
  let stacks = [];   // { id, faction, row, col, size, moved, attacked }
  let nid    = 0;

  let playerFaction = -1;  // -1 = no game started
  let turn          = 0;   // index 0-3, whose turn it is
  let phase         = "pick";  // "pick" | "play" | "over"
  let overMsg       = "";
  let overColor     = "";

  let selected   = null;
  let reachable  = [];
  let attackable = [];
  let hoverCell  = null;

  let aiTimer = null;  // single pending AI timeout

  let statusEl, endTurnBtn;

  // ── Boot ──────────────────────────────────────────────────
  window.addEventListener("DOMContentLoaded", () => {
    canvas     = document.getElementById("hexCanvas");
    ctx        = canvas.getContext("2d");
    statusEl   = document.getElementById("statusText");
    endTurnBtn = document.getElementById("endTurnBtn");

    resizeCanvas();
    window.addEventListener("resize", () => { resizeCanvas(); render(); });

    buildGrid();
    render();

    document.querySelectorAll(".pickFaction").forEach(btn =>
      btn.addEventListener("click", () => startGame(+btn.dataset.faction))
    );
    canvas.addEventListener("click",     onCanvasClick);
    canvas.addEventListener("mousemove", onCanvasHover);
    if (endTurnBtn) endTurnBtn.addEventListener("click", playerEndTurn);

    // Restart hook for your HTML button
    const resetBtn = document.getElementById("resetBtn");
    resetBtn.addEventListener("click", reset);
  });

  // ── Canvas size: grid fills width exactly, height derived ─
  function resizeCanvas() {
    const maxW   = canvas.parentElement.clientWidth || 1200;
    canvas.width = Math.min(1200, maxW);

    // s = hex radius so that COLS hexes (plus half-hex offset) fill usable width
    const usable = canvas.width - BORDER * 2;
    const s      = usable / (Math.sqrt(3) * (COLS + 0.5));
    const h      = 2 * s;
    canvas.height = Math.ceil(ROWS * h * 0.75 + h * 0.25 + BORDER * 2);
  }

  // ── Grid ──────────────────────────────────────────────────
  function buildGrid() {
    grid = [];
    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      for (let c = 0; c < COLS; c++)
        grid[r][c] = { terrain: baseTerrain(r, c), owner: -1, stack: null };
    }
    // Place faction capitals
    HOME.forEach((h, i) => {
      grid[h.r][h.c].terrain = T.CITY;
      grid[h.r][h.c].owner   = i;
    });
    // Scatter 16 neutral cities
    let placed = 0, tries = 0;
    while (placed < 16 && tries < 800) {
      tries++;
      const r = 2 + Math.floor(Math.random() * (ROWS - 4));
      const c = 2 + Math.floor(Math.random() * (COLS - 4));
      const cell = grid[r][c];
      if (cell.terrain === T.WATER || cell.terrain === T.CITY) continue;
      if (HOME.some(h => Math.abs(r-h.r)<3 && Math.abs(c-h.c)<3)) continue;
      cell.terrain = T.CITY;
      cell.owner   = NEUTRAL;
      placed++;
    }
  }

  function baseTerrain(r, c) {
    // Clear zone around each capital
    if (HOME.some(h => Math.abs(r-h.r)<=1 && Math.abs(c-h.c)<=1)) return T.PLAIN;
    
    // Use perlin-like noise for clustered water patches
    // Check if any neighbor (within distance 1) has been marked as water source
    let nearWaterSource = false;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          // Use a seeded hash-like function for consistency
          const hash = ((nr * 73856093) ^ (nc * 19349663)) % 100;
          if (hash < 8) { // 8% water source density
            const dist = Math.abs(dr) + Math.abs(dc);
            if (Math.random() < (1 - dist * 0.18)) {
              nearWaterSource = true;
              break;
            }
          }
        }
      }
      if (nearWaterSource) break;
    }
    
    if (nearWaterSource && Math.random() < 0.65) return T.WATER;
    return T.PLAIN;
  }

  // ── Start / Reset ─────────────────────────────────────────
  function reset() {
    if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; }
    buildGrid();
    stacks = []; nid = 0;
    playerFaction = -1;
    turn  = 0;
    phase = "pick";
    selected = null; reachable = []; attackable = [];
    if (endTurnBtn) endTurnBtn.classList.add("d-none");
    setStatus("Choose your kingdom to begin.");
    render();
  }

  function startGame(fi) {
    if (aiTimer) { clearTimeout(aiTimer); aiTimer = null; }
    buildGrid();
    stacks = []; nid = 0;
    playerFaction = fi;
    turn  = 0;
    phase = "play";
    selected = null; reachable = []; attackable = [];

    // Each faction starts with a stack of 4 on their capital
    HOME.forEach((h, i) => makeStack(i, h.r, h.c, 4));

    if (endTurnBtn) endTurnBtn.classList.remove("d-none");
    updateStatus();
    render();

    // If turn 0 happens to be AI, start the chain
    if (turn !== playerFaction) scheduleAI();
  }

  function makeStack(faction, row, col, size) {
    const s = {
      id: nid++, faction, row, col,
      size: Math.min(size, MAX_STACK),
      moved: false, attacked: false,
    };
    stacks.push(s);
    grid[row][col].stack = s;
    // Claim the cell for this faction (neutral or unclaimed)
    if (grid[row][col].owner === -1 || grid[row][col].owner === NEUTRAL)
      grid[row][col].owner = faction;
    return s;
  }

  function killStack(s) {
    grid[s.row][s.col].stack = null;
    stacks = stacks.filter(x => x.id !== s.id);
    if (selected && selected.id === s.id) {
      selected = null; reachable = []; attackable = [];
    }
  }

  // ── Hex math ──────────────────────────────────────────────
  function hexS() {
    const usable = canvas.width - BORDER * 2;
    return usable / (Math.sqrt(3) * (COLS + 0.5));
  }

  function hexCenter(row, col) {
    const s  = hexS();
    const w  = Math.sqrt(3) * s;
    const h  = 2 * s;
    const tW = COLS * w + w * 0.5;
    const tH = ROWS * h * 0.75 + h * 0.25;
    const ox = (canvas.width  - tW) / 2;
    const oy = (canvas.height - tH) / 2;
    return {
      x: ox + col * w + (row % 2 === 1 ? w / 2 : 0) + w / 2,
      y: oy + row * h * 0.75 + h / 2,
      s,
    };
  }

  function hexCorners(cx, cy, s) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = Math.PI / 180 * (60 * i - 30);
      pts.push([cx + s * Math.cos(a), cy + s * Math.sin(a)]);
    }
    return pts;
  }

  function hexNeighbours(r, c) {
    const dirs = (r % 2 === 0)
      ? [[-1,-1],[-1,0],[0,1],[1,0],[1,-1],[0,-1]]
      : [[-1,0],[-1,1],[0,1],[1,1],[1,0],[0,-1]];
    return dirs.map(([dr,dc]) => [r+dr, c+dc])
               .filter(([nr,nc]) => nr>=0&&nr<ROWS&&nc>=0&&nc<COLS);
  }

  function pixelToHex(px, py) {
    let best = null, bestD = Infinity;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const {x,y} = hexCenter(r, c);
        const d = (px-x)**2 + (py-y)**2;
        if (d < bestD) { bestD = d; best = [r,c]; }
      }
    return best;
  }

  // ── Pathfinding ───────────────────────────────────────────
  function getReachable(unit) {
    const vis = { [`${unit.row},${unit.col}`]: true };
    const q   = [{ r:unit.row, c:unit.col, mp:MOVE_RANGE }];
    const res = new Set();
    while (q.length) {
      const {r,c,mp} = q.shift();
      for (const [nr,nc] of hexNeighbours(r,c)) {
        const key  = `${nr},${nc}`;
        if (vis[key]) continue;
        const cell = grid[nr][nc];
        const cost = COST[cell.terrain] ?? 99;
        if (cost > mp) continue;
        // Can pass through own stacks, cannot pass through enemy stacks
        if (cell.stack && cell.stack.faction !== unit.faction) continue;
        vis[key] = true;
        // Can land on empty cells or friendly stacks (merge)
        if (!cell.stack || cell.stack.faction === unit.faction) res.add(key);
        q.push({ r:nr, c:nc, mp:mp-cost });
      }
    }
    res.delete(`${unit.row},${unit.col}`);
    return [...res];
  }

  function getAttackable(unit) {
    return hexNeighbours(unit.row, unit.col)
      .filter(([nr,nc]) => {
        const st = grid[nr][nc].stack;
        return st && st.faction !== unit.faction;
      })
      .map(([nr,nc]) => `${nr},${nc}`);
  }

  // ── Combat ────────────────────────────────────────────────
  // Attacker wins if size > defender. Both take losses.
  // Winner advances onto the cell if they destroyed the defender.
  function doCombat(atk, def) {
    // Losses: roughly proportional to enemy size
    const atkLoss = Math.max(1, Math.ceil(def.size * 0.5));
    const defLoss = Math.max(1, Math.ceil(atk.size * 0.7));

    def.size -= defLoss;
    atk.size -= atkLoss;

    atk.attacked = true;
    atk.moved    = true; // attacking uses the move action too

    const defDead = def.size <= 0;
    const atkDead = atk.size <= 0;

    // Capture: attacker destroys defender and still lives
    const captureRow = def.row, captureCol = def.col;
    if (defDead) killStack(def);
    if (atkDead) { killStack(atk); checkGameOver(); return; }

    if (defDead) {
      // Move attacker into captured cell
      grid[atk.row][atk.col].stack = null;
      grid[captureRow][captureCol].stack = atk;
      grid[captureRow][captureCol].owner = atk.faction;
      atk.row = captureRow;
      atk.col = captureCol;
    }

    checkGameOver();
  }

  // ── City income — runs at the END of the given faction's turn ─
  // Every city owned by `faction` either grows the stack on it
  // or spawns a new stack if the city is empty.
  function cityIncome(faction) {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        if (cell.terrain !== T.CITY) continue;
        if (cell.owner !== faction) continue;      // only YOUR cities

        if (cell.stack) {
          // City occupied by own troops — reinforce
          cell.stack.size = Math.min(cell.stack.size + CITY_GROW, MAX_STACK);
        } else {
          // Empty owned city — spawn fresh troops
          makeStack(faction, r, c, CITY_SPAWN);
        }
      }
    }
  }

  // ── Turn management ───────────────────────────────────────
  // Called by End Turn button (player) or internally by AI
  function advanceTurn() {
    selected = null; reachable = []; attackable = [];

    // Move to next faction
    turn = (turn + 1) % FACTIONS.length;

    // Reset action flags for the new faction's stacks
    stacks.filter(s => s.faction === turn).forEach(s => {
      s.moved = false; s.attacked = false;
    });

 

    checkGameOver();
    if (phase !== "play") return;

    updateStatus();
    render();

    if (turn !== playerFaction) scheduleAI();
       // Apply city income for the faction now taking their turn
    cityIncome(turn);
  }

  // Button handler — only works when it's the player's turn
  function playerEndTurn() {
    if (phase !== "play") return;
    if (turn !== playerFaction) return;
    advanceTurn();
  }

  // ── AI ────────────────────────────────────────────────────
  function scheduleAI() {
    if (aiTimer) clearTimeout(aiTimer);
    aiTimer = setTimeout(runAI, 500);
  }

  function runAI() {
    aiTimer = null;
    if (phase !== "play" || turn === playerFaction) return;

    const myStacks = stacks.filter(s => s.faction === turn);

    for (const s of myStacks) {
      if (s.moved && s.attacked) continue;

      // 1. Attack an adjacent enemy if possible
      if (!s.attacked) {
        const enemies = hexNeighbours(s.row, s.col)
          .filter(([r,c]) => grid[r][c].stack && grid[r][c].stack.faction !== s.faction);
        if (enemies.length) {
          // Pick weakest adjacent enemy
          enemies.sort(([r1,c1],[r2,c2]) =>
            grid[r1][c1].stack.size - grid[r2][c2].stack.size
          );
          doCombat(s, grid[enemies[0][0]][enemies[0][1]].stack);
          if (phase !== "play") return; // game ended mid-AI
          continue;
        }
      }

      // 2. Move toward nearest valuable target
      if (!s.moved) {
        const reach  = getReachable(s);
        if (!reach.length) continue;
        const target = nearestTarget(s);
        if (!target) continue;
        const best   = bestMoveToward(reach, target);
        if (!best) continue;

        const [nr, nc] = best;
        const dest     = grid[nr][nc];

        if (dest.stack && dest.stack.faction === s.faction) {
          // Merge with friendly
          dest.stack.size = Math.min(dest.stack.size + s.size, MAX_STACK);
          killStack(s);
        } else {
          grid[s.row][s.col].stack = null;
          dest.stack = s;
          dest.owner = s.faction;
          s.row = nr; s.col = nc;
        }
        s.moved = true;

        // 3. Attack after moving
        if (!s.attacked) {
          const adj = hexNeighbours(s.row, s.col)
            .filter(([r,c]) => grid[r][c].stack && grid[r][c].stack.faction !== s.faction);
          if (adj.length) {
            adj.sort(([r1,c1],[r2,c2]) =>
              grid[r1][c1].stack.size - grid[r2][c2].stack.size
            );
            doCombat(s, grid[adj[0][0]][adj[0][1]].stack);
            if (phase !== "play") return;
          }
        }
      }
    }

    render();
    // Small delay so the player can see AI moves before turn advances
    aiTimer = setTimeout(() => {
      aiTimer = null;
      if (phase === "play") advanceTurn();
    }, 400);
  }

  function nearestTarget(s) {
    let best = null, bestD = Infinity;

    // Enemy stacks
    for (const e of stacks) {
      if (e.faction === s.faction) continue;
      const d = hexDist(s.row, s.col, e.row, e.col);
      if (d < bestD) { bestD = d; best = { row:e.row, col:e.col }; }
    }
    // Cities not owned by this faction
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const cell = grid[r][c];
        if (cell.terrain === T.CITY && cell.owner !== s.faction) {
          const d = hexDist(s.row, s.col, r, c);
          if (d < bestD) { bestD = d; best = { row:r, col:c }; }
        }
      }
    return best;
  }

  function bestMoveToward(reach, target) {
    let best = null, bestD = Infinity;
    for (const key of reach) {
      const [r,c] = key.split(",").map(Number);
      const d = hexDist(r, c, target.row, target.col);
      if (d < bestD) { bestD = d; best = [r,c]; }
    }
    return best;
  }

  function hexDist(r1, c1, r2, c2) {
    // Rough Manhattan on offset grid
    return Math.abs(r1-r2) + Math.abs(c1-c2);
  }

  // ── Game-over check ───────────────────────────────────────
  function checkGameOver() {
    if (phase !== "play") return;

    const alive = new Set(stacks.map(s => s.faction));

    // Player is eliminated
    if (!alive.has(playerFaction)) {
      setOver("💀 You have been defeated!", "#5a0808");
      return;
    }

    // Only one faction remains
    if (alive.size === 1) {
      const winner = [...alive][0];
      if (winner === playerFaction)
        setOver("🏆 Victory! Your kingdom reigns supreme!", "#0f4a1e");
      else
        setOver(`Defeated — ${FACTIONS[winner].name} wins!`, "#5a0808");
      return;
    }
  }

  function setOver(msg, color) {
    phase     = "over";
    overMsg   = msg;
    overColor = color;
    if (endTurnBtn) endTurnBtn.classList.add("d-none");
    render(); // will draw overlay
  }

  // ── Player input ──────────────────────────────────────────
  function onCanvasClick(e) {
    if (phase !== "play" || turn !== playerFaction) return;

    const rect = canvas.getBoundingClientRect();
    const px   = (e.clientX - rect.left) * (canvas.width  / rect.width);
    const py   = (e.clientY - rect.top)  * (canvas.height / rect.height);
    const [r, c] = pixelToHex(px, py);
    const key    = `${r},${c}`;
    const cell   = grid[r][c];

    if (selected) {
      // --- Attack ---
      if (!selected.attacked && attackable.includes(key) && cell.stack) {
        doCombat(selected, cell.stack);
        clearSelection();
        render();
        return;
      }

      // --- Move / Merge ---
      if (!selected.moved && reachable.includes(key)) {
        if (cell.stack && cell.stack.faction === playerFaction) {
          // Merge
          cell.stack.size = Math.min(cell.stack.size + selected.size, MAX_STACK);
          killStack(selected);
          selected = cell.stack;
        } else {
          grid[selected.row][selected.col].stack = null;
          cell.stack = selected;
          cell.owner = playerFaction;
          selected.row = r; selected.col = c;
        }
        selected.moved = true;
        reachable  = [];
        attackable = selected.attacked ? [] : getAttackable(selected);
        const canAtk = attackable.length > 0;
        updateStatus(`Moved. ${canAtk ? "Click a red hex to attack." : "No adjacent enemies."}`);
        render();
        return;
      }

      // --- Clicked elsewhere: deselect ---
      clearSelection();
    }

    // --- Select own stack ---
    if (cell.stack && cell.stack.faction === playerFaction) {
      selected   = cell.stack;
      reachable  = selected.moved    ? [] : getReachable(selected);
      attackable = selected.attacked ? [] : getAttackable(selected);
      const opts = [];
      if (!selected.moved)    opts.push("move");
      if (!selected.attacked) opts.push("attack");
      updateStatus(
        `Stack of <strong>${selected.size}</strong> selected. ` +
        (opts.length ? `Actions: ${opts.join(", ")}.` : "All actions used.")
      );
    } else {
      clearSelection();
      updateStatus();
    }
    render();
  }

  function clearSelection() {
    selected = null; reachable = []; attackable = [];
  }

  function onCanvasHover(e) {
    const rect = canvas.getBoundingClientRect();
    const px   = (e.clientX - rect.left) * (canvas.width  / rect.width);
    const py   = (e.clientY - rect.top)  * (canvas.height / rect.height);
    const [r,c] = pixelToHex(px, py);
    if (!hoverCell || hoverCell[0] !== r || hoverCell[1] !== c) {
      hoverCell = [r, c];
      render();
    }
  }

  // ── Render ────────────────────────────────────────────────
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBorder();
    drawHexes();
    drawTerritoryEdges();
    drawStacks();
    if (phase === "over") drawGameOverlay();
  }

  // Dark frame + gold inner line
  function drawBorder() {
    ctx.save();
    ctx.fillStyle = "#1a1200";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const p = BORDER;
    ctx.strokeStyle = "#c8a040";
    ctx.lineWidth   = 2.5;
    ctx.shadowColor = "rgba(200,160,60,0.5)";
    ctx.shadowBlur  = 6;
    ctx.strokeRect(p, p, canvas.width - p*2, canvas.height - p*2);
    ctx.shadowBlur  = 0;
    ctx.strokeStyle = "rgba(255,230,130,0.18)";
    ctx.lineWidth   = 1;
    ctx.strokeRect(p+4, p+4, canvas.width - p*2 - 8, canvas.height - p*2 - 8);
    ctx.restore();
  }

  function drawHexes() {
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const cell    = grid[r][c];
        const {x,y,s} = hexCenter(r, c);
        const corners = hexCorners(x, y, s);
        const key     = `${r},${c}`;

        const ts     = TSTYLE[cell.terrain];
        let fill     = ts.base;
        let stroke   = ts.edge;
        let lw       = 0.8;

        // Faction tint on owned land
        if (cell.owner >= 0 && cell.owner < FACTIONS.length && cell.terrain !== T.WATER)
          fill = blendColor(fill, FACTIONS[cell.owner].color, 0.28);

        // Interaction highlights
        if (reachable.includes(key))   { fill = blendColor(fill,"#ffe066",0.50); stroke="#d4aa00"; lw=1.8; }
        if (attackable.includes(key))  { fill = blendColor(fill,"#ff3333",0.55); stroke="#bb0000"; lw=2;   }
        if (selected && selected.row===r && selected.col===c)
                                        { fill = blendColor(fill,"#ffffff",0.30); stroke="#ffffff"; lw=2.5; }
        if (hoverCell && hoverCell[0]===r && hoverCell[1]===c)
                                          fill = blendColor(fill,"#ffffff",0.08);

        ctx.beginPath();
        corners.forEach(([hx,hy],i) => i===0 ? ctx.moveTo(hx,hy) : ctx.lineTo(hx,hy));
        ctx.closePath();
        ctx.fillStyle   = fill;   ctx.fill();
        ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke();

        // Terrain icon (only when no stack on cell)
        const icon = ts.icon;
        if (icon && s > 12 && !cell.stack) {
          ctx.font         = `${Math.round(s * 0.58)}px serif`;
          ctx.textAlign    = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(icon, x, y);
        }
      }
    }
  }

  // Thick coloured edges along faction borders
  function drawTerritoryEdges() {
    const done = new Set();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const ownerA = grid[r][c].owner;
        if (ownerA < 0 || ownerA >= FACTIONS.length) continue;

        const {x, y, s} = hexCenter(r, c);
        const corn      = hexCorners(x, y, s);
        const nbrs      = hexNeighbours(r, c);

        nbrs.forEach(([nr,nc], ni) => {
          const ownerB = grid[nr][nc].owner;
          if (ownerB === ownerA) return;
          const key = `${r},${c},${nr},${nc}`;
          if (done.has(key)) return;
          done.add(key);
          done.add(`${nr},${nc},${r},${c}`);

          const p1 = corn[ni], p2 = corn[(ni+1)%6];
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.strokeStyle  = FACTIONS[ownerA].color;
          ctx.lineWidth    = 2.5;
          ctx.globalAlpha  = 0.9;
          ctx.stroke();
          ctx.globalAlpha  = 1;
        });
      }
    }
  }

  function drawStacks() {
    for (const u of stacks) {
      const {x, y, s} = hexCenter(u.row, u.col);
      const rad  = s * 0.50;
      const f    = FACTIONS[u.faction];
      const done = u.moved && u.attacked;
      const sel  = selected && selected.id === u.id;

      // Drop shadow
      ctx.beginPath();
      ctx.arc(x+1.5, y+2, rad, 0, Math.PI*2);
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fill();

      // Body
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI*2);
      if (done) {
        ctx.fillStyle = desaturate(f.color);
      } else {
        const g = ctx.createRadialGradient(x-rad*0.3, y-rad*0.3, rad*0.05, x, y, rad);
        g.addColorStop(0, lighten(f.color, 0.45));
        g.addColorStop(1, f.dark);
        ctx.fillStyle = g;
      }
      ctx.fill();
      ctx.strokeStyle = sel ? "#ffffff" : f.dark;
      ctx.lineWidth   = sel ? 2.5 : 1.2;
      ctx.stroke();

      // Troop count
      const fs = Math.max(8, Math.round(s * 0.46));
      ctx.font         = `bold ${fs}px sans-serif`;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle    = done ? "rgba(255,255,255,0.45)" : "#ffffff";
      ctx.fillText(String(u.size), x, y);
    }
  }

  function drawGameOverlay() {
    // Dim the board
    ctx.fillStyle = "rgba(0,0,0,0.60)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Centred box
    const bw = Math.min(540, canvas.width * 0.80);
    const bh = 104;
    const bx = (canvas.width  - bw) / 2;
    const by = (canvas.height - bh) / 2;

    ctx.fillStyle = overColor || "#1a3a1a";
    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    const fs = Math.max(15, Math.round(canvas.width * 0.026));
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle    = "#ffffff";
    ctx.font         = `bold ${fs}px sans-serif`;
    ctx.fillText(overMsg, canvas.width/2, by + bh*0.38);
    ctx.font         = `${Math.round(fs*0.68)}px sans-serif`;
    ctx.fillStyle    = "rgba(255,255,255,0.70)";
    ctx.fillText("Press Restart to play again", canvas.width/2, by + bh*0.72);
  }

  // ── Colour helpers ────────────────────────────────────────
  function hexToRgb(h) {
    return h.replace("#","").match(/.{2}/g).map(v => parseInt(v,16));
  }
  function rgbToHex(r,g,b) {
    return "#" + [r,g,b].map(v =>
      Math.round(Math.min(255,Math.max(0,v))).toString(16).padStart(2,"0")
    ).join("");
  }
  function blendColor(a,b,t) {
    const [ar,ag,ab] = hexToRgb(a), [br,bg,bb] = hexToRgb(b);
    return rgbToHex(ar+(br-ar)*t, ag+(bg-ag)*t, ab+(bb-ab)*t);
  }
  function lighten(hex,t)    { return blendColor(hex,"#ffffff",t); }
  function desaturate(hex) {
    const [r,g,b] = hexToRgb(hex), avg = (r+g+b)/3;
    return rgbToHex(r+(avg-r)*0.65, g+(avg-g)*0.65, b+(avg-b)*0.65);
  }

  // ── Status bar ────────────────────────────────────────────
  function updateStatus(extra) {
    if (phase === "over") return;
    if (playerFaction < 0) { setStatus("Choose your kingdom."); return; }

    const f      = FACTIONS[turn];
    const myT    = stacks.filter(s=>s.faction===playerFaction).reduce((a,s)=>a+s.size,0);
    const myC    = cityCount(playerFaction);
    const isMyT  = turn === playerFaction;

    let base = isMyT
      ? `Your turn &nbsp;·&nbsp; Troops: <strong>${myT}</strong> &nbsp;·&nbsp; Cities: <strong>${myC}</strong>`
      : `<strong style="color:${f.color}">${f.name}</strong> is moving…`;

    setStatus(extra ? `${base} &nbsp;·&nbsp; ${extra}` : base);
  }

  function cityCount(fi) {
    let n = 0;
    for (let r=0;r<ROWS;r++)
      for (let c=0;c<COLS;c++)
        if (grid[r][c].terrain===T.CITY && grid[r][c].owner===fi) n++;
    return n;
  }

  function setStatus(html) { if (statusEl) statusEl.innerHTML = html; }

})();

