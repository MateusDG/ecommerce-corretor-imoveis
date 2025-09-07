import React, { useEffect, useMemo, useState } from 'react'
import './styles/main.css'
import { ensureAnonymousAuth } from './lib/firebase.js'
import * as DB from './services/db.js'
import { seedDatabase } from './lib/seed.js'

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="/images/logo.png" alt="Logo da Imobiliária Rural" className="logo-image"/>
      </div>
      <nav className="nav-items">
        <a href="#" className="nav-item active">Início</a>
        <a href="#" className="nav-item">Sobre</a>
        <a href="#" className="nav-item">Terrenos</a>
        <a href="#" className="nav-item">Serviços</a>
        <a href="#" className="nav-item">Contato</a>
      </nav>
    </header>
  )
}

function Dropdown({label, options, value, onChange}){
  const [open,setOpen]=useState(false)
  const current = useMemo(()=>options.find(o=>o.value===value)||options[0], [options, value])
  return (
    <div className="dropdown" onClick={()=>setOpen(o=>!o)}>
      <span className="dropdown-text">{current.label}</span>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 7.5L10 12.5L15 7.5" stroke="#2F234F" strokeWidth="1.67"/>
      </svg>
      {open && (
        <div className="dropdown-menu" style={{position:'absolute', marginTop:8, background:'#fff', border:'1px solid #D0D5DD', borderRadius:6, boxShadow:'0 8px 24px rgba(0,0,0,0.12)', zIndex:1500, padding:'6px 0'}}>
          {options.map((o)=> (
            <div key={o.label} style={{padding:'8px 12px', cursor:'pointer'}} onClick={(e)=>{e.stopPropagation(); onChange(o); setOpen(false)}}>{o.label}</div>
          ))}
        </div>
      )}
    </div>
  )
}

function SearchSection({onSearch}){
  const [state,setState]=useState('')
  const [type,setType]=useState('')
  const [area,setArea]=useState({min:null,max:null,value:''})
  const [purpose,setPurpose]=useState('')

  const locOpts=[{label:'Qualquer localização', value:''},{label:'São Paulo (SP)', value:'SP'},{label:'Minas Gerais (MG)', value:'MG'}]
  const typeOpts=[{label:'Qualquer tipo', value:''},{label:'Chácara de Lazer', value:'chacara'},{label:'Fazenda Produtiva', value:'fazenda'}]
  const areaOpts=[{label:'Qualquer área', value:'', min:null,max:null},{label:'Até 20 ha', value:'0-20', min:0,max:20},{label:'20 a 100 ha', value:'20-100', min:20,max:100},{label:'Acima de 100 ha', value:'100+', min:100,max:null}]
  const finOpts=[{label:'Qualquer finalidade', value:''},{label:'Moradia', value:'Moradia'},{label:'Lazer', value:'Lazer'},{label:'Agronegócio', value:'Agronegócio'},{label:'Produção', value:'Produção'},{label:'Investimento', value:'Investimento'}]

  return (
    <div className="search-section">
      <div className="search-header">
        <h3 className="search-title">Encontre seu Terreno Ideal</h3>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="search-icon">
          <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#2F234F" strokeWidth="2"/>
          <circle cx="18.5" cy="18.5" r="2.5" fill="#2F234F"/>
        </svg>
      </div>
      <div className="search-filters" style={{position:'relative'}}>
        <Dropdown label="Localização" options={locOpts} value={state} onChange={(o)=>setState(o.value)} />
        <Dropdown label="Tipo" options={typeOpts} value={type} onChange={(o)=>setType(o.value)} />
        <Dropdown label="Área" options={areaOpts} value={area.value} onChange={(o)=>setArea(o)} />
        <Dropdown label="Finalidade" options={finOpts} value={purpose} onChange={(o)=>setPurpose(o.value)} />
        <button className="btn-search" onClick={()=>onSearch({state, type, areaMin:area.min, areaMax:area.max, purpose})}>Buscar Terrenos</button>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="hero" style={{backgroundImage:"linear-gradient(202deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.84) 100%), url('/images/hero-background-49b4ff.png')"}}>
      <Header />
      <div className="hero-content">
        <div className="content-cta">
          <div className="content">
            <div className="title-section">
              <div className="hr-line-label">
                <div className="line"></div>
                <span className="label">Oferecemos os</span>
              </div>
              <h1 className="main-title">Melhores Terrenos Rurais</h1>
            </div>
            <p className="description">Fazendas, chácaras e sítios com documentação em dia e excelente acesso.</p>
          </div>
          <div className="cta">
            <button className="btn-primary">Fale com um especialista</button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedGrid(){
  // Usa as imagens estáticas do design
  const items = [
    { size:'large', img:'/images/property-1.png', featured:true, title:'Fazenda Vale Verde', desc:'250 ha - MG' },
    { size:'medium', img:'/images/property-2-5b6fd0.png', title:'Chácara das Flores', desc:'12 ha - SP' },
    { size:'medium', img:'/images/property-3.png', title:'Fazenda Rio Doce', desc:'180 ha - MG' },
    { size:'medium', img:'/images/property-4.png', title:'Sítio Boa Vista', desc:'8 ha - SP' },
    { size:'medium', img:'/images/property-5.png', title:'Chácara Santa Luzia', desc:'15 ha - SP' },
  ]
  return (
    <section className="featured-properties">
      <div className="section-header">
        <h2 className="section-title">Terrenos em Destaque</h2>
        <p className="section-description">Seleção das melhores oportunidades rurais disponíveis.</p>
      </div>
      <div className="properties-grid">
        {items.map((it, idx)=> (
          <div key={idx} className={`property-card ${it.size} ${it.featured?'featured':''}`}>
            <img src={it.img} alt={it.title} className="property-image"/>
            <div className="property-overlay">
              <div className="property-info">
                <h4 className="property-title">{it.title}</h4>
                <p className="property-desc">{it.desc}</p>
              </div>
              {it.featured && (
                <button className="btn-arrow">
                  <span>→</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function OurFeatures({features}){
  return (
    <section className="our-features">
      <h2 className="features-title">Por que Investir em Terrenos Rurais?</h2>
      <div className="features-wrapper">
        <div className="features-cards">
          {(features||[]).map((f)=>(
            <div key={f.id||f.title} className="feature-card">
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.description}</p>
            </div>
          ))}
        </div>
        <div className="features-image">
          <img src="/images/features-circle.png" alt="Investimento Rural" className="circle-image" />
        </div>
      </div>
    </section>
  )
}

function RecentProperties({properties}){
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
  return (
    <section className="recent-properties">
      <div className="section-header">
        <h2 className="section-title">Propriedades Disponíveis</h2>
        <p className="section-description">Conheça nossas propriedades rurais disponíveis com informações detalhadas.</p>
      </div>
      <div className="recent-content">
        {(properties||[]).map((p, idx)=> (
          <div key={p.id||idx} className={`recent-row ${idx%2===1?'reverse':''}`}>
            <div className="recent-image">
              <img src={`/${(Array.isArray(p.images) && p.images[0]) || 'images/recent-property-1.png'}`} alt={p.title}/>
            </div>
            <div className="recent-info">
              <div className="recent-text">
                <h3 className="recent-title">{p.title}</h3>
                <p className="recent-desc">
                  {p.areaHectares ? (<><strong>Área:</strong> {p.areaHectares} hectares<br/></>) : null}
                  {p.location ? (<><strong>Localização:</strong> {p.location}<br/></>) : null}
                  {p.soil ? (<><strong>Solo:</strong> {p.soil}<br/></>) : null}
                  {p.access ? (<><strong>Acesso:</strong> {p.access}<br/></>) : null}
                </p>
              </div>
              <div className="recent-price">{typeof p.priceBRL==='number'?brl.format(p.priceBRL):''}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="view-more">
        <button className="btn-view-more">Ver Mais Propriedades</button>
      </div>
    </section>
  )
}

function PropertyTypes({types}){
  return (
    <section className="property-types">
      <div className="types-container">
        <div className="section-header">
          <h2 className="section-title">Tipos de Propriedade</h2>
          <p className="section-description">Encontre o tipo de propriedade rural ideal.</p>
        </div>
        <div className="types-grid">
          {(types||[]).map((t)=> (
            <div key={t.id} className="type-card">
              <div className="type-icon">{t.icon||'🏡'}</div>
              <h3 className="type-title">{t.title}</h3>
              <p className="type-desc">{t.description}</p>
              <ul className="type-features">
                {(t.features||[]).map((f, idx)=>(<li key={idx}>✓ {f}</li>))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer({contact}){
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo-section">
          <div className="footer-logo">
            <img src="/images/logo.png" alt="Logo" className="footer-logo-image" />
          </div>
          <p className="footer-desc">Especialistas em propriedades rurais, oferecemos os melhores terrenos, fazendas e chácaras com total segurança e transparência.</p>
        </div>
        <div className="footer-section">
          <h4 className="footer-section-title">Propriedades Recentes</h4>
          <div className="footer-properties">
            <div className="footer-property">
              <img src="/images/footer-property-1.png" alt="Footer Property 1" className="footer-property-image"/>
              <div className="footer-property-info">
                <p className="footer-property-address">Fazenda 50 hectares - Minas Gerais</p>
                <p className="footer-property-price">R$ 650.000</p>
              </div>
            </div>
            <div className="footer-property">
              <img src="/images/footer-property-2.png" alt="Footer Property 2" className="footer-property-image"/>
              <div className="footer-property-info">
                <p className="footer-property-address">Chácara 8 hectares - São Paulo Interior</p>
                <p className="footer-property-price">R$ 420.000</p>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-section">
          <h4 className="footer-section-title">Informações de Contato</h4>
          <div className="footer-contact">
            <p className="footer-contact-address">{contact?.address||'—'}</p>
            <div className="footer-contact-details">
              {contact?.phone && <p>Telefone: {contact.phone}</p>}
              {contact?.email && <p>Email: {contact.email}</p>}
              {contact?.website && <p>Website: {contact.website}</p>}
              {contact?.whatsapp && <p>WhatsApp: {contact.whatsapp}</p>}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function App(){
  const [features, setFeatures] = useState([])
  const [types, setTypes] = useState([])
  const [recent, setRecent] = useState([])
  const [contact, setContact] = useState(null)

  useEffect(()=>{
    (async ()=>{
      await ensureAnonymousAuth()
      const params = new URLSearchParams(window.location.search)
      if (params.get('seed') === '1') {
        try { await seedDatabase() } catch (e) { console.warn('Seed falhou', e) }
      }
      const [f, t, r, c] = await Promise.all([
        DB.getFeatures(),
        DB.getPropertyTypes(),
        DB.getRecentProperties(),
        DB.getContact()
      ])
      setFeatures(f); setTypes(t); setRecent(r); setContact(c)
    })()
  },[])

  async function handleSearch(filters){
    const result = await DB.searchProperties(filters)
    setRecent(result)
    window.scrollTo({ top: document.querySelector('.recent-properties')?.offsetTop || 0, behavior: 'smooth' })
  }

  return (
    <div>
      <Hero />
      <SearchSection onSearch={handleSearch} />
      <FeaturedGrid />
      <OurFeatures features={features} />
      <RecentProperties properties={recent} />
      <PropertyTypes types={types} />
      <Footer contact={contact} />
    </div>
  )
}
