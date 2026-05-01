// Detecta a página atual para marcar o link ativo
const currentPage = location.pathname.split('/').pop() || 'index.html';

const navHTML = `
<nav class="navbar" id="navbar">
  <div class="navbar__inner">
    <a href="index.html" class="navbar__brand">
      <img src="images/logoH.png" alt="Templo de Glórias" class="navbar__logo" />
    </a>

    <button class="navbar__toggle" id="navToggle" aria-label="Abrir menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>

    <ul class="navbar__links" id="navLinks">
      <li><a href="index.html"     class="navbar__link">Início</a></li>
      <li><a href="sobre.html"     class="navbar__link">Sobre</a></li>
      <li><a href="devocionais.html" class="navbar__link">Devocionais</a></li>
      <li>
        <a href="https://wa.me/5531988627228?text=Ol%C3%A1%2C%20vim%20pelo%20QR%20Code%20e%20gostaria%20de%20saber%20mais%20sobre%20o%20Templo%20de%20Gl%C3%B3rias%20%F0%9F%99%8F"
           class="navbar__cta" target="_blank" rel="noopener">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.535 5.845L.057 23.428a.5.5 0 0 0 .612.612l5.583-1.478A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.891 0-3.663-.513-5.188-1.407l-.372-.217-3.863 1.022 1.022-3.863-.218-.372A9.944 9.944 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          WhatsApp
        </a>
      </li>
    </ul>
  </div>
</nav>
`;

// Injeta nav no topo do body
document.body.insertAdjacentHTML('afterbegin', navHTML);

// Marca link ativo
document.querySelectorAll('.navbar__link').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('navbar__link--active');
  }
});

// Hamburger toggle
const toggle = document.getElementById('navToggle');
const links  = document.getElementById('navLinks');
const navbar = document.getElementById('navbar');

toggle.addEventListener('click', () => {
  const open = links.classList.toggle('navbar__links--open');
  toggle.setAttribute('aria-expanded', open);
  toggle.classList.toggle('navbar__toggle--open', open);
});

// Fecha menu ao clicar em link
links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    links.classList.remove('navbar__links--open');
    toggle.classList.remove('navbar__toggle--open');
    toggle.setAttribute('aria-expanded', 'false');
  });
});

// Navbar com fundo sólido ao rolar
window.addEventListener('scroll', () => {
  navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
}, { passive: true });
