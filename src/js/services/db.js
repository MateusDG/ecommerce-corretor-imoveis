// Firestore data access layer (CDN v10)
// Requires init.js to have run (window.firebaseDb available)

import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  where
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

const db = window.firebaseDb;

async function ensureAuth() {
  if (window.ensureAnonymousAuth) {
    try { await window.ensureAnonymousAuth(); } catch {}
  }
}

async function getFeatures() {
  await ensureAuth();
  const snap = await getDocs(query(collection(db, 'features'), orderBy('order')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getPropertyTypes() {
  await ensureAuth();
  const snap = await getDocs(collection(db, 'property_types'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getRecentProperties() {
  await ensureAuth();
  const snap = await getDocs(query(collection(db, 'properties'), where('recent', '==', true)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function getContact() {
  await ensureAuth();
  const ref = doc(db, 'settings', 'contact');
  const s = await getDoc(ref);
  return s.exists() ? s.data() : null;
}

function normalize(s) { return (s || '').toString().toLowerCase(); }

async function searchProperties(filters) {
  await ensureAuth();
  const snap = await getDocs(collection(db, 'properties'));
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  const f = filters || {};
  return all.filter(p => {
    if (f.state && normalize(p.state) !== normalize(f.state)) return false;
    if (f.type) {
      const tk = normalize(p.typeKey || '');
      const tt = normalize(p.type || '');
      const matches = f.type === 'chacara' ? (tk.includes('chacara') || tt.includes('chacara'))
                    : f.type === 'fazenda' ? (tk.includes('fazenda') || tt.includes('fazenda'))
                    : false;
      if (!matches) return false;
    }
    if (f.areaMin != null && typeof p.areaHectares === 'number' && p.areaHectares < f.areaMin) return false;
    if (f.areaMax != null && typeof p.areaHectares === 'number' && p.areaHectares > f.areaMax) return false;
    if (f.purpose) {
      const list = Array.isArray(p.purposes) ? p.purposes : (Array.isArray(p.idealFor) ? p.idealFor : []);
      if (!list.some(x => normalize(x) === normalize(f.purpose))) return false;
    }
    return true;
  });
}

window.DB = {
  ensureAuth,
  getFeatures,
  getPropertyTypes,
  getRecentProperties,
  getContact,
  searchProperties
};

