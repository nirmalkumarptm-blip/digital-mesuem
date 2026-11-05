const fs=require('fs'),vm=require('vm'),path=require('path'),root=path.join(__dirname,'..');
const els={},H={};const mk=()=>({innerHTML:'',value:'',style:{},dataset:{},textContent:'',className:'',append(){},querySelector:()=>mk(),closest:()=>mk(),setAttribute(){}});
const doc={querySelector:s=>els[s]||(els[s]=mk()),querySelectorAll:()=>[],documentElement:{dataset:{}},addEventListener(t,f){(H[t]=H[t]||[]).push(f)},createElement:mk,title:''};
const ctx={document:doc,location:{hash:''},localStorage:{getItem:()=>null,setItem(){}},addEventListener(){},scrollTo(){},speechSynthesis:{cancel(){}},navigator:{},console,alert(){},setTimeout,
fetch:async f=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'))})};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(root,'js/app.js'),'utf8'),ctx);
const ev=s=>vm.runInContext(s,ctx),res=[];const ok=(n,c)=>res.push([n,!!c]);
setTimeout(()=>{const app=doc.querySelector('#app');
const routes=ev("NAV.map(n=>n[0])").concat(ev("K.map(k=>'king-'+k.id)"));
for(const r of routes){ctx.location.hash='#'+r;ev('render()');const h=app.innerHTML;ok('render '+r,h.length>80&&!/undefined|NaN|\[object/.test(h))}
ev("lang='ta'");for(const r of routes){ctx.location.hash='#'+r;ev('render()');const h=app.innerHTML;ok('ta render '+r,h.length>80&&!/undefined|NaN|\[object/.test(h))}
for(const l of ['ta','en']){ev(`lang='${l}'`);ctx.location.hash='#home';ev('render()');ok('lang '+l,app.innerHTML.length>500)}
ev("qs={lv:'e',i:0,sc:0,a:null,list:null}");ctx.location.hash='#quiz';ev('render()');
const click=b=>H.click[0]({target:{closest:()=>b}});const btn=d=>({dataset:d,textContent:'',setAttribute(){},closest:()=>mk()});
click(btn({qa:String(ev("Q.filter(q=>q[3]==='e')[0][2]"))}));ok('quiz correct +1',ev('qs.sc')===1);
click(btn({qn:'1'}));click(btn({qa:String((ev("Q.filter(q=>q[3]==='e')[1][2]")+1)%4)}));ok('quiz wrong +0',ev('qs.sc')===1);
for(const lv of ['m','h']){click(btn({lv}));ok('level '+lv,ev('qs.list.length')>=5)}
click(btn({qr:'1'}));ok('restart',ev('qs.i')===0&&ev('qs.sc')===0);
ev('doSearch("rajaraja")');ok('search hit',doc.querySelector('#sres').innerHTML.includes('Rajaraja'));
ev('doSearch("leiden")');ok('search topic',doc.querySelector('#sres').innerHTML.includes('Leiden'));
ev('doSearch("zzzz")');ok('search none',doc.querySelector('#sres').innerHTML.includes('No results'));
click(btn({bm:'k:rajaraja1'}));ok('bookmark add',ev("has('k:rajaraja1')"));click(btn({bm:'k:rajaraja1'}));ok('bookmark remove',!ev("has('k:rajaraja1')"));
console.log(JSON.stringify(res));process.exit(res.every(r=>r[1])?0:1)},300);
