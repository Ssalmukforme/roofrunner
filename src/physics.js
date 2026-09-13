// Every map keeps the same body tuning; only the route, the buildings and the palette change.
const SUNSET = {
  seed:87,fog:'#b68c96',fogDensity:.0037,exposure:1.25,
  sky:['#756b91','#e7aa9a','#f9c493'],sunColor:'#ffb784',sunIntensity:3.4,sunSphere:'#ffd8a2',sunPos:[130,67,-145],
  hemiSky:'#ffd1b2',hemiGround:'#5b5472',hemiIntensity:2.6,
  ground:'#726d7e',facades:['#a78080','#ae8a85','#8a7985','#b9978a','#997d85','#8a8597','#c19b8b'],
  crown:'#c4a392',crownInner:'#967d81',shed:'#897b83',skyline:'#9b8496',
  roofTops:['#a58684','#b58f81','#c29a87','#aa827d'],roofBand:'#e2ba96',roofFloor:'#bd9d8c',parapet:'#dbb598',parapetCap:'#e8c4a0',
  takeoff:'#eb9b73',climbWall:'#5e777c',climbRung:'#b5d6bb',
  wall:'#607e80',wallTrim:'#c2edc6',wallRung:'#9dc3b3',
  accent:'#c9efcb',ring:'#ccf5cd',finishRing:'#ffa075',label:'#ffe0bd',
  gate:'#f3b78c',gateGlow:'#ffb588',gateEmissive:'#ff9e68',stripe:'#514f60',stripeAlt:'#e9c9a5',
  dimWindow:'#6b6579',litWindow:'#f4c18c',litGlow:.45,litThreshold:.86,routeLitThreshold:.68,
  street:'#646477',streetMark:'#b79f9d',bird:'#655c70',
  heights:{near:[8,17],far:[12,48],back:[25,77]},landmark:'crane',props:'tank',ui:'#ff946c',tank:'#927578',
};
const HARBOR = {
  seed:1204,fog:'#7f97a6',fogDensity:.0040,exposure:1.2,
  sky:['#2c4866','#7fa2b6','#edcb9e'],sunColor:'#ffcf9d',sunIntensity:3.1,sunSphere:'#ffe6bd',sunPos:[-150,58,-165],
  hemiSky:'#cfe3ec',hemiGround:'#3a4a5c',hemiIntensity:2.45,
  ground:'#5d6873',facades:['#84969f','#78909c','#8ea19f','#9aa6a2','#6f8593','#a4aca6','#7e8d9b'],
  crown:'#a9b6b4',crownInner:'#6e7d86',shed:'#78868c',skyline:'#7d8e9b',
  roofTops:['#7f939c','#8a9ca2','#94a49f','#798c98'],roofBand:'#bccbc6',roofFloor:'#8fa0a0',parapet:'#aebbb8',parapetCap:'#cbd8d1',
  takeoff:'#f0a26f',climbWall:'#4c6b74',climbRung:'#bfe2d4',
  wall:'#4f7076',wallTrim:'#bfe8d8',wallRung:'#8fb8ae',
  accent:'#bfe8d8',ring:'#c8f0dd',finishRing:'#ffa075',label:'#e8f3ea',
  gate:'#eca87f',gateGlow:'#ffb98d',gateEmissive:'#ff9a62',stripe:'#3f4d57',stripeAlt:'#dbe4de',
  dimWindow:'#5f6f7b',litWindow:'#ffd29a',litGlow:.6,litThreshold:.78,routeLitThreshold:.6,
  street:'#55606b',streetMark:'#9fb0ad',bird:'#4e5d6b',
  heights:{near:[7,15],far:[11,42],back:[22,70]},landmark:'containers',props:'crate',ui:'#6fc9c0',tank:'#7f979c',
};
const NEON = {
  seed:5531,fog:'#3a3350',fogDensity:.0050,exposure:1.15,
  sky:['#17132c','#43305a','#a2497a'],sunColor:'#ff9ad2',sunIntensity:2.4,sunSphere:'#ffb6e2',sunPos:[120,48,-150],
  hemiSky:'#9d84d8',hemiGround:'#201a31',hemiIntensity:2.1,
  ground:'#2d2940',facades:['#4a4060','#563f63','#413a58','#5d4468','#463f5e','#382f4d','#514468'],
  crown:'#6b5680',crownInner:'#3b3450',shed:'#453c5c',skyline:'#3f3757',
  roofTops:['#4f4569','#5a4a6e','#453d5d','#584668'],roofBand:'#7c6494',roofFloor:'#514769',parapet:'#6b5a85',parapetCap:'#8a72a4',
  takeoff:'#ff7fb2',climbWall:'#3d4f6b',climbRung:'#7ef0d0',
  wall:'#3c4f6d',wallTrim:'#7ef0d0',wallRung:'#4fb7a6',
  accent:'#7ef0d0',ring:'#8ff5dc',finishRing:'#ff86c0',label:'#d9fff3',
  gate:'#ff8ac4',gateGlow:'#ff9ad0',gateEmissive:'#ff5fae',stripe:'#2b2540',stripeAlt:'#e6d7f2',
  dimWindow:'#463e60',litWindow:'#ffd48f',litGlow:.85,litThreshold:.52,routeLitThreshold:.42,
  street:'#272337',streetMark:'#6f5f8c',bird:'#4a3f63',
  heights:{near:[10,20],far:[16,56],back:[30,92]},landmark:'billboards',props:'unit',ui:'#ff7ac8',tank:'#5b4d72',
};
const DAWN = {
  seed:3310,fog:'#c8d5dd',fogDensity:.0044,exposure:1.3,
  sky:['#8ea7c7','#d7d2d8','#fbe1bf'],sunColor:'#ffe8c8',sunIntensity:3.2,sunSphere:'#fff3dc',sunPos:[-110,70,-150],
  hemiSky:'#e9f1f7',hemiGround:'#6c6f79',hemiIntensity:2.8,
  ground:'#8a8b92',facades:['#b7b3ae','#c3bdb4','#aeb2b3','#c9c0b6','#b0aaa6','#bdb8b8','#c6c1b5'],
  crown:'#d8d2c6',crownInner:'#a09b95',shed:'#aaa59f',skyline:'#b3b2b4',
  roofTops:['#b9b1a8','#c4bcb0','#aaa9a6','#c0b4a8'],roofBand:'#e6ddcd',roofFloor:'#c2b9ac',parapet:'#dcd3c5',parapetCap:'#efe7d7',
  takeoff:'#f09a6c',climbWall:'#7f9298',climbRung:'#cfe8d5',
  wall:'#7c959a',wallTrim:'#cdeed4',wallRung:'#a5c6b8',
  accent:'#a8dfc0',ring:'#b7e8cb',finishRing:'#ff9d72',label:'#fff3e2',
  gate:'#f6c69d',gateGlow:'#ffd0a8',gateEmissive:'#ffab74',stripe:'#6d6a6b',stripeAlt:'#f2e9da',
  dimWindow:'#8e8d93',litWindow:'#ffdcab',litGlow:.3,litThreshold:.93,routeLitThreshold:.85,
  street:'#7a7a80',streetMark:'#cfc8c0',bird:'#8a8894',
  heights:{near:[6,14],far:[10,34],back:[18,60]},landmark:'masts',props:'green',ui:'#f2a97b',tank:'#b9b2aa',
};
// Courses are written as steps: `gap` is the open air between two rooftop edges, `dy` the height change.
// One jump clears about 17m of flat gap and climbs at most ~2.9m, so anything taller needs a wall section.
function buildCourse(first,steps){
  const course=[{...first}];
  for(const step of steps){
    const prev=course.at(-1);
    course.push({
      x:prev.x+(step.dx||0),
      z:prev.z-(step.gap+prev.d/2+step.d/2),
      y:prev.y+(step.dy||0),
      w:step.w,d:step.d,name:step.name,wall:step.wall,climb:!!step.wall,slide:step.slide,
    });
  }
  return course;
}
export const ALLEY = { clearance:.8, extend:4 };
// A wall section is a canyon: two neighbouring buildings run past the rooftops on either side and the
// course jumps into the gap between them. Nothing stands in the running line — the faces sit just
// outside the rooftop edges — so the climb is made by kicking off the taller facade at the far end,
// and anyone who takes off along an edge gets a wall run down the side of the building for free.
export function buildTowers(course){
  const towers=[];
  course.forEach((b,i)=>{
    if(!b.wall||!i)return;
    const entryIndex=b.wall.from??i-1;
    const a=course[entryIndex],width=b.wall.width||14,rise=b.wall.rise||18,lead=b.wall.side||1;
    const offset=Math.max(a.w,b.w)/2+ALLEY.clearance;
    const back=a.z-a.d/2+ALLEY.extend,front=b.z+b.d/2-ALLEY.extend;
    const shared={z:(back+front)/2,d:back-front,bottom:0,index:entryIndex,exitIndex:i,entryY:a.y,exitY:b.y};
    for(const side of [-1,1])towers.push({...shared,x:a.x+side*(offset+width/2),w:width,
      top:Math.max(a.y,b.y)+rise-(side===lead?0:6),side,lead:side===lead});
  });
  return towers;
}
// Rooftop services — duct runs, drying frames, awnings — cross the marked line low enough that you
// have to slide under them: clearance sits between the sliding height (.85) and standing height (1.7).
export const GATE = { clear:1.05, height:1.65, depth:2.2, margin:1.5, offset:6 };
export function buildGates(course){
  const gates=[];
  course.forEach((p,index)=>{
    if(!p.slide)return;
    const {offset=GATE.offset,width=p.w-GATE.margin*2,kind='duct'}=p.slide;
    gates.push({x:p.x,z:p.z-p.d/2+offset,w:width,d:GATE.depth,
      bottom:p.y+GATE.clear,top:p.y+GATE.clear+GATE.height,roofY:p.y,index,kind});
  });
  return gates;
}
export const MAPS = [
  {
    id:'sunset',code:'COURSE 001',name:'선셋 디스트릭트',latin:'Sunset District',difficulty:'입문',
    blurb:'노을이 내려앉은 첫 번째 도시. 기본 리듬을 익히기 좋은 코스입니다.',
    place:'SEOUL, ABOVE THE NOISE',coords:'37°33′ N &nbsp; 126°58′ E &nbsp; / &nbsp; 18:42',
    tags:['입문','옥상 12개','벽 2곳','슬라이딩 2곳'],storageKey:'roofrunner-records-v3-sunset',theme:SUNSET,
    // Even rhythm, short gaps, gentle rises: the course that teaches the run.
    course:buildCourse({x:0,z:0,y:20,w:16,d:20,name:'출발 옥상'},[
      {gap:6,  dx:0,  dy:0,  w:14,d:18,name:'첫 번째 도약'},
      {gap:6.5,dx:5,  dy:1,  w:15,d:18,name:'오렌지 테라스'},
      {gap:7,  dx:9,  dy:1,  w:16,d:18,name:'간판 옥상',slide:{kind:'laundry'}},
      {gap:12, dx:0,  dy:4,  w:16,d:20,name:'월 런 앨리',wall:{side:1}},
      {gap:7,  dx:-4, dy:0,  w:17,d:19,name:'스카이 가든'},
      {gap:7.5,dx:-9, dy:1,  w:16,d:18,name:'바람의 옥상'},
      {gap:9,  dx:-4, dy:-2, w:16,d:18,name:'기울어진 지붕'},
      {gap:10, dx:0,  dy:5,  w:16,d:20,name:'마지막 벽',wall:{side:-1}},
      {gap:7,  dx:4,  dy:0,  w:16,d:19,name:'광장 위'},
      {gap:9,  dx:6,  dy:-1, w:17,d:19,name:'마지막 직선',slide:{kind:'duct'}},
      {gap:7,  dx:-3, dy:0,  w:22,d:24,name:'도착'},
    ]),
  },
  {
    id:'harbor',code:'COURSE 002',name:'하버 라인',latin:'Harbor Line',difficulty:'중급',
    blurb:'바다 안개가 걷히는 부둣가. 내리막에서 속도를 얼마나 지키는지가 기록을 가릅니다.',
    place:'HARBOR, AFTER THE FOG',coords:'35°06′ N &nbsp; 129°02′ E &nbsp; / &nbsp; 19:40',
    tags:['중급','옥상 15개','내리막 활강','슬라이딩 2곳'],storageKey:'roofrunner-records-v3-harbor',theme:HARBOR,
    // Long descending glides over wide, low warehouse roofs. Speed kept on the way down decides the time.
    course:buildCourse({x:0,z:0,y:22,w:18,d:20,name:'부둣가 창고'},[
      {gap:9, dx:0,  dy:-2, w:17,d:19,name:'컨테이너 지붕'},
      {gap:12,dx:-7, dy:-3, w:17,d:19,name:'크레인 아래'},
      {gap:13,dx:-8, dy:-3, w:18,d:20,name:'소금 창고'},
      {gap:9, dx:0,  dy:0,  w:18,d:22,name:'긴 직선',slide:{kind:'duct'}},
      {gap:12,dx:0,  dy:4,  w:16,d:20,name:'해무의 벽',wall:{side:1,width:16}},
      {gap:8, dx:4,  dy:0,  w:17,d:19,name:'갈매기 옥상'},
      {gap:12,dx:9,  dy:-2, w:17,d:19,name:'내리막 지붕'},
      {gap:13,dx:6,  dy:-3, w:16,d:18,name:'방파제 뷰'},
      {gap:9, dx:0,  dy:0,  w:16,d:18,name:'등대 앞'},
      {gap:10,dx:0,  dy:5,  w:16,d:20,name:'등대의 벽',wall:{side:-1,width:16}},
      {gap:8, dx:-4, dy:0,  w:17,d:19,name:'부두 지붕'},
      {gap:12,dx:-7, dy:-2, w:17,d:19,name:'마지막 부두',slide:{kind:'laundry'}},
      {gap:13,dx:-4, dy:-3, w:18,d:20,name:'하역장'},
      {gap:9, dx:3,  dy:0,  w:22,d:24,name:'도착'},
    ]),
  },
  {
    id:'neon',code:'COURSE 003',name:'네온 하이츠',latin:'Neon Heights',difficulty:'고급',
    blurb:'해가 완전히 진 고층 지구. 좁은 옥상 사이를 지그재그로 넘으며 22m를 올라갑니다.',
    place:'DOWNTOWN, AFTER DARK',coords:'37°30′ N &nbsp; 127°02′ E &nbsp; / &nbsp; 23:15',
    tags:['고급','옥상 16개','벽 3곳','슬라이딩 2곳'],storageKey:'roofrunner-records-v3-neon',theme:NEON,
    // Narrow roofs, short zigzag hops, and three wall sections that climb 22m over the course.
    course:buildCourse({x:0,z:0,y:26,w:15,d:18,name:'네온 사인'},[
      {gap:7,  dx:8,  dy:0, w:14,d:17,name:'지그재그 하나'},
      {gap:7,  dx:-8, dy:1, w:14,d:17,name:'지그재그 둘'},
      {gap:6.5,dx:8,  dy:1, w:14,d:17,name:'간판 사이'},
      {gap:6,  dx:0,  dy:0, w:14,d:18,name:'광고판 아래',slide:{kind:'duct'}},
      {gap:12, dx:0,  dy:4, w:14,d:18,name:'홀로그램 벽',wall:{side:1,width:12,rise:24}},
      {gap:7,  dx:-4, dy:0, w:14,d:18,name:'옥상 정원'},
      {gap:7,  dx:8,  dy:1, w:14,d:17,name:'좁은 지붕'},
      {gap:6,  dx:0,  dy:0, w:14,d:18,name:'전광판 골목',slide:{kind:'laundry'}},
      {gap:10, dx:0,  dy:5, w:14,d:18,name:'전광판 벽',wall:{side:-1,width:12,rise:24}},
      {gap:7,  dx:4,  dy:0, w:14,d:18,name:'헬리패드'},
      {gap:7,  dx:-8, dy:1, w:14,d:18,name:'지그재그 셋'},
      {gap:6,  dx:0,  dy:0, w:14,d:18,name:'마지막 골목'},
      {gap:12, dx:0,  dy:4, w:14,d:18,name:'정상의 벽',wall:{side:1,width:12,rise:26}},
      {gap:7,  dx:4,  dy:-1,w:15,d:18,name:'전망대'},
      {gap:9,  dx:-4, dy:0, w:20,d:22,name:'도착'},
    ]),
  },
  {
    id:'dawn',code:'COURSE 004',name:'새벽 언덕',latin:'Dawn Hills',difficulty:'스프린트',
    blurb:'옅은 안개가 깔린 내리막 코스. 게임에서 가장 긴 도약들이 이어집니다.',
    place:'HILLSIDE, BEFORE SUNRISE',coords:'37°35′ N &nbsp; 126°59′ E &nbsp; / &nbsp; 05:24',
    tags:['스프린트','옥상 11개','긴 활강','슬라이딩 2곳'],storageKey:'roofrunner-records-v3-dawn',theme:DAWN,
    // Wide roofs and the longest gaps in the game: a downhill sprint with one climb in the middle.
    course:buildCourse({x:0,z:0,y:34,w:20,d:22,name:'새벽 첫 발'},[
      {gap:13,dx:0,  dy:-3, w:18,d:20,name:'긴 활강'},
      {gap:13,dx:7,  dy:-3, w:18,d:20,name:'지붕 계단'},
      {gap:14,dx:8,  dy:-4, w:18,d:20,name:'두 번째 활강'},
      {gap:10,dx:0,  dy:0,  w:18,d:22,name:'물탱크 길',slide:{kind:'awning'}},
      {gap:10,dx:0,  dy:5,  w:17,d:20,name:'해 뜨는 벽',wall:{side:1,width:15}},
      {gap:12,dx:-4, dy:-2, w:18,d:20,name:'언덕 위'},
      {gap:14,dx:-7, dy:-4, w:18,d:20,name:'마지막 활강'},
      {gap:13,dx:-5, dy:-3, w:18,d:20,name:'넓은 지붕',slide:{kind:'awning'}},
      {gap:12,dx:4,  dy:-2, w:18,d:20,name:'골목 위'},
      {gap:10,dx:5,  dy:0,  w:22,d:24,name:'도착'},
    ]),
  },
];
// Reuse each district's named roofs, themes and slide structures in an open city block.
// Array order is an identifier only: there is no prescribed route through these coordinates.
export function buildDistrict(template,variant=0){
  const spacing=31,base=template[0].y;
  const targets=[[-2,-2],[0,-2],[2,-2],[2,0],[2,2],[0,2],[-2,2],[-2,0]];
  const course=[{x:0,z:0,y:base,w:24,d:24,name:'센트럴 루프 · 출발',gx:0,gz:0,required:false}];
  const originals=template.filter(p=>!p.wall&&p.name!=='도착').slice(1);
  const slides=template.filter(p=>p.slide).map(p=>p.slide);
  for(let gz=-2;gz<=2;gz++)for(let gx=-2;gx<=2;gx++){
    if(gx===0&&gz===0)continue;
    const target=targets.findIndex(([x,z])=>x===gx&&z===gz);
    const terracing=variant===1?Math.abs(gx)*.65:variant===2?Math.abs(gx+gz)*.55:variant===3?Math.abs(gz)*.75:(Math.abs(gx)+Math.abs(gz))*.45;
    course.push({x:gx*spacing,z:gz*spacing,y:base+terracing,w:22,d:22,gx,gz,required:target>=0,
      label:target>=0?String.fromCharCode(65+target):null,
      name:target>=0?(originals[(target+variant)%originals.length]?.name||'스카이 테라스'):`연결 옥상 ${gx+3}-${gz+3}`});
  }
  // Keep two north-facing wall alleys, now shortcuts inside a network of alternative approaches.
  for(const gx of [0,2]){
    const exit=course.find(p=>p.gx===gx&&p.gz===-2),from=course.findIndex(p=>p.gx===gx&&p.gz===-1);
    exit.y=course[from].y+4;exit.wall={from,side:gx===0?1:-1,width:7.5,rise:18};exit.climb=true;
  }
  // Existing duct / laundry / awning designs and their collision clearances are retained.
  [[-1,0],[1,0],[-1,2],[1,-1]].forEach(([gx,gz],i)=>{
    const roof=course.find(p=>p.gx===gx&&p.gz===gz);
    roof.slide={...slides[i%slides.length],offset:7,kind:slides[i%slides.length]?.kind||'duct'};
  });
  return course;
}
for(const [variant,map] of MAPS.entries()){
  map.course=buildDistrict(map.course,variant);
  map.tags=[map.difficulty,'필수 8곳','자유 경로','슬라이딩 4곳'];
  map.storageKey=`roofrunner-records-v4-explore-${map.id}`;
  map.blurb=['노을빛 광장에서 사방으로. 여덟 옥상을 잇는 나만의 최단 경로.', '항구 창고 사이를 자유롭게 넘나들며 여덟 전망점을 방문하세요.', '네온이 빛나는 고층 지구. 골목과 벽을 이용해 나만의 경로를 찾으세요.', '새벽빛 언덕에 흩어진 여덟 옥상. 높낮이와 지름길을 이용하세요.'][variant];
}
export function districtBounds(course){return {minX:Math.min(...course.map(p=>p.x-p.w/2)),maxX:Math.max(...course.map(p=>p.x+p.w/2)),minZ:Math.min(...course.map(p=>p.z-p.d/2)),maxZ:Math.max(...course.map(p=>p.z+p.d/2))};}
export function neighbors(course,index){const p=course[index];return course.map((q,i)=>({q,i})).filter(({q,i})=>i!==index&&Math.abs(q.gx-p.gx)+Math.abs(q.gz-p.gz)===1).map(({i})=>i);}
function makeColliders(course,towers,gates){
  return [
    ...course.map((p,index)=>({minX:p.x-p.w/2,maxX:p.x+p.w/2,minZ:p.z-p.d/2,maxZ:p.z+p.d/2,bottom:0,top:p.y,index})),
    ...towers.map(p=>({minX:p.x-p.w/2,maxX:p.x+p.w/2,minZ:p.z-p.d/2,maxZ:p.z+p.d/2,bottom:p.bottom,top:p.top,index:p.index,tower:true})),
    ...gates.map(p=>({minX:p.x-p.w/2,maxX:p.x+p.w/2,minZ:p.z-p.d/2,maxZ:p.z+p.d/2,bottom:p.bottom,top:p.top,index:p.index,gate:true})),
  ].map((b,id)=>({...b,id}));
}
// Live bindings: selecting a map swaps the course for every module that imported these.
export let activeMap = MAPS[0];
export let COURSE = activeMap.course;
export let TOWERS = buildTowers(COURSE);
export let GATES = buildGates(COURSE);
export let colliders = makeColliders(COURSE,TOWERS,GATES);
export function selectMap(id){
  const map=MAPS.find(m=>m.id===id)||MAPS[0];
  activeMap=map;COURSE=map.course;TOWERS=buildTowers(COURSE);GATES=buildGates(COURSE);
  colliders=makeColliders(COURSE,TOWERS,GATES);
  return map;
}
export const BODY = { radius:.36, height:1.7, gravity:28, jump:12.8, walk:12, sprint:19.5, wallKick:11.5, wallJump:13, energy:1.8, slideBoost:3.5, slideMax:25, slideDuration:.95 };
export function createPlayer(index=0) {
  const r=COURSE[index];
  // Respawning on a roof with a low structure starts you at its back edge, with room to get up to
  // speed and go down into the slide — the same run-up you would have had coming off the last jump.
  const back=index===0?4:r.slide?r.d/2-1.5:0;
  return {x:r.x,y:r.y,z:r.z+back,vx:0,vy:0,vz:0,grounded:true,roof:index,energy:BODY.energy,coyote:.12,jumpBuffer:0,angle:0,surface:'roof',
    wall:null,wallGrace:0,wallRunning:false,lastWallId:-1,wallCooldown:0,kickLock:0,wallJumps:0,
    sliding:false,slideTime:0,slideCooldown:0,slideWasHeld:false};
}
function findWall(p) {
  const reach=BODY.radius+.22;
  let best=null;
  for(const b of colliders){
    if(p.y>=b.top-.06||p.y+BODY.height<=b.bottom)continue;
    const faces=[];
    if(p.z>=b.minZ-.08&&p.z<=b.maxZ+.08){
      if(p.x<=b.minX)faces.push({distance:b.minX-p.x,nx:-1,nz:0});
      if(p.x>=b.maxX)faces.push({distance:p.x-b.maxX,nx:1,nz:0});
    }
    if(p.x>=b.minX-.08&&p.x<=b.maxX+.08){
      if(p.z<=b.minZ)faces.push({distance:b.minZ-p.z,nx:0,nz:-1});
      if(p.z>=b.maxZ)faces.push({distance:p.z-b.maxZ,nx:0,nz:1});
    }
    for(const f of faces)if(f.distance<=reach&&(!best||f.distance<best.distance))best={...f,id:b.id};
  }
  return best;
}
export function stepPlayer(p,input,dt) {
  const r=BODY.radius,len=Math.max(1,Math.hypot(input.x,input.z));
  const ix=input.x/len,iz=input.z/len,moving=Math.hypot(ix,iz)>.01;
  const events={jumped:false,wallJumped:false,slideStarted:false};
  p.wallCooldown=Math.max(0,p.wallCooldown-dt);p.kickLock=Math.max(0,p.kickLock-dt);p.slideCooldown=Math.max(0,p.slideCooldown-dt);
  if(p.grounded){p.coyote=.12;p.energy=Math.min(BODY.energy,p.energy+dt*3);p.wallJumps=0;}else p.coyote=Math.max(0,p.coyote-dt);
  if(input.jumpPressed)p.jumpBuffer=.14;else p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);
  const contact=findWall(p);
  if(contact){p.wall=contact;p.wallGrace=.12;}else{p.wallGrace=Math.max(0,p.wallGrace-dt);if(!p.wallGrace)p.wall=null;}
  const initialSpeed=Math.hypot(p.vx,p.vz);
  const slidePressed=input.slidePressed||(input.slideHeld&&!p.slideWasHeld);
  // Only a hold that started on the ground counts as "already used", so keeping the key down through
  // a landing drops you straight into a slide instead of silently doing nothing.
  p.slideWasHeld=!!input.slideHeld&&p.grounded;
  if(slidePressed&&p.grounded&&!p.sliding&&p.slideCooldown===0&&initialSpeed>7){
    const boost=Math.min(BODY.slideMax,initialSpeed+BODY.slideBoost)/initialSpeed;
    p.vx*=boost;p.vz*=boost;p.sliding=true;p.slideTime=BODY.slideDuration;events.slideStarted=true;
  }
  if(p.sliding){
    p.slideTime-=dt;
    if(!p.grounded||!input.slideHeld||p.slideTime<=0||input.jumpPressed){p.sliding=false;p.slideCooldown=.35;}
    else {const speed=Math.max(0,Math.hypot(p.vx,p.vz)-4*dt),angle=Math.atan2(p.vx,p.vz),target=moving?Math.atan2(ix,iz):angle;
      const steered=angle+Math.atan2(Math.sin(target-angle),Math.cos(target-angle))*Math.min(1,dt*1.5);
      p.vx=Math.sin(steered)*speed;p.vz=Math.cos(steered)*speed;}
  }
  if(!p.sliding&&p.kickLock===0){
    const targetSpeed=input.sprint?BODY.sprint:BODY.walk;
    // Air steering redirects momentum; it does not erase a slide or wall-kick boost.
    const speed=p.grounded?targetSpeed:Math.max(targetSpeed,Math.hypot(p.vx,p.vz)*.996);
    const blend=Math.min(1,(p.grounded?11:moving?3.2:.35)*dt);
    p.vx+=(ix*speed-p.vx)*blend;p.vz+=(iz*speed-p.vz)*blend;
  }
  if(p.jumpBuffer>0&&p.coyote>0){
    p.vy=BODY.jump;p.grounded=false;p.coyote=0;p.jumpBuffer=0;events.jumped=true;
  }else if(input.jumpPressed&&!p.grounded&&p.wall&&p.wallGrace>0&&(p.wallCooldown===0||p.wall.id!==p.lastWallId)){
    const {nx,nz,id}=p.wall,normalSpeed=p.vx*nx+p.vz*nz;
    const tx=p.vx-normalSpeed*nx,tz=p.vz-normalSpeed*nz;
    p.vx=tx+nx*BODY.wallKick;p.vz=tz+nz*BODY.wallKick;p.vy=BODY.wallJump;
    p.x+=nx*.12;p.z+=nz*.12;p.lastWallId=id;p.wallCooldown=.32;p.kickLock=.2;p.jumpBuffer=0;p.coyote=0;
    p.wallJumps++;p.energy=Math.min(BODY.energy,p.energy+.3);events.wallJumped=true;events.jumped=true;
  }
  p.wallRunning=!!contact&&!p.grounded&&!events.wallJumped&&p.kickLock===0&&moving&&p.energy>0;
  const oldY=p.y;
  if(p.wallRunning){p.vy=Math.max(-2.4,p.vy-(p.vy>0?BODY.gravity:5)*dt);p.energy=Math.max(0,p.energy-dt);}
  else p.vy-=BODY.gravity*dt;
  p.y+=p.vy*dt;
  const height=p.sliding?.85:BODY.height;
  const oldX=p.x;p.x+=p.vx*dt;
  for(const b of colliders){if(p.y>=b.top-.02||p.y+height<=b.bottom)continue;
    if(p.z>b.minZ-r&&p.z<b.maxZ+r&&p.x>b.minX-r&&p.x<b.maxX+r){
      if(p.vx>0&&oldX<=b.minX-r+.001){p.x=b.minX-r;p.vx=0;}
      else if(p.vx<0&&oldX>=b.maxX+r-.001){p.x=b.maxX+r;p.vx=0;}}
  }
  const oldZ=p.z;p.z+=p.vz*dt;
  for(const b of colliders){if(p.y>=b.top-.02||p.y+height<=b.bottom)continue;
    if(p.x>b.minX-r&&p.x<b.maxX+r&&p.z>b.minZ-r&&p.z<b.maxZ+r){
      if(p.vz>0&&oldZ<=b.minZ-r+.001){p.z=b.minZ-r;p.vz=0;}
      else if(p.vz<0&&oldZ>=b.maxZ+r-.001){p.z=b.maxZ+r;p.vz=0;}}
  }
  p.grounded=false;
  if(p.vy<=0)for(const b of colliders){if(p.x>b.minX-r*.4&&p.x<b.maxX+r*.4&&p.z>b.minZ-r*.4&&p.z<b.maxZ+r*.4&&oldY>=b.top-.08&&p.y<=b.top){
    p.y=b.top;p.vy=0;p.grounded=true;p.roof=b.index;p.surface=b.gate?'gate':b.tower?'tower':'roof';p.wallRunning=false;p.wall=null;p.wallGrace=0;break;}}
  return events;
}
export function formatTime(ms){const n=Math.max(0,Math.floor(Number(ms)||0));return `${String(Math.floor(n/60000)).padStart(2,'0')}:${String(Math.floor(n/1000)%60).padStart(2,'0')}.${String(n%1000).padStart(3,'0')}`;}
export function sanitizeRecords(value){if(!Array.isArray(value))return [];return value.filter(r=>r&&Number.isFinite(r.time)&&r.time>0&&typeof r.date==='string').map(r=>({time:r.time,date:r.date,falls:Number.isFinite(r.falls)?Math.max(0,Math.floor(r.falls)):0})).sort((a,b)=>a.time-b.time).slice(0,10);}
