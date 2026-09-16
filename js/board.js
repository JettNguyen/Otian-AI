/* The assistants board on /compare/: the reader holds the weights.
 *
 * WHY THIS EXISTS AT ALL. A leaderboard whose method nobody can see is an advertisement with a
 * table around it, which is what the competitor page this answers actually is: four products,
 * six "category winner" rows, no citation, no date, and the company publishing it wins. The
 * honest version of the same artifact is not "no ranking". It is a ranking whose method is on
 * the page and whose knobs are in the reader's hands, because a control the reader works beats
 * two hundred words asking them to trust the weighting.
 *
 * THE RESTING STATE IS THE WHOLE BOARD. Every row ships in the markup, already scored on all six
 * tests and already sorted, so a crawler, an answer engine, a reader with JavaScript off and a
 * link preview all see a complete, correct, ranked table. This file only re-sorts what is
 * already there. If it never loads, nothing is missing; the reader just cannot change the
 * question. That is the glossary's "Entries shown: 0" lesson, which this site has now learned
 * three times.
 *
 * A POINT IS FOR SOMETHING PUBLISHED. The data-* flags are set from the company's own page and
 * a zero means "their page does not say", never "the product cannot". Several of these products
 * are certainly better than their marketing pages admit. Scoring silence as a failure would be
 * the same error as scoring it as a pass, so the page says which it is doing.
 */

const table = document.getElementById("boardTable");
const body = document.getElementById("boardBody");
const bar = document.getElementById("boardTests");
if (table && body && bar) {
  const chips = Array.from(bar.querySelectorAll("[data-test]"));
  const rows = Array.from(body.querySelectorAll("tr"));

  // The name cell carries the row, so it is what breaks a tie. Alphabetical rather than anything
  // of ours: a tiebreak that quietly floated Archie up would be the rigging this page is about.
  const nameOf = (row) => (row.cells[0].textContent || "").trim();

  function render() {
    const live = chips.filter((c) => c.getAttribute("aria-pressed") === "true")
                      .map((c) => c.dataset.test);

    rows.forEach((row) => {
      const score = live.reduce((n, test) => n + (row.dataset[test] === "1" ? 1 : 0), 0);
      row.dataset.total = String(score);
      const cell = row.cells[row.cells.length - 1];
      const num = cell.querySelector(".cost-use");
      if (num) num.textContent = String(score);
      // "of 6" has to move with the tests, or a board counting two says every row failed four.
      cell.lastChild.textContent = " of " + live.length;
    });

    rows.sort((a, b) => {
      const d = Number(b.dataset.total) - Number(a.dataset.total);
      return d !== 0 ? d : nameOf(a).localeCompare(nameOf(b));
    });
    rows.forEach((row) => body.appendChild(row));
  }

  bar.addEventListener("click", (event) => {
    const chip = event.target.closest("[data-test]");
    if (!chip) return;
    const on = chip.getAttribute("aria-pressed") === "true";
    // Every test off would rank ten products on nothing and read as a bug rather than a choice,
    // so the last one on stays on.
    if (on && chips.filter((c) => c.getAttribute("aria-pressed") === "true").length === 1) return;
    chip.setAttribute("aria-pressed", String(!on));
    chip.classList.toggle("is-active", !on);
    render();
  });
}
