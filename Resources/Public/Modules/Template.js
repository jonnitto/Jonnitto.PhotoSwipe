import{a as p}from"./chunk-P7HNF4BQ.js";import{a,b as r,c as d,d as m,e as w,f as c}from"./chunk-Y32VTBQC.js";var i={...a("photoswipeI18n"),...a("photoswipeTemplateOptions")},g=i.wrappingClass||"jonnitto-photoswipe-content";delete i.wrappingClass;function h(o={}){o={...i,...o};let e=new p({preloadFirstSlide:!1,allowPanToNext:!1,initialZoomLevel:1,secondaryZoomLevel:1,maxZoomLevel:1,wheelToZoom:!1,closeOnVerticalDrag:!1,mainClass:"pswp--template",arrowKeys:!1,preloaderDelay:1e3,pswpModule:()=>import("./photoswipe.esm-UIMGLIZI.js"),...o});return e.addFilter("isContentZoomable",()=>!1),e.addFilter("preventPointerEvent",()=>!0),e.on("firstUpdate",()=>{d(),r()?.addEventListener("wheel",t=>{t.stopImmediatePropagation(),t.stopPropagation()},{passive:!0})}),e.on("destroy",()=>{m({type:"template",action:"close"})}),e.on("contentLoad",async n=>{let{content:t}=n,s=t?.data?.element,l=s?.querySelector("template");!s||!l||(t.state="loading",n.preventDefault(),t.element=w(l,g),t.onLoaded())}),e.init(),e}var f=h();c("template",()=>{f.init()});window.neosPhotoSwipe=window.neosPhotoSwipe||{};window.neosPhotoSwipe.template={init:h,lightbox:f};
/*! For license information please see Template.js.LEGAL.txt */
//# sourceMappingURL=Template.js.map
