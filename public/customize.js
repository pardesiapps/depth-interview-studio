'use strict';
const profile=window.DepthProfile;
function setProfileText(id,value){const node=document.getElementById(id);if(node)node.textContent=value||''}
function safeProfileLink(value){try{const url=new URL(value,location.href);return ['https:','http:'].includes(url.protocol)?url.href:''}catch{return ''}}
if(profile){
 const title=document.querySelector('body:not(.details-page) .intro h1');if(title)title.textContent=profile.title;
 const level=document.querySelector('.level');if(level)level.textContent=profile.experienceLabel;
 setProfileText('personal-name',profile.name);
 const email=document.getElementById('personal-email');if(email){email.textContent=profile.email;email.href='mailto:'+profile.email}
 const linkedin=document.getElementById('personal-linkedin');if(linkedin){linkedin.href=safeProfileLink(profile.linkedin);linkedin.dataset.copyValue=linkedin.href;linkedin.textContent=profile.linkedin.replace(/^https?:\/\//,'')}
 const employer=profile.employer;
 if(employer){setProfileText('employer-email',employer.email);setProfileText('employer-company',employer.company);setProfileText('employer-address',employer.address.join('\n'));setProfileText('employer-phone',employer.phone);setProfileText('employer-website',employer.website);const emailLink=document.getElementById('employer-email');if(emailLink)emailLink.href='mailto:'+employer.email;const phone=document.getElementById('employer-phone');if(phone)phone.href='tel:'+employer.phone.replace(/[^+\d]/g,'');const site=document.getElementById('employer-website');if(site){site.href=safeProfileLink(employer.website);site.dataset.copyValue=site.href}const signature=document.querySelector('.employer-signature');if(signature){signature.textContent=[employer.email,employer.company,...employer.address,employer.phone,employer.website].join('\n');signature.style.whiteSpace='pre-line'}}
 else{document.querySelector('.employer-card')?.remove()}
 const download=document.querySelector('.resume-download');if(download){if(profile.resume){download.href=safeProfileLink(profile.resume.path);download.download=profile.resume.filename;download.textContent='Download résumé · '+profile.resume.format}else{const hint=document.createElement('p');hint.textContent='Add your résumé during setup.';download.replaceWith(hint)}}
 const template=document.getElementById('email-template-text');if(template){const t=profile.outreach;template.textContent='Subject: '+t.subject+'\n\n'+t.greeting+'\n\n'+t.paragraphs.join('\n\n')+'\n\n'+t.signature.join('\n')}
}
