import React,{useState,useEffect,useRef} from 'react';
import {signIn,signOut,getUser,refreshSession} from './backend.js';
import AdminDemo from './AdminDemo.jsx';
import AdminTest from './AdminTest.jsx';

const SESSION_KEY='ac_admin_test_session_v1';
function readSession(){try{const s=JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null');return s?.access_token&&s?.refresh_token&&Number.isFinite(s?.expires_at)?s:null}catch{return null}}
function storeSession(s){const saved={access_token:s.access_token,refresh_token:s.refresh_token,expires_at:s.expires_at||Math.floor(Date.now()/1000)+(s.expires_in||3600)};sessionStorage.setItem(SESSION_KEY,JSON.stringify(saved));return saved}
export default function AdminPortal({lang,themeMode,onLanguage,onTheme,dark,onPreview,onRestorePreview}){
 const tr=(pt,en)=>lang==='en'?en:pt;
 const [session,S]=useState(null),[busy,B]=useState(true),[error,E]=useState(''),[authorized,A]=useState(false);
 const current=useRef(null),generation=useRef(0),flight=useRef(null);
 function clear(){generation.current++;current.current=null;sessionStorage.removeItem(SESSION_KEY);sessionStorage.removeItem('ac_admin_view');S(null);onPreview(false)}
 async function verify(s){const u=await getUser(s.access_token);if(!u?.id||!u.email_confirmed_at)throw Error(tr('Confirme o e-mail da conta de teste.','Confirm the test account email.'));return u}
 async function ensureSession(force=false){
  if(flight.current)return flight.current;
  const old=current.current||readSession();if(!old)throw Error('Session missing');
  const version=generation.current;
  const task=(async()=>{let s=old;if(s.expires_at<=Date.now()/1000+90){const next=await refreshSession(s.refresh_token);if(version!==generation.current)throw Error('Session closed');s=storeSession(next)}if(force||s!==old)await verify(s);if(version!==generation.current)throw Error('Session closed');current.current=s;S(s);return s})();
  flight.current=task;try{return await task}finally{if(flight.current===task)flight.current=null}
 }
 useEffect(()=>{let active=true;const saved=readSession();if(!saved){B(false);return}ensureSession(true).then(()=>{if(active)onRestorePreview?.()}).catch(()=>{if(active){clear();E(tr('Sua sessão expirou. Entre novamente.','Your session expired. Sign in again.'))}}).finally(()=>{if(active)B(false)});return()=>{active=false;generation.current++}},[]);
 async function enter(e){
  e.preventDefault();const f=new FormData(e.currentTarget);e.currentTarget.reset();B(true);E('');let s;
  try{s=await signIn(f.get('email'),f.get('password'));await verify(s);current.current=storeSession(s);S(current.current)}
  catch(err){if(s?.access_token)await signOut(s.access_token).catch(()=>{});clear();E(err.message)}finally{B(false)}
 }
 async function exit(){const s=current.current;clear();E('');if(s?.access_token)await signOut(s.access_token).catch(()=>{})}
 useEffect(()=>{if(!session)return;const check=()=>{if(document.visibilityState==='visible')ensureSession().catch(()=>{clear();E(tr('Sua sessão expirou. Entre novamente.','Your session expired. Sign in again.'))})};const timer=setInterval(check,30000);document.addEventListener('visibilitychange',check);return()=>{clearInterval(timer);document.removeEventListener('visibilitychange',check)}},[!!session,lang]);
 const controls=<div className="header-controls"><button onClick={onLanguage}>{lang.toUpperCase()}</button><button onClick={onTheme} aria-label={tr('Alternar tema','Change theme')}>{themeMode==='system'?'◐':dark?'☾':'☀'}</button></div>;
 if(busy&&!session)return <div className={'app auth-gate'+(dark?' dark':'')}><main><div className="content"><article role="status"><h2>{tr('Restaurando sessão…','Restoring session…')}</h2><p>{tr('Verificando sua conta de teste.','Checking your test account.')}</p></article></div></main></div>;
 if(session)return <div className={'app admin-workspace'+(dark?' dark':'')}><AdminDemo lang={lang} onExit={exit} controls={controls} onPreview={()=>onPreview(true)}/></div>;
 return <div className={'app auth-gate'+(dark?' dark':'')}><main><div className="content"><section className="account-shell entry-shell admin-entry">
 <div className="entry-top"><div className="entry-brand">afterclass<span>.</span><small className="portal-badge">ADMIN</small></div>{controls}</div>
 <div className="account-layout entry-layout"><div className="entry-visual"><span className="entry-kicker">AFTER CLASS · ADMINISTRATION</span><h1>{tr('Seu espaço de gestão.','Your administration workspace.')}</h1><p>{tr('Organize turmas, acompanhe convites e experimente o fluxo de aprovação em um ambiente de testes.','Organize classrooms, track invitations and explore approval workflows in a test environment.')}</p><div className="entry-art" aria-hidden="true"><span>▤</span><span>✓</span><span>◎</span></div><div className="entry-tags"><span>{tr('Turmas','Classrooms')}</span><span>{tr('Convites','Invitations')}</span><span>{tr('Aprovações','Approvals')}</span></div></div>
 <div className="account-content entry-content"><nav className="portal-tabs" aria-label={tr('Tipo de acesso','Access type')}><a href="/">{tr('Aluno','Student')}</a><a href="/?portal=admin" aria-current="page">{tr('Administração','Administration')}</a></nav>
 {authorized?<><button className="entry-back" onClick={()=>A(false)}>{tr('Voltar ao login de teste','Back to test sign in')}</button><AdminTest lang={lang}/></>:<article><h2>{tr('Entrar na administração de teste','Test administration sign in')}</h2><p>{tr('Utilize sua conta de teste existente para abrir o painel administrativo isolado.','Use your existing test account to open the isolated administration dashboard.')}</p><form onSubmit={enter}><label>{tr('E-mail','Email')}<input name="email" type="email" required autoComplete="username"/></label><label>{tr('Senha','Password')}<input name="password" type="password" required autoComplete="current-password"/></label><button className="primary" disabled={busy}>{busy?tr('Entrando…','Signing in…'):tr('Entrar no painel de teste','Sign in to test dashboard')}</button></form><p role="status">{error}</p><small>{tr('A autenticação é real; os dados e as operações do painel são fictícios.','Authentication is real; dashboard data and operations are fictional.')}</small></article>}
 </div></div><footer className="entry-footer"><a href="/">{tr('Voltar ao acesso do aluno','Back to student access')}</a>{!authorized&&<button onClick={()=>A(true)}>{tr('Acesso institucional autorizado','Authorized institutional access')}</button>}</footer></section></div></main></div>
}
