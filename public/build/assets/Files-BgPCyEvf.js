import{a as I,_ as H}from"./AppLayout.vue_vue_type_script_setup_true_lang-DWCRSrts.js";import{d as J,r as h,p as W,o as n,c as o,a as t,u as e,m as X,w as a,b as s,e as d,t as r,g as m,F as v,i as w,h as Z,n as A,j as ee}from"./app-DdL1Hlyz.js";import{_ as T,d as B,a as O,c as Q,b as te}from"./CardTitle.vue_vue_type_script_setup_true_lang-CxJ5f_Jf.js";import{_ as se,C as E,a as ae}from"./SkeletonBox.vue_vue_type_script_setup_true_lang-BmQ4BeTQ.js";import{_ as le,a as ie,b as $,c as S,d as ne,e as _,f as re}from"./Skeleton.vue_vue_type_script_setup_true_lang-D_NpvecW.js";import{_ as q}from"./index-BLjU3uQG.js";import{_ as oe}from"./Input.vue_vue_type_script_setup_true_lang-DXi3RWGr.js";import{u as de,a as ue,C as k}from"./Skeleton.vue_vue_type_script_setup_true_lang-CzRymHRU.js";import{_ as M,F as ce}from"./SkeletonCard.vue_vue_type_script_setup_true_lang-Blnz5ujJ.js";import{S as fe,_ as pe}from"./Pagination.vue_vue_type_script_setup_true_lang-F6El5ZmT.js";import{F as R}from"./NavFooter.vue_vue_type_script_setup_true_lang-B4biO6pK.js";import{L as me}from"./loader-circle-QN0r7j4p.js";import{F as _e}from"./file-pen-line-C-rNkbrN.js";import{E as ge}from"./eye-CmlsZ3-_.js";import"./AppLogoIcon.vue_vue_type_script_setup_true_lang-D0o2Nd9h.js";const xe={class:"p-4 space-y-6"},he={class:"flex w-full justify-between items-center"},ve={key:0},ye={key:1},be={class:"flex text-md font-bold items-center"},we={class:"flex items-center gap-2 w-full sm:w-auto"},$e={class:"text-center text-red-500 flex items-center justify-center"},Se={class:"flex items-center space-x-3"},ke={class:"font-medium"},Pe={class:"flex flex-wrap items-center justify-between gap-4"},Fe={class:"flex text-md font-bold items-center"},Ce={key:0,class:"grid grid-cols-1 gap-4"},De={class:"grid grid-cols-1 xl:grid-cols-3 gap-4"},Ne={class:"flex items-center space-x-4 rounded-md border p-4"},Le=["src"],Te={class:"flex-1 space-y-1"},qe={class:"text-sm font-medium leading-none"},je={class:"text-[13px] text-muted-foreground"},Ve={class:"text-[14px]"},Ie={class:"mb-4 grid grid-cols-[25px_minmax(0,1fr)] items-start pb-0 last:mb-0 last:pb-0"},Ae={class:"space-y-1"},Be={class:"text-sm font-medium leading-none"},Oe={class:"text-[12px] text-muted-foreground"},Qe={class:"text-gray-500 text-[13px] flex items-center gap-2"},Ee={key:0},Me={key:1},Re={class:"text-gray-500 text-[13px] flex items-center gap-2"},Ue={key:0},Ke={key:1},ze={class:"text-gray-500"},Ye=["href"];function U(P){const g=new Date(P),F=g.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),C=g.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!0});return`${F} | ${C}`}const ct=J({__name:"Files",props:{id:{}},setup(P){const g=P,F=de(),C=[{title:"Files",href:"/admin/files/"+g.id}],c=h(1),D=h([]),N=h(""),y=h({currentPage:1,lastPage:1,hasMorePages:!1}),K=async()=>(await ee.post("/public/graphql",{query:`
    query ($id: String!, $page: Int!, $first: Int!, $search: String) {
      userfiles(id: $id, page: $page, first: $first, search: $search) {
        categoryName {
          encrypted_id
          category
        }
        authors {
          encrypted_id
          name
        }
        filesListPaginated {
          data {
            encrypted_id
            municipalStatus
            provincialStatus
            title
            firstReadingDate
            secondReadingDate
            thirdReadingDate
            ordinanceNumber
            finalTitle
            enactmentDate
            lceapprovalDate
            transmittalDate
            spslapprovalDate
            postStatus
            publishStatus
            file
            updated_at
            author {
              encrypted_id
              name
              position
              photo
            }
            coAuthors {
              official {
                encrypted_id
                name
                position
              }
            }
          }
          paginatorInfo {
            currentPage
            lastPage
            total
            perPage
            hasMorePages
          }
        }
        subCategoriesList {
          encrypted_id
          category
          parentID
          created_at
          totalFiles
        }
      }
    }
  `,variables:{id:g.id,page:c.value,first:20,search:N.value}})).data.data,{data:f,isPending:Ge,isFetching:b,isLoading:He}=ue({queryKey:["userfetchFiles",c],queryFn:K});W(()=>{var p,l;(l=(p=f.value)==null?void 0:p.userfiles)!=null&&l.filesListPaginated&&(D.value=f.value.userfiles.filesListPaginated.data,y.value=f.value.userfiles.filesListPaginated.paginatorInfo)});const x=h(!1),z=()=>{x.value||(x.value=!0,setTimeout(()=>{F.invalidateQueries({queryKey:["userfetchFiles"]}),x.value=!1},2e3))},Y=()=>{c.value<y.value.lastPage&&c.value++},G=()=>{c.value>1&&c.value--};return(p,l)=>(n(),o(v,null,[t(e(X),{title:"Files"}),t(H,{breadcrumbs:C},{default:a(()=>{var j;return[s("div",xe,[s("div",he,[e(b)?(n(),o("div",ve,[t(M)])):(n(),o("div",ye,[s("h6",be,[t(e(R),{class:"h-8 w-8 mr-2 flex-shrink-0 rounded-full border p-1 text-blue-500",fill:"currentColor"}),d(" "+r((j=e(f))==null?void 0:j.userfiles.categoryName.category),1)])]))]),s("div",we,[t(e(oe),{modelValue:N.value,"onUpdate:modelValue":l[0]||(l[0]=i=>N.value=i),placeholder:"Search...",class:"w-full sm:w-72 text-sm"},null,8,["modelValue"]),t(e(q),{onClick:z,disabled:x.value,class:"text-sm flex items-center gap-1"},{default:a(()=>[x.value?(n(),m(e(me),{key:0,class:"h-4 w-4 animate-spin"})):(n(),m(e(fe),{key:1}))]),_:1},8,["disabled"])]),t(e(le),null,{default:a(()=>[t(e(ie),null,{default:a(()=>[t(e($),null,{default:a(()=>[t(e(S),{class:"w-[50px]"},{default:a(()=>l[1]||(l[1]=[s("small",null,"#",-1)])),_:1}),t(e(S),{class:"w-[300px]"},{default:a(()=>l[2]||(l[2]=[s("small",null,"Category",-1)])),_:1}),t(e(S),null,{default:a(()=>l[3]||(l[3]=[s("small",null,"No. of Files",-1)])),_:1}),t(e(S),null,{default:a(()=>l[4]||(l[4]=[s("small",null,"Creation Date",-1)])),_:1})]),_:1})]),_:1}),t(e(ne),null,{default:a(()=>{var i,L;return[e(b)?(n(),m(e($),{key:0},{default:a(()=>[t(e(_),{colspan:"10",class:"text-center"},{default:a(()=>[t(re)]),_:1})]),_:1})):((i=e(f))==null?void 0:i.userfiles.subCategoriesList.length)===0?(n(),m(e($),{key:1},{default:a(()=>[t(e(_),{colspan:"5"},{default:a(()=>[s("small",$e,[t(e(k),{class:"mr-2 w-5"}),l[5]||(l[5]=d(" No Data Found "))])]),_:1})]),_:1})):(n(!0),o(v,{key:2},w((L=e(f))==null?void 0:L.userfiles.subCategoriesList,(u,V)=>(n(),m(e($),{key:u.id},{default:a(()=>[t(e(_),null,{default:a(()=>[s("small",null,r(V+1),1)]),_:2},1024),t(e(_),{class:"w-[300px] pr-20"},{default:a(()=>[t(I,{href:p.route("user.files",{id:u.encrypted_id}),prefetch:""},{default:a(()=>[s("div",Se,[s("div",null,[t(e(R),{class:"h-8 w-8 flex-shrink-0 rounded-full border p-1 text-blue-500",fill:"currentColor"})]),s("div",null,[s("div",ke,r(u.category),1)])])]),_:2},1032,["href"])]),_:2},1024),t(e(_),null,{default:a(()=>[d(r(u.totalFiles),1)]),_:2},1024),t(e(_),null,{default:a(()=>[s("small",null,r(U(u.created_at)),1)]),_:2},1024)]),_:2},1024))),128))]}),_:1})]),_:1}),s("div",Pe,[s("h6",Fe,[t(e(_e),{class:"h-8 w-8 mr-2 flex-shrink-0 rounded-full border p-1 text-green-500"}),l[6]||(l[6]=d(" Files "))])]),D.value.length===0&&!e(b)?(n(),o("div",Ce,[t(e(T),{class:"shadow-none"},{default:a(()=>[t(e(B),{class:"text-red-500 flex items-center justify-center text-[12px] gap-2"},{default:a(()=>[t(e(k),{class:"w-5 h-auto"}),l[7]||(l[7]=d(" No Data Found "))]),_:1})]),_:1})])):Z("",!0),s("div",De,[e(b)?(n(),o(v,{key:0},w(3,i=>t(e(T),{class:"shadow-none"},{default:a(()=>[t(e(O),{class:"text-[14px]"},{default:a(()=>[t(M)]),_:1}),t(e(Q),{class:"grid gap-4"},{default:a(()=>[t(se)]),_:1})]),_:1})),64)):(n(!0),o(v,{key:1},w(D.value,(i,L)=>(n(),m(e(T),{class:"shadow-none flex flex-col h-full"},{default:a(()=>[t(e(O),{class:"text-[14px]"},{default:a(()=>[t(e(te),null,{default:a(()=>l[8]||(l[8]=[d("Ordinance Number")])),_:1}),t(e(B),null,{default:a(()=>[d(r(i.ordinanceNumber!=null?i.ordinanceNumber:"-"),1)]),_:2},1024),s("div",Ne,[s("img",{draggable:"false",src:"/storage/profile/"+i.author.photo,class:"w-10 h-10 rounded-full object-cover"},null,8,Le),s("div",Te,[s("p",qe,r(i.author.name),1),s("p",je,r(i.author.position),1)]),t(I,{href:p.route("user.view-file",{id:i.encrypted_id}),prefetch:""},{default:a(()=>[t(e(q),{variant:"link",class:"ml-0 cursor-pointer"},{default:a(()=>[t(e(ge))]),_:1})]),_:2},1032,["href"])])]),_:2},1024),t(e(Q),{class:"grid gap-4"},{default:a(()=>[s("div",null,[s("p",Ve,r(i.finalTitle==null?i.title:i.finalTitle),1)]),s("div",null,[l[10]||(l[10]=s("div",{class:"text-[14px] mb-4 font-bold text-blue-500"},"Co-Authors",-1)),(n(!0),o(v,null,w(i.coAuthors,(u,V)=>(n(),o("div",Ie,[l[9]||(l[9]=s("span",{class:"flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"},null,-1)),s("div",Ae,[s("p",Be,r(u.official.name),1),s("p",Oe,r(u.official.position),1)])]))),256))]),s("div",Qe,[i.municipalStatus==1?(n(),o("div",Ee,[t(e(k),{class:"w-5 h-5 text-red-500"})])):(n(),o("div",Me,[t(e(E),{class:"w-5 h-5 text-green-500"})])),l[11]||(l[11]=d(" Municipal Status: ")),s("span",{class:A(i.municipalStatus==1?"text-red-500":"text-green-500")},r(i.municipalStatus==1?"Draft Ordinance":"Approved Ordinance"),3)]),s("div",Re,[i.provincialStatus==null||i.provincialStatus==1?(n(),o("div",Ue,[t(e(k),{class:"w-5 h-5 text-red-500"})])):(n(),o("div",Ke,[t(e(E),{class:"w-5 h-5 text-green-500"})])),l[12]||(l[12]=d(" Provincial Status: ")),s("span",{class:A([i.provincialStatus==1?"text-red-500":i.provincialStatus==2?"text-green-500":"text-gray-500"])},r(i.provincialStatus==1?"Disapproved":i.provincialStatus==2?"Approved Ordinance":"No Status Yet"),3)]),s("small",ze,r(U(i.updated_at)),1)]),_:2},1024),t(e(ae),{class:"mt-auto"},{default:a(()=>[t(e(q),{class:"w-full text-[12px] cursor-pointer"},{default:a(()=>[s("a",{href:"/storage/files/"+i.file,class:"flex items-center gap-2",target:"_blank"},[t(e(ce)),l[13]||(l[13]=d(" Open PDF File "))],8,Ye)]),_:2},1024)]),_:2},1024)]),_:2},1024))),256))]),t(pe,{"current-page":y.value.currentPage,"last-page":y.value.lastPage,onNext:Y,onPrevious:G},null,8,["current-page","last-page"])])]}),_:1})],64))}});export{ct as default};
