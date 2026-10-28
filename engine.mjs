// AquaPlan: integer min-cost flow with an explicit unmet-demand alternative.
export const sample={supplies:[{id:'north',name:'North reservoir',units:65},{id:'south',name:'South tank',units:45}],demands:[{id:'school',name:'School kitchen',units:45,priority:5},{id:'shelter',name:'Community shelter',units:50,priority:5},{id:'garden',name:'Community garden',units:40,priority:1}],routes:[{from:'north',to:'school',capacity:45,cost:2},{from:'north',to:'shelter',capacity:40,cost:4},{from:'north',to:'garden',capacity:30,cost:1},{from:'south',to:'school',capacity:20,cost:5},{from:'south',to:'shelter',capacity:45,cost:1},{from:'south',to:'garden',capacity:30,cost:2}]};
function integer(x,min,max,label){if(!Number.isSafeInteger(x)||x<min||x>max)throw Error(`${label} must be an integer from ${min} to ${max}`);}
export function validate(p){
 if(!p||!Array.isArray(p.supplies)||!Array.isArray(p.demands)||!Array.isArray(p.routes))throw Error('Expected supplies, demands and routes arrays');
 if(!p.supplies.length||p.supplies.length>12||!p.demands.length||p.demands.length>20||p.routes.length>120)throw Error('Use 1–12 supplies, 1–20 demands and at most 120 routes');
 const ids=new Set();for(const x of [...p.supplies,...p.demands]){if(!x||typeof x.id!=='string'||!/^[a-zA-Z0-9_-]{1,32}$/.test(x.id)||ids.has(x.id))throw Error('IDs must be unique short letters/numbers/underscores/hyphens');ids.add(x.id);if(typeof x.name!=='string'||!x.name.trim()||x.name.length>100)throw Error('Every location needs a name up to 100 characters');integer(x.units,0,10000,'Units');}
 for(const x of p.demands)integer(x.priority,1,5,'Priority');
 const seen=new Set();for(const x of p.routes){if(!x||!p.supplies.some(s=>s.id===x.from)||!p.demands.some(d=>d.id===x.to))throw Error('Route must connect an existing supply to an existing demand');const k=x.from+'|'+x.to;if(seen.has(k))throw Error('Duplicate route');seen.add(k);integer(x.capacity,0,100000,'Route capacity');integer(x.cost,0,10000,'Cost');}
 return structuredClone(p);
}
export function solve(input){
 const p=validate(input),ns=p.supplies.length,nd=p.demands.length,t=ns+nd+1,n=t+1,g=Array.from({length:n},()=>[]);
 function edge(a,b,cap,cost){const f={to:b,rev:g[b].length,cap,cost,initial:cap},r={to:a,rev:g[a].length,cap:0,cost:-cost,initial:0};g[a].push(f);g[b].push(r);return f;}
 const total=p.demands.reduce((a,d)=>a+d.units,0),penalty=total*Math.max(0,...p.routes.map(r=>r.cost))+1;
 p.supplies.forEach((s,i)=>edge(0,i+1,s.units,0));
 const routeEdges=p.routes.map(r=>edge(1+p.supplies.findIndex(s=>s.id===r.from),1+ns+p.demands.findIndex(d=>d.id===r.to),r.capacity,r.cost));
 const unmetEdges=p.demands.map((d,i)=>{edge(1+ns+i,t,d.units,0);return edge(0,1+ns+i,d.units,penalty*d.priority);});
 let flow=0,objective=0,augmentations=0;
 while(flow<total){
  const dist=Array(n).fill(Infinity),prev=Array(n);dist[0]=0;
  for(let k=0;k<n-1;k++){let changed=false;for(let a=0;a<n;a++)if(Number.isFinite(dist[a]))g[a].forEach((e,j)=>{if(e.cap>0&&dist[a]+e.cost<dist[e.to]){dist[e.to]=dist[a]+e.cost;prev[e.to]=[a,j];changed=true;}});if(!changed)break;}
  if(!prev[t])throw Error('Internal flow failure');let amount=total-flow;
  for(let v=t;v!==0;){const [a,j]=prev[v];amount=Math.min(amount,g[a][j].cap);v=a;}
  for(let v=t;v!==0;){const [a,j]=prev[v],e=g[a][j];e.cap-=amount;g[v][e.rev].cap+=amount;v=a;}
  flow+=amount;objective+=amount*dist[t];augmentations++;
 }
 const assignments=p.routes.map((r,i)=>({...r,units:routeEdges[i].initial-routeEdges[i].cap}));
 const demands=p.demands.map((d,i)=>({...d,unmet:unmetEdges[i].initial-unmetEdges[i].cap,served:d.units-(unmetEdges[i].initial-unmetEdges[i].cap)}));
 const supplies=p.supplies.map(s=>({...s,used:assignments.filter(a=>a.from===s.id).reduce((v,a)=>v+a.units,0)}));
 const transportCost=assignments.reduce((v,a)=>v+a.units*a.cost,0),weightedUnmet=demands.reduce((v,d)=>v+d.unmet*d.priority,0);
 const result={assignments,demands,supplies,total,served:demands.reduce((v,d)=>v+d.served,0),transportCost,weightedUnmet,objective,penalty,augmentations};
 if(objective!==transportCost+weightedUnmet*penalty)throw Error('Objective reconciliation failed');audit(p,result);return result;
}
export function audit(p,r){
 for(const s of p.supplies){const used=r.assignments.filter(a=>a.from===s.id).reduce((v,a)=>v+a.units,0);if(used>s.units)throw Error('Supply exceeded');}
 for(const a of r.assignments)if(!Number.isSafeInteger(a.units)||a.units<0||a.units>a.capacity)throw Error('Invalid shipment');
 for(const d of r.demands){const got=r.assignments.filter(a=>a.to===d.id).reduce((v,a)=>v+a.units,0);if(got!==d.served||got+d.unmet!==d.units||d.unmet<0)throw Error('Demand reconciliation failed');}
 return true;
}
export function greedy(input){const p=validate(input),left=Object.fromEntries(p.supplies.map(s=>[s.id,s.units])),need=Object.fromEntries(p.demands.map(d=>[d.id,d.units]));let cost=0;for(const r of [...p.routes].sort((a,b)=>a.cost-b.cost)){const v=Math.min(left[r.from],need[r.to],r.capacity);left[r.from]-=v;need[r.to]-=v;cost+=v*r.cost;}return {weightedUnmet:p.demands.reduce((a,d)=>a+need[d.id]*d.priority,0),transportCost:cost};}
