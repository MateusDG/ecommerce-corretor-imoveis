// Firebase initialization (App, Analytics, Firestore)
// Uses CDN v10 modular SDK for static sites.

import { initializeApp, setLogLevel } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { getAnalytics, isSupported as analyticsSupported } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  serverTimestamp,
  getDocs
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { getAuth, signInAnonymously } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCDgl3HNIkFiFmUvd6o4ORWhFr_v4K6Kvk',
  authDomain: 'ecommerce-terreno-4acba.firebaseapp.com',
  projectId: 'ecommerce-terreno-4acba',
  storageBucket: 'ecommerce-terreno-4acba.firebasestorage.app',
  messagingSenderId: '134335381103',
  appId: '1:134335381103:web:f6cc2c3aa37365bc99579a',
  measurementId: 'G-2HNMDF0P35'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Debug logging (enable in localhost or with ?debug=1)
try {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const debug = new URLSearchParams(window.location.search).get('debug') === '1';
  if (isLocal || debug) {
    setLogLevel('debug');
    console.info('[Firebase] Debug log level ON');
  }
} catch {}

// Initialize Analytics only if supported (e.g., in browser envs)
let analytics = null;
try {
  analyticsSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
} catch (e) {
  // Non-fatal if analytics is not available
}

// Initialize Firestore (Cloud Firestore database)
const db = getFirestore(app);
const auth = getAuth(app);

// Expose to window for easy access in other scripts without bundlers
window.firebaseApp = app;
window.firebaseAnalytics = analytics;
window.firebaseDb = db;
window.firebaseAuth = auth;

async function ensureAnonymousAuth() {
  try {
    if (auth.currentUser) return auth.currentUser;
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (e) {
    console.error('Falha ao autenticar anonimamente:', e);
    throw e;
  }
}

// Seed database with initial content matching the current UI
async function seedDatabase() {
  // Garantir que regras permitam escrita (auth anon)
  await ensureAnonymousAuth();
  const now = serverTimestamp();
  console.info('[Firebase] Iniciando seed...');

  // Features (Por que Investir...)
  const featuresRef = collection(db, 'features');
  await setDoc(doc(featuresRef, 'valorizacao-constante'), {
    title: 'Valorização Constante',
    description:
      'Terrenos rurais apresentam valorização acima da inflação, especialmente em regiões com crescimento do agronegócio.',
    order: 1,
    createdAt: now
  });
  await setDoc(doc(featuresRef, 'qualidade-de-vida'), {
    title: 'Qualidade de Vida',
    description:
      'Viva em contato com a natureza, com ar puro e tranquilidade para toda família.',
    order: 2,
    createdAt: now
  });
  await setDoc(doc(featuresRef, 'diversificacao-de-renda'), {
    title: 'Diversificação de Renda',
    description:
      'Desenvolva projetos agrícolas, pecuários, turismo rural ou use como reserva de valor.',
    order: 3,
    createdAt: now
  });

  // Property types (Tipos de Propriedade)
  const typesRef = collection(db, 'property_types');
  await setDoc(doc(typesRef, 'chacaras-de-lazer'), {
    title: 'Chácaras de Lazer',
    description:
      'Propriedades de 1 a 20 hectares, ideais para descanso e lazer familiar.',
    features: [
      'Área de 1 a 20 hectares',
      'Próximas a centros urbanos',
      'Infraestrutura de lazer',
      'Ideal para família'
    ],
    icon: '🏡',
    createdAt: now
  });
  await setDoc(doc(typesRef, 'fazendas-produtivas'), {
    title: 'Fazendas Produtivas',
    description:
      'Propriedades de médio e grande porte com infraestrutura para produção.',
    features: [
      'Área acima de 50 hectares',
      'Solo fértil e produtivo',
      'Infraestrutura agrícola',
      'Potencial de rentabilidade'
    ],
    icon: '🌾',
    createdAt: now
  });
  await setDoc(doc(typesRef, 'terrenos-para-construcao'), {
    title: 'Terrenos para Construção',
    description:
      'Lotes rurais para residência, com localização privilegiada e contato com a natureza.',
    features: [
      'Área de 1.000m² a 5 hectares',
      'Documentação aprovada',
      'Acesso facilitado',
      'Energia e água disponível'
    ],
    icon: '🏞️',
    createdAt: now
  });
  await setDoc(doc(typesRef, 'investimento-rural'), {
    title: 'Investimento Rural',
    description:
      'Propriedades estratégicas para diversificar portfólio e obter rentabilidade.',
    features: [
      'Localização estratégica',
      'Alto potencial de valorização',
      'Possibilidade de arrendamento',
      'ROI atrativo'
    ],
    icon: '💰',
    createdAt: now
  });

  // Properties (Recentes / Destaque)
  const propsRef = collection(db, 'properties');
  await setDoc(doc(propsRef, 'fazenda-serra-verde'), {
    title: 'Fazenda Serra Verde',
    location: 'Interior de Minas Gerais',
    state: 'MG',
    city: 'Minas Gerais',
    typeKey: 'fazendas-produtivas',
    type: 'Fazenda Produtiva',
    areaHectares: 250,
    priceBRL: 1200000,
    images: ['images/recent-property-1.png'],
    infrastructure: ['Casa sede', 'Curral', 'Açude', 'Energia elétrica'],
    soil: 'Fértil, ideal para pastagem e cultivos',
    access: 'Asfalto até 2km da propriedade',
    documentation: 'Escritura e ITR em dia',
    purposes: ['Produção', 'Pecuária', 'Investimento'],
    featured: true,
    recent: true,
    createdAt: now
  });
  await setDoc(doc(propsRef, 'chacara-bela-vista'), {
    title: 'Chácara Bela Vista',
    location: 'Interior de São Paulo',
    state: 'SP',
    city: 'São Paulo (Interior)',
    typeKey: 'chacaras-de-lazer',
    type: 'Chácara de Lazer',
    areaHectares: 15,
    priceBRL: 850000,
    images: ['images/recent-property-2.png'],
    infrastructure: ['Casa', 'Piscina', 'Área gourmet', 'Poço artesiano'],
    soil: 'Excelente para horta e pomar',
    access: 'Rodovia principal, 45min da capital',
    idealFor: ['Moradia', 'Lazer', 'Agronegócio'],
    purposes: ['Moradia', 'Lazer', 'Agronegócio'],
    featured: false,
    recent: true,
    createdAt: now
  });

  // Settings / Contact
  const settingsRef = collection(db, 'settings');
  await setDoc(doc(settingsRef, 'contact'), {
    address: 'Rua dos Terrenos Rurais, 123 - São Paulo, SP',
    phone: '(11) 9999-8888',
    email: 'contato@terrenosrurais.com.br',
    website: 'www.terrenosrurais.com.br',
    whatsapp: '(11) 99999-8888',
    updatedAt: now
  });

  console.log('Seed concluído com sucesso.');
}

window.seedDatabase = seedDatabase;
window.ensureAnonymousAuth = ensureAnonymousAuth;

// Healthcheck util para diagnosticar permissões rapidamente
async function firebaseStatusCheck() {
  try {
    const u = await ensureAnonymousAuth();
    console.info('[Firebase] Auth OK:', u ? u.uid : '(sem usuário)');
    // Teste de escrita leve (substitua regras conforme necessário)
    const healthRef = doc(collection(db, 'healthchecks'), 'last');
    await setDoc(healthRef, { ts: serverTimestamp(), ok: true });
    console.info('[Firebase] Teste de escrita OK');
    return true;
  } catch (e) {
    console.error('[Firebase] Falha no healthcheck:', e);
    return false;
  }
}
window.firebaseStatusCheck = firebaseStatusCheck;

// Optional: allow seeding via URL query ?seed=1
try {
  const params = new URLSearchParams(window.location.search);
  if (params.get('seed') === '1') {
    ensureAnonymousAuth()
      .then(() => seedDatabase())
      .catch((e) => console.error('Erro ao semear banco:', e));
  }
} catch {}

// Auto-seed em ambiente local se coleção estiver vazia (apenas dev)
try {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  const params = new URLSearchParams(window.location.search);
  if (isLocal && params.get('seed') !== '1') {
    getDocs(collection(db, 'features'))
      .then((snap) => {
        if (snap.empty) {
          return ensureAnonymousAuth().then(() => seedDatabase());
        }
        return null;
      })
      .catch((e) => console.warn('Verificação de seed falhou:', e));
  }
} catch {}

