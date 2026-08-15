/* Ask Otian: an inline chat on the FAQ page for questions the accordions don't cover.
 *
 * This is only the front half. It talks to ONE endpoint over a deliberately small contract,
 * so the back half (a sandboxed OpenClaw support agent, reachable through a web-channel bridge)
 * can be swapped in without touching this file:
 *
 *     POST <endpoint>
 *       body:  { "message": "<the visitor's question>", "session": "<opaque id>" }
 *       reply: { "reply": "<the agent's answer>" }   (HTTP 200)
 *              { "error": "<short reason>" }          (any non-2xx)
 *
 * The bridge long-polls: it holds the request open until the agent has answered (OpenClaw
 * channels are async under the hood), then returns the text. The widget just awaits the JSON.
 *
 * The endpoint is read from data-endpoint on #askOtian. While that is empty the widget runs in
 * DEMO mode: it answers with a canned line so the interface can be seen and placed before the
 * agent is live. Nothing here holds a key or reaches a model directly; a static page never could.
 *
 * Privacy posture: the request carries no cookies or credentials (a cross-origin POST omits them
 * by default and we never set credentials:"include"; the endpoint rejects credentialed calls). The
 * visitor's message is never logged or stored on the client. The only thing persisted is an opaque
 * session id in sessionStorage, which the browser clears when the tab closes.
 */
(function () {
  var root = document.getElementById("askOtian");
  if (!root) return;

  var log = document.getElementById("askOtianLog");
  var form = document.getElementById("askOtianForm");
  var input = document.getElementById("askOtianInput");
  var send = document.getElementById("askOtianSend");
  var count = document.getElementById("askOtianCount");
  if (!log || !form || !input || !send) return;

  var endpoint = (root.getAttribute("data-endpoint") || "").trim();
  var DEMO = endpoint === "";

  var MAXLEN = 4000; // matches the server's cap; the textarea also carries maxlength="4000"
  var HUMAN = "questions@otianai.com"; // the human route out, repeated in every failure

  // An opaque per-visit id so the agent can keep one conversation's turns together. Not an
  // account, not stored beyond the tab: sessionStorage clears when the tab closes.
  var session = "";
  try {
    session = sessionStorage.getItem("otian-ask-session") || "";
    if (!session) {
      session =
        (window.crypto && crypto.randomUUID && crypto.randomUUID()) ||
        String(Date.now()) + "-" + Math.round(performance.now());
      sessionStorage.setItem("otian-ask-session", session);
    }
  } catch (e) {
    session = "ephemeral";
  }

  var pending = false; // one question in flight at a time
  var cooling = false; // brief send lock after a rate-limit reply
  var cooldownTimer = null;
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function scrollDown() {
    if (log.scrollTo) {
      log.scrollTo({ top: log.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
    } else {
      log.scrollTop = log.scrollHeight;
    }
  }

  // Text only, inserted as textContent, never innerHTML: the reply is untrusted (it is model
  // output, and in DEMO mode it echoes the visitor). No markup path in, no injection. Newlines
  // survive and render because the bubble is styled white-space: pre-wrap.
  function addMessage(who, text) {
    var row = document.createElement("div");
    row.className = "ask-otian-msg ask-otian-msg--" + who;
    var bubble = document.createElement("div");
    bubble.className = "ask-otian-bubble";
    bubble.textContent = text;
    row.appendChild(bubble);
    log.appendChild(row);
    scrollDown();
    return row;
  }

  function showTyping() {
    var row = document.createElement("div");
    row.className = "ask-otian-msg ask-otian-msg--bot ask-otian-typing";
    row.setAttribute("aria-hidden", "true"); // the aria-busy state on the log is the SR signal
    row.innerHTML =
      '<div class="ask-otian-bubble"><span class="ask-otian-dot"></span>' +
      '<span class="ask-otian-dot"></span><span class="ask-otian-dot"></span></div>';
    log.appendChild(row);
    log.setAttribute("aria-busy", "true");
    scrollDown();
    return row;
  }

  function setPending(state) {
    pending = state;
    input.disabled = state;
    send.disabled = state || cooling; // a cooldown keeps send locked even after the request settles
    root.classList.toggle("is-pending", state);
  }

  // Grow the textarea with its content, up to a cap, so long questions are readable.
  function autosize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 140) + "px";
  }

  // Show how much room is left only as the visitor nears the cap, and flag when they hit it.
  // Held quiet during a cooldown so the countdown message there stays put.
  function updateCount() {
    if (!count || cooling) return;
    var left = MAXLEN - input.value.length;
    if (left <= 0) {
      count.textContent = "Character limit reached";
      count.classList.add("is-warn");
    } else if (left <= 200) {
      count.textContent = left + " left";
      count.classList.remove("is-warn");
    } else {
      count.textContent = "";
      count.classList.remove("is-warn");
    }
  }

  // Lock send for a short window after a 429, counting down so the visitor knows why. The seconds
  // come from the server's Retry-After when present, clamped to something sane if it is missing.
  function startCooldown(secs) {
    secs = Math.max(1, Math.min(Math.round(secs || 60), 120));
    cooling = true;
    send.disabled = true;
    if (cooldownTimer) clearInterval(cooldownTimer);
    var remaining = secs;
    var tick = function () {
      if (count) {
        count.textContent = "You can ask again in " + remaining + "s";
        count.classList.add("is-warn");
      }
    };
    tick();
    cooldownTimer = setInterval(function () {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(cooldownTimer);
        cooldownTimer = null;
        cooling = false;
        if (!pending) send.disabled = false;
        if (count) count.classList.remove("is-warn");
        updateCount();
        input.focus();
      } else {
        tick();
      }
    }, 1000);
  }

  function ask(message) {
    // DEMO: no endpoint yet. Answer locally so the interaction can be previewed.
    if (DEMO) {
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(
            "Thanks, that came through. This is a preview of the Ask Otian interface. Once it is " +
              "connected to our agent, a real answer about Archie, pricing, or your data will appear here."
          );
        }, 650);
      });
    }

    var controller = new AbortController();
    var timer = setTimeout(function () {
      controller.abort(); // 60s client timeout; agents long-poll, so be patient before giving up
    }, 60000);

    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, session: session }),
      signal: controller.signal,
      // no credentials on purpose: the endpoint rejects credentialed requests by design
    })
      .then(function (res) {
        clearTimeout(timer);
        // Rate limited: carry the server's Retry-After so the cooldown can honour it.
        if (res.status === 429) {
          var ra = parseInt(res.headers.get("Retry-After"), 10);
          var rate = new Error("rate limited");
          rate.kind = "rate";
          rate.retryAfter = isNaN(ra) ? 60 : ra;
          throw rate;
        }
        // Gateway timeout: the agent took too long on the server's side.
        if (res.status === 504) {
          var gw = new Error("gateway timeout");
          gw.kind = "timeout";
          throw gw;
        }
        return res.json().then(
          function (data) {
            if (!res.ok || !data || typeof data.reply !== "string") {
              var bad = new Error((data && data.error) || "bad response");
              bad.kind = "server";
              throw bad;
            }
            return data.reply;
          },
          function () {
            var pj = new Error("bad response"); // 200 but not JSON, or a truncated body
            pj.kind = "server";
            throw pj;
          }
        );
      })
      .catch(function (err) {
        clearTimeout(timer);
        if (err && err.kind) throw err; // already classified above
        // fetch itself rejected: our manual abort is the 60s client timeout, anything else is the network
        var e = new Error("unreachable");
        e.kind = err && err.name === "AbortError" ? "timeout" : "network";
        throw e;
      });
  }

  // One friendly line per failure mode. No status codes, no stack traces; a human route on the
  // two the visitor can do nothing about.
  function messageFor(kind) {
    if (kind === "rate") {
      return "That's a lot of questions in a short time. Give it a minute, then ask again.";
    }
    if (kind === "timeout") {
      return "That one took too long to come back. Please try asking again in a moment.";
    }
    if (kind === "server") {
      return "Sorry, our assistant had trouble answering. Please try again, or email " + HUMAN + " and a person will help.";
    }
    return "Sorry, I couldn't reach our assistant. Check your connection and try again, or email " + HUMAN + ".";
  }

  function submit() {
    if (pending || cooling) return;
    var message = input.value.trim();
    if (!message) return;
    // Client-side cap. The textarea's maxlength stops typing past it; this also catches a value
    // set some other way (paste quirks, automation) so an over-long message never reaches the server.
    if (message.length > MAXLEN) {
      addMessage("bot", "That message is over the " + MAXLEN + "-character limit. Please shorten it and send again.");
      return;
    }

    addMessage("user", message);
    input.value = "";
    autosize();
    updateCount();
    setPending(true);
    var typing = showTyping();

    ask(message)
      .then(function (reply) {
        typing.remove();
        log.removeAttribute("aria-busy");
        addMessage("bot", reply);
      })
      .catch(function (err) {
        typing.remove();
        log.removeAttribute("aria-busy");
        var kind = (err && err.kind) || "network";
        addMessage("bot", messageFor(kind));
        if (kind === "rate") startCooldown(err.retryAfter);
      })
      .then(function () {
        setPending(false);
        if (!cooling) input.focus();
      });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    submit();
  });

  // Enter sends; Shift+Enter makes a newline. Matches every chat box people already know.
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  });

  input.addEventListener("input", function () {
    autosize();
    updateCount();
  });

  // Opening greeting. It also carries the up-front disclosure that this is an automated assistant,
  // not a person: given before the first exchange, not only when the visitor thinks to ask.
  addMessage(
    "bot",
    "Hi, I'm Otian's assistant, an automated helper, not a person. Ask me about Archie, pricing, or " +
      "how your data is handled. Answers can be imperfect, so for anything sensitive or account-specific, " +
      "email " + HUMAN + "."
  );
})();
