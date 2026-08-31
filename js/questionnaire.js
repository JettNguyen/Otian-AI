/* ========================================
   Otian AI | Get Started conversation
   js/questionnaire.js

   The intake, staged as a chat with Ember rather than a form. One question at a
   time: Ember's messages arrive behind a typing indicator, answers are tappable
   chips or one inline field, and each answer echoes back as the reader's own
   bubble with an edit control that rewinds the thread to that question.

   Three doors, all shown to everyone: the Archie waitlist (short path), the
   guided-setup intake, or the consulting intake, whose questions adapt to whether
   the opening answer said business or "just me" (the setup they describe is what
   consulting sorts on, not their headcount). The fork decides which sequence of
   questions runs, and every path ends
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
        'Hi, I’m Ember. A few quick questions and we’ll point you to the right place. Change any answer as we go.',
        'First: who would your agent work for? (An agent is AI that does tasks for you, like sorting email, rather than just answering questions.)'
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
      /* All three doors show to everyone. The third one used to be business-only, on the
         reasoning that a "just me" visitor had no use for a roadmap. That was wrong, and it was
         wrong in the one direction that costs us: Consulting sorts on how tangled the setup is,
         not on headcount, and the first person we sold it to was an individual with a household,
         a rental and side projects. The gate would have routed him away from it. */
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
        opts.push({
          value: 'consulting',
          label: 'I already have a lot running',
          desc: 'Our consulting: for more than one calendar, tools you wired together yourself, or pieces that only keep working because you keep them working. We scope the whole thing in writing before you book anything, then build it in phases.'
        });
        return opts;
      },
      setPath: function (value) { return PATHS[value] ? value : 'guided'; },
      next: function (value) {
        if (value === 'waitlist') return 'wlEmail';
        if (value === 'consulting') return 'bzName';
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
          return 'Thanks for saying. Archie is Mac and Windows today; we’ll tell you if that changes.';
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
          html: '<strong>How pricing works:</strong> the 30-minute discovery call is free. Guided setup is $250 an hour, and a bigger setup takes more sessions, never a higher rate. Archie itself is $30 a month or $299 a year when it ships, and the AI bills pay-as-you-go on your own account. <a href="../archie/pricing/">Every cost, in full</a>.'
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
      next: 'gWork'
    },

    /* Added 2026-08-27. We were preparing for calls knowing the task and not the person, and a
       task means different things depending on whose week it sits in. Worded to be answerable by
       somebody retired or between jobs as easily as by somebody with a title. */
    gWork: {
      section: 'About you',
      bot: ['What do you do? Work, studies, volunteering, running a household: whatever takes up your days.'],
      type: 'text',
      name: 'dailyWork',
      placeholder: 'e.g. Realtor. Or: retired, and I run the HOA.',
      errorMsg: 'A few words is plenty.',
      next: 'gTask'
    },

    gTask: {
      section: 'What you want help with',
      bot: ['Now the interesting part. If your AI agent worked perfectly, what is one task you would love to hand off and never do again?'],
      type: 'textarea',
      name: 'handOffTask',
      placeholder: 'e.g. Going through my inbox every morning. Most of it does not need me. I just want to see what actually matters.',
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
      bot: ['Which computer would the agent run on? It works from your own computer, so it needs one that can stay on.'],
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
          return 'Good to know. Archie runs on Mac and Windows today, so we’ll start there on the call.';
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
      /* The AI usage this does not mention is disclosed in the pricing note on `gName`, which is
         where the money conversation belongs; do not delete that note without moving the
         disclosure here, or this line is left standing alone as an absolute. */
      bot: [
        'Two things are fixed, not settings to find: email always arrives as a draft you send yourself, and calendar changes wait for your approval. It cannot buy anything or move your money.',
        'The rest (sorting, reminders, lists, lookups) just happens and you read the results. How does that sit with you?'
      ],
      type: 'choice',
      name: 'howHandsOn',
      options: [
        { value: 'comfortable', label: 'Good, that’s what I want' },
        { value: 'tell-me', label: 'Fine, if it tells me what it did' },
        { value: 'start-small', label: 'Start with one thing, add as I go' }
      ],
      ack: function (value) {
        if (value === 'start-small') {
          return 'Sensible. We pick the first one together on the call.';
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
      bot: ['Have you used AI tools before? Closest is fine.'],
      type: 'choice',
      name: 'aiExperience',
      options: [
        { value: 'none', label: 'Not yet' },
        { value: 'tried', label: 'Tried one, like ChatGPT' },
        { value: 'regular', label: 'I use them most days' },
        { value: 'builds', label: 'I build with them, or use Claude Code' }
      ],
      ack: function (value) {
        if (value === 'none') {
          return 'Good to know. The free call starts wherever you are.';
        }
        if (value === 'builds') {
          return 'Useful. We’ll skip the introductions, then.';
        }
        return null;
      },
      next: 'gExtra'
    },

    /* One box, asked two ways. "What are you running today?" is the most useful question we have
       for somebody with a dozen cron jobs and a dead end for somebody who has opened ChatGPT once,
       and "anything that eats your time?" is the reverse. The generic version is the fallback, and
       it is what everybody got until 2026-08-27. */
    gExtra: {
      section: 'Closing',
      bot: function (a) {
        if (a.aiExperience === 'regular' || a.aiExperience === 'builds') {
          return ['Last one. What are you running today, and what is not working about it? Tools, scripts, anything you have already automated.'];
        }
        if (a.aiExperience === 'none' || a.aiExperience === 'tried') {
          return ['Last one. Anything else that eats your time? Even if you have no idea whether an agent could help, say it and we will tell you on the call.'];
        }
        return ['Last one. Anything else you would like us to know before your call?'];
      },
      type: 'textarea',
      name: 'anythingElse',
      optional: true,
      skipLabel: 'Nothing to add',
      placeholder: function (a) {
        if (a.aiExperience === 'regular' || a.aiExperience === 'builds') {
          return 'e.g. A dozen scheduled jobs and a coding agent I babysit. Three computers, two of them always on.';
        }
        return 'e.g. Chasing paperwork for my parents. Keeping track of everyone’s schedules.';
      },
      next: 'gConfirm'
    },

    gConfirm: {
      section: 'Closing',
      bot: ['That’s everything. Send your answers, and on the next screen you can pick a time for your free discovery call.'],
      type: 'confirm',
      label: 'Send My Answers'
    },

    /* ── Consulting path ── */

    bzName: {
      section: 'About you',
      bot: [
        {
          note: true,
          html: '<strong>How consulting works:</strong> the 30-minute discovery call is free, and we use it to learn how the whole thing runs and answer what is feasible. The scope (what gets connected, in what order, and how many sessions each phase is estimated at) comes out of that call in writing, and it is yours whether you book or not. Sessions are $250 an hour, the same rate as guided setup.'
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
      section: 'Your setup',
      bot: function (a) {
        return [a.edition === 'personal'
          ? 'What should we call this setup, and what is your part in it?'
          : 'What’s the business called, and what’s your role there?'];
      },
      type: 'text',
      name: 'companyRole',
      placeholder: function (a) {
        return a.edition === 'personal'
          ? 'e.g. the house and the rental, I run all of it'
          : 'e.g. Riverbend Dental, office manager';
      },
      errorMsg: 'Please tell us a little about it.',
      next: 'bzWhat'
    },

    bzWhat: {
      section: 'Your setup',
      bot: function (a) {
        return [a.edition === 'personal'
          ? 'What is it you are running? A sentence is plenty.'
          : 'What does the business do? A sentence is plenty.'];
      },
      type: 'textarea',
      name: 'businessDescription',
      placeholder: function (a) {
        return a.edition === 'personal'
          ? 'e.g. A house, a rental I manage, and two side projects, on three computers.'
          : 'e.g. Independent dental practice, two locations, about 4,000 patients.';
      },
      errorMsg: 'Please tell us a little about it.',
      next: 'bzSize'
    },

    bzSize: {
      section: 'Your setup',
      bot: function (a) {
        return [a.edition === 'personal'
          ? 'Besides you, who else would be using it?'
          : 'How many people work there?'];
      },
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
      bot: function (a) {
        return [a.edition === 'personal'
          ? 'What are you holding together right now that you would rather not be? The thing that only works because you keep it working is exactly what we are looking for.'
          : 'Where does the team’s time go that it shouldn’t? If you already suspect a task an agent could take over, describe it. If you have no idea, that’s normal; finding it is what the free call is for.'];
      },
      type: 'textarea',
      name: 'timeSinks',
      optional: true,
      skipLabel: 'I’m not sure, that’s what I want help with',
      placeholder: 'e.g. Rekeying orders between systems, chasing invoices, the same ten customer questions.',
      next: 'bzTools'
    },

    bzTools: {
      section: 'Where to start',
      bot: function (a) {
        return [a.edition === 'personal'
          ? 'Last one. What is it all running on today? Whatever comes to mind is enough, computers included.'
          : 'Last one. What tools does the business already run on? Whatever comes to mind is enough.'];
      },
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
    guided: ['audience', 'intent', 'gName', 'gEmail', 'gWork', 'gTask', 'gTime', 'gPlatform', 'gApproval', 'gTech', 'gAI', 'gExtra', 'gConfirm'],
    consulting: ['audience', 'intent', 'bzName', 'bzEmail', 'bzCompany', 'bzWhat', 'bzSize', 'bzPain', 'bzTools', 'bzConfirm']
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
    /* Like `options`, a node's messages may be a function of what has been answered so far. One
       question that reads differently to a beginner and to somebody running their own scripts is
       better than two nodes, which the progress bar would have to count as two. */
    var bot = (typeof node.bot === 'function') ? node.bot(answers) : node.bot;
    var i = 0;
    function nextMsg() {
      if (i >= bot.length) {
        renderInput(rec, node, prefill);
        return;
      }
      var m = bot[i];
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
      field.placeholder = (typeof node.placeholder === 'function' ? node.placeholder(answers) : node.placeholder) || '';
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
    var consultingBlock = document.getElementById('thankyouConsulting');
    var waitlistBlock = document.getElementById('thankyouWaitlist');
    var bookingSection = document.getElementById('bookingSection');
    if (guidedBlock) guidedBlock.hidden = intent !== 'guided';
    if (consultingBlock) consultingBlock.hidden = intent !== 'consulting';
    if (waitlistBlock) waitlistBlock.hidden = intent !== 'waitlist';
    /* Both consult paths book the same free discovery call; only the waitlist has nothing to book. */
    if (bookingSection) bookingSection.hidden = intent === 'waitlist';

    if (intent !== 'waitlist') {
      var firstName = String(answers.fullName || '').trim().split(' ')[0] || 'there';
      var nameEl = document.getElementById('thankyouName');
      var nameElConsulting = document.getElementById('thankyouNameConsulting');
      if (nameEl) nameEl.textContent = firstName;
      if (nameElConsulting) nameElConsulting.textContent = firstName;
    }

    if (formEl) formEl.style.display = 'none';
    if (progressWrap) progressWrap.style.display = 'none';
    if (thankyou) thankyou.classList.add('visible');
    window.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' });
  }

  /* ── Init ── */
  ask('audience');
})();
