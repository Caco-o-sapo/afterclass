import {useSyncExternalStore} from 'react';
import {BANK,resolveBook} from './practiceBank.js';
const KEY='afterclass_admin_demo_v1';
export const uid=()=>crypto.randomUUID();
export const bookFor=room=>resolveBook({label:room?.book});
export const lessonsFor=room=>BANK[bookFor(room)?.id]||[];
export function questionsFor(lesson){
 if(!lesson)return [];
 return [
 {id:uid(),type:'choice',prompt:lesson.choice[0],options:[...lesson.choice[1]],accepted:[lesson.choice[2]],points:2,explanation:lesson.choice[3]},
 {id:uid(),type:'gap',prompt:lesson.gap[0],accepted:[...lesson.gap[1]],points:2,explanation:lesson.gap[2]},
 {id:uid(),type:'order',prompt:'Put the words in the correct order: '+lesson.order.split(' ').reverse().join(' / '),accepted:[lesson.order],points:2,explanation:'Compare the sentence with the sample answer.'},
 {id:uid(),type:'open',prompt:lesson.prompt,accepted:[],points:4,explanation:lesson.model}
 ];
}
const base=()=>({rooms:[{id:'demo-room-1',name:'DEMO W4 Online',book:'W4',modality:'online',group:'adult',currentLesson:103},{id:'demo-room-2',name:'DEMO Teens 4',book:'T4',modality:'onsite',group:'teen',currentLesson:61}],students:[{id:'demo-student-1',name:'Aluno fictício 01',room:'demo-room-1',status:'pending'},{id:'demo-student-2',name:'Aluno fictício 02',room:'demo-room-2',status:'pending'},{id:'demo-student-3',name:'Aluno fictício 03',room:'demo-room-1',status:'approved'},{id:'demo-student-4',name:'Aluno fictício 04',room:'demo-room-2',status:'approved'}],invites:[]});
export function seedDemo(){
 const d=base();return migrate(d);
}
function migrate(d){
 const rooms=d.rooms.map(r=>({...r,currentLesson:r.currentLesson??(r.book==='W4'?103:lessonsFor(r)[0]?.number??null)}));
 const w4=rooms.find(r=>r.id==='demo-room-1'&&bookFor(r)?.id==='w4');
 const sample=w4&&BANK.w4.find(l=>l.number===103);
 const assignments=Array.isArray(d.assignments)?d.assignments:sample?[{id:'demo-assignment-103',roomId:w4.id,lesson:103,title:'Lesson 103 · Restaurant challenge',instructions:'Complete the questions in English.',due:'',status:'published',questions:questionsFor(sample),createdAt:new Date().toISOString()}]:[];
 return {...d,rooms,assignments,submissions:Array.isArray(d.submissions)?d.submissions:[],announcements:Array.isArray(d.announcements)?d.announcements:[]};
}
function load(){try{const d=JSON.parse(sessionStorage.getItem(KEY)||'null');if(d&&Array.isArray(d.rooms)&&Array.isArray(d.students)&&Array.isArray(d.invites))return migrate(d)}catch{}return seedDemo()}
let state;const listeners=new Set();
const snapshot=()=>state||(state=load());
const subscribe=fn=>{listeners.add(fn);return()=>listeners.delete(fn)};
export function updateDemo(next){const current=snapshot();const updated=typeof next==='function'?next(current):next;sessionStorage.setItem(KEY,JSON.stringify(updated));state=updated;listeners.forEach(fn=>fn());return updated}
export function useDemo(){return [useSyncExternalStore(subscribe,snapshot,snapshot),updateDemo]}
export const totalPoints=a=>a.questions.reduce((n,q)=>n+q.points,0);
export const scoreOf=s=>Object.values(s.grades||{}).reduce((n,g)=>n+g.points,0);
export const pendingReview=(a,s)=>a.questions.some(q=>q.type==='open'&&!Object.hasOwn(s.grades||{},q.id));
const norm=s=>String(s??'').trim().toLowerCase().replace(/[’‘]/g,"'").replace(/[.!?]+$/,'').replace(/\s+/g,' ');
export function submitDemo(assignmentId,studentId,answers){
 let error='';
 updateDemo(d=>{
  const a=d.assignments.find(x=>x.id===assignmentId&&x.status==='published'),s=d.students.find(x=>x.id===studentId&&x.status==='approved');
  if(!a||!s||s.room!==a.roomId){error='Atividade indisponível.';return d}
  if(d.submissions.some(x=>x.assignmentId===a.id&&x.studentId===s.id)){error='Esta atividade já foi entregue.';return d}
  if(a.questions.some(q=>!String(answers[q.id]??'').trim())){error='Responda todas as questões.';return d}
  const clean=Object.fromEntries(a.questions.map(q=>[q.id,String(answers[q.id]).trim().slice(0,1500)]));
  const grades={};for(const q of a.questions)if(q.type!=='open'){const correct=q.accepted.some(v=>norm(v)===norm(clean[q.id]));grades[q.id]={points:correct?q.points:0,feedback:correct?'Correct!':q.explanation||'Check the sample answer.'}}
  return {...d,submissions:[...d.submissions,{id:uid(),assignmentId:a.id,studentId:s.id,roomId:s.room,answers:clean,grades,submittedAt:new Date().toISOString()}]};
 });return error;
}
export function gradeDemo(subId,questionId,points,feedback){
 let ok=false;
 updateDemo(d=>{const s=d.submissions.find(x=>x.id===subId),a=d.assignments.find(x=>x.id===s?.assignmentId),q=a?.questions.find(x=>x.id===questionId&&x.type==='open');if(!q||!Number.isFinite(points)||points<0||points>q.points)return d;ok=true;return {...d,submissions:d.submissions.map(x=>x.id===subId?{...x,grades:{...x.grades,[q.id]:{points,feedback:String(feedback||'').slice(0,1000)}}}:x)}});return ok;
}
