# MeeBhoomi Andhra Pradesh Reference Audit

## 1. Overview and Reference Information
- **Reference URL**: `https://meebhoomi.ap.gov.in/`
- **Official Title**: `AP Land Records | Mee Bhoomi | Adangal, 1B, Survey Number & LP Map`
- **Owner**: Department of Revenue, Government of Andhra Pradesh
- **Design & Hosting**: National Informatics Centre (NIC)
- **Address**: O/o The Chief Commissioner of Land Administration, APIIC Towers, 1st & 3rd Floors, IT Park, Auto Nagar, Mangalagiri, Guntur District - 522503.
- **Support Email**: `ccla-as-cmro@ap.gov.in`
- **Anti-Corruption Toll Free**: `14400`

---

## 2. Visual Architecture & Layout Audit

### 2.1 Top Accessibility Toolbar (`.header-top`)
- **Background**: `#1b5e20` to `#0d3d13` (Dark government green).
- **Left**:
  - Government of Andhra Pradesh link (`https://www.ap.gov.in/`) with external link indicator `↗`.
  - AP Emblem thumbnail (`21x22px`).
- **Right**:
  - Skip to Main Content shortcut (`fa-share` rotated 90°).
  - Font Resizing: `-A` (Decrease), `A` (Normal / active), `A+` (Increase).
  - Accessibility Icon (`fa-wheelchair-move`).
  - Dark/Light Theme toggle switch.

### 2.2 Header Banner (`.main-header`)
- **Background**: Crisp white / light sky gradient.
- **Left Portrait**: Sri Nara Chandrababu Naidu, Hon'ble Chief Minister of Andhra Pradesh (`శ్రీ నారా చంద్రబాబు నాయుడు, గౌ. ముఖ్యమంత్రి వర్యులు - ఆంధ్రప్రదేశ్`).
- **Center**:
  - Andhra Pradesh State Emblem (Lion Capital + Purna Kumbha, `100px` width).
  - Mee Bhoomi Logo Title: **మీ భూమి** (Mee Bhoomi).
  - Subtitle: **భూమి రికార్డుల ప్రజా పోర్టల్** (Land Records Public Portal).
  - Department: **ఆంధ్రప్రదేశ్ రాష్ట్ర ప్రభుత్వం - రెవెన్యూ శాఖ** (Government of AP - Revenue Department).
- **Right Portrait**: Sri Anagani Satya Prasad, Hon'ble Minister for Revenue, Registration & Stamps (`శ్రీ అనగాని సత్య ప్రసాద్, గౌ.రెవెన్యూ, రిజిస్ట్రేషన్స్ & స్టాంపుల శాఖ మంత్రివర్యులు - ఆంధ్రప్రదేశ్`).

### 2.3 Secondary Link Bar (`.link-container`)
- **Background**: `#145808` (Dark forest green), height: `30px` (desktop), wraps on mobile.
- **Links**:
  1. `--> Click Here to Pay Water Tax` (`https://vswsonline.ap.gov.in`)
  2. `--> ORCMS Cause List` (`https://aporcms.ap.gov.in/Login/CauseList`)
  3. `--> Vigilance Login` (`/Login/UIDTestingLoginPage`)
  4. `MeeBhoomi Blockchain` (Blinking text with `#ffff00` gold yellow color).

### 2.4 Main Body Layout
- **Hero / Landscape Background**: Scenic sunset over lush green paddy agricultural fields with mountains in background.
- **Login Card (`.login-register-box`)**:
  - Tabs / Modes: Citizen Login (default), Officials Login, UID / Aadhaar Login.
  - Citizen Fields: 10-digit Mobile Number, "Get OTP" button (with loading spinner state), OTP input (7 digits), Captcha challenge image + input, "Verify OTP" button.
  - Official Fields: User Name, Password, Captcha, OTP.
- **Secretariat Revenue Services Grid (`గ్రామ సచివాలయం మరియు వార్డు సచివాలయం ద్వారా అందుబాటులో గల రెవిన్యూ శాఖ సేవలు`)**:
  1. **Mutation for Transactions** (`mutation-transaction.png`)
  2. **Mutation for Correction** (`mutation-correction.png`)
  3. **Aadhar Seeding** (`aadhar-seeding.png`)
  4. **Land Conversion For Non Agriculture Purpose** (`Land-conversion-purpose.png`)
  5. **Click Here to Pay Water Tax / ORCMS Cause List** (`saadabainama.png`)
  6. **Auto Mutation** (`mutation-transaction.png`)
- **Legal Disclaimer**:
  - Dark red text on `#e2e9a9` yellowish background: Warning against unauthorized scraping/redistribution under copyright laws.
- **Zero Poverty - P4 Initiative**:
  - Banner linking to `https://zeropovertyp4.ap.gov.in/`.

### 2.5 Live Dashboard Metrics
- **Card 1: Site Visitors** (Navy blue card `#001f5c`, digital LCD green/white counters, e.g. `448,779,189`).
- **Card 2: No. of Revenue Records Viewed** (Dark green card `#004d26`, e.g. `167,047,077`).
- **Card 3: Electronic Passbook Downloads** (Gold/Bronze card `#7a5901`, e.g. `638,094`).

### 2.6 Footer
- **Marquee / Toll-Free Alert**: `#8b0000` (Dark red), "ఎవరైన లంచం అడిగిన అవినీతికి పాల్పడిన టోల్ ఫ్రీ నంబర్ 📞 14400 కు ఫిర్యాదు చేయండి" (Anti-Corruption Bureau helpline).
- **Address Panel**: Light gray `#e9ecef`, Chief Commissioner of Land Administration, Mangalagiri.
- **Copyright & NIC Credits**: Dark `#212529`, NIC credit link to `https://www.nic.in/`.
- **Chatbot Assistant**: Floating widget with bilingual (Telugu & English) automated responses for Adangal, 1-B, LP Maps, Pattadar, Passbook, etc.

---

## 3. Core Revenue Services & Form Field Inventory

### 3.1 Your Adangal (మీ అడంగల్) & Village Adangal (గ్రామ అడంగల్)
- **Search Criteria Options**:
  - Survey Number / LP No (`సర్వే నంబర్`)
  - Khata Number (`ఖాతా నంబర్`)
  - Aadhaar Number (`ఆధార్ నంబర్`)
  - Pattadar / Landowner Name (`పట్టాదారు పేరు`)
- **Required Cascading Dropdowns**:
  - District (`జిల్లా`)
  - Mandal / Zone (`మండలం`)
  - Village (`గ్రామం`)
- **Form Controls**:
  - Radio buttons to toggle search criteria
  - Text input for selected criteria
  - Captcha challenge image + refresh button + input
  - "Submit" (`శోధన` / `Submit`) and "Reset" (`రీసెట్` / `Clear`) buttons
- **Output Record Table**:
  - Survey No, Sub-Division No, Total Extent (Acres-Guntas), Land Classification (Dry/Wet - మెట్ట/మాగాణి), Water Source, Cultivator Name (అనుభవదారుడు), Pattadar Name (పట్టాదారుని పేరు), Father/Husband Name, Khata No.

### 3.2 Your 1-B (మీ 1-బి) & Village 1-B (గ్రామ 1-బి)
- **Purpose**: Record of Rights (ROR) Register.
- **Search Criteria**: Khata Number, Survey Number, Pattadar Name.
- **Cascading Dropdowns**: District -> Mandal -> Village.
- **Output Record Table**:
  - Khata Number, Pattadar Name, Father's Name, Total Holding Extent, Survey Numbers list with individual extents, Nature of Land (Patta, Government, Inam).

### 3.3 LP Map / FMB / Village Map
- **Purpose**: Cadastral parcel maps, Field Measurement Book (FMB) sketches, and Village maps.
- **Search Criteria**: District -> Mandal -> Village -> Survey No / LP No.
- **Output**: SVG / Canvas rendering of land parcel boundary coordinates, neighboring survey numbers, measurement dimensions, and download map button.

### 3.4 Aadhaar Linking Status & Electronic Passbook
- **Aadhaar Status**: Checks if landholding khata has Aadhaar biometric seeding completed.
- **E-Passbook**: Generates digitized Land Title Deed / Pattadar Passbook with QR code verification.

### 3.5 Mutation & Application Tracking
- **Purpose**: Tracks title transfer applications (Transactions / Succession / Correction).
- **Inputs**: Application Number (`దరఖాస్తు సంఖ్య`).

---

## 4. Technical Architecture Proposed: MERN Stack
- **Database**: MongoDB with Mongoose (Districts, Mandals, Villages, LandRecords, Applications).
- **Backend**: Node.js + Express.js REST API with rate limiting, server-side SVG CAPTCHA generator, validation middleware, and error handling.
- **Frontend**: React (Vite, JSX, Vanilla CSS), responsive design (1440px desktop, 1366px laptop, 768px tablet, 390px mobile).
