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

const COOKIELIST = {
  Header: process.env.TC_HEADER,
  Body: process.env.TC_BODY,
};

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

const simpPost = function(req, type) {
  if (typeof $axios !== "undefined") return $axios(req)
  if (typeof $task !== "undefined") return $task.fetch(req)
  if (typeof $httpClient !== "undefined") {
    const post = type ? $httpClient[type] : $httpClient.post
    return new Promise((resolve, reject)=>{
      post(req, (error, response, body)=>{
        if(error) {
          console.log('$httpClient error:', error)
          reject(error)
        } else {
          resolve(body)
        }
      })
    })
  }
  if (typeof fetch !== "undefined") {
    return new Promise((resolve, reject)=>{
      fetch(req.url, req).then(res=>res.text()).then(res=>{
        resolve(res)
      }).catch(e=>{
        console.log('fetch error:', e)
        reject(e)
      })
    })
  }
}

const evNotify = function(title, message, url) {
  if (typeof $feed !== "undefined") return $feed.push(title, message, url)
  if (typeof $notify !== "undefined") return $notify(title, '', message, url)
  if (typeof $notification !== "undefined") return $notification.post(title, '', message, url)
  console.log(title, message, url)
}

// if (typeof $done === "undefined") {
//   function $done(obj) { console.log('done li ge done', obj) }
// }
let headArr = [], bodyArr = [];
/*********** 程序主要运行部分 ***************/
if (typeof $request === "undefined") {
  headArr = COOKIELIST.Header.split("&");
  bodyArr = COOKIELIST.Body.split("&");
  for (var i = 0; i < headArr.length; i++) { 
    console.log(`===================运行账号${i+1}========================`)
    const dianx_headers = sJson(headArr[i])
    const dianx_body = bodyArr[i]
    if (dianx_body && Object.keys(dianx_headers).length) exchange(dianx_headers, dianx_body)
    else {
      evNotify('🎭 金豆兑换话费的 cookie 尚未设置', '请根据脚本内的注释，去电信营业厅 APP 进行获取')
      $done({})
    }
  }
} else {
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
  if ($request.headers && $request.url.match(/api\/exchange\/consume/)) {
    // console.log($request)
    if (cookieMod.put(JSON.stringify($request.headers), 'dianx_headers') && cookieMod.put($request.body, 'dianx_body')){
      console.log('金豆兑换话费相关 cookie 获取成功')
      console.log(`获取header:${JSON.stringify($request.headers)},body: ${$request.body}`)
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
