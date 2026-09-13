import test from 'node:test';
import assert from 'node:assert/strict';
import { BODY, COURSE, TOWERS, GATES, GATE, MAPS, ALLEY, selectMap, createPlayer, stepPlayer, neighbors } from '../src/physics.js';

// Check every traversable link in both directions, including returning toward the start.
function crossLink(course,index,target){
  const p=createPlayer(index),current=course[index],next=course[target];let arrived=false,kicks=0;
  const gate=GATES.find(g=>g.index===index);
  for(let frame=0;frame<120*12;frame++){
    const dx=next.x-p.x,dz=next.z-p.z,mag=Math.max(.01,Math.hypot(dx,dz)),x=dx/mag,z=dz/mag;
    const bx=x>0?(current.x+current.w/2-p.x)/x:x<0?(current.x-current.w/2-p.x)/x:Infinity;
    const bz=z>0?(current.z+current.d/2-p.z)/z:z<0?(current.z-current.d/2-p.z)/z:Infinity;
    const jump=(p.grounded&&p.roof===index&&Math.min(bx,bz)<1.6)||(!p.grounded&&p.wall&&p.wallCooldown===0);
    const slideHeld=!!gate&&Math.abs(p.z-gate.z)<9&&Math.hypot(p.vx,p.vz)>9;
    const event=stepPlayer(p,{x,z,sprint:true,jumpPressed:jump,slideHeld},1/120);if(event.wallJumped)kicks++;
    if(p.grounded&&p.roof===target&&p.surface==='roof'){arrived=true;break;}
    if(p.y<Math.min(current.y,next.y)-15)break;
  }
  return {arrived,kicks,p};
}
test('all four districts have branching routes and traversable links in every direction',()=>{
  for(const map of MAPS){
    const course=selectMap(map.id).course;
    assert.equal(course.length,25);assert.equal(course.filter(p=>p.required).length,8);
    assert.equal(neighbors(course,0).length,4);
    let kicks=0;
    for(let i=0;i<course.length;i++)for(const target of neighbors(course,i)){
      const result=crossLink(course,i,target);kicks+=result.kicks;
      assert.ok(result.arrived,`${map.id} ${i} -> ${target}: ${JSON.stringify(result.p)}`);
    }
    assert.ok(kicks>0,'Elevated objectives retain wall-kick approaches');
  }
  selectMap('sunset');
});

test('a low structure stops a runner on their feet and lets a slide through',()=>{
  for(const map of MAPS){
    const course=selectMap(map.id).course;
    for(const gate of GATES){
      const roof=course[gate.index];
      // Clearance has to sit between the two body heights, or the section means nothing.
      assert.ok(gate.bottom-roof.y>.85&&gate.bottom-roof.y<BODY.height,`${map.id} clearance is not slide-only`);
      assert.ok(gate.w<=roof.w-2,`${map.id} gate must leave a lane beside it`);
      // A slide barely steers, so the jump straight after one has to be nearly straight ahead.
      assert.ok(neighbors(course,gate.index).length>=2,`${map.id} slide roofs offer alternate exits`);
      assert.ok(gate.z-gate.d/2>roof.z-roof.d/2+3,`${map.id} gate must leave a run-up to the edge`);
      // Start on the roof itself, at the back edge, the way you land coming off the previous jump.
      assert.ok(roof.z+roof.d/2-gate.z>9,`${map.id} gate leaves too little run-up to react`);
      const start=()=>{const p=createPlayer(gate.index);p.z=roof.z+roof.d/2-1;p.vz=-BODY.sprint;return p;};
      const upright=start();
      for(let i=0;i<120*3;i++)stepPlayer(upright,{x:0,z:-1,sprint:true},1/120);
      assert.ok(upright.z>gate.z,`${map.id} an upright runner must be stopped by the structure`);
      const slider=start();
      for(let i=0;i<120*3;i++)stepPlayer(slider,{x:0,z:-1,sprint:true,slideHeld:slider.z>gate.z-3},1/120);
      assert.ok(slider.z<gate.z-4,`${map.id} a slide must carry the runner through`);
    }
  }
  selectMap('sunset');
});
test('the towers stand clear of the rooftops and leave a runnable alley',()=>{
  for(const map of MAPS){
    const course=selectMap(map.id).course;
    for(const tower of TOWERS){
      assert.equal(tower.bottom,0,`${map.id} towers rise from the ground`);
      const entry=course[tower.index];
      assert.ok(tower.top>Math.max(tower.entryY,tower.exitY)+10,`${map.id} towers must overtop the rooftops`);
      for(const roof of course){
        const overlapX=Math.abs(tower.x-roof.x)<(tower.w+roof.w)/2;
        const overlapZ=Math.abs(tower.z-roof.z)<(tower.d+roof.d)/2;
        assert.ok(!(overlapX&&overlapZ),`${map.id} tower at ${tower.z} must not cut into ${roof.name}`);
      }
      // Nothing may stand in the running line: both faces clear the rooftop edges.
      const exit=course[tower.exitIndex];
      const face=tower.x-tower.side*tower.w/2;
      assert.ok(Math.abs(face-entry.x)>=Math.max(entry.w,exit.w)/2+ALLEY.clearance-.001,`${map.id} a face cuts into the run line`);
    }
  }
  selectMap('sunset');
});
// Places the runner in the air beside a building face, the way an edge take-off leaves you.
function inAlley(mapId){
  const course=selectMap(mapId).course,lead=TOWERS.find(t=>t.lead);
  const entry=course[lead.index];
  const face=lead.x-lead.side*lead.w/2;
  const p=createPlayer(lead.index);
  p.z=entry.z-entry.d/2-1;p.x=face-lead.side*(BODY.radius+.1);p.y=entry.y+1;p.vz=-BODY.sprint;p.vy=2;p.grounded=false;p.coyote=0;
  return {p,lead,entry};
}
test('a kick off the building face rises and keeps the run going forward',()=>{
  const {p,lead}=inAlley('sunset');
  const e=stepPlayer(p,{x:0,z:-1,sprint:true,jumpPressed:true},1/120);
  assert.ok(e.wallJumped);assert.ok(p.vy>12);assert.ok(p.vz<-15);
  assert.ok(p.vx*lead.side<-9,'the kick pushes away from the face it came off');
});
test('holding jump does not trigger wall jumps or climb upward',()=>{
  const {p}=inAlley('sunset');const initialY=p.y;
  for(let i=0;i<25;i++){const e=stepPlayer(p,{x:0,z:-1,sprint:true,jumpHeld:true},1/120);assert.equal(e.wallJumped,false);}
  assert.ok(p.y<initialY+.4);assert.equal(p.wallJumps,0);assert.ok(p.vz<-15);
});
test('brushing the face slows the fall and consumes grip',()=>{
  const {p}=inAlley('sunset');p.vy=-6;
  for(let i=0;i<30;i++)stepPlayer(p,{x:0,z:-1,sprint:true},1/120);
  assert.ok(p.wallRunning);assert.ok(p.vy>=-2.4);assert.ok(p.energy<BODY.energy);
});
test('the climb is made by kicking the facade at the end of the canyon',()=>{
  const course=selectMap('sunset').course;
  const exitIndex=course.findIndex(p=>p.wall),index=course[exitIndex].wall.from,entry=course[index],exit=course[exitIndex];
  const p=createPlayer(index);let kicked=false,landed=false;
  const gate=GATES.find(g=>g.index===index);
  // Sprint off the take-off roof — sliding under anything in the way — then kick what the runner touches.
  for(let frame=0;frame<120*8;frame++){
    const jump=(p.grounded&&p.z-(entry.z-entry.d/2)<1.6)||(!p.grounded&&p.wall&&p.wallCooldown===0);
    const slideHeld=!!gate&&p.z<gate.z+9&&p.z>gate.z-2.5&&Math.hypot(p.vx,p.vz)>9;
    const event=stepPlayer(p,{x:0,z:-1,sprint:true,jumpPressed:jump,slideHeld},1/120);
    if(event.wallJumped){kicked=true;assert.equal(p.wall.nz,1,'the facade is what gets kicked');}
    if(p.grounded&&p.roof===exitIndex){landed=true;break;}
    if(p.y<entry.y-14)break;
  }
  assert.ok(kicked,'a plain jump must not be enough');
  assert.ok(landed,`the kick should carry the runner onto ${exit.name}`);
});
test('slide boosts speed and transfers momentum into a jump',()=>{
  const p=createPlayer();p.vz=-BODY.sprint;
  let e=stepPlayer(p,{x:0,z:-1,sprint:true,slideHeld:true,slidePressed:true},1/120);
  assert.ok(e.slideStarted);assert.ok(p.sliding);assert.ok(-p.vz>BODY.sprint+3);
  const speed=-p.vz;e=stepPlayer(p,{x:0,z:-1,sprint:true,slideHeld:true,jumpPressed:true},1/120);
  assert.ok(e.jumped);assert.equal(p.sliding,false);assert.ok(-p.vz>speed*.98);assert.ok(p.vy>0);
});
test('slide cannot boost from rest or retrigger while holding its key',()=>{
  const p=createPlayer();let e=stepPlayer(p,{x:0,z:0,slideHeld:true},1/120);assert.equal(e.slideStarted,false);
  p.vz=-BODY.sprint;p.slideWasHeld=false;let starts=0;
  for(let i=0;i<180;i++){e=stepPlayer(p,{x:0,z:-1,sprint:true,slideHeld:true},1/120);if(e.slideStarted)starts++;}
  assert.equal(starts,1);assert.equal(p.sliding,false);
});
