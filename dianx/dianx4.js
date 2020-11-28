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
const $ = new Env('中国电信');
let notify = $.isNode() ? require('./sendNotify.js') : '';
let allmessage = "";
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

//  Header: '{"Cookie":"s_fid=407E5499351D8498-30FE1C4AD40BA996; s_cc=true; lvid=cd6f968543368feb3efed9118716646b; nvid=1; svid=0E4F4AA6D0A34119527279B438C41CA3","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=7ab21452310bb05b33c81928fd5c1ab7cabd49733f7fe4803f6caa0084b339b8&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=0E868E0026EC8F2F-37C6582C7626A49D; s_cc=true; lvid=85cedc6171cf8eec13bbbec25b6f4de3; nvid=1; svid=0F89C9AE6A7F5F1F8493E60DF64DCCFB","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=3bd42fc8410590117ed1605d71de21e9cf65b1a87a0e40ab5dbff9e3230676d4&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=333549E988BBB591-184018A5E37E33C4; s_cc=true; lvid=0abba86f4764736cdf5c28c7a5e4fb74; nvid=1; svid=96F4C024E775E48CD1A98B988CBEC751","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=04c922fecfb99dc14cfceff6d1a969e6979796a0d3aecf7ca9c627a7941f2f45&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=3B1308DED5C2AC7C-2CCA991787D4581D; s_cc=true; lvid=1b5bddea338382b169b65477bf7dc769; nvid=1; svid=DAAB04A8460A52753FE9522E55863212","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=3ab97639fe9d9c8bbe8d386f03cafb91d94a7c8cde02c6d26947c99a00cae16f&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=2C8B1ADA7387355C-078E0EBFF140E21B; s_cc=true; lvid=ab31d7536614cd32cd93659e6b37e4d5; nvid=1; svid=1F4A61BC3B04729095869A1A832AD1DA","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=77f7ec7311bd104f50cf216290969ea341f191d150a4d69cf01f2771835701f4&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}',
//  Body: '{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"1938fb8d1f29b81313fe4c5f58e97fc8","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"1bd9da5f0b798aafb643d7bc5f6f3c3c","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"4afeb4fa2ac1cc0ef24660c5e523bc5b","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"f0f1615ca872f05a83b6b98673e5a5e9","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"8ed31f7c54fcf5a0e72df091e47ef1d4","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}',
const COOKIELIST = {
  Header: '{"Cookie":"s_fid=407E5499351D8498-30FE1C4AD40BA996; s_cc=true; lvid=cd6f968543368feb3efed9118716646b; nvid=1; svid=0E4F4AA6D0A34119527279B438C41CA3","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=7ab21452310bb05b33c81928fd5c1ab7cabd49733f7fe4803f6caa0084b339b8&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=0E868E0026EC8F2F-37C6582C7626A49D; s_cc=true; lvid=85cedc6171cf8eec13bbbec25b6f4de3; nvid=1; svid=0F89C9AE6A7F5F1F8493E60DF64DCCFB","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=3bd42fc8410590117ed1605d71de21e9cf65b1a87a0e40ab5dbff9e3230676d4&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=333549E988BBB591-184018A5E37E33C4; s_cc=true; lvid=0abba86f4764736cdf5c28c7a5e4fb74; nvid=1; svid=96F4C024E775E48CD1A98B988CBEC751","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=04c922fecfb99dc14cfceff6d1a969e6979796a0d3aecf7ca9c627a7941f2f45&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=3B1308DED5C2AC7C-2CCA991787D4581D; s_cc=true; lvid=1b5bddea338382b169b65477bf7dc769; nvid=1; svid=DAAB04A8460A52753FE9522E55863212","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=3ab97639fe9d9c8bbe8d386f03cafb91d94a7c8cde02c6d26947c99a00cae16f&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}#{"Cookie":"s_fid=2C8B1ADA7387355C-078E0EBFF140E21B; s_cc=true; lvid=ab31d7536614cd32cd93659e6b37e4d5; nvid=1; svid=1F4A61BC3B04729095869A1A832AD1DA","Accept":"application/json, text/plain, */*","Content-Type":"application/json;charset=UTF-8","Origin":"https://wapside.189.cn:9001","Referer":"https://wapside.189.cn:9001/resources/dist/memberItems.html?ticket=77f7ec7311bd104f50cf216290969ea341f191d150a4d69cf01f2771835701f4&version=8.3.0&id=8a00fad571f8bb430171f8bea1380000","Connection":"keep-alive","Host":"wapside.189.cn:9001","Accept-Language":"zh-cn","User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_8 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;CtClient;8.3.0;iOS;12.4.8;iPad Air","Accept-Encoding":"br, gzip, deflate","Content-Length":"197"}',
  Body: '{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"1938fb8d1f29b81313fe4c5f58e97fc8","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"1bd9da5f0b798aafb643d7bc5f6f3c3c","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"4afeb4fa2ac1cc0ef24660c5e523bc5b","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"f0f1615ca872f05a83b6b98673e5a5e9","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}#{"id":"517f795a44472e10f82c0d305b463aff052fdc9e3cf3de7ad03e7df529a51cc2a5a36777dda38549d3be315eecf83f4e","phone":"8ed31f7c54fcf5a0e72df091e47ef1d4","exchangeNum":"bd280a5462a4d643fc3003d51c38bd27"}',
};

var cookieindex = 4

const evNotify = function(title, message, url) {
  if (typeof $feed !== "undefined") return $feed.push(title, message, url)
  if (typeof $notify !== "undefined") return $notify(title, '', message, url)
  if (typeof $notification !== "undefined") return $notification.post(title, '', message, url)
  console.log(title, message, url)
  allmessage = allmessage +title + message + '\n';
}

 if (typeof $done === "undefined") {
   function $done(obj) { console.log('done li ge done', obj) }
 }
let headArr = [], bodyArr = [];

!(async() => {
  /*********** 程序主要运行部分 ***************/
  if (typeof $request === "undefined") {
    headArr = COOKIELIST.Header.split("#");
    bodyArr = COOKIELIST.Body.split("#");
      console.log(`\n===================运行账号${cookieindex+1}========================\n`)
      console.log(`==================脚本执行- 北京时间(UTC+8)：${new Date(new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000).toLocaleString()}=====================\n`)
      const dianx_headers = sJson(headArr[cookieindex])
      const dianx_body = bodyArr[cookieindex]
      //console.log(headArr[i])
      //console.log(dianx_headers)
      //console.log(bodyArr[i])
      //console.log(dianx_body)
      //if (dianx_body && Object.keys(dianx_headers).length) 
      await exchange(dianx_headers, dianx_body)
      //else {
      //  evNotify('🎭 金豆兑换话费的 cookie 尚未设置', '请根据脚本内的注释，去电信营业厅 APP 进行获取')
      //  $done({})
     // }
    //notify.sendNotify(`电信兑换`,`${allmessage}`);
  } else {
    evNotify('🎭 进入cookie保存！','')
    saveCookie()
  }
  /******* end 程序主要运行部分 end ***********/
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())


function sJson(str) {
  if (typeof str === 'object') return str
  try {
    return JSON.parse(str)
  } catch(e) {
    return {}
  }
}

function simpPost(req, type) {	
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
function Env(t,s){return new class{constructor(t,s){this.name=t,this.data=null,this.dataFile="box.dat",this.logs=[],this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,s),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}getScript(t){return new Promise(s=>{$.get({url:t},(t,e,i)=>s(i))})}runScript(t,s){return new Promise(e=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let o=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");o=o?1*o:20,o=s&&s.timeout?s.timeout:o;const[h,a]=i.split("@"),r={url:`http://${a}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:o},headers:{"X-Key":h,Accept:"*/*"}};$.post(r,(t,s,i)=>e(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s);if(!e&&!i)return{};{const i=e?t:s;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),s=this.path.resolve(process.cwd(),this.dataFile),e=this.fs.existsSync(t),i=!e&&this.fs.existsSync(s),o=JSON.stringify(this.data);e?this.fs.writeFileSync(t,o):i?this.fs.writeFileSync(s,o):this.fs.writeFileSync(t,o)}}lodash_get(t,s,e){const i=s.replace(/\[(\d+)\]/g,".$1").split(".");let o=t;for(const t of i)if(o=Object(o)[t],void 0===o)return e;return o}lodash_set(t,s,e){return Object(t)!==t?t:(Array.isArray(s)||(s=s.toString().match(/[^.[\]]+/g)||[]),s.slice(0,-1).reduce((t,e,i)=>Object(t[e])===t[e]?t[e]:t[e]=Math.abs(s[i+1])>>0==+s[i+1]?[]:{},t)[s[s.length-1]]=e,t)}getdata(t){let s=this.getval(t);if(/^@/.test(t)){const[,e,i]=/^@(.*?)\.(.*?)$/.exec(t),o=e?this.getval(e):"";if(o)try{const t=JSON.parse(o);s=t?this.lodash_get(t,i,""):s}catch(t){s=""}}return s}setdata(t,s){let e=!1;if(/^@/.test(s)){const[,i,o]=/^@(.*?)\.(.*?)$/.exec(s),h=this.getval(i),a=i?"null"===h?null:h||"{}":"{}";try{const s=JSON.parse(a);this.lodash_set(s,o,t),e=this.setval(JSON.stringify(s),i)}catch(s){const h={};this.lodash_set(h,o,t),e=this.setval(JSON.stringify(h),i)}}else e=$.setval(t,s);return e}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,s){return this.isSurge()||this.isLoon()?$persistentStore.write(t,s):this.isQuanX()?$prefs.setValueForKey(t,s):this.isNode()?(this.data=this.loaddata(),this.data[s]=t,this.writedata(),!0):this.data&&this.data[s]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,s=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?$httpClient.get(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)}):this.isQuanX()?$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,s)=>{try{const e=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(e,null),s.cookieJar=this.ckjar}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t)))}post(t,s=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),delete t.headers["Content-Length"],this.isSurge()||this.isLoon())$httpClient.post(t,(t,e,i)=>{!t&&e&&(e.body=i,e.statusCode=e.status),s(t,e,i)});else if(this.isQuanX())t.method="POST",$task.fetch(t).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t));else if(this.isNode()){this.initGotEnv(t);const{url:e,...i}=t;this.got.post(e,i).then(t=>{const{statusCode:e,statusCode:i,headers:o,body:h}=t;s(null,{status:e,statusCode:i,headers:o,body:h},h)},t=>s(t))}}time(t){let s={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in s)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?s[e]:("00"+s[e]).substr((""+s[e]).length)));return t}msg(s=t,e="",i="",o){const h=t=>!t||!this.isLoon()&&this.isSurge()?t:"string"==typeof t?this.isLoon()?t:this.isQuanX()?{"open-url":t}:void 0:"object"==typeof t&&(t["open-url"]||t["media-url"])?this.isLoon()?t["open-url"]:this.isQuanX()?t:void 0:void 0;this.isSurge()||this.isLoon()?$notification.post(s,e,i,h(o)):this.isQuanX()&&$notify(s,e,i,h(o)),this.logs.push("","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="),this.logs.push(s),e&&this.logs.push(e),i&&this.logs.push(i)}log(...t){t.length>0?this.logs=[...this.logs,...t]:console.log(this.logs.join(this.logSeparator))}logErr(t,s){const e=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();e?$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):$.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(s=>setTimeout(s,t))}done(t={}){const s=(new Date).getTime(),e=(s-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${e} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,s)}
