import{a as l}from"./chunk-4XBQJDYT.js";import{a as i,b as r,c as w,d as c,e as h,f}from"./chunk-Y32VTBQC.js";var a={...i("photoswipeI18n"),...i("photoswipeFetchOptions")},y=a.wrappingClass||"jonnitto-photoswipe-content",v=a.fetchLinkAppend||"";delete a.wrappingClass;delete a.fetchLinkAppend;var p=null;function g(e={}){e={...a,...e};let t=new l({preloadFirstSlide:!1,allowPanToNext:!1,initialZoomLevel:1,secondaryZoomLevel:1,maxZoomLevel:1,wheelToZoom:!1,closeOnVerticalDrag:!1,mainClass:"pswp--fetch",arrowKeys:!1,preloaderDelay:1e3,pswpModule:()=>import("./photoswipe.esm-SYAMA2OP.js"),...e});return t.addFilter("isContentZoomable",()=>!1),t.addFilter("preventPointerEvent",()=>!0),t.on("firstUpdate",o=>{w();let n=r();n?.addEventListener("wheel",s=>{s.stopImmediatePropagation(),s.stopPropagation()},{passive:!0}),n?.addEventListener("click",E)}),t.on("destroy",()=>{c({type:"fetch",action:"close"})}),t.on("contentLoad",async o=>{let{content:n}=o,s=n?.data?.src;if(n.type!="fetch"||!s)return;n.state="loading",o.preventDefault();let L=await m(s);n.element=L,p=n.element,n.onLoaded()}),t.init(),t}async function E(e){let t=e.target;if(!t.matches('[data-pswp-type="fetch"]'))return;e.preventDefault();let o=await m(t.href);p.replaceWith(o),p=o}async function C(e,t){let o=await fetch(e+t);if(!o.ok)throw new Error(a.errorMsg);let n=await o.text();return e=P(e),c({url:e,lightbox:e+t,type:"fetch",action:"open"}),n}function P(e){return new RegExp("^(http|https)://","i").test(e)?e:window.location.origin+(e.startsWith("/")?"":"/")+e}async function m(e){d(!0);let t=await C(e,v).catch(n=>`<p class="jonnitto-photoswipe-content__error">${n.message.replace('"%s"',e)}</p>`),o=h(t,y);return d(!1),o}function d(e=!0){r()?.classList.toggle("pswp--fetch-loading",e)}var u=g();f("fetch",()=>{u.init()});window.neosPhotoSwipe=window.neosPhotoSwipe||{};window.neosPhotoSwipe.fetch={init:g,lightbox:u};
/*! For license information please see Fetch.js.LEGAL.txt */
//# sourceMappingURL=Fetch.js.map
