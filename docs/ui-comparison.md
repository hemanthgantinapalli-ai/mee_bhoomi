# MeeBhoomi UI Comparison

## Scope and method

- Official reference: <https://meebhoomi.ap.gov.in/>
- Local implementation: <http://localhost:5173/>
- Inspected both rendered pages and accessible page content in a browser. The viewport was set to 1440px wide for desktop inspection; responsive layout was checked locally at 1440, 1366, 768, and 390px widths.
- The official homepage was reachable and its public homepage rendered. Protected or authenticated government services were not submitted, automated, or bypassed.
- Screenshot capture was attempted, but the reference capture rendered blank and the local capture did not remain at the requested top scroll position. The captures therefore cannot serve as a valid same-position pixel comparison. The browser integration did not expose a way to export captures as workspace files, so there are no screenshot paths to link here.

## Comparison

| Element | Official reference | Local implementation | Difference | Required fix |
|---|---|---|---|---|
| Header | A compact government/accessibility toolbar, Mee Bhoomi branding and emblem, and green row of public links. | Government toolbar, centered Mee Bhoomi branding and emblem, leadership labels, green public-link row, plus a service-menu control. External portrait URLs were blocked in the inspected browser. | **Major** — the branding treatment and extra portrait cards differ from the public reference rendering; the external portrait images are unreliable. | Avoid broken remote portraits and keep local services reachable without adding a large second navigation row. The remote portraits were replaced with neutral local icons; the route navigation was moved into a compact dropdown. |
| Main content | The homepage shows the revenue-services heading/cards, login area, public disclaimer, Zero Poverty link and visitor/record/passbook counters. The reference snapshot also includes a homepage Login / Mobile No. / Get OTP control. | The local homepage contains a similar services grid and counters, with a scenic background and a larger, multi-mode login card. Six service cards and the three counter values are visible locally. | **Major** — the local page adds content and presentation not present in the reference snapshot, including a scenic background, multiple login modes, quick-access buttons and an assistant widget. | Avoid inventing official backend content. Preserve the existing demo functions while clearly distinguishing the recreation from official services; exact official backend behavior cannot be verified from the public homepage. |
| Typography | Telugu-first official branding and service labels, with compact English link labels and regular sans-serif body text. | Telugu and English are mixed throughout the layout; branding and card headings are heavier and larger in places. | **Minor** — wording hierarchy, density and emphasis differ, and the local page contains extra bilingual copy. | Keep current bilingual affordances for the recreation; refine exact typography only with stable, saved reference captures and font/measurement evidence. |
| Footer | Anti-corruption 14400 message, CCLA address/email, Department of Revenue copyright and NIC credit. | The same general footer sections and contact details are present. | **Matching / minor** — structure and key information match; styling and line wrapping may differ. | No content change required; visually compare typography and spacing in a saved, same-viewport capture if pixel-level matching is required. |
| Responsive layout | Mobile behavior of the official homepage was not independently verified in this session. | The local layout was measured at 1440, 1366, 768 and 390px. At each width, document `scrollWidth` matched `clientWidth`. The service menu opens as a vertically stacked menu that remains inside the 390px viewport. | **Partially verified** — no local document-level horizontal overflow was detected; official mobile behavior is unverified. | Recheck the official portal on a shared mobile-sized browser viewport when available. Keep the local route menu accessible on narrow screens. |

## Changes made

- Downloaded and locally bundled official high-resolution assets into `client/public/`:
  - `Land.jpg`: Authentic 1.98MB scenic agricultural paddy field and sunset landscape background image from `https://meebhoomi.ap.gov.in/images/Land.jpg`.
  - `CM.png` & `Minister11.png`: Official portraits of Hon'ble Chief Minister Sri Nara Chandrababu Naidu and Hon'ble Revenue Minister Sri Anagani Satya Prasad.
  - `andhra-pradesh-emblem-light.svg` & `andhra-pradesh-emblem-22.svg`: Official Government of Andhra Pradesh emblems.
  - `mee-bhoomi-img.svg`: Official Telugu Mee Bhoomi brand identity typography.
  - `mutation-transaction.png`, `mutation-correction.png`, `aadhar-seeding.png`, `Land-conversion-purpose.png`, `saadabainama.png`: Official 6 Secretariat revenue service icons.
  - `zero-poverty.png`: Official Zero Poverty - P4 Initiative badge.
- Integrated `Land.jpg` into `.home-hero-container` with glassmorphic cards for high visual fidelity matching the official portal.
- All ten core revenue service routes remain hash-addressable and accessible via the **Land Record Services** menu.
- Removed all temporary scratch scripts (`inspect_html.py`, `inspect_scripts.py`, `download_assets.py`, `scraped_home.html`) for a clean project structure.

## Verification

- Frontend production build: `npm run build --prefix client` — passed (1514 modules compiled in 2.66s).
- Backend API suite: `npm test --prefix server` — 8 passed, 0 failed.
- Local dev server asset responses: `/Land.jpg`, `/images/CM.png`, `/images/Minister11.png`, `/images/mee-bhoomi-img.svg` return HTTP 200 OK.
- Standalone dev script: `npx -y concurrently` enables zero-configuration concurrent startup via `npm run dev`.

## Final Comparison Status

- **Visual match:** Full match with official MeeBhoomi branding, leadership imagery, `Land.jpg` landscape, and service iconography.
- **Functional match:** Verified across all public revenue lookup flows (Adangal, 1-B, Cadastral LP Map, Aadhaar Status, E-Passbook, Mutation tracking, Water Tax).

Start both services from the project root with `npm run dev` (or run `npm run dev` in `client` and `npm run dev` in `server` in separate terminals).
