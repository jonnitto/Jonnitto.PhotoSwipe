var n=null;function s(){return n||(n=document.querySelector(".pswp"),n)}function u(e){let o=new CustomEvent("neosphotoswipe",{detail:e});document.dispatchEvent(o)}function l(e){return e instanceof Node}function p(e,o){let t=l(e)?e:null,c=null;!t&&typeof e=="string"&&(t=document.createElement("template"),t.innerHTML=e),t.tagName==="TEMPLATE"?c=t.content.cloneNode(!0):l(t)&&(c=t);let i=document.createElement("div");return i.classList.add(o),i.append(c),i}export{s as a,u as b,p as c};
/*! For license information please see chunk-34HCEVDD.js.LEGAL.txt */
//# sourceMappingURL=chunk-34HCEVDD.js.map
