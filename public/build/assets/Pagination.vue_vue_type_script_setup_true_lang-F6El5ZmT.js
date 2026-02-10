import{c as r,_ as n}from"./index-BLjU3uQG.js";import{d as m,o as p,c as u,a,u as s,w as i,b as f,t as c}from"./app-DdL1Hlyz.js";/**
 * @license lucide-vue-next v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=r("ArrowLeftIcon",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-vue-next v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=r("ArrowRightIcon",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-vue-next v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=r("SearchIcon",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]),k={class:"flex justify-between items-center mt-8"},w=m({__name:"Pagination",props:{currentPage:{},lastPage:{}},emits:["previous","next"],setup(l,{emit:y}){const e=l;return(o,t)=>(p(),u("div",k,[a(s(n),{disabled:e.currentPage<=1,onClick:t[0]||(t[0]=d=>o.$emit("previous")),class:"cursor-pointer"},{default:i(()=>[a(s(g))]),_:1},8,["disabled"]),f("small",null,"Pages "+c(e.currentPage)+" of "+c(e.lastPage),1),a(s(n),{disabled:e.currentPage>=e.lastPage,onClick:t[1]||(t[1]=d=>o.$emit("next")),class:"cursor-pointer"},{default:i(()=>[a(s(h))]),_:1},8,["disabled"])]))}});export{x as S,w as _};
