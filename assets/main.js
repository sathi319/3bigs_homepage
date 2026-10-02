(function(){
  'use strict';
  /* header + back to top */
  var hdr = document.getElementById('hdr');
  var up  = document.getElementById('up');
  function onScroll(){
    var y = window.scrollY || 0;
    hdr.classList.toggle('scrolled', y > 20);
    up.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  up.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });

  /* mobile menu */
  var burger = document.getElementById('burger');
  var links  = document.getElementById('navLinks');
  function closeMenu(){ links.classList.remove('open'); burger.classList.remove('open'); }
  burger.addEventListener('click', function(){
    links.classList.toggle('open'); burger.classList.toggle('open');
  });
  links.addEventListener('click', function(e){ if(e.target.tagName === 'A') closeMenu(); });

  /* reveal on scroll */
  var io = null;
  if('IntersectionObserver' in window){
    io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
  }
  function reveal(){
    document.querySelectorAll('.rv').forEach(function(el){
      if(el.classList.contains('in')) return;
      if(io){ io.observe(el); } else { el.classList.add('in'); }
    });
  }

  /* counters */
  function startCounters(){
    document.querySelectorAll('[data-count]').forEach(function(el){
      if(el.dataset.done) return;
      var target = parseInt(el.dataset.count,10);
      var suffix = el.dataset.suffix || '';
      var start = null, dur = 1300;
      el.dataset.done = '1';
      function step(ts){
        if(!start) start = ts;
        var p = Math.min((ts-start)/dur, 1);
        var eased = 1 - Math.pow(1-p, 3);
        el.textContent = Math.round(target*eased) + (p===1 ? suffix : '');
        if(p<1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* product filter */
  document.querySelectorAll('.filters button').forEach(function(b){
    b.addEventListener('click', function(){
      document.querySelectorAll('.filters button').forEach(function(x){ x.classList.remove('on'); });
      b.classList.add('on');
      var f = b.dataset.filter;
      document.querySelectorAll('#productGrid .card').forEach(function(c){
        c.classList.toggle('hide', !(f === 'all' || c.dataset.cat === f));
      });
    });
  });

  /* language toggle */
  function setLang(lang){
    document.documentElement.lang = (lang === 'kr' ? 'ko' : 'en');
    document.getElementById('btn-en').classList.toggle('on', lang==='en');
    document.getElementById('btn-kr').classList.toggle('on', lang==='kr');
    document.querySelectorAll('[data-en][data-kr]').forEach(function(el){
      var txt = el.getAttribute(lang === 'kr' ? 'data-kr' : 'data-en');
      if(txt == null) return;
      if(el.tagName === 'H1' && el.closest('.hero') && lang === 'en'){
        el.innerHTML = 'Unlocking the boundless possibilities of <em>Bio Big Data</em>';
        return;
      }
      el.textContent = txt;
    });
  }
  document.getElementById('btn-en').addEventListener('click', function(){ setLang('en'); });
  document.getElementById('btn-kr').addEventListener('click', function(){ setLang('kr'); });

  /* contact form */
  var form = document.getElementById('contactForm');
  if(form){
    var note = document.getElementById('formNote');
    function setErr(id, on){
      var f = document.getElementById(id).closest('.field');
      f.classList.toggle('err', on);
      return !on;
    }
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var name = document.getElementById('cName').value.trim();
      var email = document.getElementById('cEmail').value.trim();
      var topic = document.getElementById('cTopic').value;
      var msg = document.getElementById('cMsg').value.trim();
      var ok = true;
      ok = setErr('cName', !name) && ok;
      ok = setErr('cEmail', !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) && ok;
      ok = setErr('cTopic', !topic) && ok;
      ok = setErr('cMsg', msg.length < 10) && ok;
      if(!ok){ note.classList.remove('show'); return; }
      var subject = encodeURIComponent('[3BIGS Website] ' + topic + ' \u2014 ' + name);
      var bodyTxt = encodeURIComponent(
        'Name: ' + name + '\nEmail: ' + email + '\nOrganisation: ' +
        document.getElementById('cOrg').value.trim() + '\nArea of interest: ' + topic + '\n\n' + msg);
      window.location.href = 'mailto:info@3bigs.com?subject=' + subject + '&body=' + bodyTxt;
      note.textContent = 'Thank you, ' + name + '. Your mail client should now open with your enquiry addressed to info@3bigs.com. If it does not, please write to us directly at info@3bigs.com.';
      note.classList.add('show');
      form.reset();
    });
  }

  document.getElementById('yr').textContent = new Date().getFullYear();
  onScroll();
  reveal();
  startCounters();
  window.addEventListener('load', reveal);
})();
