// The examples illustrate buyer pains; they do not assert measured hospital outcomes.
(() => {
  const slide = document.getElementById('hospital-reality');
  if (!slide) return;
  const openers = Array.from(slide.querySelectorAll('[data-hri2-open]'));
  const templates = Array.from(slide.querySelectorAll('[data-hri2-template]'));
  if (openers.length !== 4 || templates.length !== 4) return;
  const copy = (en, ka) => `<span class="lang-en">${en}</span><span class="lang-ka">${ka}</span>`;
  const labels = [['Payment','ანაზღაურება'],['People','გუნდი'],['Control','კონტროლი'],['Vendor','მომწოდებელი']];
  const dialog = document.createElement('dialog');
  dialog.id = 'hri2-details';
  dialog.className = 'hri2-dialog';
  dialog.setAttribute('aria-labelledby','hri2-dialog-title');
  dialog.setAttribute('aria-describedby','hri2-dialog-lead');
  dialog.setAttribute('data-no-advance','');
  dialog.innerHTML = `<header class="hri2-dialog-header"><div class="hri2-dialog-top"><div><h2 id="hri2-dialog-title"></h2><p class="hri2-dialog-lead" id="hri2-dialog-lead"></p></div><button type="button" class="hri2-close" aria-label="Close example / მაგალითის დახურვა">×</button></div><div class="hri2-tabs" role="tablist" aria-label="Hospital challenges / კლინიკის პრობლემები">${labels.map((label,index)=>`<button type="button" class="hri2-tab" role="tab" id="hri2-tab-${index}" aria-controls="hri2-panel-${index}" aria-selected="false" tabindex="-1"><small>0${index+1}</small><span>${copy(...label)}</span></button>`).join('')}</div></header><div class="hri2-dialog-body"></div>`;
  const panels = templates.map((template,index)=>{
    const panel=document.createElement('div');
    panel.id=`hri2-panel-${index}`;
    panel.className='hri2-panel';
    panel.setAttribute('role','tabpanel');
    panel.setAttribute('aria-labelledby',`hri2-tab-${index}`);
    panel.tabIndex=0;
    panel.hidden=true;
    panel.append(template.content.cloneNode(true));
    dialog.querySelector('.hri2-dialog-body').append(panel);
    return panel;
  });
  document.body.append(dialog);
  const tabs=Array.from(dialog.querySelectorAll('.hri2-tab'));
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const easing='cubic-bezier(0.23, 1, 0.32, 1)';
  let current=0,opener,priorKeyboard,dialogAnimation,panelAnimation,closing=false;
  function select(index,keyboard,animate=true){
    panelAnimation?.cancel(); current=index;
    dialog.dataset.input=keyboard?'keyboard':'pointer';
    tabs.forEach((tab,position)=>{tab.setAttribute('aria-selected',String(position===index));tab.tabIndex=position===index?0:-1;panels[position].hidden=position!==index;});
    dialog.querySelector('#hri2-dialog-title').innerHTML=openers[index].querySelector('.hri2-pain-title').innerHTML.replaceAll('<br>',' ');
    dialog.querySelector('#hri2-dialog-lead').innerHTML=openers[index].querySelector('.hri2-description').innerHTML;
    dialog.scrollTop=0;
    if(animate&&!keyboard&&panels[index].animate) panelAnimation=panels[index].animate(reduced.matches?[{opacity:.5},{opacity:1}]:[{opacity:.5,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:200,easing});
  }
  function close(keyboard=false){
    if(!dialog.open) return;
    if(keyboard||!dialog.animate){dialog.close();return;}
    if(closing) return;
    closing=true;dialog.dataset.input='pointer';dialog.dataset.closing='true';dialogAnimation?.cancel();
    dialogAnimation=dialog.animate(reduced.matches?[{opacity:1},{opacity:0}]:[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(10px) scale(.97)'}],{duration:200,easing});
    dialogAnimation.addEventListener('finish',()=>{if(closing)dialog.close();},{once:true});
  }
  openers.forEach((button,index)=>{
    button.disabled=false;
    button.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')event.stopPropagation();});
    button.addEventListener('click',event=>{
      if(dialog.open)return;
      opener=button;closing=false;delete dialog.dataset.closing;
      const keyboard=event.detail===0;
      select(index,keyboard,false);
      priorKeyboard=window.Reveal.getConfig().keyboard;
      window.Reveal.configure({keyboard:false});dialog.showModal();tabs[index].focus({preventScroll:true});
      if(!keyboard&&dialog.animate){dialogAnimation?.cancel();dialogAnimation=dialog.animate(reduced.matches?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(10px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:250,easing});}
    });
  });
  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',event=>select(index,event.detail===0));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();event.stopPropagation();
      const next=event.key==='Home'?0:event.key==='End'?3:(current+(event.key==='ArrowRight'?1:-1)+4)%4;
      select(next,true);tabs[next].focus({preventScroll:true});
    });
  });
  dialog.querySelector('.hri2-close').addEventListener('click',event=>close(event.detail===0));
  dialog.addEventListener('keydown',()=>{dialog.dataset.input='keyboard';});
  dialog.addEventListener('cancel',event=>{event.preventDefault();close(true);});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();});
  dialog.addEventListener('close',()=>{closing=false;dialogAnimation?.cancel();panelAnimation?.cancel();delete dialog.dataset.closing;window.Reveal.configure({keyboard:priorKeyboard});opener?.focus({preventScroll:true});});
  document.addEventListener('keydown',()=>{slide.dataset.hri2Input='keyboard';});
  document.addEventListener('pointerdown',()=>{slide.dataset.hri2Input='pointer';});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)panelAnimation?.cancel();});
  reduced.addEventListener('change',()=>{panelAnimation?.cancel();dialogAnimation?.cancel();if(closing)dialog.close();});
  window.Reveal.on('slidechanged',()=>{panelAnimation?.cancel();close(true);});
})();
