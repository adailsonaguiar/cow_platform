import React, { useEffect, useState } from 'react'
import PluginModal from './PluginModal'
import './App.css'
import './styles/loading.css'

export default function App() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setOpen(true), 2000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="news-page">
      {/* Header */}
      <header className="news-header">
        <div className="news-header-inner">
          <a href="#" className="news-logo">
            <div className="news-logo-icon">📰</div>
            NotíciasHoje
          </a>
          <nav className="news-nav">
            <a href="#">Início</a>
            <a href="#">Política</a>
            <a href="#">Economia</a>
            <a href="#">Tecnologia</a>
            <a href="#">Esportes</a>
            <a href="#">Cultura</a>
          </nav>
          <div className="news-search">
            🔍 Buscar notícias...
          </div>
        </div>
      </header>

      {/* Breaking News */}
      <div className="breaking-news">
        <span className="breaking-badge">Urgente</span>
        <span>Governo anuncia novo pacote de medidas econômicas para estimular o crescimento em 2026</span>
      </div>

      {/* Main Content */}
      <main className="news-main">
        <div className="news-content">
          {/* Featured Article */}
          <article className="featured-article">
            <div className="featured-image">🌍</div>
            <div className="featured-content">
              <span className="article-category">Destaque</span>
              <h1 className="featured-title">
                Inteligência Artificial revoluciona o mercado de trabalho: especialistas apontam novas tendências para 2026
              </h1>
              <p className="featured-excerpt">
                Um estudo recente conduzido por pesquisadores de universidades de todo o mundo revela que a inteligência artificial está transformando radicalmente a forma como as empresas operam. As mudanças incluem desde a automação de tarefas repetitivas até a criação de novos cargos que nem existiam há cinco anos. Especialistas alertam que a adaptação será fundamental para profissionais de todas as áreas.
              </p>
              <div className="article-meta">
                <div className="article-author">
                  <span className="author-avatar">👤</span>
                  <span>Maria Silva</span>
                </div>
                <span>•</span>
                <span>28 de Janeiro, 2026</span>
                <span>•</span>
                <span>8 min de leitura</span>
              </div>
            </div>
          </article>

          {/* Article List */}
          <div className="article-list">
            <article className="article-card">
              <div className="article-thumb tech">💻</div>
              <div className="article-info">
                <span className="article-category">Tecnologia</span>
                <h2 className="article-title">
                  Novo smartphone brasileiro promete competir com gigantes internacionais
                </h2>
                <p className="article-preview">
                  Startup nacional lança dispositivo com tecnologia 100% desenvolvida no país, incluindo processador próprio e sistema operacional baseado em Linux.
                </p>
                <div className="article-meta">
                  <span>Carlos Mendes</span>
                  <span>•</span>
                  <span>5 min atrás</span>
                </div>
              </div>
            </article>

            <article className="article-card">
              <div className="article-thumb economy">📈</div>
              <div className="article-info">
                <span className="article-category">Economia</span>
                <h2 className="article-title">
                  Bolsa de valores atinge novo recorde histórico com otimismo do mercado
                </h2>
                <p className="article-preview">
                  O Ibovespa fechou o dia com alta de 2,3%, impulsionado por resultados positivos de empresas do setor de tecnologia e commodities.
                </p>
                <div className="article-meta">
                  <span>Ana Beatriz Costa</span>
                  <span>•</span>
                  <span>32 min atrás</span>
                </div>
              </div>
            </article>

            <article className="article-card">
              <div className="article-thumb politics">🏛️</div>
              <div className="article-info">
                <span className="article-category">Política</span>
                <h2 className="article-title">
                  Congresso aprova reforma tributária após anos de discussão
                </h2>
                <p className="article-preview">
                  A nova legislação simplifica o sistema de impostos e promete reduzir a burocracia para empresas de pequeno e médio porte em todo o território nacional.
                </p>
                <div className="article-meta">
                  <span>Roberto Almeida</span>
                  <span>•</span>
                  <span>1 hora atrás</span>
                </div>
              </div>
            </article>

            <article className="article-card">
              <div className="article-thumb sports">⚽</div>
              <div className="article-info">
                <span className="article-category">Esportes</span>
                <h2 className="article-title">
                  Seleção Brasileira convoca novos talentos para amistosos internacionais
                </h2>
                <p className="article-preview">
                  Técnico aposta em renovação e chama jogadores sub-23 que se destacaram nos campeonatos estaduais e na Copa do Brasil.
                </p>
                <div className="article-meta">
                  <span>Paulo Henrique</span>
                  <span>•</span>
                  <span>2 horas atrás</span>
                </div>
              </div>
            </article>

            <article className="article-card">
              <div className="article-thumb culture">🎬</div>
              <div className="article-info">
                <span className="article-category">Cultura</span>
                <h2 className="article-title">
                  Festival de cinema brasileiro bate recorde de público em sua 15ª edição
                </h2>
                <p className="article-preview">
                  Evento celebra produções nacionais e internacionais, com destaque para documentários sobre questões sociais e ambientais.
                </p>
                <div className="article-meta">
                  <span>Juliana Ferreira</span>
                  <span>•</span>
                  <span>3 horas atrás</span>
                </div>
              </div>
            </article>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="news-sidebar">
          {/* Trending */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Em Alta</h3>
            <div className="trending-list">
              <div className="trending-item">
                <span className="trending-number">01</span>
                <div className="trending-content">
                  <h4>Criptomoedas voltam a subir após período de instabilidade</h4>
                  <span>4.2k visualizações</span>
                </div>
              </div>
              <div className="trending-item">
                <span className="trending-number">02</span>
                <div className="trending-content">
                  <h4>Previsão do tempo indica onda de calor para o Sudeste</h4>
                  <span>3.8k visualizações</span>
                </div>
              </div>
              <div className="trending-item">
                <span className="trending-number">03</span>
                <div className="trending-content">
                  <h4>Cientistas descobrem novo tratamento para doenças raras</h4>
                  <span>3.1k visualizações</span>
                </div>
              </div>
              <div className="trending-item">
                <span className="trending-number">04</span>
                <div className="trending-content">
                  <h4>Startup brasileira recebe investimento milionário</h4>
                  <span>2.7k visualizações</span>
                </div>
              </div>
              <div className="trending-item">
                <span className="trending-number">05</span>
                <div className="trending-content">
                  <h4>Nova série nacional estreia com recorde de audiência</h4>
                  <span>2.3k visualizações</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="newsletter-box">
            <h3>📬 Newsletter Diária</h3>
            <p>Receba as principais notícias do dia diretamente no seu e-mail. Sem spam, prometemos!</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Seu melhor e-mail" />
              <button type="submit">Inscrever-se Grátis</button>
            </form>
          </div>

          {/* Tags */}
          <div className="sidebar-section">
            <h3 className="sidebar-title">Tópicos</h3>
            <div className="tags-cloud">
              <span className="tag">Inteligência Artificial</span>
              <span className="tag">Economia</span>
              <span className="tag">Política</span>
              <span className="tag">Sustentabilidade</span>
              <span className="tag">Saúde</span>
              <span className="tag">Educação</span>
              <span className="tag">Startups</span>
              <span className="tag">Esportes</span>
              <span className="tag">Entretenimento</span>
            </div>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="news-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col">
              <h4>Sobre Nós</h4>
              <ul>
                <li><a href="#">Quem Somos</a></li>
                <li><a href="#">Nossa Equipe</a></li>
                <li><a href="#">Trabalhe Conosco</a></li>
                <li><a href="#">Contato</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Editorias</h4>
              <ul>
                <li><a href="#">Política</a></li>
                <li><a href="#">Economia</a></li>
                <li><a href="#">Tecnologia</a></li>
                <li><a href="#">Internacional</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Serviços</h4>
              <ul>
                <li><a href="#">Newsletter</a></li>
                <li><a href="#">Aplicativo</a></li>
                <li><a href="#">RSS</a></li>
                <li><a href="#">Anuncie</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Termos de Uso</a></li>
                <li><a href="#">Privacidade</a></li>
                <li><a href="#">Cookies</a></li>
                <li><a href="#">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 NotíciasHoje. Todos os direitos reservados.</span>
            <div className="footer-social">
              <a href="#">Twitter</a>
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Trigger Button */}
      <button className="demo-trigger" onClick={() => setOpen(true)}>
        🎁 Ganhe Prêmios
      </button>

      {/* Plugin Modal */}
      <PluginModal open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
