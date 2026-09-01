/* ========================================
   Otian AI | What to run it on
   js/equipment.js

   The equipment question, staged as a chat with Ember, ending in a kit rather
   than a form. Same interaction as js/questionnaire.js and the same CSS: one
   question at a time, Ember's messages behind a typing indicator, answers echo
   back as the reader's own bubble with an edit control that rewinds the thread.

   THE ENGINE IS COPIED FROM questionnaire.js RATHER THAN SHARED. Two files, one
   shape. This site has no build step and no module bundler, and a third file
   existing only to be imported by two others is a worse trade here than the
   duplication: the nav is already duplicated into every page for the same
   reason. If the chat behaviour changes in one, change it in the other.

   WHAT IS DIFFERENT, AND IT IS THE POINT. The questionnaire sends somewhere.
   This sends nowhere. Every answer picks between recommendations written out in
   the card functions below, the kit is assembled in the browser, and nothing
   about the reader or their computer leaves the page. There is no endpoint here.

   KEEP IT SHORT. This shipped at nearly 2,000 words of chat copy and read as a
   wall arriving one bubble at a time, which is the opposite of what a
   conversation is for. A bubble is a sentence or two. A kit card is a short
   paragraph. If a card needs three paragraphs, the page it links to should be
   carrying two of them.

   THERE ARE NO PRICES IN HERE, DELIBERATELY. Naming a machine is a claim we can
   stand behind. Printing somebody else's price for it is a claim that goes stale
   without telling us, on a page a reader would act on. FACTS.md records the
   decision under "Figures that are deliberately unpublished". Say what to look
   for and let the reader read the price at the maker's own store.
   ======================================== */

(function () {
  'use strict';

  var EMBER_LOOK = 'terracotta.peak.pill.none';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var thread = document.getElementById('chatThread');
  var kitPanel = document.getElementById('kitPanel');
  var progressWrap = document.getElementById('progressWrap');
  var progressFill = document.getElementById('progressFill');
  var progressLabel = document.getElementById('progressLabel');
  var progressCount = document.getElementById('progressCount');
  if (!thread || !kitPanel) return;

  /* ── The conversation ──
     Each node is one exchange: Ember's messages (HTML we wrote, never reader
     input), then one way to answer. `next` names the following node or decides
     it from the answer. `ack` is an optional reply, and it is where a caveat
     goes the moment it becomes relevant rather than at the end, so nobody
     answers three more questions before finding out. Acks are one sentence:
     the full version belongs in the kit, where it can be read twice. */
  var NODES = {

    machine: {
      section: 'The computer',
      bot: [
        'Hi, I’m Ember. A few questions and I’ll write out the kit for your setup. Nothing here is sent anywhere.',
        'What would Archie run on? It can only answer while that computer is on and connected, which is the whole of what the machine has to do.'
      ],
      type: 'choice',
      cards: true,
      name: 'machine',
      options: [
        { value: 'desktop', label: 'A desktop I already own', desc: 'On a desk, on most of the day.' },
        { value: 'laptop-spare', label: 'A laptop that could stay home', desc: 'You could leave it plugged in somewhere.' },
        { value: 'laptop-daily', label: 'My laptop, and it comes with me', desc: 'Your main machine. It travels and gets closed.' },
        { value: 'buying', label: 'Nothing spare. I’d buy something', desc: 'It does not have to be much of a machine.' }
      ],
      ack: function (value) {
        if (value === 'desktop') return 'Then you are probably done buying things, and the rest is setup.';
        if (value === 'laptop-daily') return 'That works, but only while the lid is open. I’ll be straight about what it costs you.';
        return null;
      },
      next: 'platform'
    },

    platform: {
      section: 'The computer',
      bot: function (answers) {
        return answers.machine === 'buying'
          ? ['Mac or Windows? Both run it. Two real differences, and I’ll come to them.']
          : ['Mac or Windows?'];
      },
      type: 'choice',
      name: 'platform',
      options: function (answers) {
        var opts = [{ value: 'mac', label: 'Mac' }, { value: 'windows', label: 'Windows' }];
        if (answers.machine === 'buying') opts.push({ value: 'either', label: 'No preference, tell me' });
        return opts;
      },
      ack: function (value) {
        if (value === 'windows') {
          return 'One thing now rather than at the download: our Windows installer is not signed yet, so Windows warns you the first time. <a href="../archie/install/">Why, and what to check instead.</a>';
        }
        return null;
      },
      next: 'texts'
    },

    texts: {
      section: 'How you want it to work',
      bot: [
        'Would you want it reading your texts and drafting replies you press send on?',
        { html: 'Asked early because it decides the machine: it reads Messages on a Mac, so it is Mac only.', note: true }
      ],
      type: 'choice',
      name: 'texts',
      options: [
        { value: 'yes', label: 'Yes, I’d want that' },
        { value: 'no', label: 'No, not that' },
        { value: 'maybe', label: 'Maybe later' }
      ],
      ack: function (value, answers) {
        if (value !== 'no' && answers.platform === 'windows') {
          return 'Then there is a real conflict, and it goes in the kit rather than in a footnote.';
        }
        if (value !== 'no' && answers.platform === 'either') {
          return 'That settles Mac or Windows for you, then.';
        }
        return null;
      },
      next: 'mail'
    },

    mail: {
      section: 'How you want it to work',
      bot: ['Where does your email live? A lot of what people want starts in the inbox.'],
      type: 'choice',
      name: 'mail',
      options: [
        { value: 'google', label: 'Gmail or Google Workspace' },
        { value: 'microsoft', label: 'Outlook or Office 365' },
        { value: 'imap', label: 'iCloud, Fastmail, Yahoo, AOL, Zoho Mail or GMX' },
        { value: 'other', label: 'Somewhere else' },
        { value: 'skip', label: 'I don’t want it near my email' }
      ],
      ack: function (value) {
        if (value === 'other') return 'Then the mail half is not for you yet, and no machine fixes that. Noted for the kit.';
        if (value === 'skip') return 'Fine, and it changes nothing about the machine.';
        return null;
      },
      next: 'place'
    },

    place: {
      section: 'Where it lives',
      bot: ['Where would it actually sit?'],
      type: 'choice',
      cards: true,
      name: 'place',
      options: [
        { value: 'router', label: 'Near the router', desc: 'Close enough to run a cable.' },
        { value: 'elsewhere', label: 'Elsewhere in the house', desc: 'A desk, a spare room, the far end of the Wi-Fi.' },
        { value: 'tucked', label: 'Out of the way, no screen', desc: 'A cupboard, a shelf, behind the TV.' }
      ],
      next: 'budget'
    },

    budget: {
      section: 'Budget',
      bot: ['Last one. Which sounds like you?'],
      type: 'choice',
      cards: true,
      name: 'budget',
      options: function (answers) {
        var opts = [];
        if (answers.machine !== 'buying') {
          opts.push({ value: 'nothing', label: 'I’d rather spend nothing', desc: 'Use what is in the house.' });
        }
        opts.push({ value: 'least', label: 'As little as will do', desc: 'Spend where it is needed, nowhere else.' });
        opts.push({ value: 'once', label: 'Buy once, keep it for years', desc: 'Rather not do this again.' });
        return opts;
      },
      next: 'done'
    },

    done: {
      section: 'Your kit',
      bot: ['That’s everything. Here it is.'],
      type: 'finish'
    }
  };

  var ORDER = ['machine', 'platform', 'texts', 'mail', 'place', 'budget', 'done'];

  var answers = {};
  var history = [];

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ── Which platform the kit is written for ──
     "No preference, tell me" has to resolve to something before the kit can name
     a machine. It resolves to Mac, and it would even if texts had not been asked
     about: the Mac build is the signed one, and the Mac is the only side that can
     grow into the messages features later. Said plainly rather than dressed up as
     a calculation, because a branch returning the same answer both ways is a lie
     about how the choice was made. */
  function platformOf() {
    return answers.platform === 'either' ? 'mac' : answers.platform;
  }

  function updateProgress(nodeId) {
    var node = NODES[nodeId];
    var idx = ORDER.indexOf(nodeId);
    var total = ORDER.length - 1;
    if (progressLabel) progressLabel.textContent = node.section;
    if (node.type === 'finish') {
      if (progressCount) progressCount.textContent = 'All set';
      if (progressFill) progressFill.style.width = '100%';
    } else {
      if (progressCount) progressCount.textContent = 'Question ' + (idx + 1) + ' of ' + total;
      if (progressFill) progressFill.style.width = Math.round(((idx + 1) / (total + 1)) * 100) + '%';
    }
  }

  /* Keeps the newest message in view: scrolls just far enough that the appended
     node's bottom edge clears the viewport. Right for a bubble, wrong for
     anything tall, which is what scrollToStart below is for. */
  function scrollToShow(el) {
    var bottom = el.getBoundingClientRect().bottom + window.pageYOffset;
    var target = bottom - window.innerHeight + 28;
    if (target > (window.pageYOffset || 0)) {
      window.scrollTo({ top: target, behavior: REDUCED ? 'auto' : 'smooth' });
    }
  }

  /* The kit is taller than the window, so scrolling its BOTTOM into view lands
     the reader on the last card, past everything they asked for. Its top edge is
     the only sensible landing: the answer starts at the beginning. */
  function scrollToStart(el) {
    var top = el.getBoundingClientRect().top + window.pageYOffset;
    var nav = parseInt(window.getComputedStyle(document.documentElement)
      .getPropertyValue('--nav-height'), 10);
    window.scrollTo({
      top: Math.max(0, top - ((nav > 0 ? nav : 64) + 16)),
      behavior: REDUCED ? 'auto' : 'smooth'
    });
  }

  function react(state, ms) {
    if (window.Ember) window.Ember.react(state, ms);
  }

  function botGroup(rec) {
    var group = document.createElement('div');
    group.className = 'chat-group chat-in';
    var avatar = document.createElement('span');
    avatar.className = 'chat-avatar';
    avatar.setAttribute('data-ember', EMBER_LOOK);
    avatar.setAttribute('aria-hidden', 'true');
    var msgs = document.createElement('div');
    msgs.className = 'chat-msgs';
    group.appendChild(avatar);
    group.appendChild(msgs);
    thread.appendChild(group);
    rec.els.push(group);
    if (window.Ember) window.Ember.auto(group);
    return msgs;
  }

  function typeThen(rec, msgs, ms, fn) {
    if (REDUCED) { fn(); return; }
    var typing = document.createElement('div');
    typing.className = 'chat-bubble chat-typing chat-in';
    typing.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typing);
    scrollToShow(typing);
    rec.timers.push(window.setTimeout(function () {
      typing.remove();
      fn();
    }, ms));
  }

  function ask(nodeId) {
    var node = NODES[nodeId];
    if (!node) return;
    var rec = { id: nodeId, els: [], timers: [] };
    history.push(rec);
    updateProgress(nodeId);

    var msgs = botGroup(rec);
    var lines = (typeof node.bot === 'function') ? node.bot(answers) : node.bot;
    var i = 0;
    function nextMsg() {
      if (i >= lines.length) {
        if (node.type === 'finish') { showKit(); return; }
        renderInput(rec, node);
        return;
      }
      var m = lines[i];
      var html = (typeof m === 'string') ? m : m.html;
      var delay = 380 + Math.min(html.length * 5, 900);
      i += 1;
      typeThen(rec, msgs, delay, function () {
        var b = document.createElement('div');
        b.className = 'chat-bubble chat-in' + ((m && m.note) ? ' chat-note' : '');
        b.innerHTML = html;
        msgs.appendChild(b);
        scrollToShow(b);
        nextMsg();
      });
    }
    nextMsg();
  }

  function renderInput(rec, node) {
    var ui = document.createElement('div');
    ui.className = 'chat-choices chat-in';
    var options = (typeof node.options === 'function') ? node.options(answers) : node.options;
    options.forEach(function (opt) {
      var btn = document.createElement('button');
      btn.type = 'button';
      if (node.cards) {
        btn.className = 'chat-choice chat-choice-card';
        btn.innerHTML = '<span class="chat-choice-title">' + escapeHtml(opt.label) + '</span>' +
          '<span class="chat-choice-desc">' + escapeHtml(opt.desc) + '</span>';
      } else {
        btn.className = 'chat-choice';
        btn.textContent = opt.label;
      }
      btn.addEventListener('click', function () {
        answer(rec, node, opt.value, opt.label);
      });
      ui.appendChild(btn);
    });
    thread.appendChild(ui);
    rec.els.push(ui);
    rec.inputUI = ui;
    scrollToShow(ui);
  }

  function answer(rec, node, value, label) {
    if (node.name) answers[node.name] = value;

    if (rec.inputUI) {
      rec.inputUI.remove();
      rec.els.splice(rec.els.indexOf(rec.inputUI), 1);
      rec.inputUI = null;
    }

    var row = document.createElement('div');
    row.className = 'chat-user chat-in';
    var edit = document.createElement('button');
    edit.type = 'button';
    edit.className = 'chat-edit';
    edit.setAttribute('aria-label', 'Change this answer');
    edit.title = 'Change this answer';
    edit.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/></svg>';
    edit.addEventListener('click', function () { rewindTo(rec); });
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble-user';
    bubble.textContent = label;
    row.appendChild(edit);
    row.appendChild(bubble);
    thread.appendChild(row);
    rec.els.push(row);
    scrollToShow(row);
    react('done', 900);

    var ackHtml = node.ack ? node.ack(value, answers) : null;
    function goNext() {
      var nx = (typeof node.next === 'function') ? node.next(value, answers) : node.next;
      if (nx) ask(nx);
    }
    if (ackHtml) {
      var msgs = botGroup(rec);
      typeThen(rec, msgs, 380 + Math.min(ackHtml.length * 5, 700), function () {
        var b = document.createElement('div');
        b.className = 'chat-bubble chat-in';
        b.innerHTML = ackHtml;
        msgs.appendChild(b);
        scrollToShow(b);
        rec.timers.push(window.setTimeout(goNext, REDUCED ? 0 : 350));
      });
    } else {
      rec.timers.push(window.setTimeout(goNext, REDUCED ? 0 : 350));
    }
  }

  /* Rewind: drop everything from a question onward, including a kit already
     written, and ask it again. A kit left on screen under a changed answer is
     the worst thing this page could do. */
  function rewindTo(rec) {
    var idx = history.indexOf(rec);
    if (idx < 0) return;

    kitPanel.hidden = true;
    kitPanel.innerHTML = '';

    for (var j = history.length - 1; j >= idx; j--) {
      var r = history[j];
      r.timers.forEach(window.clearTimeout);
      r.els.forEach(function (e) { e.remove(); });
      var n = NODES[r.id];
      if (n && n.name) delete answers[n.name];
    }
    history.length = idx;
    ask(rec.id);
  }

  /* ── The recommendations ──
     Every branch is written out rather than generated, so what a reader is told
     is a thing a person decided and can be read in one place.

     WHAT MAY BE SAID HERE. Machines are named where we would buy one ourselves.
     Requirements are the ones on archie/install/ (macOS 12 Monterey or later,
     Windows 10 or 11 64-bit, one Mac download for Apple silicon and Intel
     alike). Mac-only means the two features that read Messages. No prices, no
     invented minimum specs: we have never published a RAM or processor floor and
     inventing one here would be a number a reader shops against.

     ONE SHORT PARAGRAPH PER CARD. The reasoning that does not fit belongs on the
     page the card links to. */

  function computerCard() {
    var m = answers.machine;
    var p = platformOf();
    var os = p === 'mac' ? 'macOS 12 Monterey or later' : 'Windows 10 or 11, 64-bit';

    if (m === 'desktop') {
      return {
        title: 'The computer: the one you have',
        body: '<p>Use it. A desktop that is already on most of the day is exactly what this wants. The only thing to check is that it runs <strong>' + os + '</strong>' +
          (p === 'mac' ? ', and one download covers Apple silicon and Intel alike, so an older Mac is not disqualified for being old.' : '.') + '</p>'
      };
    }

    if (m === 'laptop-spare') {
      return {
        title: 'The computer: that laptop, plugged in',
        body: '<p>A laptop that stays home is a fine always-on machine, and it is free. Leave it on power: on battery it will sleep, and a sleeping computer is an agent that is not answering. It needs <strong>' + os + '</strong>.</p>'
      };
    }

    if (m === 'laptop-daily') {
      return {
        title: 'The computer: your laptop, with one catch',
        body: '<p>It works while the laptop is open, awake and connected, and it stops when the lid closes. That rules out the overnight half: the inbox watched during the day, the briefing before you are up, the routine at three in the morning.</p>' +
          '<p>Start on it anyway. It costs nothing to find out, and a small desktop is the answer only once you know you want one.</p>'
      };
    }

    /* buying */
    if (p === 'mac') {
      return {
        title: 'The computer: a Mac mini',
        body: '<p>The one we would buy ourselves. Small enough for a shelf, quiet enough for a room you sit in, and the Mac build is the signed and notarized one, so it installs without an argument.</p>' +
          '<p>Buy the plain one. It needs <strong>macOS 12 Monterey or later</strong> and nothing more.</p>' +
          '<p class="kit-aside">A second-hand one running a recent macOS is the same answer for less, and we would not talk you out of it.</p>'
      };
    }
    return {
      title: 'The computer: a small Windows desktop',
      body: '<p>The mini-PC shelf, the kind that fits behind a monitor. What to look for is short: <strong>Windows 10 or 11, 64-bit</strong>, somewhere to plug in a network cable, and a fan you can live with. We will not name a brand we have not run for a year ourselves.</p>' +
        '<p class="kit-aside">Our Windows installer is not signed yet, so the first launch shows a warning. <a href="../archie/install/">Why, and what to check instead.</a></p>'
    };
  }

  function awakeCard() {
    var p = platformOf();
    var laptop = (answers.machine === 'laptop-spare' || answers.machine === 'laptop-daily');
    var body = p === 'mac'
      ? '<p>System Settings, under Energy or Battery: turn off sleep on power. ' +
        (laptop ? 'On a laptop that setting is under the power adapter tab, and closing the lid still sleeps it unless it is driving a display.' : 'Then set it to start up again after a power cut.') + '</p>'
      : '<p>Settings, System, Power: sleep set to Never while plugged in. ' +
        (laptop ? 'Set what closing the lid does as well, or it sleeps regardless.' : 'Then check the machine restarts itself after a power cut, which is a firmware setting rather than a Windows one.') + '</p>';
    return {
      title: 'Keeping it awake',
      body: body + '<p>This is the step people skip and the one that decides whether any of it works. An agent on a sleeping computer is not slow. It is off.</p>'
    };
  }

  function networkCard() {
    if (answers.place === 'router') {
      return {
        title: 'The network: run the cable',
        body: '<p>It can sit near the router, so wire it. Any Ethernet cable will do; this is not a connection that needs to be fast, it needs to be there. It is the cheapest thing on this page and it removes the unexplained gap where the agent missed something.</p>'
      };
    }
    if (answers.place === 'elsewhere') {
      return {
        title: 'The network: Wi-Fi works, wired is steadier',
        body: '<p>What to watch for on an always-on machine is not speed, it is the drop that happens at the same time every night while nobody is awake. If a cable is possible, it is worth more than a faster router. Otherwise put it where the signal is good rather than where it is tidy.</p>'
      };
    }
    return {
      title: 'The network: out of sight, so wire it',
      body: '<p>A machine you cannot see is one you will not notice has fallen off the Wi-Fi. Run a cable if the spot allows it. You can also reach it without a monitor: both Mac and Windows can be driven from another computer on your network, which is the ordinary way to run a machine in a cupboard.</p>'
    };
  }

  function extrasCard() {
    var bits = ['<li><strong>A screen and keyboard, for setup.</strong> You need to see the app once. After that you can reach your agent from your phone or a chat app.</li>'];
    if (answers.budget !== 'nothing') {
      bits.push('<li><strong>Disk room</strong>, if you want it to speak or handle audio and video. Those tools run on your computer, unlike the thinking, which does not.</li>');
      bits.push('<li><strong>A power strip with a battery in it</strong>, if your electricity flickers. Insurance rather than equipment: skip it if your power is reliable.</li>');
    }
    bits.push('<li><strong>Your phone.</strong> Already in your pocket, and it is how you reach the agent when you are away from the machine.</li>');
    return { title: 'The rest of it', body: '<ul class="kit-list">' + bits.join('') + '</ul>' };
  }

  /* The unflattering card, assembled from what the reader told us, so a caveat
     appears only when it is theirs and it appears in the kit rather than under
     it. When none apply it says so rather than vanishing. */
  function catchCard() {
    var out = [];
    var p = platformOf();

    if ((answers.texts === 'yes' || answers.texts === 'maybe') && p === 'windows') {
      out.push('<li><strong>You wanted texts, and this machine cannot do them.</strong> Reading and replying to messages is Mac only. On Windows the feature is absent rather than limited.</li>');
    }
    if (p === 'windows') {
      out.push('<li><strong>Windows warns you on first launch.</strong> Our installer is not signed yet. <a href="../archie/install/">The reason, and how to check the download yourself.</a></li>');
    }
    if (answers.mail === 'other') {
      out.push('<li><strong>Your email provider is not one it connects to.</strong> Archie works with Gmail, Outlook, iCloud, Fastmail, Yahoo, AOL, Zoho Mail and GMX. No machine on this page changes that.</li>');
    }
    if (answers.machine === 'laptop-daily') {
      out.push('<li><strong>The agent stops when your laptop does.</strong> Anything overnight is not going to happen, and that is most of what a routine is for.</li>');
    }
    if (!out.length) {
      out.push('<li><strong>Nothing you told me rules anything out</strong>, which is the boring outcome and the good one. The usual catches are Windows and texts, or an email provider we do not connect to.</li>');
    }
    return { title: 'What this setup will not do', body: '<ul class="kit-list">' + out.join('') + '</ul>', tone: 'catch' };
  }

  function costCard() {
    return {
      title: 'After the hardware',
      body: '<p>Two things, neither of them a machine: an account with an AI company, which bills you for what your agent does and which you can cap, and a plan for Archie. <a href="../archie/pricing/">Every cost, in full.</a></p>'
    };
  }

  function showKit() {
    var cards = [computerCard(), awakeCard(), networkCard(), extrasCard(), catchCard(), costCard()];
    var html = '<div class="container container-narrow">' +
      '<div class="kit-head">' +
      '<span class="section-label">Your kit</span>' +
      '<h2>Here is what we would set up.</h2>' +
      '<p>Written for your answers. Change one above and this rewrites itself.</p>' +
      '</div><div class="kit-cards">';

    cards.forEach(function (c) {
      if (!c) return;
      html += '<article class="kit-card' + (c.tone === 'catch' ? ' kit-card--catch' : '') + '">' +
        '<h3>' + c.title + '</h3>' + c.body + '</article>';
    });

    html += '</div>' +
      '<div class="kit-foot">' +
      '<p>Want somebody to look at what you already own before you spend anything? Ask us. We will tell you when the answer is that it will not do.</p>' +
      '<div class="hm-actions">' +
      '<a href="../contact/" class="btn btn-primary">Ask about your computer</a>' +
      '<a href="../how-it-works/#what-you-need" class="btn btn-secondary">Everything you need&nbsp;&rarr;</a>' +
      '</div></div></div>';

    kitPanel.innerHTML = html;
    kitPanel.hidden = false;
    react('done', 1200);
    scrollToStart(kitPanel);
  }

  ask('machine');
})();
