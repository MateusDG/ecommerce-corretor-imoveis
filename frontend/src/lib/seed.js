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
    name: 'Fazenda Serra Verde',
    title: 'Fazenda Serra Verde',
    location: 'Interior de Minas Gerais',
    state: 'MG',
    city: 'Minas Gerais',
    typeKey: 'fazendas-produtivas',
    type: 'Fazenda Produtiva',
    area: 250,
    areaHectares: 250,
    price: 1200000,
    priceBRL: 1200000,
    image: '/images/recent-property-1.png',
    images: ['/images/recent-property-1.png', '/images/recent-property-2.png'],
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
    name: 'Chácara Bela Vista',
    title: 'Chácara Bela Vista',
    location: 'Interior de São Paulo',
    state: 'SP',
    city: 'São Paulo (Interior)',
    typeKey: 'chacaras-de-lazer',
    type: 'Chácara de Lazer',
    area: 15,
    areaHectares: 15,
    price: 850000,
    priceBRL: 850000,
    image: '/images/property-1.png',
    images: ['/images/property-1.png', '/images/property-2.png'],
    infrastructure: ['Casa', 'Piscina', 'Área gourmet', 'Poço artesiano'],
    soil: 'Excelente para horta e pomar',
    access: 'Rodovia principal, 45min da capital',
    idealFor: ['Moradia', 'Lazer', 'Agronegócio'],
    purposes: ['Moradia', 'Lazer', 'Agronegócio'],
    featured: true,
    recent: true,
    createdAt: now
  })

  await setDoc(doc(propsRef, 'fazenda-agropecuaria-goias'), {
    name: 'Fazenda Agropecuária',
    title: 'Fazenda Agropecuária',
    location: 'Goiás, GO',
    state: 'GO',
    city: 'Goiás',
    typeKey: 'fazendas-produtivas',
    type: 'Fazenda Produtiva',
    area: 800,
    areaHectares: 800,
    price: 4800000,
    priceBRL: 4800000,
    image: '/images/property-2.png',
    images: ['/images/property-2.png', '/images/property-3.png'],
    infrastructure: ['Casa sede', 'Galpão', 'Curral', 'Energia', 'Poço artesiano'],
    soil: 'Latossolo vermelho, muito fértil',
    access: 'Estrada de terra 8km, asfalto próximo',
    idealFor: ['Produção', 'Pecuária', 'Investimento'],
    purposes: ['Produção', 'Pecuária', 'Investimento'],
    featured: true,
    recent: true,
    createdAt: now
  })

  await setDoc(doc(propsRef, 'terreno-construcao-sp'), {
    name: 'Terreno para Construção',
    title: 'Terreno para Construção',
    location: 'São Paulo, SP',
    state: 'SP',
    city: 'São Paulo',
    typeKey: 'terrenos-para-construcao',
    type: 'Terreno para Construção',
    area: 2,
    areaHectares: 2,
    price: 320000,
    priceBRL: 320000,
    image: '/images/property-3.png',
    images: ['/images/property-3.png', '/images/property-4.png'],
    infrastructure: ['Energia elétrica', 'Água encanada', 'Acesso asfaltado'],
    soil: 'Adequado para construção',
    access: 'Asfalto até a propriedade',
    idealFor: ['Construção', 'Moradia', 'Investimento'],
    purposes: ['Construção', 'Moradia', 'Investimento'],
    featured: true,
    recent: false,
    createdAt: now
  })

  await setDoc(doc(propsRef, 'investimento-mato-grosso'), {
    name: 'Fazenda de Investimento',
    title: 'Fazenda de Investimento',
    location: 'Mato Grosso, MT',
    state: 'MT',
    city: 'Mato Grosso',
    typeKey: 'investimento-rural',
    type: 'Investimento Rural',
    area: 1200,
    areaHectares: 1200,
    price: 7200000,
    priceBRL: 7200000,
    image: '/images/property-4.png',
    images: ['/images/property-4.png', '/images/property-5.png'],
    infrastructure: ['Infraestrutura completa', 'Casa sede', 'Galpões', 'Currais'],
    soil: 'Cerrado, excelente para soja e milho',
    access: 'BR próxima, logística facilitada',
    idealFor: ['Investimento', 'Produção', 'Arrendamento'],
    purposes: ['Investimento', 'Produção', 'Arrendamento'],
    featured: true,
    recent: true,
    createdAt: now
  })

  await setDoc(doc(propsRef, 'chacara-recreio-rj'), {
    name: 'Chácara Recreio',
    title: 'Chácara Recreio',
    location: 'Rio de Janeiro, RJ',
    state: 'RJ',
    city: 'Rio de Janeiro',
    typeKey: 'chacaras-de-lazer',
    type: 'Chácara de Lazer',
    area: 8,
    areaHectares: 8,
    price: 650000,
    priceBRL: 650000,
    image: '/images/property-5.png',
    images: ['/images/property-5.png', '/images/property-1.png'],
    infrastructure: ['Casa de campo', 'Piscina', 'Churrasqueira', 'Jardim'],
    soil: 'Adequado para paisagismo e horta',
    access: 'Estrada pavimentada',
    idealFor: ['Lazer', 'Moradia', 'Férias'],
    purposes: ['Lazer', 'Moradia', 'Férias'],
    featured: true,
    recent: false,
    createdAt: now
  })

  await setDoc(doc(propsRef, 'fazenda-organica-mg'), {
    name: 'Fazenda Orgânica',
    title: 'Fazenda Orgânica',
    location: 'Minas Gerais, MG',
    state: 'MG',
    city: 'Minas Gerais',
    typeKey: 'fazendas-produtivas',
    type: 'Fazenda Produtiva',
    area: 180,
    areaHectares: 180,
    price: 1800000,
    priceBRL: 1800000,
    image: '/images/recent-property-1.png',
    images: ['/images/recent-property-1.png', '/images/recent-property-2.png'],
    infrastructure: ['Casa sede', 'Estufas', 'Sistema de irrigação', 'Energia solar'],
    soil: 'Certificado orgânico, muito fértil',
    access: 'Asfalto até a propriedade',
    idealFor: ['Agricultura orgânica', 'Sustentabilidade', 'Investimento'],
    purposes: ['Agricultura orgânica', 'Sustentabilidade', 'Investimento'],
    featured: true,
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

