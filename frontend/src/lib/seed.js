import { db, ensureAnonymousAuth } from './firebase.js'
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore'

export async function seedDatabase() {
  await ensureAnonymousAuth()
  const now = serverTimestamp()

  const featuresRef = collection(db, 'features')
  await setDoc(doc(featuresRef, 'valorizacao-constante'), {
    title: 'Valorização Constante',
    description: 'Terrenos rurais apresentam valorização acima da inflação, especialmente em regiões com crescimento do agronegócio.',
    order: 1,
    createdAt: now
  })
  await setDoc(doc(featuresRef, 'qualidade-de-vida'), {
    title: 'Qualidade de Vida',
    description: 'Viva em contato com a natureza, com ar puro e tranquilidade para toda família.',
    order: 2,
    createdAt: now
  })
  await setDoc(doc(featuresRef, 'diversificacao-de-renda'), {
    title: 'Diversificação de Renda',
    description: 'Desenvolva projetos agrícolas, pecuários, turismo rural ou use como reserva de valor.',
    order: 3,
    createdAt: now
  })

  const typesRef = collection(db, 'property_types')
  await setDoc(doc(typesRef, 'chacaras-de-lazer'), {
    title: 'Chácaras de Lazer',
    description: 'Propriedades de 1 a 20 hectares, ideais para descanso e lazer familiar.',
    features: ['Área de 1 a 20 hectares','Próximas a centros urbanos','Infraestrutura de lazer','Ideal para família'],
    icon: '🏡',
    createdAt: now
  })
  await setDoc(doc(typesRef, 'fazendas-produtivas'), {
    title: 'Fazendas Produtivas',
    description: 'Propriedades de médio e grande porte com infraestrutura para produção.',
    features: ['Área acima de 50 hectares','Solo fértil e produtivo','Infraestrutura agrícola','Potencial de rentabilidade'],
    icon: '🌾',
    createdAt: now
  })
  await setDoc(doc(typesRef, 'terrenos-para-construcao'), {
    title: 'Terrenos para Construção',
    description: 'Lotes rurais para residência, com localização privilegiada e contato com a natureza.',
    features: ['Área de 1.000m² a 5 hectares','Documentação aprovada','Acesso facilitado','Energia e água disponível'],
    icon: '🏞️',
    createdAt: now
  })
  await setDoc(doc(typesRef, 'investimento-rural'), {
    title: 'Investimento Rural',
    description: 'Propriedades estratégicas para diversificar portfólio e obter rentabilidade.',
    features: ['Localização estratégica','Alto potencial de valorização','Possibilidade de arrendamento','ROI atrativo'],
    icon: '💰',
    createdAt: now
  })

  const propsRef = collection(db, 'properties')
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
  })
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
  })

  const settingsRef = collection(db, 'settings')
  await setDoc(doc(settingsRef, 'contact'), {
    address: 'Rua dos Terrenos Rurais, 123 - São Paulo, SP',
    phone: '(11) 9999-8888',
    email: 'contato@terrenosrurais.com.br',
    website: 'www.terrenosrurais.com.br',
    whatsapp: '(11) 99999-8888',
    updatedAt: now
  })
}

