'use strict';
const detailThemes=['green','blue','purple','amber','grey'];
const detailStyles=['default','playful','calm'];
const appearance=document.getElementById('appearance');
function preference(key,fallback,allowed){
    try {const value=localStorage.getItem(key);return allowed.includes(value)?value:fallback}
    catch {return fallback}
}
function applyDetailPreferences(){
    document.documentElement.dataset.theme=preference('depth-theme','green',detailThemes);
    document.documentElement.dataset.style=preference('depth-style','default',detailStyles);
    const dark=preference('depth-mode','light',['light','dark'])==='dark';
    document.documentElement.dataset.mode=dark?'dark':'light';
    appearance.setAttribute('aria-pressed',String(dark));
    appearance.textContent=dark?'Light mode':'Dark mode';
}
applyDetailPreferences();
appearance.addEventListener('click',()=>{
    const mode=document.documentElement.dataset.mode==='dark'?'light':'dark';
    try {localStorage.setItem('depth-mode',mode)} catch {}
    document.documentElement.dataset.mode=mode;
    appearance.setAttribute('aria-pressed',String(mode==='dark'));
    appearance.textContent=mode==='dark'?'Light mode':'Dark mode';
});
window.addEventListener('storage',event=>{
    if(['depth-theme','depth-style','depth-mode'].includes(event.key))applyDetailPreferences();
});
const employerProfile=window.DepthProfile?.employer;
const employerText=employerProfile?[employerProfile.email,employerProfile.company,...employerProfile.address,employerProfile.phone,employerProfile.website].join('\n'):'';
const contactText=[window.DepthProfile?.name,'Email: '+window.DepthProfile?.email,'LinkedIn: '+window.DepthProfile?.linkedin,employerText].filter(Boolean).join('\n');
function detailCopyText(id){
    if(id==='employer-all')return employerText;
    if(id==='all-details')return contactText;
    if(id==='employer-address')return employerProfile.address.join('\n');
    const element=document.getElementById(id);
    if(!element)throw new Error('Copy target unavailable');
    return element.dataset.copyValue||element.textContent.trim();
}
const manualDialog=document.createElement('dialog');
manualDialog.className='manual-copy-dialog';
manualDialog.setAttribute('aria-labelledby','manual-copy-title');
manualDialog.innerHTML='<h2 id="manual-copy-title">Copy text</h2><p>Clipboard access is unavailable. Select and copy the text below.</p><textarea aria-label="Text to copy" readonly rows="8"></textarea><button type="button" class="detail-copy">Close</button>';
document.body.append(manualDialog);
manualDialog.querySelector('button').onclick=()=>manualDialog.close();
let announcementTimer;
const copyTimers=new WeakMap();
document.querySelectorAll('[data-copy-target]').forEach(button=>{
    button.addEventListener('click',async()=>{
        const text=detailCopyText(button.dataset.copyTarget);
        button.disabled=true;
        const status=document.getElementById('details-copy-status');
        status.textContent='';
        clearTimeout(announcementTimer);
        clearTimeout(copyTimers.get(button));
        try {
            await navigator.clipboard.writeText(text);
            button.classList.add('copied');
            status.classList.add('copy-success-announcement');
            status.textContent='Copied!';
            announcementTimer=setTimeout(()=>status.textContent='',2000);
            copyTimers.set(button,setTimeout(()=>button.classList.remove('copied'),2000));
        } catch {
            const field=manualDialog.querySelector('textarea');
            field.value=text;
            manualDialog.showModal();
            field.focus();field.select();
        } finally {button.disabled=false}
    });
});
