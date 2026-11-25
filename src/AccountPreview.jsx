import React from 'react';
import AdminTest from './AdminTest.jsx';
import StudentTest from './StudentTest.jsx';
import './account.css';
export default function AccountPreview({approved=false,adminPortal=false,lang='pt',themeMode,onAccount,onNavigate,onLanguage,onTheme}){
 const tr=(pt,en)=>lang==='en'?en:pt;
 return <section className={'account-shell'+(!approved?' entry-shell':'')+(adminPortal?' admin-entry':'')}>
 <div className="entry-top" hidden={approved}><div className="entry-brand">afterclass<span>.</span>{adminPortal&&<small className="portal-badge">ADMIN</small>}</div><div className="header-controls"><button onClick={onLanguage} aria-label="Português / English">{lang.toUpperCase()}</button><button onClick={onTheme} aria-label={tr('Alternar tema','Change theme')}>{themeMode==='system'?'◐':themeMode==='dark'?'☾':'☀'}</button></div></div>
 <header className="account-banner" hidden={!approved}><span className="account-eyebrow">YOUR AFTER CLASS</span><h1>{tr('Meu perfil','My profile')}</h1><p>{tr('Seu espaço, seu ritmo, seu inglês.','Your space, your pace, your English.')}</p></header>
 <div className={'account-layout'+(!approved?' entry-layout':'')}>
 <div className="entry-visual" hidden={approved}>
 <span className="entry-kicker">{adminPortal?'AFTER CLASS · ADMINISTRATION':'ENGLISH BEYOND THE CLASSROOM'}</span>
 <h1>{adminPortal?tr('Seu espaço de gestão.','Your administration workspace.'):tr('O inglês continua depois da aula.','English continues after class.')}</h1>
 <p>{adminPortal?tr('Gerencie turmas, convites e aprovações em um ambiente reservado a administradores autorizados.','Manage classrooms, invitations and approvals in a workspace reserved for authorized administrators.'):tr('Pratique no seu ritmo, descubra novas palavras e faça parte da sua comunidade de aprendizagem.','Practice at your own pace, discover new words and join your learning community.')}</p>
 <div className="entry-art" aria-hidden="true">{(adminPortal?['▤','✓','◎']:['Aa','Hello!','✦']).map(x=><span key={x}>{x}</span>)}</div>
 <div className="entry-tags">{(adminPortal?[tr('Turmas','Classrooms'),tr('Convites','Invitations'),tr('Aprovações','Approvals')]:['Practice','Learn','Connect']).map(x=><span key={x}>{x}</span>)}</div>
 </div>
 <aside className="account-side" hidden={!approved}><span className="account-avatar" aria-hidden="true">AC</span><h2>{tr('Meu espaço','My space')}</h2><p>{tr('Gerencie seu acesso à comunidade.','Manage your community access.')}</p><button aria-pressed="true" onClick={()=>onNavigate('account')}>{tr('Minha conta','My account')}</button><small>{tr('Ambiente de validação','Test environment')}</small></aside>
 <div className="account-content entry-content">
 {!approved&&<nav className="portal-tabs" aria-label={tr('Tipo de acesso','Access type')}><a href="/" aria-current={!adminPortal?'page':undefined}>{tr('Aluno','Student')}</a><a href="/?portal=admin" aria-current={adminPortal?'page':undefined}>{tr('Administração','Administration')}</a></nav>}
 {adminPortal?<AdminTest lang={lang}/>:<StudentTest lang={lang} themeMode={themeMode} onAccount={onAccount} onNavigate={onNavigate}/>}
 </div>
 </div>
 <footer className="entry-footer" hidden={approved}><span>{adminPortal?tr('Acesso restrito · Somente testes autorizados','Restricted access · Authorized tests only'):tr('Ambiente de teste · Acesso por convite','Test environment · Invitation only')}</span><a href={adminPortal?'/':'/?portal=admin'}>{adminPortal?tr('Voltar ao acesso do aluno','Back to student access'):tr('Sou administrador','Administrator access')}</a></footer>
 </section>
}
