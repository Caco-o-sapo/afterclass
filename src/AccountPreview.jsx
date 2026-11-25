import React,{useState} from 'react';
import AdminTest from './AdminTest.jsx';
import StudentTest from './StudentTest.jsx';
import './account.css';
export default function AccountPreview(){
 const [admin,A]=useState(false);
 return <section className="account-shell"><header className="account-banner"><span className="account-eyebrow">YOUR AFTER CLASS</span><h1>My account</h1><p>Seu espaço, seu ritmo, seu inglês.</p></header><div className="account-layout"><aside className="account-side"><span className="account-avatar" aria-hidden="true">AC</span><h2>Meu espaço</h2><p>Gerencie seu acesso à comunidade.</p><button aria-pressed={!admin} onClick={()=>A(false)}>Minha conta</button><button aria-pressed={admin} onClick={()=>A(true)}>Administração de teste</button><small>Ambiente de validação · Use somente dados fictícios.</small></aside><div className="account-content">{admin?<AdminTest/>:<StudentTest/>}</div></div></section>
}
