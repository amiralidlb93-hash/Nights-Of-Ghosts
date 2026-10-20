var cv=document.getElementById('c'),ctx=cv.getContext('2d'),dk=document.createElement('canvas'),dx=dk.getContext('2d');
var W,H,D,stars=[],stones=[],pumps=[];
var fa=function(n){return Number(n).toLocaleString('fa-IR')};
var mx=0,my=0,state='menu',lvl=1,banner=0,score=0,tl=45,best=0,ghosts=[],parts=[],bats=[],flash=0,nextBolt=5,spawn=0,t=0,au=null;
try{best=+localStorage.getItem('ghostBest')||0}catch(e){}
document.getElementById('bs').textContent=fa(best);

function size(){
  D=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;
  [cv,dk].forEach(function(c){c.width=W*D;c.height=H*D});
  cv.style.width=W+'px';cv.style.height=H+'px';
  if(!mx){mx=W/2;my=H/2}
  stars=[];for(var i=0;i<140;i++)stars.push({x:Math.random()*W,y:Math.random()*H*.6,r:Math.random()*1.4+.3,p:Math.random()*6});
  stones=[];for(i=0;i<9;i++)stones.push({x:(i+.5)/9*W+(Math.random()-.5)*30,h:34+Math.random()*34,w:26+Math.random()*14,k:i%3});
  pumps=[0.14,0.43,0.71,0.9].map(function(f,i){return{x:f*W,s:16+(i%2)*8}});
  bats=[];for(i=0;i<9;i++)bats.push({x:W/2,y:H/2,a:Math.random()*6,r:50+Math.random()*90,sp:.6+Math.random()*.9,fl:Math.random()*6});
}
addEventListener('resize',size);size();
function pt(e){mx=e.clientX;my=e.clientY}
addEventListener('pointermove',pt);
addEventListener('pointerdown',function(e){pt(e);if(state==='play')hit()});

function beep(f,d,ty,v,sl){
  if(!au)return;var o=au.createOscillator(),g=au.createGain();
  o.type=ty||'sine';o.frequency.setValueAtTime(f,au.currentTime);
  if(sl)o.frequency.exponentialRampToValueAtTime(sl,au.currentTime+d);
  g.gain.setValueAtTime(v||.12,au.currentTime);g.gain.exponentialRampToValueAtTime(.001,au.currentTime+d);
  o.connect(g);g.connect(au.destination);o.start();o.stop(au.currentTime+d);
}
function burst(x,y,col){for(var i=0;i<22;i++){var a=Math.random()*6.28,s=60+Math.random()*180;parts.push({x:x,y:y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-40,l:1,c:col})}}
function hit(){
  for(var i=ghosts.length-1;i>=0;i--){
    var g=ghosts[i];if(g.dead)continue;
    if(Math.hypot(g.x-mx,g.y+Math.sin(g.p)*8-my)<g.s*.95){
      if(g.k==='demon'&&--g.hp>0){burst(g.x,g.y,'#ff4040');beep(200,.15,'square',.08,100);return}g.dead=1;score+=g.gold?5:g.k==='demon'?3:g.k==='skull'?2:1;burst(g.x,g.y,g.gold?'#ffd75e':g.k==='demon'?'#ff5a3c':'#bfe3ff');lvCheck();
      if(g.gold){beep(520,.12,'triangle');setTimeout(function(){beep(780,.15,'triangle')},90);setTimeout(function(){beep(1040,.2,'triangle')},180)}
      else beep(700,.25,'sawtooth',.08,180);
      document.getElementById('sc').textContent=fa(score);return;
    }
  }
  beep(120,.08,'square',.04);
}
function lvCheck(){var n=1+Math.floor(score/10);if(n>lvl){lvl=n;tl+=5;banner=2.2;flash=1;beep(200,.6,'sawtooth',.1,500);document.getElementById('lv').textContent=fa(lvl)}}
function start(){
  try{au=au||new(window.AudioContext||window.webkitAudioContext)()}catch(e){}
  score=0;lvl=1;banner=0;tl=45;ghosts=[];parts=[];spawn=0;state='play';document.getElementById('lv').textContent=fa(1);
  document.getElementById('sc').textContent=fa(0);
  document.getElementById('menu').hidden=true;document.getElementById('end').hidden=true;
}
function finish(){
  state='over';
  if(score>best){best=score;try{localStorage.setItem('ghostBest',best)}catch(e){}}
  document.getElementById('bs').textContent=fa(best);
  document.getElementById('fin').textContent=fa(score);
  document.getElementById('verdict').textContent=score>=best&&score>0?'رکورد جدید! روح‌ها ازت می‌ترسن 👻':score>20?'شکارچی حرفه‌ای!':'روح‌ها هنوز تو قبرستون پرسه می‌زنن…';
  document.getElementById('end').hidden=false;beep(90,1.2,'sawtooth',.1,40);
}
document.getElementById('go').onclick=start;document.getElementById('again').onclick=start;

function spawnGhost(){
  var l=Math.random()<.5,s=34+Math.random()*20;
  var r=Math.random(),k=lvl>=3&&r<.18?'demon':lvl>=2&&r<.4?'skull':'ghost';
  ghosts.push({x:l?-s:W+s,y:H*(.12+Math.random()*.5),vx:(l?1:-1)*(35+Math.random()*55+lvl*12+(k==='skull'?60:0)-(k==='demon'?25:0)),s:k==='demon'?s*1.3:s,p:Math.random()*6,k:k,hp:2,gold:k==='ghost'&&Math.random()<.1,dead:0});
}
function drawGhost(g,a){
  var s=g.s,y=g.y+Math.sin(g.p)*8,w=s*.275;
  ctx.save();ctx.globalAlpha=a;ctx.translate(g.x,y);ctx.scale(g.vx<0?1:-1,1);
  var col=g.gold?['#ffd75e','#ffb000']:g.k==='demon'?['#ff5a3c','#ff2000']:g.k==='skull'?['#efe6d0','#b6ff8a']:['#e9f2ff','#8fc8ff'];ctx.fillStyle=col[0];ctx.shadowColor=col[1];ctx.shadowBlur=20;
  ctx.beginPath();ctx.arc(0,-s*.1,s*.55,Math.PI,0);ctx.lineTo(s*.55,s*.6);
  for(var i=0;i<4;i++)ctx.quadraticCurveTo(s*.55-i*w-w/2,s*.6+(i%2?-1:1)*s*.2,s*.55-(i+1)*w,s*.6);
  ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='#10081a';
  ctx.beginPath();ctx.arc(-s*.2,-s*.15,s*.09,0,6.3);ctx.arc(s*.2,-s*.15,s*.09,0,6.3);ctx.fill();
  ctx.beginPath();ctx.ellipse(0,s*.12,s*.09,s*.13,0,0,6.3);ctx.fill();
  if(g.k==='demon'){ctx.fillStyle=col[0];[-1,1].forEach(function(d){ctx.beginPath();ctx.moveTo(d*s*.25,-s*.55);ctx.lineTo(d*s*.5,-s*.95);ctx.lineTo(d*s*.5,-s*.45);ctx.fill()});ctx.fillStyle='#ffe34a';ctx.beginPath();ctx.arc(-s*.2,-s*.15,s*.05,0,6.3);ctx.arc(s*.2,-s*.15,s*.05,0,6.3);ctx.fill()}
  if(g.k==='skull'){ctx.fillStyle='#10081a';ctx.fillRect(-s*.03,-s*.02,s*.06,s*.1)}
  ctx.restore();
}
function drawBat(b){
  var f=Math.sin(b.fl)*.9;ctx.save();ctx.translate(b.x,b.y);ctx.fillStyle='#05020a';
  ctx.beginPath();ctx.ellipse(0,0,5,7,0,0,6.3);ctx.fill();
  [-1,1].forEach(function(d){ctx.beginPath();ctx.moveTo(d*3,-2);ctx.quadraticCurveTo(d*16,-14-f*10,d*26,-2+f*8);ctx.quadraticCurveTo(d*17,2,d*12,4);ctx.quadraticCurveTo(d*8,0,d*3,5);ctx.fill()});
  ctx.restore();
}
function tree(x,y,len,ang,dep){
  if(dep<0)return;var x2=x+Math.cos(ang)*len,y2=y+Math.sin(ang)*len;
  ctx.lineWidth=dep*1.6+.6;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();
  tree(x2,y2,len*.74,ang-.5+Math.sin(dep*7+x)*.2,dep-1);tree(x2,y2,len*.72,ang+.45+Math.cos(dep*5+x)*.2,dep-1);
}
function scene(){
  var g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0a0420');g.addColorStop(.6,'#2b0f3d');g.addColorStop(1,'#4a1a2a');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  stars.forEach(function(s){ctx.globalAlpha=.4+.6*Math.abs(Math.sin(t*1.5+s.p));ctx.fillStyle='#fff';ctx.fillRect(s.x,s.y,s.r,s.r)});ctx.globalAlpha=1;
  var mr=Math.min(W,H)*.1,mxp=W*.78,myp=H*.2,mg=ctx.createRadialGradient(mxp,myp,mr*.5,mxp,myp,mr*3);
  mg.addColorStop(0,'rgba(255,214,150,.5)');mg.addColorStop(1,'rgba(255,214,150,0)');
  ctx.fillStyle=mg;ctx.fillRect(mxp-mr*3,myp-mr*3,mr*6,mr*6);
  ctx.fillStyle='#ffe3ae';ctx.beginPath();ctx.arc(mxp,myp,mr,0,6.3);ctx.fill();
  ctx.fillStyle='rgba(180,130,80,.35)';[[-.3,-.2,.22],[.25,.15,.3],[-.1,.4,.15]].forEach(function(c){ctx.beginPath();ctx.arc(mxp+c[0]*mr,myp+c[1]*mr,c[2]*mr,0,6.3);ctx.fill()});
  ctx.strokeStyle='#05020a';tree(W*.1,H*.86,H*.14,-1.57,6);tree(W*.9,H*.88,H*.11,-1.7,5);
  ctx.fillStyle='#08030f';ctx.beginPath();ctx.moveTo(0,H);ctx.lineTo(0,H*.86);
  ctx.quadraticCurveTo(W*.3,H*.8,W*.55,H*.87);ctx.quadraticCurveTo(W*.8,H*.93,W,H*.84);ctx.lineTo(W,H);ctx.fill();
  stones.forEach(function(s){var y=H*.9;ctx.fillStyle='#14091e';ctx.beginPath();
    if(s.k===0){ctx.moveTo(s.x-s.w/2,y);ctx.lineTo(s.x-s.w/2,y-s.h);ctx.quadraticCurveTo(s.x,y-s.h-s.w*.7,s.x+s.w/2,y-s.h);ctx.lineTo(s.x+s.w/2,y)}
    else if(s.k===1){ctx.rect(s.x-s.w/2,y-s.h,s.w,s.h);ctx.rect(s.x-s.w*.2,y-s.h*1.4,s.w*.4,s.h*1.4)}
    else{ctx.rect(s.x-s.w/2,y-s.h*.8,s.w,s.h*.8)}ctx.fill()});
  pumps.forEach(function(p){var y=H*.93;ctx.fillStyle='#e8650a';ctx.beginPath();ctx.ellipse(p.x,y,p.s*1.2,p.s,0,0,6.3);ctx.fill();
    ctx.fillStyle='#ffd05a';ctx.beginPath();ctx.moveTo(p.x-p.s*.5,y-p.s*.3);ctx.lineTo(p.x-p.s*.2,y-p.s*.3);ctx.lineTo(p.x-p.s*.35,y-p.s*.6);ctx.moveTo(p.x+p.s*.5,y-p.s*.3);ctx.lineTo(p.x+p.s*.2,y-p.s*.3);ctx.lineTo(p.x+p.s*.35,y-p.s*.6);
    ctx.moveTo(p.x-p.s*.5,y+p.s*.2);ctx.quadraticCurveTo(p.x,y+p.s*.7,p.x+p.s*.5,y+p.s*.2);ctx.fill()});
}
var inv=document.getElementById('inv'),menu=document.getElementById('menu'),F=['hn','dt','pl','dc'];
function card(){var v=F.map(function(i){return document.getElementById(i).value||'…'});document.getElementById('cardT').textContent='🎃 '+v[0]+' شما رو به مهمونی هالووین دعوت می‌کنه!\n📅 '+v[1]+'\n📍 '+v[2]+'\n🎭 '+v[3]}
F.forEach(function(i){document.getElementById(i).addEventListener('input',card)});card();
document.getElementById('invb').onclick=function(){menu.hidden=true;inv.hidden=false};
document.getElementById('back').onclick=function(){inv.hidden=true;menu.hidden=false};
document.getElementById('cp').onclick=function(){var b=this;try{navigator.clipboard.writeText(document.getElementById('cardT').textContent).then(function(){b.textContent='کپی شد ✓'})}catch(e){b.textContent='متن رو دستی کپی کن'}};
var last=performance.now();
function frame(now){
  var dt=Math.min((now-last)/1000,.05);last=now;t+=dt;
  ctx.setTransform(D,0,0,D,0,0);dx.setTransform(D,0,0,D,0,0);
  if(state==='play'){
    tl-=dt;if(tl<=0){tl=0;finish()}
    document.getElementById('tm').textContent=fa(Math.ceil(tl));
    spawn-=dt;if(spawn<=0&&ghosts.length<9){spawnGhost();spawn=Math.max(.4,1.1-lvl*.1)}
  }
  nextBolt-=dt;if(nextBolt<=0){flash=1;nextBolt=6+Math.random()*7;beep(60,.9,'sawtooth',.06,30)}
  flash=Math.max(0,flash-dt*2.2);
  scene();
  var R=Math.min(W,H)*(.2-Math.min(lvl-1,4)*.015+.012*Math.sin(t*9));
  ghosts.forEach(function(g){
    g.x+=g.vx*dt;g.p+=dt*2.2;if(g.k==='skull')g.y+=Math.sin(t*6+g.p)*40*dt;
    var d=Math.hypot(g.x-mx,g.y-my),vis=Math.max(.05,1-d/(R*1.1));
    drawGhost(g,g.dead?0:Math.min(1,vis+flash*.7));
  });
  ghosts=ghosts.filter(function(g){return !g.dead&&g.x>-100&&g.x<W+100});
  bats.forEach(function(b){
    b.a+=dt*b.sp*2;b.fl+=dt*22;
    var tx=mx+Math.cos(b.a)*b.r,ty=my+Math.sin(b.a*1.3)*b.r*.6-20;
    b.x+=(tx-b.x)*dt*3;b.y+=(ty-b.y)*dt*3;drawBat(b);
  });
  parts.forEach(function(p){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=240*dt;p.l-=dt*1.4;ctx.globalAlpha=Math.max(0,p.l);ctx.fillStyle=p.c;ctx.fillRect(p.x,p.y,3,3)});
  ctx.globalAlpha=1;parts=parts.filter(function(p){return p.l>0});
  /* darkness with light holes */
  dx.globalCompositeOperation='source-over';dx.clearRect(0,0,W,H);
  dx.fillStyle='rgba(4,1,10,'+(.93-flash*.6)+')';dx.fillRect(0,0,W,H);
  dx.globalCompositeOperation='destination-out';
  function hole(x,y,r,a){var g=dx.createRadialGradient(x,y,r*.1,x,y,r);g.addColorStop(0,'rgba(0,0,0,'+a+')');g.addColorStop(1,'rgba(0,0,0,0)');dx.fillStyle=g;dx.fillRect(x-r,y-r,r*2,r*2)}
  hole(mx,my,R,1);hole(W*.78,H*.2,Math.min(W,H)*.3,.7);
  pumps.forEach(function(p){hole(p.x,H*.93,p.s*4.5,.85)});
  ctx.drawImage(dk,0,0,W*D,H*D,0,0,W,H);
  if(flash>.05){ctx.fillStyle='rgba(200,215,255,'+flash*.3+')';ctx.fillRect(0,0,W,H)}
  /* lantern warm tint + cursor */
  if(banner>0){banner-=dt;ctx.save();ctx.globalAlpha=Math.min(1,banner);ctx.fillStyle='#ffc24a';ctx.shadowColor='#ff7a1a';ctx.shadowBlur=24;ctx.font='900 '+Math.min(W*.1,60)+'px Vazirmatn,Tahoma';ctx.textAlign='center';ctx.fillText('مرحله '+fa(lvl)+'! ‏+۵ ثانیه',W/2,H*.35);ctx.restore()}
  var lg=ctx.createRadialGradient(mx,my,0,mx,my,R);lg.addColorStop(0,'rgba(255,170,60,.22)');lg.addColorStop(1,'rgba(255,170,60,0)');
  ctx.fillStyle=lg;ctx.fillRect(mx-R,my-R,R*2,R*2);
  ctx.strokeStyle='rgba(255,210,120,.8)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(mx,my,9,0,6.3);ctx.moveTo(mx-15,my);ctx.lineTo(mx-5,my);ctx.moveTo(mx+5,my);ctx.lineTo(mx+15,my);ctx.stroke();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
