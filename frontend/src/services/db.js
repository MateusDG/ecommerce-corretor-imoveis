import { db } from '../lib/firebase.js'
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  where
} from 'firebase/firestore'

export async function getFeatures() {
  const snap = await getDocs(query(collection(db, 'features'), orderBy('order')))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getPropertyTypes() {
  const snap = await getDocs(collection(db, 'property_types'))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getRecentProperties() {
  const snap = await getDocs(query(collection(db, 'properties'), where('recent', '==', true)))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function getContact() {
  const ref = doc(db, 'settings', 'contact')
  const s = await getDoc(ref)
  return s.exists() ? s.data() : null
}

function norm(s){ return (s||'').toString().toLowerCase() }

export async function searchProperties(filters){
  const snap = await getDocs(collection(db, 'properties'))
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  const f = filters || {}
  return all.filter(p => {
    if (f.state && norm(p.state) !== norm(f.state)) return false
    if (f.type){
      const tk = norm(p.typeKey||''); const tt = norm(p.type||'')
      const matches = f.type==='chacara' ? (tk.includes('chacara')||tt.includes('chacara'))
                   : f.type==='fazenda' ? (tk.includes('fazenda')||tt.includes('fazenda'))
                   : false
      if (!matches) return false
    }
    if (f.areaMin!=null && typeof p.areaHectares==='number' && p.areaHectares < f.areaMin) return false
    if (f.areaMax!=null && typeof p.areaHectares==='number' && p.areaHectares > f.areaMax) return false
    if (f.purpose){
      const list = Array.isArray(p.purposes) ? p.purposes : (Array.isArray(p.idealFor)?p.idealFor:[])
      if (!list.some(x=>norm(x)===norm(f.purpose))) return false
    }
    return true
  })
}
