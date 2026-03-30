import{a as j,_ as J}from"./AppLayout.vue_vue_type_script_setup_true_lang-DN-nJQwu.js";import{d as W,r as b,p as X,o as r,c as d,a,u as e,m as Y,w as l,b as t,e as p,t as i,g as u,F as _,i as N,n as I,j as Z}from"./app-Bv-R6Y4G.js";import{_ as V,a as B,b as m,c,d as Q,e as o}from"./TableHeader.vue_vue_type_script_setup_true_lang-MgEHB0F_.js";import{S as ee,_ as te}from"./Pagination.vue_vue_type_script_setup_true_lang-DknY9tnh.js";import{_ as ae}from"./Skeleton.vue_vue_type_script_setup_true_lang-BAwoUnzE.js";import{_ as U}from"./SkeletonCard.vue_vue_type_script_setup_true_lang-t2iD4WTQ.js";import{_ as R}from"./index-_yk73Dk1.js";import{_ as se}from"./Input.vue_vue_type_script_setup_true_lang-CqFhnUJI.js";import{u as le,a as ne,C as T}from"./Skeleton.vue_vue_type_script_setup_true_lang-Bgb0jNSI.js";import{F as E}from"./NavFooter.vue_vue_type_script_setup_true_lang-TTrFyIrU.js";import{L as re}from"./loader-circle-BILUNLND.js";import{F as ie}from"./file-pen-line-BWx-8QuT.js";import{C as M}from"./circle-check-big-Dq_pZD2F.js";import{E as oe}from"./eye-DxWxZDE_.js";import"./AppLogoIcon.vue_vue_type_script_setup_true_lang-D9sDZqL2.js";const ue={class:"space-y-6 p-4"},de={class:"flex w-full items-center justify-between"},ce={key:0},fe={key:1},pe={class:"text-md flex items-center font-bold"},me={class:"flex w-full items-center gap-2 sm:w-auto"},_e={class:"flex items-center justify-center text-center text-red-500"},ge={class:"flex items-center space-x-3"},xe={class:"font-medium"},ve={class:"flex flex-wrap items-center justify-between gap-4"},ye={class:"text-md flex items-center font-bold"},he={class:"rounded-md p-4"},ke={class:"flex flex-col gap-4"},we={class:"flex items-center gap-2"},be=["src"],Se={class:"text-[13px] font-medium"},De={class:"text-[11px] text-gray-500"},Pe={class:"flex flex-col"},$e={class:"text-wrap"},Ce={class:"flex flex-col gap-2 text-wrap"},Fe={class:"text-[12px] font-medium"},Le={class:"text-[11px] text-gray-500"},Ne={class:"flex flex-col gap-4"},Re={class:"flex items-center gap-2"},Te={class:"flex items-center gap-1 text-[12px]"},qe={class:"flex items-center gap-2"},Ae={key:3,class:"text-gray-400 uppercase"},je={class:"flex items-center gap-2"},Ie={class:"flex items-center gap-1 text-[12px]"},Ve={class:"flex items-center justify-center gap-1"},Be=["href"];function z(h){const g=new Date(h),S=g.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),P=g.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:!0});return`${S} | ${P}`}function q(h){return`${new Date(h).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"})}`}const st=W({__name:"Files",props:{id:{}},setup(h){const g=h,S=le(),P=[{title:"Files",href:"/admin/files/"+g.id}],x=b(1),$=b([]),C=b(""),D=b({currentPage:1,lastPage:1,hasMorePages:!1}),K=async()=>(await Z.post("/public/graphql",{query:`
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
  `,variables:{id:g.id,page:x.value,first:20,search:C.value}})).data.data,{data:v,isPending:Qe,isFetching:F,isLoading:Ue}=ne({queryKey:["userfetchFiles",x],queryFn:K});X(()=>{var y,s;(s=(y=v.value)==null?void 0:y.userfiles)!=null&&s.filesListPaginated&&($.value=v.value.userfiles.filesListPaginated.data,D.value=v.value.userfiles.filesListPaginated.paginatorInfo)});const k=b(!1),O=()=>{k.value||(k.value=!0,setTimeout(()=>{S.invalidateQueries({queryKey:["userfetchFiles"]}),k.value=!1},2e3))},G=()=>{x.value<D.value.lastPage&&x.value++},H=()=>{x.value>1&&x.value--};return(y,s)=>(r(),d(_,null,[a(e(Y),{title:"Files"}),a(J,{breadcrumbs:P},{default:l(()=>{var A;return[t("div",ue,[t("div",de,[e(F)?(r(),d("div",ce,[a(U)])):(r(),d("div",fe,[t("h6",pe,[a(e(E),{class:"mr-2 h-8 w-8 flex-shrink-0 rounded-full border p-1 text-blue-500",fill:"currentColor"}),p(" "+i((A=e(v))==null?void 0:A.userfiles.categoryName.category),1)])]))]),t("div",me,[a(e(se),{modelValue:C.value,"onUpdate:modelValue":s[0]||(s[0]=n=>C.value=n),placeholder:"Search...",class:"w-full text-sm sm:w-72"},null,8,["modelValue"]),a(e(R),{onClick:O,disabled:k.value,class:"flex items-center gap-1 text-sm"},{default:l(()=>[k.value?(r(),u(e(re),{key:0,class:"h-4 w-4 animate-spin"})):(r(),u(e(ee),{key:1}))]),_:1},8,["disabled"])]),a(e(V),null,{default:l(()=>[a(e(B),null,{default:l(()=>[a(e(m),null,{default:l(()=>[a(e(c),{class:"w-[50px]"},{default:l(()=>s[1]||(s[1]=[t("small",null,"#",-1)])),_:1}),a(e(c),{class:"w-[300px]"},{default:l(()=>s[2]||(s[2]=[t("small",null,"Category",-1)])),_:1}),a(e(c),null,{default:l(()=>s[3]||(s[3]=[t("small",null,"No. of Files",-1)])),_:1}),a(e(c),null,{default:l(()=>s[4]||(s[4]=[t("small",null,"Creation Date",-1)])),_:1})]),_:1})]),_:1}),a(e(Q),null,{default:l(()=>{var n,w;return[e(F)?(r(),u(e(m),{key:0},{default:l(()=>[a(e(o),{colspan:"10",class:"text-center"},{default:l(()=>[a(ae)]),_:1})]),_:1})):((n=e(v))==null?void 0:n.userfiles.subCategoriesList.length)===0?(r(),u(e(m),{key:1},{default:l(()=>[a(e(o),{colspan:"5"},{default:l(()=>[t("small",_e,[a(e(T),{class:"mr-2 w-5"}),s[5]||(s[5]=p(" No Data Found "))])]),_:1})]),_:1})):(r(!0),d(_,{key:2},N((w=e(v))==null?void 0:w.userfiles.subCategoriesList,(f,L)=>(r(),u(e(m),{key:f.id},{default:l(()=>[a(e(o),null,{default:l(()=>[t("small",null,i(L+1),1)]),_:2},1024),a(e(o),{class:"w-[300px] pr-20"},{default:l(()=>[a(j,{href:y.route("user.files",{id:f.encrypted_id}),prefetch:""},{default:l(()=>[t("div",ge,[t("div",null,[a(e(E),{class:"h-8 w-8 flex-shrink-0 rounded-full border p-1 text-blue-500",fill:"currentColor"})]),t("div",null,[t("div",xe,i(f.category),1)])])]),_:2},1032,["href"])]),_:2},1024),a(e(o),null,{default:l(()=>[p(i(f.totalFiles),1)]),_:2},1024),a(e(o),null,{default:l(()=>[t("small",null,i(z(f.created_at)),1)]),_:2},1024)]),_:2},1024))),128))]}),_:1})]),_:1}),t("div",ve,[t("h6",ye,[a(e(ie),{class:"mr-2 h-8 w-8 flex-shrink-0 rounded-full border p-1 text-green-500"}),s[6]||(s[6]=p(" Files "))])]),t("div",he,[a(e(V),null,{default:l(()=>[a(e(B),{class:"bg-gray-50"},{default:l(()=>[a(e(m),null,{default:l(()=>[a(e(c),null,{default:l(()=>s[7]||(s[7]=[t("small",null,"#",-1)])),_:1}),a(e(c),null,{default:l(()=>s[8]||(s[8]=[t("small",null,"Author & Title",-1)])),_:1}),a(e(c),null,{default:l(()=>s[9]||(s[9]=[t("small",null,"Co-Authors",-1)])),_:1}),a(e(c),null,{default:l(()=>s[10]||(s[10]=[t("small",null,"Status",-1)])),_:1}),a(e(c),null,{default:l(()=>s[11]||(s[11]=[t("small",null,"Updated",-1)])),_:1}),a(e(c),{class:"text-center"},{default:l(()=>s[12]||(s[12]=[t("small",null,"Actions",-1)])),_:1})]),_:1})]),_:1}),a(e(Q),null,{default:l(()=>[e(F)?(r(),u(e(m),{key:0},{default:l(()=>[a(e(o),{colspan:9},{default:l(()=>[a(U)]),_:1})]),_:1})):$.value.length===0?(r(),u(e(m),{key:1},{default:l(()=>[a(e(o),{colspan:9,class:"py-16 text-center text-gray-500"},{default:l(()=>s[13]||(s[13]=[p(" No data found. ")])),_:1})]),_:1})):(r(!0),d(_,{key:2},N($.value,(n,w)=>(r(),u(e(m),{key:w},{default:l(()=>[a(e(o),null,{default:l(()=>[p(i(w+1),1)]),_:2},1024),a(e(o),{class:"max-w-[200px] text-[13px]"},{default:l(()=>[t("div",ke,[t("div",we,[t("img",{draggable:"false",src:"/storage/profile/"+n.author.photo,class:"h-8 w-8 shrink-0 rounded-full object-cover"},null,8,be),t("div",null,[t("p",Se,i(n.author.name),1),t("p",De,i(n.author.position),1)])]),t("div",Pe,[s[14]||(s[14]=t("small",{class:"uppercase"},"Ordinance No. :",-1)),t("b",null,i(n.ordinanceNumber??"-"),1)]),t("p",$e,i(n.finalTitle??n.title),1)])]),_:2},1024),a(e(o),null,{default:l(()=>[t("div",Ce,[(r(!0),d(_,null,N(n.coAuthors,(f,L)=>(r(),d("div",{key:L,class:"flex items-center gap-2"},[s[15]||(s[15]=t("span",{class:"h-2 w-2 shrink-0 rounded-full bg-sky-500"},null,-1)),t("div",null,[t("p",Fe,i(f.official.name),1),t("p",Le,i(f.official.position),1)])]))),128))])]),_:2},1024),a(e(o),null,{default:l(()=>[t("div",Ne,[t("div",Re,[s[16]||(s[16]=t("small",null,"Municipal: ",-1)),t("div",Te,[n.municipalStatus==1?(r(),u(e(T),{key:0,class:"h-4 w-4 shrink-0 text-red-500"})):(r(),u(e(M),{key:1,class:"h-4 w-4 shrink-0 text-green-500"})),t("span",{class:I(n.municipalStatus==1?"text-red-500":"text-green-500")},i(n.municipalStatus==1?"Draft":"Approved"),3)])]),t("div",qe,[n.thirdReadingDate?(r(),d(_,{key:0},[s[17]||(s[17]=t("small",{class:"uppercase"},"3rd Reading:",-1)),t("p",null,i(q(n.thirdReadingDate)),1)],64)):n.secondReadingDate?(r(),d(_,{key:1},[s[18]||(s[18]=t("small",{class:"uppercase"},"2nd Reading:",-1)),t("p",null,i(q(n.secondReadingDate)),1)],64)):n.firstReadingDate?(r(),d(_,{key:2},[s[19]||(s[19]=t("small",{class:"uppercase"},"1st Reading:",-1)),t("p",null,i(q(n.firstReadingDate)),1)],64)):(r(),d("small",Ae,"No reading yet"))]),t("div",je,[s[20]||(s[20]=t("small",null,"Provincial: ",-1)),t("div",Ie,[n.provincialStatus==null||n.provincialStatus==1?(r(),u(e(T),{key:0,class:"h-4 w-4 shrink-0 text-red-500"})):(r(),u(e(M),{key:1,class:"h-4 w-4 shrink-0 text-green-500"})),t("span",{class:I([n.provincialStatus==1?"text-red-500":n.provincialStatus==2?"text-green-500":"text-gray-500"])},i(n.provincialStatus==1?"Disapproved":n.provincialStatus==2?"Approved":"No Status"),3)])])])]),_:2},1024),a(e(o),{class:"text-[12px] text-gray-500"},{default:l(()=>[p(i(z(n.updated_at)),1)]),_:2},1024),a(e(o),null,{default:l(()=>[t("div",Ve,[a(j,{href:y.route("user.view-file",{id:n.encrypted_id}),prefetch:""},{default:l(()=>[a(e(R),{variant:"secondary",size:"sm"},{default:l(()=>[a(e(oe),{class:"h-4 w-4"})]),_:1})]),_:2},1032,["href"]),t("a",{href:"/storage/files/"+n.file,target:"_blank",rel:"noopener noreferrer"},[a(e(R),{size:"sm",variant:"link",class:"text-[12px]"},{default:l(()=>s[21]||(s[21]=[p(" PDF ")])),_:1})],8,Be)])]),_:2},1024)]),_:2},1024))),128))]),_:1})]),_:1}),a(te,{"current-page":D.value.currentPage,"last-page":D.value.lastPage,onNext:G,onPrevious:H},null,8,["current-page","last-page"])])])]}),_:1})],64))}});export{st as default};
