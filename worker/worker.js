// Cloudflare Worker: keeps the API key on the server. Secrets: ANTHROPIC_API_KEY. Vars: ALLOWED_ORIGIN, MODEL (optional).
const SYS="You are a careful historian of the Chola dynasty. Answer concisely. Separate established facts from debated interpretations. If unsure, say so. Do not invent dates, quotes or battles. Decline off-topic questions.";
export default{async fetch(req,env){
const cors={"Access-Control-Allow-Origin":env.ALLOWED_ORIGIN||"*","Access-Control-Allow-Headers":"Content-Type","Access-Control-Allow-Methods":"POST,OPTIONS"};
if(req.method==="OPTIONS")return new Response(null,{headers:cors});
if(req.method!=="POST")return new Response("Method not allowed",{status:405,headers:cors});
let q;try{q=String((await req.json()).question||"").slice(0,500)}catch{return new Response("Bad request",{status:400,headers:cors})}
if(!q.trim())return new Response("Empty question",{status:400,headers:cors});
const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":env.ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:env.MODEL||"claude-sonnet-5-5",max_tokens:600,system:SYS,messages:[{role:"user",content:q}]})});
if(!r.ok)return new Response("Upstream error",{status:502,headers:cors});
const d=await r.json();const answer=(d.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("\n");
return new Response(JSON.stringify({answer}),{headers:{...cors,"Content-Type":"application/json"}})}};
