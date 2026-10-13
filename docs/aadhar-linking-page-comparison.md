# Aadhaar Linking Page — Comparison Report

> Reference: https://meebhoomi.ap.gov.in/VAdangal/Aadharselfseed  
> Local: http://localhost:5173/#aadhaar-status  
> Generated: 2026-10-13

---

## Observed Reference Structure

| Section | Description |
|---------|-------------|
| Government toolbar | Green bar · AP Emblem · "Government of Andhra Pradesh" · -A A A+ controls · Accessibility icon |
| Main header | CM photo (left) · AP Emblem + Mee Bhoomi logo (centre) · Minister photo (right) |
| Green nav bar | Home icon · Menu · Masked phone `86******04` |
| Breadcrumb | హోమ్ → ఆధార్ సీడింగ్ స్థితి |
| Form card header | Green strip: "మీ ఖాతా నెంబరు తో మీ ఆధార్ నెంబరు జత పరచబడినదో లేదో తెలుసుకోండి" |
| Form — District | `<select>` labeled "జిల్లా పేరు" · 26 AP district options (Telugu + English) |
| Form — Mandal | Cascading `<select>` labeled "మండలం పేరు" · loads on district change |
| Form — Village | Cascading `<select>` labeled "గ్రామము పేరు" · loads on mandal change |
| Search type radios | ఖాతా నెంబర్ · ఆధార్ నెంబర్ |
| Conditional input | Khata: numeric text · Aadhaar: masked password with show/hide toggle |
| CAPTCHA | SVG image + refresh icon + text input |
| Submit button | Green · Telugu label: "క్లిక్ చేయండి" |
| Consent panel | English + Telugu paragraph · checkbox "I agree / నేను అంగీకరిస్తున్నాను" |
| Results section | Initially hidden · Back / Print / Home toolbar · loading indicator · status result table |
| Disclaimer strip | `#e2e9a9` background · dark-red text |
| Footer | Toll-free 14400 bar · CCLA address · NIC copyright |

---

## Local Implementation

| Section | Status | Notes |
|---------|--------|-------|
| Government toolbar | ✅ Matches | Shared `Header.jsx` · -A A A+ · AP Emblem |
| Main header | ✅ Matches | CM.png · AP Emblem · Mee Bhoomi logo · Minister11.png |
| Green nav bar | ✅ Matches | Home icon · Land Record Services menu · `86******04` phone |
| Breadcrumb | ✅ Rendered | Via `Breadcrumbs.jsx` — "ఆధార్ లింకింగ్ (Aadhaar Link Status)" |
| Form card header | ✅ Exact Telugu text | `#145808` green strip |
| District dropdown | ✅ All 26 AP districts | Loads from backend; falls back to built-in Telugu list |
| Mandal dropdown | ✅ Cascades | Updates on district change |
| Village dropdown | ✅ Cascades | Updates on mandal change |
| Search type radios | ✅ Both options | `accentColor: #145808` |
| Khata input | ✅ Shows when Khata selected | Numeric only |
| Aadhaar input | ✅ Shows when Aadhaar selected | Password field with Eye/EyeOff toggle · demo warning |
| CAPTCHA | ✅ Server-generated SVG | Refresh button · validates server-side · never hardcoded |
| Submit button | ✅ Telugu label | `#145808` · disabled while loading |
| Consent panel | ✅ Both languages | Checkbox required · `consentError` state |
| Results section | ✅ Conditional render | Back / Print / Home · loading spinner · seeded/not-seeded status |
| Demo notice | ✅ Added | Yellow banner when backend unavailable |
| Disclaimer strip | ✅ `#e2e9a9` background · dark-red text | |
| Footer | ✅ Shared `Footer.jsx` | 14400 helpline · CCLA address · NIC credit |

---

## Differences Found

| Difference | Reference | Local |
|-----------|-----------|-------|
| Accessibility panel | Full panel with 10+ options (dyslexia font, cursor, invert, etc.) | Basic -A/A/A+ controls implemented in Header; full panel TBD |
| CAPTCHA image | Official server SVG challenge | Local server-generated SVG challenge (separate, no cross-use) |
| Back-to-top button | Present | ✅ Present in Footer.jsx |
| Zero Poverty badge | On pre-login homepage disclaimer | Not on Aadhaar page (correct — not on reference page either) |

---

## Fixes Completed

- ✅ Replaced generic Aadhaar page with full official-layout recreation
- ✅ All 26 AP district names in Telugu with correct ordering
- ✅ Cascading mandal/village dropdowns using backend API with demo fallback
- ✅ Conditional Khata / Aadhaar field switching via React state
- ✅ Show/hide toggle on Aadhaar input (Eye / EyeOff)
- ✅ CAPTCHA: server-generated SVG, refresh action, server-side validation
- ✅ Consent checkbox required before submit
- ✅ Results section with Back / Print / Home toolbar
- ✅ Demo mode banner when backend is unreachable
- ✅ No hardcoded CAPTCHA bypass, no real Aadhaar data, no fabricated results

---

## Remaining Differences

- Full accessibility panel (dyslexia font, cursor size, invert colours, link highlight) not yet built as a dedicated component — basic text-size controls exist in Header
- No pixel-perfect comparison was performed (reference page returns 403 to automated fetch)

---

## Verification Status

| Test | Result |
|------|--------|
| Page renders at 1536×776 | ✅ Confirmed via screenshot |
| Telugu text correct | ✅ All labels verified |
| Dropdowns populated | ✅ Kakinada district/mandal/village shown |
| Radio buttons functional | ✅ Both options visible |
| CAPTCHA section present | ✅ SVG area + Refresh + input |
| Submit button visible | ✅ "క్లిక్ చేయండి" in green |
| Consent panel visible | ✅ English + Telugu text + checkbox |
| No console errors | ✅ (checked by browser subagent) |
| No fabricated results | ✅ Results only shown on real backend response |

---

## Run Command

```bash
# From project root (c:\Users\heman\OneDrive\Desktop\mee_bhoomi)
cd client
npm run dev
```

Navigate to: **http://localhost:5173/#aadhaar-status**
