/* The assistants board on /compare/: the reader holds the weights.
 *
 * WHY THIS EXISTS AT ALL. A leaderboard whose method nobody can see is an advertisement with a
 * table around it, which is what the competitor page this answers actually is: four products,
 * six "category winner" rows, no citation, no date, and the company publishing it wins. The
 * honest version of the same artifact is not "no ranking". It is a ranking whose method is on
 * the page and whose knobs are in the reader's hands, because a control the reader works beats
 * two hundred words asking them to trust the weighting.
 *
 * ONE SORT DRIVES BOTH. The figure and the table are the same ranking drawn twice, so the order
 * is computed once here and applied to both. Two sorts would eventually disagree, and a page
 * whose drawing and whose table rank differently has destroyed the thing it is selling.
 *
 * THE RESTING STATE IS THE WHOLE BOARD. Every row ships in the markup, already scored on all six
 * tests, already sorted, and in the figure already sitting at its place with its pips filled. A
 * crawler, an answer engine, a reader with JavaScript off and a link preview all see a complete,
 * correct, ranked board. This file only moves what is already there, by offsets measured from the
 * positions the markup wrote down. If it never loads, nothing is missing; the reader just cannot
 * change the question. That is the glossary's "Entries shown: 0" lesson, which this site has now
 * learned three times.
 *
 * TIES SHARE A PLACE. Three products level on five tests are 1, 1, 1 and the next is 4. Numbering
 * them 1, 2, 3 would invent a winner out of alphabetical order, which is the exact move this page
 * exists to refuse.
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
  const boards = Array.from(document.querySelectorAll("[data-board]"));

  // The name cell carries the row, so it is what breaks a tie in the sort. Alphabetical rather
  // than anything of ours: a tiebreak that quietly floated Archie up would be the rigging this
  // page is about. It decides the printing order of a tie, never the place number.
  const nameOf = (row) => (row.cells[0].textContent || "").trim();

  function ranked(live) {
    const scored = rows.map((row) => ({
      row,
      key: row.dataset.key,
      score: live.reduce((n, test) => n + (row.dataset[test] === "1" ? 1 : 0), 0),
    }));
    scored.sort((a, b) => b.score - a.score || nameOf(a.row).localeCompare(nameOf(b.row)));
    let place = 0;
    scored.forEach((entry, i) => {
      if (i === 0 || entry.score !== scored[i - 1].score) place = i + 1;
      entry.place = place;
    });
    return scored;
  }

  function paintTable(order, live) {
    order.forEach(({ row, score }) => {
      const cell = row.cells[row.cells.length - 1];
      const num = cell.querySelector(".cost-use");
      if (num) num.textContent = String(score);
      // "of 6" has to move with the tests, or a board counting two says every row failed four.
      cell.lastChild.textContent = " of " + live.length;
      body.appendChild(row);
    });
  }

  function paintBoard(svg, order, live) {
    const pitch = Number(svg.dataset.pitch);
    const nest = svg.querySelector(".rk-rows");
    const places = Array.from(svg.querySelectorAll(".rk-rank"));
    const moved = [];

    order.forEach((entry, slot) => {
      places[slot].textContent = String(entry.place);

      const group = nest.querySelector('.rk-row[data-key="' + entry.key + '"]');
      if (!group) return;
      // Measured from where the markup put it, so the resting state needs no transform at all.
      const shift = (slot - Number(group.dataset.slot)) * pitch;
      group.style.transform = shift ? "translateY(" + shift + "px)" : "";

      const pips = group.querySelectorAll(".rk-seg");
      pips.forEach((pip, i) => {
        pip.classList.toggle("rk-on", i < entry.score);
        // A pip past the number of live tests is not an empty pip, it is a pip that is not being
        // asked about, so it leaves rather than reading as another thing this product failed.
        pip.classList.toggle("rk-gone", i >= live.length);
      });

      group.querySelector(".rk-num").textContent = String(entry.score);
      group.querySelector(".rk-den").textContent = "of " + live.length;
      moved.push({ group, shift: Math.abs(shift) });
    });

    // SVG has no z-index: paint order is document order. Re-appending shortest travel first puts
    // the name crossing four places on top of the ones it passes, instead of sliding under them.
    moved.sort((a, b) => a.shift - b.shift).forEach(({ group }) => nest.appendChild(group));
  }

  function render() {
    const live = chips.filter((c) => c.getAttribute("aria-pressed") === "true")
                      .map((c) => c.dataset.test);
    const order = ranked(live);
    paintTable(order, live);
    boards.forEach((svg) => paintBoard(svg, order, live));
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
