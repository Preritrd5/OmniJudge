import{f as e,r as t,u as n}from"./useRouter-BLUsgERj.js";import{a as r,c as i,d as a,f as o,g as s,i as c,m as l,n as u,p as d,r as f,s as ee,t as p,u as te}from"./admin.functions-8rIh8tdo.js";import{_ as m,a as h,c as g,d as _,f as v,g as y,h as b,i as x,l as S,m as C,n as w,o as T,p as E,r as ne,s as D,t as O,u as k,v as A,w as re,y as j}from"./index-B2-FEbOj.js";import{t as ie}from"./ChromeScene-DhvNKBgP.js";import{n as ae,t as oe}from"./Footer-_Fa_yTqG.js";var se=class extends T{#e;#t=void 0;#n;#r;constructor(e,t){super(),this.#e=e,this.setOptions(t),this.bindMethods(),this.#i()}bindMethods(){this.mutate=this.mutate.bind(this),this.reset=this.reset.bind(this)}setOptions(e){let t=this.options;this.options=this.#e.defaultMutationOptions(e),b(this.options,t)||this.#e.getMutationCache().notify({type:`observerOptionsUpdated`,mutation:this.#n,observer:this}),t?.mutationKey&&this.options.mutationKey&&S(t.mutationKey)!==S(this.options.mutationKey)?this.reset():this.#n?.state.status===`pending`&&this.#n.setOptions(this.options)}onUnsubscribe(){this.hasListeners()||this.#n?.removeObserver(this)}onMutationUpdate(e){this.#i(),this.#a(e)}getCurrentResult(){return this.#t}reset(){this.#n?.removeObserver(this),this.#n=void 0,this.#i(),this.#a()}mutate(e,t){return this.#r=t,this.#n?.removeObserver(this),this.#n=this.#e.getMutationCache().build(this.#e,this.options),this.#n.addObserver(this),this.#n.execute(e)}#i(){let e=this.#n?.state??ne();this.#t={...e,isPending:e.status===`pending`,isSuccess:e.status===`success`,isError:e.status===`error`,isIdle:e.status===`idle`,mutate:this.mutate,reset:this.reset}}#a(e){D.batch(()=>{if(this.#r&&this.hasListeners()){let t=this.#t.variables,n=this.#t.context,r={client:this.#e,meta:this.options.meta,mutationKey:this.options.mutationKey};if(e?.type===`success`){try{this.#r.onSuccess?.(e.data,t,n,r)}catch(e){Promise.reject(e)}try{this.#r.onSettled?.(e.data,null,t,n,r)}catch(e){Promise.reject(e)}}else if(e?.type===`error`){try{this.#r.onError?.(e.error,t,n,r)}catch(e){Promise.reject(e)}try{this.#r.onSettled?.(void 0,e.error,t,n,r)}catch(e){Promise.reject(e)}}}this.listeners.forEach(e=>{e(this.#t)})})}},M=class extends T{constructor(e,t){super(),this.options=t,this.#e=e,this.#s=null,this.#o=x(),this.bindMethods(),this.setOptions(t)}#e;#t=void 0;#n=void 0;#r=void 0;#i;#a;#o;#s;#c;#l;#u;#d;#f;#p;#m=new Set;bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(this.#t.addObserver(this),N(this.#t,this.options)?this.#h():this.updateResult(),this.#y())}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return P(this.#t,this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return P(this.#t,this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,this.#b(),this.#x(),this.#t.removeObserver(this)}setOptions(e){let t=this.options,n=this.#t;if(this.options=this.#e.defaultQueryOptions(e),this.options.enabled!==void 0&&typeof this.options.enabled!=`boolean`&&typeof this.options.enabled!=`function`&&typeof E(this.options.enabled,this.#t)!=`boolean`)throw Error(`Expected enabled to be a boolean or a callback that returns a boolean`);this.#S(),this.#t.setOptions(this.options),t._defaulted&&!b(this.options,t)&&this.#e.getQueryCache().notify({type:`observerOptionsUpdated`,query:this.#t,observer:this});let r=this.hasListeners();r&&F(this.#t,n,this.options,t)&&this.#h(),this.updateResult(),r&&(this.#t!==n||E(this.options.enabled,this.#t)!==E(t.enabled,this.#t)||C(this.options.staleTime,this.#t)!==C(t.staleTime,this.#t))&&this.#g();let i=this.#_();r&&(this.#t!==n||E(this.options.enabled,this.#t)!==E(t.enabled,this.#t)||i!==this.#p)&&this.#v(i)}getOptimisticResult(e){let t=this.#e.getQueryCache().build(this.#e,e),n=this.createResult(t,e);return L(this,n)&&(this.#r=n,this.#a=this.options,this.#i=this.#t.state),n}getCurrentResult(){return this.#r}trackResult(e,t){return new Proxy(e,{get:(e,n)=>(this.trackProp(n),t?.(n),n===`promise`&&(this.trackProp(`data`),!this.options.experimental_prefetchInRender&&this.#o.status===`pending`&&this.#o.reject(Error(`experimental_prefetchInRender feature flag is not enabled`))),Reflect.get(e,n))})}trackProp(e){this.#m.add(e)}getCurrentQuery(){return this.#t}refetch({...e}={}){return this.fetch({...e})}fetchOptimistic(e){let t=this.#e.defaultQueryOptions(e),n=this.#e.getQueryCache().build(this.#e,t);return n.fetch().then(()=>this.createResult(n,t))}fetch(e){return this.#h({...e,cancelRefetch:e.cancelRefetch??!0}).then(()=>(this.updateResult(),this.#r))}#h(e){this.#S();let t=this.#t.fetch(this.options,e);return e?.throwOnError||(t=t.catch(_)),t}#g(){this.#b();let e=C(this.options.staleTime,this.#t);if(g.isServer()||this.#r.isStale||!k(e))return;let t=m(this.#r.dataUpdatedAt,e)+1;this.#d=A.setTimeout(()=>{this.#r.isStale||this.updateResult()},t)}#_(){return(typeof this.options.refetchInterval==`function`?this.options.refetchInterval(this.#t):this.options.refetchInterval)??!1}#v(e){this.#x(),this.#p=e,!(g.isServer()||E(this.options.enabled,this.#t)===!1||!k(this.#p)||this.#p===0)&&(this.#f=A.setInterval(()=>{(this.options.refetchIntervalInBackground||h.isFocused())&&this.#h()},this.#p))}#y(){this.#g(),this.#v(this.#_())}#b(){this.#d!==void 0&&(A.clearTimeout(this.#d),this.#d=void 0)}#x(){this.#f!==void 0&&(A.clearInterval(this.#f),this.#f=void 0)}createResult(e,t){let n=this.#t,r=this.options,i=this.#r,a=this.#i,o=this.#a,s=e===n?this.#n:e.state,{state:c}=e,l={...c},u=!1,d;if(t._optimisticResults){let i=this.hasListeners(),a=!i&&N(e,t),o=i&&F(e,n,t,r);(a||o)&&(l={...l,...w(c.data,e.options)}),t._optimisticResults===`isRestoring`&&(l.fetchStatus=`idle`)}let{error:f,errorUpdatedAt:ee,status:p}=l;d=l.data;let te=!1;if(t.placeholderData!==void 0&&d===void 0&&p===`pending`){let e;i?.isPlaceholderData&&t.placeholderData===o?.placeholderData?(e=i.data,te=!0):e=typeof t.placeholderData==`function`?t.placeholderData(this.#u?.state.data,this.#u):t.placeholderData,e!==void 0&&(p=`success`,d=v(i?.data,e,t),u=!0)}if(t.select&&d!==void 0&&!te)if(i&&d===a?.data&&t.select===this.#c)d=this.#l;else try{this.#c=t.select,d=t.select(d),d=v(i?.data,d,t),this.#l=d,this.#s=null}catch(e){this.#s=e}this.#s&&(f=this.#s,d=this.#l,ee=Date.now(),p=`error`);let m=l.fetchStatus===`fetching`,h=p===`pending`,g=p===`error`,_=h&&m,y=d!==void 0,b={status:p,fetchStatus:l.fetchStatus,isPending:h,isSuccess:p===`success`,isError:g,isInitialLoading:_,isLoading:_,data:d,dataUpdatedAt:l.dataUpdatedAt,error:f,errorUpdatedAt:ee,failureCount:l.fetchFailureCount,failureReason:l.fetchFailureReason,errorUpdateCount:l.errorUpdateCount,isFetched:e.isFetched(),isFetchedAfterMount:l.dataUpdateCount>s.dataUpdateCount||l.errorUpdateCount>s.errorUpdateCount,isFetching:m,isRefetching:m&&!h,isLoadingError:g&&!y,isPaused:l.fetchStatus===`paused`,isPlaceholderData:u,isRefetchError:g&&y,isStale:I(e,t),refetch:this.refetch,promise:this.#o,isEnabled:E(t.enabled,e)!==!1};if(this.options.experimental_prefetchInRender){let t=b.data!==void 0,r=b.status===`error`&&!t,i=e=>{r?e.reject(b.error):t&&e.resolve(b.data)},a=()=>{i(this.#o=b.promise=x())},o=this.#o;switch(o.status){case`pending`:e.queryHash===n.queryHash&&i(o);break;case`fulfilled`:(r||b.data!==o.value)&&a();break;case`rejected`:(!r||b.error!==o.reason)&&a();break}}return b}updateResult(){let e=this.#r,t=this.createResult(this.#t,this.options);this.#i=this.#t.state,this.#a=this.options,this.#i.data!==void 0&&(this.#u=this.#t),!b(t,e)&&(this.#r=t,this.#C({listeners:(()=>{if(!e)return!0;let{notifyOnChangeProps:t}=this.options,n=typeof t==`function`?t():t;if(n===`all`||!n&&!this.#m.size)return!0;let r=new Set(n??this.#m);return this.options.throwOnError&&r.add(`error`),Object.keys(this.#r).some(t=>{let n=t;return this.#r[n]!==e[n]&&r.has(n)})})()}))}#S(){let e=this.#e.getQueryCache().build(this.#e,this.options);if(e===this.#t)return;let t=this.#t;this.#t=e,this.#n=e.state,this.hasListeners()&&(t?.removeObserver(this),e.addObserver(this))}onQueryUpdate(){this.updateResult(),this.hasListeners()&&this.#y()}#C(e){D.batch(()=>{e.listeners&&this.listeners.forEach(e=>{e(this.#r)}),this.#e.getQueryCache().notify({query:this.#t,type:`observerResultsUpdated`})})}};function ce(e,t){return E(t.enabled,e)!==!1&&e.state.data===void 0&&!(e.state.status===`error`&&E(t.retryOnMount,e)===!1)}function N(e,t){return ce(e,t)||e.state.data!==void 0&&P(e,t,t.refetchOnMount)}function P(e,t,n){if(E(t.enabled,e)!==!1&&C(t.staleTime,e)!==`static`){let r=typeof n==`function`?n(e):n;return r===`always`||r!==!1&&I(e,t)}return!1}function F(e,t,n,r){return(e!==t||E(r.enabled,e)===!1)&&(!n.suspense||e.state.status!==`error`)&&I(e,n)}function I(e,t){return E(t.enabled,e)!==!1&&e.isStaleByTime(C(t.staleTime,e))}function L(e,t){return!b(e.getCurrentResult(),t)}var R=e(n(),1),z=t();function le(){let e=!1;return{clearReset:()=>{e=!1},reset:()=>{e=!0},isReset:()=>e}}var B=R.createContext(le()),ue=()=>R.useContext(B),V=(e,t,n)=>{let r=n?.state.error&&typeof e.throwOnError==`function`?y(e.throwOnError,[n.state.error,n]):e.throwOnError;(e.suspense||e.experimental_prefetchInRender||r)&&(t.isReset()||(e.retryOnMount=!1))},de=e=>{R.useEffect(()=>{e.clearReset()},[e])},H=({result:e,errorResetBoundary:t,throwOnError:n,query:r,suspense:i})=>e.isError&&!t.isReset()&&!e.isFetching&&r&&(i&&e.data===void 0||y(n,[e.error,r])),fe=R.createContext(!1),pe=()=>R.useContext(fe);fe.Provider;var me=e=>{if(e.suspense){let t=1e3,n=e=>e===`static`?e:Math.max(e??t,t),r=e.staleTime;e.staleTime=typeof r==`function`?(...e)=>n(r(...e)):n(r),typeof e.gcTime==`number`&&(e.gcTime=Math.max(e.gcTime,t))}},U=(e,t)=>e.isLoading&&e.isFetching&&!t,W=(e,t)=>e?.suspense&&t.isPending,he=(e,t,n)=>t.fetchOptimistic(e).catch(()=>{n.clearReset()});function G(e,t,n){let r=pe(),i=ue(),a=O(n),o=a.defaultQueryOptions(e);a.getDefaultOptions().queries?._experimental_beforeQuery?.(o);let s=a.getQueryCache().get(o.queryHash),c=e.subscribed!==!1;o._optimisticResults=r?`isRestoring`:c?`optimistic`:void 0,me(o),V(o,i,s),de(i);let l=!a.getQueryCache().get(o.queryHash),[u]=R.useState(()=>new t(a,o)),d=u.getOptimisticResult(o),f=!r&&c;if(R.useSyncExternalStore(R.useCallback(e=>{let t=f?u.subscribe(D.batchCalls(e)):_;return u.updateResult(),t},[u,f]),()=>u.getCurrentResult(),()=>u.getCurrentResult()),R.useEffect(()=>{u.setOptions(o)},[o,u]),W(o,d))throw he(o,u,i);if(H({result:d,errorResetBoundary:i,throwOnError:o.throwOnError,query:s,suspense:o.suspense}))throw d.error;return a.getDefaultOptions().queries?._experimental_afterQuery?.(o,d),o.experimental_prefetchInRender&&!g.isServer()&&U(d,r)&&(l?he(o,u,i):s?.promise)?.catch(_).finally(()=>{u.updateResult()}),o.notifyOnChangeProps?d:u.trackResult(d)}function ge(e,t){return G(e,M,t)}function _e(e,t){let n=O(t),[r]=R.useState(()=>new se(n,e));R.useEffect(()=>{r.setOptions(e)},[r,e]);let i=R.useSyncExternalStore(R.useCallback(e=>r.subscribe(D.batchCalls(e)),[r]),()=>r.getCurrentResult(),()=>r.getCurrentResult()),a=R.useCallback((e,t)=>{r.mutate(e,t).catch(_)},[r]);if(i.error&&y(r.options.throwOnError,[i.error]))throw i.error;return{...i,mutate:a,mutateAsync:i.mutate}}var K=`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600;700;800;900&display=swap');
  
  @page {
    size: A4 portrait;
    margin: 8mm 10mm;
  }
  
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  body {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    margin: 0;
    padding: 0;
    background: #f8fafc;
    color: #0f172a;
    font-size: 11.5px;
    line-height: 1.4;
  }
  
  .heading-font {
    font-family: 'Space Grotesk', sans-serif;
  }
  
  .sheet {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    background: #ffffff;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    overflow: hidden;
    page-break-inside: avoid;
  }
  
  .sheet-page {
    position: relative;
    min-height: 272mm;
    max-height: 278mm;
    padding: 16px 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
  }
  
  .page-break {
    page-break-after: always;
    break-after: page;
  }
  
  .watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 320px;
    height: 320px;
    opacity: 0.045;
    pointer-events: none;
    z-index: 0;
    object-fit: contain;
  }
  
  .content-relative {
    position: relative;
    z-index: 1;
  }
  
  .badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .badge-gold { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
  .badge-blue { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
  .badge-emerald { background: #d1fae5; color: #047857; border: 1px solid #a7f3d0; }
  
  table.criteria-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 11px;
  }
  
  table.criteria-table th {
    background: #f1f5f9;
    color: #475569;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding: 6px 8px;
    border: 1px solid #e2e8f0;
    text-align: left;
  }
  
  table.criteria-table td {
    padding: 5px 8px;
    border: 1px solid #e2e8f0;
    vertical-align: middle;
  }
  
  .bar-container {
    background: #e2e8f0;
    border-radius: 3px;
    height: 7px;
    overflow: hidden;
    width: 100%;
  }
  
  .bar-fill {
    height: 100%;
    border-radius: 3px;
  }
  
  .report-footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 8px;
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 9.5px;
    color: #64748b;
  }
  
  .sign-box {
    text-align: center;
    border-top: 1px dashed #94a3b8;
    padding-top: 4px;
    width: 150px;
    font-size: 10px;
  }
  
  @media print {
    body {
      background: #ffffff;
      padding: 0;
    }
    .sheet {
      box-shadow: none;
      max-width: 100%;
      margin: 0;
    }
    .no-print {
      display: none !important;
    }
  }
  
  .floating-print-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #0f172a;
    color: #ffffff;
    border: 1px solid #334155;
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    z-index: 9999;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
  }
  .floating-print-btn:hover {
    background: #1e293b;
    transform: translateY(-2px);
  }
`;function q(){return new Date().toLocaleDateString(`en-IN`,{day:`numeric`,month:`short`,year:`numeric`})}function J(e,t,n){return`
    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #0f172a;padding-bottom:10px;margin-bottom:12px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <img src="/logo.png" alt="Logo" style="height:44px;width:44px;border-radius:50%;object-fit:cover;border:1px solid #cbd5e1;" onerror="this.style.display='none'" />
        <div>
          <div style="font-size:9px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#d97706;" class="heading-font">IDEATHON 2026</div>
          <h1 style="margin:0;font-size:19px;font-weight:800;color:#0f172a;line-height:1.1;" class="heading-font">${e}</h1>
          <div style="font-size:10.5px;color:#64748b;margin-top:2px;">${t}</div>
        </div>
      </div>
      <div style="text-align:right;">
        ${n?`<div class="badge badge-gold" style="margin-bottom:4px;">📌 ${n}</div>`:``}
        <div style="font-size:9.5px;color:#64748b;">Generated: <b>${q()}</b></div>
        <div style="font-size:8.5px;color:#94a3b8;letter-spacing:0.5px;">CONFIDENTIAL EVALUATION</div>
      </div>
    </div>
  `}function Y(e=`Page 1 of 1`){return`
    <div class="report-footer">
      <div>
        <span style="font-weight:700;color:#0f172a;">© 2026 Ideathon.</span> All rights reserved. · Built by <b>Team SNPSU-Nexus</b>
      </div>
      <div style="text-align:center;color:#475569;font-size:9px;">
        Guided by <b>Denny Sir</b> & <b>Bhavya Mam</b>
      </div>
      <div style="font-weight:600;color:#64748b;">
        ${e}
      </div>
    </div>
  `}function ve(e){let t=e.submissions.find(t=>t.score===e.bestScore)||e.submissions[0],n=t?.result||{},r=e.bestScore??t?.score??0,i=t?.category||e.latest?.category||`General`,a=n.overallRating||(r>=80?`Outstanding`:r>=65?`Proficient`:`Needs Improvement`),o=(n.criteria||[]).slice(0,10).map(e=>{let t=e.maxScore??10,n=Math.round(e.score/t*100),r=n>=80?`#059669`:n>=55?`#d97706`:`#dc2626`,i=e.evalMode===`manual`||e.type===`manual`||e.id===`F7`||e.id===`F8`?`<span style="font-size:8px;padding:1px 4px;border-radius:3px;font-weight:700;margin-left:4px;background:#f3e8ff;color:#7e22ce;border:1px solid #d8b4fe;">JURY</span>`:`<span style="font-size:8px;padding:1px 4px;border-radius:3px;font-weight:700;margin-left:4px;background:#e0f2fe;color:#0284c7;border:1px solid #bae6fd;">AI</span>`;return`
      <tr>
        <td style="font-weight:700;color:#1e293b;width:34px;">${e.id}</td>
        <td style="color:#334155;font-weight:500;">${e.name} ${i}</td>
        <td style="width:90px;">
          <div class="bar-container">
            <div class="bar-fill" style="width:${n}%;background:${r};"></div>
          </div>
        </td>
        <td style="text-align:right;font-weight:800;color:${r};width:45px;">${e.score}/${t}</td>
      </tr>
    `}).join(``),s=(n.strengths||[]).slice(0,3).map(e=>`<li style="margin-bottom:3px;">${e}</li>`).join(``),c=(n.weaknesses||[]).slice(0,3).map(e=>`<li style="margin-bottom:3px;">${e}</li>`).join(``),l=(n.suggestions||[]).slice(0,3).map(e=>`<li style="margin-bottom:3px;">${e}</li>`).join(``);return`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Ideathon 2026 — Scorecard: ${e.name}</title>
      <style>${K}</style>
    </head>
    <body>
      <div class="sheet">
        <div class="sheet-page">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            ${J(`Executive Scorecard: ${e.name}`,`Leader: ${e.leader_email||`Not specified`}`,i)}
            
            <!-- Hero Score Banner -->
            <div style="display:grid;grid-template-columns:1fr auto;gap:16px;background:linear-gradient(135deg, #0f172a, #1e293b);color:#f8fafc;padding:12px 18px;border-radius:8px;margin-bottom:12px;align-items:center;">
              <div>
                <div style="font-size:9.5px;text-transform:uppercase;letter-spacing:1.5px;color:#94a3b8;">Official AI Rubric Evaluation</div>
                <div style="font-size:20px;font-weight:800;color:#ffffff;" class="heading-font">${e.name}</div>
                <div style="font-size:10.5px;color:#cbd5e1;margin-top:2px;">
                  Submission: <b>${t?.file_name||`Pitch Deck`}</b> · Category: <b>${i}</b>
                </div>
              </div>
              <div style="text-align:right;background:rgba(255,255,255,0.06);padding:8px 14px;border-radius:6px;border:1px solid rgba(255,255,255,0.12);">
                <div style="font-size:32px;font-weight:900;color:#fbbf24;line-height:1;" class="heading-font">${r}<span style="font-size:14px;color:#94a3b8;">/100</span></div>
                <div style="font-size:9.5px;color:#fde68a;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">${a}</div>
              </div>
            </div>

            <!-- Summary Box -->
            ${n.executiveSummary?`
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:3px solid #d97706;padding:8px 12px;border-radius:4px;margin-bottom:12px;font-size:10.5px;color:#334155;">
                <b style="color:#0f172a;">Executive Overview:</b> ${n.executiveSummary}
              </div>
            `:``}

            <!-- Criteria Breakdown Table -->
            <div style="margin-bottom:12px;">
              <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:5px;" class="heading-font">
                📊 Rubric Evaluation Breakdown (10 Criteria)
              </div>
              <table class="criteria-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Rubric Criterion</th>
                    <th>Performance Gauge</th>
                    <th style="text-align:right;">Marks</th>
                  </tr>
                </thead>
                <tbody>
                  ${o||`<tr><td colspan="4" style="text-align:center;color:#64748b;padding:12px;">Rubric breakdown evaluated out of 100 marks.</td></tr>`}
                </tbody>
              </table>
            </div>

            <!-- Insights 3-column Grid -->
            <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px;">
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:8px 10px;">
                <div style="font-size:10px;font-weight:800;color:#166534;text-transform:uppercase;margin-bottom:4px;">✅ Key Strengths</div>
                <ul style="margin:0;padding-left:14px;font-size:9.5px;color:#14532d;line-height:1.35;">${s||`<li>Clear alignment with problem statement</li>`}</ul>
              </div>
              <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:6px;padding:8px 10px;">
                <div style="font-size:10px;font-weight:800;color:#9f1239;text-transform:uppercase;margin-bottom:4px;">⚠️ Areas to Improve</div>
                <ul style="margin:0;padding-left:14px;font-size:9.5px;color:#881337;line-height:1.35;">${c||`<li>Further validate financial models</li>`}</ul>
              </div>
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:8px 10px;">
                <div style="font-size:10px;font-weight:800;color:#1e40af;text-transform:uppercase;margin-bottom:4px;">💡 Suggestions</div>
                <ul style="margin:0;padding-left:14px;font-size:9.5px;color:#1e3a8a;line-height:1.35;">${l||`<li>Include live pilot metric roadmap</li>`}</ul>
              </div>
            </div>

            <!-- Evaluator Signatures -->
            <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:10px;padding:6px 12px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;">
              <div>
                <div style="font-size:9.5px;font-weight:700;color:#0f172a;">Ideathon 2026 Evaluation Committee</div>
                <div style="font-size:8.5px;color:#64748b;">Official validation and grading certificate</div>
              </div>
              <div style="display:flex;gap:24px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Denny Sir</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor & Judge</div>
                </div>
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Bhavya Mam</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor & Judge</div>
                </div>
              </div>
            </div>

          </div>

          ${Y(`Page 1 of 1 — Official Scorecard`)}
        </div>
      </div>

      <button onclick="window.print()" class="floating-print-btn no-print">
        🖨️ Print / Save as PDF
      </button>
    </body>
    </html>
  `}function ye(e){let t=e.submissions.find(t=>t.score===e.bestScore)||e.submissions[0],n=t?.result||{},r=e.bestScore??t?.score??0,i=t?.category||e.latest?.category||`General`,a=n.overallRating||(r>=80?`Outstanding`:r>=65?`Proficient`:`Needs Improvement`),o=(n.criteria||[]).map(e=>{let t=e.maxScore??10,n=Math.round(e.score/t*100),r=n>=80?`#059669`:n>=55?`#d97706`:`#dc2626`,i=e.evalMode===`manual`||e.type===`manual`||e.id===`F7`||e.id===`F8`?`<span style="font-size:8px;padding:1px 5px;border-radius:3px;font-weight:700;margin-left:5px;background:#f3e8ff;color:#7e22ce;border:1px solid #d8b4fe;">✍️ LIVE JURY</span>`:`<span style="font-size:8px;padding:1px 5px;border-radius:3px;font-weight:700;margin-left:5px;background:#e0f2fe;color:#0284c7;border:1px solid #bae6fd;">🤖 AI EVALUATED</span>`;return`
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="font-weight:800;color:#0f172a;padding:7px 8px;vertical-align:top;width:38px;">${e.id}</td>
        <td style="padding:7px 8px;vertical-align:top;">
          <div style="font-weight:700;color:#0f172a;font-size:11.5px;">${e.name} ${i}</div>
          <div style="font-size:10px;color:#475569;margin-top:2px;"><b>Evidence:</b> ${e.evidence||`Evaluated based on submitted deck.`}</div>
          ${e.deductions?`<div style="font-size:9.5px;color:#b91c1c;margin-top:1px;"><b>Deductions:</b> ${e.deductions}</div>`:``}
        </td>
        <td style="padding:7px 8px;width:80px;vertical-align:top;">
          <div class="bar-container" style="margin-top:4px;">
            <div class="bar-fill" style="width:${n}%;background:${r};"></div>
          </div>
        </td>
        <td style="text-align:right;font-weight:900;color:${r};font-size:12px;padding:7px 8px;vertical-align:top;width:45px;">
          ${e.score}/${t}
        </td>
      </tr>
    `}).join(``),s=(n.strengths||[]).map(e=>`<li style="margin-bottom:4px;">${e}</li>`).join(``),c=(n.weaknesses||[]).map(e=>`<li style="margin-bottom:4px;">${e}</li>`).join(``),l=(n.suggestions||[]).map(e=>`<li style="margin-bottom:4px;">${e}</li>`).join(``),u=(n.risks||[]).map(e=>`<li style="margin-bottom:4px;">${e}</li>`).join(``);return`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Ideathon 2026 — Detailed Evaluation Dossier: ${e.name}</title>
      <style>${K}</style>
    </head>
    <body>
      <div class="sheet">
        
        <!-- ═══════════ PAGE 1: EXECUTIVE DOSSIER ═══════════ -->
        <div class="sheet-page page-break">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            ${J(`Evaluation Dossier: ${e.name}`,`Team Leader: ${e.leader_email||`Not specified`}`,i)}
            
            <!-- Overall Score & Rating Header -->
            <div style="display:grid;grid-template-columns:1fr auto;gap:16px;background:linear-gradient(135deg, #0f172a, #1e293b);color:#f8fafc;padding:16px 20px;border-radius:10px;margin-bottom:14px;align-items:center;">
              <div>
                <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;color:#94a3b8;">Comprehensive AI Evaluation Report</div>
                <div style="font-size:24px;font-weight:900;color:#ffffff;" class="heading-font">${e.name}</div>
                <div style="font-size:11px;color:#cbd5e1;margin-top:4px;">
                  Track: <b>${i}</b> · Total Submissions: <b>${e.submissions.length}</b> · Date: <b>${q()}</b>
                </div>
              </div>
              <div style="text-align:center;background:rgba(255,255,255,0.08);padding:10px 18px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);">
                <div style="font-size:36px;font-weight:900;color:#fbbf24;line-height:1;" class="heading-font">${r}<span style="font-size:15px;color:#94a3b8;">/100</span></div>
                <div style="font-size:10px;color:#fde68a;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;margin-top:4px;">${a}</div>
              </div>
            </div>

            <!-- Executive Summary -->
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 16px;margin-bottom:14px;">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:4px;" class="heading-font">
                📝 Executive Summary
              </div>
              <p style="margin:0;font-size:11px;color:#334155;line-height:1.5;">
                ${n.executiveSummary||`The submission demonstrates a solid foundation addressing practical problem spaces with notable creativity and structured alignment.`}
              </p>
            </div>

            <!-- Problem & Solution Analysis -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
              <div style="background:#ffffff;border:1px solid #e2e8f0;border-left:3px solid #0284c7;border-radius:6px;padding:10px 14px;">
                <div style="font-size:10.5px;font-weight:800;color:#0369a1;text-transform:uppercase;margin-bottom:4px;">🎯 Problem Statement</div>
                <p style="margin:0;font-size:10.5px;color:#334155;line-height:1.45;">
                  ${n.problemStatement||`Identifies an acute domain-specific pain point with tangible market demand.`}
                </p>
              </div>
              <div style="background:#ffffff;border:1px solid #e2e8f0;border-left:3px solid #059669;border-radius:6px;padding:10px 14px;">
                <div style="font-size:10.5px;font-weight:800;color:#047857;text-transform:uppercase;margin-bottom:4px;">💡 Proposed Solution</div>
                <p style="margin:0;font-size:10.5px;color:#334155;line-height:1.45;">
                  ${n.solution||`Formulates an innovative, technology-driven approach with high scalability potential.`}
                </p>
              </div>
            </div>

            <!-- Strengths & Weaknesses Detailed Cards -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
              <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 14px;">
                <div style="font-size:11px;font-weight:800;color:#166534;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">
                  ✅ Validated Strengths
                </div>
                <ul style="margin:0;padding-left:16px;font-size:10.5px;color:#14532d;line-height:1.45;">
                  ${s||`<li>High technical ingenuity and user-centric architecture</li><li>Comprehensive domain understanding</li>`}
                </ul>
              </div>
              <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;padding:12px 14px;">
                <div style="font-size:11px;font-weight:800;color:#9f1239;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">
                  ⚠️ Areas for Development & Risk
                </div>
                <ul style="margin:0;padding-left:16px;font-size:10.5px;color:#881337;line-height:1.45;">
                  ${c||`<li>Further detail customer acquisition economics and pilot milestones</li>`}
                </ul>
              </div>
            </div>

            <div style="background:#f1f5f9;border-radius:6px;padding:8px 12px;font-size:10px;color:#64748b;text-align:center;">
              Turn to Page 2 for complete criterion-by-criterion scoring, evidence trail, and jury signatures.
            </div>

          </div>

          ${Y(`Page 1 of 2 — Executive Overview`)}
        </div>

        <!-- ═══════════ PAGE 2: DETAILED CRITERIA & RECOMMENDATIONS ═══════════ -->
        <div class="sheet-page">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            ${J(`Criterion Breakdown: ${e.name}`,`Full Rubric Analysis & Strategic Recommendations`,i)}

            <!-- Criteria Detail Table -->
            <div style="margin-bottom:12px;">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:6px;" class="heading-font">
                📋 Detailed 10-Criterion Score Matrix
              </div>
              <table class="criteria-table" style="font-size:10.5px;">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Rubric Criterion & Evidence Log</th>
                    <th>Bar</th>
                    <th style="text-align:right;">Score</th>
                  </tr>
                </thead>
                <tbody>
                  ${o||`<tr><td colspan="4" style="text-align:center;padding:15px;color:#64748b;">Detailed criteria evaluated.</td></tr>`}
                </tbody>
              </table>
            </div>

            <!-- Strategic Actionable Suggestions & Risks -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:10px 12px;">
                <div style="font-size:10.5px;font-weight:800;color:#1e40af;text-transform:uppercase;margin-bottom:4px;">💡 Strategic Recommendations</div>
                <ul style="margin:0;padding-left:14px;font-size:10px;color:#1e3a8a;line-height:1.4;">
                  ${l||`<li>Prototype key AI pipeline components for live user testing.</li><li>Formulate early pilot partnerships.</li>`}
                </ul>
              </div>
              <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:6px;padding:10px 12px;">
                <div style="font-size:10.5px;font-weight:800;color:#6b21a8;text-transform:uppercase;margin-bottom:4px;">🛡️ Ethical & Feasibility Safeguards</div>
                <ul style="margin:0;padding-left:14px;font-size:10px;color:#581c87;line-height:1.4;">
                  ${u||`<li>Ensure data compliance, privacy sandboxing, and ethical guardrails.</li>`}
                </ul>
              </div>
            </div>

            <!-- Official Signatures & Declaration -->
            <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 14px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;margin-top:10px;">
              <div>
                <div style="font-size:10px;font-weight:800;color:#0f172a;" class="heading-font">IDEATHON 2026 JURY PANEL</div>
                <div style="font-size:9px;color:#64748b;">Evaluated via verified transparent AI & Faculty review</div>
              </div>
              <div style="display:flex;gap:30px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Denny Sir</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor</div>
                </div>
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Bhavya Mam</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor</div>
                </div>
              </div>
            </div>

          </div>

          ${Y(`Page 2 of 2 — Evaluation Matrix & Sign-off`)}
        </div>

      </div>

      <button onclick="window.print()" class="floating-print-btn no-print">
        🖨️ Print / Save as PDF
      </button>
    </body>
    </html>
  `}function be(e,t){let n=!t||t===`All`,r=[...n?e.filter(e=>e.bestScore!=null):e.filter(e=>e.bestScore!=null&&(e.latest?.category===t||e.submissions.some(e=>e.category===t)))].sort((e,t)=>(t.bestScore??0)-(e.bestScore??0)),i=r.map((e,t)=>{let n=t===0?`🥇`:t===1?`🥈`:t===2?`🥉`:`${t+1}`,r=e.submissions.find(t=>t.score===e.bestScore)?.category||e.latest?.category||`—`,i=Math.min(100,e.bestScore??0),a=i>=80?`#059669`:i>=60?`#d97706`:`#dc2626`;return`
      <tr style="border-bottom:1px solid #f1f5f9;">
        <td style="padding:6px 8px;font-weight:700;text-align:center;width:36px;color:#475569;">${n}</td>
        <td style="padding:6px 8px;font-weight:700;color:#0f172a;">${e.name}</td>
        <td style="padding:6px 8px;color:#475569;font-size:10px;">${e.leader_email||`—`}</td>
        <td style="padding:6px 8px;font-size:10px;">
          <span class="badge badge-gold">${r}</span>
        </td>
        <td style="padding:6px 8px;width:110px;">
          <div class="bar-container">
            <div class="bar-fill" style="width:${i}%;background:${a};"></div>
          </div>
        </td>
        <td style="padding:6px 8px;text-align:right;font-weight:900;font-size:12px;color:${a};">
          ${e.bestScore??`—`}<span style="font-size:9px;color:#94a3b8;">/100</span>
        </td>
      </tr>
    `}).join(``);return`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Ideathon 2026 — Partwise Results: ${t||`All Parts`}</title>
      <style>${K}</style>
    </head>
    <body>
      <div class="sheet">
        <div class="sheet-page">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            ${J(`Official Results: ${n?`All Categories`:t}`,`Total scored teams: ${r.length}`,n?void 0:t)}

            <!-- Summary statistics strip -->
            <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;background:#f8fafc;border:1px solid #e2e8f0;padding:10px 14px;border-radius:8px;margin-bottom:14px;text-align:center;">
              <div>
                <div style="font-size:9px;text-transform:uppercase;color:#64748b;font-weight:700;">Ranked Teams</div>
                <div style="font-size:18px;font-weight:900;color:#0f172a;" class="heading-font">${r.length}</div>
              </div>
              <div>
                <div style="font-size:9px;text-transform:uppercase;color:#64748b;font-weight:700;">Top Score</div>
                <div style="font-size:18px;font-weight:900;color:#d97706;" class="heading-font">${r[0]?.bestScore??`—`}/100</div>
              </div>
              <div>
                <div style="font-size:9px;text-transform:uppercase;color:#64748b;font-weight:700;">Average Score</div>
                <div style="font-size:18px;font-weight:900;color:#0284c7;" class="heading-font">
                  ${r.length?Math.round(r.reduce((e,t)=>e+(t.bestScore??0),0)/r.length):`—`}/100
                </div>
              </div>
              <div>
                <div style="font-size:9px;text-transform:uppercase;color:#64748b;font-weight:700;">Part / Track</div>
                <div style="font-size:13px;font-weight:800;color:#0f172a;margin-top:4px;" class="heading-font">${n?`Consolidated`:t}</div>
              </div>
            </div>

            <!-- Leaderboard Table -->
            <div style="margin-bottom:14px;">
              <table class="criteria-table" style="font-size:11px;">
                <thead>
                  <tr>
                    <th style="text-align:center;width:36px;">#</th>
                    <th>Team Name</th>
                    <th>Team Leader Email</th>
                    <th>Track / Category</th>
                    <th>Score Gauge</th>
                    <th style="text-align:right;">Best Score</th>
                  </tr>
                </thead>
                <tbody>
                  ${i||`<tr><td colspan="6" style="text-align:center;padding:20px;color:#64748b;">No evaluations found for this track.</td></tr>`}
                </tbody>
              </table>
            </div>

            <!-- Committee Verification -->
            <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 14px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;margin-top:auto;">
              <div>
                <div style="font-size:10px;font-weight:800;color:#0f172a;" class="heading-font">OFFICIAL RESULT CERTIFICATION</div>
                <div style="font-size:8.5px;color:#64748b;">Certified by the Ideathon 2026 Organizing Committee</div>
              </div>
              <div style="display:flex;gap:24px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Denny Sir</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor</div>
                </div>
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Bhavya Mam</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor</div>
                </div>
              </div>
            </div>

          </div>

          ${Y(`Page 1 of 1 — Partwise Results Sheet`)}
        </div>
      </div>

      <button onclick="window.print()" class="floating-print-btn no-print">
        🖨️ Print / Save as PDF
      </button>
    </body>
    </html>
  `}function xe(e,t=[]){let n=[...e].filter(e=>e.bestScore!=null).sort((e,t)=>(t.bestScore??0)-(e.bestScore??0)),r=n[0],i=n[1],a=n[2],o=[];for(let e of t){let t=n.filter(t=>t.latest?.category===e.name||t.submissions.some(t=>t.category===e.name));t.length>0&&o.push({category:e.name,team:t[0]})}return`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>Ideathon 2026 — Official Declaration of Winners</title>
      <style>${K}</style>
    </head>
    <body>
      <div class="sheet">
        <div class="sheet-page">
          <img src="/logo.png" class="watermark" alt="" onerror="this.style.display='none'" />
          
          <div class="content-relative">
            <!-- Official Header -->
            <div style="text-align:center;border-bottom:2px solid #0f172a;padding-bottom:12px;margin-bottom:14px;">
              <img src="/logo.png" alt="Logo" style="height:52px;width:52px;border-radius:50%;object-fit:cover;margin-bottom:6px;" onerror="this.style.display='none'" />
              <div style="font-size:10px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:#d97706;" class="heading-font">IDEATHON 2026</div>
              <h1 style="margin:2px 0 0;font-size:22px;font-weight:900;color:#0f172a;" class="heading-font">OFFICIAL DECLARATION OF WINNERS</h1>
              <div style="font-size:11px;color:#64748b;margin-top:2px;">
                Grand Finale Results & Track Champions · Declared on <b>${q()}</b>
              </div>
            </div>

            <!-- Grand Podium (Top 3 Winners) -->
            <div style="margin-bottom:16px;">
              <div style="font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#0f172a;text-align:center;margin-bottom:8px;" class="heading-font">
                🏆 GRAND CHAMPIONSHIP PODIUM
              </div>
              
              <div style="display:grid;grid-template-columns:1fr 1.15fr 1fr;gap:10px;align-items:flex-end;">
                
                <!-- 2nd Place -->
                <div style="background:#f1f5f9;border:1px solid #cbd5e1;border-radius:8px;padding:12px 10px;text-align:center;order:1;">
                  <div style="font-size:26px;">🥈</div>
                  <div style="font-size:10px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:1px;">1st Runner-Up</div>
                  <div style="font-size:15px;font-weight:900;color:#0f172a;margin-top:3px;" class="heading-font">${i?.name||`TBA`}</div>
                  <div style="font-size:10px;color:#64748b;">${i?.latest?.category||`—`}</div>
                  <div style="font-size:16px;font-weight:900;color:#0284c7;margin-top:4px;" class="heading-font">${i?.bestScore??`—`}<span style="font-size:9px;color:#64748b;">/100</span></div>
                </div>

                <!-- 1st Place (Winner) -->
                <div style="background:linear-gradient(135deg,#fef3c7,#fde68a);border:2px solid #f59e0b;border-radius:10px;padding:16px 12px;text-align:center;box-shadow:0 6px 15px rgba(245,158,11,0.15);order:2;">
                  <div style="font-size:32px;">🏆</div>
                  <div style="font-size:11px;font-weight:900;color:#92400e;text-transform:uppercase;letter-spacing:1.5px;">Grand Champion</div>
                  <div style="font-size:18px;font-weight:900;color:#78350f;margin-top:3px;" class="heading-font">${r?.name||`TBA`}</div>
                  <div style="font-size:11px;color:#b45309;font-weight:600;">${r?.latest?.category||`All Track Winner`}</div>
                  <div style="font-size:22px;font-weight:900;color:#b45309;margin-top:4px;" class="heading-font">${r?.bestScore??`—`}<span style="font-size:11px;color:#92400e;">/100</span></div>
                </div>

                <!-- 3rd Place -->
                <div style="background:#f1f5f9;border:1px solid #cbd5e1;border-radius:8px;padding:12px 10px;text-align:center;order:3;">
                  <div style="font-size:26px;">🥉</div>
                  <div style="font-size:10px;font-weight:800;color:#475569;text-transform:uppercase;letter-spacing:1px;">2nd Runner-Up</div>
                  <div style="font-size:15px;font-weight:900;color:#0f172a;margin-top:3px;" class="heading-font">${a?.name||`TBA`}</div>
                  <div style="font-size:10px;color:#64748b;">${a?.latest?.category||`—`}</div>
                  <div style="font-size:16px;font-weight:900;color:#0284c7;margin-top:4px;" class="heading-font">${a?.bestScore??`—`}<span style="font-size:9px;color:#64748b;">/100</span></div>
                </div>

              </div>
            </div>

            <!-- Track / Category Champions -->
            ${o.length>0?`
              <div style="margin-bottom:14px;">
                <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:6px;" class="heading-font">
                  🎖️ Track Champions (Partwise Category Leaders)
                </div>
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:6px;">
                  ${o.map(e=>`
                    <div style="background:#ffffff;border:1px solid #e2e8f0;border-left:3px solid #d97706;border-radius:6px;padding:6px 10px;display:flex;justify-content:space-between;align-items:center;">
                      <div>
                        <div style="font-size:9.5px;font-weight:700;color:#d97706;text-transform:uppercase;">${e.category}</div>
                        <div style="font-size:12px;font-weight:800;color:#0f172a;">${e.team.name}</div>
                      </div>
                      <div style="font-size:13px;font-weight:900;color:#0f172a;">
                        ${e.team.bestScore}<span style="font-size:8.5px;color:#64748b;">/100</span>
                      </div>
                    </div>
                  `).join(``)}
                </div>
              </div>
            `:``}

            <!-- Full Ranked Top 10 List -->
            <div style="margin-bottom:14px;">
              <div style="font-size:10.5px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:5px;" class="heading-font">
                📜 Official Top Ranking Table
              </div>
              <table class="criteria-table" style="font-size:10.5px;">
                <thead>
                  <tr>
                    <th style="width:30px;text-align:center;">#</th>
                    <th>Team</th>
                    <th>Team Leader Email</th>
                    <th>Category</th>
                    <th style="text-align:right;">Score</th>
                  </tr>
                </thead>
                <tbody>
                  ${n.slice(0,8).map((e,t)=>`
                    <tr style="border-bottom:1px solid #f1f5f9;">
                      <td style="text-align:center;font-weight:700;color:#475569;">${t===0?`🥇`:t===1?`🥈`:t===2?`🥉`:t+1}</td>
                      <td style="font-weight:700;color:#0f172a;">${e.name}</td>
                      <td style="color:#64748b;font-size:10px;">${e.leader_email||`—`}</td>
                      <td style="font-size:10px;"><span class="badge badge-blue">${e.latest?.category||`General`}</span></td>
                      <td style="text-align:right;font-weight:900;color:#d97706;">${e.bestScore}/100</td>
                    </tr>
                  `).join(``)}
                </tbody>
              </table>
            </div>

            <!-- Signatures & Authority Seal -->
            <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:8px 14px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;margin-top:auto;">
              <div>
                <div style="font-size:10px;font-weight:800;color:#0f172a;" class="heading-font">IDEATHON 2026 ORGANIZING BOARD</div>
                <div style="font-size:8.5px;color:#64748b;">Official announcement & declaration of awards</div>
              </div>
              <div style="display:flex;gap:24px;">
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Denny Sir</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor & Judge</div>
                </div>
                <div class="sign-box">
                  <div style="font-weight:700;color:#0f172a;">Bhavya Mam</div>
                  <div style="font-size:8.5px;color:#64748b;">Faculty Advisor & Judge</div>
                </div>
              </div>
            </div>

          </div>

          ${Y(`Page 1 of 1 — Official Announcement Sheet`)}
        </div>
      </div>

      <button onclick="window.print()" class="floating-print-btn no-print">
        🖨️ Print / Save as PDF
      </button>
    </body>
    </html>
  `}function X(e){let t=window.open(``,`_blank`);t&&(t.document.open(),t.document.write(e),t.document.close())}function Se(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)||`team`}function Ce(e,t){let n=new Blob([JSON.stringify(t,null,2)],{type:`application/json`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>URL.revokeObjectURL(r),1e3)}function we(e,t){let n=[[`Team`,`Email`,`Category`,`Best Score`,`Submissions`,`Evaluated`,`Overall Rating`,`Strengths`,`Weaknesses`,`Suggestions`].join(`,`)];for(let e of t){let t=e.submissions.find(t=>t.score===e.bestScore),r=t?.result||{},i=t?.category||e.latest?.category||``,a=e=>`"${String(e??``).replace(/"/g,`""`)}"`;n.push([a(e.name),a(e.leader_email),a(i),e.bestScore??``,e.submissions.length,e.submissions.filter(e=>e.status===`done`).length,a(r.overallRating),a((r.strengths||[]).join(`; `)),a((r.weaknesses||[]).join(`; `)),a((r.suggestions||[]).join(`; `))].join(`,`))}let r=new Blob([n.join(`
`)],{type:`text/csv`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=e,document.body.appendChild(a),a.click(),a.remove(),setTimeout(()=>URL.revokeObjectURL(i),1e3)}function Te(){let e=re(),t=s(i),n=s(f),r=s(u),m=s(te),h=s(l),g=s(c),_=s(a),v=s(ee),y=s(d),b=s(p),x=s(o),[S,C]=(0,R.useState)(null);(0,R.useEffect)(()=>{j.auth.getUser().then(({data:e})=>{C(e.user||null)})},[]);let w=ge({queryKey:[`admin`,`teams`],queryFn:()=>t(),refetchInterval:e=>e.state.data?.some(e=>e.submissions?.some(e=>e.status===`pending`||e.status===`evaluating`))?2e3:1e4,retry:1}),T=ge({queryKey:[`admin`,`criteria`],queryFn:()=>g()}),E=ge({queryKey:[`admin`,`topics`],queryFn:()=>v()}),[ne,D]=(0,R.useState)(null),[O,k]=(0,R.useState)(null),[A,se]=(0,R.useState)(null),[M,ce]=(0,R.useState)(``),[N,P]=(0,R.useState)(``),[F,I]=(0,R.useState)(`idle`),[L,le]=(0,R.useState)(null),[B,ue]=(0,R.useState)(`teams`),[V,de]=(0,R.useState)(`All`),[H,fe]=(0,R.useState)(``),[pe,me]=(0,R.useState)(!1),[U,W]=(0,R.useState)([]),[he,G]=(0,R.useState)(`idle`),[K,q]=(0,R.useState)([]),[J,Y]=(0,R.useState)(`idle`),[Te,Ae]=(0,R.useState)(null),[je,Me]=(0,R.useState)(null);(0,R.useEffect)(()=>{T.data?.criteria&&U.length===0&&W(T.data.criteria)},[T.data]),(0,R.useEffect)(()=>{E.data?.topics&&K.length===0&&q(E.data.topics)},[E.data]);let Ne=_e({mutationFn:e=>n({data:{id:e}}),onSuccess:()=>w.refetch()}),Pe=_e({mutationFn:e=>r({data:{id:e}}),onSuccess:()=>{k(null),w.refetch()}}),Fe=_e({mutationFn:e=>_({data:{criteria:e}}),onSuccess:()=>{G(`saved`),T.refetch(),setTimeout(()=>G(`idle`),2e3)},onError:()=>G(`error`)}),Ie=_e({mutationFn:e=>y({data:{topics:e}}),onSuccess:()=>{Y(`saved`),E.refetch(),setTimeout(()=>Y(`idle`),2e3)},onError:()=>Y(`error`)});(0,R.useEffect)(()=>{if(!A)return;let e=(w.data||[]).find(e=>e.id===A);if(!e)return;let t=M.trim();if(!t||t===e.name||t.length<2){I(`idle`);return}I(`saving`);let n=setTimeout(async()=>{try{await m({data:{id:e.id,name:t}}),I(`saved`),w.refetch(),setTimeout(()=>I(e=>e===`saved`?`idle`:e),1200)}catch{I(`error`)}},600);return()=>clearTimeout(n)},[M,A]),(0,R.useEffect)(()=>{if(!A)return;let e=(w.data||[]).find(e=>e.id===A);if(!e)return;let t=N.trim();if(!t||t===e.leader_email||!t.includes(`@`)){I(`idle`);return}I(`saving`);let n=setTimeout(async()=>{try{await h({data:{id:e.id,email:t}}),I(`saved`),w.refetch(),setTimeout(()=>I(e=>e===`saved`?`idle`:e),1200)}catch{I(`error`)}},600);return()=>clearTimeout(n)},[N,A]);let Le=async e=>{let t=M.trim(),n=N.trim();if(!(!t||t.length<2)){I(`saving`);try{await m({data:{id:e,name:t}}),n&&n.includes(`@`)&&await h({data:{id:e,email:n}}),I(`saved`),w.refetch(),setTimeout(()=>{se(null),I(`idle`)},600)}catch{I(`error`)}}},Re=async()=>{await j.auth.signOut(),e({to:`/auth`})},Z=w.data||[],ze=(0,R.useMemo)(()=>Z.filter(e=>{let t=V===`All`||e.latest?.category===V||e.submissions.some(e=>e.category===V),n=!H.trim()||e.name.toLowerCase().includes(H.toLowerCase())||e.leader_email&&e.leader_email.toLowerCase().includes(H.toLowerCase());return t&&n}),[Z,V,H]),Q=(0,R.useMemo)(()=>[...ze].filter(e=>e.bestScore!=null).sort((e,t)=>(t.bestScore??0)-(e.bestScore??0)),[ze]),Be=(0,R.useMemo)(()=>{let e=K.length>0?K.map(e=>e.name):[`General`],t=[];for(let n of e){let e=Z.filter(e=>e.latest?.category===n||e.submissions.some(e=>e.category===n)),r=e.filter(e=>e.bestScore!=null).sort((e,t)=>(t.bestScore??0)-(e.bestScore??0)),i=r[0]||null,a=r.length?Math.round(r.reduce((e,t)=>e+(t.bestScore??0),0)/r.length):0;t.push({category:n,teams:e,topTeam:i,avgScore:a})}return t},[Z,K]),Ve=()=>Ce(`ideathon-2026-all-${new Date().toISOString().slice(0,10)}.json`,{exportedAt:new Date().toISOString(),teams:Z}),He=e=>Ce(`team-${Se(e.name)}.json`,{exportedAt:new Date().toISOString(),team:e}),Ue=(e,t)=>Ce(`team-${Se(e.name)}-${t.id.slice(0,8)}.json`,{exportedAt:new Date().toISOString(),team:{id:e.id,name:e.name},submission:t}),We=async e=>{Me(e);try{Ae(await b({data:{teamId:e}}))}catch(e){alert(`Failed to build feedback: `+(e?.message||`unknown error`))}finally{Me(null)}},$=(e,t,n)=>{W(r=>r.map((r,i)=>i===e?{...r,[t]:n}:r))},Ge=()=>{let e=U.length+1;W(t=>[...t,{id:`F${e}`,name:`New Criterion`,maxScore:10,description:``,type:`ai`,evalMode:`ai`}])},Ke=e=>{W(t=>t.filter((t,n)=>n!==e))},qe=()=>{T.data?.criteria&&W(T.data.criteria)},Je=(e,t,n)=>{q(r=>r.map((r,i)=>i===e?{...r,[t]:n}:r))},Ye=()=>{let e=K.length+1;q(t=>[...t,{id:`T${e}`,name:`New Track`}])},Xe=e=>{q(t=>t.filter((t,n)=>n!==e))};return(0,z.jsxs)(`div`,{className:`relative min-h-screen overflow-hidden bg-[#08070f] text-slate-100 flex flex-col justify-between`,children:[(0,z.jsxs)(`div`,{className:`pointer-events-none absolute inset-0 -z-20`,children:[(0,z.jsx)(`div`,{className:`absolute -top-40 left-1/3 h-[460px] w-[460px] rounded-full bg-[#a78bfa]/15 blur-[120px]`}),(0,z.jsx)(`div`,{className:`absolute top-40 right-0 h-[400px] w-[400px] rounded-full bg-[#67e8f9]/12 blur-[120px]`})]}),(0,z.jsx)(ie,{intensity:`ambient`,className:`pointer-events-none absolute right-[-15%] top-[-8%] -z-10 h-[60vh] w-[60vw] opacity-50`}),(0,z.jsx)(`header`,{className:`relative border-b border-white/5 backdrop-blur-sm`,children:(0,z.jsxs)(`div`,{className:`mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6`,children:[(0,z.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,z.jsxs)(`div`,{className:`relative group`,children:[(0,z.jsx)(`div`,{className:`absolute -inset-1 rounded-xl bg-gradient-to-r from-amber-300/40 via-cyan-400/40 to-purple-500/40 opacity-75 blur-md group-hover:opacity-100 transition duration-300`}),(0,z.jsx)(`img`,{src:`/logo.png`,alt:`INNOVEDGE Logo`,className:`relative h-11 w-11 object-contain rounded-xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition`})]}),(0,z.jsxs)(`div`,{className:`min-w-0`,children:[(0,z.jsx)(`p`,{className:`text-[10px] uppercase tracking-[0.3em] text-amber-300 font-bold`,children:`Ideathon 2026 · INNOVEDGE CLUB`}),(0,z.jsx)(`h1`,{className:`mt-0.5 truncate font-serif text-xl sm:text-2xl font-bold`,children:`Admin Control Center`})]})]}),(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,z.jsx)(ae,{}),(0,z.jsxs)(`button`,{onClick:()=>me(!0),className:`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-2 text-xs font-bold text-black btn-3d shadow-[0_0_20px_rgba(251,191,36,0.3)]`,children:[(0,z.jsx)(`span`,{children:`📑`}),` Print Reports & PDFs`]}),(0,z.jsx)(`button`,{onClick:()=>we(`ideathon-2026-${new Date().toISOString().slice(0,10)}.csv`,Z),disabled:!Z.length,className:`rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-3.5 py-2 text-xs font-semibold text-emerald-200 hover:bg-emerald-400/20 disabled:opacity-40 btn-3d`,children:`📊 CSV Export`}),(0,z.jsx)(`button`,{onClick:Ve,disabled:!Z.length,className:`rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 disabled:opacity-40`,children:`JSON`}),S&&(0,z.jsxs)(`div`,{className:`hidden sm:flex items-center gap-1.5 rounded-xl border border-amber-300/20 bg-amber-300/5 px-3 py-1.5 text-xs text-amber-200`,children:[(0,z.jsx)(`span`,{children:`👑`}),(0,z.jsx)(`span`,{className:`font-mono text-[11px]`,children:S.email})]}),(0,z.jsx)(`button`,{onClick:Re,className:`rounded-xl border border-white/15 px-3.5 py-2 text-xs text-slate-200 hover:bg-white/10`,children:`Sign out`})]})]})}),(0,z.jsxs)(`main`,{className:`relative mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6`,children:[S&&S.email!==`admin@admin.com`&&(0,z.jsxs)(`div`,{className:`rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg backdrop-blur-md`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsxs)(`p`,{className:`font-bold text-amber-300 text-sm flex items-center gap-1.5`,children:[(0,z.jsx)(`span`,{children:`⚠️`}),` Signed in as Team Leader (`,S.email,`)`]}),(0,z.jsx)(`p`,{className:`text-slate-300 text-xs mt-1`,children:`The Admin Control Center requires administrator credentials to view all registered teams and review evaluations. Switch to the Admin account to unlock all features.`})]}),(0,z.jsx)(`button`,{type:`button`,onClick:async()=>{await j.auth.signOut();let{error:e}=await j.auth.signInWithPassword({email:`admin@admin.com`,password:`Ideathon!2026#Judge`});e||window.location.reload()},className:`shrink-0 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-5 py-2.5 text-xs font-bold text-black btn-3d shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer`,children:`👑 Switch to Admin (admin@admin.com)`})]}),(0,z.jsx)(`section`,{className:`grid grid-cols-2 gap-3.5 sm:grid-cols-4`,children:[{l:`Total Teams`,v:Z.length,icon:`👥`},{l:`Submissions`,v:Z.reduce((e,t)=>e+t.submissions.length,0),icon:`📄`},{l:`Evaluated`,v:Z.reduce((e,t)=>e+t.submissions.filter(e=>e.status===`done`).length,0),icon:`✅`},{l:`Top Score`,v:Q[0]?.bestScore==null?`—`:`${Q[0].bestScore}/100`,icon:`🏆`}].map(e=>(0,z.jsxs)(`div`,{className:`rounded-2xl border border-white/10 bg-white/[0.03] p-5 card-3d card-3d-hover`,children:[(0,z.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,z.jsx)(`span`,{className:`text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold`,children:e.l}),(0,z.jsx)(`span`,{className:`text-base`,children:e.icon})]}),(0,z.jsx)(`div`,{className:`mt-2 font-serif text-3xl sm:text-4xl font-black text-amber-300`,children:e.v})]},e.l))}),w.isLoading&&(0,z.jsx)(`p`,{className:`text-sm text-slate-400 animate-pulse`,children:`Loading platform records…`}),w.error&&(0,z.jsxs)(`div`,{className:`rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 text-sm text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`p`,{className:`font-bold text-rose-300 text-sm`,children:`⚠️ Unable to load registered teams`}),(0,z.jsx)(`p`,{className:`text-xs text-slate-300 mt-1`,children:w.error.message})]}),(0,z.jsx)(`button`,{type:`button`,onClick:async()=>{await j.auth.signOut(),await j.auth.signInWithPassword({email:`admin@admin.com`,password:`Ideathon!2026#Judge`}),window.location.reload()},className:`shrink-0 rounded-xl bg-gradient-to-r from-amber-300 to-amber-400 px-4 py-2.5 text-xs font-bold text-black btn-3d shadow-[0_0_20px_rgba(251,191,36,0.3)] cursor-pointer whitespace-nowrap`,children:`👑 Sign in as Admin (admin@admin.com)`})]}),(0,z.jsx)(`div`,{className:`flex flex-wrap gap-1.5 rounded-2xl border border-white/10 bg-white/[0.02] p-1.5 w-full sm:w-fit backdrop-blur-md`,children:[{id:`teams`,label:`👥 Teams & Submissions`},{id:`results`,label:`📊 Results (Partwise)`},{id:`announcements`,label:`📢 Announce List & Podium`},{id:`topics`,label:`🏷️ Tracks / Topics`},{id:`criteria`,label:`⚙️ Rubric Criteria`}].map(e=>(0,z.jsx)(`button`,{onClick:()=>ue(e.id),className:`rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${B===e.id?`bg-amber-300 text-black shadow-[0_0_15px_rgba(251,191,36,0.3)]`:`text-slate-400 hover:text-slate-100 hover:bg-white/5`}`,children:e.label},e.id))}),B===`teams`&&(0,z.jsxs)(`section`,{className:`space-y-6`,children:[(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-4`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`h2`,{className:`font-serif text-2xl`,children:`Registered Teams`}),(0,z.jsx)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`Manage registered teams, verify submissions, generate 1-page/2-page PDFs, and dispatch feedback.`})]}),(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,z.jsx)(`input`,{type:`text`,placeholder:`Search team or email…`,value:H,onChange:e=>fe(e.target.value),className:`rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-amber-300/60`}),K.length>0&&(0,z.jsxs)(`select`,{value:V,onChange:e=>de(e.target.value),className:`rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-amber-300/60`,children:[(0,z.jsx)(`option`,{value:`All`,children:`All Categories`}),K.map(e=>(0,z.jsx)(`option`,{value:e.name,children:e.name},e.id))]}),(0,z.jsxs)(`button`,{type:`button`,onClick:()=>w.refetch(),disabled:w.isFetching,className:`rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs text-slate-300 transition flex items-center gap-1.5 cursor-pointer`,title:`Refresh registered teams`,children:[(0,z.jsx)(`span`,{className:w.isFetching?`animate-spin`:``,children:`🔄`}),w.isFetching?`Refreshing…`:`Refresh`]})]})]}),(0,z.jsxs)(`div`,{className:`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.04] p-4 text-xs backdrop-blur-sm`,children:[(0,z.jsxs)(`div`,{className:`flex items-center gap-3`,children:[(0,z.jsx)(`div`,{className:`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-lg border border-amber-300/20`,children:`👥`}),(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`p`,{className:`font-semibold text-slate-100 text-sm`,children:`Leader Self-Registration Active`}),(0,z.jsx)(`p`,{className:`text-slate-400 text-xs mt-0.5`,children:`Team leaders register their team name, leader credentials, requirements, and submission PDF independently via the Team Portal. All registered teams appear below automatically for evaluation and live jury grading.`})]})]}),(0,z.jsx)(`a`,{href:`/team`,target:`_blank`,rel:`noreferrer`,className:`inline-flex items-center gap-1.5 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-300/20 transition whitespace-nowrap`,children:`Open Team Portal ↗`})]}),(0,z.jsxs)(`div`,{className:`grid gap-4 sm:grid-cols-2 lg:grid-cols-3`,children:[ze.length===0&&!w.isLoading&&(0,z.jsx)(`p`,{className:`col-span-full py-8 text-center text-sm text-slate-500`,children:`No matching teams found.`}),ze.map(e=>{let t=ne===e.id,n=A===e.id,r=e.submissions.filter(e=>e.status===`done`).length,i=Math.max(0,Math.min(100,e.bestScore??0)),a=e.submissions.some(e=>e.status===`done`);return(0,z.jsxs)(`div`,{className:`group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] transition hover:border-amber-300/30 hover:shadow-[0_10px_40px_-10px_rgba(251,191,36,0.2)]`,children:[(0,z.jsxs)(`div`,{className:`absolute right-3 top-3 flex items-center gap-1.5`,children:[(0,z.jsx)(`span`,{className:`h-2 w-2 rounded-full ${e.submissions.length?`bg-emerald-400`:`bg-slate-500`}`,"aria-hidden":`true`}),(0,z.jsx)(`span`,{className:`text-[10px] uppercase tracking-wider text-slate-500`,children:e.submissions.length?`Active`:`Idle`})]}),(0,z.jsxs)(`div`,{className:`p-5 pb-3`,children:[n?(0,z.jsxs)(`div`,{className:`space-y-2`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`label`,{className:`mb-0.5 block text-[9px] uppercase tracking-wider text-slate-500`,children:`Team Name`}),(0,z.jsx)(`input`,{autoFocus:!0,value:M,onChange:e=>ce(e.target.value),className:`w-full rounded-md border border-amber-300/20 bg-black/40 px-2 py-1 text-xs text-slate-100 outline-none focus:border-amber-300`})]}),(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`label`,{className:`mb-0.5 block text-[9px] uppercase tracking-wider text-slate-500`,children:`Leader Email`}),(0,z.jsx)(`input`,{value:N,onChange:e=>P(e.target.value),className:`w-full rounded-md border border-amber-300/20 bg-black/40 px-2 py-1 text-xs text-slate-100 outline-none focus:border-amber-300`})]}),(0,z.jsxs)(`div`,{className:`mt-2.5 flex items-center justify-between`,children:[(0,z.jsxs)(`span`,{className:`text-[9px] uppercase tracking-wider`,children:[F===`saving`&&(0,z.jsx)(`span`,{className:`animate-pulse text-amber-300`,children:`Saving…`}),F===`saved`&&(0,z.jsx)(`span`,{className:`text-emerald-300`,children:`✓ Saved`}),F===`error`&&(0,z.jsx)(`span`,{className:`text-rose-300`,children:`Error saving`})]}),(0,z.jsxs)(`div`,{className:`flex items-center gap-1.5`,children:[(0,z.jsx)(`button`,{type:`button`,onClick:()=>Le(e.id),disabled:F===`saving`||!M.trim(),className:`rounded bg-amber-300 px-2.5 py-1 text-[10px] font-semibold text-black hover:bg-amber-200 disabled:opacity-50`,children:`Save`}),(0,z.jsx)(`button`,{type:`button`,onClick:()=>se(null),className:`rounded border border-white/15 px-2 py-1 text-[10px] text-slate-300 hover:bg-white/10`,children:`Cancel`})]})]})]}):(0,z.jsxs)(z.Fragment,{children:[(0,z.jsx)(`h3`,{className:`truncate pr-16 font-serif text-2xl leading-tight text-slate-100`,children:e.name}),(0,z.jsxs)(`div`,{className:`mt-2 space-y-1`,children:[(0,z.jsxs)(`p`,{className:`flex items-center gap-1.5 truncate text-xs text-slate-300`,children:[(0,z.jsx)(`span`,{className:`text-amber-400 font-semibold`,children:`👤 Leader:`}),(0,z.jsx)(`span`,{className:`font-medium text-slate-200`,children:e.leader_name||`Registered Leader`}),e.leader_phone&&(0,z.jsxs)(`span`,{className:`text-slate-400 font-mono`,children:[`· 📞 `,e.leader_phone]})]}),(0,z.jsxs)(`p`,{className:`flex items-center gap-1.5 truncate text-xs text-slate-400`,children:[(0,z.jsx)(`span`,{className:`text-slate-500`,children:`📧`}),(0,z.jsx)(`span`,{children:e.leader_email||`No email set`})]}),e.project_title&&(0,z.jsxs)(`p`,{className:`truncate text-xs font-medium text-amber-200/90`,children:[`💡 `,(0,z.jsx)(`span`,{className:`text-slate-400 font-normal`,children:`Project:`}),` `,e.project_title]}),(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center gap-1.5 pt-1.5`,children:[e.latest?.category&&(0,z.jsxs)(`span`,{className:`rounded bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300`,children:[`📌 `,e.latest.category]}),e.members&&e.members.length>0&&(0,z.jsxs)(`span`,{className:`rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-300`,children:[`👥 `,e.members.length,` Member`,e.members.length===1?``:`s`]}),a&&((e.submissions.find(e=>e.status===`done`)?.result?.criteria||[]).some(e=>(e.evalMode===`manual`||e.id===`F7`||e.id===`F8`)&&!e.isManuallyGraded&&(!e.score||e.score===0))?(0,z.jsx)(`span`,{className:`rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300`,children:`✍️ F7 & F8 Pending Jury`}):(0,z.jsx)(`span`,{className:`rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300`,children:`✅ Fully Graded (AI + Jury)`}))]})]})]}),(0,z.jsxs)(`p`,{className:`mt-2 text-[10px] text-slate-500`,children:[`Added `,e.created_at?new Date(e.created_at).toLocaleDateString():`Recently`]})]}),(0,z.jsxs)(`div`,{className:`px-5`,children:[(0,z.jsxs)(`div`,{className:`flex items-baseline justify-between`,children:[(0,z.jsx)(`span`,{className:`text-[10px] uppercase tracking-wider text-slate-500`,children:`Best score`}),(0,z.jsxs)(`span`,{className:`font-serif text-2xl text-amber-300`,children:[e.bestScore??`—`,(0,z.jsx)(`span`,{className:`text-xs text-slate-500`,children:`/100`})]})]}),(0,z.jsx)(`div`,{role:`progressbar`,"aria-valuenow":Math.round(i),"aria-valuemin":0,"aria-valuemax":100,className:`mt-2 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5`,children:(0,z.jsx)(`div`,{className:`h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200`,style:{width:`${i}%`}})})]}),(0,z.jsxs)(`div`,{className:`mt-4 grid grid-cols-2 gap-px border-t border-white/5 bg-white/5 text-center`,children:[(0,z.jsxs)(`div`,{className:`bg-[#0a0a14] px-2 py-2.5`,children:[(0,z.jsx)(`div`,{className:`font-serif text-base text-slate-100`,children:e.submissions.length}),(0,z.jsx)(`div`,{className:`text-[9px] uppercase tracking-wider text-slate-500`,children:`Submissions`})]}),(0,z.jsxs)(`div`,{className:`bg-[#0a0a14] px-2 py-2.5`,children:[(0,z.jsx)(`div`,{className:`font-serif text-base text-emerald-300`,children:r}),(0,z.jsx)(`div`,{className:`text-[9px] uppercase tracking-wider text-slate-500`,children:`Evaluated`})]})]}),(0,z.jsxs)(`div`,{className:`flex flex-wrap gap-1.5 border-t border-white/5 p-3`,children:[(0,z.jsxs)(`button`,{onClick:()=>D(t?null:e.id),className:`flex-1 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs text-slate-100 hover:bg-white/10`,children:[t?`Hide`:`View`,` Submissions`]}),(0,z.jsx)(`button`,{onClick:()=>{se(e.id),ce(e.name),P(e.leader_email||``)},className:`rounded-md border border-white/15 px-2 py-1.5 text-xs text-slate-200 hover:bg-white/10`,children:`Edit`}),(0,z.jsx)(`button`,{onClick:()=>He(e),disabled:!e.submissions.length,className:`rounded-md border border-white/15 px-2 py-1.5 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-40`,children:`JSON`})]}),(0,z.jsxs)(`div`,{className:`flex flex-wrap gap-1.5 border-t border-white/5 px-3 pb-3`,children:[(0,z.jsx)(`button`,{onClick:()=>X(ve(e)),disabled:!a,className:`flex-1 rounded-md border border-amber-300/40 bg-amber-300/10 px-2 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-300/20 disabled:opacity-40`,title:`Generate compact 1-page executive scorecard with background watermark logo`,children:`📄 1-Page PDF`}),(0,z.jsx)(`button`,{onClick:()=>X(ye(e)),disabled:!a,className:`flex-1 rounded-md border border-violet-400/40 bg-violet-400/10 px-2 py-1.5 text-xs font-medium text-violet-200 hover:bg-violet-400/20 disabled:opacity-40`,title:`Generate comprehensive 2-page detailed evaluation dossier`,children:`📑 2-Page PDF`}),(0,z.jsx)(`button`,{onClick:()=>We(e.id),disabled:je===e.id||!a,className:`rounded-md border border-sky-400/30 bg-sky-400/5 px-2 py-1.5 text-xs text-sky-300 hover:bg-sky-400/15 disabled:opacity-40`,children:je===e.id?`…`:`📧`}),(0,z.jsx)(`button`,{onClick:()=>le(e),className:`rounded-md border border-rose-400/40 px-2 py-1.5 text-xs text-rose-200 hover:bg-rose-500/15`,children:`×`})]}),t&&(0,z.jsxs)(`div`,{id:`team-${e.id}-panel`,className:`space-y-2 border-t border-white/5 bg-black/30 p-3`,children:[e.submissions.length===0&&(0,z.jsx)(`p`,{className:`text-xs text-slate-400`,children:`No submissions for this team yet.`}),e.submissions.map(t=>{let n=(t.result?.criteria||[]).some(e=>(e.evalMode===`manual`||e.id===`F7`||e.id===`F8`)&&!e.isManuallyGraded&&(!e.score||e.score===0));return(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2`,children:[(0,z.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,z.jsx)(`p`,{className:`truncate text-sm text-slate-100`,children:t.file_name}),(0,z.jsxs)(`p`,{className:`text-[11px] text-slate-400 flex flex-wrap items-center gap-2`,children:[(0,z.jsxs)(`span`,{children:[new Date(t.created_at).toLocaleString(),` · `,t.status]}),t.error&&(0,z.jsxs)(`span`,{className:`text-rose-400`,children:[`· `,t.error]}),t.status===`done`&&(n?(0,z.jsx)(`span`,{className:`rounded bg-amber-400/20 text-amber-300 px-1.5 py-0.5 text-[10px] font-bold`,children:`✍️ F7/F8 Pending`}):(0,z.jsx)(`span`,{className:`rounded bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 text-[10px] font-bold`,children:`✅ Fully Graded`}))]})]}),t.score!=null&&(0,z.jsxs)(`span`,{className:`shrink-0 text-sm font-semibold text-amber-300`,children:[t.score,`/100`]}),(0,z.jsx)(`button`,{onClick:()=>k(t),disabled:t.status!==`done`,className:`rounded-md border border-amber-300/40 bg-amber-300/10 px-2.5 py-1 text-xs font-medium text-amber-200 hover:bg-amber-300/20 disabled:opacity-40`,children:n?`✍️ Grade & View`:`View`}),(0,z.jsx)(`button`,{onClick:()=>Ue(e,t),disabled:t.status!==`done`,className:`rounded-md border border-white/15 px-2.5 py-1 text-xs text-slate-200 hover:bg-white/10 disabled:opacity-40`,children:`JSON`}),(0,z.jsx)(`button`,{onClick:()=>{confirm(`Delete this submission?`)&&Pe.mutate(t.id)},className:`rounded-md border border-rose-400/40 px-2.5 py-1 text-xs text-rose-200 hover:bg-rose-500/15`,children:`×`})]},t.id)})]})]},e.id)})]})]}),B===`results`&&(0,z.jsxs)(`section`,{className:`space-y-6`,children:[(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-4`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`h2`,{className:`font-serif text-2xl`,children:`Results List (Partwise / Category Breakdown)`}),(0,z.jsx)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`Track-wise standings, rubric scores, and instant category-filtered PDF export.`})]}),(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2`,children:[(0,z.jsx)(`button`,{onClick:()=>X(be(Z,V)),className:`inline-flex items-center gap-1.5 rounded-lg bg-amber-300 px-4 py-2 text-xs font-semibold text-black hover:bg-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)]`,children:`📄 Export Partwise Results PDF`}),(0,z.jsx)(`button`,{onClick:()=>we(`ideathon-2026-partwise-${new Date().toISOString().slice(0,10)}.csv`,ze),className:`rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200 hover:bg-white/10`,children:`📊 Export CSV`})]})]}),(0,z.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[(0,z.jsxs)(`button`,{onClick:()=>de(`All`),className:`rounded-full px-4 py-1.5 text-xs font-semibold transition ${V===`All`?`bg-amber-300 text-black shadow-[0_0_12px_rgba(251,191,36,0.3)]`:`border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10`}`,children:[`All Parts (`,Q.length,`)`]}),K.map(e=>{let t=Z.filter(t=>t.bestScore!=null&&(t.latest?.category===e.name||t.submissions.some(t=>t.category===e.name))).length;return(0,z.jsxs)(`button`,{onClick:()=>de(e.name),className:`rounded-full px-4 py-1.5 text-xs font-semibold transition ${V===e.name?`bg-amber-300 text-black shadow-[0_0_12px_rgba(251,191,36,0.3)]`:`border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/10`}`,children:[e.name,` (`,t,`)`]},e.id)})]}),(0,z.jsx)(`div`,{className:`grid gap-4 sm:grid-cols-2 lg:grid-cols-3`,children:Be.map(e=>V!==`All`&&e.category!==V?null:(0,z.jsxs)(`div`,{className:`rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm space-y-3`,children:[(0,z.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,z.jsx)(`span`,{className:`rounded bg-amber-300/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 border border-amber-300/20`,children:e.category}),(0,z.jsxs)(`span`,{className:`text-xs text-slate-400`,children:[e.teams.length,` Teams`]})]}),(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`div`,{className:`text-[10px] uppercase tracking-wider text-slate-500`,children:`Track Champion`}),(0,z.jsx)(`div`,{className:`text-base font-bold text-slate-100 truncate`,children:e.topTeam?(0,z.jsxs)(`span`,{className:`flex items-center gap-1.5`,children:[(0,z.jsx)(`span`,{children:`🏆`}),(0,z.jsx)(`span`,{children:e.topTeam.name})]}):(0,z.jsx)(`span`,{className:`text-slate-500 font-normal`,children:`No evaluated teams yet`})})]}),(0,z.jsxs)(`div`,{className:`grid grid-cols-2 gap-2 border-t border-white/5 pt-3`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`div`,{className:`text-[9px] uppercase text-slate-500`,children:`Top Score`}),(0,z.jsx)(`div`,{className:`text-lg font-bold text-amber-300`,children:e.topTeam?.bestScore==null?`—`:`${e.topTeam.bestScore}/100`})]}),(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`div`,{className:`text-[9px] uppercase text-slate-500`,children:`Part Average`}),(0,z.jsx)(`div`,{className:`text-lg font-bold text-sky-400`,children:e.avgScore?`${e.avgScore}/100`:`—`})]})]})]},e.category))}),(0,z.jsx)(`div`,{className:`overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]`,children:(0,z.jsxs)(`table`,{className:`w-full min-w-[750px] text-sm`,children:[(0,z.jsx)(`thead`,{className:`bg-white/[0.03] text-xs uppercase tracking-wider text-slate-400`,children:(0,z.jsxs)(`tr`,{children:[(0,z.jsx)(`th`,{className:`px-4 py-3.5 text-left`,children:`#`}),(0,z.jsx)(`th`,{className:`px-4 py-3.5 text-left`,children:`Team & Project`}),(0,z.jsx)(`th`,{className:`px-4 py-3.5 text-left`,children:`Leader & Contact`}),(0,z.jsx)(`th`,{className:`px-4 py-3.5 text-left`,children:`Part / Track`}),(0,z.jsx)(`th`,{className:`px-4 py-3.5 text-left`,children:`Evaluation Mode`}),(0,z.jsx)(`th`,{className:`px-4 py-3.5 text-left`,children:`Score Gauge`}),(0,z.jsx)(`th`,{className:`px-4 py-3.5 text-right`,children:`Score`}),(0,z.jsx)(`th`,{className:`px-4 py-3.5 text-right`,children:`Reports`})]})}),(0,z.jsxs)(`tbody`,{children:[Q.length===0&&(0,z.jsx)(`tr`,{children:(0,z.jsx)(`td`,{colSpan:8,className:`px-4 py-8 text-center text-slate-500`,children:`No evaluated teams in this category yet.`})}),Q.map((e,t)=>{let n=[`🥇`,`🥈`,`🥉`][t],r=Math.max(0,Math.min(100,e.bestScore??0)),i=((e.submissions.find(t=>t.score===e.bestScore)||e.submissions.find(e=>e.status===`done`))?.result?.criteria||[]).some(e=>(e.evalMode===`manual`||e.id===`F7`||e.id===`F8`)&&!e.isManuallyGraded&&(!e.score||e.score===0));return(0,z.jsxs)(`tr`,{className:`border-t border-white/5 hover:bg-white/[0.02]`,children:[(0,z.jsx)(`td`,{className:`px-4 py-3.5 text-slate-400 font-bold`,children:n?(0,z.jsx)(`span`,{className:`text-lg`,children:n}):t+1}),(0,z.jsxs)(`td`,{className:`px-4 py-3.5`,children:[(0,z.jsx)(`div`,{className:`font-semibold text-slate-100`,children:e.name}),e.project_title&&(0,z.jsxs)(`div`,{className:`text-xs text-amber-200/80 truncate max-w-[180px]`,children:[`💡 `,e.project_title]})]}),(0,z.jsxs)(`td`,{className:`px-4 py-3.5 text-xs text-slate-300`,children:[(0,z.jsx)(`div`,{className:`font-medium text-slate-200`,children:e.leader_name||`Leader Registered`}),(0,z.jsx)(`div`,{className:`text-slate-400`,children:e.leader_email||`—`}),e.leader_phone&&(0,z.jsxs)(`div`,{className:`text-slate-500 font-mono`,children:[`📞 `,e.leader_phone]})]}),(0,z.jsx)(`td`,{className:`px-4 py-3.5 text-xs`,children:(0,z.jsx)(`span`,{className:`rounded bg-amber-300/10 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-300/20`,children:e.latest?.category||`General`})}),(0,z.jsx)(`td`,{className:`px-4 py-3.5 text-xs`,children:i?(0,z.jsx)(`span`,{className:`inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300`,children:`✍️ F7/F8 Pending`}):(0,z.jsx)(`span`,{className:`inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-300`,children:`✅ Fully Graded`})}),(0,z.jsx)(`td`,{className:`px-4 py-3.5`,children:(0,z.jsx)(`div`,{role:`progressbar`,"aria-valuenow":Math.round(r),"aria-valuemin":0,"aria-valuemax":100,className:`h-2 w-full min-w-[90px] overflow-hidden rounded-full border border-white/10 bg-white/5`,children:(0,z.jsx)(`div`,{className:`h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200`,style:{width:`${r}%`}})})}),(0,z.jsxs)(`td`,{className:`px-4 py-3.5 text-right font-serif text-lg font-bold text-amber-300`,children:[e.bestScore,(0,z.jsx)(`span`,{className:`text-xs text-slate-500 font-sans`,children:`/100`})]}),(0,z.jsx)(`td`,{className:`px-4 py-3.5 text-right`,children:(0,z.jsxs)(`div`,{className:`flex justify-end gap-1.5`,children:[(0,z.jsx)(`button`,{onClick:()=>X(ve(e)),className:`rounded border border-amber-300/30 px-2 py-1 text-[10px] font-medium text-amber-300 hover:bg-amber-300/10`,children:`1-Page PDF`}),(0,z.jsx)(`button`,{onClick:()=>X(ye(e)),className:`rounded border border-violet-400/30 px-2 py-1 text-[10px] font-medium text-violet-300 hover:bg-violet-400/10`,children:`2-Page PDF`})]})})]},e.id)})]})]})})]}),B===`announcements`&&(0,z.jsxs)(`section`,{className:`space-y-6`,children:[(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-4`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`h2`,{className:`font-serif text-2xl`,children:`Official Announcement List & Podium`}),(0,z.jsx)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`Grand championship winners, track champions, and 1-click official declaration PDF.`})]}),(0,z.jsx)(`div`,{className:`flex flex-wrap items-center gap-2`,children:(0,z.jsxs)(`button`,{onClick:()=>X(xe(Z,K)),className:`inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-200 shadow-[0_0_20px_rgba(251,191,36,0.35)]`,children:[(0,z.jsx)(`span`,{children:`🏆`}),` Print 1-Page Official Announcement PDF`]})})]}),(0,z.jsxs)(`div`,{className:`rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 backdrop-blur-md`,children:[(0,z.jsxs)(`div`,{className:`text-center mb-6`,children:[(0,z.jsx)(`span`,{className:`text-[10px] uppercase tracking-[0.3em] text-amber-300 font-bold`,children:`Official Declaration`}),(0,z.jsx)(`h3`,{className:`font-serif text-2xl sm:text-3xl mt-1`,children:`Grand Championship Winners`})]}),(0,z.jsxs)(`div`,{className:`grid gap-4 sm:grid-cols-3 items-end max-w-4xl mx-auto`,children:[(0,z.jsxs)(`div`,{className:`rounded-2xl border border-slate-700 bg-white/[0.02] p-5 text-center order-2 sm:order-1`,children:[(0,z.jsx)(`div`,{className:`text-4xl`,children:`🥈`}),(0,z.jsx)(`div`,{className:`mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold`,children:`1st Runner-Up`}),(0,z.jsx)(`div`,{className:`mt-1 font-serif text-xl font-bold text-slate-100`,children:Q[1]?.name||`To Be Announced`}),(0,z.jsx)(`div`,{className:`text-xs text-amber-300/80 mt-1`,children:Q[1]?.latest?.category||`—`}),(0,z.jsxs)(`div`,{className:`mt-3 font-serif text-2xl font-black text-sky-400`,children:[Q[1]?.bestScore??`—`,(0,z.jsx)(`span`,{className:`text-xs text-slate-500`,children:`/100`})]})]}),(0,z.jsxs)(`div`,{className:`rounded-2xl border-2 border-amber-300/70 bg-gradient-to-b from-amber-300/15 to-transparent p-6 text-center order-1 sm:order-2 shadow-[0_0_40px_rgba(251,191,36,0.2)]`,children:[(0,z.jsx)(`div`,{className:`text-5xl`,children:`🏆`}),(0,z.jsx)(`div`,{className:`mt-2 text-[11px] uppercase tracking-[0.2em] text-amber-300 font-black`,children:`Grand Champion (1st Place)`}),(0,z.jsx)(`div`,{className:`mt-1 font-serif text-2xl sm:text-3xl font-black text-white`,children:Q[0]?.name||`To Be Announced`}),(0,z.jsx)(`div`,{className:`text-xs text-amber-200 mt-1 font-semibold`,children:Q[0]?.latest?.category||`Top Track Winner`}),(0,z.jsxs)(`div`,{className:`mt-3 font-serif text-3xl sm:text-4xl font-black text-amber-300`,children:[Q[0]?.bestScore??`—`,(0,z.jsx)(`span`,{className:`text-sm text-amber-300/60`,children:`/100`})]})]}),(0,z.jsxs)(`div`,{className:`rounded-2xl border border-slate-700 bg-white/[0.02] p-5 text-center order-3`,children:[(0,z.jsx)(`div`,{className:`text-4xl`,children:`🥉`}),(0,z.jsx)(`div`,{className:`mt-2 text-[10px] uppercase tracking-wider text-slate-400 font-bold`,children:`2nd Runner-Up`}),(0,z.jsx)(`div`,{className:`mt-1 font-serif text-xl font-bold text-slate-100`,children:Q[2]?.name||`To Be Announced`}),(0,z.jsx)(`div`,{className:`text-xs text-amber-300/80 mt-1`,children:Q[2]?.latest?.category||`—`}),(0,z.jsxs)(`div`,{className:`mt-3 font-serif text-2xl font-black text-sky-400`,children:[Q[2]?.bestScore??`—`,(0,z.jsx)(`span`,{className:`text-xs text-slate-500`,children:`/100`})]})]})]})]}),(0,z.jsxs)(`div`,{className:`space-y-3`,children:[(0,z.jsx)(`h3`,{className:`font-serif text-xl`,children:`🎖️ Partwise Track Champions`}),(0,z.jsx)(`div`,{className:`grid gap-3 sm:grid-cols-2 lg:grid-cols-3`,children:Be.map(e=>(0,z.jsxs)(`div`,{className:`flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`span`,{className:`text-[10px] font-bold text-amber-300 uppercase`,children:e.category}),(0,z.jsx)(`div`,{className:`font-semibold text-slate-100 text-sm mt-0.5`,children:e.topTeam?.name||`Pending Evaluation`}),(0,z.jsx)(`div`,{className:`text-[11px] text-slate-400`,children:e.topTeam?.leader_email||``})]}),(0,z.jsx)(`div`,{className:`text-right`,children:(0,z.jsx)(`div`,{className:`font-serif text-lg font-bold text-amber-300`,children:e.topTeam?.bestScore==null?`—`:`${e.topTeam.bestScore}/100`})})]},e.category))})]})]}),B===`topics`&&(0,z.jsxs)(`section`,{className:`space-y-6`,children:[(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-4`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`h2`,{className:`font-serif text-xl`,children:`Submission Tracks & Categories`}),(0,z.jsxs)(`p`,{className:`text-xs text-slate-500 mt-0.5`,children:[`Categories that teams choose during submission.`,E.data?.updatedAt&&(0,z.jsxs)(z.Fragment,{children:[` Last saved: `,new Date(E.data.updatedAt).toLocaleString()]})]})]}),(0,z.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,z.jsx)(`button`,{onClick:()=>{E.data?.topics&&q(E.data.topics)},className:`rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10`,children:`Reset`}),(0,z.jsx)(`button`,{onClick:Ye,disabled:K.length>=20,className:`rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-300/20 disabled:opacity-40`,children:`+ Add Track`}),(0,z.jsx)(`button`,{onClick:()=>{Y(`saving`),Ie.mutate(K)},disabled:Ie.isPending||K.length===0,className:`rounded-md bg-amber-300 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-200 disabled:opacity-60`,children:Ie.isPending?`Saving…`:J===`saved`?`✓ Saved!`:`Save Tracks`})]})]}),E.isLoading&&(0,z.jsx)(`p`,{className:`text-sm text-slate-400`,children:`Loading tracks…`}),(0,z.jsx)(`div`,{className:`grid gap-3 sm:grid-cols-2 lg:grid-cols-3`,children:K.map((e,t)=>(0,z.jsxs)(`div`,{className:`group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition hover:border-amber-300/20`,children:[(0,z.jsx)(`input`,{value:e.id,onChange:e=>Je(t,`id`,e.target.value),maxLength:10,className:`w-12 shrink-0 rounded-md bg-amber-300/15 px-1.5 py-1 text-center text-xs font-bold text-amber-300 outline-none focus:ring-1 focus:ring-amber-300 border border-transparent focus:border-amber-300/60`,"aria-label":`Track ID`}),(0,z.jsx)(`input`,{value:e.name,onChange:e=>Je(t,`name`,e.target.value),placeholder:`Track Name`,className:`flex-1 min-w-0 rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-300/60`,"aria-label":`Track Name`}),(0,z.jsx)(`button`,{onClick:()=>Xe(t),disabled:K.length<=1,"aria-label":`Remove track ${e.id}`,className:`shrink-0 rounded-md border border-rose-400/30 px-1.5 py-1 text-xs text-rose-300 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 transition disabled:pointer-events-none`,children:`×`})]},t))}),J===`error`&&(0,z.jsx)(`p`,{className:`text-xs text-rose-300`,children:`Failed to save tracks. Please try again.`})]}),B===`criteria`&&(0,z.jsxs)(`section`,{className:`space-y-6`,children:[(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-4`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`h2`,{className:`font-serif text-xl`,children:`Evaluation Criteria (10 Rubric Bands)`}),(0,z.jsxs)(`p`,{className:`text-xs text-slate-500 mt-0.5`,children:[`Criteria sent to the AI panel for scoring every submitted proposal.`,T.data?.updatedAt&&(0,z.jsxs)(z.Fragment,{children:[` Last saved: `,new Date(T.data.updatedAt).toLocaleString()]})]})]}),(0,z.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,z.jsx)(`button`,{onClick:qe,className:`rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10`,children:`Reset`}),(0,z.jsx)(`button`,{onClick:Ge,disabled:U.length>=20,className:`rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-300/20 disabled:opacity-40`,children:`+ Add Criterion`}),(0,z.jsx)(`button`,{onClick:()=>{G(`saving`),Fe.mutate(U)},disabled:Fe.isPending||U.length===0,className:`rounded-md bg-amber-300 px-4 py-1.5 text-xs font-semibold text-black hover:bg-amber-200 disabled:opacity-60`,children:Fe.isPending?`Saving…`:he===`saved`?`✓ Saved!`:`Save Criteria`})]})]}),T.isLoading&&(0,z.jsx)(`p`,{className:`text-sm text-slate-400`,children:`Loading criteria…`}),(0,z.jsx)(`div`,{className:`grid gap-3 sm:grid-cols-2`,children:U.map((e,t)=>{let n=U.reduce((e,t)=>e+t.maxScore,0);return(0,z.jsxs)(`div`,{className:`group rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-amber-300/20`,children:[(0,z.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,z.jsx)(`input`,{value:e.id,onChange:e=>$(t,`id`,e.target.value),maxLength:10,className:`w-14 shrink-0 rounded-md bg-amber-300/15 px-2 py-1 text-center text-xs font-bold text-amber-300 outline-none focus:ring-1 focus:ring-amber-300 border border-transparent focus:border-amber-300/60`,"aria-label":`Criterion ID`}),(0,z.jsxs)(`div`,{className:`flex-1 min-w-0 space-y-2`,children:[(0,z.jsx)(`input`,{value:e.name,onChange:e=>$(t,`name`,e.target.value),placeholder:`Criterion name`,className:`w-full rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm font-medium text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-300/60`,"aria-label":`Criterion name`}),(0,z.jsx)(`textarea`,{value:e.description,onChange:e=>$(t,`description`,e.target.value),placeholder:`Description (sent to AI evaluator)`,rows:2,className:`w-full rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-xs text-slate-400 placeholder:text-slate-600 outline-none focus:border-amber-300/60 resize-none`,"aria-label":`Criterion description`})]}),(0,z.jsxs)(`div`,{className:`flex shrink-0 flex-col items-center gap-1`,children:[(0,z.jsx)(`label`,{className:`text-[9px] uppercase text-slate-600`,children:`Max`}),(0,z.jsx)(`input`,{type:`number`,min:1,max:100,value:e.maxScore,onChange:e=>$(t,`maxScore`,parseInt(e.target.value)||10),className:`w-14 rounded-md border border-white/10 bg-black/30 px-2 py-1 text-center text-sm font-bold text-amber-300 outline-none focus:border-amber-300/60`,"aria-label":`Max score`}),(0,z.jsx)(`span`,{className:`text-[9px] text-slate-600`,children:`pts`})]}),(0,z.jsx)(`button`,{onClick:()=>Ke(t),disabled:U.length<=1,"aria-label":`Remove criterion ${e.id}`,className:`shrink-0 rounded-md border border-rose-400/30 px-1.5 py-1 text-xs text-rose-300 opacity-0 group-hover:opacity-100 hover:bg-rose-500/10 transition disabled:pointer-events-none`,children:`×`})]}),(0,z.jsxs)(`div`,{className:`mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2.5`,children:[(0,z.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,z.jsx)(`span`,{className:`text-[10px] uppercase tracking-wider text-slate-400 font-semibold`,children:`Mode:`}),(0,z.jsxs)(`select`,{value:e.evalMode||e.type||(e.id===`F7`||e.id===`F8`?`manual`:`ai`),onChange:e=>{let n=e.target.value;$(t,`evalMode`,n),$(t,`type`,n)},className:`rounded-md border px-2 py-1 text-xs font-semibold outline-none transition ${(e.evalMode||e.type||(e.id===`F7`||e.id===`F8`?`manual`:`ai`))===`manual`?`border-purple-400/40 bg-purple-500/15 text-purple-200`:`border-sky-400/40 bg-sky-500/15 text-sky-200`}`,children:[(0,z.jsx)(`option`,{value:`ai`,className:`bg-[#0a0a14] text-slate-200`,children:`🤖 AI Evaluated (Gemini)`}),(0,z.jsx)(`option`,{value:`manual`,className:`bg-[#0a0a14] text-slate-200`,children:`✍️ Manual Evaluation (Live Jury)`})]})]}),e.evalMode===`manual`||e.type===`manual`||e.id===`F7`||e.id===`F8`?(0,z.jsx)(`span`,{className:`rounded bg-purple-400/10 border border-purple-400/20 px-2 py-0.5 text-[10px] font-semibold text-purple-300`,children:`Live Pitch Evaluation`}):(0,z.jsx)(`span`,{className:`rounded bg-sky-400/10 border border-sky-400/20 px-2 py-0.5 text-[10px] font-semibold text-sky-300`,children:`Automated AI Grading`})]}),(0,z.jsxs)(`div`,{className:`mt-3 flex items-center gap-2`,children:[(0,z.jsx)(`div`,{className:`flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden`,children:(0,z.jsx)(`div`,{className:`h-full rounded-full bg-amber-400/60`,style:{width:`${Math.round(e.maxScore/Math.max(n,1)*100)}%`}})}),(0,z.jsxs)(`span`,{className:`text-[10px] text-slate-600`,children:[Math.round(e.maxScore/Math.max(n,1)*100),`% weight`]})]})]},t)})}),(0,z.jsxs)(`div`,{className:`flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3`,children:[(0,z.jsx)(`span`,{className:`text-sm text-slate-400`,children:`Total max score`}),(0,z.jsxs)(`span`,{className:`font-serif text-2xl text-amber-300`,children:[U.reduce((e,t)=>e+t.maxScore,0),(0,z.jsx)(`span`,{className:`text-sm text-slate-500`,children:` pts`})]})]}),he===`error`&&(0,z.jsx)(`p`,{className:`text-xs text-rose-300`,children:`Failed to save criteria. Please try again.`})]})]}),pe&&(0,z.jsx)(Ee,{teams:Z,topics:K,onClose:()=>me(!1)}),O&&(0,z.jsx)(ke,{submission:O,team:(w.data||[]).find(e=>e.id===O.team_id)||null,saveManualScoresFn:x,onScoreSaved:()=>w.refetch(),onClose:()=>k(null),onExport:()=>Ce(`submission-${O.id.slice(0,8)}.json`,{exportedAt:new Date().toISOString(),submission:O})}),L&&(0,z.jsx)(De,{title:`Delete team?`,message:(0,z.jsxs)(z.Fragment,{children:[`You're about to permanently delete`,` `,(0,z.jsxs)(`span`,{className:`font-semibold text-slate-100`,children:[`"`,L.name,`"`]}),` and`,` `,L.submissions.length===0?`no submissions.`:`all ${L.submissions.length} submission${L.submissions.length===1?``:`s`} attached to it.`,` `,`This cannot be undone.`]}),confirmLabel:Ne.isPending?`Deleting…`:`Delete team`,busy:Ne.isPending,onCancel:()=>le(null),onConfirm:()=>{let e=L.id;Ne.mutate(e,{onSettled:()=>le(null)})}}),Te&&(0,z.jsx)(Oe,{feedback:Te,onClose:()=>Ae(null)}),(0,z.jsx)(oe,{className:`mt-20 border-t border-white/5 pt-8`})]})}function Ee({teams:e,topics:t,onClose:n}){let[r,i]=(0,R.useState)(e[0]?.id||``),[a,o]=(0,R.useState)(`All`),s=e.find(e=>e.id===r);return(0,z.jsx)(`div`,{role:`dialog`,"aria-modal":`true`,className:`fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md`,onClick:n,children:(0,z.jsxs)(`div`,{onClick:e=>e.stopPropagation(),className:`w-full max-w-xl rounded-3xl border border-white/15 bg-[#0a0a14] p-6 text-slate-100 shadow-[0_20px_70px_rgba(0,0,0,0.7)] space-y-6`,children:[(0,z.jsxs)(`div`,{className:`flex items-start justify-between`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`div`,{className:`text-[10px] uppercase tracking-[0.2em] text-amber-300 font-bold`,children:`Official Document Center`}),(0,z.jsx)(`h3`,{className:`font-serif text-2xl mt-0.5`,children:`Generate & Print PDF Reports`})]}),(0,z.jsx)(`button`,{onClick:n,className:`rounded-full border border-white/15 p-1.5 text-xs text-slate-400 hover:text-white`,children:`✕`})]}),(0,z.jsxs)(`div`,{className:`space-y-4`,children:[(0,z.jsxs)(`div`,{className:`rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-amber-300/30 transition`,children:[(0,z.jsx)(`div`,{className:`flex items-center justify-between`,children:(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`span`,{className:`font-bold text-slate-100 text-sm`,children:`📄 1-Page Executive Scorecard (Single Team)`}),(0,z.jsx)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`Fitted for exactly 1 page with score gauge, 10 rubric criteria, strengths, and background logo watermark.`})]})}),(0,z.jsxs)(`div`,{className:`mt-3 flex items-center gap-2`,children:[(0,z.jsx)(`select`,{value:r,onChange:e=>i(e.target.value),className:`flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-200 outline-none`,children:e.map(e=>(0,z.jsxs)(`option`,{value:e.id,children:[e.name,` `,e.bestScore==null?`(Unscored)`:`(${e.bestScore}/100)`]},e.id))}),(0,z.jsx)(`button`,{disabled:!s||s.bestScore==null,onClick:()=>{s&&X(ve(s))},className:`rounded-lg bg-amber-300 px-4 py-2 text-xs font-bold text-black hover:bg-amber-200 disabled:opacity-40`,children:`Print 1-Page`})]})]}),(0,z.jsxs)(`div`,{className:`rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-violet-400/30 transition`,children:[(0,z.jsx)(`div`,{className:`flex items-center justify-between`,children:(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`span`,{className:`font-bold text-slate-100 text-sm`,children:`📑 2-Page Detailed Evaluation Dossier`}),(0,z.jsx)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`Page 1: Executive Overview & Strengths. Page 2: 10-criteria rubric matrix, deductions, and jury signatures.`})]})}),(0,z.jsxs)(`div`,{className:`mt-3 flex items-center gap-2`,children:[(0,z.jsx)(`select`,{value:r,onChange:e=>i(e.target.value),className:`flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-200 outline-none`,children:e.map(e=>(0,z.jsxs)(`option`,{value:e.id,children:[e.name,` `,e.bestScore==null?`(Unscored)`:`(${e.bestScore}/100)`]},e.id))}),(0,z.jsx)(`button`,{disabled:!s||s.bestScore==null,onClick:()=>{s&&X(ye(s))},className:`rounded-lg bg-violet-400 px-4 py-2 text-xs font-bold text-black hover:bg-violet-300 disabled:opacity-40`,children:`Print 2-Page`})]})]}),(0,z.jsxs)(`div`,{className:`rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-sky-400/30 transition`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`span`,{className:`font-bold text-slate-100 text-sm`,children:`📊 Partwise Results List PDF`}),(0,z.jsx)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`Consolidated results table filtered by track/category with score bars and logo watermark.`})]}),(0,z.jsxs)(`div`,{className:`mt-3 flex items-center gap-2`,children:[(0,z.jsxs)(`select`,{value:a,onChange:e=>o(e.target.value),className:`flex-1 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-xs text-slate-200 outline-none`,children:[(0,z.jsx)(`option`,{value:`All`,children:`All Categories`}),t.map(e=>(0,z.jsx)(`option`,{value:e.name,children:e.name},e.id))]}),(0,z.jsx)(`button`,{onClick:()=>X(be(e,a)),className:`rounded-lg bg-sky-400 px-4 py-2 text-xs font-bold text-black hover:bg-sky-300`,children:`Print Results`})]})]}),(0,z.jsx)(`div`,{className:`rounded-2xl border border-white/10 bg-white/[0.02] p-4 hover:border-emerald-400/30 transition`,children:(0,z.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`span`,{className:`font-bold text-slate-100 text-sm`,children:`🏆 Official Declaration of Winners (1 Page)`}),(0,z.jsx)(`p`,{className:`text-xs text-slate-400 mt-0.5`,children:`Grand championship podium (1st, 2nd, 3rd), track champions, faculty signatures, and seal.`})]}),(0,z.jsx)(`button`,{onClick:()=>X(xe(e,t)),className:`rounded-lg bg-emerald-400 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-300`,children:`Print Announcement`})]})})]})]})})}function De({title:e,message:t,confirmLabel:n,busy:r,onCancel:i,onConfirm:a}){return(0,R.useEffect)(()=>{let e=e=>{e.key===`Escape`&&i()};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[i]),(0,z.jsx)(`div`,{role:`dialog`,"aria-modal":`true`,"aria-labelledby":`confirm-title`,className:`fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm`,onClick:i,children:(0,z.jsxs)(`div`,{onClick:e=>e.stopPropagation(),className:`w-full max-w-md rounded-2xl border border-rose-400/30 bg-[#0a0a14] p-6 text-slate-100 shadow-[0_20px_60px_-20px_rgba(244,63,94,0.4)]`,children:[(0,z.jsxs)(`div`,{className:`flex items-start gap-3`,children:[(0,z.jsx)(`span`,{className:`grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-500/15 text-rose-300`,"aria-hidden":`true`,children:`!`}),(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`h3`,{id:`confirm-title`,className:`font-serif text-xl`,children:e}),(0,z.jsx)(`p`,{className:`mt-2 text-sm text-slate-300`,children:t})]})]}),(0,z.jsxs)(`div`,{className:`mt-6 flex justify-end gap-2`,children:[(0,z.jsx)(`button`,{autoFocus:!0,onClick:i,className:`rounded-md border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/10`,children:`Cancel`}),(0,z.jsx)(`button`,{onClick:a,disabled:r,className:`rounded-md bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-400 disabled:opacity-60`,children:n})]})]})})}function Oe({feedback:e,onClose:t}){let[n,r]=(0,R.useState)(!1);(0,R.useEffect)(()=>{let e=e=>{e.key===`Escape`&&t()};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[t]);let i=async()=>{await navigator.clipboard.writeText(e.body),r(!0),setTimeout(()=>r(!1),2e3)},a=`mailto:${encodeURIComponent(e.to)}?subject=${encodeURIComponent(e.subject)}&body=${encodeURIComponent(e.body)}`;return(0,z.jsx)(`div`,{role:`dialog`,"aria-modal":`true`,"aria-labelledby":`feedback-title`,className:`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm`,onClick:t,children:(0,z.jsxs)(`div`,{onClick:e=>e.stopPropagation(),className:`my-8 w-full max-w-2xl rounded-2xl border border-sky-400/30 bg-[#0a0a14] p-5 text-slate-100 shadow-[0_20px_60px_-20px_rgba(56,189,248,0.3)] sm:p-6`,children:[(0,z.jsxs)(`div`,{className:`flex items-start justify-between gap-3 mb-4`,children:[(0,z.jsxs)(`div`,{className:`min-w-0`,children:[(0,z.jsx)(`h3`,{id:`feedback-title`,className:`font-serif text-xl text-sky-300`,children:`📧 Feedback Email`}),(0,z.jsxs)(`p`,{className:`mt-1 text-xs text-slate-400 truncate`,children:[`To: `,(0,z.jsx)(`span`,{className:`text-slate-200`,children:e.to})]}),(0,z.jsxs)(`p`,{className:`text-xs text-slate-400 truncate`,children:[`Subject: `,(0,z.jsx)(`span`,{className:`text-slate-200`,children:e.subject})]})]}),(0,z.jsx)(`button`,{onClick:t,className:`shrink-0 rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10`,children:`✕ Close`})]}),(0,z.jsx)(`div`,{className:`rounded-lg border border-white/10 bg-black/40 p-4 max-h-80 overflow-y-auto`,children:(0,z.jsx)(`pre`,{className:`whitespace-pre-wrap text-xs text-slate-300 font-mono leading-relaxed`,children:e.body})}),(0,z.jsxs)(`div`,{className:`mt-4 flex flex-wrap gap-2`,children:[(0,z.jsx)(`a`,{href:a,className:`flex-1 rounded-md bg-sky-500 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-sky-400`,children:`✉️ Open in Email Client`}),(0,z.jsx)(`button`,{onClick:i,className:`rounded-md border border-white/15 px-4 py-2.5 text-sm text-slate-200 hover:bg-white/10`,children:n?`✓ Copied!`:`📋 Copy Body`})]}),(0,z.jsx)(`p`,{className:`mt-3 text-[11px] text-slate-600 leading-relaxed`,children:`Clicking "Open in Email Client" will open your default mail app with this email pre-filled.`})]})})}function ke({submission:e,team:t,onClose:n,onExport:i,saveManualScoresFn:a,onScoreSaved:o}){let c=s(r),[l,u]=(0,R.useState)(null),d=e.result||{},[f,ee]=(0,R.useState)(e.score),[p,te]=(0,R.useState)(d),[m,h]=(0,R.useState)(()=>{let t={};return(e.result?.criteria||[]).forEach(e=>{t[e.id]={score:Number(e.score)||0,evidence:e.evidence||``}}),t}),[g,_]=(0,R.useState)(!1),[v,y]=(0,R.useState)(!1),[b,x]=(0,R.useState)(null);(0,R.useEffect)(()=>{c({data:{path:e.pdf_path}}).then(e=>u(e.url)).catch(()=>u(null))},[e.pdf_path]),(0,R.useEffect)(()=>{let e=e=>{e.key===`Escape`&&n()};return window.addEventListener(`keydown`,e),()=>window.removeEventListener(`keydown`,e)},[n]);let S=p,C=S.criteria||[],w=async()=>{if(a){_(!0),x(null);try{let t=await a({data:{submissionId:e.id,scores:m}});t?.totalScore!=null&&ee(t.totalScore),t?.result&&te(t.result),y(!0),o?.(),setTimeout(()=>y(!1),3e3)}catch(e){x(e?.message||`Failed to save jury scores`)}finally{_(!1)}}};return(0,z.jsx)(`div`,{role:`dialog`,"aria-modal":`true`,"aria-labelledby":`eval-title`,className:`fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 sm:p-4 backdrop-blur-sm`,onClick:n,children:(0,z.jsxs)(`div`,{onClick:e=>e.stopPropagation(),className:`my-6 w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0a0a14] p-5 text-slate-100 shadow-2xl sm:p-7 space-y-6`,children:[(0,z.jsxs)(`div`,{className:`flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-5`,children:[(0,z.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center gap-2 mb-1`,children:[(0,z.jsx)(`span`,{className:`rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-slate-400 font-mono`,children:e.file_name}),(e.category||t?.latest?.category)&&(0,z.jsxs)(`span`,{className:`rounded bg-amber-400/10 border border-amber-400/25 px-2 py-0.5 text-[10px] font-semibold text-amber-300`,children:[`📌 `,e.category||t?.latest?.category]})]}),(0,z.jsx)(`h3`,{id:`eval-title`,className:`font-serif text-3xl font-bold text-slate-100`,children:t?.name||`Proposal Evaluation`}),(0,z.jsxs)(`p`,{className:`text-xs text-slate-400 mt-1`,children:[`Hybrid Scoring: `,(0,z.jsx)(`b`,{children:`AI Evaluation (F1–F6, F9, F10)`}),` + `,(0,z.jsx)(`b`,{children:`Live Jury Evaluation (F7 & F8)`})]})]}),(0,z.jsxs)(`div`,{className:`flex flex-col items-end`,children:[(0,z.jsxs)(`div`,{className:`text-4xl font-bold text-amber-300 font-serif`,children:[f??`—`,(0,z.jsx)(`span`,{className:`text-base text-slate-500 font-sans`,children:`/100`})]}),(0,z.jsx)(`div`,{className:`text-xs uppercase tracking-wider text-amber-200/80 font-semibold mt-0.5`,children:S.overallRating||`Pending Evaluation`})]})]}),t&&(0,z.jsxs)(`div`,{className:`rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3`,children:[(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2`,children:[(0,z.jsx)(`span`,{className:`text-[10px] uppercase tracking-wider text-slate-400 font-bold`,children:`Team Profile & Leader Details`}),(0,z.jsxs)(`span`,{className:`text-xs text-slate-400`,children:[`Created: `,new Date(t.created_at||``).toLocaleDateString()]})]}),(0,z.jsxs)(`div`,{className:`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-xs`,children:[(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`span`,{className:`text-slate-500 block text-[10px] uppercase`,children:`Leader Name`}),(0,z.jsx)(`span`,{className:`font-semibold text-slate-200`,children:t.leader_name||`Leader Registered`})]}),(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`span`,{className:`text-slate-500 block text-[10px] uppercase`,children:`Leader Contact`}),(0,z.jsxs)(`span`,{className:`text-slate-300`,children:[`📧 `,t.leader_email||`—`,` `,t.leader_phone?`· 📞 ${t.leader_phone}`:``]})]}),(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`span`,{className:`text-slate-500 block text-[10px] uppercase`,children:`Registered Members`}),(0,z.jsx)(`span`,{className:`font-semibold text-slate-200`,children:t.members&&t.members.length>0?`${t.members.length} Members`:`No extra members listed`})]})]}),t.project_title&&(0,z.jsxs)(`div`,{className:`border-t border-white/5 pt-2`,children:[(0,z.jsx)(`span`,{className:`text-slate-500 block text-[10px] uppercase`,children:`Project Title`}),(0,z.jsx)(`p`,{className:`text-sm font-medium text-amber-200`,children:t.project_title}),t.project_description&&(0,z.jsx)(`p`,{className:`text-xs text-slate-300 mt-1 leading-relaxed`,children:t.project_description})]}),t.members&&t.members.length>0&&(0,z.jsxs)(`div`,{className:`border-t border-white/5 pt-2`,children:[(0,z.jsx)(`span`,{className:`text-slate-500 block text-[10px] uppercase mb-1`,children:`Members List`}),(0,z.jsx)(`div`,{className:`flex flex-wrap gap-1.5`,children:t.members.map((e,t)=>(0,z.jsxs)(`span`,{className:`rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[11px] text-slate-300`,children:[`👤 `,typeof e==`string`?e:e.name?`${e.name}${e.role?` (${e.role})`:``}`:`Member ${t+1}`]},t))})]})]}),(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-3`,children:[(0,z.jsxs)(`div`,{className:`flex flex-wrap gap-2`,children:[l&&(0,z.jsx)(`a`,{href:l,target:`_blank`,rel:`noreferrer`,className:`rounded-md border border-white/15 px-3 py-1.5 text-xs text-slate-200 hover:bg-white/10`,children:`Open Submitted PDF ↗`}),(0,z.jsx)(`button`,{onClick:i,className:`rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10`,children:`Export JSON`})]}),(0,z.jsxs)(`div`,{className:`flex items-center gap-2`,children:[v&&(0,z.jsx)(`span`,{className:`text-xs font-bold text-emerald-400`,children:`✓ Jury Scores Saved!`}),b&&(0,z.jsx)(`span`,{className:`text-xs font-bold text-rose-400`,children:b}),(0,z.jsx)(`button`,{type:`button`,disabled:g,onClick:w,className:`rounded-lg bg-amber-300 px-4 py-1.5 text-xs font-bold text-black hover:bg-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] disabled:opacity-50`,children:g?`Saving…`:`💾 Save Jury Scores & Recalculate Total`})]})]}),S.executiveSummary&&(0,z.jsxs)(`div`,{className:`rounded-xl border border-white/10 bg-white/[0.02] p-4`,children:[(0,z.jsx)(`h4`,{className:`text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1`,children:`Executive AI Summary`}),(0,z.jsx)(`p`,{className:`text-xs text-slate-300 leading-relaxed`,children:S.executiveSummary})]}),S.problemStatement&&(0,z.jsxs)(`div`,{className:`grid gap-3 sm:grid-cols-2`,children:[(0,z.jsxs)(`div`,{className:`rounded-xl border border-white/10 bg-white/[0.02] p-3.5`,children:[(0,z.jsx)(`h4`,{className:`text-[10px] uppercase tracking-wider text-slate-400 font-bold`,children:`Problem Statement`}),(0,z.jsx)(`p`,{className:`mt-1 text-xs text-slate-200 leading-relaxed`,children:S.problemStatement})]}),(0,z.jsxs)(`div`,{className:`rounded-xl border border-white/10 bg-white/[0.02] p-3.5`,children:[(0,z.jsx)(`h4`,{className:`text-[10px] uppercase tracking-wider text-slate-400 font-bold`,children:`Proposed Solution`}),(0,z.jsx)(`p`,{className:`mt-1 text-xs text-slate-200 leading-relaxed`,children:S.solution})]})]}),C.length>0&&(0,z.jsxs)(`div`,{className:`space-y-3`,children:[(0,z.jsxs)(`div`,{className:`flex items-center justify-between`,children:[(0,z.jsxs)(`h4`,{className:`font-serif text-lg font-bold text-slate-100`,children:[`Rubric Criteria Evaluation (`,C.length,` Bands)`]}),(0,z.jsx)(`span`,{className:`text-xs text-slate-400`,children:`F7 & F8 are evaluated manually by jury; F1–F6, F9, F10 are AI scored.`})]}),(0,z.jsx)(`div`,{className:`grid gap-3.5 sm:grid-cols-2`,children:C.map(e=>{let t=e.evalMode===`manual`||e.type===`manual`||e.id===`F7`||e.id===`F8`,n=e.maxScore??10,r=m[e.id]?.score??(Number(e.score)||0),i=Math.round(r/n*100);return(0,z.jsxs)(`div`,{className:`rounded-xl border p-4 transition ${t?`border-purple-400/30 bg-purple-950/15 shadow-[0_0_20px_rgba(168,85,247,0.08)]`:`border-white/10 bg-white/[0.02]`}`,children:[(0,z.jsxs)(`div`,{className:`flex items-start justify-between gap-2`,children:[(0,z.jsx)(`div`,{children:(0,z.jsxs)(`div`,{className:`flex items-center gap-1.5 flex-wrap`,children:[(0,z.jsx)(`span`,{className:`rounded px-1.5 py-0.5 text-[10px] font-bold ${t?`bg-purple-400/20 text-purple-300 border border-purple-400/30`:`bg-amber-300/15 text-amber-300`}`,children:e.id}),(0,z.jsx)(`span`,{className:`text-xs font-semibold text-slate-100`,children:e.name}),t?(0,z.jsx)(`span`,{className:`rounded bg-purple-500/20 text-purple-200 border border-purple-500/40 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider`,children:`✍️ Manual Jury`}):(0,z.jsx)(`span`,{className:`rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider`,children:`🤖 AI Evaluated`})]})}),(0,z.jsxs)(`span`,{className:`text-sm font-bold text-amber-300 shrink-0`,children:[r,`/`,n]})]}),(0,z.jsx)(`div`,{role:`progressbar`,"aria-valuenow":r,"aria-valuemin":0,"aria-valuemax":n,className:`mt-2 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5`,children:(0,z.jsx)(`div`,{className:`h-full rounded-full transition-all duration-300 ${t?`bg-gradient-to-r from-purple-400 to-amber-300`:`bg-gradient-to-r from-amber-400 to-amber-200`}`,style:{width:`${Math.max(0,Math.min(100,i))}%`}})}),t?(0,z.jsxs)(`div`,{className:`mt-3 space-y-2 rounded-lg border border-purple-400/25 bg-black/40 p-3`,children:[(0,z.jsxs)(`div`,{className:`flex items-center justify-between gap-3`,children:[(0,z.jsxs)(`label`,{className:`text-[11px] font-semibold text-purple-200`,children:[`Jury Score (0–`,n,`):`]}),(0,z.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,z.jsx)(`input`,{type:`number`,min:0,max:n,value:r,onChange:t=>{let r=Math.max(0,Math.min(n,parseInt(t.target.value)||0));h(t=>({...t,[e.id]:{score:r,evidence:t[e.id]?.evidence||``}}))},className:`w-16 rounded border border-purple-400/40 bg-black px-2 py-1 text-center font-serif text-base font-bold text-amber-300 outline-none focus:border-amber-300`}),(0,z.jsxs)(`span`,{className:`text-xs text-slate-500 font-bold`,children:[`/ `,n]})]})]}),(0,z.jsxs)(`div`,{children:[(0,z.jsx)(`label`,{className:`text-[10px] uppercase tracking-wider text-purple-300/80 block mb-1 font-semibold`,children:`Jury Evaluation Remarks & Pitch Notes:`}),(0,z.jsx)(`textarea`,{rows:2,value:m[e.id]?.evidence||``,onChange:t=>{let n=t.target.value;h(t=>({...t,[e.id]:{score:t[e.id]?.score??r,evidence:n}}))},placeholder:`Enter notes on pitch delivery, confidence, clarity, teamwork during Q&A...`,className:`w-full rounded border border-white/10 bg-black/60 p-2 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-purple-400/60 resize-none`})]}),(0,z.jsxs)(`div`,{className:`flex items-center justify-between text-[10px] text-slate-400 pt-1`,children:[(0,z.jsx)(`span`,{children:e.isManuallyGraded||r>0?(0,z.jsx)(`span`,{className:`text-emerald-400 font-semibold`,children:`✓ Graded by Jury`}):(0,z.jsx)(`span`,{className:`text-amber-400 font-semibold`,children:`⏳ Awaiting In-Person Marks`})}),(0,z.jsx)(`span`,{className:`text-slate-500`,children:`Live Evaluation`})]})]}):(0,z.jsxs)(`div`,{className:`mt-2 space-y-1 text-xs text-slate-300`,children:[(0,z.jsxs)(`p`,{className:`text-xs leading-relaxed`,children:[(0,z.jsx)(`b`,{className:`text-slate-100`,children:`Evidence:`}),` `,e.evidence||`Scored based on proposal deck analysis.`]}),e.strengths&&(0,z.jsxs)(`p`,{className:`text-xs text-emerald-300/90`,children:[(0,z.jsx)(`b`,{className:`text-emerald-200`,children:`Strengths:`}),` `,e.strengths]}),e.weaknesses&&(0,z.jsxs)(`p`,{className:`text-xs text-amber-300/90`,children:[(0,z.jsx)(`b`,{className:`text-amber-200`,children:`Weaknesses:`}),` `,e.weaknesses]}),e.deductions&&(0,z.jsxs)(`p`,{className:`text-xs text-rose-300`,children:[(0,z.jsx)(`b`,{className:`text-rose-200`,children:`Deductions:`}),` `,e.deductions]})]})]},e.id)})})]}),(S.strengths||S.weaknesses||S.risks||S.suggestions)&&(0,z.jsx)(`div`,{className:`grid gap-3 sm:grid-cols-2`,children:[{t:`Key Strengths`,items:S.strengths,color:`text-emerald-400`},{t:`Areas for Improvement`,items:S.weaknesses,color:`text-amber-400`},{t:`Execution Risks`,items:S.risks,color:`text-rose-400`},{t:`Jury & AI Suggestions`,items:S.suggestions,color:`text-sky-400`}].map(e=>(0,z.jsxs)(`div`,{className:`rounded-xl border border-white/10 bg-white/[0.02] p-3.5`,children:[(0,z.jsx)(`h4`,{className:`text-[10px] uppercase tracking-wider font-bold ${e.color}`,children:e.t}),(0,z.jsx)(`ul`,{className:`mt-1.5 list-disc space-y-0.5 pl-4 text-xs text-slate-300`,children:e.items?.map((e,t)=>(0,z.jsx)(`li`,{children:e},t))})]},e.t))}),(0,z.jsxs)(`div`,{className:`flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4`,children:[(0,z.jsxs)(`div`,{className:`text-xs text-slate-400`,children:[`Click `,(0,z.jsx)(`b`,{children:`"Save Jury Scores"`}),` to apply F7 & F8 marks and refresh the leaderboard rankings.`]}),(0,z.jsxs)(`div`,{className:`flex items-center gap-3`,children:[v&&(0,z.jsx)(`span`,{className:`text-xs font-semibold text-emerald-400`,children:`✓ Scores Saved!`}),(0,z.jsx)(`button`,{type:`button`,disabled:g,onClick:w,className:`rounded-lg bg-amber-300 px-5 py-2 text-xs font-bold text-black hover:bg-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] disabled:opacity-50`,children:g?`Saving Scores…`:`💾 Save Jury Scores & Recalculate`}),(0,z.jsx)(`button`,{onClick:n,className:`rounded-md border border-white/15 px-4 py-2 text-xs text-slate-200 hover:bg-white/10`,children:`Close`})]})]})]})})}export{Te as component};