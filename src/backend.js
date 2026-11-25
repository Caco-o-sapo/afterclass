// Staged adapter. No session persistence or public signup in this module.
const base='https://mcksvemxifqpdlctbclm.supabase.co';
const key='sb_publishable_RUOpZIVaJMQZY2wck6_s0w_CrdU1Onk';
async function request(path,{token,method='GET',body}={}){
 const response=await fetch(base+path,{method,headers:{apikey:key,...(token?{Authorization:'Bearer '+token}:{}),...(body!==undefined?{'Content-Type':'application/json'}:{})},...(body!==undefined?{body:JSON.stringify(body)}:{})});
 const data=await response.json().catch(()=>null);
 if(!response.ok)throw new Error('Não foi possível concluir a operação ('+response.status+').');
 return data;
}
export const signIn=(email,password)=>request('/auth/v1/token?grant_type=password',{method:'POST',body:{email,password}});
export const signOut=token=>request('/auth/v1/logout',{method:'POST',token});
export const getUser=token=>request('/auth/v1/user',{token});
export const getMembership=token=>request('/rest/v1/memberships?select=user_id,role,status,classroom_id',{token});
export const getBooks=token=>request('/rest/v1/books?select=id,label,experience',{token});
export const getClassrooms=token=>request('/rest/v1/classrooms?select=id,name,book_id,modality,community_group',{token});
export const rpc=(token,name,args)=>request('/rest/v1/rpc/'+name,{token,method:'POST',body:args});
export const createClassroom=(token,args)=>rpc(token,'create_classroom',args);
export const createInvitation=(token,args)=>rpc(token,'create_invitation',args);
export const approveStudents=(token,ids)=>rpc(token,'approve_students',{ids});
export const redeemInvitation=(token,args)=>rpc(token,'redeem_invitation',args);

export const getPrivateProfiles=token=>request('/rest/v1/private_profiles?select=user_id,real_name',{token});
export const getProfiles=token=>request('/rest/v1/profiles?select=user_id,display_name,username',{token});
