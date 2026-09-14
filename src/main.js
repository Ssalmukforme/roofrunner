import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import './style.css';
import { createRun, tickRun, visitRoof, nearestUnvisited } from './exploration.js';
import { MAPS, COURSE, TOWERS, WALLS, GATES, GATE, BODY, selectMap, createPlayer, stepPlayer, formatTime, sanitizeRecords, districtBounds, neighbors, linkGeometry } from './physics.js';

const $ = (selector) => document.querySelector(selector);
const canvas = $('#world');
let renderer;
try { renderer = new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'}); }
catch { $('#loading').innerHTML='<span class="loading-logo">ROOFRUNNER</span><span>3D 화면을 열 수 없습니다. 브라우저의 하드웨어 가속을 켜고 다시 접속해 주세요.</span>'; throw new Error('WebGL is unavailable'); }
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.25;
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2('#b68c96',.0037);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,950);
const hemi=new THREE.HemisphereLight('#ffd1b2','#5b5472',2.6);scene.add(hemi);
const sunLight=new THREE.DirectionalLight('#ffb784',3.4);
sunLight.position.set(-80,100,-150);sunLight.castShadow=true;
sunLight.shadow.mapSize.set(2048,2048);
Object.assign(sunLight.shadow.camera,{left:-65,right:65,top:65,bottom:-65,near:1,far:320});
sunLight.shadow.bias=-.0005;sunLight.shadow.normalBias=.15;scene.add(sunLight,sunLight.target);
const skyUniforms={top:{value:new THREE.Color('#756b91')},middle:{value:new THREE.Color('#e7aa9a')},bottom:{value:new THREE.Color('#f9c493')}};
const sky=new THREE.Mesh(new THREE.SphereGeometry(850,32,24),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,toneMapped:false,uniforms:skyUniforms,vertexShader:'varying vec3 vWorld; void main(){vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 vWorld; uniform vec3 top; uniform vec3 middle; uniform vec3 bottom; void main(){float h=normalize(vWorld).y; vec3 col=mix(bottom,middle,smoothstep(-.08,.25,h));col=mix(col,top,smoothstep(.18,.85,h));gl_FragColor=vec4(col,1.);\n#include <colorspace_fragment>\n}'}));scene.add(sky);
const sun=new THREE.Mesh(new THREE.SphereGeometry(25,40,24),new THREE.MeshBasicMaterial({color:'#ffd8a2',fog:false}));sun.position.set(130,67,-300);scene.add(sun);
const boxGeometry=new THREE.BoxGeometry(1,1,1);
// World materials are cached per build and released when the map changes; the runner keeps its own.
const materialCache=new Map();const trackedKeys=new Set();let tracking=false;
function material(color,extra={}){const key=color+JSON.stringify(extra);let m=materialCache.get(key);if(!m){m=new THREE.MeshStandardMaterial({color,roughness:1,...extra});materialCache.set(key,m);}if(tracking)trackedKeys.add(key);return m;}
const rigCache=new Map();
function rigMaterial(color){if(!rigCache.has(color))rigCache.set(color,new THREE.MeshStandardMaterial({color,roughness:1}));return rigCache.get(color);}
function box(x,y,z,w,h,d,color,parent=scene,shadow=true){const m=new THREE.Mesh(boxGeometry,typeof color==='string'?material(color):color);m.position.set(x,y,z);m.scale.set(w,h,d);m.castShadow=shadow;m.receiveShadow=true;parent.add(m);return m;}
function cylinder(x,y,z,rt,rb,h,color,parent=scene,sides=8){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,sides),typeof color==='string'?material(color):color);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
let seed=87;function rand(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646;}function between(a,b){return a+rand()*(b-a);}
const windowMatrices=[];const litMatrices=[];const dummy=new THREE.Object3D();
function queueWindow(x,y,z,w,h,d,lit=false){dummy.position.set(x,y,z);dummy.scale.set(w,h,d);dummy.rotation.set(0,0,0);dummy.updateMatrix();(lit?litMatrices:windowMatrices).push(dummy.matrix.clone());}
function arrow(x,y,z,angle,parent,color,scale=1){const shape=new THREE.Shape();shape.moveTo(0,.9);shape.lineTo(.7,-.05);shape.lineTo(.26,-.05);shape.lineTo(.26,-.85);shape.lineTo(-.26,-.85);shape.lineTo(-.26,-.05);shape.lineTo(-.7,-.05);shape.closePath();const m=new THREE.Mesh(new THREE.ShapeGeometry(shape),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));m.rotation.set(-Math.PI/2,0,-angle);m.position.set(x,y,z);m.scale.setScalar(scale);parent.add(m);return m;}
// A group turned so that its local -z points along a travel direction; walls and slide frames are
// drawn once in that frame and work whichever way the route runs.
function oriented(parent,x,z,[dx,dz]){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=Math.atan2(-dx,-dz);parent.add(g);return g;}
function labelSprite(text,color='#ffecce',size=1){const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.font='700 52px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;ctx.fillText(text,256,64);const texture=new THREE.CanvasTexture(c);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthWrite:false}));sprite.scale.set(7*size,1.75*size,1);return sprite;}

// ---------------------------------------------------------------- world build
let worldRoot=null,checkpointMeshes=[],objectiveBeacons=[],birds=[],start=COURSE[0],finish=COURSE.at(-1);
function disposeWorld(){
  if(!worldRoot)return;
  worldRoot.traverse(o=>{
    if(o.geometry&&!o.isSprite&&o.geometry!==boxGeometry)o.geometry.dispose();
    const mats=Array.isArray(o.material)?o.material:o.material?[o.material]:[];
    for(const m of mats){m.map?.dispose();m.dispose();}
  });
  scene.remove(worldRoot);worldRoot=null;
  for(const key of trackedKeys)materialCache.delete(key);trackedKeys.clear();
}
function waterTank(x,y,z,s,parent,t){
  for(let i=-1;i<=1;i+=2)for(let j=-1;j<=1;j+=2)box(x+i*s*.8,y+s,z+j*s*.8,.13*s,2*s,.13*s,'#625d6e',parent);
  cylinder(x,y+2.6*s,z,1.35*s,1.35*s,2.2*s,t.tank||'#927578',parent,10);
  cylinder(x,y+3.82*s,z,0,1.55*s,.55*s,'#615a6b',parent,10);
  for(const yy of [1.7,3.2])cylinder(x,y+yy*s,z,1.4*s,1.4*s,.12*s,'#635b6d',parent,10);
}
function buildWorld(map){
  disposeWorld();
  const t=map.theme;seed=t.seed;tracking=true;
  worldRoot=new THREE.Group();scene.add(worldRoot);
  checkpointMeshes=[];objectiveBeacons=[];birds=[];windowMatrices.length=0;litMatrices.length=0;
  start=COURSE[0];finish=COURSE.at(-1);
  const bounds=districtBounds(COURSE),zNear=bounds.maxZ,zFar=bounds.minZ,midZ=(zNear+zFar)/2,span=zNear-zFar;
  const city=new THREE.Group(),routeGroup=new THREE.Group(),props=new THREE.Group();
  worldRoot.add(city,routeGroup,props);
  const decor=map.decor||{};
  const inWater=(x,z)=>!!decor.water&&z>decor.water.z;
  const inPlaza=(x,z)=>!!decor.plaza&&Math.hypot(x-decor.plaza.x,z-decor.plaza.z)<decor.plaza.r;
  // The hillside rises toward one corner; the city steps up with it instead of sitting on a flat plate.
  const hill=(x,z)=>decor.slope?THREE.MathUtils.clamp(Math.round(((decor.slope.x*x+decor.slope.z*z)*.12+5)/3)*3,0,18):0;
  groundFor(t,decor,city,midZ,bounds);
  const placed=[];
  function building(x,z,w,d,h,color,detail=true){
    box(x,h/2,z,w,h,d,color,city,false);
    box(x,h+.22,z,w+.35,.44,d+.35,t.crown,city,false);
    box(x,h+.46,z,w-.9,.14,d-.9,t.crownInner,city,false);
    if(detail){
      placed.push({x,z,w,d,h});
      const floors=Math.floor((h-3)/3.1);const cols=Math.floor((w-1)/2.7);const rows=Math.floor((d-1)/2.7);
      for(let f=0;f<floors;f++){
        for(let c=0;c<cols;c++){let wx=x-w/2+1.6+c*2.7,wy=2.8+f*3.1;queueWindow(wx,wy,z+d/2+.015,.9,1.35,.035,rand()>t.litThreshold);queueWindow(wx,wy,z-d/2-.015,.9,1.35,.035,rand()>t.litThreshold+.04);}
        for(let c=0;c<rows;c++){let wz=z-d/2+1.6+c*2.7,wy=2.8+f*3.1;queueWindow(x+w/2+.015,wy,wz,.035,1.35,.9,rand()>t.litThreshold+.02);queueWindow(x-w/2-.015,wy,wz,.035,1.35,.9,rand()>t.litThreshold+.02);}
      }
      if(rand()>.45){box(x-w*.2,h+1,z+d*.2,w*.3,1.4,d*.24,t.shed,city,false);}
      if(rand()>.7){waterTank(x+w*.2,h+.6,z-d*.2,.65,city,t);}
    }
  }
  for(let gx=-7;gx<=7;gx++)for(let gz=Math.floor((zFar-120)/26);gz<=Math.ceil((zNear+104)/26);gz++){
    const x=gx*24+between(-2,2),z=gz*26+between(-2,2),w=between(12,19),d=between(13,20);
    if(COURSE.some(p=>Math.abs(p.x-x)<(p.w+w)/2+3&&Math.abs(p.z-z)<(p.d+d)/2+3))continue;
    if(TOWERS.some(p=>Math.abs(p.x-x)<(p.w+w)/2+2&&Math.abs(p.z-z)<(p.d+d)/2+2))continue;
    if(inWater(x,z+d/2)||inPlaza(x,z))continue;
    const proximity=x>bounds.minX-25&&x<bounds.maxX+25&&z>zFar-28&&z<zNear+28;
    let h=proximity?between(...t.heights.near):between(...t.heights.far);
    if(z<zFar-45)h=between(...t.heights.back);
    // On the hillside the houses follow the ground, so the top of the course looks down over them.
    if(decor.slope)h=between(...t.heights.near)+hill(x,z);
    building(x,z,w,d,h,t.facades[Math.floor(rand()*t.facades.length)],true);
  }
  // Distant skyline stays simple, letting the playable rooftops read clearly.
  for(let i=0;i<54;i++){const x=between(-310,280),z=between(zFar-270,zFar-160),h=between(28,112);building(x,z,between(13,25),between(13,24),h,t.skyline,false);if(i%7===0)box(x,h+6,z,1,12,1,t.skyline,city,false);}
  const streetEnd=decor.water?decor.water.z:zNear+165,streetStart=zFar-165;
  // Straight avenues belong to the flat districts; the hillside is terraces instead.
  if(!decor.slope)for(let x=-168;x<=168;x+=24){box(x+12,.04,(streetStart+streetEnd)/2,4,.06,streetEnd-streetStart,t.street,city,false);for(let z=zFar-125;z<=streetEnd-6;z+=17)box(x+12,.09,z,.15,.04,3,t.streetMark,city,false);}
  COURSE.forEach((p,i)=>{
    box(p.x,p.y/2,p.z,p.w,p.y,p.d,t.roofTops[i%4],routeGroup);
    box(p.x,p.y-.2,p.z,p.w+.38,.45,p.d+.38,t.roofBand,routeGroup);
    box(p.x,p.y+.01,p.z,p.w-.6,.04,p.d-.6,t.roofFloor,routeGroup);
    // Corner rails leave broad take-off and landing openings on all four sides.
    for(const side of [-1,1])for(const end of [-1,1]){
      box(p.x+side*(p.w/2-.12),p.y+.27,p.z+end*(p.d/2-1.4),.27,.54,2.8,t.parapet,routeGroup);
      box(p.x+side*(p.w/2-1.4),p.y+.27,p.z+end*(p.d/2-.12),2.8,.54,.27,t.parapet,routeGroup);
    }
    for(let f=3;f<p.y-1;f+=3.2)for(let c=-p.w/2+1.5;c<p.w/2-1;c+=2.8){queueWindow(p.x+c,f,p.z+p.d/2+.03,1.2,1.6,.06,rand()>t.routeLitThreshold);queueWindow(p.x+c,f,p.z-p.d/2-.03,1.2,1.6,.06,rand()>t.routeLitThreshold+.02);}
    for(let f=3;f<p.y-1;f+=3.2)for(let c=-p.d/2+1.5;c<p.d/2-1;c+=2.8){queueWindow(p.x+p.w/2+.03,f,p.z+c,.06,1.6,1.2,rand()>t.routeLitThreshold+.02);queueWindow(p.x-p.w/2-.03,f,p.z+c,.06,1.6,1.2,rand()>t.routeLitThreshold+.02);}
    const ring=new THREE.Mesh(new THREE.TorusGeometry(p.required?2.1:1,.055,6,48),new THREE.MeshBasicMaterial({color:p.required?t.takeoff:t.ring,transparent:true,opacity:p.required?.85:.18}));ring.rotation.x=-Math.PI/2;ring.position.set(p.x,p.y+.095,p.z);routeGroup.add(ring);checkpointMeshes.push(ring);
    if(p.required){
      const beacon=new THREE.Group();beacon.position.set(p.x,p.y+6.5,p.z);worldRoot.add(beacon);
      const symbol=labelSprite(p.label,t.label,.95);beacon.add(symbol);
      const diamond=new THREE.Mesh(new THREE.OctahedronGeometry(.35),new THREE.MeshBasicMaterial({color:t.takeoff}));diamond.position.y=-1.1;beacon.add(diamond);
      beacon.userData={index:i,baseY:p.y+6.5};objectiveBeacons.push(beacon);
    }else if(i===0){const label=labelSprite('FREE ROUTE',t.label,.48);label.position.set(p.x,p.y+1.2,p.z-7);routeGroup.add(label);}
    // Edge arrows show every way off this roof: mint goes both ways, orange is a drop you cannot climb back.
    for(const n of neighbors(COURSE,i)){
      const q=COURSE[n],g=linkGeometry(p,q);if(!g)continue;
      const [dx,dz]=g.dir,a=Math.atan2(dx,-dz),distance=(g.axis==='z'?p.d:p.w)/2-2.2,oneWay=!q.links.includes(i);
      arrow(p.x+dx*distance,p.y+.07,p.z+dz*distance,a,routeGroup,oneWay?t.takeoff:t.accent,oneWay?1:.85);
      if(oneWay)arrow(p.x+dx*(distance-1.3),p.y+.07,p.z+dz*(distance-1.3),a,routeGroup,t.takeoff,.7);
    }
    roofProps(i,p,t,routeGroup);
  });
  // The facade you kick up is marked on the building itself: a recessed service bay, painted edges,
  // rungs and a grab rail at the lip. Nothing is built out into the air.
  for(const wall of WALLS){
    const b=COURSE[wall.to],alongZ=wall.axis==='z',g=oriented(routeGroup,b.x,b.z,wall.dir);
    const front=(alongZ?b.d:b.w)/2+.06,low=COURSE[wall.from].y-7,high=b.y+.2,width=Math.min((alongZ?b.w:b.d)-2,10);
    box(0,(low+high)/2,front,width,high-low,.14,t.climbWall,g);
    for(const s of [-1,1])box(s*(width/2-.45),(low+high)/2,front+.08,.5,high-low,.1,t.takeoff,g);
    for(let y=low+1.7;y<high-.7;y+=1.9)box(0,y,front+.08,width-2.6,.22,.1,t.climbRung,g);
    box(0,b.y+.22,front-.22,width*.5,.2,.55,t.climbRung,g);
  }
  districtDecor(t,decor,props,bounds);
  for(const gate of GATES)slideGate(gate,COURSE[gate.index],t,routeGroup);
  // Wall sections are neighbouring buildings that simply rise higher than the course. You run along
  // their side and kick off it; nothing is added to the rooftops themselves.
  for(const tower of TOWERS){
    building(tower.x,tower.z,tower.w,tower.d,tower.top,t.facades[Math.floor(rand()*t.facades.length)],true);
    towerFace(tower,t,routeGroup);
  }
  // The central roof is the only start; the last unvisited objective is your finish.
  for(let i=0;i<10;i++)box(start.x-4.5+i,start.y+.075,start.z+6.5,.9,.07,1,i%2?t.stripe:t.stripeAlt,routeGroup);
  landmarks(t,props,placed,midZ,zNear,zFar);
  instanceWindows(windowMatrices,t.dimWindow,0);instanceWindows(litMatrices,t.litWindow,t.litGlow);
  for(let i=0;i<9;i++){const g=new THREE.Group();const mat=new THREE.LineBasicMaterial({color:t.bird});g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-.65,.14,0),new THREE.Vector3(0,0,0),new THREE.Vector3(.65,.14,0)]),mat));g.position.set(between(-80,90),start.y+between(24,48),between(zFar+10,zNear-40));g.userData={base:g.position.clone(),phase:rand()*10};worldRoot.add(g);birds.push(g);}
  // Batch static architecture by material to keep draw calls low on integrated GPUs.
  for(const root of [city,routeGroup,props]){
    root.updateMatrixWorld(true);const batches=new Map();const originals=[];
    root.traverse(m=>{if(!m.isMesh||checkpointMeshes.includes(m))return;const key=m.material.uuid+':'+m.castShadow;const list=batches.get(key)||{material:m.material,shadow:m.castShadow,geometries:[]};list.geometries.push(m.geometry.clone().applyMatrix4(m.matrixWorld));batches.set(key,list);originals.push(m);});
    for(const group of batches.values()){const geometry=mergeGeometries(group.geometries);if(geometry){const mesh=new THREE.Mesh(geometry,group.material);mesh.castShadow=group.shadow;mesh.receiveShadow=true;root.add(mesh);}group.geometries.forEach(g=>g.dispose());}
    originals.forEach(m=>{if(m.geometry!==boxGeometry)m.geometry.dispose();m.removeFromParent();});
  }
  tracking=false;
  applyTheme(t);
}
// The cylinder helper builds along Y, so lay one on its side for a pipe or a washing line.
function tube(x,y,z,length,radius,color,parent,axis='x',sides=8){
  const m=new THREE.Mesh(new THREE.CylinderGeometry(radius,radius,length,sides),typeof color==='string'?material(color):color);
  m.position.set(x,y,z);if(axis==='x')m.rotation.z=Math.PI/2;else if(axis==='z')m.rotation.x=Math.PI/2;
  m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
// Rooftop services strung across the run line: too low to run under, so you drop into a slide. The
// lane beside the posts stays open for anyone who would rather go around and lose the time.
function slideGate(gate,p,t,parent){
  // Drawn across local x at local z=0; the frame is turned to face the lane it blocks.
  const g=oriented(parent,gate.x,gate.z,gate.axis==='z'?[0,-1]:[1,0]);
  const half=gate.span/2,bottom=gate.bottom,top=gate.top,mid=(bottom+top)/2,y0=p.y;
  for(const s of [-1,1]){
    box(s*half,(y0+top)/2,0,.26,top-y0,.3,t.climbWall,g);
    box(s*half,y0+.11,0,.85,.22,1.05,t.climbWall,g);
    box(s*(half-.45),mid+.55,0,.9,.14,.14,t.climbWall,g);
  }
  // Hazard bar at the clearance line — the thing you would hit on your feet.
  box(0,bottom+.28,0,gate.span,.5,.5,t.takeoff,g);
  for(const face of [-.27,.27])for(let x=-half+.9;x<half-.5;x+=1.7)box(x,bottom+.28,face,.75,.52,.06,t.stripe,g);
  if(gate.kind==='duct'){
    tube(0,mid+.55,0,gate.span,.5,t.shed,g);
    for(let x=-half+1.5;x<half-1;x+=2.6)tube(x,mid+.55,0,.18,.58,t.crownInner,g);
    box(0,top-.1,0,gate.span*.55,.34,1.5,t.shed,g);
    for(const s of [-1,1])tube(s*(half-1.7),mid+.55,.8,1.2,.13,t.climbWall,g,'z');
  }else if(gate.kind==='laundry'){
    box(0,mid+.55,0,gate.span,.16,.16,t.climbWall,g);
    const cloth=['#e7d9c5','#cf8f7a','#8fa9c0','#dcc98f','#b9c3ab'];
    for(const line of [-.55,.55])tube(0,top-.12,line,gate.span,.06,t.climbWall,g);
    for(let j=0,x=-half+1.3;x<half-.9;x+=1.85,j++){
      const h=.85+(j%3)*.22;
      box(x,top-.12-h/2,-.55,1.35,h,.05,cloth[j%cloth.length],g);
      if(j%2)box(x+.6,top-.12-h*.4,.55,1.15,h*.8,.05,cloth[(j+2)%cloth.length],g);
    }
  }else{
    box(0,top-.06,0,gate.span,.16,2.8,t.parapetCap,g);
    for(let x=-half+1;x<half-.6;x+=1.5)box(x,top-.18,0,.5,.14,2.8,t.takeoff,g);
    for(const s of [-1,1])for(const z of [-1.1,1.1])box(s*(half-.25),mid+.45,z,.12,top-bottom,.12,t.climbWall,g);
  }
  // Painted run-ups on both sides telling you where to go down.
  for(const side of [-1,1]){
    box(0,y0+.06,side*3.8,gate.span*.8,.06,.5,t.takeoff,g);
    for(let j=0;j<3;j++)box(0,y0+.06,side*(2.6-j*.95),gate.span*.55-j*1.2,.06,.3,t.wallTrim,g);
  }
  const label=labelSprite('SLIDE · SHIFT',t.wallTrim,.6);label.position.set(0,top+.9,0);g.add(label);
}
// Rooftop furniture stays out of the lanes that cross a roof. Roofs crossed one way get furniture along
// the other two edges; roofs crossed both ways only get it in the corners.
function roofProps(i,p,t,parent){
  const axes=new Set(COURSE.flatMap((q,j)=>j!==i&&(p.links.includes(j)||q.links.includes(i))?[linkGeometry(p,q)?.axis]:[]).filter(Boolean));
  if(axes.has('x')&&axes.has('z')){
    const corner=(sx,sz)=>[p.x+sx*(p.w/2-2.4),p.z+sz*(p.d/2-2.4)],[ax,az]=corner(-1,-1),[bx,bz]=corner(1,1);
    if(t.props==='crate'){for(const [x,z] of [[ax,az],[bx,bz]]){box(x,p.y+.55,z,2.2,1.1,2.2,'#6f7f86',parent);box(x+.3,p.y+1.35,z-.2,1.6,.5,1.6,'#8a6a4e',parent);}}
    else if(t.props==='unit'){for(const [x,z] of [[ax,az],[bx,bz]]){box(x,p.y+.65,z,2.4,1.3,2,'#7e7a8e',parent);cylinder(x,p.y+1.37,z,.58,.58,.16,'#4c4860',parent,10);}}
    else if(t.props==='green'){for(const [x,z] of [[ax,az],[bx,bz]]){box(x,p.y+.3,z,1.6,.6,1.6,'#a89a86',parent);const plant=new THREE.Mesh(new THREE.IcosahedronGeometry(.7,0),material('#93a98d'));plant.position.set(x,p.y+.9,z);plant.scale.y=.72;parent.add(plant);}}
    else {waterTank(ax,p.y,az,.6,parent,t);box(bx,p.y+.6,bz,2.2,1.2,2,'#939392',parent);}
    return;
  }
  if(axes.has('x')){
    // Draw the north–south layout in a frame turned a quarter, so the furniture lines the long edges.
    const g=oriented(parent,p.x,p.z,[1,0]);
    return roofPropsAlongZ(i,{...p,x:0,z:0,w:p.d,d:p.w},t,g);
  }
  return roofPropsAlongZ(i,p,t,parent);
}
function roofPropsAlongZ(i,p,t,parent){
  const left=p.x-p.w/2+2.4,right=p.x+p.w/2-2.2,back=p.z+p.d/2-3;
  if(t.props==='crate'){
    for(let j=0;j<3;j++){const h=1.1+(j%2)*.5;box(left+(j%2)*1.1,p.y+h/2,p.z-3+j*2.6,2.2,h,2.2,j%2?'#8a6a4e':'#6f7f86',parent);}
    if(i%2){const coil=new THREE.Mesh(new THREE.TorusGeometry(.8,.22,6,14),material('#c9b183'));coil.rotation.x=-Math.PI/2;coil.position.set(right,p.y+.25,back);parent.add(coil);}
    else for(let j=0;j<3;j++)cylinder(right,p.y+.55,back-j*2.4,.32,.4,1.1,'#6d7a80',parent,8);
  }else if(t.props==='unit'){
    for(let j=0;j<2;j++){const x=j?right:left,z=p.z-2+j*3.4;box(x,p.y+.65,z,2.6,1.3,2.2,'#7e7a8e',parent);cylinder(x,p.y+1.37,z,.62,.62,.16,'#4c4860',parent,10);}
    if(i%3===1){cylinder(right,p.y+1.6,back,.1,.1,3.2,'#6a647e',parent,6);const dish=new THREE.Mesh(new THREE.SphereGeometry(1,10,8,0,Math.PI*2,0,Math.PI/2.4),material('#b9b2c6'));dish.rotation.set(.95,0,0);dish.position.set(right,p.y+3.3,back);parent.add(dish);}
  }else if(t.props==='green'){
    if(i%2===0){box(left+.6,p.y+1.1,p.z-1,4.2,2.2,5.4,'#cfd8d2',parent);box(left+.6,p.y+2.32,p.z-1,4.4,.16,5.6,'#e8efe6',parent);}
    else for(let j=0;j<4;j++){const z=p.z-4+j*2.1;box(left,p.y+.3,z,1.2,.6,1.6,'#a89a86',parent);const plant=new THREE.Mesh(new THREE.IcosahedronGeometry(.62,0),material('#93a98d'));plant.position.set(left,p.y+.86,z);plant.scale.y=.72;parent.add(plant);}
    if(i%3===2)box(right,p.y+.55,back,2.2,1.1,2,'#9a9a98',parent);
  }else{
    if(i%3===0)waterTank(left-.2,p.y,p.z-2,.78,parent,t);
    else {box(right,p.y+.6,p.z+2,2.4,1.2,2.1,'#939392',parent);box(right,p.y+1.25,p.z+2,2.5,.15,2.2,'#cbc0a8',parent);for(let j=0;j<5;j++)box(right-.8+j*.4,p.y+1.34,p.z+2,.09,.05,1.4,'#717a80',parent);}
    if(i%3===2)for(let j=0;j<3;j++){const z=p.z-3+j*2.2;box(right,p.y+.3,z,1.1,.6,1.5,'#936d64',parent);const plant=new THREE.Mesh(new THREE.IcosahedronGeometry(.73,0),material('#7d9180'));plant.position.set(right,p.y+.9,z);plant.scale.y=.7;parent.add(plant);}
  }
}
// Paint, a fire escape and drain pipes on the alley face: the runnable side reads as maintenance
// hardware on a real building rather than as a prop dropped onto the course.
function towerFace(tower,t,parent){
  // Local frame: travel runs toward -z, local x is the alley's right-hand side.
  const g=oriented(parent,tower.x,tower.z,tower.dir);
  const dir=tower.side,face=-dir*tower.width/2,off=face-dir*.08,length=tower.span;
  const low=Math.min(tower.entryY,tower.exitY),high=Math.max(tower.entryY,tower.exitY);
  const back=length/2,front=-length/2;
  box(off,tower.entryY+2.5,0,.16,.5,length*.97,t.wallTrim,g);
  box(off,tower.entryY+2.5-.42,0,.13,.16,length*.97,t.wallRung,g);
  for(let z=front+1.6;z<back-1;z+=3.4)box(off,tower.entryY+4.6,z,.12,1.2,.26,t.wallRung,g);
  // Fire escape at the far end of the alley, climbing to the roof you land on.
  const lz=front+1.4,rail=high-low+11;
  for(const s of [-1,1])box(off,low+rail/2-4,lz+s*.45,.12,rail,.12,t.climbWall,g);
  for(let y=low-4;y<high+2;y+=1.15)box(off,y,lz,.14,.1,.9,t.climbRung,g);
  box(off-dir*.3,high+1.2,lz,.75,.12,1.3,t.climbWall,g);
  // Drain pipes and a couple of service brackets down the rest of the face.
  cylinder(off,tower.entryY-9,back-2.4,.17,.17,34,t.climbWall,g,6);
  for(let y=tower.entryY-8;y<tower.entryY+6;y+=4.5)box(off,y,back-2.4,.42,.16,.42,t.climbWall,g);
  if(tower.lead){
    box(off,tower.entryY+8.4,0,.1,2.6,Math.min(7,length*.8),t.wall,g);
    const label=labelSprite('WALL RUN',t.wallTrim,.62);label.position.set(face-dir*3.4,tower.entryY+3.6,back-1.2);g.add(label);
  }
}
// Each district's ground: an open square, the sea, or terraces climbing a hillside.
function groundFor(t,decor,parent,midZ,bounds){
  if(decor.water){
    const shore=decor.water.z;
    box(0,-1,shore-1500,3000,2,3000,t.ground,parent,false);
    box(0,-.6,shore+800,3000,.4,1600,material('#46677a',{roughness:.35,metalness:.1}),parent,false);
    box(0,.3,shore+1,3000,1.2,2,t.crownInner,parent,false);
    for(let i=0;i<90;i++)box(between(bounds.minX-160,bounds.maxX+160),-.38,between(shore+8,bounds.maxZ+140),between(2,6),.04,.18,'#9fc0c9',parent,false);
    return;
  }
  box(0,-1,midZ,3000,2,3000,t.ground,parent,false);
  if(decor.plaza){
    const {x,z,r}=decor.plaza;
    cylinder(x,.05,z,r,r,.1,t.roofFloor,parent,48);
    for(const ring of [r-2.5,r*.62])cylinder(x,.11,z,ring,ring,.04,t.parapetCap,parent,48);
    cylinder(x,.12,z,r*.62-1.2,r*.62-1.2,.05,t.roofFloor,parent,48);
    for(let i=0;i<18;i++){const a=i/18*Math.PI*2,tx=x+Math.cos(a)*(r-6),tz=z+Math.sin(a)*(r-6);
      cylinder(tx,1.4,tz,.22,.28,2.8,'#6b5a52',parent,6);
      const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(2.1,0),material(i%2?'#8a9a78':'#9aa884'));crown.position.set(tx,4.2,tz);crown.scale.y=.85;parent.add(crown);}
  }
  if(decor.slope){
    // Terraced ground in 3m steps, stepping up toward the top of the hill.
    for(let gx=-8;gx<=8;gx++)for(let gz=-8;gz<=8;gz++){
      const x=gx*40,z=gz*40,h=THREE.MathUtils.clamp(Math.round(((decor.slope.x*x+decor.slope.z*z)*.12+5)/3)*3,0,18);
      if(h>0)box(x,h/2,z,40.5,h,40.5,gx%2===gz%2?t.ground:t.street,parent,false);
    }
  }
}
function districtDecor(t,decor,parent,bounds){
  if(decor.spire){
    // A hologram mast in the empty core the spiral climbs around.
    const cx=(bounds.minX+bounds.maxX)/2-4,cz=(bounds.minZ+bounds.maxZ)/2-10;
    cylinder(cx,36,cz,1.2,2.6,72,'#2a2540',parent,8);
    for(let y=8;y<70;y+=7)cylinder(cx,y,cz,2.9-y*.02,2.9-y*.02,.5,material(y%14?'#7ef0d0':'#ff7ac8',{emissive:y%14?'#7ef0d0':'#ff7ac8',emissiveIntensity:1.1}),parent,8);
    box(cx,76,cz,.4,10,.4,material('#ffd27a',{emissive:'#ffd27a',emissiveIntensity:1.4}),parent,false);
  }
  if(decor.water?.lighthouse){
    const [lx,lz]=decor.water.lighthouse;
    cylinder(lx,15,lz,3.1,4.7,30,'#d5dde0',parent);
    cylinder(lx,31.4,lz,3.5,3.5,2.6,material('#ffdca6',{emissive:'#ffbe70',emissiveIntensity:1.2}),parent,10);
    cylinder(lx,34,lz,0,3.9,2.4,'#8d4a48',parent,10);
    for(let y=6;y<28;y+=5)cylinder(lx,y,lz,3.9-y*.03,3.9-y*.03,.5,'#8d4a48',parent,10);
    cylinder(lx,.2,lz,7,8,1.2,'#8a8f92',parent,16);
  }
}
function instanceWindows(matrices,color,emissive){if(!matrices.length)return;const mesh=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color,roughness:.85,emissive:color,emissiveIntensity:emissive}),matrices.length);matrices.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.instanceMatrix.needsUpdate=true;worldRoot.add(mesh);}
// Each district gets one silhouette of its own, built from the same primitives.
function landmarks(t,parent,placed,midZ,zNear,zFar){
  if(t.landmark==='crane'){
    const crane=new THREE.Group();crane.position.set(districtBounds(COURSE).maxX+36,0,midZ-27);parent.add(crane);
    box(0,27,0,1.4,54,1.4,'#ad7f78',crane,false);box(-10,53,0,42,.7,.8,'#c89a87',crane,false);box(0,55,0,.65,5,.65,'#c89a87',crane,false);
    for(let x=-28;x<=8;x+=4){box(x,54,0,.18,2,.18,'#c89a87',crane,false);}box(-23,43,0,.06,20,.06,'#675f75',crane,false);
    const cablePoints=[new THREE.Vector3(-30,53,0),new THREE.Vector3(0,57,0),new THREE.Vector3(10,53,0)];crane.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(cablePoints),new THREE.LineBasicMaterial({color:'#a88685'})));
  }
  if(t.landmark==='containers'){
    const colors=['#b8664f','#4f7f8e','#7f8a55','#9a6f4f','#6d5f7a'];
    // Container stacks line the quay edge on land, clear of the playable roofs.
    const shore=map.decor?.water?.z??zNear;
    for(let i=0;i<60;i++){
      const x=between(-170,170),z=between(zFar-40,shore-4);
      if(COURSE.some(p=>Math.abs(p.x-x)<p.w/2+7&&Math.abs(p.z-z)<p.d/2+7))continue;
      if(TOWERS.some(p=>Math.abs(p.x-x)<p.w/2+5&&Math.abs(p.z-z)<p.d/2+5))continue;
      const stack=1+Math.floor(rand()*3);
      for(let s=0;s<stack;s++)box(x,1.3+s*2.6,z,6.2,2.5,2.6,colors[Math.floor(rand()*colors.length)],parent,false);
    }
  }
  if(t.landmark==='billboards'){
    const signs=['#ff7ac8','#7ef0d0','#ffd27a','#9b8cff','#ff9a6c'];
    const tall=placed.filter(b=>b.h>18).sort(()=>rand()-.5).slice(0,18);
    tall.forEach((b,i)=>{
      const color=signs[i%signs.length];
      box(b.x,b.h+4.6,b.z+b.d/2*.9,b.w*.82,7.4,.5,material(color,{emissive:color,emissiveIntensity:.85}),parent,false);
      box(b.x,b.h+4.6,b.z+b.d/2*.9+.3,b.w*.9,8.2,.3,'#2a2540',parent,false);
      box(b.x,b.h+.6,b.z+b.d/2*.9,.5,8,.5,'#2a2540',parent,false);
      if(i%3===0)for(let j=0;j<4;j++)box(b.x-b.w/2+1.2,b.h*.5+j*4,b.z-b.d/2-.2,.35,3,.35,material(color,{emissive:color,emissiveIntensity:.7}),parent,false);
    });
  }
  if(t.landmark==='masts'){
    const tall=placed.filter(b=>b.h>14).sort(()=>rand()-.5).slice(0,12);
    tall.forEach(b=>{
      const h=between(9,17);
      cylinder(b.x+b.w*.25,b.h+h/2,b.z-b.d*.25,.12,.22,h,'#9a9a9e',parent,6);
      for(let j=1;j<3;j++)box(b.x+b.w*.25,b.h+h*j/3,b.z-b.d*.25,1.5,.1,.1,'#9a9a9e',parent,false);
      box(b.x+b.w*.25,b.h+h+.4,b.z-b.d*.25,.42,.42,.42,material('#ff8a72',{emissive:'#ff6a4c',emissiveIntensity:1}),parent,false);
    });
  }
}
function applyTheme(t){
  scene.fog.color.set(t.fog);scene.fog.density=t.fogDensity;
  skyUniforms.top.value.set(t.sky[0]);skyUniforms.middle.value.set(t.sky[1]);skyUniforms.bottom.value.set(t.sky[2]);
  const b=districtBounds(COURSE);
  sun.material.color.set(t.sunSphere);sun.position.set(t.sunPos[0],t.sunPos[1]+start.y-20,t.sunPos[2]+(b.minZ+b.maxZ)/2);
  hemi.color.set(t.hemiSky);hemi.groundColor.set(t.hemiGround);hemi.intensity=t.hemiIntensity;
  sunLight.color.set(t.sunColor);sunLight.intensity=t.sunIntensity;
  renderer.toneMappingExposure=t.exposure;
  document.documentElement.style.setProperty('--accent',t.ui);
}

// ------------------------------------------------------------------- runner
const runner=new THREE.Group();scene.add(runner);
const rig=new THREE.Group();runner.add(rig);
box(0,1.1,0,.57,.66,.35,rigMaterial('#e8bc83'),rig);
box(0,1.18,.19,.42,.42,.13,rigMaterial('#d67b5c'),rig);
box(0,1.53,0,.39,.4,.37,rigMaterial('#c49278'),rig);
box(0,1.73,.015,.42,.16,.4,rigMaterial('#383845'),rig);
box(0,1.67,.07,.43,.16,.35,rigMaterial('#383845'),rig);
box(0,1.34,-.03,.6,.14,.38,rigMaterial('#f49368'),rig);
const scarf=box(.2,1.3,.38,.14,.09,.55,rigMaterial('#fa9167'),rig);
const leftArm=new THREE.Group();leftArm.position.set(-.39,1.34,0);rig.add(leftArm);box(0,-.25,0,.19,.52,.21,rigMaterial('#e8b883'),leftArm);box(0,-.54,0,.17,.15,.18,rigMaterial('#c49278'),leftArm);
const rightArm=leftArm.clone();rightArm.position.x=.39;rig.add(rightArm);
const leftLeg=new THREE.Group();leftLeg.position.set(-.17,.79,0);rig.add(leftLeg);box(0,-.29,0,.23,.6,.25,rigMaterial('#3d414d'),leftLeg);box(0,-.64,-.08,.26,.16,.43,rigMaterial('#e2d5b8'),leftLeg);
const rightLeg=leftLeg.clone();rightLeg.position.x=.17;rig.add(rightLeg);
const contactShadow=new THREE.Mesh(new THREE.CircleGeometry(.65,20),new THREE.MeshBasicMaterial({color:'#3c3848',transparent:true,opacity:.22,depthWrite:false}));contactShadow.rotation.x=-Math.PI/2;scene.add(contactShadow);
const targetBeacon=new THREE.Group();scene.add(targetBeacon);
const beaconMaterial=new THREE.MeshBasicMaterial({color:'#c8f1c6'});
const beaconDiamond=new THREE.Mesh(new THREE.OctahedronGeometry(.36),beaconMaterial);targetBeacon.add(beaconDiamond);
const beaconStem=new THREE.Mesh(new THREE.CylinderGeometry(.016,.016,3,5),new THREE.MeshBasicMaterial({color:'#c8f1c6',transparent:true,opacity:.35}));beaconStem.position.y=-1.9;targetBeacon.add(beaconStem);

// --------------------------------------------------------------- game state
let state='home',player=createPlayer(),checkpoint=0,falls=0,elapsed=0,countdownLeft=0;
let run=createRun(COURSE),targetIndex=null;
let storageAvailable=true;
const recordStore=new Map();
function loadRecords(m){try{return sanitizeRecords(JSON.parse(localStorage.getItem(m.storageKey)||'[]'));}catch{storageAvailable=false;return [];}}
MAPS.forEach(m=>recordStore.set(m.id,loadRecords(m)));
let map=MAPS[0];
try{const saved=localStorage.getItem('roofrunner-map');if(saved&&MAPS.some(m=>m.id===saved))map=MAPS.find(m=>m.id===saved);}catch{}
let recordsView=map.id;
const records=()=>recordStore.get(map.id);
let soundEnabled=false,audioContext=null,noticeTimer,toastTimer;
const keys=new Set();let jumpPressed=false,slidePressed=false;const announcedGates=new Set();
let cameraYaw=0,inputYaw=0,inputSignature='',runAnimation=0,cameraReady=false,accumulator=0;
const cameraTarget=new THREE.Vector3(),cameraDesired=new THREE.Vector3(),lookDesired=new THREE.Vector3();
const formatBest=(time)=>{const s=formatTime(time);return `${s.slice(0,2)}<span>:</span>${s.slice(3,5)}<small>${s.slice(5)}</small>`;};
function bestOf(id){return recordStore.get(id)[0]?.time;}

// ------------------------------------------------------------ map selection
// A north-up plan shows branches instead of implying a single correct route.
function courseArt(m,width=180,height=95){
  const bounds=districtBounds(m.course),scale=Math.min((width-20)/(bounds.maxX-bounds.minX),(height-14)/(bounds.maxZ-bounds.minZ));
  const cx=(bounds.minX+bounds.maxX)/2,cz=(bounds.minZ+bounds.maxZ)/2;
  return `<svg viewBox="0 0 ${width} ${height}" fill="none">${m.course.map((p,i)=>`<rect x="${width/2+(p.x-cx-p.w/2)*scale}" y="${height/2+(p.z-cz-p.d/2)*scale}" width="${p.w*scale}" height="${p.d*scale}" rx="1" fill="${p.required?'var(--accent)':i===0?'#bde5b9':'#b5adac'}" opacity="${p.required||i===0?.85:.24}"/>`).join('')}</svg>`;
}
function renderMiniMap(){
  const b=districtBounds(COURSE),size=196,pad=13,scale=(size-pad*2)/Math.max(b.maxX-b.minX,b.maxZ-b.minZ);
  const mx=x=>pad+(x-b.minX)*scale,mz=z=>pad+(z-b.minZ)*scale;
  // Links under the roofs: solid both ways, dashed for drops you cannot climb back up.
  const lines=COURSE.flatMap((p,i)=>p.links.filter(j=>!(COURSE[j].links.includes(i)&&j<i)).map(j=>{const q=COURSE[j],oneWay=!q.links.includes(i);
    return `<line x1="${mx(p.x)}" y1="${mz(p.z)}" x2="${mx(q.x)}" y2="${mz(q.z)}" stroke="${oneWay?'var(--accent)':'#f4eddf'}" stroke-opacity="${oneWay?.55:.22}" stroke-width="1.4" ${oneWay?'stroke-dasharray="2 2"':''}/>`;})).join('');
  $('#minimap-svg').innerHTML=lines+COURSE.map((p,i)=>`<g ${p.required?`data-objective="${i}" role="button" tabindex="0" aria-label="목표 ${p.label} 선택"`:''}><rect x="${mx(p.x-p.w/2)}" y="${mz(p.z-p.d/2)}" width="${p.w*scale}" height="${p.d*scale}" rx="2" class="map-roof ${p.required?'required':''}" id="map-roof-${i}"/>${p.required?`<text x="${mx(p.x)}" y="${mz(p.z)+3}" text-anchor="middle">${p.label}</text>`:''}</g>`).join('')+`<path id="map-player" d="M0 -6 4 5 0 3 -4 5Z" fill="#fff4df" stroke="#292a31" stroke-width="1.2"/>`;
  $('#minimap-svg').querySelectorAll('[data-objective]').forEach(el=>{
    const choose=()=>{const i=Number(el.dataset.objective);if(!run.visited.has(i)){targetIndex=i;updateProgress();}};
    el.addEventListener('click',choose);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();choose();}});
  });
  $('#objective-list').innerHTML=COURSE.filter(p=>p.required).sort((a,b)=>a.label.localeCompare(b.label)).map(p=>`<span id="objective-${p.label}">${p.label}</span>`).join('');
  return {mx,mz};
}
let miniProjection=null;
function updateProgress(){
  if(targetIndex===null||run.visited.has(targetIndex))targetIndex=nearestUnvisited(run,player,COURSE);
  $('#checkpoint-label').textContent=`필수 옥상 ${run.visited.size} / ${run.required.size}`;
  $('#progress-fill').style.width=(run.visited.size/run.required.size*100)+'%';
  $('#finish-label').textContent='방문 순서 자유';
  COURSE.forEach((p,i)=>{
    const done=run.visited.has(i),chosen=targetIndex===i;
    $(`#map-roof-${i}`)?.classList.toggle('visited',done);$(`#map-roof-${i}`)?.classList.toggle('selected',chosen);
    if(p.required)$(`#objective-${p.label}`)?.classList.toggle('visited',done);
  });
  $('#map-target').textContent=targetIndex===null?'모든 옥상 방문 완료':`선택 목표 ${COURSE[targetIndex].label} · 지도에서 변경`;
}
function renderMapCard(){
  $('#course-art').innerHTML=courseArt(map);
  $('#course-code').textContent=map.code;
  $('#course-name').textContent=map.name;
  $('#course-latin').textContent=map.latin;
  $('#course-tags').innerHTML=map.tags.map(tag=>`<span>${tag}</span>`).join('<i></i>');
  $('#view-indicator-count').textContent=`${String(MAPS.indexOf(map)+1).padStart(2,'0')} / ${String(MAPS.length).padStart(2,'0')}`;
  $('#scene-place').textContent=map.place;
  $('#scene-coords').innerHTML=map.coords;
  $('#hud-course-name').textContent=map.latin.toUpperCase();
  $('#hud-course-code').textContent=map.code;
  $('#finish-label').textContent='방문 순서 자유';miniProjection=renderMiniMap();updateProgress();
  $('#map-count').textContent=String(MAPS.length).padStart(2,'0');
}
function openMaps(){
  modal(`<div class="modal-eyebrow">CHOOSE YOUR CITY</div><h2 id="modal-title">오늘은 어디를 달릴까요.</h2><p class="modal-description">각 도시의 필수 옥상 8곳을 원하는 순서로 방문하세요.<br>기록은 코스별로 따로 저장됩니다.</p><div class="map-list">${MAPS.map(m=>{
    const best=bestOf(m.id);
    return `<button class="map-option${m.id===map.id?' selected':''}" data-map="${m.id}"><span class="map-option-art">${courseArt(m,120,60)}</span><span class="map-option-body"><span class="map-option-top">${m.code}<i class="map-difficulty">${m.difficulty}</i></span><strong>${m.name}</strong><small>${m.blurb}</small><span class="map-option-tags">${m.tags.map(tag=>`<span>${tag}</span>`).join('')}</span></span><span class="map-option-best">${best?formatTime(best):'기록 없음'}<i>${m.id===map.id?'선택됨':'선택하기 ↗'}</i></span></button>`;
  }).join('')}</div>`);
  $('#modal-content').querySelectorAll('.map-option').forEach(button=>button.onclick=()=>{const id=button.dataset.map;hideModal();if(id!==map.id)applyMap(id);else notice(`${map.name} 코스를 달리는 중입니다.`);});
}
function applyMap(id){
  showLoading(`${MAPS.find(m=>m.id===id).name} 코스를 여는 중...`);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    map=selectMap(id);recordsView=map.id;
    try{localStorage.setItem('roofrunner-map',map.id);}catch{storageAvailable=false;}
    buildWorld(map);
    checkpoint=0;falls=0;elapsed=0;player=createPlayer();run=createRun(COURSE);targetIndex=null;cameraYaw=0;inputYaw=0;inputSignature='';cameraReady=false;
    renderMapCard();updateRecords();
    renderer.compile(scene,camera);
    hideLoading();notice(`${map.name} · ${map.difficulty} 코스로 이동했습니다.`);
    tone(520,.12);
  }));
}
function showLoading(text){const el=$('#loading');el.querySelector('.loading-text').textContent=text;el.classList.remove('hidden');el.style.opacity='1';}
function hideLoading(){const el=$('#loading');el.style.opacity='0';setTimeout(()=>el.classList.add('hidden'),600);}

function updateRecords(){
  const list=records();
  $('#record-count').textContent=String(list.length).padStart(2,'0');
  $('#home-best').innerHTML=list.length?formatBest(list[0].time):'--<span>:</span>--<small>.---</small>';
  $('#best-caption').textContent=list.length?'다음 러닝의 상대는, 지금의 나.':'이 코스에 첫 기록을 남겨보세요.';
  $('#best-course').textContent=map.name;
  $('#hud-best').textContent=list.length?'BEST '+formatTime(list[0].time):'BEST —';
}
function notice(text){clearTimeout(noticeTimer);$('#notice').textContent=text;$('#notice').classList.remove('hidden');noticeTimer=setTimeout(()=>$('#notice').classList.add('hidden'),3200);}
function tone(freq=500,length=.1,type='sine',volume=.04){if(!soundEnabled)return;try{audioContext ||= new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,audioContext.currentTime);gain.gain.setValueAtTime(volume,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+length);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+length);}catch{soundEnabled=false;}}
$('#sound-button').addEventListener('click',()=>{soundEnabled=!soundEnabled;$('#sound-button').setAttribute('aria-label',soundEnabled?'소리 끄기':'소리 켜기');$('#sound-button').title=soundEnabled?'소리 끄기':'소리 켜기';$('#sound-waves').setAttribute('d',soundEnabled?'M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14':'m16 9 5 6m0-6-5 6');tone(620,.15);});
let previousFocus=null;
function modal(html){previousFocus=document.activeElement;$('#modal-content').innerHTML=html;$('#modal').classList.remove('hidden');$('#modal-close').focus();}
function hideModal(){ $('#modal').classList.add('hidden');document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.tab==='play'));previousFocus?.focus(); }
function openGuide(){modal(`<div class="modal-eyebrow">A LITTLE KNOW-HOW</div><h2 id="modal-title">도시 위를 달리는 법.</h2><p class="modal-description">카메라는 달리는 방향을 자연스럽게 따라갑니다.<br>캐릭터의 다음 발걸음에만 집중하세요.</p><div class="guide-row"><span>캐릭터 이동</span><span><kbd>W A S D</kbd> / <kbd>방향키</kbd></span></div><div class="guide-row"><span>점프</span><kbd>SPACE</kbd></div><div class="guide-row"><span>벽 차고 오르기</span><span>벽에 닿으면 <kbd>SPACE 다시</kbd></span></div><div class="guide-row"><span>전력질주</span><span>이동하면 자동 질주</span></div><div class="guide-row"><span>슬라이딩 · 낮은 배관 아래로</span><kbd>SHIFT</kbd></div><div class="guide-row"><span>슬라이드 점프</span><span><kbd>SHIFT</kbd> → <kbd>SPACE</kbd></span></div><div class="guide-row"><span>마지막 착지 옥상으로 복귀</span><kbd>R</kbd></div><div class="guide-row"><span>처음부터 다시 · 시간 0부터</span><kbd>T</kbd></div><div class="guide-row"><span>일시정지</span><kbd>ESC</kbd></div><p class="guide-note">A–H로 표시된 필수 옥상 8곳을 순서 없이 모두 밟으세요.<br>마지막 목표에 착지하면 즉시 시간이 멈춥니다.<br>미니맵에서 목표를 선택하고 일반 옥상을 지름길로 이용하세요.<br>옥상 가장자리의 민트색 화살표는 오갈 수 있는 길, 주황색 화살표는 뛰어내리기만 되는 길입니다.<br>이동 키로 달리다가 가장자리에서 점프!<br>건물 사이 골목에서는 한 번의 점프로 닿지 않습니다.<br>맞은편 건물 벽에 닿는 순간 Space를 다시 눌러 차고 오르세요.<br>건물 옆을 스치며 뛰면 잠시 벽을 타고 달릴 수 있습니다.<br>옥상을 가로지르는 배관·빨래 건조대는 서서 지나갈 수 없습니다.<br>바닥 화살표가 보이면 Shift로 미끄러져 아래를 통과하세요.<br>슬라이딩 직후 점프하면 빨라진 속도를 그대로 이어갑니다.<br>추락해도 기록 측정은 계속됩니다. 일시정지 중에는 멈춥니다.</p><button class="modal-action" id="guide-done">준비됐어요 ↗</button>`);$('#guide-done').onclick=hideModal;}
function openRecords(){
  const list=recordStore.get(recordsView),viewed=MAPS.find(m=>m.id===recordsView);
  const rows=list.map((r,i)=>`<tr><td>${String(i+1).padStart(2,'0')}</td><td>${formatTime(r.time)}</td><td>${safeDate(r.date)}</td></tr>`).join('');
  modal(`<div class="modal-eyebrow">YOU VS. YOURSELF</div><h2 id="modal-title">나의 러닝 기록.</h2><p class="modal-description">${viewed.name} · 빠른 순서대로 상위 10개<br>이 브라우저에 저장된 개인 기록입니다.</p><div class="record-tabs">${MAPS.map(m=>`<button class="record-tab${m.id===recordsView?' active':''}" data-map="${m.id}">${m.name}</button>`).join('')}</div>${rows?`<table class="records-table"><thead><tr><th>RANK</th><th>TIME</th><th>DATE</th></tr></thead><tbody>${rows}</tbody></table>`:'<div class="empty-records">아직 이 코스를 완주한 러닝이 없어요.<br>첫 번째 기록의 주인공이 되어보세요.</div>'}<button class="modal-action" id="records-run">${recordsView===map.id?'새 기록에 도전 ↗':`${viewed.name}${toParticle(viewed.name)} 이동 ↗`}</button>`);
  $('#modal-content').querySelectorAll('.record-tab').forEach(button=>button.onclick=()=>{recordsView=button.dataset.map;openRecords();});
  $('#records-run').onclick=()=>{if(recordsView===map.id)startRun();else{const id=recordsView;hideModal();applyMap(id);}};
}
// 받침 유무에 따라 '로' / '으로'를 고릅니다.
function toParticle(word){const code=word.charCodeAt(word.length-1)-0xAC00;if(code<0||code>11171)return '로';const jong=code%28;return jong===0||jong===8?'로':'으로';}
function safeDate(s){const d=new Date(s);return Number.isNaN(d.getTime())?'—':d.toLocaleDateString('ko-KR',{month:'2-digit',day:'2-digit'});}
document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>{if(state!=='home')return;document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b===button));if(button.dataset.tab==='guide')openGuide();else if(button.dataset.tab==='records'){recordsView=map.id;openRecords();}else if(button.dataset.tab==='maps')openMaps();else hideModal();}));
$('#course-card').addEventListener('click',()=>{if(state==='home')openMaps();});
$('#course-card').addEventListener('keydown',e=>{if((e.code==='Enter'||e.code==='Space')&&state==='home'){e.preventDefault();openMaps();}});
$('.brand').addEventListener('click',e=>{e.preventDefault();if(state==='home')hideModal();});
function startRun(){
  if(innerWidth<700)notice('키보드로 플레이하는 게임입니다. PC에서 플레이해 주세요.');
  hideModal();keys.clear();jumpPressed=false;slidePressed=false;announcedGates.clear();run=createRun(COURSE);targetIndex=null;inputYaw=0;inputSignature='';checkpoint=0;falls=0;elapsed=0;player=createPlayer();state='countdown';countdownLeft=3;accumulator=0;cameraYaw=0;cameraReady=false;
  $('#home').classList.add('hidden');$('#home-footer').classList.add('hidden');$('#hud').classList.remove('hidden');$('#countdown').classList.remove('hidden');$('#countdown').textContent='3';document.body.classList.add('playing');updateProgress();$('#timer').textContent='00:00.000';$('#checkpoint-toast').classList.remove('visible');tone(400,.13);
}
$('#start-button').addEventListener('click',startRun);
function pause(){if(state!=='running'&&state!=='countdown')return;const old=state;state='paused';keys.clear();jumpPressed=false;slidePressed=false;modal(`<div class="modal-eyebrow">TAKE A BREATH</div><h2 id="modal-title">잠깐, 숨 고르기.</h2><p class="modal-description">기록 측정이 잠시 멈췄어요.<br>${map.name} · 현재 기록 <strong>${formatTime(elapsed)}</strong> · 필수 옥상 ${run.visited.size} / ${run.required.size}</p><button class="modal-action" id="resume-run">계속 달리기 ↗</button><button class="modal-action modal-secondary" id="restart-run">처음부터 다시 (T)</button><button class="modal-action modal-secondary" id="return-home">시작 화면으로</button>`);$('#resume-run').onclick=()=>resume(old);$('#restart-run').onclick=startRun;$('#return-home').onclick=returnHome;$('#modal-close').onclick=()=>resume(old);}
function resume(previous='running'){hideModal();state=previous;accumulator=0;$('#modal-close').onclick=closeModal;}
function returnHome(){hideModal();state='home';keys.clear();jumpPressed=false;slidePressed=false;$('#hud').classList.add('hidden');$('#countdown').classList.add('hidden');$('#home').classList.remove('hidden');$('#home-footer').classList.remove('hidden');document.body.classList.remove('playing');player=createPlayer();run=createRun(COURSE);targetIndex=null;checkpoint=0;inputSignature="";updateProgress();cameraReady=false;sunLight.position.set(start.x-80,start.y+80,start.z-150);sunLight.target.position.set(start.x,start.y,start.z);$('#modal-close').onclick=closeModal;updateRecords();}
function closeModal(){if(state==='paused')$('#resume-run')?.click();else if(state==='finished')returnHome();else hideModal();}
$('#modal-close').onclick=closeModal;$('#pause-button').onclick=pause;
function toast(text){clearTimeout(toastTimer);$('#checkpoint-toast').textContent=text;$('#checkpoint-toast').classList.add('visible');toastTimer=setTimeout(()=>$('#checkpoint-toast').classList.remove('visible'),2400);}
function respawn(){if(state!=='running')return;falls++;player=createPlayer(run.respawn);inputSignature="";keys.delete('Space');jumpPressed=false;cameraReady=false;tone(150,.18,'triangle');toast('BACK ON TRACK · 시간은 계속 흐릅니다');}
function finishRun(){
  state='finished';keys.clear();const list=records();const previous=list[0]?.time;const isBest=!previous||elapsed<previous;const entry={time:Math.floor(elapsed),date:new Date().toISOString(),falls};
  recordStore.set(map.id,sanitizeRecords([...list,entry]));try{localStorage.setItem(map.storageKey,JSON.stringify(records()));}catch{storageAvailable=false;}updateRecords();tone(660,.2);setTimeout(()=>tone(880,.3),130);setTimeout(()=>tone(1100,.5),280);
  const delta=previous?`${elapsed<previous?'−':'+'}${formatTime(Math.abs(elapsed-previous))}`:'첫 번째 완주';
  modal(`<div class="modal-eyebrow">${isBest?'✳ NEW PERSONAL BEST':`${map.latin.toUpperCase()} — COMPLETE`}</div><h2 id="modal-title">${isBest?'새로운 나의 기록.':'도시 전체를 달렸어요.'}</h2><p class="modal-description">${map.name} · 필수 옥상 ${run.visited.size}곳 모두 방문<br>${isBest?'오늘의 가장 빠른 발걸음. 한 번 더 달려볼까요?':'좋은 러닝이었어요. 다음에는 조금 더 빠르게.'}</p><div class="result-time">${formatTime(elapsed)}</div><p class="route-result">방문 경로 ${run.order.map(i=>COURSE[i].label).join(" → ")}</p><div class="result-details"><span>이전 최고 기록 대비 <strong>${delta}</strong></span><span>복귀 <strong>${falls}회</strong></span></div><p class="modal-description">${storageAvailable?'이 브라우저에 기록이 저장되었습니다.':'브라우저 저장 공간을 사용할 수 없어 이번 세션에만 기록됩니다.'}</p><button class="modal-action" id="run-again">한 번 더 달리기 ↗</button><button class="modal-action modal-secondary" id="finish-maps">다른 코스 달리기</button><button class="modal-action modal-secondary" id="finish-home">시작 화면으로</button>`);$('#run-again').onclick=startRun;$('#finish-maps').onclick=()=>{returnHome();openMaps();};$('#finish-home').onclick=returnHome;$('#modal-close').onclick=closeModal;
}
const handledKeys=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','ShiftLeft','ShiftRight','KeyR','KeyT','Escape'];
document.addEventListener('keydown',e=>{
  if(e.ctrlKey||e.metaKey||e.altKey)return;
  if(e.code==='Tab'&&!$('#modal').classList.contains('hidden')){const els=[...$('#modal').querySelectorAll('button,a,[tabindex="0"]')];if(e.shiftKey&&document.activeElement===els[0]){e.preventDefault();els.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===els.at(-1)){e.preventDefault();els[0].focus();}return;}
  if(!handledKeys.includes(e.code))return;
  if(state!=='home')e.preventDefault();
  if(e.code==='Escape'&&!e.repeat){if(state==='paused')$('#resume-run')?.click();else if(state==='running'||state==='countdown')pause();else closeModal();return;}
  // T throws the whole run away and starts the course over, timer and all — also from pause and results.
  if(e.code==='KeyT'&&!e.repeat&&state!=='home'){startRun();return;}
  if(state==='running'||state==='countdown'){keys.add(e.code);if(e.code==='Space'&&!e.repeat)jumpPressed=true;if(['ShiftLeft','ShiftRight'].includes(e.code)&&!e.repeat)slidePressed=true;if(e.code==='KeyR'&&!e.repeat)respawn();}
});
document.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{keys.clear();jumpPressed=false;slidePressed=false;pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
function getInput(){
  const x=(keys.has('KeyD')||keys.has('ArrowRight')?1:0)-(keys.has('KeyA')||keys.has('ArrowLeft')?1:0);
  const z=(keys.has('KeyS')||keys.has('ArrowDown')?1:0)-(keys.has('KeyW')||keys.has('ArrowUp')?1:0),signature=`${x},${z}`;
  if(signature!==inputSignature){inputYaw=cameraYaw;inputSignature=signature;}
  const c=Math.cos(inputYaw),s=Math.sin(inputYaw);
  return{x:x*c+z*s,z:-x*s+z*c,sprint:true,jumpHeld:keys.has('Space'),jumpPressed,slidePressed,slideHeld:keys.has('ShiftLeft')||keys.has('ShiftRight')};
}
function updatePhysics(dt){
  const event=stepPlayer(player,getInput(),dt);jumpPressed=false;slidePressed=false;
  if(event.wallJumped){tone(580,.13,'sawtooth',.025);toast('WALL KICK × '+player.wallJumps+' · 앞으로 이어가세요');}else if(event.jumped)tone(300,.07,'triangle',.025);if(event.slideStarted)tone(140,.2,'triangle',.06);
  // Call the slide out once per section: the structure ahead is only passable low.
  const gate=GATES.find(g=>g.index===player.roof);
  if(gate&&player.grounded&&!announcedGates.has(gate.index)){
    const alongZ=gate.axis==='z',along=alongZ?player.z-gate.z:player.x-gate.x,lateral=alongZ?player.x-gate.x:player.z-gate.z;
    if(Math.abs(along)<13&&Math.abs(lateral)<gate.span/2&&along*(alongZ?player.vz:player.vx)<0){announcedGates.add(gate.index);toast('LOW CLEARANCE · SHIFT로 슬라이딩');}
  }
  if(visitRoof(run,player,COURSE)){
    tone(620+run.visited.size*40,.13);toast(`VISITED ${COURSE[player.roof].label} · ${run.visited.size} / ${run.required.size}`);updateProgress();
  }
  checkpoint=run.respawn;
  if(run.finished)finishRun();
  if(player.y<Math.min(...COURSE.map(p=>p.y))-14)respawn();
}
function animateRunner(dt,time){
  runner.position.set(player.x,player.y,player.z);
  const velocity=Math.hypot(player.vx,player.vz),moving=velocity>.3;
  if(moving){const desired=Math.atan2(-player.vx,-player.vz);player.angle=THREE.MathUtils.lerp(player.angle,player.angle+Math.atan2(Math.sin(desired-player.angle),Math.cos(desired-player.angle)),1-Math.exp(-dt*13));}
  if(state==='home')player.angle=-.45;
  runner.rotation.y=player.angle;
  runAnimation+=dt*(moving?velocity*1.35:2);
  const swing=Math.sin(runAnimation)*(moving?.7:.025);
  leftLeg.rotation.x=player.sliding?-1.15:player.grounded?swing:-.35;rightLeg.rotation.x=player.sliding?-1.45:player.grounded?-swing:.5;
  leftArm.rotation.x=player.sliding?.7:player.wallRunning?-1.9:player.grounded?-swing:.8;rightArm.rotation.x=player.sliding?.6:player.wallRunning?-1.1:player.grounded?swing:-.6;
  rig.position.y=THREE.MathUtils.lerp(rig.position.y,player.sliding?-.65:player.grounded?Math.abs(Math.sin(runAnimation))*Math.min(.08,velocity*.006):0,1-Math.exp(-dt*22));
  rig.rotation.x=THREE.MathUtils.lerp(rig.rotation.x,player.sliding?-.38:player.wallRunning?-.12:moving?.17:0,1-Math.exp(-dt*18));rig.rotation.z=THREE.MathUtils.lerp(rig.rotation.z,player.wallRunning&&player.wall?player.wall.nx*.22:0,1-Math.exp(-dt*12));
  scarf.rotation.x=Math.sin(time*7)*.1+velocity*.025;
  const roof=COURSE[player.roof];contactShadow.position.set(player.x,roof.y+.065,player.z);contactShadow.visible=Math.abs(player.x-roof.x)<roof.w/2&&Math.abs(player.z-roof.z)<roof.d/2;contactShadow.material.opacity=Math.max(.04,.23-(player.y-roof.y)*.035);
}
function updateCamera(dt,time){
  if(state==='home'){
    const desired=new THREE.Vector3(start.x-110+Math.sin(time*.05)*2,start.y+105,start.z+138);camera.position.lerp(desired,cameraReady?1-Math.exp(-dt*2):1);cameraTarget.set(start.x-22,start.y-5,start.z-10);camera.lookAt(cameraTarget);camera.fov=48;cameraReady=true;
  }else{
    // Follow actual travel in every direction, independent of any suggested objective.
    if(Math.hypot(player.vx,player.vz)>2&&player.kickLock===0){
      const desiredYaw=Math.atan2(-player.vx,-player.vz),delta=Math.atan2(Math.sin(desiredYaw-cameraYaw),Math.cos(desiredYaw-cameraYaw));
      cameraYaw+=THREE.MathUtils.clamp(delta*(1-Math.exp(-dt*2.8)),-dt*2.2,dt*2.2);
    }
    const velocity=Math.hypot(player.vx,player.vz);const flow=THREE.MathUtils.clamp((velocity-8)/14,0,1);const distance=6.6+flow*.7;
    cameraDesired.set(player.x+Math.sin(cameraYaw)*distance,player.y+(player.sliding?2.5:3.5)+Math.sin(time*16)*flow*.028,player.z+Math.cos(cameraYaw)*distance);
    // Raise the chase camera over any building between it and the runner.
    for(const p of COURSE){if(Math.abs(cameraDesired.x-p.x)<p.w/2+1&&Math.abs(cameraDesired.z-p.z)<p.d/2+1)cameraDesired.y=Math.max(cameraDesired.y,p.y+2);}
    lookDesired.set(player.x-Math.sin(cameraYaw)*3,player.y+(player.sliding?.55:1.2),player.z-Math.cos(cameraYaw)*3);
    // Keep the camera on the runner's side of the buildings that form a wall section.
    const runnerEye=new THREE.Vector3(player.x,player.y+1.4,player.z);
    for(const w of TOWERS){
      const min=new THREE.Vector3(w.x-w.w/2-.25,w.bottom,w.z-w.d/2-.25),max=new THREE.Vector3(w.x+w.w/2+.25,w.top+.2,w.z+w.d/2+.25);
      const direction=cameraDesired.clone().sub(runnerEye),length=direction.length();
      const hit=new THREE.Ray(runnerEye,direction.normalize()).intersectBox(new THREE.Box3(min,max),new THREE.Vector3());
      if(hit&&hit.distanceTo(runnerEye)<length)cameraDesired.copy(hit).addScaledVector(direction,-.35);
    }
    const blend=cameraReady?1-Math.exp(-dt*10):1;camera.position.lerp(cameraDesired,blend);cameraTarget.lerp(lookDesired,blend);camera.lookAt(cameraTarget);camera.fov=THREE.MathUtils.lerp(camera.fov,60+flow*22+(player.sliding?5:0),1-Math.exp(-dt*5));camera.rotateZ(THREE.MathUtils.clamp(-player.vx*.0025,-.035,.035)+(player.wallRunning&&player.wall?player.wall.nx*.025:0));cameraReady=true;
    sunLight.position.set(player.x-65,player.y+85,player.z-75);sunLight.target.position.set(player.x,player.y,player.z);
  }
  camera.updateProjectionMatrix();
}
let last=performance.now(),time=0;
function frame(now){
  requestAnimationFrame(frame);const realDt=Math.max(0,(now-last)/1000);const dt=Math.min(realDt,.1);last=now;time+=dt;
  if(state==='countdown'){const previous=Math.ceil(countdownLeft);countdownLeft-=dt;if(Math.ceil(countdownLeft)!==previous&&countdownLeft>0){$('#countdown').textContent=Math.ceil(countdownLeft);tone(400,.1);}if(countdownLeft<=0){state='running';$('#countdown').textContent='GO';tone(780,.2);setTimeout(()=>$('#countdown').classList.add('hidden'),650);toast('필수 옥상 A–H · 원하는 순서로 모두 방문하세요');}}
  else if(state==='running'){tickRun(run,Math.max(0,realDt-dt));accumulator+=dt;while(accumulator>=1/120&&state==='running'){tickRun(run,1/120);elapsed=run.elapsed;updatePhysics(1/120);accumulator-=1/120;}$('#timer').textContent=formatTime(elapsed);$('#speed').textContent=Math.round(Math.hypot(player.vx,player.vz)*3.6);$('#movement-label').textContent=player.sliding?'POWER SLIDE':player.wallRunning?'WALL RUN · SPACE':player.kickLock>0?'WALL KICK':!player.grounded?'AIR TIME':Math.hypot(player.vx,player.vz)>14?'SPRINTING':Math.hypot(player.vx,player.vz)>1?'FIND YOUR FLOW':'READY TO RUN';$('#stamina-fill').style.width=(player.energy/BODY.energy*100)+'%';}
  $('#speed-lines').style.opacity=state==='running'?Math.max(0,Math.min(.7,(Math.hypot(player.vx,player.vz)-11)/17)):0;
  if(state!=='paused'){animateRunner(dt,time);updateCamera(dt,time);}
  if(targetIndex!==null){const next=COURSE[targetIndex];targetBeacon.position.set(next.x,next.y+3.5+Math.sin(time*2)*.2,next.z);targetBeacon.rotation.y=time*.7;}
  targetBeacon.visible=targetIndex!==null&&state!=='home'&&state!=='finished';
  checkpointMeshes.forEach((m,i)=>{const done=run.visited.has(i);m.material.color.set(done?'#bde5b9':COURSE[i].required?map.theme.takeoff:map.theme.ring);m.material.opacity=done?.4:COURSE[i].required?.7+Math.sin(time*2+i)*.15:.12;});
  objectiveBeacons.forEach(beacon=>{const done=run.visited.has(beacon.userData.index);beacon.visible=!done;beacon.position.y=beacon.userData.baseY+Math.sin(time*1.7+beacon.userData.index)*.2;});
  if(miniProjection){$('#map-player').setAttribute('transform',`translate(${miniProjection.mx(player.x)} ${miniProjection.mz(player.z)}) rotate(${-player.angle*180/Math.PI})`);}
  birds.forEach((b,i)=>{b.position.x=b.userData.base.x+Math.sin(time*.08+b.userData.phase)*22;b.position.z=b.userData.base.z+Math.cos(time*.08+b.userData.phase)*10;b.position.y=b.userData.base.y+Math.sin(time*.5+i);b.rotation.y=time*.08;b.scale.y=.5+Math.sin(time*3+i)*.35;});
  renderer.render(scene,camera);
}
selectMap(map.id);
buildWorld(map);
player=createPlayer();run=createRun(COURSE);
renderMapCard();
updateRecords();
requestAnimationFrame(frame);
window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));});
renderer.compile(scene,camera);
hideLoading();
// Read-only diagnostics keep browser checks independent of rendering internals.
window.__roofrunner={
  snapshot:()=>({state,map:map.id,roofs:COURSE.length,checkpoint,visited:[...run.visited],required:[...run.required],visitOrder:[...run.order],targetIndex,elapsed,falls,player:{...player},camera:{x:camera.position.x,y:camera.position.y,z:camera.position.z,yaw:cameraYaw},records:[...records()],renderCalls:renderer.info.render.calls}),
  maps:()=>MAPS.map(m=>({id:m.id,name:m.name,roofs:m.course.length,walls:m.course.filter(p=>p.wall).length,required:m.course.filter(p=>p.required).length,bounds:districtBounds(m.course)})),
  course:()=>COURSE.map(p=>({...p})),
  gates:()=>GATES.map(g=>({...g})),
  memory:()=>({...renderer.info.memory,materials:materialCache.size}),
  selectMap:(id)=>applyMap(id),
};
