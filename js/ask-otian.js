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
 */
(function () {
  var root = document.getElementById("askOtian");
  if (!root) return;

  var log = document.getElementById("askOtianLog");
  var form = document.getElementById("askOtianForm");
  var input = document.getElementById("askOtianInput");
  var send = document.getElementById("askOtianSend");
  if (!log || !form || !input || !send) return;

  var endpoint = (root.getAttribute("data-endpoint") || "").trim();
  var DEMO = endpoint === "";

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
  // output, and in DEMO mode it echoes the visitor). No markup path in, no injection.
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
    send.disabled = state;
    root.classList.toggle("is-pending", state);
  }

  // Grow the textarea with its content, up to a cap, so long questions are readable.
  function autosize() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 140) + "px";
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
      controller.abort();
    }, 60000); // agents can take a while; long-poll and be patient

    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message, session: session }),
      signal: controller.signal,
    })
      .then(function (res) {
        clearTimeout(timer);
        if (res.status === 429) {
          var rate = new Error("rate limited");
          rate.rate = true;
          throw rate;
        }
        return res.json().then(
          function (data) {
            if (!res.ok || !data || typeof data.reply !== "string") {
              throw new Error((data && data.error) || "bad response");
            }
            return data.reply;
          },
          function () {
            throw new Error("bad response");
          }
        );
      })
      .catch(function (err) {
        clearTimeout(timer);
        throw err;
      });
  }

  function submit() {
    if (pending) return;
    var message = input.value.trim();
    if (!message) return;

    addMessage("user", message);
    input.value = "";
    autosize();
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
        addMessage(
          "bot",
          err && err.rate
            ? "That's a lot of questions in a short time. Give it a minute, then ask again."
            : "Sorry, something went wrong reaching our assistant. Please try again, or email " +
                "questions@otianai.com and a person will help."
        );
      })
      .then(function () {
        setPending(false);
        input.focus();
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

  input.addEventListener("input", autosize);

  // Opening greeting, so the box reads as a conversation already in progress, not a form.
  addMessage(
    "bot",
    "Hi, I'm Otian's assistant. Ask me anything about Archie, pricing, or how your data is " +
      "handled. I only know what's published on this site."
  );
})();
