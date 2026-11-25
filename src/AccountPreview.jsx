import React,{useState,useEffect} from 'react';
import AdminTest from './AdminTest.jsx';
import StudentTest from './StudentTest.jsx';
import './account.css';
export default function AccountPreview({approved=false,lang='pt',themeMode,onAccount,onNavigate,onLanguage,onTheme}){
 const [admin,A]=useState(false);const tr=(pt,en)=>lang==='en'?en:pt;
 useEffect(()=>{if(approved)A(false)},[approved]);
 return <section className={'account-shell'+(!approved?' entry-shell':'')}>
 <div className="entry-top" hidden={approved}><div className="entry-brand">afterclass<span>.</span></div><div className="header-controls"><button onClick={onLanguage} aria-label="Português / English">{lang.toUpperCase()}</button><button onClick={onTheme} aria-label={tr('Alternar tema','Change theme')}>{themeMode==='system'?'◐':themeMode==='dark'?'☾':'☀'}</button></div></div>
 <header className="account-banner" hidden={!approved}><span className="account-eyebrow">YOUR AFTER CLASS</span><h1>{tr('Meu perfil','My profile')}</h1><p>{tr('Seu espaço, seu ritmo, seu inglês.','Your space, your pace, your English.')}</p></header>
 <div className={'account-layout'+(!approved?' entry-layout':'')}>
 <div className="entry-visual" hidden={approved}><span className="entry-kicker">ENGLISH BEYOND THE CLASSROOM</span><h1>{tr('O inglês continua depois da aula.','English continues after class.')}</h1><p>{tr('Pratique no seu ritmo, descubra novas palavras e faça parte da sua comunidade de aprendizagem.','Practice at your own pace, discover new words and join your learning community.')}</p><div className="entry-art" aria-hidden="true"><span>Aa</span><span>Hello!</span><span>✦</span></div><div className="entry-tags"><span>Practice</span><span>Learn</span><span>Connect</span></div></div>
 <aside className="account-side" hidden={!approved}><span className="account-avatar" aria-hidden="true">AC</span><h2>{tr('Meu espaço','My space')}</h2><p>{tr('Gerencie seu acesso à comunidade.','Manage your community access.')}</p><button aria-pressed={!admin} onClick={()=>A(false)}>{tr('Minha conta','My account')}</button><small>{tr('Ambiente de validação','Test environment')}</small></aside>
 <div className="account-content entry-content"><div hidden={admin}><StudentTest lang={lang} themeMode={themeMode} onAccount={onAccount} onNavigate={onNavigate}/></div>{admin&&<><button className="entry-back" onClick={()=>A(false)}>{tr('← Voltar ao login','← Back to sign in')}</button><AdminTest lang={lang}/></>}</div>
 </div>
 <footer className="entry-footer" hidden={approved}><span>{tr('Ambiente de teste · Acesso por convite','Test environment · Invitation only')}</span>{!admin&&<button onClick={()=>A(true)}>{tr('Acesso administrativo de teste','Test administrator access')}</button>}</footer>
 </section>
}
