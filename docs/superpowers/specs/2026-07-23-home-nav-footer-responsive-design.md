# Home, Navigation, and Footer Responsive Design

## Goal

Restore a balanced homepage after adding the seventh chapter, and make the
site navigation and footer usable and visually compact on mobile screens.

## Scope

The change covers:

- the chapter-edition grid on the homepage;
- the primary site navigation on mobile;
- the site footer on mobile;
- focused source-level tests and the existing full test/build verification.

The desktop navigation and footer appearance, page routes, chapter data, and
the user's in-progress teaching-content changes remain untouched.

## Homepage Chapter Grid

The chapter grid uses four equal columns on desktop. With seven chapters, the
cards form a balanced `4 + 3` arrangement.

Existing responsive behavior remains:

- at 900px and below, use two columns;
- at 600px and below, use one column.

Card content, spacing, borders, and ordering do not change.

## Mobile Navigation

At mobile widths, the navigation header displays the Git Daily logo, theme
button, and menu button in one row. The page links are hidden until the menu
button is activated, then appear as a vertical panel below the header row.

Behavior and accessibility requirements:

- the menu button exposes its state with `aria-expanded`;
- the button identifies the controlled menu with `aria-controls`;
- its accessible label changes between opening and closing the menu;
- activating a page link closes the menu;
- route changes also close the menu;
- the menu button and all links remain keyboard-operable;
- desktop navigation continues to display all links inline and does not show
  the menu button.

The theme button remains available without opening the menu.

## Mobile Footer

The brand introduction spans the full footer width. The three link groups
(`版面`, `主題`, and `讀者`) flow into a compact two-column grid beneath it.
The copyright and typography credits remain stacked in one column.

The footer stays semantic and all links remain directly visible; no accordion
state or additional interaction is introduced.

## Verification

Focused tests assert:

- the homepage desktop grid declares four columns and preserves its two-column
  and one-column breakpoints;
- the navigation contains an accessible mobile menu state and closes on link
  or route changes;
- the mobile footer makes the brand span the grid and uses two link columns.

The full Node test suite and production build must pass. Because no connected
browser is available in the current environment, visual browser screenshots
are outside this verification run; the implementation will be validated
through component structure, responsive CSS, tests, and build output.
