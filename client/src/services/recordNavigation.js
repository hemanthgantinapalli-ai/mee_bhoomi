const HANDOFF_KEY = 'meebhoomi_record_handoff';

export function openLandRecordPage(tabId, record) {
  sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({
    tabId,
    districtCode: record.districtCode,
    mandalCode: record.mandalCode,
    villageCode: record.villageCode,
    khataNo: String(record.khataNo),
    aadhaarSeeded: record.aadhaarSeeded === true
  }));
  window.location.hash = tabId;
}

export function readLandRecordHandoff(tabId) {
  const storedHandoff = sessionStorage.getItem(HANDOFF_KEY);
  if (!storedHandoff) return null;

  try {
    const handoff = JSON.parse(storedHandoff);
    if (
      handoff.tabId !== tabId ||
      !handoff.districtCode ||
      !handoff.mandalCode ||
      !handoff.villageCode ||
      !handoff.khataNo ||
      typeof handoff.aadhaarSeeded !== 'boolean'
    ) {
      return null;
    }
    return {
      tabId: handoff.tabId,
      districtCode: handoff.districtCode,
      mandalCode: handoff.mandalCode,
      villageCode: handoff.villageCode,
      khataNo: handoff.khataNo,
      aadhaarSeeded: handoff.aadhaarSeeded
    };
  } catch (error) {
    console.error('Could not restore the selected land record.', error);
    return null;
  }
}

export function clearLandRecordHandoff() {
  sessionStorage.removeItem(HANDOFF_KEY);
}
