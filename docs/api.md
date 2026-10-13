# MeeBhoomi Andhra Pradesh - Backend REST API Documentation

Base URL: `http://localhost:5000/api`

---

## 1. System Health
### `GET /health`
Returns the status of the MeeBhoomi API server.
- **Response**:
```json
{
  "status": "ONLINE",
  "service": "MeeBhoomi Andhra Pradesh Public Land Records API",
  "version": "1.0.0",
  "timestamp": "2026-10-12T15:56:00.000Z"
}
```

---

## 2. Location Hierarchy

### `GET /districts`
Returns active districts stored in the configured database. The current demo database returns 8 districts; results vary with the configured dataset.
- **Response (200)**:
```json
{
  "success": true,
  "count": 8,
  "data": [
    { "code": "07", "nameEn": "Guntur", "nameTe": "గుంటూరు", "headquarters": "Guntur" }
  ]
}
```

### `GET /mandals?districtCode={districtCode}`
Returns mandals belonging to the specified district.
- **Query Params**: `districtCode` (string, required)

### `GET /villages?mandalCode={mandalCode}`
Returns revenue villages belonging to the specified mandal.
- **Query Params**: `mandalCode` (string, required), `districtCode` (string, recommended to scope results to the selected district)

---

## 3. Land Records Search

### `POST /records/search`
Searches land records by Survey No, Khata No, Aadhaar, or Pattadar Name.
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "districtCode": "07",
  "mandalCode": "0701",
  "villageCode": "070104",
  "searchType": "surveyNo",
  "searchValue": "125/1",
  "captchaToken": "eyJpZCI6Ij...",
  "captchaAnswer": "4X89K"
}
```
- **Response (200)**:
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "districtNameEn": "Guntur",
      "districtNameTe": "గుంటూరు",
      "mandalNameEn": "Mangalagiri",
      "villageNameEn": "Chinakakani",
      "surveyNo": "125",
      "subDivisionNo": "1",
      "khataNo": "102",
      "pattadarNameEn": "Kollipara Venkata Subbarao",
      "pattadarNameTe": "కొల్లిపర వెంకట సుబ్బారావు",
      "totalExtentAcres": 2.45,
      "landClassification": "Wet (మాగాణి)",
      "waterSource": "Krishna Canal Ayacut",
      "aadhaarSeeded": true,
      "passbookNumber": "AP/PPB/2023/070104-102"
    }
  ],
  "disclaimer": "Simulated demonstration record for MeeBhoomi recreation."
}
```

For the synthetic Aadhaar-status demo, use `searchType: "aadhaar"` and provide only the final four digits in `searchValue`. The backend rejects full Aadhaar numbers and excludes stored Aadhaar digits from API responses. This is synthetic sample data, not an identity verification, UIDAI lookup, or official Aadhaar-linking status.

---

## 4. CAPTCHA Security

### `GET /captcha/generate`
Generates a cryptographic single-use challenge token and rendered SVG image.
- **Response**:
```json
{
  "success": true,
  "data": {
    "token": "base64_encoded_hmac_token",
    "svg": "<svg ...>...</svg>",
    "expiresAt": 1791823500000
  }
}
```

### `POST /captcha/verify`
Verifies an entered challenge answer. Enforces single-use consumption and expiration.

---

## 5. Application Tracking

### `GET /applications/status/:applicationNo`
Checks status of a Secretariat revenue application (e.g., `MUT2026AP009412`).
