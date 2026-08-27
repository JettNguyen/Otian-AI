/* ========================================
   Otian AI | Get Started conversation
   js/questionnaire.js

   The intake, staged as a chat with Ember rather than a form. One question at a
   time: Ember's messages arrive behind a typing indicator, answers are tappable
   chips or one inline field, and each answer echoes back as the reader's own
   bubble with an edit control that rewinds the thread to that question.

   Three doors: the Archie waitlist (short path), the guided-setup intake, or the
   Business Roadmap consult (shown when the opening answer says business, or not
   sure). The fork decides which sequence of questions runs, and every path ends
   in the same Formspree submission; the waitlist and guided paths kept the field
   names the old form used, so the inbox side of those did not change.
   ======================================== */

(function () {
  'use strict';

  var FORMSPREE_ID = 'mgobddpy';
  var EMBER_LOOK = 'terracotta.peak.pill.none';
  var REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Element references ── */
  var thread = document.getElementById('chatThread');
  var formEl = document.getElementById('questionnaireForm');
  var thankyou = document.getElementById('thankyouScreen');
  var progressWrap = document.getElementById('progressWrap');
  var progressFill = document.getElementById('progressFill');
  var progressLabel = document.getElementById('progressLabel');
  var progressCount = document.getElementById('progressCount');
  if (!thread) return;

  /* ── The conversation ──
     Each node is one exchange: Ember's messages (strings are HTML we wrote, never
     reader input), then one way to answer. `next` names the following node, or
     decides it from the answer. `ack` is an optional reply to what was chosen. */
  var NODES = {

    audience: {
      section: 'Get started',
      bot: [
        'Hi, I’m Ember. A few quick questions and we’ll point you to the right starting place. You can change any answer as we go.',
        'First: who would your AI agent work for? (An agent is AI that does tasks for you, like sorting email or setting reminders, rather than just answering questions.)'
      ],
      type: 'choice',
      name: 'edition',
      options: [
        { value: 'personal', label: 'Just me' },
        { value: 'business', label: 'My business or team' },
        { value: 'unsure', label: 'I’m not sure yet' }
      ],
      ack: function (value) {
        if (value === 'business') {
          return 'Got it. That points at Archie for Business later on: agents your whole team can message. The plans sit side by side on the <a href="../archie/pricing/">pricing page</a>.';
        }
        if (value === 'unsure') {
          return 'No problem. The plans sit side by side on the <a href="../archie/pricing/">pricing page</a> whenever you want to compare, and nothing here locks you in.';
        }
        return null;
      },
      next: 'intent'
    },

    intent: {
      section: 'Get started',
      bot: ['And what would you like to do today?'],
      type: 'choice',
      cards: true,
      name: 'intent',
      /* The third door shows only when the opening answer said business (or not sure):
         the Business Roadmap is for shops that are interested but would not know where
         to start, and a "just me" visitor has no use for it. */
      options: function (answers) {
        var opts = [
          {
            value: 'waitlist',
            label: 'Put me on the Archie waitlist',
            desc: 'Archie is our desktop app for building personal AI agents that run on your own computer. The waitlist hears the moment it lands.'
          },
          {
            value: 'guided',
            label: 'I want help setting up an agent',
            desc: 'Our guided setup: we build your agent with you, starting with a free call. A few questions here help us come prepared.'
          }
        ];
        if (answers.edition !== 'personal') {
          opts.push({
            value: 'roadmap',
            label: 'Build a Business Roadmap',
            desc: 'Our consult for businesses that don’t know where to start. We learn how your business runs, map which agents and Add-ons fit it, and build anything the marketplace doesn’t have yet.'
          });
        }
        return opts;
      },
      setPath: function (value) { return PATHS[value] ? value : 'guided'; },
      next: function (value) {
        if (value === 'waitlist') return 'wlEmail';
        if (value === 'roadmap') return 'bzName';
        return 'gName';
      }
    },

    /* ── Waitlist path ── */

    wlEmail: {
      section: 'Join the waitlist',
      bot: ['Happy to have you. Two questions and you’re on the list. What email should the invite go to?'],
      type: 'email',
      name: 'waitlistEmail',
      placeholder: 'your@email.com',
      autocomplete: 'email',
      next: 'wlPlatform'
    },

    wlPlatform: {
      section: 'Join the waitlist',
      bot: [
        'And which computer would your agent run on?',
        'Wondering where Archie stands today? <a href="../archie/#status">Check the current status</a>.'
      ],
      type: 'choice',
      name: 'platform',
      /* The third option exists so a reader on Linux is not made to pick a false answer, and so
         we learn how many of them there are. Matches `gPlatform` on the guided path. */
      options: [
        { value: 'mac', label: 'Mac' },
        { value: 'windows', label: 'Windows' },
        { value: 'other', label: 'Something else, or not sure' }
      ],
      ack: function (value) {
        if (value === 'other') {
          return 'Thanks for saying. Archie runs on Mac and Windows today, and we’ll tell you if that changes.';
        }
        return null;
      },
      next: 'wlConfirm'
    },

    wlConfirm: {
      section: 'Join the waitlist',
      bot: ['That’s everything. We’ll email you the moment Archie is ready for you.'],
      type: 'confirm',
      label: 'Join the Waitlist'
    },

    /* ── Guided-setup path ── */

    gName: {
      section: 'About you',
      bot: [
        {
          note: true,
          html: '<strong>How pricing works:</strong> your first 30-minute discovery call is free, and guided setup is $250 a session (an hour each; a bigger setup takes more sessions, never a higher rate). Archie itself is $30 a month or $299 a year when it ships, and the AI runs pay-as-you-go on your own account. <a href="../archie/pricing/">Every cost, in full</a>.'
        },
        'With that on the table: what’s your first and last name?'
      ],
      type: 'text',
      name: 'fullName',
      placeholder: 'Jane Smith',
      autocomplete: 'name',
      errorMsg: 'Please enter your name.',
      ack: function (value) {
        var first = String(value).trim().split(' ')[0];
        return first ? 'Nice to meet you, ' + escapeHtml(first) + '.' : null;
      },
      next: 'gEmail'
    },

    gEmail: {
      section: 'About you',
      bot: ['What’s the best email for follow-up?'],
      type: 'email',
      name: 'emailAddress',
      placeholder: 'jane@example.com',
      autocomplete: 'email',
      next: 'gTask'
    },

    gTask: {
      section: 'What you want help with',
      bot: ['Now the interesting part. If your AI agent worked perfectly, what is one task you would love to hand off and never do again?'],
      type: 'textarea',
      name: 'handOffTask',
      placeholder: 'e.g. Going through my inbox every morning. There are so many emails and most of them do not need my attention. I just want to see what actually matters.',
      errorMsg: 'Please describe the task you’d like to hand off.',
      next: 'gTime'
    },

    gTime: {
      section: 'What you want help with',
      bot: ['Roughly how much time a week does that take right now?'],
      type: 'choice',
      name: 'timeSpent',
      options: [
        { value: 'under-2', label: 'Under 2 hours' },
        { value: '2-5', label: '2-5 hours' },
        { value: '5-10', label: '5-10 hours' },
        { value: '10-plus', label: '10+ hours' }
      ],
      next: 'gPlatform'
    },

    /* The one question that decides whether we can help at all, and until 2026-08-27 only the
       waitlist path asked it. A guided lead arriving on Linux or wanting the agent to live on a
       NAS is a conversation we should have before the call, not twelve minutes into it. Same
       field name as `wlPlatform` so both paths land in one column of the inbox. */
    gPlatform: {
      section: 'Your setup',
      bot: ['Which computer would the agent run on? The work happens on your own computer rather than in the cloud, so it needs one that can stay on.'],
      type: 'choice',
      name: 'platform',
      options: [
        { value: 'mac', label: 'Mac' },
        { value: 'windows', label: 'Windows' },
        { value: 'both', label: 'I have both' },
        { value: 'other', label: 'Something else, or not sure' }
      ],
      ack: function (value) {
        if (value === 'other') {
          return 'Good to know. Archie runs on Mac and Windows today, so let’s start the call there and see what fits.';
        }
        return null;
      },
      next: 'gApproval'
    },

    /* This asked which approval policy the reader wanted, and Archie has no such setting: the
       behavior is fixed per tool, so "just do it and tell me after" was an option we could not
       honor for the two things people mean by it. Rewritten 2026-08-27 to state what is fixed and
       then ask the thing that is actually ours to decide together, which is where to start. The
       field is renamed with it, because the old name now means something different and an inbox
       column that quietly changes meaning is worse than a new one. */
    gApproval: {
      section: 'How hands-on',
      bot: [
        'Two things are fixed in Archie rather than settings you have to find. Email arrives as a draft with a Send button, so nothing leaves your account unless you send it or set the time for it yourself. Calendar changes wait for your approval. And it has no way to buy anything or move money, beyond the AI usage on your own account.',
        'The rest (sorting, reminders, lists, looking things up) happens on its own and you read the results. Where would you put yourself on that?'
      ],
      type: 'choice',
      name: 'howHandsOn',
      options: [
        { value: 'comfortable', label: 'Comfortable, that’s what I want from it' },
        { value: 'tell-me', label: 'Fine, as long as it tells me what it did' },
        { value: 'start-small', label: 'I’d rather start with one thing and add as I go' }
      ],
      ack: function (value) {
        if (value === 'start-small') {
          return 'Sensible. We pick the first task together on the call, and it can stay the only one as long as you like.';
        }
        return null;
      },
      next: 'gTech'
    },

    gTech: {
      section: 'Comfort level',
      bot: ['How would you rate your experience with computers? 1 is a beginner, 10 is an expert, and there is no wrong answer; it just tells us how much to explain.'],
      type: 'rating',
      name: 'techRating',
      next: 'gAI'
    },

    /* Was Yes/No, which put somebody who tried ChatGPT once in the same bucket as somebody who
       runs a coding agent daily, and we prepare for those two calls completely differently. */
    gAI: {
      section: 'Comfort level',
      bot: ['Have you used AI tools before? Whichever is closest is fine.'],
      type: 'choice',
      name: 'aiExperience',
      options: [
        { value: 'none', label: 'Not yet' },
        { value: 'tried', label: 'I’ve tried one, like ChatGPT' },
        { value: 'regular', label: 'I use them most days' },
        { value: 'builds', label: 'I build with them, or use coding tools like Claude Code' }
      ],
      ack: function (value) {
        if (value === 'none') {
          return 'Good to know. The free call starts wherever you are.';
        }
        if (value === 'builds') {
          return 'Useful. We’ll skip the introductions and talk about what you’d be consolidating.';
        }
        return null;
      },
      next: 'gExtra'
    },

    gExtra: {
      section: 'Closing',
      bot: ['Last one. Anything else you would like us to know before your call?'],
      type: 'textarea',
      name: 'anythingElse',
      optional: true,
      skipLabel: 'Nothing to add',
      placeholder: 'e.g. I travel frequently and work across two time zones. I have an existing Google Workspace account. I tried an AI tool once and found it confusing. I am hoping this is different.',
      next: 'gConfirm'
    },

    gConfirm: {
      section: 'Closing',
      bot: ['That’s everything. Send your answers, and on the next screen you can pick a time for your free discovery call.'],
      type: 'confirm',
      label: 'Send My Answers'
    },

    /* ── Business Roadmap path ── */

    bzName: {
      section: 'About you',
      bot: [
        {
          note: true,
          html: '<strong>How the roadmap works:</strong> your first 30-minute discovery call is free: we learn your business and answer your questions, including what’s feasible. The roadmap itself (which agents, which Add-ons, what we’d build new for you) comes in a paid working session after that, and its cost is quoted on the free call.'
        },
        'With that on the table: what’s your first and last name?'
      ],
      type: 'text',
      name: 'fullName',
      placeholder: 'Jane Smith',
      autocomplete: 'name',
      errorMsg: 'Please enter your name.',
      ack: function (value) {
        var first = String(value).trim().split(' ')[0];
        return first ? 'Nice to meet you, ' + escapeHtml(first) + '.' : null;
      },
      next: 'bzEmail'
    },

    bzEmail: {
      section: 'About you',
      bot: ['What’s the best email for follow-up?'],
      type: 'email',
      name: 'emailAddress',
      placeholder: 'jane@example.com',
      autocomplete: 'email',
      next: 'bzCompany'
    },

    bzCompany: {
      section: 'Your business',
      bot: ['What’s the business called, and what’s your role there?'],
      type: 'text',
      name: 'companyRole',
      placeholder: 'e.g. Riverbend Dental, office manager',
      errorMsg: 'Please tell us the business and your role.',
      next: 'bzWhat'
    },

    bzWhat: {
      section: 'Your business',
      bot: ['What does the business do? A sentence is plenty.'],
      type: 'textarea',
      name: 'businessDescription',
      placeholder: 'e.g. Independent dental practice, two locations, about 4,000 patients.',
      errorMsg: 'Please tell us what the business does.',
      next: 'bzSize'
    },

    bzSize: {
      section: 'Your business',
      bot: ['How many people work there?'],
      type: 'choice',
      name: 'teamSize',
      options: [
        { value: 'solo', label: 'Just me' },
        { value: '2-10', label: '2-10' },
        { value: '11-50', label: '11-50' },
        { value: '51-plus', label: '51 or more' }
      ],
      next: 'bzPain'
    },

    bzPain: {
      section: 'Where to start',
      bot: ['Where does the team’s time go that it shouldn’t? If you already suspect a task an agent could take over, describe it. If you have no idea, that’s normal; finding it is what the roadmap is for.'],
      type: 'textarea',
      name: 'timeSinks',
      optional: true,
      skipLabel: 'I’m not sure, that’s what I want help with',
      placeholder: 'e.g. Rekeying orders between systems, chasing invoices, answering the same ten customer questions.',
      next: 'bzTools'
    },

    bzTools: {
      section: 'Where to start',
      bot: ['Last one. What tools does the business already run on? Whatever comes to mind is enough.'],
      type: 'textarea',
      name: 'currentTools',
      optional: true,
      skipLabel: 'Skip this question',
      placeholder: 'e.g. Gmail, QuickBooks, Slack, a Squarespace site.',
      next: 'bzConfirm'
    },

    bzConfirm: {
      section: 'Closing',
      bot: ['That’s everything. Send your answers, and on the next screen you can pick a time for your free discovery call.'],
      type: 'confirm',
      label: 'Send My Answers'
    }
  };

  /* ── Question order per path, for the progress bar ── */
  var PATHS = {
    waitlist: ['audience', 'intent', 'wlEmail', 'wlPlatform', 'wlConfirm'],
    guided: ['audience', 'intent', 'gName', 'gEmail', 'gTask', 'gTime', 'gPlatform', 'gApproval', 'gTech', 'gAI', 'gExtra', 'gConfirm'],
    roadmap: ['audience', 'intent', 'bzName', 'bzEmail', 'bzCompany', 'bzWhat', 'bzSize', 'bzPain', 'bzTools', 'bzConfirm']
  };

  var activePath = 'guided'; // default until the fork is answered
  var answers = {};          // field name -> answer value (what Formspree receives)
  var history = [];          // one record per asked node: { id, els, timers }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  /* ── Progress bar ── */
  function updateProgress(nodeId) {
    var path = PATHS[activePath];
    var node = NODES[nodeId];
    var idx = path.indexOf(nodeId);
    var total = path.length - 1; // the confirm step is a send button, not a question
    if (progressLabel) progressLabel.textContent = node.section;
    if (node.type === 'confirm') {
      if (progressCount) progressCount.textContent = 'All set';
      if (progressFill) progressFill.style.width = '100%';
    } else {
      if (progressCount) progressCount.textContent = 'Question ' + (idx + 1) + ' of ' + total;
      if (progressFill) progressFill.style.width = Math.round(((idx + 1) / (total + 1)) * 100) + '%';
    }
  }

  /* ── Keeping the newest message in view ──
     Scrolls the page just far enough that the appended node's bottom edge clears
     the viewport, rather than pinning to the document end (the footer is below). */
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

  /* ── One group of Ember messages: avatar plus a column of bubbles ── */
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
    /* ember.js loads deferred, after this script: it sweeps the page itself on
       DOMContentLoaded, so only groups added later need the explicit mount. */
    if (window.Ember) window.Ember.auto(group);
    return msgs;
  }

  /* Typing dots, then the message. The pause scales with how much is about to arrive,
     because an instant essay reads as a paste rather than a reply. */
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

  /* ── Ask one node: play its messages, then offer the way to answer ── */
  function ask(nodeId, prefill) {
    var node = NODES[nodeId];
    if (!node) return;
    var rec = { id: nodeId, els: [], timers: [] };
    history.push(rec);
    updateProgress(nodeId);

    var msgs = botGroup(rec);
    var i = 0;
    function nextMsg() {
      if (i >= node.bot.length) {
        renderInput(rec, node, prefill);
        return;
      }
      var m = node.bot[i];
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

  /* ── The answering UI for the current node ── */
  function renderInput(rec, node, prefill) {
    var ui;

    if (node.type === 'choice') {
      ui = document.createElement('div');
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

    } else if (node.type === 'rating') {
      ui = document.createElement('div');
      ui.className = 'chat-choices chat-in';
      for (var n = 1; n <= 10; n++) {
        (function (val) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'chat-choice chat-choice-rate';
          btn.textContent = String(val);
          btn.addEventListener('click', function () {
            answer(rec, node, String(val), val + ' out of 10');
          });
          ui.appendChild(btn);
        })(n);
      }
      var scale = document.createElement('div');
      scale.className = 'chat-scale-labels';
      scale.innerHTML = '<span>Beginner</span><span>Expert</span>';
      ui.appendChild(scale);

    } else if (node.type === 'confirm') {
      ui = document.createElement('div');
      ui.className = 'chat-choices chat-in';
      var send = document.createElement('button');
      send.type = 'button';
      send.className = 'btn btn-primary';
      send.textContent = node.label;
      send.addEventListener('click', function () {
        submit(send, node.label);
      });
      ui.appendChild(send);

    } else {
      /* text, email, textarea */
      ui = document.createElement('div');
      ui.className = 'chat-input-area chat-in';
      var row = document.createElement('div');
      row.className = 'chat-input-row';

      var field;
      if (node.type === 'textarea') {
        field = document.createElement('textarea');
        field.className = 'form-textarea';
        field.rows = 3;
      } else {
        field = document.createElement('input');
        field.className = 'form-input';
        field.type = node.type === 'email' ? 'email' : 'text';
      }
      field.placeholder = node.placeholder || '';
      if (node.autocomplete) field.setAttribute('autocomplete', node.autocomplete);
      field.setAttribute('aria-label', node.section + ' answer');
      if (prefill) field.value = prefill;

      var sendBtn = document.createElement('button');
      sendBtn.type = 'button';
      sendBtn.className = 'chat-send';
      sendBtn.setAttribute('aria-label', 'Send answer');
      sendBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>';

      var err = document.createElement('span');
      err.className = 'form-error-msg';
      err.setAttribute('role', 'alert');

      function trySend() {
        var val = field.value.trim();
        if (!val) {
          if (node.optional) { answer(rec, node, '', node.skipLabel || 'Skipped'); return; }
          fail(node.errorMsg || 'Please fill this in to continue.');
          return;
        }
        if (node.type === 'email' && !isValidEmail(val)) {
          fail('Please enter a valid email address.');
          return;
        }
        answer(rec, node, val, val);
      }

      function fail(msg) {
        field.classList.add('field-error');
        err.textContent = msg;
        err.classList.add('visible');
        react('oops', 900);
        field.focus({ preventScroll: true });
      }

      sendBtn.addEventListener('click', trySend);
      field.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          trySend();
        }
      });
      field.addEventListener('input', function () {
        field.classList.remove('field-error');
        err.classList.remove('visible');
      });

      row.appendChild(field);
      row.appendChild(sendBtn);
      ui.appendChild(row);
      ui.appendChild(err);

      if (node.optional) {
        var skip = document.createElement('button');
        skip.type = 'button';
        skip.className = 'chat-skip';
        skip.textContent = node.skipLabel || 'Skip this question';
        skip.addEventListener('click', function () {
          answer(rec, node, field.value.trim(), field.value.trim() || node.skipLabel || 'Skipped');
        });
        ui.appendChild(skip);
      }

      window.setTimeout(function () {
        field.focus({ preventScroll: true });
      }, 0);
    }

    rec.inputUI = ui;
    thread.appendChild(ui);
    rec.els.push(ui);
    scrollToShow(ui);
  }

  /* ── An answer: echo it, react, maybe acknowledge, move on ── */
  function answer(rec, node, value, label) {
    if (node.name) answers[node.name] = value;
    if (node.setPath) activePath = node.setPath(value);

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
    edit.addEventListener('click', function () {
      rewindTo(rec);
    });
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble-user';
    bubble.textContent = label;
    row.appendChild(edit);
    row.appendChild(bubble);
    thread.appendChild(row);
    rec.els.push(row);
    scrollToShow(row);
    react('done', 900);

    var ackHtml = node.ack ? node.ack(value) : null;
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

  /* ── Rewind: remove everything from a question onward and ask it again ── */
  function rewindTo(rec) {
    var idx = history.indexOf(rec);
    if (idx < 0) return;
    var node = NODES[rec.id];
    var prev = node.name ? answers[node.name] : null;

    for (var j = history.length - 1; j >= idx; j--) {
      var r = history[j];
      r.timers.forEach(window.clearTimeout);
      r.els.forEach(function (e) { e.remove(); });
      var n = NODES[r.id];
      if (n && n.name) delete answers[n.name];
    }
    history.length = idx;

    /* If the fork itself was rewound, the path is undecided again. */
    if (!('intent' in answers)) activePath = 'guided';

    ask(rec.id, (typeof prev === 'string' && prev) ? prev : null);
  }

  /* ── Submission: same Formspree endpoint and field names as the old form ── */
  function submit(btn, idleLabel) {
    btn.disabled = true;
    btn.classList.add('is-busy');
    btn.textContent = 'Sending…';

    var fd = new FormData();
    var gotcha = formEl ? formEl.querySelector('input[name="_gotcha"]') : null;
    fd.append('_gotcha', gotcha ? gotcha.value : '');
    Object.keys(answers).forEach(function (key) {
      fd.append(key, answers[key]);
    });

    fetch('https://formspree.io/f/' + FORMSPREE_ID, {
      method: 'POST',
      body: fd,
      headers: { 'Accept': 'application/json' }
    })
    .then(function (res) {
      if (res.ok) {
        showThankyou();
      } else {
        return res.json().then(function (json) {
          throw new Error(json.errors ? json.errors.map(function (e) { return e.message; }).join(', ') : 'Submission failed');
        });
      }
    })
    .catch(function () {
      btn.disabled = false;
      btn.classList.remove('is-busy');
      btn.textContent = idleLabel;
      react('oops', 1200);
      var msg = 'Something went wrong. Please try again or email us at questions@otianai.com';
      // The page binds the shared status toast (see questionnaire/index.html); the alert is
      // only the fallback for the module never having loaded.
      if (window.otianQuestionnaireStatus) window.otianQuestionnaireStatus(msg, 'error');
      else alert(msg);
    });
  }

  function showThankyou() {
    var intent = answers.intent;
    var guidedBlock = document.getElementById('thankyouGuided');
    var roadmapBlock = document.getElementById('thankyouRoadmap');
    var waitlistBlock = document.getElementById('thankyouWaitlist');
    var bookingSection = document.getElementById('bookingSection');
    if (guidedBlock) guidedBlock.hidden = intent !== 'guided';
    if (roadmapBlock) roadmapBlock.hidden = intent !== 'roadmap';
    if (waitlistBlock) waitlistBlock.hidden = intent !== 'waitlist';
    /* Both consult paths book the same free discovery call; only the waitlist has nothing to book. */
    if (bookingSection) bookingSection.hidden = intent === 'waitlist';

    if (intent !== 'waitlist') {
      var firstName = String(answers.fullName || '').trim().split(' ')[0] || 'there';
      var nameEl = document.getElementById('thankyouName');
      var nameElRoadmap = document.getElementById('thankyouNameRoadmap');
      if (nameEl) nameEl.textContent = firstName;
      if (nameElRoadmap) nameElRoadmap.textContent = firstName;
    }

    if (formEl) formEl.style.display = 'none';
    if (progressWrap) progressWrap.style.display = 'none';
    if (thankyou) thankyou.classList.add('visible');
    window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* ── Init ── */
  ask('audience');
})();
