import test from 'node:test';
import assert from 'node:assert/strict';
import { MAPS, createPlayer, selectMap, districtBounds } from '../src/physics.js';
import { createRun, tickRun, visitRoof, nearestUnvisited } from '../src/exploration.js';

test('required roofs can be visited in arbitrary order and the last visit freezes time',()=>{
  for(const map of MAPS){
    const course=selectMap(map.id).course,run=createRun(course),order=[...run.required].reverse();
    for(const [n,i] of order.entries()){
      tickRun(run,1.5);assert.equal(visitRoof(run,createPlayer(i),course),true);
      assert.equal(run.finished,n===order.length-1);
      assert.equal(visitRoof(run,createPlayer(i),course),false);
      assert.equal(run.visited.size,n+1);
    }
    assert.deepEqual(run.order,order);assert.equal(run.elapsed,12000);
    tickRun(run,50);assert.equal(run.elapsed,12000);assert.equal(nearestUnvisited(run,course[0],course),null);
  }
  selectMap('sunset');
});
test('ordinary roofs update respawn without advancing objective progress',()=>{
  const course=selectMap('sunset').course,run=createRun(course),i=course.findIndex((p,i)=>i>0&&!p.required);
  assert.equal(visitRoof(run,createPlayer(i),course),false);
  assert.equal(run.respawn,i);assert.equal(run.visited.size,0);
});
test('airborne, wall-side, tower and duct contacts do not count as visiting a roof',()=>{
  const course=selectMap('sunset').course,run=createRun(course),i=[...run.required][0];
  for(const change of [{grounded:false},{surface:'tower'},{surface:'gate'},{y:course[i].y+4},{x:course[i].x+50}]){
    const p={...createPlayer(i),...change};assert.equal(visitRoof(run,p,course),false);
  }
  assert.equal(run.visited.size,0);
});
test('respawning and revisiting preserve collected objectives; a new run resets them',()=>{
  const course=selectMap('sunset').course,run=createRun(course),ids=[...run.required];
  visitRoof(run,createPlayer(ids[3]),course);tickRun(run,8);
  visitRoof(run,createPlayer(run.respawn),course);
  assert.equal(run.visited.size,1);assert.equal(run.elapsed,8000);
  const fresh=createRun(course);assert.equal(fresh.visited.size,0);assert.equal(fresh.elapsed,0);assert.equal(fresh.respawn,0);
});
test('maps spread out from the start, use unique objective labels, and have separate records',()=>{
  for(const map of MAPS){
    const b=districtBounds(map.course);
    assert.ok(b.maxX-b.minX>=100&&b.maxZ-b.minZ>=100,`${map.id} is too small to explore`);
    assert.equal(new Set(map.course.filter(p=>p.required).map(p=>p.label)).size,8);
    assert.equal(map.course[0].required,false);
    assert.match(map.storageKey,/v5-/);
  }
  assert.equal(new Set(MAPS.map(m=>m.storageKey)).size,MAPS.length);
});
