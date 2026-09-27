# Otian product brand

Current direction, September 27, 2026. Applies to otianai.com, Archie on Mac and
Windows, and Archie Mobile on iOS and Android. RESTYLE.md records the website's
earlier rollout; this document resolves its conflicting brand directions.

## Identity

Otian AI makes agents people can shape around their own work. Archie runs on the
person's computer. Express that with specific tasks, visible work, and clear
controls. Let the product demonstrate its value before asking the reader to
believe an adjective.

Keep the existing Otian mark, Archie marks, Ember, and approved ownership tagline.
They are the recognizable parts of this brand. Use Ember as an agent's identity
and an occasional guide, with room around it.

Product names are **Archie**, **Archie for Business**, and **Archie Mobile**.
Otian AI is the company and account name. Platform names describe availability;
they are not separate product brands.

Archie remains in testing. Downloads are testing builds. A polished illustration
or screen must not imply that paid public signup or an unfinished feature is open.

## Visual language

- Warm cream and white surfaces in light mode; warm charcoal and lifted charcoal
  surfaces in dark mode. Use the existing tokens, not near-matching new colors.
- Terracotta identifies Archie and its main actions. Business uses the existing
  slate accent. Skills use terracotta, routines teal, and personalities plum.
- Status color describes a state and always accompanies words or an icon.
  Use ink shades for small text; a decorative accent is not automatically legible.
- Serif display headings give the brand its character. Use the established sans
  serif for controls and reading. On Android, request the system serif explicitly.
- Align related rows, labels, card edges, and action groups. Equal importance gets
  equal visual weight. Symmetry should support reading order and fit real content.
- Use the existing spacing, radius, and elevation scales. Whitespace separates
  tasks; it should not force a reader past an oversized title to reach the task.
- Give each decision region one clear primary action. Secondary actions are quieter.
  Destructive actions name the consequence, such as Unpair this phone or Close Archie.

Mac and iOS share the Apple arrangement already in the products: grouped surfaces,
native navigation, and deeper accent ink. Windows and Android keep their established
control treatments. Their terminology, status meanings, content order, and color
families agree. Do not force identical control shapes across platforms.

On the website, section eyebrows use terracotta. Supporting links and diagram
wayfinding may use the existing blue ink. Business and status treatments keep their
own meanings. Blue does not mean a claim has been independently verified.

## Writing

Name the task, state what happened, and give the next action. A sign-in screen says
Sign in to Archie. A country field says Country or region. An error explains what
the person can try and keeps technical detail secondary.

Use short sentence-case titles. Put qualifications beside the relevant action,
price, or permission. Keep persistent field labels visible after typing. Use the
exact tab and button names people will find on the other device.

Cut generic welcomes, superlatives, introductions to the introduction, and commentary
about how candid or thoughtful the company is. Preserve the underlying facts and
limitations. Friendly does not require filler, exclamation marks, or an agent voice
in account and security controls.

Use American spelling. Avoid em and en dashes in authored copy. Public claims still
follow FACTS.md, TRUST.md, and the existing approval rules. This visual standard
does not revise privacy policies, assessment evidence, or permission boundaries.

## Product scenes and checks

Use realistic sample work and current product labels. Identify sample agents and
illustrative states. Keep a dated reference to the build or source revision when
capturing release and store images; a marketing drawing is not proof of a feature.

Check light and dark themes, narrow screens, long names, empty/loading/error states,
reduced motion, and enlarged text. Small status text needs at least 4.5:1 contrast.
Shared phone buttons have minimum heights of 44 points on iOS and 48 on Android.
Screen readers need roles and busy, disabled, selected, or checked state as applicable.

Current values live in css/styles.css, the desktop's src/styles/globals.css, and
the mobile app's src/theme.ts. These are still separate implementations. Changing
the brand requires checking each; a generated cross-repository token source remains
future work, not a guarantee made by this document.
