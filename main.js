// Scroll reveal — observa todos os elementos com classe .reveal já no HTML
const observer = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

function observeReveal(root = document) {
  root.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

observeReveal();

// Carrega o devocional mais recente (último do manifest) no preview da index
const featuredWrap = document.getElementById('devFeatured');
if (featuredWrap) {
  loadLatestDevocional();
}

async function loadLatestDevocional() {
  try {
    const res = await fetch('devocionais/manifest.json');
    if (!res.ok) throw new Error();
    const manifest = await res.json();

    // Pega o último item do manifest (mais recente)
    const latest = manifest[manifest.length - 1];

    const txtRes = await fetch(`devocionais/${latest.arquivo}`);
    if (!txtRes.ok) throw new Error();
    const raw = await txtRes.text();

    const lines   = raw.trim().split('\n');
    const title   = lines[0].trim();
    const verse   = lines.slice(1).find(l => l.trim().startsWith('"') || l.trim().startsWith('“')) || '';
    const bodyRaw = lines.slice(1).join(' ').replace(/---/g, '').trim();
    const preview = bodyRaw.replace(/\s+/g, ' ').slice(0, 220).trimEnd() + '…';

    featuredWrap.innerHTML = `
      <div class="dev-preview-card reveal">
        <span class="dev-preview-card__cat">${latest.categoria}</span>
        <h3 class="dev-preview-card__title">${title}</h3>
        ${verse ? `<blockquote class="dev-preview-card__verse">${verse}</blockquote>` : ''}
        <p class="dev-preview-card__text">${preview}</p>
        <a href="devocionais.html" class="dev-preview-card__link">Ler devocional completo →</a>
      </div>
    `;

    // Registra o card recém-criado no observer
    observeReveal(featuredWrap);

  } catch {
    featuredWrap.innerHTML = '';
  }
}
