import { useEffect, useRef, useState } from 'react';
import { apiService } from '../services/apiService';
import legacyLocationReferences from '../data/legacyLocationReferences.json';

const normalizeCode = (code) => String(code || '').replace(/^0+(?=\d)/, '');

const dedupeOptions = (items) => {
  if (!Array.isArray(items)) return [];
  const seen = new Set();
  return items.filter((item) => {
    if (!item) return false;
    const rawVal = item.value !== undefined ? item.value : item.code;
    const key = normalizeCode(rawVal);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const toReferenceOptions = (items) => items.map((item) => ({
  ...item,
  value: item.code,
  source: 'reference',
  label: `${item.nameTe} (${item.name})`
}));

const legacyDistrictOptions = toReferenceOptions(legacyLocationReferences.districts || []);
const legacyMandalOptions = toReferenceOptions(legacyLocationReferences.mandals || []);

const addRayapudiVillage = (villages, districtCode, mandalCode) => {
  const list = Array.isArray(villages) ? [...villages] : [];
  if (normalizeCode(districtCode) === '7' && normalizeCode(mandalCode) === '720') {
    if (!list.some(village =>
      normalizeCode(village.code || village.value) === '72005' ||
      village.nameEn?.toLowerCase() === 'rayapudi'
    )) {
      list.push({
        code: '72005',
        value: '72005',
        districtCode: '07',
        mandalCode: '720',
        nameEn: 'Rayapudi',
        nameTe: 'రాయపూడి',
        label: 'రాయపూడి (Rayapudi)'
      });
    }
  }
  return dedupeOptions(list);
};

const toOptions = (items, locationType) => {
  if (!Array.isArray(items)) {
    throw new Error(`The ${locationType} response did not contain a list.`);
  }

  return items.map((item) => {
    if (!item || typeof item.code !== 'string') {
      throw new Error(`The ${locationType} response contains an invalid code.`);
    }

    const nameEn = item.nameEn || '';
    const nameTe = item.nameTe || '';
    return {
      ...item,
      value: item.code,
      label: nameEn && nameTe ? `${nameTe} (${nameEn})` : nameTe || nameEn
    };
  });
};

const getResponseOptions = (response, locationType) => {
  if (!response?.success) {
    throw new Error(response?.message || `Failed to load ${locationType}.`);
  }
  return toOptions(response.data, locationType);
};

export function useLandLocations(initialSelection = null, { includeLegacyOptions = false } = {}) {
  const [districts, setDistricts] = useState([]);
  const [mandalsList, setMandalsList] = useState([]);
  const [villagesList, setVillagesList] = useState([]);
  const [district, setDistrict] = useState('0');
  const [mandal, setMandal] = useState('0');
  const [village, setVillage] = useState('0');
  const [locationError, setLocationError] = useState('');
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingMandals, setLoadingMandals] = useState(false);
  const [loadingVillages, setLoadingVillages] = useState(false);
  const requestSequence = useRef(0);

  useEffect(() => {
    let isCurrent = true;
    const requestId = ++requestSequence.current;

    const loadLocations = async () => {
      setLocationError('');
      setLoadingDistricts(true);
      setLoadingMandals(false);
      setLoadingVillages(false);

      try {
        const rawDistricts = getResponseOptions(
          await apiService.getDistricts(),
          'districts'
        );
        if (!isCurrent || requestId !== requestSequence.current) return;
        const effectiveDistricts = dedupeOptions(
          includeLegacyOptions
            ? [...rawDistricts, ...legacyDistrictOptions]
            : rawDistricts
        );
        setDistricts(effectiveDistricts);
        setLoadingDistricts(false);

        const targetDistrict = initialSelection?.districtCode || '07';
        if (effectiveDistricts.some((item) => item.value === targetDistrict)) {
          setDistrict(targetDistrict);

          setLoadingMandals(true);
          const mandalOptions = dedupeOptions(getResponseOptions(
            await apiService.getMandals(targetDistrict),
            'mandals'
          ));
          if (!isCurrent || requestId !== requestSequence.current) return;
          setMandalsList(mandalOptions);
          setLoadingMandals(false);

          if (initialSelection?.mandalCode && mandalOptions.some((item) => item.value === initialSelection.mandalCode)) {
            setMandal(initialSelection.mandalCode);

            setLoadingVillages(true);
            const villageOptions = addRayapudiVillage(
              getResponseOptions(
                await apiService.getVillages(initialSelection.mandalCode, targetDistrict),
                'villages'
              ),
              targetDistrict,
              initialSelection.mandalCode
            );
            if (!isCurrent || requestId !== requestSequence.current) return;
            setVillagesList(villageOptions);
            setLoadingVillages(false);

            if (initialSelection?.villageCode && villageOptions.some((item) => item.value === initialSelection.villageCode)) {
              setVillage(initialSelection.villageCode);
            }
          }
        }
      } catch (error) {
        if (isCurrent && requestId === requestSequence.current) {
          setLocationError(error.message || 'Failed to load land locations.');
        }
      } finally {
        if (isCurrent && requestId === requestSequence.current) {
          setLoadingDistricts(false);
          setLoadingMandals(false);
          setLoadingVillages(false);
        }
      }
    };

    loadLocations();

    return () => {
      isCurrent = false;
      requestSequence.current += 1;
    };
  }, [initialSelection, includeLegacyOptions]);

  const handleDistrictChange = async (value) => {
    const requestId = ++requestSequence.current;
    setDistrict(value);
    setMandal('0');
    setVillage('0');
    setMandalsList([]);
    setVillagesList([]);
    setLocationError('');
    setLoadingMandals(false);
    setLoadingVillages(false);

    if (value === '0') return;

    setLoadingMandals(true);
    try {
      const mandals = dedupeOptions(getResponseOptions(await apiService.getMandals(value), 'mandals'));
      if (requestId === requestSequence.current) {
        setMandalsList(mandals);
      }
    } catch (error) {
      if (requestId === requestSequence.current) {
        const legacy = dedupeOptions(legacyMandalOptions.filter(
          (item) => normalizeCode(item.districtCode) === normalizeCode(value)
        ));
        if (legacy.length > 0) {
          setMandalsList(legacy);
        } else {
          setLocationError(error.message || 'Failed to load mandals.');
        }
      }
    } finally {
      if (requestId === requestSequence.current) setLoadingMandals(false);
    }
  };

  const handleMandalChange = async (value) => {
    const requestId = ++requestSequence.current;
    setMandal(value);
    setVillage('0');
    setVillagesList([]);
    setLocationError('');
    setLoadingVillages(false);

    if (value === '0') return;

    setLoadingVillages(true);
    try {
      const rawVillages = getResponseOptions(
        await apiService.getVillages(value, district),
        'villages'
      );
      const villages = addRayapudiVillage(rawVillages, district, value);
      if (requestId === requestSequence.current) setVillagesList(villages);
    } catch (error) {
      if (requestId === requestSequence.current) {
        const normM = normalizeCode(value);
        const legacyV = (legacyLocationReferences.villages || [])
          .filter((v) => normalizeCode(v.mandalCode) === normM)
          .map((v) => ({ ...v, value: v.code, label: `${v.nameTe} (${v.nameEn})` }));
        const merged = addRayapudiVillage(legacyV, district, value);
        if (merged.length > 0) {
          setVillagesList(merged);
        } else {
          setLocationError(error.message || 'Failed to load villages.');
        }
      }
    } finally {
      if (requestId === requestSequence.current) setLoadingVillages(false);
    }
  };

  const isReferenceLocation = districts.find((item) => item.value === district)?.source === 'reference'
    || mandalsList.find((item) => item.value === mandal)?.source === 'reference';
  const districtPlaceholder = loadingDistricts
    ? 'జిల్లాలు లోడ్ అవుతున్నాయి... (Loading districts...)'
    : districts.length === 0
      ? 'జిల్లాలు అందుబాటులో లేవు (No districts available)'
      : 'జిల్లా ఎంచుకోండి (Select district)';
  const mandalPlaceholder = loadingMandals
    ? 'మండలాలు లోడ్ అవుతున్నాయి... (Loading mandals...)'
    : district === '0'
      ? 'ముందుగా జిల్లాను ఎంచుకోండి (Select district first)'
      : mandalsList.length === 0
        ? 'ఈ జిల్లాలో మండలాలు అందుబాటులో లేవు (No mandals available)'
        : 'మండలం ఎంచుకోండి (Select mandal)';
  const villagePlaceholder = loadingVillages
    ? 'గ్రామాలు లోడ్ అవుతున్నాయి... (Loading villages...)'
    : mandal === '0'
      ? 'ముందుగా మండలాన్ని ఎంచుకోండి (Select mandal first)'
      : isReferenceLocation
        ? 'ఈ ఎంపికకు గ్రామాల వివరాలు అందుబాటులో లేవు (Village list unavailable for this selection)'
        : villagesList.length === 0
          ? 'ఈ మండలంలో గ్రామాలు అందుబాటులో లేవు (No villages available)'
          : 'గ్రామం ఎంచుకోండి (Select village)';

  return {
    districts,
    mandalsList,
    villagesList,
    district,
    mandal,
    village,
    isReferenceLocation,
    districtPlaceholder,
    mandalPlaceholder,
    villagePlaceholder,
    setVillage,
    handleDistrictChange,
    handleMandalChange,
    locationError,
    loadingDistricts,
    loadingMandals,
    loadingVillages
  };
}
