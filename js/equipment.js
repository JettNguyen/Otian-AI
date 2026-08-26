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
   RECS below, the kit is assembled in the browser, and nothing about the reader
   or their computer leaves the page. There is no endpoint in this file.

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
     it from the answer. `ack` is an optional reply to what was chosen, and it is
     where an honest caveat goes the moment it becomes relevant rather than at
     the end, so nobody answers three more questions before finding out. */
  var NODES = {

    machine: {
      section: 'The computer',
      bot: [
        'Hi, I’m Ember. Four or five questions and I’ll write out the kit for your situation. Nothing here gets sent anywhere, and you can change any answer as we go.',
        'First, and it decides most of the rest: what would Archie run on? Your agent can only answer while that computer is on, awake and connected, so that is the whole of what the machine has to do.'
      ],
      type: 'choice',
      cards: true,
      name: 'machine',
      options: [
        {
          value: 'desktop',
          label: 'A desktop I already own',
          desc: 'An iMac, a tower, a Mac mini: something that already sits on a desk and is on most of the day.'
        },
        {
          value: 'laptop-spare',
          label: 'A laptop that could stay home',
          desc: 'You have one you could leave plugged in somewhere rather than carry around.'
        },
        {
          value: 'laptop-daily',
          label: 'My laptop, and it comes with me',
          desc: 'It is your main machine and it travels, sleeps, and gets closed.'
        },
        {
          value: 'buying',
          label: 'Nothing spare. I’d buy something',
          desc: 'You would get a machine for this. It does not have to be much of one.'
        }
      ],
      ack: function (value) {
        if (value === 'desktop') {
          return 'Then you are most likely done buying things, and the rest of this is setup rather than shopping.';
        }
        if (value === 'laptop-daily') {
          return 'Worth saying straight away: that one works, but only while it is open, awake and connected. Close the lid at the café and the agent stops until you open it again. I’ll write that up honestly rather than pretend otherwise.';
        }
        return null;
      },
      next: 'platform'
    },

    platform: {
      section: 'The computer',
      bot: function (answers) {
        if (answers.machine === 'buying') {
          return ['Mac or Windows? Archie runs on both. There are two real differences and I’ll come to them, rather than telling you one is correct.'];
        }
        return ['Is it a Mac or a Windows PC?'];
      },
      type: 'choice',
      name: 'platform',
      options: function (answers) {
        var opts = [
          { value: 'mac', label: 'Mac' },
          { value: 'windows', label: 'Windows' }
        ];
        if (answers.machine === 'buying') {
          opts.push({ value: 'either', label: 'No preference, tell me' });
        }
        return opts;
      },
      ack: function (value) {
        if (value === 'windows') {
          return 'Fine, with one thing you should hear now rather than at the download: our Windows installer is not signed yet, so Windows shows a warning the first time. <a href="../archie/install/">We wrote up why, and what to check instead of trusting us</a>.';
        }
        return null;
      },
      next: 'texts'
    },

    texts: {
      section: 'How you want it to work',
      bot: [
        'Would you want it handling your text messages: reading what arrives, and drafting replies you press send on?',
        { html: 'This one is worth asking early, because it is the one feature that decides the machine. It reads Messages on a Mac, so it is Mac only.', note: true }
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
          return 'Then there is a real conflict, and I would rather name it than route around it: on Windows that feature does not exist, and no add-on brings it over. Everything else works the same on both. I’ll put it in the kit so you can weigh it.';
        }
        if (value !== 'no' && answers.platform === 'either') {
          return 'That settles the Mac-or-Windows question for you, then. Texts are Mac only.';
        }
        return null;
      },
      next: 'mail'
    },

    mail: {
      section: 'How you want it to work',
      bot: ['Where does your email live? A lot of what people want an agent for starts in the inbox.'],
      type: 'choice',
      name: 'mail',
      options: [
        { value: 'google', label: 'Gmail or Google Workspace' },
        { value: 'microsoft', label: 'Outlook or Office 365' },
        { value: 'other', label: 'Somewhere else' },
        { value: 'skip', label: 'I don’t want it near my email' }
      ],
      ack: function (value) {
        if (value === 'other') {
          return 'Then the mail half is not for you yet, and that is not a hardware problem so no machine fixes it: Archie connects to Gmail and to Outlook, and nothing else. Everything that is not email works exactly the same. I’ll note it in the kit.';
        }
        if (value === 'skip') {
          return 'Perfectly reasonable, and it changes nothing about the machine. Connect nothing and it still runs.';
        }
        return null;
      },
      next: 'place'
    },

    place: {
      section: 'Where it lives',
      bot: ['Where would the machine actually sit?'],
      type: 'choice',
      cards: true,
      name: 'place',
      options: [
        {
          value: 'router',
          label: 'Near the router',
          desc: 'Same room, or close enough to run a cable.'
        },
        {
          value: 'elsewhere',
          label: 'Somewhere else in the house',
          desc: 'A desk, a spare room, the other end of the Wi-Fi.'
        },
        {
          value: 'tucked',
          label: 'Out of the way, no screen',
          desc: 'A cupboard, a shelf, behind the TV. You would rather not look at it.'
        }
      ],
      next: 'budget'
    },

    budget: {
      section: 'Budget',
      bot: ['Last one. Which of these sounds like you?'],
      type: 'choice',
      cards: true,
      name: 'budget',
      options: function (answers) {
        var opts = [];
        if (answers.machine !== 'buying') {
          opts.push({
            value: 'nothing',
            label: 'I’d rather spend nothing',
            desc: 'Use what is in the house and change as little as possible.'
          });
        }
        opts.push({
          value: 'least',
          label: 'As little as will do the job',
          desc: 'Spend where it is needed and nowhere else.'
        });
        opts.push({
          value: 'once',
          label: 'Buy once, keep it for years',
          desc: 'You would rather pay a bit more now than do this again.'
        });
        return opts;
      },
      next: 'done'
    },

    done: {
      section: 'Your kit',
      bot: ['That’s everything I need. Here it is.'],
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

  /* ── Which platform the kit is actually written for ──
     "No preference, tell me" is a real answer and has to resolve to something
     before the kit can name a machine. It resolves to Mac, and it would even if
     texts had not been asked about: the Mac build is the signed one, and the
     Mac is the only side that can grow into the messages features later. Said
     plainly here rather than dressed up as a calculation, because a branch that
     returns the same answer both ways is a lie about how the choice was made. */
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

  function scrollToShow(el) {
    var bottom = el.getBoundingClientRect().bottom + window.pageYOffset;
    var target = bottom - window.innerHeight + 28;
    if (target > (window.pageYOffset || 0)) {
      window.scrollTo({ top: target, behavior: REDUCED ? 'auto' : 'smooth' });
    }
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
     Every branch below is written out rather than generated, so what a reader is
     told is a thing a person decided and can be read in one place.

     WHAT MAY BE SAID HERE. Machines are named where we would buy one ourselves.
     Requirements are the ones on archie/install/ (macOS 12 Monterey or later,
     Windows 10 or 11 64-bit, one Mac download for Apple silicon and Intel
     alike). Mac-only means the two features that read Messages. No prices, no
     invented minimum specs: we have never published a RAM or processor floor and
     inventing one here would be a number a reader shops against. */

  function computerCard() {
    var m = answers.machine;
    var p = platformOf();
    var os = p === 'mac' ? 'macOS 12 Monterey or later' : 'Windows 10 or 11, 64-bit';

    if (m === 'desktop') {
      return {
        title: 'The computer: the one you already have',
        body: '<p>Use it. A desktop that is already on most of the day is exactly the machine this wants, and buying a second one to sit beside it would be us selling you something you do not need.</p>' +
          '<p>The only thing to check is the version: Archie needs <strong>' + os + '</strong>. ' +
          (p === 'mac' ? 'One download covers Apple silicon and Intel Macs alike, so an older Mac is not disqualified for being older.' : 'That is the whole requirement; there is no processor or memory floor we publish, because the machine spends most of its life idle.') +
          '</p>'
      };
    }

    if (m === 'laptop-spare') {
      return {
        title: 'The computer: that laptop, plugged in and left alone',
        body: '<p>A laptop that stays home is a fine always-on machine, and it is free. Plug it into power and leave it there: on battery it will sleep, and a sleeping computer is an agent that is not answering.</p>' +
          '<p>It needs <strong>' + os + '</strong>. ' +
          (p === 'mac' ? 'One download covers Apple silicon and Intel Macs alike.' : 'There is no processor or memory floor we publish.') +
          '</p>' +
          '<p>If it turns out you keep wanting the laptop back, that is the point at which a small desktop stops being an expense and starts being the thing that lets you have both.</p>'
      };
    }

    if (m === 'laptop-daily') {
      return {
        title: 'The computer: your laptop, with one honest catch',
        body: '<p>It will work, and you should know exactly what you are agreeing to. Your agent runs on that machine, so it answers while the laptop is open, awake and connected, and it stops when the lid closes. Nothing runs in the cloud on your behalf while you are on the train.</p>' +
          '<p>That is fine for a lot of people, and it is a bad fit for the things people most want an agent for: watching an inbox during the day, a briefing that arrives before you are up, a routine that runs at three in the morning. All of those need a machine that is still there.</p>' +
          '<p>So: start on the laptop, because it costs nothing to find out. If you find yourself wanting the overnight half, that is the moment to add a small desktop, and not before.</p>'
      };
    }

    /* buying */
    if (p === 'mac') {
      return {
        title: 'The computer: a Mac mini',
        body: '<p>This is the one we would buy ourselves, and it is already the answer the rest of the site gives. It is small enough to leave behind a monitor or on a shelf, it is quiet enough to leave in a room you sit in, and the Mac build of Archie is the signed and notarized one, so it installs without an argument.</p>' +
          '<p>Buy the plain one. Archie needs <strong>macOS 12 Monterey or later</strong> and no more than that, and the money that would go into a faster chip buys you nothing here: the thinking happens on your AI company\'s computers, not on this one.</p>' +
          '<p class="kit-aside">A second-hand Mac mini running a recent macOS is the same answer for less, and we would not talk you out of it.</p>'
      };
    }
    return {
      title: 'The computer: a small Windows desktop',
      body: '<p>Any small desktop you can leave switched on. The mini-PC shelf, the kind that fits behind a monitor, is where this lives: quiet, small, and made to be left alone. We are not going to name a brand we have not run for a year ourselves.</p>' +
        '<p>What to look for is short. <strong>Windows 10 or 11, 64-bit.</strong> Somewhere to plug in an Ethernet cable. A fan you can live with, if it will be in a room you sit in. That is the list. The thinking happens on your AI company\'s computers, so the money that would go into a faster processor buys you nothing here.</p>' +
        '<p class="kit-aside">Our Windows installer is not signed yet, so the first launch shows a warning. <a href="../archie/install/">Why, and what to check instead of trusting us.</a></p>'
    };
  }

  function awakeCard() {
    var p = platformOf();
    var m = answers.machine;
    var laptop = (m === 'laptop-spare' || m === 'laptop-daily');
    var body;
    if (p === 'mac') {
      body = '<p>In System Settings, under Energy or Battery, turn off sleep while it is plugged into power. ' +
        (laptop ? 'On a laptop, that setting lives under the power adapter tab, and closing the lid still sleeps it unless it is driving an external display. If the lid has to close, give it a monitor or leave it open.' : 'A desktop only needs the one setting.') +
        '</p><p>Then set it to start up again after a power cut, so a flicker at 4am does not cost you a day.</p>';
    } else {
      body = '<p>In Settings, under System then Power, set sleep to Never while it is plugged in. ' +
        (laptop ? 'On a laptop, also set what closing the lid does, or closing it will sleep the machine no matter what the other setting says.' : '') +
        '</p><p>Then check that it turns itself back on after a power cut, which is a setting in the machine\'s own firmware rather than in Windows.</p>';
    }
    return {
      title: 'Keeping it awake',
      body: body + '<p>This is the step people skip, and it is the one that decides whether the whole thing works. An agent on a sleeping computer is not slow. It is off.</p>'
    };
  }

  function networkCard() {
    var place = answers.place;
    if (place === 'router') {
      return {
        title: 'The network: run the cable',
        body: '<p>You said it can sit near the router, so use a wired Ethernet cable. It is the cheapest thing on this page and it is the one that stops the odd unexplained gap where the agent missed something.</p><p>Any Ethernet cable will do. This is not a connection that needs to be fast, it needs to be there.</p>'
      };
    }
    if (place === 'elsewhere') {
      return {
        title: 'The network: Wi-Fi is fine, wired is steadier',
        body: '<p>Wi-Fi works. On an always-on machine the thing to watch for is not speed, it is the drop that happens at the same time every night and that nobody notices because nobody is awake.</p><p>If the room has a socket near the router\'s side of the house, a cable is worth more than a faster router. Otherwise put it where the signal is good rather than where it is tidy, and move on.</p>'
      };
    }
    return {
      title: 'The network: it will be out of sight, so make it wired',
      body: '<p>A machine you cannot see is a machine you will not notice has fallen off the Wi-Fi. Run a cable to it if the spot allows one, and if it does not, put it somewhere the signal is genuinely good rather than somewhere it is merely hidden.</p><p>You will also want to reach it without a monitor: both Mac and Windows can be controlled from another computer on your network, and that is the ordinary way to run a machine in a cupboard.</p>'
    };
  }

  function powerCard() {
    if (answers.budget === 'nothing') return null;
    return {
      title: 'Power, if your electricity flickers',
      body: '<p>A power strip with a battery in it, the kind sold for desktops. It is the difference between a two-second blip and a machine that stays off until somebody comes home and presses the button.</p>' +
        '<p>Skip it if your power is reliable. It is the one item on this page that is insurance rather than equipment, and we would rather you knew which it was.</p>'
    };
  }

  function extrasCard() {
    var bits = [];
    bits.push('<li><strong>A screen, a keyboard and a mouse, for setup.</strong> Archie is an app with a window and you need to see it once. After that you can talk to your agent from your phone or a chat app, and the machine can go back in the cupboard.</li>');
    if (answers.budget !== 'nothing') {
      bits.push('<li><strong>Disk room, if you want it to speak or handle audio and video.</strong> Those tools run on your own computer and download to it, unlike the thinking, which does not.</li>');
    }
    bits.push('<li><strong>Your phone.</strong> Already in your pocket. It is how you reach the agent when you are not at the machine.</li>');
    return {
      title: 'The rest of it',
      body: '<ul class="kit-list">' + bits.join('') + '</ul>'
    };
  }

  /* The unflattering card. It is assembled from what the reader told us, so a
     caveat only appears when it is actually theirs, and it appears in the kit
     rather than in a footnote under it. */
  function catchCard() {
    var out = [];
    var p = platformOf();

    if ((answers.texts === 'yes' || answers.texts === 'maybe') && p === 'windows') {
      out.push('<li><strong>You wanted texts, and this is the machine that cannot do them.</strong> Reading and replying to messages is Mac only, because it reads Messages on a Mac. On Windows the feature is absent rather than limited. Everything else is the same on both.</li>');
    }
    if (p === 'windows') {
      out.push('<li><strong>Windows will warn you on first launch.</strong> Our installer is not signed yet. <a href="../archie/install/">The reason, and how to check the download without taking our word for it.</a></li>');
    }
    if (answers.mail === 'other') {
      out.push('<li><strong>Your email provider is not one it connects to.</strong> Archie works with Gmail and with Outlook. No machine on this page changes that, and it is worth knowing before you buy one.</li>');
    }
    if (answers.machine === 'laptop-daily') {
      out.push('<li><strong>The agent stops when your laptop does.</strong> Anything overnight or during your commute is not going to happen on this setup, and that is most of what a routine is for.</li>');
    }
    if (!out.length) {
      out.push('<li><strong>Nothing about your answers rules anything out</strong>, which is the boring outcome and the good one. The usual catches are Windows and texts, or an email provider we do not connect to, and neither is yours.</li>');
    }
    return {
      title: 'What this setup will not do',
      body: '<ul class="kit-list">' + out.join('') + '</ul>',
      tone: 'catch'
    };
  }

  function costCard() {
    return {
      title: 'What it costs after the hardware',
      body: '<p>Two things, and neither is a machine. An account with an AI company, which bills you for what your agent actually does and which you can cap. And a plan for Archie itself.</p>' +
        '<p><a href="../archie/pricing/">Every cost, in full</a>, including what the AI side runs to at three levels of use. We have not printed a hardware price anywhere on this page, because it would be somebody else\'s price and it would be wrong within the month.</p>'
    };
  }

  function showKit() {
    var cards = [computerCard(), awakeCard(), networkCard(), powerCard(), extrasCard(), catchCard(), costCard()];
    var html = '<div class="container container-narrow">' +
      '<div class="kit-head">' +
      '<span class="section-label">Your kit</span>' +
      '<h2>Here is what we would set up.</h2>' +
      '<p>Written for the answers you gave. Change any answer above and this rewrites itself.</p>' +
      '</div><div class="kit-cards">';

    cards.forEach(function (c) {
      if (!c) return;
      html += '<article class="kit-card' + (c.tone === 'catch' ? ' kit-card--catch' : '') + '">' +
        '<h3>' + c.title + '</h3>' + c.body + '</article>';
    });

    html += '</div>' +
      '<div class="kit-foot">' +
      '<p>If your machine is not on this list, or you want somebody to look at what you already own before you spend anything, ask us. We will tell you when the answer is that it will not do.</p>' +
      '<div class="hm-actions">' +
      '<a href="../contact/" class="btn btn-primary">Ask about your computer</a>' +
      '<a href="../how-it-works/#what-you-need" class="btn btn-secondary">Everything you need&nbsp;&rarr;</a>' +
      '</div></div></div>';

    kitPanel.innerHTML = html;
    kitPanel.hidden = false;
    react('done', 1200);
    scrollToShow(kitPanel);
  }

  ask('machine');
})();
