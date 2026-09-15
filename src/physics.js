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
// ---------------------------------------------------------------- districts
// A district is authored as a walk over rooftops: each roof is placed next to one already on the map —
// `dir` N/E/S/W, `gap` the open air between the two facing edges, `off` a sideways shift, `dy` a height
// change. The height change decides what kind of link that is: small steps work in both directions,
// anything bigger than a jump can climb is a one-way drop, and a `wall` step is climbed by kicking the
// taller building's facade and dropped back down. `join` links two roofs that already exist, which is
// how loops and shortcuts close. Each city uses this to build a different shape, not a different grid.
const DIRS={N:[0,-1],S:[0,1],E:[1,0],W:[-1,0]};
// What the body can actually do, measured with the movement tests: flat 8.5m, +1m 8m, +2m 6.5m both
// ways; drops up to 13m; a facade kick tops +4m from 9–12.5m out and +5m from 9–10.5m out.
export const JUMP={both:{0:8.5,1:8,2:6.5},drop:13,wall:{4:[9,12.5],5:[9,10.5]},overlap:6};
export function linkGeometry(a,b){
  const ox=Math.min(a.x+a.w/2,b.x+b.w/2)-Math.max(a.x-a.w/2,b.x-b.w/2);
  const oz=Math.min(a.z+a.d/2,b.z+b.d/2)-Math.max(a.z-a.d/2,b.z-b.d/2);
  if(ox>0&&oz<=0)return {axis:'z',overlap:ox,gap:-oz,dir:[0,Math.sign(b.z-a.z)]};
  if(oz>0&&ox<=0)return {axis:'x',overlap:oz,gap:-ox,dir:[Math.sign(b.x-a.x),0]};
  return null;
}
export function buildDistrict({start,steps}){
  const course=[{id:'start',...start,required:false,label:null,links:[]}];
  const byId=new Map([['start',0]]),walls=[];
  const add=(i,j)=>{if(!course[i].links.includes(j))course[i].links.push(j);};
  const connect=(i,j,kind,wall={})=>{
    if(kind==='both'){add(i,j);add(j,i);return;}
    const [hi,lo]=course[i].y>=course[j].y?[i,j]:[j,i];
    add(hi,lo);
    if(kind!=='wall')return;
    add(lo,hi);course[hi].climb=true;
    const g=linkGeometry(course[lo],course[hi]);
    walls.push({from:lo,to:hi,axis:g.axis,dir:g.dir,side:wall.side||1,width:wall.width||7,rise:wall.rise||18,extend:wall.extend??3,towers:wall.towers||'both'});
  };
  for(const s of steps){
    if(s.join){connect(byId.get(s.join[0]),byId.get(s.join[1]),s.wall?'wall':s.kind||'both',s.wall);continue;}
    const fromIndex=byId.get(s.from),from=course[fromIndex],[dx,dz]=DIRS[s.dir],off=s.off||0;
    const along=dx?from.w/2+s.gap+s.w/2:from.d/2+s.gap+s.d/2;
    byId.set(s.id,course.push({id:s.id,name:s.name,x:from.x+dx*along+(dz?off:0),z:from.z+dz*along+(dx?off:0),y:from.y+(s.dy||0),
      w:s.w,d:s.d,required:!!s.label,label:s.label||null,slide:s.slide,links:[]})-1);
    connect(fromIndex,course.length-1,s.wall?'wall':Math.abs(s.dy||0)>2?'drop':'both',s.wall);
  }
  return {course,walls};
}
export const ALLEY = { clearance:.8 };
// A wall section is climbed by kicking the taller facade at the end of the gap. Neighbouring buildings
// beside the gap are optional — `towers` is 'both', 'one' (on `side`) or 'none' — and when present they
// stand just outside the rooftop edges, so nothing blocks the running line and taking off along that
// edge gives a wall run down their side.
export function buildTowers(course,walls=[]){
  return walls.flatMap(w=>{
    const a=course[w.from],b=course[w.to],[dx,dz]=w.dir,alongZ=w.axis==='z',s=alongZ?dz:dx;
    const back=(alongZ?a.z:a.x)+s*((alongZ?a.d:a.w)/2-w.extend),front=(alongZ?b.z:b.x)-s*((alongZ?b.d:b.w)/2-w.extend);
    const mid=(back+front)/2,span=Math.abs(front-back);
    const offset=Math.max(alongZ?a.w:a.d,alongZ?b.w:b.d)/2+ALLEY.clearance;
    // The lateral axis is the travel direction turned a quarter to the right: (-dz, dx).
    const lateral=alongZ?a.x:a.z,turn=alongZ?-dz:dx;
    const sides=w.towers==='none'?[]:w.towers==='one'?[w.side]:[-1,1];
    return sides.map(side=>{
      const c=lateral+side*turn*(offset+w.width/2);
      const shared={bottom:0,index:w.from,exitIndex:w.to,entryY:a.y,exitY:b.y,axis:w.axis,dir:w.dir,span,width:w.width,side,
        lead:side===w.side,top:Math.max(a.y,b.y)+w.rise-(side===w.side?0:6)};
      return alongZ?{...shared,x:c,z:mid,w:w.width,d:span}:{...shared,x:mid,z:c,w:span,d:w.width};
    });
  });
}
// Rooftop services — duct runs, drying frames, awnings — cross a roof low enough that you have to slide
// under them: clearance sits between the sliding height (.85) and standing height (1.7). `axis` is the
// direction of travel they block; `at` shifts them along it from the roof's centre.
export const GATE = { clear:1.05, height:1.65, depth:2.2, margin:1.5 };
export function buildGates(course){
  return course.flatMap((p,index)=>{
    if(!p.slide)return [];
    const {kind='duct',axis='z',at=0}=p.slide,alongZ=axis==='z',span=(alongZ?p.w:p.d)-GATE.margin*2;
    return [{x:alongZ?p.x:p.x+at,z:alongZ?p.z+at:p.z,w:alongZ?span:GATE.depth,d:alongZ?GATE.depth:span,axis,span,
      bottom:p.y+GATE.clear,top:p.y+GATE.clear+GATE.height,roofY:p.y,index,kind}];
  });
}
export const MAPS = [
  {
    id:'sunset',code:'COURSE 001',name:'선셋 디스트릭트',latin:'Sunset District',difficulty:'입문',
    shape:'원형 광장',blurb:'광장을 한 바퀴 두르는 옥상 고리. 시계 방향이든 반대든, 네 개의 육교로 가로질러도 됩니다.',
    place:'SEOUL, ABOVE THE NOISE',coords:'37°33′ N &nbsp; 126°58′ E &nbsp; / &nbsp; 18:42',theme:SUNSET,
    decor:{plaza:{x:0,z:0,r:36}},
    // A ring of roofs around an open square, four footbridges to the centre, two bell-tower perches.
    layout:{start:{x:0,z:0,y:20,w:22,d:22,name:'노을 광장 · 출발'},steps:[
      {id:'bn',from:'start',dir:'N',gap:7,w:10,d:12,name:'북쪽 육교'},
      {id:'be',from:'start',dir:'E',gap:7,w:12,d:10,name:'동쪽 육교'},
      {id:'bs',from:'start',dir:'S',gap:7,w:10,d:16,name:'남쪽 육교'},
      {id:'bw',from:'start',dir:'W',gap:7,w:10,d:10,name:'서쪽 육교'},
      {id:'n',from:'bn',dir:'N',gap:7,w:24,d:14,dy:1,label:'A',name:'시계탑 광장'},
      {id:'ne1',from:'n',dir:'E',gap:5,w:24,d:12,dy:2,name:'빨래 건조대 골목',slide:{kind:'laundry',axis:'x'}},
      {id:'ne',from:'ne1',dir:'E',gap:5,w:16,d:20,off:4,dy:-2,name:'노을 모퉁이'},
      {id:'perch',from:'ne',dir:'N',gap:10,w:16,d:14,dy:4,wall:{side:1,towers:'one'},label:'B',name:'노을 전망대'},
      {id:'e1',from:'ne',dir:'S',gap:5,w:14,d:14,off:-1,name:'간판 옥상'},
      {id:'e',from:'e1',dir:'S',gap:6,w:18,d:22,off:-6,dy:-1,label:'C',name:'스카이 가든'},
      {join:['be','e']},
      {id:'se1',from:'e',dir:'S',gap:8,w:16,d:14,off:1,name:'물탱크 길'},
      {id:'se',from:'se1',dir:'S',gap:6,w:18,d:16,off:-4,dy:-1,label:'D',name:'오렌지 테라스'},
      {id:'s1',from:'se',dir:'W',gap:6,w:22,d:12,off:-1,dy:2,name:'덕트 지붕',slide:{kind:'duct',axis:'x'}},
      {id:'s',from:'s1',dir:'W',gap:5,w:20,d:18,off:-2,dy:-2,name:'남쪽 광장'},
      {join:['bs','s']},
      {id:'sw',from:'s',dir:'W',gap:6,w:16,d:16,off:-4,dy:1,label:'E',name:'교회 첨탑'},
      {id:'bell',from:'sw',dir:'S',gap:10,w:14,d:14,dy:4,wall:{towers:'none'},label:'F',name:'종탑 옥상'},
      {id:'w1',from:'sw',dir:'N',gap:6,w:14,d:22,off:-8,dy:2,name:'서쪽 테라스',slide:{kind:'laundry',axis:'z'}},
      {id:'w',from:'w1',dir:'N',gap:5,w:18,d:16,off:-1,dy:-2,label:'G',name:'바람의 옥상'},
      {join:['bw','w']},
      {id:'nw',from:'w',dir:'N',gap:6,w:16,d:16,off:4,name:'구름다리'},
      {id:'nw2',from:'nw',dir:'N',gap:6,w:20,d:14,off:7,label:'H',name:'옛 극장 지붕'},
      {join:['nw2','n']},
    ]},
  },
  {
    id:'harbor',code:'COURSE 002',name:'하버 라인',latin:'Harbor Line',difficulty:'중급',
    shape:'두 층의 부두',blurb:'위층은 동서로 긴 창고 거리, 아래층은 바다로 뻗은 부두. 뛰어내리기는 쉽고, 돌아오려면 벽을 차야 합니다.',
    place:'HARBOR, AFTER THE FOG',coords:'35°06′ N &nbsp; 129°02′ E &nbsp; / &nbsp; 19:40',theme:HARBOR,
    decor:{water:{z:14,lighthouse:[82,74]}},
    // Two levels: a long warehouse promenade and, below it over the water, a quay with three piers.
    layout:{start:{x:0,z:0,y:18,w:26,d:20,name:'중앙 창고 · 출발'},steps:[
      {id:'w1',from:'start',dir:'W',gap:7,w:26,d:16,off:-2,name:'소금 창고',slide:{kind:'duct',axis:'x'}},
      {id:'w2',from:'w1',dir:'W',gap:7,w:18,d:18,off:2,label:'A',name:'크레인 조종실'},
      {id:'w3',from:'w2',dir:'W',gap:6,w:24,d:14,off:-3,dy:1,label:'G',name:'어시장 지붕'},
      {id:'e1',from:'start',dir:'E',gap:6.5,w:26,d:14,off:2,dy:2,name:'냉동 창고',slide:{kind:'laundry',axis:'x'}},
      {id:'e2',from:'e1',dir:'E',gap:6,w:16,d:18,off:-2,dy:-1,name:'세관 옥상'},
      {id:'e3',from:'e2',dir:'E',gap:7,w:24,d:14,off:-3,dy:1,label:'B',name:'등대지기 집'},
      {id:'fog',from:'start',dir:'N',gap:10,w:20,d:16,dy:4,wall:{towers:'none'},label:'C',name:'해무 전망대'},
      {id:'p1',from:'start',dir:'S',gap:11,w:12,d:28,dy:-4,wall:{side:1,extend:0},name:'중앙 부두'},
      {id:'q1',from:'p1',dir:'E',gap:6,w:30,d:10,name:'방파제 산책로',slide:{kind:'duct',axis:'x'}},
      {id:'p3',from:'q1',dir:'E',gap:6,w:12,d:30,name:'동쪽 부두'},
      {join:['e2','p3'],kind:'drop'},
      {id:'q2',from:'p1',dir:'W',gap:6,w:38,d:10,label:'H',name:'어구 창고'},
      {id:'p2',from:'q2',dir:'W',gap:6,w:12,d:30,name:'서쪽 부두'},
      {join:['p2','w2'],wall:{side:-1,towers:'one',extend:0}},
      {id:'p1b',from:'p1',dir:'S',gap:6,w:12,d:24,dy:2,name:'부두 창고',slide:{kind:'duct',axis:'z'}},
      {id:'p1c',from:'p1b',dir:'S',gap:6,w:18,d:16,dy:-2,label:'D',name:'중앙 부두 끝'},
      {id:'p2b',from:'p2',dir:'S',gap:6,w:16,d:18,off:3,label:'E',name:'어선 계류장'},
      {id:'p3b',from:'p3',dir:'S',gap:6,w:14,d:14,off:-2,dy:1,label:'F',name:'등대 부두'},
    ]},
  },
  {
    id:'neon',code:'COURSE 003',name:'네온 하이츠',latin:'Neon Heights',difficulty:'고급',
    shape:'나선 고층',blurb:'좁은 옥상이 벽을 차며 나선으로 16m를 오릅니다. 꼭대기에서 떨어지면 출발점, 바깥 골목은 낙하로만 닿습니다.',
    place:'DOWNTOWN, AFTER DARK',coords:'37°30′ N &nbsp; 127°02′ E &nbsp; / &nbsp; 23:15',theme:NEON,
    decor:{spire:true},
    // A tight spiral that climbs around an empty core, with low alleys hanging off it that you drop into.
    layout:{start:{x:0,z:24,y:26,w:16,d:14,name:'네온 광장 · 출발'},steps:[
      {id:'n1',from:'start',dir:'W',gap:6,w:14,d:16,off:-2,dy:2,name:'편의점 옥상'},
      {id:'n2',from:'n1',dir:'N',gap:6,w:12,d:30,off:1,dy:2,name:'광고판 골목',slide:{kind:'duct',axis:'z'}},
      {id:'n3',from:'n2',dir:'N',gap:6,w:16,d:14,label:'A',name:'홀로그램 옥상'},
      {id:'n4',from:'n3',dir:'E',gap:10,w:12,d:14,dy:4,wall:{side:1,width:6,rise:22,extend:0},name:'전광판 벽'},
      {id:'n5',from:'n4',dir:'E',gap:6,w:14,d:14,off:2,dy:2,label:'B',name:'헬리패드'},
      {id:'n6',from:'n5',dir:'S',gap:6,w:14,d:28,off:1,dy:2,name:'네온 덕트',slide:{kind:'laundry',axis:'z',at:-2.3}},
      {id:'n7',from:'n6',dir:'S',gap:10,w:14,d:12,dy:4,wall:{side:1,width:6,rise:22,towers:'one'},label:'C',name:'네온 왕관'},
      {join:['n7','start'],kind:'drop'},
      {id:'o1',from:'n1',dir:'W',gap:10,w:16,d:16,dy:-5,wall:{towers:'none'},label:'D',name:'노래방 간판'},
      {id:'o2',from:'n5',dir:'E',gap:12,w:18,d:18,off:6,dy:-8,label:'E',name:'파친코 옥상'},
      {id:'o2a',from:'o2',dir:'S',gap:6,w:14,d:14,off:-4,dy:-2,name:'골목 지붕'},
      {id:'o2b',from:'o2a',dir:'S',gap:6,w:14,d:14,off:-2,label:'F',name:'라멘집 옥상'},
      {id:'o2c',from:'o2b',dir:'S',gap:8,w:14,d:14,name:'전선 지붕'},
      {id:'o2d',from:'o2c',dir:'W',gap:8,w:16,d:14,off:7,name:'노점 지붕'},
      {id:'o2e',from:'o2d',dir:'W',gap:6,w:14,d:14,label:'G',name:'포장마차 지붕'},
      {join:['o2e','start']},
      {id:'o3',from:'n4',dir:'N',gap:11,w:16,d:16,off:-3,dy:-6,label:'H',name:'옛 극장'},
      {id:'o3a',from:'o3',dir:'W',gap:6,w:20,d:14,dy:-2,name:'극장 매표소'},
      {id:'o3b',from:'o3a',dir:'W',gap:6,w:14,d:30,off:8,name:'뒷골목 차양'},
      {id:'o3c',from:'o3b',dir:'S',gap:6,w:14,d:18,dy:-1,name:'환풍기 지붕'},
      {id:'o3d',from:'o3c',dir:'S',gap:6,w:14,d:12,name:'비상구 지붕'},
      {join:['o3d','o1'],kind:'drop'},
    ]},
  },
  {
    id:'dawn',code:'COURSE 004',name:'새벽 언덕',latin:'Dawn Hills',difficulty:'스프린트',
    shape:'비탈 계단',blurb:'북서 꼭대기에서 남동 기차역까지 21m를 내려가는 비탈. 내리막은 긴 활강 한 줄, 오르막은 좁은 계단길입니다.',
    place:'HILLSIDE, BEFORE SUNRISE',coords:'37°35′ N &nbsp; 126°59′ E &nbsp; / &nbsp; 05:24',theme:DAWN,
    decor:{slope:{x:-1,z:-1}},
    // A hillside: one fast downhill line of long drops, and switchback stairways to climb back up.
    layout:{start:{x:0,z:0,y:27,w:24,d:22,name:'언덕 중턱 · 출발'},steps:[
      {id:'u1',from:'start',dir:'N',gap:6,w:14,d:12,off:-6,dy:2,name:'돌계단 지붕'},
      {id:'u2',from:'u1',dir:'W',gap:6,w:24,d:14,off:-2,dy:2,name:'온실 테라스'},
      {id:'u3',from:'u2',dir:'N',gap:6,w:14,d:12,off:6,dy:2,label:'A',name:'장독대'},
      {id:'u4',from:'u3',dir:'W',gap:10,w:16,d:14,dy:4,wall:{side:-1,width:4,extend:0,towers:'one'},name:'해 뜨는 벽'},
      {id:'top',from:'u4',dir:'N',gap:6,w:22,d:18,off:4,dy:2,label:'B',name:'언덕 꼭대기'},
      {id:'f1',from:'top',dir:'E',gap:12,w:28,d:18,off:2,dy:-4,name:'긴 활강',slide:{kind:'awning',axis:'x',at:2}},
      {id:'f2',from:'f1',dir:'E',gap:8,w:24,d:16,off:4,dy:-3,label:'C',name:'풍차 지붕'},
      {id:'f3',from:'f2',dir:'S',gap:12,w:20,d:28,off:6,dy:-4,name:'차양 거리',slide:{kind:'awning',axis:'z',at:2}},
      {id:'f4',from:'f3',dir:'S',gap:8,w:22,d:20,off:4,dy:-3,label:'D',name:'과수원 옥상'},
      {join:['start','f4'],kind:'drop'},
      {id:'f5',from:'f4',dir:'E',gap:12,w:20,d:20,off:6,dy:-4,name:'마지막 활강'},
      {id:'f6',from:'f5',dir:'S',gap:12,w:24,d:22,off:-6,dy:-3,label:'E',name:'언덕 아래 역'},
      {id:'v1',from:'f6',dir:'W',gap:6,w:30,d:14,off:4,dy:2,name:'기찻길 지붕',slide:{kind:'awning',axis:'x'}},
      {id:'v2',from:'v1',dir:'W',gap:6,w:18,d:16,off:-3,label:'F',name:'우체국 옥상'},
      {id:'v3',from:'v2',dir:'N',gap:6,w:14,d:12,off:1,dy:2,name:'골목 계단'},
      {join:['v3','start'],wall:{towers:'none'}},
      {id:'g1',from:'v2',dir:'W',gap:6,w:22,d:16,off:2,label:'G',name:'성당 마당'},
      {id:'g2',from:'g1',dir:'N',gap:6,w:16,d:16,off:-4,dy:2,name:'골목 끝'},
      {id:'g3',from:'g2',dir:'N',gap:6,w:18,d:20,off:-5,dy:1,label:'H',name:'언덕 학교'},
    ]},
  },
];
for(const map of MAPS){
  const {course,walls}=buildDistrict(map.layout);
  map.course=course;map.walls=walls;
  const slides=course.filter(p=>p.slide).length;
  map.tags=[map.difficulty,map.shape,`벽 ${walls.length}곳`,`슬라이딩 ${slides}곳`];
  map.storageKey=`roofrunner-records-v5-${map.id}`;
}
export function districtBounds(course){return {minX:Math.min(...course.map(p=>p.x-p.w/2)),maxX:Math.max(...course.map(p=>p.x+p.w/2)),minZ:Math.min(...course.map(p=>p.z-p.d/2)),maxZ:Math.max(...course.map(p=>p.z+p.d/2))};}
export function neighbors(course,index){return course[index].links;}
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
export let WALLS = activeMap.walls;
export let TOWERS = buildTowers(COURSE,WALLS);
export let GATES = buildGates(COURSE);
export let colliders = makeColliders(COURSE,TOWERS,GATES);
export function selectMap(id){
  const map=MAPS.find(m=>m.id===id)||MAPS[0];
  activeMap=map;COURSE=map.course;WALLS=map.walls;TOWERS=buildTowers(COURSE,WALLS);GATES=buildGates(COURSE);
  colliders=makeColliders(COURSE,TOWERS,GATES);
  return map;
}
export const BODY = { radius:.36, height:1.7, gravity:28, jump:12.8, walk:12, sprint:19.5, wallKick:11.5, wallJump:13, energy:1.8, slideBoost:3.5, slideMax:25, slideDuration:.95 };
export function createPlayer(index=0) {
  const r=COURSE[index];
  // Respawning on a roof with a low structure starts you at the far end from it along the lane it
  // blocks, with room to get up to speed and go down into the slide.
  let x=r.x,z=r.z+(index===0?4:0);
  if(index&&r.slide){const sign=(r.slide.at||0)>0?-1:1;if(r.slide.axis==='x')x+=sign*(r.w/2-1.5);else z+=sign*(r.d/2-1.5);}
  return {x,y:r.y,z,vx:0,vy:0,vz:0,grounded:true,roof:index,energy:BODY.energy,coyote:.12,jumpBuffer:0,angle:0,surface:'roof',
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
