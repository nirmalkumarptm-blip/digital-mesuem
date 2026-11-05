"""Smoke tests: data validation, file checks, HTTP serving, and a Node-driven render/logic test (no browser)."""
import json,os,re,subprocess,sys,threading,http.server,socketserver,urllib.request,functools
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));fails=[]
def chk(n,c):
    print(('PASS ' if c else 'FAIL ')+n); (c or fails.append(n))
L=lambda f:json.load(open(os.path.join(R,'data',f),encoding='utf8'))
kings=L('kings.json')['kings'];ev=L('timeline.json')['events'];q=L('quiz.json');h=L('history.json')
chk('unique king ids',len({k['id'] for k in kings})==len(kings))
chk('13 kings with reign+bio',len(kings)==13 and all(k['r'] and k['b'] for k in kings))
chk('all 13 kings detailed',all(k.get('ach') and k.get('ctx') and k.get('tn') for k in kings))
chk('Tamil summaries for all kings and temples',all(k.get('ts') for k in kings) and all(t.get('tb') for t in L('temples.json')))
chk('Tamil timeline and battles',all(e.get('tn') and e.get('tb') and e.get('td') for e in ev) and all(b.get('tn') and b.get('tb') for b in L('timeline.json')['battles']))
chk('Tamil king context and achievements',all(k.get('tctx') and len(k.get('tach',[]))==len(k['ach']) for k in kings))
chk('Tamil king bios and culture topics',all(k.get('tb') for k in kings) and all(t.get('tn') and t.get('tb') for t in h['topics']))
chk('quiz 4 options, valid answer',all(len(x['o'])==4 and 0<=x['a']<4 for x in q))
chk('quiz has easy/medium/hard',{x['l'] for x in q}=={'e','m','h'})
chk('30+ questions, 10+ per level',len(q)>=30 and all(sum(1 for x in q if x['l']==l)>=10 for l in 'emh'))
chk('Tamil quiz and facts',all(x.get('tq') and len(x.get('to',[]))==4 for x in q) and len(h['facts_ta'])==len(h['facts']))
chk('Tamil guide answers and reign dates',all(len(e)==3 for e in h['kb']) and all(k.get('tr') for k in kings))
chk('Tamil gallery, queens, temple features',all(len(g)>=5 for g in h['gallery']) and all(len(x)>=7 for x in L('kings.json')['queens']) and all(x.get('tf') for x in L('temples.json')))
chk('no duplicate questions',len({x['q'] for x in q})==len(q))
chk('facts have sources',all(len(f)==4 and f[3] for f in h['facts']))
css=open(os.path.join(R,'css/style.css'),encoding='utf8').read()
chk('palette colours',all(c.lower() in css.lower() for c in ['#D8C3A5','#A65E42','#49352A','#9A7548','#F5EBDD','#302820']))
chk('no maroon theme',not re.search('#6e1423',css,re.I))
idx=open(os.path.join(R,'index.html'),encoding='utf8').read()
chk('index links exist',all(os.path.exists(os.path.join(R,p)) for p in re.findall(r'(?:src|href)="((?:css|js)/[^"]+)"',idx)))
app=open(os.path.join(R,'js/app.js'),encoding='utf8').read()
chk('every nav page has a view',all(re.search(r'(^|\n|,)\s*%s\(\)|V\.%s='%(p,p),app) for p in re.findall(r"\['(\w+)','[^']+','[^']+'\]",app.split('const LN')[0])))
socketserver.TCPServer.allow_reuse_address=True
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(*a):pass
srv=socketserver.TCPServer(('127.0.0.1',0),functools.partial(Q,directory=R));threading.Thread(target=srv.serve_forever,daemon=True).start();port=srv.server_address[1]
for p in ['index.html','css/style.css','js/app.js']+['data/'+f for f in os.listdir(os.path.join(R,'data'))]:
    chk('HTTP 200 '+p,urllib.request.urlopen(f'http://127.0.0.1:{port}/{p}').status==200)
srv.shutdown()
r=subprocess.run(['node',os.path.join(R,'tests/render_test.js')],capture_output=True,text=True)
print(r.stdout[-1500:],r.stderr[-800:]);chk('node render/logic test',r.returncode==0)
print('FAILED:',fails) if fails else print('ALL PASSED');sys.exit(1 if fails else 0)
