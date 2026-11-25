// Staged adapter. Test-only authentication adapter.
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

export const getInvitations=token=>request('/rest/v1/invitations?select=id,classroom_id,expires_at,max_uses,uses,revoked',{token});
export const revokeInvitation=(token,iid)=>rpc(token,'revoke_invitation',{iid});

// Test account onboarding; public signup remains disabled in the interface.
export const getOwnProfile=async(token,id)=>(await request('/rest/v1/profiles?select=user_id,display_name,username,avatar&user_id=eq.'+encodeURIComponent(id),{token}))[0];
export const getOwnMembership=async(token,id)=>(await request('/rest/v1/memberships?select=user_id,role,status,classroom_id&user_id=eq.'+encodeURIComponent(id),{token}))[0];
export const recoverPassword=email=>request('/auth/v1/recover',{method:'POST',body:{email}});

// OAuth PKCE test flow: verifier is temporary, tokens remain in memory.
export async function startGoogleLogin(){
 const bytes=crypto.getRandomValues(new Uint8Array(32));
 const encode=b=>btoa(String.fromCharCode(...b)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 const verifier=encode(bytes);
 const challenge=encode(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier))));
 sessionStorage.setItem('afterclass_pkce',verifier);
 const params=new URLSearchParams({provider:'google',redirect_to:location.origin+'/',code_challenge:challenge,code_challenge_method:'s256'});
 location.assign(base+'/auth/v1/authorize?'+params);
}
export async function finishGoogleLogin(code){
 const verifier=sessionStorage.getItem('afterclass_pkce');
 sessionStorage.removeItem('afterclass_pkce');
 if(!verifier)throw Error('Sessão de teste expirada. Inicie novamente.');
 return request('/auth/v1/token?grant_type=pkce',{method:'POST',body:{auth_code:code,code_verifier:verifier}});
}

export const saveAvatar=(token,id,avatar)=>request('/rest/v1/profiles?user_id=eq.'+encodeURIComponent(id),{token,method:'PATCH',body:{avatar}});
export const refreshSession=refresh_token=>request('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:{refresh_token}});
export const getPreferences=async(token,id)=>(await request('/rest/v1/user_preferences?select=language,theme&user_id=eq.'+encodeURIComponent(id),{token}))[0];
export const savePreferences=(token,id,preferences)=>request('/rest/v1/user_preferences?user_id=eq.'+encodeURIComponent(id),{token,method:'PATCH',body:preferences});
