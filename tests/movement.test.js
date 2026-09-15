import test from 'node:test';
import assert from 'node:assert/strict';
import { BODY, TOWERS, GATES, MAPS, ALLEY, selectMap, createPlayer, stepPlayer, neighbors, linkGeometry } from '../src/physics.js';

// A simple bot: sprint at the target roof, jump at the edge, kick any wall it touches, and slide when
// a low structure is close along the lane it blocks.
function crossLink(course,index,target,{kick=true}={}){
  const p=createPlayer(index),current=course[index],next=course[target];let arrived=false,kicks=0;
  const gate=GATES.find(g=>g.index===index);
  for(let frame=0;frame<120*12;frame++){
    const dx=next.x-p.x,dz=next.z-p.z,mag=Math.max(.01,Math.hypot(dx,dz)),x=dx/mag,z=dz/mag;
    const bx=x>0?(current.x+current.w/2-p.x)/x:x<0?(current.x-current.w/2-p.x)/x:Infinity;
    const bz=z>0?(current.z+current.d/2-p.z)/z:z<0?(current.z-current.d/2-p.z)/z:Infinity;
    const jump=(p.grounded&&p.roof===index&&Math.min(bx,bz)<1.6)||(kick&&!p.grounded&&p.wall&&p.wallCooldown===0);
    const along=gate?(gate.axis==='z'?p.z-gate.z:p.x-gate.x):Infinity;
    const slideHeld=Math.abs(along)<9&&Math.hypot(p.vx,p.vz)>9;
    const event=stepPlayer(p,{x,z,sprint:true,jumpPressed:jump,slideHeld},1/120);if(event.wallJumped)kicks++;
    if(p.grounded&&p.roof===target&&p.surface==='roof'){arrived=true;break;}
    if(p.y<Math.min(current.y,next.y)-15)break;
  }
  return {arrived,kicks,p};
}
test('every link in every district can be run in the direction it is declared',()=>{
  for(const map of MAPS){
    const course=selectMap(map.id).course;
    assert.equal(course.filter(p=>p.required).length,8);
    assert.equal(course[0].required,false);
    for(let i=0;i<course.length;i++)for(const target of neighbors(course,i)){
      const result=crossLink(course,i,target);
      assert.ok(result.arrived,`${map.id} ${course[i].id} -> ${course[target].id}: ${JSON.stringify(result.p)}`);
    }
  }
  selectMap('sunset');
});
test('each district can be left and returned to from every roof',()=>{
  for(const map of MAPS){
    const course=map.course;
    const reach=edges=>{const seen=new Set([0]),q=[0];while(q.length){const i=q.pop();for(const j of edges(i))if(!seen.has(j)){seen.add(j);q.push(j);}}return seen;};
    const out=reach(i=>course[i].links),back=reach(i=>course.flatMap((p,k)=>p.links.includes(i)?[k]:[]));
    for(const [i,p] of course.entries())assert.ok(out.has(i)&&back.has(i),`${map.id} ${p.id} would strand the runner`);
  }
});
test('districts differ in shape, not just in colour',()=>{
  const signature=map=>map.course.map(p=>`${Math.round(p.x)},${Math.round(p.z)}`).sort().join(' ');
  assert.equal(new Set(MAPS.map(signature)).size,MAPS.length);
  // The old layout put every roof on one 31m lattice; none of these may.
  for(const map of MAPS){
    const lattice=map.course.every(p=>Math.abs(p.x%31)<.01&&Math.abs(p.z%31)<.01);
    assert.equal(lattice,false,`${map.id} is still a grid`);
    assert.ok(new Set(map.course.map(p=>`${p.w}x${p.d}`)).size>=5,`${map.id} needs varied roof sizes`);
  }
  assert.ok(new Set(MAPS.flatMap(m=>m.walls.map(w=>w.dir.join(',')))).size>=3,'walls face more than one way');
});
test('wall links cannot be jumped and are climbed with a facade kick',()=>{
  for(const map of MAPS){
    const course=selectMap(map.id).course;
    for(const wall of map.walls){
      const tag=`${map.id} ${course[wall.from].id} -> ${course[wall.to].id}`;
      assert.equal(crossLink(course,wall.from,wall.to,{kick:false}).arrived,false,`${tag} must need the kick`);
      const climb=crossLink(course,wall.from,wall.to);
      assert.ok(climb.arrived&&climb.kicks>0,`${tag} should be climbed by kicking`);
      const expected={both:2,one:1,none:0}[wall.towers];
      assert.equal(TOWERS.filter(t=>t.index===wall.from&&t.exitIndex===wall.to).length,expected,`${tag} has the wrong number of side buildings`);
    }
  }
  // The facade does the work; side buildings are scenery that some walls have and some do not.
  assert.deepEqual(new Set(MAPS.flatMap(m=>m.walls.map(w=>w.towers))),new Set(['both','one','none']));
  selectMap('sunset');
});
test('a low structure stops a runner on their feet and lets a slide through',()=>{
  for(const map of MAPS){
    const course=selectMap(map.id).course;
    for(const gate of GATES){
      const roof=course[gate.index],alongZ=gate.axis==='z',length=alongZ?roof.d:roof.w,wide=alongZ?roof.w:roof.d;
      assert.ok(gate.bottom-roof.y>.85&&gate.bottom-roof.y<BODY.height,`${map.id} clearance is not slide-only`);
      assert.ok(gate.span<=wide-2,`${map.id} gate must leave a lane beside it`);
      assert.ok(length/2-Math.abs(roof.slide.at||0)-1.1>=9,`${map.id} ${roof.id} leaves too little run-up`);
      // A slide barely steers, so every route over this roof has to run along the lane it blocks.
      for(const [i,p] of course.entries())if(p.links.includes(gate.index)||roof.links.includes(i))
        assert.equal(linkGeometry(roof,p).axis,gate.axis,`${map.id} ${roof.id} is crossed sideways from ${p.id}`);
      const start=()=>{const p=createPlayer(gate.index);p.x=roof.x;p.z=roof.z;if(alongZ){p.z+=roof.d/2-1;p.vz=-BODY.sprint;}else{p.x+=roof.w/2-1;p.vx=-BODY.sprint;}return p;};
      const input=alongZ?{x:0,z:-1}:{x:-1,z:0},pos=p=>alongZ?p.z:p.x,at=alongZ?gate.z:gate.x;
      const upright=start();
      for(let i=0;i<120*3;i++)stepPlayer(upright,{...input,sprint:true},1/120);
      assert.ok(pos(upright)>at,`${map.id} an upright runner must be stopped by the structure`);
      const slider=start();
      for(let i=0;i<120*3;i++)stepPlayer(slider,{...input,sprint:true,slideHeld:pos(slider)>at-3},1/120);
      assert.ok(pos(slider)<at-4,`${map.id} a slide must carry the runner through`);
    }
  }
  selectMap('sunset');
});
test('the towers stand clear of the rooftops and leave the running line open',()=>{
  for(const map of MAPS){
    const course=selectMap(map.id).course;
    for(const tower of TOWERS){
      assert.equal(tower.bottom,0,`${map.id} towers rise from the ground`);
      assert.ok(tower.top>Math.max(tower.entryY,tower.exitY)+10,`${map.id} towers must overtop the rooftops`);
      for(const roof of course){
        const overlap=Math.abs(tower.x-roof.x)<(tower.w+roof.w)/2&&Math.abs(tower.z-roof.z)<(tower.d+roof.d)/2;
        assert.ok(!overlap,`${map.id} tower beside ${course[tower.index].id} cuts into ${roof.id}`);
      }
      const entry=course[tower.index],exit=course[tower.exitIndex],alongZ=tower.axis==='z';
      const centre=alongZ?tower.x:tower.z,line=alongZ?entry.x:entry.z,half=alongZ?tower.w/2:tower.d/2;
      const face=Math.abs(centre-line)-half,roofHalf=Math.max(alongZ?entry.w:entry.d,alongZ?exit.w:exit.d)/2;
      assert.ok(face>=roofHalf+ALLEY.clearance-.001,`${map.id} a face cuts into the run line`);
    }
  }
  selectMap('sunset');
});
// Places the runner in the air beside a building face, the way an edge take-off leaves you.
function beside(mapId){
  selectMap(mapId);
  const lead=TOWERS.find(t=>t.lead);if(!lead)return null;
  const [dx,dz]=lead.dir,alongZ=lead.axis==='z';
  const p=createPlayer(lead.index);
  const faceGap=BODY.radius+.1;
  if(alongZ){p.x=lead.x>p.x?lead.x-lead.w/2-faceGap:lead.x+lead.w/2+faceGap;p.z=lead.z;}
  else{p.z=lead.z>p.z?lead.z-lead.d/2-faceGap:lead.z+lead.d/2+faceGap;p.x=lead.x;}
  p.y=lead.entryY+1;p.vx=dx*BODY.sprint;p.vz=dz*BODY.sprint;p.vy=2;p.grounded=false;p.coyote=0;
  return {p,lead,input:{x:dx,z:dz}};
}
test('a kick off a side face rises and keeps the run going forward',()=>{
  for(const map of MAPS){
    const found=beside(map.id);if(!found)continue;
    const {p,lead,input}=found,[dx,dz]=lead.dir;
    const e=stepPlayer(p,{...input,sprint:true,jumpPressed:true},1/120);
    assert.ok(e.wallJumped,`${map.id} should find the face`);assert.ok(p.vy>12);
    assert.ok(p.vx*dx+p.vz*dz>15,`${map.id} forward speed survives the kick`);
  }
  selectMap('sunset');
});
test('holding jump does not trigger wall jumps or climb upward',()=>{
  const {p,input}=beside('sunset');const initialY=p.y;
  for(let i=0;i<25;i++){const e=stepPlayer(p,{...input,sprint:true,jumpHeld:true},1/120);assert.equal(e.wallJumped,false);}
  assert.ok(p.y<initialY+.4);assert.equal(p.wallJumps,0);
});
test('brushing the face slows the fall and consumes grip',()=>{
  const {p,input}=beside('harbor');p.vy=-6;
  for(let i=0;i<30;i++)stepPlayer(p,{...input,sprint:true},1/120);
  assert.ok(p.wallRunning);assert.ok(p.vy>=-2.4);assert.ok(p.energy<BODY.energy);
  selectMap('sunset');
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
