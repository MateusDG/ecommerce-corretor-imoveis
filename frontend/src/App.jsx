import React, { useEffect, useMemo, useState } from 'react'
import './styles/main.css'
import { ensureAnonymousAuth } from './lib/firebase.js'
import * as DB from './services/db.js'
import { seedDatabase } from './lib/seed.js'

// Componente Header
function Header() {
  return (
    <header className="header">
      <div className="logo">
        <img src="/images/logo.png" alt="Logo da Imobiliária Rural" className="logo-image"/>
      </div>
      <nav className="nav-items">
        <a href="#inicio" className="nav-item">Início</a>
        <a href="#sobre" className="nav-item">Sobre</a>
        <a href="#terrenos" className="nav-item">Terrenos</a>
        <a href="#servicos" className="nav-item">Serviços</a>
        <a href="#contato" className="nav-item">Contato</a>
      </nav>
    </header>
  )
}

// Componente Dropdown
function Dropdown({label, options, value, onChange}){
  const [open, setOpen] = useState(false)
  const current = useMemo(() => options.find(o => o.value === value) || options[0], [options, value])

  return (
    <div className="dropdown" onClick={() => setOpen(o => !o)}>
      <span className="dropdown-text">{current.label}</span>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 7.5L10 12.5L15 7.5" stroke="#2F234F" strokeWidth="1.67"/>
      </svg>
      {open && (
        <div
          className="dropdown-menu"
          style={{
            position: 'absolute',
            marginTop: 8,
            background: '#fff',
            border: '1px solid #D0D5DD',
            borderRadius: 6,
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 1500,
            padding: '6px 0',
            minWidth: '200px'
          }}
        >
          {options.map((o) => (
            <div
              key={o.label}
              style={{padding: '8px 12px', cursor: 'pointer'}}
              onClick={(e) => {
                e.stopPropagation();
                onChange(o);
                setOpen(false)
              }}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Componente Contact Form
function ContactForm({property = null}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: property ? `Tenho interesse na propriedade: ${property.name}` : '',
    property: property?.name || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('')

    try {
      // Validação básica
      if (!formData.name || !formData.email || !formData.phone) {
        setSubmitStatus('error')
        alert('Por favor, preencha todos os campos obrigatórios.')
        return
      }

      // Simular envio de email (substituir por EmailJS posteriormente)
      console.log('Enviando contato:', formData)

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setSubmitStatus('success')
      alert('Mensagem enviada com sucesso! Entraremos em contato em breve.')

      // Tracking do envio do formulário
      trackEvent('form_submit', {
        form_type: property ? 'property_interest' : 'general_contact',
        property_name: property?.name || '',
        lead_source: 'website_form'
      })

      // Redirecionar para WhatsApp
      const whatsappMessage = `Olá! Me chamo ${formData.name}. ${formData.message || 'Tenho interesse em terrenos rurais.'} Meu telefone: ${formData.phone}, email: ${formData.email}`
      const whatsappUrl = `https://wa.me/5527999309535?text=${encodeURIComponent(whatsappMessage)}`
      window.open(whatsappUrl, '_blank')

      // Limpar formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        property: ''
      })
    } catch (error) {
      console.error('Erro ao enviar:', error)
      setSubmitStatus('error')
      alert('Erro ao enviar mensagem. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label htmlFor="name">Nome *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Seu nome completo"
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="seu@email.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">WhatsApp *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="(27) 99999-9999"
        />
      </div>

      <div className="form-group">
        <label htmlFor="message">Mensagem</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows="4"
          placeholder="Descreva seu interesse ou dúvidas sobre terrenos rurais..."
        />
      </div>

      <button
        type="submit"
        className="submit-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
      </button>
    </form>
  )
}

// Componente Search Section
function SearchSection({onSearch}){
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')
  const [area, setArea] = useState('')
  const [purpose, setPurpose] = useState('')

  const locationOptions = [
    {label: 'Localização', value: ''},
    {label: 'São Paulo (SP)', value: 'SP'},
    {label: 'Minas Gerais (MG)', value: 'MG'},
    {label: 'Rio de Janeiro (RJ)', value: 'RJ'},
    {label: 'Goiás (GO)', value: 'GO'},
    {label: 'Mato Grosso (MT)', value: 'MT'}
  ]

  const typeOptions = [
    {label: 'Tipo', value: ''},
    {label: 'Fazenda de Lazer', value: 'fazenda-lazer'},
    {label: 'Fazenda Produtiva', value: 'fazenda-produtiva'},
    {label: 'Terreno para Construção', value: 'terreno-construcao'},
    {label: 'Investimento Rural', value: 'investimento-rural'}
  ]

  const areaOptions = [
    {label: 'Área', value: ''},
    {label: 'Até 5 hectares', value: '0-5'},
    {label: '5 a 20 hectares', value: '5-20'},
    {label: '20 a 50 hectares', value: '20-50'},
    {label: 'Mais de 50 hectares', value: '50+'}
  ]

  const purposeOptions = [
    {label: 'Finalidade', value: ''},
    {label: 'Moradia', value: 'moradia'},
    {label: 'Agricultura', value: 'agricultura'},
    {label: 'Pecuária', value: 'pecuaria'},
    {label: 'Lazer', value: 'lazer'},
    {label: 'Investimento', value: 'investimento'}
  ]

  const handleSearch = () => {
    const searchParams = {
      location,
      type,
      area,
      purpose
    }

    // Tracking da busca
    trackEvent('search_properties', {
      search_location: location || 'any',
      search_type: type || 'any',
      search_area: area || 'any',
      search_purpose: purpose || 'any'
    })

    onSearch(searchParams)
  }

  return (
    <div className="search-section">
      <div className="search-header">
        <h3 className="search-title">Encontre seu Terreno Ideal</h3>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="search-icon">
          <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#2F234F" strokeWidth="2"/>
          <circle cx="18.5" cy="18.5" r="2.5" fill="#2F234F"/>
        </svg>
      </div>
      <div className="search-filters">
        <Dropdown
          label="Localização"
          options={locationOptions}
          value={location}
          onChange={(opt) => setLocation(opt.value)}
        />
        <Dropdown
          label="Tipo"
          options={typeOptions}
          value={type}
          onChange={(opt) => setType(opt.value)}
        />
        <Dropdown
          label="Área"
          options={areaOptions}
          value={area}
          onChange={(opt) => setArea(opt.value)}
        />
        <Dropdown
          label="Finalidade"
          options={purposeOptions}
          value={purpose}
          onChange={(opt) => setPurpose(opt.value)}
        />
      </div>
      <button className="search-button" onClick={handleSearch}>
        Buscar Terrenos
      </button>
    </div>
  )
}

// Componente Hero Section
function HeroSection({onSearch}) {
  return (
    <section className="hero" id="inicio">
      <Header />
      <SearchSection onSearch={onSearch} />
    </section>
  )
}

// Função para tracking de eventos
const trackEvent = (eventName, eventParams = {}) => {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', eventName, eventParams)
  }

  // Facebook Pixel
  if (typeof fbq !== 'undefined') {
    fbq('track', eventName, eventParams)
  }

  console.log('Analytics Event:', eventName, eventParams)
}

// Componente Property Card
function PropertyCard({property}) {
  const handleWhatsAppClick = () => {
    // Tracking do clique no WhatsApp
    trackEvent('contact_whatsapp', {
      property_name: property.name || property.title,
      property_price: property.price || property.priceBRL,
      property_location: property.location,
      contact_method: 'whatsapp'
    })

    const message = `Olá! Tenho interesse na propriedade:

🏞️ *${property.name || property.title}*
📍 ${property.location}
📏 ${property.area || property.areaHectares} hectares
💰 R$ ${(property.price || property.priceBRL)?.toLocaleString('pt-BR')}

Gostaria de mais informações sobre esta propriedade rural. Quando podemos conversar?`

    const whatsappUrl = `https://wa.me/5527999309535?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const handleDetailsClick = () => {
    // Tracking da visualização de detalhes
    trackEvent('view_property_details', {
      property_name: property.name || property.title,
      property_price: property.price || property.priceBRL,
      property_location: property.location,
      property_type: property.type
    })

    // Abrir modal ou página de detalhes (implementar posteriormente)
    console.log('Ver detalhes da propriedade:', property)
  }

  return (
    <div className="property-card">
      <img
        src={property.image || property.images?.[0] || '/images/property-1.png'}
        alt={property.name || property.title}
        className="property-image"
        loading="lazy"
      />
      <div className="property-content">
        <h4 className="property-title">{property.name || property.title}</h4>
        <div className="property-location">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1C5.24 1 3 3.24 3 6c0 4.5 5 9 5 9s5-4.5 5-9c0-2.76-2.24-5-5-5zm0 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="currentColor"/>
          </svg>
          {property.location}
        </div>
        <div className="property-details">
          <div className="property-area">{property.area || property.areaHectares} hectares</div>
          <div className="property-price">R$ {(property.price || property.priceBRL)?.toLocaleString('pt-BR')}</div>
        </div>

        {/* Informações Rurais Específicas */}
        <div className="rural-features">
          {property.soil && (
            <div className="rural-feature">
              <span className="feature-icon">🌱</span>
              <span className="feature-text">{property.soil}</span>
            </div>
          )}

          {property.water && (
            <div className="rural-feature">
              <span className="feature-icon">💧</span>
              <span className="feature-text">{property.water}</span>
            </div>
          )}

          {property.infrastructure && property.infrastructure.length > 0 && (
            <div className="rural-feature">
              <span className="feature-icon">🏗️</span>
              <span className="feature-text">{property.infrastructure.slice(0, 2).join(', ')}</span>
            </div>
          )}

          {property.access && (
            <div className="rural-feature">
              <span className="feature-icon">🛣️</span>
              <span className="feature-text">{property.access}</span>
            </div>
          )}
        </div>

        <div className="property-actions">
          <button className="view-property-btn" onClick={handleDetailsClick}>
            Ver Detalhes
          </button>
          <button className="whatsapp-btn" onClick={handleWhatsAppClick}>
            <span className="whatsapp-icon">📱</span>
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente Featured Properties
function FeaturedProperties({properties}) {
  const featuredProperties = properties.slice(0, 6)

  return (
    <section className="featured-properties" id="terrenos">
      <div className="section-header">
        <h2 className="section-title">Terrenos em Destaque</h2>
        <p className="section-subtitle">
          Descubra os melhores terrenos rurais disponíveis para compra.
          Propriedades selecionadas com documentação em dia e localizações privilegiadas.
        </p>
      </div>
      <div className="properties-grid">
        {featuredProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  )
}

// Componente Benefits
function Benefits() {
  const benefits = [
    {
      title: "Documentação Garantida",
      description: "Todos os terrenos possuem documentação completa e regularizada, garantindo segurança jurídica na sua compra.",
      icon: "🏛️"
    },
    {
      title: "Localização Estratégica",
      description: "Propriedades em regiões com fácil acesso, próximas a centros urbanos e com boa infraestrutura.",
      icon: "📍"
    },
    {
      title: "Investimento Rentável",
      description: "Terrenos rurais são excelentes investimentos com potencial de valorização e geração de renda.",
      icon: "💰"
    },
    {
      title: "Solo Fértil",
      description: "Terras com excelente qualidade de solo para agricultura, pecuária ou reflorestamento.",
      icon: "🌱"
    },
    {
      title: "Água Abundante",
      description: "Propriedades com acesso garantido à água, seja por nascentes, poços ou rios.",
      icon: "💧"
    },
    {
      title: "Suporte Completo",
      description: "Acompanhamento desde a escolha até a finalização da compra, com suporte técnico especializado.",
      icon: "🤝"
    }
  ]

  return (
    <section className="benefits" id="sobre">
      <div className="section-header">
        <h2 className="section-title">Por que Investir em Terrenos Rurais?</h2>
        <p className="section-subtitle">
          Descubra as vantagens de investir em propriedades rurais e como elas podem transformar seu futuro.
        </p>
      </div>
      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <div key={index} className="benefit-card">
            <div className="benefit-icon">
              <span style={{fontSize: '24px'}}>{benefit.icon}</span>
            </div>
            <h3 className="benefit-title">{benefit.title}</h3>
            <p className="benefit-description">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// Componente Available Properties
function AvailableProperties({properties}) {
  return (
    <section className="available-properties">
      <div className="section-header">
        <h2 className="section-title">Propriedades Disponíveis</h2>
        <p className="section-subtitle">
          Conheça todas as nossas propriedades rurais disponíveis para compra imediata.
        </p>
      </div>
      <div className="properties-grid">
        {properties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  )
}

// Componente Property Types
function PropertyTypes() {
  const types = [
    {
      title: "Fazendas de Lazer",
      description: "Perfeitas para quem busca tranquilidade e contato com a natureza, ideais para final de semana e férias.",
      icon: "🏡"
    },
    {
      title: "Fazendas Produtivas",
      description: "Propriedades preparadas para agricultura e pecuária, com infraestrutura completa para produção.",
      icon: "🚜"
    },
    {
      title: "Terrenos para Construção",
      description: "Áreas ideais para construir sua casa no campo ou desenvolver projetos habitacionais rurais.",
      icon: "🏗️"
    },
    {
      title: "Investimento Rural",
      description: "Oportunidades de investimento em terras com alto potencial de valorização e rentabilidade.",
      icon: "📈"
    }
  ]

  return (
    <section className="property-types" id="servicos">
      <div className="section-header">
        <h2 className="section-title">Tipos de Propriedade</h2>
        <p className="section-subtitle">
          Encontre o tipo de propriedade rural que melhor se adapta aos seus objetivos e necessidades.
        </p>
      </div>
      <div className="types-grid">
        {types.map((type, index) => (
          <div key={index} className="type-card">
            <div className="type-icon">
              <span style={{fontSize: '24px'}}>{type.icon}</span>
            </div>
            <h3 className="type-title">{type.title}</h3>
            <p className="type-description">{type.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// Componente Footer
function Footer({recentProperties}) {
  const footerProperties = recentProperties.slice(0, 2)

  return (
    <footer className="footer" id="contato">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Entre em Contato</h3>
          <ContactForm />
        </div>

        <div className="footer-section">
          <h3>ES Terrenos</h3>
          <p>Sua imobiliária especializada em terrenos rurais. Encontre a propriedade ideal para investir, morar ou produzir no campo.</p>
          <p>📧 contato@esterrenos.com.br</p>
          <p>📱 (27) 99930-9535</p>
          <p>📍 Espírito Santo, ES</p>

          <a
            href="https://wa.me/5527999309535?text=Olá! Tenho interesse em terrenos rurais. Gostaria de mais informações."
            className="whatsapp-btn"
            target="_blank"
            rel="noopener noreferrer"
            style={{marginTop: '16px'}}
          >
            <span className="whatsapp-icon">📱</span>
            Falar no WhatsApp
          </a>
        </div>

        <div className="footer-section">
          <h3>Links Rápidos</h3>
          <a href="#inicio">Início</a>
          <a href="#sobre">Sobre</a>
          <a href="#terrenos">Terrenos</a>
          <a href="#servicos">Serviços</a>
          <a href="#contato">Contato</a>
        </div>

        <div className="footer-section">
          <h3>Tipos de Terreno</h3>
          <a href="#">Fazendas de Lazer</a>
          <a href="#">Fazendas Produtivas</a>
          <a href="#">Terrenos para Construção</a>
          <a href="#">Investimento Rural</a>
          <a href="#">Chácaras</a>
        </div>

        <div className="footer-section">
          <h3>Propriedades Recentes</h3>
          <div className="footer-properties">
            {footerProperties.map(property => (
              <div key={property.id} className="footer-property">
                <img
                  src={property.image || '/images/footer-property-1.png'}
                  alt={property.name}
                  className="footer-property-image"
                />
                <div className="footer-property-info">
                  <h4>{property.name}</h4>
                  <p>{property.location}</p>
                  <p>R$ {property.price?.toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 ES Terrenos. Todos os direitos reservados.</p>
      </div>
    </footer>
  )
}

// Componente Principal App
export default function App() {
  const [properties, setProperties] = useState([])
  const [filteredProperties, setFilteredProperties] = useState([])
  const [loading, setLoading] = useState(true)

  // Carregar dados do Firebase
  useEffect(() => {
    async function loadData() {
      try {
        console.log('Starting data load...')

        // Dados mock para fallback
        const mockData = [
          {
            id: 'mock-1',
            name: 'Fazenda Serra Verde',
            location: 'Minas Gerais, MG',
            area: 250,
            price: 1200000,
            image: '/images/property-1.png',
            type: 'Fazenda Produtiva',
            soil: 'Latossolo vermelho, fértil para pastagem',
            water: 'Nascente própria + rio perene',
            infrastructure: ['Casa sede', 'Curral', 'Energia elétrica', 'Galpão'],
            access: 'Asfalto até 2km da propriedade',
            documentation: 'Escritura e ITR em dia'
          },
          {
            id: 'mock-2',
            name: 'Chácara Bela Vista',
            location: 'São Paulo, SP',
            area: 15,
            price: 850000,
            image: '/images/property-2.png',
            type: 'Chácara de Lazer',
            soil: 'Terra roxa, ideal para horta e pomar',
            water: 'Poço artesiano + açude',
            infrastructure: ['Casa', 'Piscina', 'Churrasqueira', 'Energia'],
            access: 'Estrada asfaltada até a propriedade',
            documentation: 'Documentação completa'
          },
          {
            id: 'mock-3',
            name: 'Terreno para Construção',
            location: 'Rio de Janeiro, RJ',
            area: 2,
            price: 320000,
            image: '/images/property-3.png',
            type: 'Terreno para Construção',
            soil: 'Solo firme, adequado para construção',
            water: 'Água encanada disponível',
            infrastructure: ['Energia elétrica', 'Telefone', 'Internet'],
            access: 'Rua asfaltada, transporte público',
            documentation: 'Escritura registrada'
          },
          {
            id: 'mock-4',
            name: 'Fazenda de Investimento',
            location: 'Goiás, GO',
            area: 800,
            price: 4800000,
            image: '/images/property-4.png',
            type: 'Investimento Rural',
            soil: 'Cerrado, excelente para soja e milho',
            water: 'Rio + represas artificiais',
            infrastructure: ['Galpões', 'Silos', 'Energia trifásica', 'Balança'],
            access: 'BR-364 a 15km, logística facilitada',
            documentation: 'CAR + licenças ambientais'
          },
          {
            id: 'mock-5',
            name: 'Chácara Recreio',
            location: 'Mato Grosso, MT',
            area: 8,
            price: 650000,
            image: '/images/property-5.png',
            type: 'Chácara de Lazer',
            soil: 'Solo misto, bom para paisagismo',
            water: 'Poço + córrego nos fundos',
            infrastructure: ['Casa de campo', 'Deck', 'Energia solar'],
            access: 'Estrada de terra 3km, depois asfalto',
            documentation: 'Matrícula atualizada'
          },
          {
            id: 'mock-6',
            name: 'Fazenda Orgânica',
            location: 'Espírito Santo, ES',
            area: 180,
            price: 1800000,
            image: '/images/recent-property-1.png',
            type: 'Fazenda Produtiva',
            soil: 'Certificado orgânico, muito fértil',
            water: 'Nascentes múltiplas + irrigação',
            infrastructure: ['Estufas', 'Casa sede', 'Energia solar', 'Beneficiamento'],
            access: 'Rod. BR-101 próxima, acesso pavimentado',
            documentation: 'Certificação orgânica + ITR'
          }
        ]

        try {
          await ensureAnonymousAuth()
          console.log('Auth completed')
          await seedDatabase()
          console.log('Database seeded')
          const data = await DB.getAllProperties()
          console.log('Properties loaded from Firebase:', data.length, data)

          if (data.length > 0) {
            setProperties(data)
            setFilteredProperties(data)
          } else {
            console.log('No Firebase data, using mock data')
            setProperties(mockData)
            setFilteredProperties(mockData)
          }
        } catch (firebaseError) {
          console.error('Firebase error, using mock data:', firebaseError)
          setProperties(mockData)
          setFilteredProperties(mockData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Função de busca
  const handleSearch = (searchParams) => {
    let filtered = properties

    if (searchParams.location) {
      filtered = filtered.filter(prop =>
        prop.state?.toLowerCase().includes(searchParams.location.toLowerCase())
      )
    }

    if (searchParams.type) {
      filtered = filtered.filter(prop =>
        prop.type?.toLowerCase().includes(searchParams.type.toLowerCase())
      )
    }

    if (searchParams.area) {
      // Implementar filtro por área baseado nas opções
      const [min, max] = searchParams.area.split('-').map(Number)
      if (max) {
        filtered = filtered.filter(prop =>
          prop.area >= min && prop.area <= max
        )
      } else if (searchParams.area === '50+') {
        filtered = filtered.filter(prop => prop.area >= 50)
      }
    }

    if (searchParams.purpose) {
      filtered = filtered.filter(prop =>
        prop.purpose?.toLowerCase().includes(searchParams.purpose.toLowerCase())
      )
    }

    setFilteredProperties(filtered)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Montserrat, sans-serif'
      }}>
        <div>Carregando propriedades...</div>
        <div style={{marginTop: '10px', fontSize: '14px', color: '#666'}}>
          {properties.length > 0 ? `${properties.length} propriedades carregadas` : 'Inicializando Firebase...'}
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <HeroSection onSearch={handleSearch} />
      <FeaturedProperties properties={filteredProperties} />
      <Benefits />
      <AvailableProperties properties={filteredProperties} />
      <PropertyTypes />
      <Footer recentProperties={properties} />
    </div>
  )
}