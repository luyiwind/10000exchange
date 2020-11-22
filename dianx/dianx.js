// 功能：中国电信 400 金豆兑换 2 元话费
// 作者：https://t.me/elecV2
// 地址：https://github.com/elecV2/QuantumultX-Tools/tree/master/dianx
// 
// 使用：
// 首先添加 rewrite 复写订阅进行 cookie 获取。
// https://raw.githubusercontent.com/elecV2/QuantumultX-Tools/master/dianx/dianx.cookie.conf
// 
// cookie 获取条件：金豆数量大于 400，以及上午 10 点前。
// 打开电信营业厅，我->我的金豆->2元话费（热门兑换）->立即兑换->兑换。如果设置没问题，会弹出 cookie 获取成功的提醒。然后注释掉复写规则，防止重复弹窗。
// 
// 接着设置定时任务，在 10 点整进行话费兑换。每月 5 次兑换机会，下面的 cron 表示差不多每 3 天尝试兑换一次，可根据个人情况进行适当调整。
// 0 10 */3 * * https://raw.githubusercontent.com/elecV2/QuantumultX-Tools/master/dianx/dianx.js, tag=电信金豆兑换话费, img-url=https://raw.githubusercontent.com/elecV2/QuantumultX-Tools/master/dianx/dianx.png, enabled=true

// *建议配合 chavyleung 的电信签到脚本使用 https://github.com/chavyleung/scripts/tree/master/10000
const $ = new Env('中国电信')
const cookieMod = {
  get(key){
    if (COOKIELIST[key]) return COOKIELIST[key]
    if (typeof $store !== "undefined") return $store.get(key)
    if (typeof $prefs !== "undefined") return $prefs.valueForKey(key)
    if (typeof $persistentStore !== "undefined") return $persistentStore.read(key)
    if (typeof localStorage !== "undefined") return localStorage.getItem(key)
  },
  put(val, key){
    if (typeof $store !== "undefined") return $store.put(val, key)
    if (typeof $prefs !== "undefined") return $prefs.setValueForKey(val, key)
    if (typeof $persistentStore !== "undefined") return $persistentStore.write(val, key)
    if (typeof localStorage !== "undefined") {
      try { 
        localStorage.setItem(key, val)
        return true
      } catch(e) { return false }
    }
  }
}

const COOKIELIST = {
  Header: '{"Cookie":"s_fid=407E5499351D8498-30FE1C4AD40BA996; s_cc=true; lvid=cd6f968543368feb3efed9118716646b; nvid=1; svid=0E4F4AA6D0A34119527279B438C41CA3","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=7ab21452310bb05b33c81928fd5c1ab7cabd49733f7fe4803f6caa0084b339b8&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=0E868E0026EC8F2F-37C6582C7626A49D; s_cc=true; lvid=85cedc6171cf8eec13bbbec25b6f4de3; nvid=1; svid=0F89C9AE6A7F5F1F8493E60DF64DCCFB","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=3bd42fc8410590117ed1605d71de21e9cf65b1a87a0e40ab5dbff9e3230676d4&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=333549E988BBB591-184018A5E37E33C4; s_cc=true; lvid=0abba86f4764736cdf5c28c7a5e4fb74; nvid=1; svid=96F4C024E775E48CD1A98B988CBEC751","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=04c922fecfb99dc14cfceff6d1a969e6979796a0d3aecf7ca9c627a7941f2f45&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=3B1308DED5C2AC7C-2CCA991787D4581D; s_cc=true; lvid=1b5bddea338382b169b65477bf7dc769; nvid=1; svid=DAAB04A8460A52753FE9522E55863212","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=3ab97639fe9d9c8bbe8d386f03cafb91d94a7c8cde02c6d26947c99a00cae16f&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=2C8B1ADA7387355C-078E0EBFF140E21B; s_cc=true; lvid=ab31d7536614cd32cd93659e6b37e4d5; nvid=1; svid=1F4A61BC3B04729095869A1A832AD1DA","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=77f7ec7311bd104f50cf216290969ea341f191d150a4d69cf01f2771835701f4&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}',
  Body: '{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"1938fb8d1f29b81313fe4c5f58e97fc8","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"1bd9da5f0b798aafb643d7bc5f6f3c3c","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"4afeb4fa2ac1cc0ef24660c5e523bc5b","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"f0f1615ca872f05a83b6b98673e5a5e9","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"8ed31f7c54fcf5a0e72df091e47ef1d4","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}',
};

const simpPost = function(req, type) {
  
    return new Promise((resolve, reject)=>{
      $.post(req, (error, response, body)=>{
        if(error) {
          console.log('$httpClient error:', error)
          reject(error)
        } else {
          resolve(body)
        }
      })
    })
  
}

const evNotify = function(title, message, url) {
  if (typeof $feed !== "undefined") return $feed.push(title, message, url)
  if (typeof $notify !== "undefined") return $notify(title, '', message, url)
  if (typeof $notification !== "undefined") return $notification.post(title, '', message, url)
  console.log(title, message, url)
}

 if (typeof $done === "undefined") {
   function $done(obj) { console.log('done li ge done', obj) }
 }
let headArr = [], bodyArr = [];
/*********** 程序主要运行部分 ***************/
if (typeof $request === "undefined") {
  headArr = COOKIELIST.Header.split("#");
  bodyArr = COOKIELIST.Body.split("#");
  for (var i = 0; i < headArr.length; i++) { 
    console.log(`\n===================运行账号${i+1}========================\n`)
    console.log(`==================脚本执行- 北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()}=====================\n`)
    const dianx_headers = sJson(headArr[i])
    const dianx_body = bodyArr[i]
    console.log(headArr[i])
    console.log(dianx_headers)
    console.log(bodyArr[i])
    console.log(dianx_body)
    if (dianx_body && Object.keys(dianx_headers).length) exchange(dianx_headers, dianx_body)
    else {
      evNotify('🎭 金豆兑换话费的 cookie 尚未设置', '请根据脚本内的注释，去电信营业厅 APP 进行获取')
      $done({})
    }
  }
} else {
  evNotify('🎭 进入cookie保存！','')
  saveCookie()
}
/******* end 程序主要运行部分 end ***********/

function sJson(str) {
  if (typeof str === 'object') return str
  try {
    return JSON.parse(str)
  } catch(e) {
    return {}
  }
}


function saveCookie() {
let lastheader = cookieMod.get('dianx_headers')||'';
let lastbody = cookieMod.get('dianx_body')||'';
  if ($request.headers && $request.url.match(/api\/exchange\/consume/)) {
    console.log($request)
    let newheader = ''
    let newbody=''
    if (lastheader!=''){
      newheader = lastheader+'&'+JSON.stringify($request.headers); 
    }
    if (lastbody!=''){
      newbody = lastbody+'&'+$request.body;
    }
    if (cookieMod.put(newheader, 'dianx_headers')&& cookieMod.put(newbody, 'dianx_body')){
      console.log('金豆兑换话费相关 cookie 获取成功')
      console.log(`Total获取header:${newheader},body: ${newbody}`)
      evNotify('🎭 金豆兑换话费 cookie 获取成功！', '请注释掉相关复写规则。\n每天 10 点可兑换话费，请提前设置好定时任务')
    }
  } else {
    console.log('金豆兑换话费相关 cookie 获取失败')
  }
  $done({})
}

function exchange(headers, body) {
  const req = {
    url: 'https://wapside.189.cn:9001/api/exchange/consume',
    method: 'POST',
    headers, body
  }
  let title = '🎭 金豆兑换话费结果通知', message = ''
  simpPost(req).then(res=>{
    message = res.body || res.data || res
    console.log(message)
    message = sJson(message).resoultMsg || JSON.stringify(message)
  }).catch(err=>{
    console.log(err)
    message = (err.error || err.message || err) + '\n如超时并不表示兑换失败，以实际是否扣除金豆为准'
  }).finally(()=>{
    evNotify(title, message + '\n如兑换成功，通常半小时内会收到充值成功的短信')
    $done({})
  })
}

// prettier-ignore
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
