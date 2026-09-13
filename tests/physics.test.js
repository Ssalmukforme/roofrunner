import test from 'node:test';
import assert from 'node:assert/strict';
import { BODY, COURSE, createPlayer, stepPlayer, formatTime, sanitizeRecords } from '../src/physics.js';

test('timer formats minutes and milliseconds without rounding up',()=>{
  assert.equal(formatTime(61999.99),'01:01.999');
  assert.equal(formatTime(0),'00:00.000');
  assert.equal(formatTime(-100),'00:00.000');
});
test('a jump lands back on the roof and restores wall energy',()=>{
  const p=createPlayer();let peak=p.y;
  for(let i=0;i<240;i++){stepPlayer(p,{x:0,z:0,jumpPressed:i===0,jumpHeld:i<60},1/120);peak=Math.max(peak,p.y);}
  assert.ok(peak>22);assert.equal(p.grounded,true);assert.equal(p.y,20);assert.equal(p.energy,BODY.energy);
});
test('stored records are validated, sorted, and limited to ten',()=>{
  const entries=Array.from({length:14},(_,i)=>({time:14000-i*100,date:'2026-09-12',falls:1}));
  entries.push({time:-1,date:'bad'},null,{time:'42',date:'bad'});
  const records=sanitizeRecords(entries);assert.equal(records.length,10);assert.equal(records[0].time,12700);assert.equal(records.at(-1).time,13600);
  assert.deepEqual(sanitizeRecords({}),[]);
});
