// ==========================================
// 1. ESTADO GLOBAL E VARIÁVEIS
// ==========================================
let produtos = []; // Preenchido via produtos.json

let estado = {
    telaAtual: 'home',
    categoriaFiltro: 'todos',
    termoBusca: '',
    produtoModalId: null,
    descontoPercentual: 0,
    freteValor: 0
};

// ==========================================
// ÍCONES PERSONALIZADOS (SVG)
// ==========================================
function getIconeUsuarioHTML(tipo = 'circulo') {
    // tipo: 'circulo' | 'quadrado' | 'outline'
    const estilotransform = tipo === 'circulo' ? 'border-radius: 50%;' : tipo === 'quadrado' ? 'border-radius: 6px;' : '';
    const bg = tipo === 'outline' ? 'background: transparent; border: 1px solid #6c5ce7;' : 'background: #6c5ce7;';

    return `
        <span class="icone-box" style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; ${bg} ${estilotransform} vertical-align: middle; margin-right: 4px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
            </svg>
        </span>
    `;
}

function getIconeConfigHTML(tipo = 'circulo') {
    // tipo: 'circulo' | 'quadrado' | 'outline'
    const estilotransform = tipo === 'circulo' ? 'border-radius: 50%;' : tipo === 'quadrado' ? 'border-radius: 6px;' : '';
    const bg = tipo === 'outline' ? 'background: transparent; border: 1px solid #3f4265;' : 'background: #2a2d4a;';

    return `
        <span class="icone-box" style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; ${bg} ${estilotransform} vertical-align: middle; margin-right: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
        </span>
    `;
}

// ==========================================
// DICIONÁRIOS E MAPEAMENTOS
// ==========================================
const logosCategorias = {
    'todos': 'imagens/Logo.png',
    'favoritos': 'imagens/Logo.png',
    'canecas': 'imagens/logo-canecas.png',
    'ac': 'imagens/logo-ac.png',
    'quadros': 'imagens/logo-quadros.png',
    'mangas': 'imagens/logo-manga.png',
    'ln': 'imagens/logo-ln.png',
    'hq': 'imagens/logo-quadrinhos.png',
    'games': 'imagens/logo-games.png',
    'colecionaveis': 'imagens/logo-colecionaveis.png',
    'roupas': 'imagens/logo-roupas.png'
};

const nomesCategorias = {
    'canecas': 'Caneca Geek',
    'ac': 'Action Figure',
    'roupas': 'Vestuário / Cosplay',
    'quadros': 'Quadro / Decorativo',
    'mangas': 'Mangá',
    'ln': 'Light Novel',
    'hq': 'História em Quadrinhos',
    'games': 'Jogo / Video Game',
    'colecionaveis': 'Item Colecionável'
};

function atualizarLogoHeader() {
    const logoImg = document.querySelector('#logoLink img');
    if (logoImg) {
        const catAtiva = estado.telaAtual === 'home' ? estado.categoriaFiltro : 'todos';
        const caminhoLogo = logosCategorias[catAtiva] || logosCategorias['todos'];
        
        logoImg.src = caminhoLogo;
        logoImg.alt = `Logo ${catAtiva}`;
    }
}

// ==========================================
// 2. BUSCA DE DADOS DO JSON
// ==========================================
async function carregarProdutos() {
    try {
        const resposta = await fetch('produtos.json');
        
        if (!resposta.ok) {
            throw new Error(`Erro na requisição: ${resposta.status}`);
        }

        produtos = await resposta.json();
        render();

    } catch (erro) {
        console.error('Erro ao carregar produtos.json:', erro);
        const main = document.getElementById('app');
        if (main) {
            main.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #ff5252;">
                    <h2>⚠️ Não foi possível carregar os produtos</h2>
                    <p>Verifique se o arquivo <strong>produtos.json</strong> está salvo na mesma pasta do arquivo HTML.</p>
                </div>
            `;
        }
    }
}

// ==========================================
// 3. GERENCIAMENTO DE USUÁRIO (LOCALSTORAGE)
// ==========================================
function getUsuarioLogado() {
    return JSON.parse(localStorage.getItem("usuario_hub")) || null;
}

function salvarUsuario(usuario) {
    localStorage.setItem("usuario_hub", JSON.stringify(usuario));
    atualizarUIHeader();
}

function fazerLogout() {
    localStorage.removeItem("usuario_hub");
    atualizarUIHeader();
    navegaPara('home');
}

function atualizarUIHeader() {
    const btnCadastro = document.getElementById("btnIrCadastro");
    const btnConfig = document.getElementById("btnIrConfig");
    const usuario = getUsuarioLogado();

    // Formato dos ícones: 'circulo', 'quadrado' ou 'outline'
    const FORMA_ICONE = 'circulo'; 

    if (btnCadastro) {
        if (usuario) {
            const primeiroNome = usuario.nome.split(' ')[0];
            btnCadastro.innerHTML = `${getIconeUsuarioHTML(FORMA_ICONE)} <span>${primeiroNome}</span>`;
            btnCadastro.title = `Conectado como ${usuario.nome}`;
        } else {
            btnCadastro.innerHTML = `${getIconeUsuarioHTML(FORMA_ICONE)} <span>Entrar</span>`;
            btnCadastro.title = "Cadastro / Login";
        }
    }

    if (btnConfig) {
        btnConfig.innerHTML = getIconeConfigHTML(FORMA_ICONE);
        btnConfig.title = "Configurações";
    }
}

// ==========================================
// 3.1 GERENCIAMENTO E RASTREAMENTO DE PEDIDOS
// ==========================================
function getPedidos() {
    return JSON.parse(localStorage.getItem("pedidos_hub")) || [];
}

function salvarPedido(novoPedido) {
    const pedidos = getPedidos();
    pedidos.unshift(novoPedido);
    localStorage.setItem("pedidos_hub", JSON.stringify(pedidos));
}

function getPedidosUsuarioAtual() {
    const usuario = getUsuarioLogado();
    if (!usuario) return [];
    const todosPedidos = getPedidos();
    return todosPedidos.filter(p => p.usuarioEmail === usuario.email);
}

function renderLinhaTempoRastreamentoHTML(pedido) {
    const etapas = [
        { id: 1, label: 'Pedido Recebido', icone: '📝' },
        { id: 2, label: 'Pagamento Aprovado', icone: '💳' },
        { id: 3, label: 'Em Separação', icone: '📦' },
        { id: 4, label: 'Em Trânsito', icone: '🚚' },
        { id: 5, label: 'Entregue', icone: '🏠' }
    ];

    const etapaAtual = pedido.statusEtapa || 2;

    return `
        <div style="margin-top: 15px; padding: 15px; background: #141526; border-radius: 8px; border: 1px solid #2a2d4a;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 0.85rem; color: #a0a3c4; flex-wrap: wrap; gap: 8px;">
                <span>Rastreio: <strong style="color: #6c5ce7;">${pedido.codigoRastreio || 'N/A'}</strong></span>
                <span>Status: <strong style="color: #00e676;">${etapas.find(e => e.id === etapaAtual)?.label}</strong></span>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; position: relative; gap: 4px;">
                ${etapas.map(etapa => {
                    const concluida = etapa.id <= etapaAtual;
                    return `
                        <div style="display: flex; flex-direction: column; align-items: center; flex: 1; text-align: center;">
                            <div style="width: 32px; height: 32px; border-radius: 50%; background: ${concluida ? '#6c5ce7' : '#1e2038'}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; margin-bottom: 4px; border: 2px solid ${concluida ? '#00e676' : '#3f4265'};">
                                ${etapa.icone}
                            </div>
                            <span style="font-size: 0.7rem; color: ${concluida ? '#fff' : '#6b7280'}; font-weight: ${concluida ? 'bold' : 'normal'};">${etapa.label}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ==========================================
// 4. GERENCIAMENTO DO CARRINHO (LOCALSTORAGE)
// ==========================================
function getCarrinho() {
    return JSON.parse(localStorage.getItem("carrinho_hub")) || [];
}

function salvarCarrinho(carrinho) {
    localStorage.setItem("carrinho_hub", JSON.stringify(carrinho));
    atualizarBadge();
}

function atualizarBadge() {
    const badge = document.getElementById("cartCountBadge");
    if (badge) {
        const carrinho = getCarrinho();
        const total = carrinho.reduce((acc, item) => acc + item.qtd, 0);
        badge.textContent = total;
    }
}

// ==========================================
// 5. GERENCIAMENTO DE FAVORITOS (LOCALSTORAGE)
// ==========================================
function getFavoritos() {
    return JSON.parse(localStorage.getItem("favoritos_hub")) || [];
}

function salvarFavoritos(favoritos) {
    localStorage.setItem("favoritos_hub", JSON.stringify(favoritos));
}

function toggleFavorito(id) {
    let favoritos = getFavoritos();
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(favId => favId !== id);
    } else {
        favoritos.push(id);
    }
    salvarFavoritos(favoritos);
    render();
}

// ==========================================
// 5.1 GERENCIAMENTO DE AVALIAÇÕES (LOCALSTORAGE)
// ==========================================
function getAvaliacoes() {
    return JSON.parse(localStorage.getItem("avaliacoes_hub")) || {};
}

function salvarAvaliacoes(avaliacoes) {
    localStorage.setItem("avaliacoes_hub", JSON.stringify(avaliacoes));
}

function adicionarAvaliacao(produtoId, nota, comentario) {
    const usuario = getUsuarioLogado();
    const nomeAutor = usuario ? usuario.nome : "Anônimo";
    
    const avaliacoes = getAvaliacoes();
    if (!avaliacoes[produtoId]) {
        avaliacoes[produtoId] = [];
    }

    avaliacoes[produtoId].push({
        autor: nomeAutor,
        nota: Number(nota),
        comentario: comentario.trim(),
        data: new Date().toLocaleDateString('pt-BR')
    });

    salvarAvaliacoes(avaliacoes);
    render();
}

function getResumoAvaliacoes(produtoId) {
    const avaliacoes = getAvaliacoes()[produtoId] || [];
    if (avaliacoes.length === 0) return { media: 0, total: 0 };

    const soma = avaliacoes.reduce((acc, curr) => acc + curr.nota, 0);
    const media = (soma / avaliacoes.length).toFixed(1);
    return { media: Number(media), total: avaliacoes.length };
}

function renderEstrelasHTML(nota) {
    const cheias = Math.round(nota);
    let html = '';
    for (let i = 1; i <= 5; i++) {
        html += i <= cheias ? '★' : '☆';
    }
    return `<span class="estrelas-exibicao" style="color: #ffca28;">${html}</span>`;
}

function renderSecaoAvaliacoesHTML(produtoId) {
    const lista = getAvaliacoes()[produtoId] || [];

    return `
        <div class="box-avaliacoes">
            <h4 style="margin-bottom: 8px; color: #fff;">Avaliações do Produto</h4>
            
            <form class="form-avaliacao" data-id="${produtoId}">
                <div class="campo-estrelas" style="margin-bottom: 8px;">
                    <label style="font-size: 0.85rem; color: #a0a3c4;">Sua nota: </label>
                    <select name="nota" required style="background: #1e2038; color: #ffca28; border: 1px solid #3f4265; padding: 4px; border-radius: 4px;">
                        <option value="5">★★★★★ (5)</option>
                        <option value="4">★★★★☆ (4)</option>
                        <option value="3">★★★☆☆ (3)</option>
                        <option value="2">★★☆☆☆ (2)</option>
                        <option value="1">★☆☆☆☆ (1)</option>
                    </select>
                </div>
                <textarea name="comentario" placeholder="Escreva o que achou do produto..." required maxlength="200" style="width: 100%; background: #1e2038; border: 1px solid #3f4265; color: #fff; padding: 8px; border-radius: 6px; resize: none; height: 50px; font-size: 0.85rem; margin-bottom: 8px; box-sizing: border-box;"></textarea>
                <button type="submit" class="btn-enviar-aval" style="background: #6c5ce7; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; width: 100%;">Enviar Avaliação</button>
            </form>

            <div class="lista-comentarios" style="margin-top: 12px;">
                ${lista.length === 0 ? '<p style="font-size: 0.8rem; color: #a0a3c4;">Nenhum comentário ainda.</p>' : ''}
                ${lista.map(item => `
                    <div class="item-comentario" style="background: #1a1c30; padding: 8px; border-radius: 6px; margin-bottom: 8px; text-align: left;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 4px;">
                            <strong style="color: #fff;">${item.autor}</strong>
                            <span>${renderEstrelasHTML(item.nota)}</span>
                        </div>
                        <p style="font-size: 0.85rem; color: #d1d5db; margin: 4px 0;">${item.comentario}</p>
                        <small style="color: #6b7280; font-size: 0.7rem;">${item.data}</small>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ==========================================
// 6. MODAL DE DETALHES DO PRODUTO
// ==========================================
function renderModalDetalhesHTML() {
    if (!estado.produtoModalId) return '';

    const p = produtos.find(item => item.id === estado.produtoModalId);
    if (!p) return '';

    const { media, total } = getResumoAvaliacoes(p.id);
    const semEstoque = p.estoque <= 0;
    const nomeCategoria = nomesCategorias[p.categoria] || p.categoria;

    const descricao = p.descricao || `Produto oficial e de alta qualidade: <strong>${p.nome}</strong>. Ideal para fãs, colecionadores e amantes do universo geek e pop culture. Adicione à sua coleção hoje mesmo!`;

    return `
        <div id="modalDetalhesOverlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;">
            <div style="background: #1e2038; border-radius: 12px; max-width: 650px; width: 100%; max-height: 90vh; overflow-y: auto; padding: 25px; position: relative; color: #fff; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
                
                <button id="btnFecharModal" style="position: absolute; top: 15px; right: 15px; background: transparent; border: none; color: #a0a3c4; font-size: 1.5rem; cursor: pointer;">✖</button>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 10px;">
                    <div style="display: flex; align-items: center; justify-content: center;">
                        <img src="${p.imagem}" alt="${p.nome}" style="width: 100%; max-height: 300px; border-radius: 8px; object-fit: contain; background: #141526; padding: 10px; box-sizing: border-box;">
                    </div>

                    <div style="display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <span style="font-size: 0.75rem; background: #6c5ce7; color: #fff; padding: 4px 10px; border-radius: 12px; font-weight: bold; text-transform: uppercase;">${nomeCategoria}</span>
                            <h2 style="margin: 12px 0 6px 0; font-size: 1.4rem; color: #fff;">${p.nome}</h2>
                            
                            <div style="margin-bottom: 12px;">
                                ${renderEstrelasHTML(media)}
                                <small style="color: #a0a3c4;">(${total > 0 ? `${media} de 5 (${total} avaliações)` : 'Sem avaliações ainda'})</small>
                            </div>

                            ${renderPrecoHTML(p)}

                            <p style="font-size: 0.9rem; color: #c0c3e0; margin: 15px 0; line-height: 1.5;">
                                ${descricao}
                            </p>

                            <div style="background: #141526; padding: 10px 14px; border-radius: 6px; font-size: 0.85rem; margin-bottom: 15px;">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                                    <span style="color: #a0a3c4;">Código (ID):</span>
                                    <strong style="color: #fff;">#${p.id}</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between;">
                                    <span style="color: #a0a3c4;">Disponibilidade:</span>
                                    <strong style="color: ${semEstoque ? '#ff5252' : '#00e676'};">${semEstoque ? 'Esgotado' : `${p.estoque} unidades`}</strong>
                                </div>
                            </div>
                        </div>

                        <button class="btn-comprar-modal" data-id="${p.id}" ${semEstoque ? 'disabled' : ''} style="width: 100%; padding: 12px; font-size: 1rem; cursor: pointer; background: #6c5ce7; color: #fff; border: none; border-radius: 6px; font-weight: bold;">
                            ${semEstoque ? 'Esgotado' : '🛒 Adicionar ao Carrinho'}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    `;
}

// ==========================================
// 7. CONFIGURAÇÕES E TEMA (LOCALSTORAGE)
// ==========================================
function getConfiguracoes() {
    return JSON.parse(localStorage.getItem("config_hub")) || {
        tema: 'dark',
        notificacoes: true,
        moeda: 'BRL'
    };
}

function salvarConfiguracoes(config) {
    localStorage.setItem("config_hub", JSON.stringify(config));
    aplicarTema(config.tema);
}

function aplicarTema(tema) {
    if (tema === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

// ==========================================
// 8. ROTEADOR E NAVEGAÇÃO
// ==========================================
function navegaPara(tela) {
    estado.telaAtual = tela;
    render();
}

function render() {
    const main = document.getElementById('app');
    if (!main) return;

    atualizarBadge();

    if (estado.telaAtual === 'home') {
        renderHome(main);
    } else if (estado.telaAtual === 'carrinho') {
        renderCarrinho(main);
    } else if (estado.telaAtual === 'cadastro') {
        renderCadastro(main);
    } else if (estado.telaAtual === 'configuracoes') {
        renderConfiguracoes(main);
    }

    const modalHTML = renderModalDetalhesHTML();
    if (modalHTML) {
        main.insertAdjacentHTML('beforeend', modalHTML);
        
        const btnFechar = document.getElementById('btnFecharModal');
        const overlay = document.getElementById('modalDetalhesOverlay');
        const btnComprarModal = document.querySelector('.btn-comprar-modal');

        if (btnComprarModal) {
            btnComprarModal.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.getAttribute('data-id'));
                const prod = produtos.find(p => p.id === id);
                
                if (!prod || prod.estoque <= 0) return;

                let carrinho = getCarrinho();
                const itemExistente = carrinho.find(i => i.id === id);

                if (itemExistente) {
                    itemExistente.qtd += 1;
                } else {
                    carrinho.push({ ...prod, qtd: 1 });
                }

                prod.estoque -= 1;
                salvarCarrinho(carrinho);
                alert(`${prod.nome} foi adicionado ao carrinho!`);
                
                estado.produtoModalId = null;
                render();
            });
        }

        if (btnFechar) {
            btnFechar.addEventListener('click', () => {
                estado.produtoModalId = null;
                render();
            });
        }

        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    estado.produtoModalId = null;
                    render();
                }
            });
        }
    }

    atualizarLogoHeader();
}

// ==========================================
// 9. RENDERS DE TELAS
// ==========================================

function renderPrecoHTML(p) {
    if (p.precoOriginal && p.precoOriginal > p.preco) {
        const pctDesconto = Math.round(((p.precoOriginal - p.preco) / p.precoOriginal) * 100);
        return `
            <div class="container-preco">
                <span class="preco-antigo">R$ ${p.precoOriginal.toFixed(2).replace('.', ',')}</span>
                <span class="preco-atual">R$ ${p.preco.toFixed(2).replace('.', ',')}</span>
                <span class="badge-desconto">-${pctDesconto}%</span>
            </div>
        `;
    }
    return `<div class="container-preco"><span class="preco-atual">R$ ${p.preco.toFixed(2).replace('.', ',')}</span></div>`;
}

// TELA PRINCIPAL / HOME
function renderHome(container) {
    const favoritos = getFavoritos();
    const produtosDestaque = produtos.filter(p => p.destaque);
    
    let listaFiltrada = produtos;
    if (estado.categoriaFiltro === 'favoritos') {
        listaFiltrada = produtos.filter(p => favoritos.includes(p.id));
    } else if (estado.categoriaFiltro !== 'todos') {
        listaFiltrada = produtos.filter(p => p.categoria === estado.categoriaFiltro);
    }

    if (estado.termoBusca.trim() !== '') {
        const termo = estado.termoBusca.toLowerCase().trim();
        listaFiltrada = listaFiltrada.filter(p => p.nome.toLowerCase().includes(termo));
    }

    const htmlDestaques = (estado.categoriaFiltro === 'todos' && !estado.termoBusca) ? `
        <section class="destaques-section">
            <h2 class="secao-titulo">🔥 Destaques da Semana</h2>
            <div class="destaques-grid">
                ${produtosDestaque.map(p => {
                    const semEstoque = p.estoque <= 0;
                    const ehFavorito = favoritos.includes(p.id);
                    const { media, total } = getResumoAvaliacoes(p.id);

                    return `
                        <div class="card-destaque ${semEstoque ? 'card-esgotado' : ''}">
                            <button class="btn-favorito ${ehFavorito ? 'ativo' : ''}" data-id="${p.id}" title="${ehFavorito ? 'Remover dos Favoritos' : 'Favoritar'}">
                                ${ehFavorito ? '❤️' : '🤍'}
                            </button>
                            <span class="badge-destaque">EM ALTA</span>
                            <img src="${p.imagem}" alt="${p.nome}" class="btn-detalhes" data-id="${p.id}" style="cursor: pointer;">
                            <div class="destaque-info">
                                <h3 class="btn-detalhes" data-id="${p.id}" style="cursor: pointer;">${p.nome}</h3>
                                
                                <div class="card-avaliacao-resumo" style="margin: 4px 0;">
                                    ${renderEstrelasHTML(media)}
                                    <small style="color: #a0a3c4;">(${total > 0 ? `${media} • ${total}` : 'Sem avaliações'})</small>
                                </div>

                                ${renderPrecoHTML(p)}
                                
                                <div style="display: flex; gap: 6px; margin-top: 10px;">
                                    <button class="btn-detalhes" data-id="${p.id}" style="flex: 1; background: #3f4265; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">👁️ Detalhes</button>
                                    <button class="btn-comprar" data-id="${p.id}" ${semEstoque ? 'disabled' : ''} style="flex: 1.5;">
                                        ${semEstoque ? 'Esgotado' : '⚡ Comprar'}
                                    </button>
                                </div>

                                <button class="btn-ver-avaliacoes" data-id="${p.id}" style="background: transparent; border: 1px solid #3f4265; color: #a0a3c4; padding: 6px 12px; border-radius: 6px; cursor: pointer; margin-top: 8px; width: 100%; font-size: 0.85rem;">💬 Avaliações</button>
                                
                                <div class="painel-avaliacoes" id="painel-aval-${p.id}" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 1px solid #2a2d4a;">
                                    ${renderSecaoAvaliacoesHTML(p.id)}
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </section>
        <h2 class="secao-titulo">🛒 Todos os Produtos</h2>
    ` : '';

    const tituloSecao = estado.categoriaFiltro === 'favoritos' ? '❤️ Meus Favoritos' : '🛒 Produtos';

    const htmlBarraBusca = `
        <div class="busca-wrapper" style="max-width: 600px; margin: 0 auto 25px auto; padding: 0 15px;">
            <div style="position: relative; display: flex; align-items: center;">
                <input 
                    type="text" 
                    id="inputBuscaProdutos" 
                    placeholder="🔍 Digite o nome do produto..." 
                    value="${estado.termoBusca}"
                    style="width: 100%; padding: 12px 16px; padding-right: 40px; border-radius: 8px; border: 1px solid #3f4265; background: #1e2038; color: #fff; font-size: 0.95rem; box-sizing: border-box; outline: none;"
                >
                ${estado.termoBusca ? `
                    <button id="btnLimparBusca" style="position: absolute; right: 10px; background: transparent; border: none; color: #a0a3c4; cursor: pointer; font-size: 1.1rem;">✖</button>
                ` : ''}
            </div>
        </div>
    `;

    container.innerHTML = `
        ${htmlBarraBusca}
        ${htmlDestaques}
        ${(estado.categoriaFiltro !== 'todos' || estado.termoBusca) ? `<h2 class="secao-titulo">${tituloSecao} ${estado.termoBusca ? `(Resultados para "${estado.termoBusca}")` : ''}</h2>` : ''}
        ${listaFiltrada.length === 0 ? `<p style="text-align: center; padding: 40px; color: #a0a3c4;">Nenhum produto encontrado.</p>` : ''}
        <div class="cards">
            ${listaFiltrada.map(p => {
                const semEstoque = p.estoque <= 0;
                const ehFavorito = favoritos.includes(p.id);
                const { media, total } = getResumoAvaliacoes(p.id);

                return `
                    <div class="card ${semEstoque ? 'card-esgotado' : ''}">
                        <button class="btn-favorito ${ehFavorito ? 'ativo' : ''}" data-id="${p.id}" title="${ehFavorito ? 'Remover dos Favoritos' : 'Favoritar'}">
                            ${ehFavorito ? '❤️' : '🤍'}
                        </button>
                        <img src="${p.imagem}" class="imagem_produto btn-detalhes" data-id="${p.id}" alt="${p.nome}" style="cursor: pointer;">
                        <h3 class="btn-detalhes" data-id="${p.id}" style="cursor: pointer;">${p.nome}</h3>
                        
                        <div class="card-avaliacao-resumo" style="margin: 4px 0;">
                            ${renderEstrelasHTML(media)}
                            <small style="color: #a0a3c4;">(${total > 0 ? `${media} • ${total}` : 'Sem avaliações'})</small>
                        </div>

                        ${renderPrecoHTML(p)}
                        <small style="margin: 0 15px 10px; color: #a0a3c4;">
                            ${semEstoque ? 'Sem estoque disponível' : `Estoque: ${p.estoque} un.`}
                        </small>

                        <div style="display: flex; gap: 6px; margin: 0 15px;">
                            <button class="btn-detalhes" data-id="${p.id}" style="flex: 1; background: #3f4265; color: #fff; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-size: 0.85rem;">👁️ Detalhes</button>
                            <button class="btn-comprar" data-id="${p.id}" ${semEstoque ? 'disabled' : ''} style="flex: 1.5;">
                                ${semEstoque ? 'Esgotado' : 'Comprar'}
                            </button>
                        </div>
                        
                        <button class="btn-ver-avaliacoes" data-id="${p.id}" style="background: transparent; border: 1px solid #3f4265; color: #a0a3c4; padding: 6px 12px; border-radius: 6px; cursor: pointer; margin-top: 8px; width: 100%; font-size: 0.85rem;">💬 Avaliações</button>
                        
                        <div class="painel-avaliacoes" id="painel-aval-${p.id}" style="display: none; margin-top: 10px; padding-top: 10px; border-top: 1px solid #2a2d4a;">
                            ${renderSecaoAvaliacoesHTML(p.id)}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    container.querySelectorAll('.btn-detalhes').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            estado.produtoModalId = id;
            render();
        });
    });

    const inputBusca = container.querySelector('#inputBuscaProdutos');
    if (inputBusca) {
        inputBusca.addEventListener('input', (e) => {
            estado.termoBusca = e.target.value;
            render();
            const inputAtualizado = document.querySelector('#inputBuscaProdutos');
            if (inputAtualizado) {
                inputAtualizado.focus();
                inputAtualizado.setSelectionRange(inputAtualizado.value.length, inputAtualizado.value.length);
            }
        });
    }

    const btnLimpar = container.querySelector('#btnLimparBusca');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            estado.termoBusca = '';
            render();
        });
    }

    container.querySelectorAll('.btn-favorito').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            toggleFavorito(id);
        });
    });

    container.querySelectorAll('.btn-comprar').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.target.getAttribute('data-id'));
            const prod = produtos.find(p => p.id === id);
            
            if (!prod || prod.estoque <= 0) return;

            let carrinho = getCarrinho();
            const itemExistente = carrinho.find(i => i.id === id);

            if (itemExistente) {
                itemExistente.qtd += 1;
            } else {
                carrinho.push({ ...prod, qtd: 1 });
            }

            prod.estoque -= 1;
            salvarCarrinho(carrinho);
            alert(`${prod.nome} foi adicionado ao carrinho!`);
            
            estado.produtoModalId = null;
            render();
        });
    });

    container.querySelectorAll('.btn-ver-avaliacoes').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const painel = container.querySelector(`#painel-aval-${id}`);
            if (painel) {
                painel.style.display = painel.style.display === 'none' ? 'block' : 'none';
            }
        });
    });

    container.querySelectorAll('.form-avaliacao').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = parseInt(form.getAttribute('data-id'));
            const nota = form.nota.value;
            const comentario = form.comentario.value;

            adicionarAvaliacao(id, nota, comentario);
        });
    });
}

// TELA DO CARRINHO DE COMPRAS
function renderCarrinho(container) {
    const carrinho = getCarrinho();
    const META_FRETE_GRATIS = 400;

    if (carrinho.length === 0) {
        container.innerHTML = `
            <div class="carrinho-vazio-box">
                <h2>Seu carrinho está vazio! 😢</h2>
                <p>Aproveite nossas ofertas e adicione seus colecionáveis favoritos.</p>
                <button class="btn" id="btnVoltarLoja" style="margin: 20px auto 0 auto;">Ver Produtos</button>
            </div>
        `;
        document.getElementById('btnVoltarLoja').addEventListener('click', () => navegaPara('home'));
        return;
    }

    let subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.qtd), 0);
    const valorDesconto = subtotal * estado.descontoPercentual;
    const totalFinal = Math.max(0, subtotal - valorDesconto + estado.freteValor);

    const faltamFrete = META_FRETE_GRATIS - subtotal;
    const pctFrete = Math.min(100, (subtotal / META_FRETE_GRATIS) * 100);

    const usuario = getUsuarioLogado();
    const cepCadastrado = (usuario && usuario.endereco) ? usuario.endereco.cep : '';

    container.innerHTML = `
        <div class="carrinho-page">
            <div class="carrinho-header">
                <h1>Meu Carrinho de Compras</h1>
            </div>

            <div class="frete-progresso-card">
                <p>
                    ${subtotal >= META_FRETE_GRATIS
                        ? '🎉 Você ganhou <strong>FRETE GRÁTIS</strong>!'
                        : `🚚 Falta apenas <strong>R$ ${faltamFrete.toFixed(2).replace('.', ',')}</strong> para Frete Grátis!`}
                </p>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${pctFrete}%;"></div>
                </div>
            </div>

            <div class="carrinho-grid">
                <section class="carrinho-itens-card">
                    ${carrinho.map(item => `
                        <div class="carrinho-item">
                            <img src="${item.imagem}" alt="${item.nome}">
                            <div class="item-detalhes">
                                <h4>${item.nome}</h4>
                                <p>R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div class="item-qtd-control">
                                <button class="btn-qtd qtd-menos" data-id="${item.id}">-</button>
                                <span>${item.qtd}</span>
                                <button class="btn-qtd qtd-mais" data-id="${item.id}">+</button>
                            </div>
                            <button class="btn-remover-item" data-id="${item.id}">🗑️</button>
                        </div>
                    `).join('')}
                </section>

                <aside class="resumo-card">
                    <h2>Resumo do Pedido</h2>
                   
                    <div class="box-calculo">
                        <label for="cupomInput">Cupom de Desconto</label>
                        <div class="input-btn-group">
                            <input type="text" id="cupomInput" placeholder="Ex: GEEK10">
                            <button type="button" id="btnCupom">Aplicar</button>
                        </div>
                    </div>

                    <div class="box-calculo">
                        <label for="cepInput">Calcular Frete (CEP)</label>
                        <div class="input-btn-group">
                            <input type="text" id="cepInput" placeholder="00000-000" maxlength="9" value="${cepCadastrado}">
                            <button type="button" id="btnFrete">Calcular</button>
                        </div>
                    </div>

                    <div class="resumo-detalhes">
                        <div class="resumo-linha">
                            <span>Subtotal:</span>
                            <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        ${estado.descontoPercentual > 0 ? `
                            <div class="resumo-linha" style="color: #00e676;">
                                <span>Desconto:</span>
                                <span>- R$ ${valorDesconto.toFixed(2).replace('.', ',')}</span>
                            </div>
                        ` : ''}
                        <div class="resumo-linha">
                            <span>Frete:</span>
                            <span>R$ ${estado.freteValor.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div class="resumo-linha linha-total">
                            <span>Total:</span>
                            <span>R$ ${totalFinal.toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>

                    <button class="btn-finalizar" id="btnFinalizar">Finalizar Compra</button>
                </aside>
            </div>
        </div>
    `;

    container.querySelectorAll('.qtd-mais').forEach(b => b.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const prod = produtos.find(p => p.id === id);

        if (prod && prod.estoque > 0) {
            prod.estoque -= 1;
            let c = getCarrinho().map(i => i.id === id ? {...i, qtd: i.qtd + 1} : i);
            salvarCarrinho(c);
            render();
        } else {
            alert("Não há mais estoque disponível deste produto!");
        }
    }));

    container.querySelectorAll('.qtd-menos').forEach(b => b.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const prod = produtos.find(p => p.id === id);
        let carrinho = getCarrinho();
        const item = carrinho.find(i => i.id === id);

        if (item) {
            if (item.qtd > 1) {
                item.qtd -= 1;
                if (prod) prod.estoque += 1;
            } else {
                carrinho = carrinho.filter(i => i.id !== id);
                if (prod) prod.estoque += 1;
            }
            salvarCarrinho(carrinho);
            render();
        }
    }));

    container.querySelectorAll('.btn-remover-item').forEach(b => b.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const prod = produtos.find(p => p.id === id);
        let carrinho = getCarrinho();
        const item = carrinho.find(i => i.id === id);

        if (item) {
            if (prod) prod.estoque += item.qtd;
            carrinho = carrinho.filter(i => i.id !== id);
            salvarCarrinho(carrinho);
            render();
        }
    }));

    document.getElementById('btnCupom').addEventListener('click', () => {
        const val = document.getElementById('cupomInput').value.trim().toUpperCase();
        if (val === 'GEEK10') {
            estado.descontoPercentual = 0.10;
        } else {
            alert('Cupom inválido! Tente GEEK10');
        }
        render();
    });

    document.getElementById('btnFrete').addEventListener('click', () => {
        const cep = document.getElementById('cepInput').value.replace(/\D/g, '');
        if (cep.length === 8) {
            estado.freteValor = 15.00;
        } else {
            alert('CEP Inválido!');
        }
        render();
    });

    document.getElementById('btnFinalizar').addEventListener('click', () => {
        const usuario = getUsuarioLogado();
        const itensCarrinho = getCarrinho();

        if (itensCarrinho.length === 0) return;

        const dataAtual = new Date();
        const numeroPedido = 'PED-' + Math.floor(100000 + Math.random() * 900000);
        const codigoRastreio = 'BR' + Math.floor(100000000 + Math.random() * 900000000) + 'BR';

        const novoPedido = {
            id: numeroPedido,
            codigoRastreio: codigoRastreio,
            data: dataAtual.toLocaleDateString('pt-BR') + ' às ' + dataAtual.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            usuarioEmail: usuario ? usuario.email : 'Visitante',
            itens: itensCarrinho,
            subtotal: subtotal,
            desconto: valorDesconto,
            frete: estado.freteValor,
            total: totalFinal,
            statusEtapa: 2, // 1: Recebido, 2: Aprovado, 3: Separação, 4: Trânsito, 5: Entregue
            status: '✅ Pagamento Aprovado'
        };

        salvarPedido(novoPedido);

        alert(`Pedido ${novoPedido.id} realizado com sucesso!\nCódigo de Rastreio: ${codigoRastreio}`);
        salvarCarrinho([]);
        estado.descontoPercentual = 0;
        estado.freteValor = 0;

        if (usuario) {
            navegaPara('cadastro');
        } else {
            navegaPara('home');
        }
    });
}

// TELA DE CADASTRO / PERFIL EXPANDIDO
function renderCadastro(container) {
    const usuario = getUsuarioLogado();

    if (usuario) {
        const end = usuario.endereco || {};
        const dataCadastroStr = usuario.dataCadastro || new Date().toLocaleDateString('pt-BR');
        const pedidosDoUsuario = getPedidosUsuarioAtual();

        container.innerHTML = `
            <div class="cadastro-wrapper" style="max-width: 850px; margin: 30px auto; padding: 0 15px;">
                <div class="cadastro-box" style="text-align: left; background: #1e2038; padding: 30px; border-radius: 12px;">
                    
                    <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #3f4265; padding-bottom: 20px; margin-bottom: 25px;">
                        <div style="display: flex; align-items: center; gap: 15px;">
                            <div style="width: 60px; height: 60px; background: #6c5ce7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: bold; color: #fff;">
                                ${usuario.nome ? usuario.nome.charAt(0).toUpperCase() : '👤'}
                            </div>
                            <div>
                                <h1 style="margin: 0; font-size: 1.5rem; color: #fff;">${usuario.nome}</h1>
                                <p style="margin: 4px 0 0 0; color: #a0a3c4; font-size: 0.9rem;">${usuario.email}</p>
                            </div>
                        </div>
                        <span style="background: #141526; color: #00e676; padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; border: 1px solid #00e676;">
                            💎 Membro VIP
                        </span>
                    </div>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 25px;">
                        
                        <div style="background: #141526; padding: 20px; border-radius: 8px; border: 1px solid #2a2d4a;">
                            <h3 style="color: #6c5ce7; margin-top: 0; margin-bottom: 15px; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                                👤 Dados Pessoais
                            </h3>
                            <p style="margin: 8px 0; font-size: 0.9rem; color: #d1d5db;">
                                <strong style="color: #a0a3c4;">Telefone:</strong> ${usuario.telefone || 'Não informado'}
                            </p>
                            <p style="margin: 8px 0; font-size: 0.9rem; color: #d1d5db;">
                                <strong style="color: #a0a3c4;">CPF:</strong> ${usuario.cpf || 'Não informado'}
                            </p>
                            <p style="margin: 8px 0; font-size: 0.9rem; color: #d1d5db;">
                                <strong style="color: #a0a3c4;">Nascimento:</strong> ${usuario.dataNascimento ? new Date(usuario.dataNascimento).toLocaleDateString('pt-BR') : 'Não informado'}
                            </p>
                            <p style="margin: 8px 0; font-size: 0.9rem; color: #d1d5db;">
                                <strong style="color: #a0a3c4;">Cliente desde:</strong> ${dataCadastroStr}
                            </p>
                        </div>

                        <div style="background: #141526; padding: 20px; border-radius: 8px; border: 1px solid #2a2d4a;">
                            <h3 style="color: #6c5ce7; margin-top: 0; margin-bottom: 15px; font-size: 1.1rem; display: flex; align-items: center; gap: 8px;">
                                🏠 Endereço de Entrega
                            </h3>
                            ${end.rua ? `
                                <p style="margin: 8px 0; font-size: 0.9rem; color: #d1d5db;">
                                    ${end.rua}, Nº ${end.numero}${end.complemento ? `(${end.complemento})` : ''}
                                </p>
                                <p style="margin: 8px 0; font-size: 0.9rem; color: #d1d5db;">
                                    ${end.bairro} — ${end.cidade}/${end.uf}
                                </p>
                                <p style="margin: 8px 0; font-size: 0.9rem; color: #d1d5db;">
                                    <strong style="color: #a0a3c4;">CEP:</strong> ${end.cep}
                                </p>
                            ` : '<p style="font-size: 0.9rem; color: #a0a3c4;">Nenhum endereço cadastrado ainda.</p>'}
                        </div>

                    </div>

                    <!-- BUSCA DIRETA DE RASTREAMENTO -->
                    <div style="background: #141526; padding: 20px; border-radius: 8px; border: 1px solid #2a2d4a; margin-bottom: 25px;">
                        <h3 style="color: #6c5ce7; margin-top: 0; margin-bottom: 10px; font-size: 1.1rem;">
                            🔎 Consultar Rastreamento Rápido
                        </h3>
                        <div style="display: flex; gap: 10px;">
                            <input type="text" id="inputBuscarRastreio" placeholder="Digite o Código do Pedido ou Rastreio (ex: PED-123456 ou BR123456789BR)" style="flex: 1; padding: 10px; border-radius: 6px; border: 1px solid #3f4265; background: #1e2038; color: #fff; font-size: 0.9rem; outline: none;">
                            <button id="btnBuscarRastreio" style="background: #6c5ce7; color: #fff; border: none; padding: 10px 18px; border-radius: 6px; cursor: pointer; font-weight: bold;">Buscar</button>
                        </div>
                        <div id="resultadoRastreioBusca" style="margin-top: 15px;"></div>
                    </div>

                    <div style="background: #141526; padding: 20px; border-radius: 8px; border: 1px solid #2a2d4a; margin-bottom: 25px;">
                        <h3 style="color: #6c5ce7; margin-top: 0; margin-bottom: 15px; font-size: 1.1rem; display: flex; align-items: center; justify-content: space-between;">
                            <span>📦 Histórico e Rastreamento de Pedidos</span>
                            <span style="font-size: 0.85rem; color: #a0a3c4; font-weight: normal;">${pedidosDoUsuario.length} pedido(s)</span>
                        </h3>

                        ${pedidosDoUsuario.length === 0 ? `
                            <p style="font-size: 0.9rem; color: #a0a3c4; margin: 0;">Você ainda não realizou nenhum pedido na loja.</p>
                        ` : `
                            <div style="display: flex; flex-direction: column; gap: 15px;">
                                ${pedidosDoUsuario.map(ped => `
                                    <div style="background: #1e2038; border: 1px solid #3f4265; border-radius: 8px; padding: 15px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #2a2d4a; padding-bottom: 10px; margin-bottom: 10px; flex-wrap: wrap; gap: 8px;">
                                            <div>
                                                <strong style="color: #fff; font-size: 1rem;">Código: ${ped.id}</strong>
                                                <div style="font-size: 0.8rem; color: #a0a3c4; margin-top: 2px;">📅 ${ped.data}</div>
                                            </div>
                                            <span style="background: #1a382b; color: #00e676; padding: 4px 10px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; border: 1px solid #00e676;">
                                                ${ped.status}
                                            </span>
                                        </div>

                                        <div style="margin-bottom: 10px;">
                                            ${ped.itens.map(item => `
                                                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; color: #d1d5db; margin-bottom: 6px;">
                                                    <div style="display: flex; align-items: center; gap: 8px;">
                                                        <img src="${item.imagem}" alt="${item.nome}" style="width: 32px; height: 32px; object-fit: contain; background: #141526; border-radius: 4px; padding: 2px;">
                                                        <span><strong>${item.qtd}x</strong>${item.nome}</span>
                                                    </div>
                                                    <span>R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}</span>
                                                </div>
                                            `).join('')}
                                        </div>

                                        <div style="border-top: 1px dashed #3f4265; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;">
                                            <span style="color: #a0a3c4;">Total do Pedido:</span>
                                            <strong style="color: #00e676; font-size: 1.05rem;">R$ ${ped.total.toFixed(2).replace('.', ',')}</strong>
                                        </div>

                                        ${renderLinhaTempoRastreamentoHTML(ped)}
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>

                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <button id="btnIrConfigEditar" style="flex: 1; background: #6c5ce7; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.95rem;">
                            ✏️ Editar Informações
                        </button>
                        <button id="btnSair" style="flex: 1; background: #ff5252; color: white; border: none; padding: 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.95rem;">
                            🚪 Sair da Conta
                        </button>
                    </div>

                </div>
            </div>
        `;

        document.getElementById('btnSair').addEventListener('click', fazerLogout);
        document.getElementById('btnIrConfigEditar').addEventListener('click', () => navegaPara('configuracoes'));

        const btnBuscarRastreio = document.getElementById('btnBuscarRastreio');
        if (btnBuscarRastreio) {
            btnBuscarRastreio.addEventListener('click', () => {
                const query = document.getElementById('inputBuscarRastreio').value.trim().toUpperCase();
                const containerResultado = document.getElementById('resultadoRastreioBusca');
                const todosPedidos = getPedidos();

                const encontrado = todosPedidos.find(p => p.id.toUpperCase() === query || (p.codigoRastreio && p.codigoRastreio.toUpperCase() === query));

                if (encontrado) {
                    containerResultado.innerHTML = `
                        <div style="background: #1e2038; padding: 12px; border-radius: 6px; border: 1px solid #6c5ce7;">
                            <p style="margin: 0 0 8px 0; font-size: 0.85rem; color: #fff;"><strong>Pedido Encontrado:</strong> #${encontrado.id}</p>
                            ${renderLinhaTempoRastreamentoHTML(encontrado)}
                        </div>
                    `;
                } else {
                    containerResultado.innerHTML = `<p style="color: #ff5252; font-size: 0.85rem; margin: 5px 0 0 0;">Nenhum pedido encontrado com este código.</p>`;
                }
            });
        }
        return;
    }

    container.innerHTML = `
        <div class="cadastro-wrapper" style="max-width: 650px; margin: 30px auto; padding: 0 15px;">
            <div class="cadastro-box" style="background: #1e2038; padding: 30px; border-radius: 12px;">
                <h1 style="text-align: center; margin-bottom: 5px;">Crie sua Conta</h1>
                <p style="text-align: center; color: #a0a3c4; margin-bottom: 25px;">Junte-se à comunidade Collector's Hub</p>

                <form id="cadastroForm">
                    <h3 style="color: #6c5ce7; font-size: 1rem; border-bottom: 1px solid #3f4265; padding-bottom: 6px; margin-bottom: 15px;">1. Dados Acesso & Pessoais</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 15px;">
                        <div class="campo">
                            <label for="nome">Nome Completo *</label>
                            <input type="text" id="nome" placeholder="Digite seu nome completo" required>
                        </div>

                        <div class="campo">
                            <label for="email">E-mail *</label>
                            <input type="email" id="email" placeholder="seuemail@exemplo.com" required>
                        </div>

                        <div class="campo">
                            <label for="telefone">Telefone / WhatsApp</label>
                            <input type="tel" id="telefone" placeholder="(00) 90000-0000">
                        </div>

                        <div class="campo">
                            <label for="cpf">CPF</label>
                            <input type="text" id="cpf" placeholder="000.000.000-00" maxlength="14">
                        </div>

                        <div class="campo">
                            <label for="dataNascimento">Data de Nascimento</label>
                            <input type="date" id="dataNascimento" style="background: #141526; border: 1px solid #3f4265; color: #fff; padding: 10px; border-radius: 6px; width: 100%; box-sizing: border-box;">
                        </div>
                    </div>

                    <h3 style="color: #6c5ce7; font-size: 1rem; border-bottom: 1px solid #3f4265; padding-bottom: 6px; margin: 20px 0 15px 0;">2. Endereço de Entrega</h3>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 15px;">
                        <div class="campo">
                            <label for="cep">CEP</label>
                            <input type="text" id="cep" placeholder="00000-000" maxlength="9">
                        </div>

                        <div class="campo">
                            <label for="rua">Rua / Avenida</label>
                            <input type="text" id="rua" placeholder="Nome da rua">
                        </div>

                        <div class="campo">
                            <label for="numero">Número</label>
                            <input type="text" id="numero" placeholder="Ex: 123">
                        </div>

                        <div class="campo">
                            <label for="complemento">Complemento</label>
                            <input type="text" id="complemento" placeholder="Apt, Bloco, etc.">
                        </div>

                        <div class="campo">
                            <label for="bairro">Bairro</label>
                            <input type="text" id="bairro" placeholder="Nome do bairro">
                        </div>

                        <div class="campo" style="display: flex; gap: 10px;">
                            <div style="flex: 2;">
                                <label for="cidade">Cidade</label>
                                <input type="text" id="cidade" placeholder="Cidade">
                            </div>
                            <div style="flex: 1;">
                                <label for="uf">UF</label>
                                <input type="text" id="uf" placeholder="SP" maxlength="2" style="text-transform: uppercase;">
                            </div>
                        </div>
                    </div>

                    <h3 style="color: #6c5ce7; font-size: 1rem; border-bottom: 1px solid #3f4265; padding-bottom: 6px; margin: 20px 0 15px 0;">3. Senha de Acesso</h3>

                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 15px;">
                        <div class="campo">
                            <label for="senha">Senha *</label>
                            <input type="password" id="senha" placeholder="••••••••" required minlength="6">
                        </div>

                        <div class="campo">
                            <label for="confirmarSenha">Confirmar Senha *</label>
                            <input type="password" id="confirmarSenha" placeholder="••••••••" required>
                        </div>
                    </div>

                    <button type="submit" style="margin-top: 25px; width: 100%; padding: 14px; background: #6c5ce7; color: white; border: none; border-radius: 6px; font-weight: bold; font-size: 1rem; cursor: pointer;">
                        ✅ Concluir Cadastro
                    </button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('cadastroForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const cpf = document.getElementById('cpf').value.trim();
        const dataNascimento = document.getElementById('dataNascimento').value;

        const cep = document.getElementById('cep').value.trim();
        const rua = document.getElementById('rua').value.trim();
        const numero = document.getElementById('numero').value.trim();
        const complemento = document.getElementById('complemento').value.trim();
        const bairro = document.getElementById('bairro').value.trim();
        const cidade = document.getElementById('cidade').value.trim();
        const uf = document.getElementById('uf').value.trim().toUpperCase();

        const s1 = document.getElementById('senha').value;
        const s2 = document.getElementById('confirmarSenha').value;

        if (s1 !== s2) {
            alert('As senhas não coincidem!');
            return;
        }

        const novoUsuario = {
            nome,
            email,
            telefone,
            cpf,
            dataNascimento,
            dataCadastro: new Date().toLocaleDateString('pt-BR'),
            endereco: {
                cep,
                rua,
                numero,
                complemento,
                bairro,
                cidade,
                uf
            }
        };

        salvarUsuario(novoUsuario);
        alert(`Bem-vindo(a), ${nome}! Seu cadastro foi salvo com sucesso.`);
        navegaPara('home');
    });
}

// TELA DE CONFIGURAÇÕES
function renderConfiguracoes(container) {
    const usuario = getUsuarioLogado();
    const config = getConfiguracoes();
    const end = (usuario && usuario.endereco) ? usuario.endereco : {};

    container.innerHTML = `
        <div class="config-wrapper" style="max-width: 750px; margin: 30px auto; padding: 0 15px;">
            <div class="config-box" style="background: #1e2038; padding: 30px; border-radius: 12px;">
                <h1 style="margin-bottom: 20px; display: flex; align-items: center;">
                    ${getIconeConfigHTML('circulo')} Configurações & Perfil
                </h1>
                
                <div class="config-secao" style="margin-bottom: 30px;">
                    <h2 style="color: #6c5ce7; font-size: 1.1rem; border-bottom: 1px solid #3f4265; padding-bottom: 8px;">Preferências do Site</h2>
                    
                    <div class="campo-config" style="margin-top: 15px;">
                        <label>Tema de Visualização</label>
                        <select id="selectTema" style="background: #141526; color: #fff; border: 1px solid #3f4265; padding: 8px; border-radius: 6px; width: 100%;">
                            <option value="dark" ${config.tema === 'dark' ? 'selected' : ''}>🌙 Modo Escuro (Padrão)</option>
                            <option value="light" ${config.tema === 'light' ? 'selected' : ''}>☀️ Modo Claro</option>
                        </select>
                    </div>

                    <div class="campo-config switch-campo" style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                        <span>Receber Notificações de Promoções</span>
                        <label class="switch">
                            <input type="checkbox" id="checkNotificacoes" ${config.notificacoes ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="config-secao">
                    <h2 style="color: #6c5ce7; font-size: 1.1rem; border-bottom: 1px solid #3f4265; padding-bottom: 8px;">Atualizar Dados Cadastrais</h2>
                    ${usuario ? `
                        <form id="formAtualizarConta" style="margin-top: 15px;">
                            
                            <h4 style="color: #a0a3c4; margin-bottom: 10px;">Informações Pessoais</h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 15px;">
                                <div class="campo">
                                    <label>Nome Completo</label>
                                    <input type="text" id="configNome" value="${usuario.nome || ''}" required>
                                </div>
                                <div class="campo">
                                    <label>E-mail</label>
                                    <input type="email" id="configEmail" value="${usuario.email || ''}" required>
                                </div>
                                <div class="campo">
                                    <label>Telefone</label>
                                    <input type="tel" id="configTelefone" value="${usuario.telefone || ''}">
                                </div>
                                <div class="campo">
                                    <label>CPF</label>
                                    <input type="text" id="configCpf" value="${usuario.cpf || ''}">
                                </div>
                                <div class="campo">
                                    <label>Data de Nascimento</label>
                                    <input type="date" id="configDataNascimento" value="${usuario.dataNascimento || ''}" style="background: #141526; border: 1px solid #3f4265; color: #fff; padding: 10px; border-radius: 6px; width: 100%; box-sizing: border-box;">
                                </div>
                            </div>

                            <h4 style="color: #a0a3c4; margin: 20px 0 10px 0;">Endereço de Entrega</h4>
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; margin-bottom: 20px;">
                                <div class="campo">
                                    <label>CEP</label>
                                    <input type="text" id="configCep" value="${end.cep || ''}">
                                </div>
                                <div class="campo">
                                    <label>Rua / Avenida</label>
                                    <input type="text" id="configRua" value="${end.rua || ''}">
                                </div>
                                <div class="campo">
                                    <label>Número</label>
                                    <input type="text" id="configNumero" value="${end.numero || ''}">
                                </div>
                                <div class="campo">
                                    <label>Complemento</label>
                                    <input type="text" id="configComplemento" value="${end.complemento || ''}">
                                </div>
                                <div class="campo">
                                    <label>Bairro</label>
                                    <input type="text" id="configBairro" value="${end.bairro || ''}">
                                </div>
                                <div class="campo" style="display: flex; gap: 10px;">
                                    <div style="flex: 2;">
                                        <label>Cidade</label>
                                        <input type="text" id="configCidade" value="${end.cidade || ''}">
                                    </div>
                                    <div style="flex: 1;">
                                        <label>UF</label>
                                        <input type="text" id="configUf" value="${end.uf || ''}" maxlength="2" style="text-transform: uppercase;">
                                    </div>
                                </div>
                            </div>

                            <button type="submit" class="btn-salvar" style="width: 100%; padding: 12px; background: #6c5ce7; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
                                💾 Salvar Alterações do Perfil
                            </button>
                        </form>
                    ` : `
                        <p style="color: #a0a3c4; margin: 15px 0;">Você não está conectado a nenhuma conta.</p>
                        <button class="btn" id="btnIrLoginConfig" style="background: #6c5ce7; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                            Fazer Login / Cadastrar
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;

    document.getElementById('selectTema').addEventListener('change', (e) => {
        config.tema = e.target.value;
        salvarConfiguracoes(config);
    });

    document.getElementById('checkNotificacoes').addEventListener('change', (e) => {
        config.notificacoes = e.target.checked;
        salvarConfiguracoes(config);
    });

    const formConta = document.getElementById('formAtualizarConta');
    if (formConta) {
        formConta.addEventListener('submit', (e) => {
            e.preventDefault();

            const usuarioAtualizado = {
                ...usuario,
                nome: document.getElementById('configNome').value.trim(),
                email: document.getElementById('configEmail').value.trim(),
                telefone: document.getElementById('configTelefone').value.trim(),
                cpf: document.getElementById('configCpf').value.trim(),
                dataNascimento: document.getElementById('configDataNascimento').value,
                endereco: {
                    cep: document.getElementById('configCep').value.trim(),
                    rua: document.getElementById('configRua').value.trim(),
                    numero: document.getElementById('configNumero').value.trim(),
                    complemento: document.getElementById('configComplemento').value.trim(),
                    bairro: document.getElementById('configBairro').value.trim(),
                    cidade: document.getElementById('configCidade').value.trim(),
                    uf: document.getElementById('configUf').value.trim().toUpperCase()
                }
            };

            salvarUsuario(usuarioAtualizado);
            alert('Dados da conta atualizados com sucesso!');
            render();
        });
    }

    const btnLogin = document.getElementById('btnIrLoginConfig');
    if (btnLogin) {
        btnLogin.addEventListener('click', () => navegaPara('cadastro'));
    }
}

// ==========================================
// 10. INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    aplicarTema(getConfiguracoes().tema);
    atualizarUIHeader();

    const btnLogo = document.getElementById('logoLink');
    const btnCarrinho = document.getElementById('btnIrCarrinho');
    const btnCadastro = document.getElementById('btnIrCadastro');
    const btnConfig = document.getElementById('btnIrConfig');

    if (btnLogo) btnLogo.addEventListener('click', (e) => { 
        e.preventDefault(); 
        estado.termoBusca = ''; 
        estado.produtoModalId = null;
        navegaPara('home'); 
    });
    if (btnCarrinho) btnCarrinho.addEventListener('click', () => navegaPara('carrinho'));
    if (btnCadastro) btnCadastro.addEventListener('click', () => navegaPara('cadastro'));
    if (btnConfig) btnConfig.addEventListener('click', () => navegaPara('configuracoes'));

    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const sidebar = document.getElementById('sidebar');
    const menuOverlay = document.getElementById('menuOverlay');

    const fecharMenu = () => {
        if (sidebar) sidebar.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
    };

    if (menuToggle) menuToggle.addEventListener('click', () => {
        if (sidebar) sidebar.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
    });

    if (menuClose) menuClose.addEventListener('click', fecharMenu);
    if (menuOverlay) menuOverlay.addEventListener('click', fecharMenu);

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            estado.categoriaFiltro = link.getAttribute('data-categoria');
            estado.termoBusca = '';
            estado.produtoModalId = null;
            fecharMenu();
            navegaPara('home');
        });
    });

    carregarProdutos();
});