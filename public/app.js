'use strict';
const $=id=>document.getElementById(id);
let state;try{state=JSON.parse(localStorage.getItem('depth-study-v1'))}catch{}if(!state||typeof state!=='object')state={};state.done??={};let current=questions.find(q=>q.id===state.current)||questions[0],topic='All topics',query='',revealed=false;
function save(){state.current=current.id;try{localStorage.setItem('depth-study-v1',JSON.stringify(state))}catch{}}
function filtered(){return questions.filter(q=>(topic==='All topics'||q.topic===topic)&&`${q.title} ${q.answer} ${q.practice} ${q.followup}`.toLowerCase().includes(query))}
function node(tag,text,cls){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n}
function render(){if($('title').textContent!==current.title){$('copy-status').textContent='';$('copy-question').classList.remove('copied')}const list=filtered(),idx=list.findIndex(q=>q.id===current.id);$('topics').replaceChildren();['All topics',...topics].forEach(t=>{const b=node('button',t);b.append(node('span',t==='All topics'?questions.length:questions.filter(q=>q.topic===t).length));b.className=t===topic?'active':'';b.setAttribute('aria-pressed',t===topic);b.onclick=()=>{topic=t;const items=filtered();if(items.length)current=items[0];revealed=false;render()};$('topics').append(b)});$('empty').hidden=list.length>0;document.querySelector('.card').hidden=!list.length;document.querySelector('.navigation').hidden=!list.length;$('count').textContent=`${list.length} questions`;$('questionlist').replaceChildren();list.forEach(q=>{const b=node('button',undefined,q.id===current.id?'current':'');const number=node('span',String(q.id).padStart(2,'0'),'browse-number'),copy=node('span',undefined,'browse-copy');copy.append(node('span',q.title,'browse-title'),node('span',`${q.topic}${state.done[q.id]?' · Practiced ✓':''}`,'browse-topic'));b.append(number,copy);b.onclick=()=>go(q);$('questionlist').append(b)});$('topiclabel').textContent=current.topic;$('position').textContent=list.length?`${idx+1} of ${list.length} questions`:'';$('number').textContent=`Question ${String(current.id).padStart(2,'0')}`;$('title').textContent=current.title;$('mechanism').textContent=current.answer;$('tradeoffs').textContent=current.practice;$('scenario').textContent=current.scenario;$('followup').textContent=current.followup;const example=javaExamples[current.id];$('java-example').hidden=!example;if(example){$('example-title').textContent=example[0];$('example-code').textContent=example[1];$('example-explanation').textContent=example[2]}$('answer').hidden=!revealed;$('reveal').firstChild.textContent=revealed?'Hide answer ':'Reveal answer ';$('reveal').setAttribute('aria-expanded',revealed);$('practiced').checked=!!state.done[current.id];$('prev').disabled=idx<=0;$('next').disabled=idx===list.length-1;const n=questions.filter(q=>state.done[q.id]).length;$('progress').textContent=`${n} / ${questions.length}`;$('bar').style.width=`${n/questions.length*100}%`;save()}
function go(q){$('copy-status').textContent='';current=q;revealed=false;render();$('title').focus({preventScroll:true});document.querySelector('.cardtop').scrollIntoView({behavior:'instant',block:'start'});const card=document.querySelector('.card');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)card.animate([{opacity:.3,transform:'translateY(9px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'ease-out'})}
function step(n){const list=filtered(),i=list.findIndex(q=>q.id===current.id);if(list[i+n])go(list[i+n])}
function shuffle(){const list=filtered().filter(q=>q!==current);if(list.length)go(list[Math.floor(Math.random()*list.length)])}
$('reveal').onclick=()=>{revealed=!revealed;render()};$('practiced').onchange=()=>{state.done[current.id]=$('practiced').checked;render()};$('prev').onclick=()=>step(-1);$('next').onclick=()=>step(1);$('search').oninput=()=>{query=$('search').value.trim().toLowerCase();const list=filtered();if(list.length&&!list.includes(current))current=list[0];revealed=false;render()};$('random').onclick=$('finish').onclick=shuffle;
document.addEventListener('keydown',e=>{if(document.activeElement.closest('.java-example'))return;if(['INPUT','TEXTAREA','SELECT','BUTTON','SUMMARY'].includes(document.activeElement.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1);if(e.code==='Space'){e.preventDefault();$('reveal').click()}});
let touchStart=null;const card=document.querySelector('.card');card.addEventListener('touchstart',e=>{if(e.target.closest('pre')){touchStart=null;return}if(e.touches.length===1)touchStart={x:e.touches[0].clientX,y:e.touches[0].clientY}}, {passive:true});card.addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart.x,dy=e.changedTouches[0].clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.6)step(dx<0?1:-1)},{passive:true});card.addEventListener('touchcancel',()=>touchStart=null,{passive:true});
$('reset').onclick=()=>{if(confirm('Reset your practiced question markers?')){state={done:{}};render()}};$('export').textContent='Export practice progress';$('export').onclick=()=>{const blob=new Blob([JSON.stringify({exportedAt:new Date().toISOString(),...state},null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=node('a');a.href=url;a.download='depth-practice-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};
const sources=[['HashMap API','https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/HashMap.html'],['Virtual threads · JDK 25','https://docs.oracle.com/en/java/javase/25/core/virtual-threads.html'],['Spring transaction boundaries','https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html'],['Rollback rules','https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/rolling-back.html'],['Transaction propagation','https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/tx-propagation.html'],['Hibernate user guide','https://docs.hibernate.org/orm/7.1/userguide/html_single/'],['Spring Security CSRF','https://docs.spring.io/spring-security/reference/servlet/exploits/csrf.html'],['Boot graceful shutdown','https://docs.spring.io/spring-boot/reference/web/graceful-shutdown.html']];sources.forEach(([title,url])=>{const a=node('a',title);a.href=url;a.target='_blank';a.rel='noopener';$('sources').append(a)});render();
const themeOptions=['green','blue','purple','amber','grey'];
function setTheme(theme){if(!themeOptions.includes(theme))theme='green';document.documentElement.dataset.theme=theme;$('theme-value').textContent=theme[0].toUpperCase()+theme.slice(1);document.querySelectorAll('[data-palette]').forEach(option=>option.setAttribute('aria-checked',String(option.dataset.palette===theme)));try{localStorage.setItem('depth-theme',theme)}catch{}}
let savedTheme='green';try{savedTheme=localStorage.getItem('depth-theme')||'green'}catch{}setTheme(savedTheme);
function setMode(mode){const dark=mode==='dark';document.documentElement.dataset.mode=dark?'dark':'light';$('appearance').setAttribute('aria-pressed',String(dark));$('appearance').textContent=dark?'Light mode':'Dark mode';$('appearance').setAttribute('aria-label','Dark mode');try{localStorage.setItem('depth-mode',dark?'dark':'light')}catch{}}
let savedMode='light';try{savedMode=localStorage.getItem('depth-mode')||'light'}catch{}setMode(savedMode);$('appearance').addEventListener('click',()=>setMode(document.documentElement.dataset.mode==='dark'?'light':'dark'));

const themeTrigger=$('theme'),themeMenu=$('theme-menu'),paletteItems=Array.from(themeMenu.querySelectorAll('[data-palette]'));
function closePalette(restore=false){themeMenu.hidden=true;themeTrigger.setAttribute('aria-expanded','false');if(restore)themeTrigger.focus()}
function openPalette(index){themeMenu.hidden=false;themeTrigger.setAttribute('aria-expanded','true');const selected=paletteItems.findIndex(x=>x.getAttribute('aria-checked')==='true');paletteItems[index??Math.max(0,selected)].focus()}
themeTrigger.addEventListener('click',()=>themeMenu.hidden?openPalette():closePalette());
themeTrigger.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();openPalette(e.key==='ArrowUp'?paletteItems.length-1:undefined)}});
paletteItems.forEach(item=>item.addEventListener('click',()=>{setTheme(item.dataset.palette);closePalette(true)}));
themeMenu.addEventListener('keydown',e=>{const i=paletteItems.indexOf(document.activeElement);let target;if(e.key==='ArrowDown')target=(i+1)%paletteItems.length;if(e.key==='ArrowUp')target=(i+paletteItems.length-1)%paletteItems.length;if(e.key==='Home')target=0;if(e.key==='End')target=paletteItems.length-1;if(target!==undefined){e.preventDefault();e.stopPropagation();paletteItems[target].focus()}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closePalette(true)}else if(e.key==='Tab'){closePalette();themeTrigger.focus()}else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey){const match=paletteItems.find(x=>x.dataset.palette.startsWith(e.key.toLowerCase()));if(match){e.preventDefault();match.focus()}}});
document.addEventListener('pointerdown',e=>{if(!e.target.closest('.theme-picker'))closePalette()});document.querySelector('.theme-picker').addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget))closePalette()});
const styleNames={default:'Default',playful:'Playful',calm:'Calm'},styleTrigger=$('style'),styleMenu=$('style-menu'),styleItems=Array.from(styleMenu.querySelectorAll('[data-style-option]'));
function setStyle(style){if(!Object.hasOwn(styleNames,style))style='default';document.documentElement.dataset.style=style;$('style-value').textContent=styleNames[style];styleItems.forEach(item=>item.setAttribute('aria-checked',String(item.dataset.styleOption===style)));try{localStorage.setItem('depth-style',style)}catch{}}
let savedStyle='default';try{savedStyle=localStorage.getItem('depth-style')||'default'}catch{}setStyle(savedStyle);
function closeStyle(restore=false){styleMenu.hidden=true;styleTrigger.setAttribute('aria-expanded','false');if(restore)styleTrigger.focus()}
function openStyle(index){closePalette();styleMenu.hidden=false;styleTrigger.setAttribute('aria-expanded','true');styleItems[index??Math.max(0,styleItems.findIndex(x=>x.getAttribute('aria-checked')==='true'))].focus()}
styleTrigger.addEventListener('click',()=>styleMenu.hidden?openStyle():closeStyle());styleTrigger.addEventListener('keydown',e=>{if(['ArrowDown','ArrowUp'].includes(e.key)){e.preventDefault();openStyle(e.key==='ArrowUp'?styleItems.length-1:undefined)}});
styleItems.forEach(item=>item.addEventListener('click',()=>{setStyle(item.dataset.styleOption);closeStyle(true)}));
styleMenu.addEventListener('keydown',e=>{const i=styleItems.indexOf(document.activeElement);let target;if(e.key==='ArrowDown')target=(i+1)%styleItems.length;if(e.key==='ArrowUp')target=(i+styleItems.length-1)%styleItems.length;if(e.key==='Home')target=0;if(e.key==='End')target=styleItems.length-1;if(target!==undefined){e.preventDefault();e.stopPropagation();styleItems[target].focus()}else if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeStyle(true)}else if(e.key==='Tab'){closeStyle();styleTrigger.focus()}else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey){const match=styleItems.find(x=>x.textContent.trim().toLowerCase().startsWith(e.key.toLowerCase()));if(match){e.preventDefault();match.focus()}}});
themeTrigger.addEventListener('click',()=>closeStyle());document.addEventListener('pointerdown',e=>{if(!e.target.closest('.style-picker'))closeStyle()});document.querySelector('.style-picker').addEventListener('focusout',e=>{if(!e.currentTarget.contains(e.relatedTarget))closeStyle()});

let copyFeedbackTimer;
$('copy-question').addEventListener('click',async()=>{
    const question=current;
    const button=$('copy-question');
    button.disabled=true;
    clearTimeout(copyFeedbackTimer);
    $('copy-status').textContent='';
    $('copy-status').classList.remove('copy-success-announcement');
    try {
        await navigator.clipboard.writeText(question.title);
        if(current.id===question.id){
            $('copy-status').classList.add('copy-success-announcement');
            $('copy-status').textContent='Copied!';
            button.classList.add('copied');
        }
    } catch {
        if(current.id===question.id){
            const selection=window.getSelection();
            const range=document.createRange();
            range.selectNodeContents($('title'));
            selection.removeAllRanges();selection.addRange(range);
            $('copy-status').textContent='Copy unavailable. Question selected—use your device’s Copy command.';
        }
    } finally {
        button.disabled=false;
        copyFeedbackTimer=setTimeout(()=>{
            $('copy-status').textContent='';button.classList.remove('copied');
        },2000);
    }
});
