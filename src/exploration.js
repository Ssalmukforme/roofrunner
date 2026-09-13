// Progress is independent from respawn positions and from the suggested navigation target.
export function createRun(course){
  return {required:new Set(course.flatMap((p,i)=>p.required?[i]:[])),visited:new Set(),order:[],respawn:0,elapsed:0,finished:false};
}
export function tickRun(run,seconds){if(!run.finished)run.elapsed+=Math.max(0,seconds)*1000;}
export function visitRoof(run,player,course){
  if(run.finished||!player.grounded||player.surface!=='roof')return false;
  const i=player.roof,p=course[i];
  if(!p||Math.abs(player.y-p.y)>.12||Math.abs(player.x-p.x)>p.w/2+.15||Math.abs(player.z-p.z)>p.d/2+.15)return false;
  run.respawn=i;
  if(!run.required.has(i)||run.visited.has(i))return false;
  run.visited.add(i);run.order.push(i);
  run.finished=run.required.size>0&&run.visited.size===run.required.size;
  return true;
}
export function nearestUnvisited(run,player,course){
  let nearest=null,distance=Infinity;
  for(const i of run.required){if(run.visited.has(i))continue;const p=course[i],d=Math.hypot(player.x-p.x,player.z-p.z);if(d<distance){distance=d;nearest=i;}}
  return nearest;
}
