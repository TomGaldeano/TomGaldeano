const canvas = document.querySelector('#hexCanvas');
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const ctx = canvas.getContext('2d');

let HEX_SIZE = 36;
const CITY_NEUTRAL = -1;
let mapOffset = {x: 0, y: 0};
const WIDTH = 12;
const HEIGHT = 10;
const factions = [
    {id:0,name:'North',color:'#2b7fbd'},
    {id:1,name:'East',color:'#c93b3b'},
    {id:2,name:'South',color:'#2b8a3e'},
    {id:3,name:'West',color:'#b58b2b'},
];
let tiles = {};
let units = [];
let turnOrder = [];
let currentTurnIndex = 0;
let selectedUnit = null;
let playerFaction = null;

function key(q,r){
    return `${q},${r}`;
}

function fitHexSize(){
    const gridWidth = Math.sqrt(3) * (WIDTH + 0.5);
    const gridHeight = 1.5 * (HEIGHT - 1) + 2;
    const bestSize = Math.min((CANVAS_WIDTH - 60) / gridWidth, (CANVAS_HEIGHT - 60) / gridHeight);
    HEX_SIZE = Math.max(18, Math.floor(bestSize));
}

function hexToPixel(q, r) {
    const x = HEX_SIZE * Math.sqrt(3) * (q + r/2);
    const y = HEX_SIZE * 3/2 * r;
    return {x: x + mapOffset.x, y: y + mapOffset.y};
}

function getGridBounds() {
    const positions = Object.values(tiles).map(t => hexToPixel(t.q, t.r));
    if (!positions.length) return {minX:0, maxX:0, minY:0, maxY:0};
    const xs = positions.map(p => p.x);
    const ys = positions.map(p => p.y);
    return {
        minX: Math.min(...xs) - HEX_SIZE,
        maxX: Math.max(...xs) + HEX_SIZE,
        minY: Math.min(...ys) - HEX_SIZE,
        maxY: Math.max(...ys) + HEX_SIZE
    };
}

function centerMap() {
    const {minX, maxX, minY, maxY} = getGridBounds();
    const gridWidth = maxX - minX;
    const gridHeight = maxY - minY;
    mapOffset.x = (CANVAS_WIDTH - gridWidth) / 2 - minX;
    mapOffset.y = (CANVAS_HEIGHT - gridHeight) / 2 - minY;
}

function polygon(ctx, x, y, radius, sides, rotation=0){
    ctx.beginPath();
    for(let i=0;i<sides;i++){
        const a = rotation + i*(Math.PI*2)/sides;
        const px = x + Math.cos(a)*radius;
        const py = y + Math.sin(a)*radius;
        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath();
}

function init(){
    tiles = {};
    units = [];
    fitHexSize();
    const qmin = -Math.floor(WIDTH/2);
    const rmin = -Math.floor(HEIGHT/2);
    for(let q=qmin;q<qmin+WIDTH;q++){
        for(let r=rmin;r<rmin+HEIGHT;r++){
            tiles[key(q,r)] = {q,r,city:null,terrain:'plain'};
        }
    }

    const cityPositions = [
        [qmin+1,rmin+1],
        [qmin+WIDTH-2,rmin+1],
        [qmin+WIDTH-2,rmin+HEIGHT-2],
        [qmin+1,rmin+HEIGHT-2]
    ];
    for(let i=0;i<4;i++){
        const [q,r] = cityPositions[i];
        if(tiles[key(q,r)]) tiles[key(q,r)].city = i;
    }

    const neutralPositions = [
        [0,0],
        [2,-1],
        [-2,1],
        [4,-2],
        [-4,2]
    ];
    neutralPositions.forEach(([q,r]) => {
        if(tiles[key(q,r)] && tiles[key(q,r)].city === null) {
            tiles[key(q,r)].city = CITY_NEUTRAL;
        }
    });

    let idc = 1;
    for(let f=0;f<4;f++){
        const city = tiles[key(cityPositions[f][0], cityPositions[f][1])];
        units.push({id:idc++, faction:f, q:city.q, r:city.r + (f%2===0 ? 1 : -1), hp:10});
        units.push({id:idc++, faction:f, q:city.q + (f<2 ? 1 : -1), r:city.r, hp:10});
    }

    turnOrder = [0,1,2,3];
    currentTurnIndex = 0;
}

function draw(){
    centerMap();
    ctx.fillStyle = '#e7e7e7';
    ctx.fillRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);

    for(const k in tiles){
        const t = tiles[k];
        const p = hexToPixel(t.q,t.r);
        polygon(ctx,p.x,p.y,HEX_SIZE,6,Math.PI/6);
        if(t.city === null){
            ctx.fillStyle = '#f6f6f6';
        } else if(t.city === CITY_NEUTRAL){
            ctx.fillStyle = '#777';
        } else {
            ctx.fillStyle = factions[t.city].color;
        }
        ctx.fill();
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 1;
        ctx.stroke();
        if(t.city !== null){
            ctx.fillStyle = t.city === CITY_NEUTRAL ? '#fff' : '#222';
            ctx.font = '12px sans-serif';
            ctx.textAlign='center';
            ctx.fillText('City', p.x, p.y+4);
        }
    }

    for(const u of units){
        const p = hexToPixel(u.q,u.r);
        ctx.beginPath();
        ctx.arc(p.x, p.y-6, 12, 0, Math.PI*2);
        ctx.fillStyle = factions[u.faction].color;
        ctx.fill();
        ctx.strokeStyle = '#222'; ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font='12px sans-serif'; ctx.textAlign='center';
        ctx.fillText(u.hp, p.x, p.y-4);
        if(selectedUnit && selectedUnit.id===u.id){
            ctx.strokeStyle='yellow'; ctx.lineWidth=3;
            ctx.beginPath(); ctx.arc(p.x,p.y-6,16,0,Math.PI*2); ctx.stroke(); ctx.lineWidth=1;
        }
    }

    drawHUD();
}

function drawHUD(){
    const hudX = CANVAS_WIDTH - 220;
    ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(hudX,10,200,100);
    ctx.fillStyle='#fff'; ctx.font='14px sans-serif'; ctx.textAlign='left';
    ctx.fillText('Turn: '+factions[turnOrder[currentTurnIndex]].name, hudX+10, 30);
    ctx.fillText('Player: '+(playerFaction===null?'-':factions[playerFaction].name), hudX+10, 50);
    ctx.fillText('Units: '+units.filter(u=>u.faction===playerFaction).length, hudX+10, 70);
    ctx.fillText('Click a unit to select, click a neighbor to move.', hudX+10, 90);
}

function getCanvasCoords(ev){
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
        x: (ev.clientX - rect.left) * scaleX,
        y: (ev.clientY - rect.top) * scaleY
    };
}

canvas.addEventListener('click', (ev)=>{
    if(playerFaction === null) return;
    const {x,y} = getCanvasCoords(ev);
    let best = null;
    let bestd = 1e9;
    for(const k in tiles){
        const t = tiles[k];
        const p = hexToPixel(t.q,t.r);
        const d = Math.hypot(p.x-x, p.y-y);
        if(d < bestd){ bestd = d; best = t; }
    }
    if(!best) return;
    const clickedUnit = unitAt(best.q,best.r);
    const curFaction = turnOrder[currentTurnIndex];
    if(curFaction !== playerFaction) return;

    if(selectedUnit){
        const isNeighbor = neighbors(selectedUnit.q,selectedUnit.r).some(n=>n.q===best.q && n.r===best.r);
        if(isNeighbor){
            if(clickedUnit && clickedUnit.faction!==selectedUnit.faction){
                resolveCombat(selectedUnit, clickedUnit);
            } else if(!clickedUnit){
                selectedUnit.q = best.q;
                selectedUnit.r = best.r;
                const tile = tiles[key(best.q,best.r)];
                if(tile.city !== null && tile.city !== selectedUnit.faction) tile.city = selectedUnit.faction;
            }
            selectedUnit = null;
            updateStatus('Move completed. End turn to continue.');
            draw();
            checkVictory();
            return;
        }
    }

    if(clickedUnit && clickedUnit.faction===curFaction){
        selectedUnit = clickedUnit;
        updateStatus('Selected unit. Click a neighboring tile to move or attack.');
        draw();
    }
});

function updateStatus(message){
    const status = document.getElementById('statusText');
    if(status) status.textContent = message;
}

function resolveCombat(attacker, defender){
    const aRoll = attacker.hp + Math.floor(Math.random()*6);
    const dRoll = defender.hp + Math.floor(Math.random()*6);
    if(aRoll >= dRoll){
        defender.hp -= Math.max(3, Math.floor(Math.random()*5));
        if(defender.hp <= 0){
            units = units.filter(u=>u.id!==defender.id);
            attacker.q = defender.q;
            attacker.r = defender.r;
            const t = tiles[key(attacker.q,attacker.r)];
            if(t.city !== null) t.city = attacker.faction;
            updateStatus('Enemy defeated!');
        } else {
            updateStatus('Attack hit! Enemy weakened.');
        }
    } else {
        attacker.hp -= Math.max(2, Math.floor(Math.random()*5));
        if(attacker.hp <= 0){
            units = units.filter(u=>u.id!==attacker.id);
            updateStatus('You lost the fight.');
        } else {
            updateStatus('Attack failed and your unit was harmed.');
        }
    }
}

function nextTurn(){
    currentTurnIndex = (currentTurnIndex + 1) % turnOrder.length;
    selectedUnit = null;
    const cur = turnOrder[currentTurnIndex];
    draw();
    if(cur !== playerFaction){
        updateStatus('AI turn...');
        setTimeout(()=>aiTurn(cur), 300);
    } else {
        updateStatus('Your turn. Select a unit.');
    }
}

function aiTurn(faction){
    const myUnits = units.filter(u=>u.faction===faction);
    for(const u of myUnits){
        const enemyUnits = units.filter(v=>v.faction!==faction);
        const cityTargets = Object.values(tiles)
            .filter(t=>t.city!==null && t.city!==faction)
            .map(t=>({q:t.q,r:t.r}));
        let target = null;
        if(enemyUnits.length > 0) target = enemyUnits.reduce((a,b)=>dist(u,a) > dist(u,b) ? b : a);
        if(!target && cityTargets.length > 0) target = cityTargets[0];
        if(target){
            const step = stepToward(u.q,u.r,target.q,target.r);
            if(step){
                const other = unitAt(step.q,step.r);
                if(other && other.faction!==faction){
                    resolveCombat(u, other);
                } else if(!other){
                    u.q = step.q;
                    u.r = step.r;
                    const tile = tiles[key(u.q,u.r)];
                    if(tile.city !== null && tile.city !== faction) tile.city = faction;
                }
            }
        }
    }
    draw();
    checkVictory();
    setTimeout(()=>nextTurn(), 300);
}

function dist(a,b){
    return Math.max(Math.abs(a.q-b.q), Math.abs(a.r-b.r), Math.abs((a.q+a.r)-(b.q+b.r)));
}

function stepToward(q,r,tq,tr){
    const ns = neighbors(q,r);
    ns.sort((A,B) => Math.hypot(A.q-tq,A.r-tr) - Math.hypot(B.q-tq,B.r-tr));
    return ns[0];
}

function unitAt(q,r){
    return units.find(u=>u.q===q && u.r===r);
}

const HEX_NEIGHBORS = [[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]];
function neighbors(q,r){
    return HEX_NEIGHBORS.map(([dq,dr])=>({q:q+dq,r:r+dr})).filter(n=>tiles[key(n.q,n.r)]);
}

function checkVictory(){
    const alive = [...new Set(units.map(u=>u.faction))];
    if(alive.length===1){
        const winner = alive[0];
        setTimeout(()=>alert('Faction '+factions[winner].name+' wins!'), 100);
    }
}

const endTurnBtn = document.getElementById('endTurnBtn');
endTurnBtn?.addEventListener('click', ()=>{ nextTurn(); });
document.querySelectorAll('.pickFaction').forEach(btn=>btn.addEventListener('click', (e)=>{
    playerFaction = parseInt(e.target.dataset.faction, 10);
    currentTurnIndex = turnOrder.indexOf(playerFaction);
    if(currentTurnIndex < 0) currentTurnIndex = 0;
    document.getElementById('choosePanel')?.remove();
    updateStatus('Selected '+factions[playerFaction].name+'. Your turn.');
    draw();
}));

init();
draw();
window.GAME = {
    tiles,
    units,
    factions,
    draw,
    nextTurn,
    get currentTurnIndex(){ return currentTurnIndex; },
    get playerFaction(){ return playerFaction; },
    get selectedUnit(){ return selectedUnit; }
};
