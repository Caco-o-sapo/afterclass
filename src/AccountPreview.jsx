import React,{useState} from 'react';
import AdminTest from './AdminTest.jsx';
import StudentTest from './StudentTest.jsx';
import './account.css';
export default function AccountPreview({lang='pt',themeMode,onAccount,onNavigate}){
 const [admin,A]=useState(false);const tr=(pt,en)=>lang==='en'?en:pt;
 return <section className="account-shell"><header className="account-banner"><span className="account-eyebrow">YOUR AFTER CLASS</span><h1>My account</h1><p>{tr('Seu espaço, seu ritmo, seu inglês.','Your space, your pace, your English.')}</p></header><div className="account-layout"><aside className="account-side"><span className="account-avatar" aria-hidden="true">AC</span><h2>{tr('Meu espaço','My space')}</h2><p>{tr('Gerencie seu acesso à comunidade.','Manage your community access.')}</p><button aria-pressed={!admin} onClick={()=>A(false)}>{tr('Minha conta','My account')}</button><button aria-pressed={admin} onClick={()=>A(true)}>{tr('Administração de teste','Test administration')}</button><small>{tr('Ambiente de validação · Use somente dados fictícios.','Test environment · Fictional data only.')}</small></aside><div className="account-content"><div hidden={admin}><StudentTest lang={lang} themeMode={themeMode} onAccount={onAccount} onNavigate={onNavigate}/></div>{admin&&<AdminTest lang={lang}/>}</div></div></section>
}
