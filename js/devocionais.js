const grid        = document.getElementById('devGrid');
const modal       = document.getElementById('devModal');
const modalTitle  = document.getElementById('modalTitle');
const modalCat    = document.getElementById('modalCat');
const modalBody   = document.getElementById('modalBody');
const modalClose  = document.getElementById('modalClose');
const loadingEl   = document.getElementById('devLoading');
const errorEl     = document.getElementById('devError');

// Converte texto plano em HTML formatado
function parseDevocional(raw) {
  const lines = raw.trim().split('\n');
  const title  = lines[0].trim();
  const rest   = lines.slice(1).join('\n').trim();

  // Separa versículo (linha entre aspas ou com "—") do corpo
  const bodyLines = rest.split('\n');
  let versiculo = '';
  let corpo = [];
  let passedSep = false;

  for (const line of bodyLines) {
    if (!passedSep && line.startsWith('---')) { passedSep = true; continue; }
    if (!passedSep && (line.startsWith('"') || line.startsWith('“'))) {
      versiculo = line;
    } else {
      corpo.push(line);
    }
  }

  return { title, versiculo, corpo: corpo.join('\n') };
}

// Extrai preview (primeiros ~180 chars do corpo)
function makePreview(corpo) {
  const plain = corpo.replace(/---/g, '').replace(/\n+/g, ' ').trim();
  return plain.length > 180 ? plain.slice(0, 180).trimEnd() + '…' : plain;
}

// Renderiza o corpo no modal (parágrafos + separadores + oração)
function renderCorpo(raw) {
  return raw
    .split('\n')
    .map(line => {
      const l = line.trim();
      if (l === '---') return '<hr class="modal__divider" />';
      if (l === '')    return '';
      if (l.startsWith('Oração:')) {
        return `<p class="modal__prayer"><strong>Oração:</strong> ${l.slice(8)}</p>`;
      }
      return `<p>${l}</p>`;
    })
    .join('');
}

// Cria card HTML
function createCard(meta, parsed, index) {
  const preview = makePreview(parsed.corpo);
  const card = document.createElement('article');
  card.className = 'dev-card reveal';
  card.style.animationDelay = `${index * 0.1}s`;
  card.innerHTML = `
    <div class="dev-card__top">
      <span class="dev-card__cat">${meta.categoria}</span>
      <span class="dev-card__num">Nº ${String(index + 1).padStart(2, '0')}</span>
    </div>
    <h2 class="dev-card__title">${parsed.title}</h2>
    ${parsed.versiculo ? `<blockquote class="dev-card__verse">${parsed.versiculo}</blockquote>` : ''}
    <p class="dev-card__preview">${preview}</p>
    <button class="dev-card__btn" data-index="${index}">Ler devocional completo ↗</button>
  `;
  return card;
}

// Abre modal
function openModal(meta, parsed) {
  modalTitle.textContent  = parsed.title;
  modalCat.textContent    = meta.categoria;
  modalBody.innerHTML     =
    (parsed.versiculo ? `<blockquote class="modal__verse">${parsed.versiculo}</blockquote>` : '') +
    renderCorpo(parsed.corpo);
  modal.classList.add('modal--open');
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal__box').scrollTop = 0;
}

function closeModal() {
  modal.classList.remove('modal--open');
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Carrega devocionais a partir do manifest
async function loadDevocionais() {
  try {
    const res = await fetch('devocionais/manifest.json');
    if (!res.ok) throw new Error('Manifest não encontrado');
    const manifest = await res.json();

    const fetches = manifest.map(meta =>
      fetch(`devocionais/${meta.arquivo}`)
        .then(r => { if (!r.ok) throw new Error(`Arquivo ${meta.arquivo} não encontrado`); return r.text(); })
        .then(txt => ({ meta, parsed: parseDevocional(txt) }))
    );

    const results = await Promise.all(fetches);

    loadingEl.style.display = 'none';
    results.forEach(({ meta, parsed }, i) => {
      const card = createCard(meta, parsed, i);
      grid.appendChild(card);

      // Observer para scroll reveal
      observer.observe(card);

      card.querySelector('.dev-card__btn').addEventListener('click', () => openModal(meta, parsed));
    });

  } catch (err) {
    loadingEl.style.display = 'none';
    errorEl.style.display   = 'block';
    errorEl.textContent     = `Não foi possível carregar os devocionais. Certifique-se de abrir o site via servidor web (não via file://). Detalhe: ${err.message}`;
  }
}

// Scroll reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

loadDevocionais();
