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
    const usuario = getUsuarioLogado();

    if (usuario && btnCadastro) {
        const primeiroNome = usuario.nome.split(' ')[0];
        btnCadastro.innerHTML = `👤 ${primeiroNome}`;
        btnCadastro.title = `Conectado como ${usuario.nome}`;
    } else if (btnCadastro) {
        btnCadastro.innerHTML = `👤`;
        btnCadastro.title = "Cadastro / Login";
    }
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
// 6. MODAL DE DETALHES DO PRODUTO (INFO COMPLETA)
// ==========================================
function renderModalDetalhesHTML() {
    if (!estado.produtoModalId) return '';

    const p = produtos.find(item => item.id === estado.produtoModalId);
    if (!p) return '';

    const { media, total } = getResumoAvaliacoes(p.id);
    const semEstoque = p.estoque <= 0;
    const nomeCategoria = nomesCategorias[p.categoria] || p.categoria;

    // Descrição padrão dinâmica caso não esteja definida no JSON
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

                        <button class="btn-comprar" data-id="${p.id}" ${semEstoque ? 'disabled' : ''} style="width: 100%; padding: 12px; font-size: 1rem; cursor: pointer;">
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

    // Gerenciamento de Exibição do Modal
    const modalHTML = renderModalDetalhesHTML();
    if (modalHTML) {
        main.insertAdjacentHTML('beforeend', modalHTML);
        
        const btnFechar = document.getElementById('btnFecharModal');
        const overlay = document.getElementById('modalDetalhesOverlay');

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
    
    // 1. Filtragem por categoria
    let listaFiltrada = produtos;
    if (estado.categoriaFiltro === 'favoritos') {
        listaFiltrada = produtos.filter(p => favoritos.includes(p.id));
    } else if (estado.categoriaFiltro !== 'todos') {
        listaFiltrada = produtos.filter(p => p.categoria === estado.categoriaFiltro);
    }

    // 2. Filtragem por busca textual
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
        ${(estado.categoriaFiltro !== 'todos' || estado.termoBusca) ? `<h2 class="secao-titulo">${tituloSecao}${estado.termoBusca ? `(Resultados para "${estado.termoBusca}")` : ''}</h2>` : ''}
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

    // Eventos do Modal
    container.querySelectorAll('.btn-detalhes').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            estado.produtoModalId = id;
            render();
        });
    });

    // Evento de Busca
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

    // Eventos de Favoritar
    container.querySelectorAll('.btn-favorito').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            toggleFavorito(id);
        });
    });

    // Eventos de Compra
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

    // Eventos de Avaliação
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
                            <input type="text" id="cepInput" placeholder="00000-000" maxlength="9">
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
        alert('Pedido realizado com sucesso!');
        salvarCarrinho([]);
        navegaPara('home');
    });
}

// TELA DE CADASTRO / PERFIL
function renderCadastro(container) {
    const usuario = getUsuarioLogado();

    if (usuario) {
        container.innerHTML = `
            <div class="cadastro-wrapper">
                <div class="cadastro-box" style="text-align: center;">
                    <h1>Minha Conta</h1>
                    <p style="margin: 20px 0; color: var(--text-secondary);">
                        Olá, <strong style="color: white; font-size: 1.1rem;">${usuario.nome}</strong>!<br>
                        <span>${usuario.email}</span>
                    </p>
                    <button id="btnSair" style="background: #ff5252;">Sair da Conta</button>
                </div>
            </div>
        `;

        document.getElementById('btnSair').addEventListener('click', fazerLogout);
        return;
    }

    container.innerHTML = `
        <div class="cadastro-wrapper">
            <div class="cadastro-box">
                <h1>Crie sua Conta</h1>
                <h2>Junte-se ao Collector's Hub</h2>

                <form id="cadastroForm">
                    <div class="campo">
                        <label for="nome">Nome Completo</label>
                        <input type="text" id="nome" placeholder="Digite seu nome" required>
                    </div>

                    <div class="campo">
                        <label for="email">E-mail</label>
                        <input type="email" id="email" placeholder="seuemail@exemplo.com" required>
                    </div>

                    <div class="campo">
                        <label for="senha">Senha</label>
                        <input type="password" id="senha" placeholder="••••••••" required minlength="6">
                    </div>

                    <div class="campo">
                        <label for="confirmarSenha">Confirmar Senha</label>
                        <input type="password" id="confirmarSenha" placeholder="••••••••" required>
                    </div>

                    <button type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById('cadastroForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const email = document.getElementById('email').value.trim();
        const s1 = document.getElementById('senha').value;
        const s2 = document.getElementById('confirmarSenha').value;

        if (s1 !== s2) {
            alert('As senhas não coincidem!');
            return;
        }

        salvarUsuario({ nome, email });
        alert(`Bem-vindo(a), ${nome}! Seu cadastro foi salvo com sucesso.`);
        navegaPara('home');
    });
}

// TELA DE CONFIGURAÇÕES
function renderConfiguracoes(container) {
    const usuario = getUsuarioLogado();
    const config = getConfiguracoes();

    container.innerHTML = `
        <div class="config-wrapper">
            <div class="config-box">
                <h1>⚙️ Configurações</h1>
                
                <div class="config-secao">
                    <h2>Preferências do Site</h2>
                    
                    <div class="campo-config">
                        <label>Tema de Visualização</label>
                        <select id="selectTema">
                            <option value="dark" ${config.tema === 'dark' ? 'selected' : ''}>🌙 Modo Escuro (Padrão)</option>
                            <option value="light" ${config.tema === 'light' ? 'selected' : ''}>☀️ Modo Claro</option>
                        </select>
                    </div>

                    <div class="campo-config switch-campo">
                        <span>Receber Notificações de Promoções</span>
                        <label class="switch">
                            <input type="checkbox" id="checkNotificacoes" ${config.notificacoes ? 'checked' : ''}>
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>

                <div class="config-secao">
                    <h2>Dados da Conta</h2>
                    ${usuario ? `
                        <form id="formAtualizarConta">
                            <div class="campo">
                                <label for="configNome">Nome Completo</label>
                                <input type="text" id="configNome" value="${usuario.nome}" required>
                            </div>
                            <div class="campo">
                                <label for="configEmail">E-mail</label>
                                <input type="email" id="configEmail" value="${usuario.email}" required>
                            </div>
                            <button type="submit" class="btn-salvar">Salvar Alterações do Perfil</button>
                        </form>
                    ` : `
                        <p style="color: var(--text-secondary); margin-bottom: 15px;">Você não está conectado a nenhuma conta.</p>
                        <button class="btn" id="btnIrLoginConfig">Fazer Login / Cadastrar</button>
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
            const novoNome = document.getElementById('configNome').value.trim();
            const novoEmail = document.getElementById('configEmail').value.trim();

            salvarUsuario({ nome: novoNome, email: novoEmail });
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