function mk(s){return function(){s=(s*9301+49297)%233280;return s/233280}}

function sprig(seed){
  var r=mk(seed),c=["#a56dcc","#8e5bb5","#c093e0","#7a49a6","#b184d6"],
      o='<svg viewBox="0 0 60 220" aria-hidden="true"><path d="M30 220C28 160 34 100 30 24" stroke="#5c7a45" stroke-width="2" fill="none"/>';
  for(var i=0;i<34;i++){
    var y=30+i*5.2,s=i%2?1:-1,x=30+s*(3+r()*9)+(r()-.5)*3,a=s*(25+r()*35);
    o+='<ellipse cx="'+x.toFixed(1)+'" cy="'+y.toFixed(1)+'" rx="2.6" ry="5" fill="'+c[Math.floor(r()*5)]+'" transform="rotate('+a.toFixed(0)+' '+x.toFixed(1)+' '+y.toFixed(1)+')"/>';
    if(i%4==0)o+='<path d="M30 '+(y+14)+'L'+(30+s*16)+' '+(y+6)+'" stroke="#5c7a45" stroke-width="1.2"/>';
  }
  return o+'</svg>';
}
document.querySelectorAll(".sprig").forEach(function(e,i){e.innerHTML=sprig(i*37+11)});

var SHARDS=[
  [[2,2],[18,0],[38,4],[62,0],[82,3],[98,1],[100,22],[96,44],[100,68],[97,88],[100,98],[80,100],[58,96],[36,100],[14,97],[0,100],[3,76],[0,52],[4,28],[0,10]],
  [[0,0],[28,3],[52,0],[78,4],[100,0],[96,28],[100,54],[95,78],[100,100],[74,96],[48,100],[22,95],[0,100],[4,72],[0,46],[3,20]],
  [[4,0],[32,5],[64,0],[88,4],[96,0],[100,32],[95,58],[100,84],[96,100],[68,95],[38,100],[12,96],[0,100],[5,68],[0,38],[3,12]],
  [[0,3],[24,0],[56,4],[82,0],[100,2],[97,26],[100,58],[94,82],[100,100],[76,97],[44,100],[18,95],[0,98],[4,64],[0,32],[2,14]],
  [[2,0],[36,3],[68,0],[92,5],[100,0],[95,30],[100,62],[96,86],[100,100],[66,97],[32,100],[8,95],[0,100],[4,68],[0,36],[3,16]],
  [[0,0],[30,4],[58,0],[84,3],[100,0],[96,24],[100,50],[95,76],[100,100],[70,96],[40,100],[16,94],[0,100],[3,74],[0,42],[4,18]]
],n=0;

function pts(a){return a.map(function(p){return p.join(",")}).join(" ")}

function cracks(poly,seed){
  var r=mk(seed),o="",
      L=function(v,t){return[v[0]+(50-v[0])*t+(r()-.5)*12,v[1]+(50-v[1])*t+(r()-.5)*12]};
  for(var k=0;k<2;k++){
    var i=(seed+k*3)%poly.length,v=poly[i],a=L(v,.35),b=L(v,.7),br=[a[0]+(r()-.5)*40,a[1]+(r()-.5)*40];
    o+='<path class="g-crack" d="M'+v+'L'+a+'L'+b+'M'+a+'L'+br+'"/>';
    if(k==0)o+='<polygon class="g-sheen" points="'+v+' '+a+' '+poly[(i+1)%poly.length]+'"/>';
  }
  return o;
}

function buildGlass(root){(root||document).querySelectorAll(".glass:not(.built)").forEach(function(el){
  el.classList.add("built");
  var i=n++%SHARDS.length,p=SHARDS[i],w=document.createElement("div");
  w.className="in";
  while(el.firstChild)w.appendChild(el.firstChild);
  el.appendChild(w);
  el.insertAdjacentHTML("afterbegin",'<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon class="g-poly" points="'+pts(p)+'"/>'+cracks(p,i*5+3)+'</svg>');
});}
buildGlass();

document.querySelectorAll(".frame").forEach(function(el){
  var i=(n++*2+1)%SHARDS.length,p=SHARDS[i],c=el.firstElementChild;
  c.style.clipPath="polygon("+p.map(function(q){return q[0]+"% "+q[1]+"%"}).join(",")+")";
  el.insertAdjacentHTML("beforeend",'<svg class="ov" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><polygon class="g-edge" points="'+pts(p)+'"/>'+cracks(p,i*7+2)+'</svg>');
});

function shatter(cx,cy,seed,delay){
  var r=mk(seed),N=6,E=[],rays="",fill="",ring="",F=function(q){return q[0].toFixed(1)+","+q[1].toFixed(1)};
  for(var i=0;i<N;i++){
    var a=i/N*6.283+(r()-.5)*.35,pt=[];
    [12,35,90].forEach(function(d,j){
      var b=a+(r()-.5)*.18*j;
      pt.push([cx+Math.cos(b)*d*(.8+r()*.4),cy+Math.sin(b)*d*(.8+r()*.4)]);
    });
    E.push(pt);
    rays+='<path class="ray" style="--i:'+i+'" d="M'+cx+','+cy+'L'+pt.map(F).join("L")+'"/>';
  }
  E.forEach(function(p,i){
    var q=E[(i+1)%N];
    fill+='<polygon class="ray" style="--i:'+i+';--o:'+(r()*.07).toFixed(3)+'" points="'+cx+','+cy+' '+F(p[2])+' '+F(q[2])+'"/>';
  });
  var fx=document.getElementById("fx");
  if(fx.childElementCount>8){fx.removeChild(fx.firstElementChild);}
  var g=document.createElementNS("http://www.w3.org/2000/svg","g");
  g.innerHTML=fill+rays;
  fx.appendChild(g);
  return g;
}