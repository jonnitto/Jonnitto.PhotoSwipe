import{a as p}from"./chunk-4XBQJDYT.js";import{a as i,b as r,c as d,d as m,e as w,f as c}from"./chunk-Y32VTBQC.js";var s={...i("photoswipeI18n"),...i("photoswipeTemplateOptions")},g=s.wrappingClass||"jonnitto-photoswipe-content";delete s.wrappingClass;function h(n={}){n={...s,...n};let e=new p({preloadFirstSlide:!1,allowPanToNext:!1,initialZoomLevel:1,secondaryZoomLevel:1,maxZoomLevel:1,wheelToZoom:!1,closeOnVerticalDrag:!1,mainClass:"pswp--template",arrowKeys:!1,preloaderDelay:1e3,pswpModule:()=>import("./photoswipe.esm-SYAMA2OP.js"),...n});return e.addFilter("isContentZoomable",()=>!1),e.addFilter("preventPointerEvent",()=>!0),e.on("firstUpdate",a=>{d(),r()?.addEventListener("wheel",o=>{o.stopImmediatePropagation(),o.stopPropagation()},{passive:!0})}),e.on("destroy",()=>{m({type:"template",action:"close"})}),e.on("contentLoad",async a=>{let{content:t}=a,o=t?.data?.element,l=o?.querySelector("template");!o||!l||(t.state="loading",a.preventDefault(),t.element=w(l,g),t.onLoaded())}),e.init(),e}var f=h();c("template",()=>{f.init()});window.neosPhotoSwipe=window.neosPhotoSwipe||{};window.neosPhotoSwipe.template={init:h,lightbox:f};
/*! For license information please see Template.js.LEGAL.txt */
//# sourceMappingURL=Template.js.map
