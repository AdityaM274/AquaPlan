import {solve,sample,validate,audit,greedy} from './engine.mjs';
import assert from 'node:assert/strict';
const r=solve(sample);assert.equal(r.served,110);assert.equal(r.weightedUnmet,25);assert.equal(r.transportCost,170);assert.equal(audit(sample,r),true);assert.ok(greedy(sample).weightedUnmet>r.weightedUnmet);
assert.throws(()=>validate({...sample,routes:[...sample.routes,sample.routes[0]]}));assert.throws(()=>validate({...sample,supplies:[{id:'x',name:'X',units:NaN}]}));
const empty=structuredClone(sample);empty.supplies.forEach(s=>s.units=0);assert.equal(solve(empty).served,0);
const zero=structuredClone(sample);zero.demands.forEach(s=>s.units=0);assert.equal(solve(zero).objective,0);
const bounded={supplies:[{id:'s',name:'Supply',units:0}],demands:Array.from({length:20},(_,i)=>({id:'d'+i,name:'Demand '+i,units:10000,priority:5})),routes:[{from:'s',to:'d0',capacity:0,cost:10000}]};assert.ok(Number.isSafeInteger(solve(bounded).objective));assert.throws(()=>validate({...bounded,supplies:[{id:'s',name:'Supply',units:10001}]}));
// Independent exhaustive oracle enumerates every feasible route allocation.
let seed=17421;const rand=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
for(let k=0;k<160;k++){
 const p={supplies:[{id:'a',name:'A',units:rand(4)},{id:'b',name:'B',units:rand(4)}],demands:[{id:'x',name:'X',units:rand(4),priority:1+rand(5)},{id:'y',name:'Y',units:rand(4),priority:1+rand(5)}],routes:[]};
 for(const from of ['a','b'])for(const to of ['x','y'])p.routes.push({from,to,capacity:rand(4),cost:rand(6)});
 let best=[Infinity,Infinity];
 function enumerate(i,alloc){if(i<4){for(let u=0;u<=p.routes[i].capacity;u++)enumerate(i+1,[...alloc,u]);return;}for(const s of p.supplies)if(p.routes.reduce((v,e,j)=>v+(e.from===s.id?alloc[j]:0),0)>s.units)return;let w=0,c=0;for(const d of p.demands){const got=p.routes.reduce((v,e,j)=>v+(e.to===d.id?alloc[j]:0),0);if(got>d.units)return;w+=(d.units-got)*d.priority;}c=p.routes.reduce((v,e,j)=>v+e.cost*alloc[j],0);if(w<best[0]||w===best[0]&&c<best[1])best=[w,c];}
 enumerate(0,[]);const got=solve(p);assert.deepEqual([got.weightedUnmet,got.transportCost],best,`oracle case ${k}`);
}
console.log('PASS: sample, greedy comparison, validation, zero supply/demand, 160 exhaustive-oracle cases');
