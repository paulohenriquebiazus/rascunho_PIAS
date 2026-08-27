// ==========================================
// 1. ESTADO GLOBAL E VARIÁVEIS
// ==========================================
let produtos = []; // Será preenchido via produtos.json

let estado = {
    telaAtual: 'home',
    categoriaFiltro: 'todos',
    descontoPercentual: 0,
    freteValor: 0
};

// ==========================================
// LOGOS E NOMES POR CATEGORIA
// (Ajuste os caminhos abaixo conforme os nomes reais dos seus arquivos na pasta 'imagens/')
// ==========================================
const logosCategorias = {
    'todos': 'imagens/Logo.png',
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
    'todos': 'Todos os Produtos',
    'canecas': 'Canecas',
    'ac': 'Action Figures',
    'quadros': 'Quadros',
    'mangas': 'Mangás',
    'ln': 'Light Novels',
    'hq': 'Quadrinhos',
    'games': 'Games',
    'colecionaveis': 'Colecionáveis',
    'roupas': 'Roupas'
};

// Atualiza a logo no Header de acordo com a categoria selecionada
function atualizarLogoHeader() {
    const logoImg = document.querySelector('#logoLink img');
    if (logoImg) {
        const catAtiva = estado.telaAtual === 'home' ? estado.categoriaFiltro : 'todos';
        const caminhoLogo = logosCategorias[catAtiva] || logosCategorias['todos'];
        
        logoImg.src = caminhoLogo;
        logoImg.alt = `Logo ${nomesCategorias[catAtiva] || "Collector's Hub"}`;
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

        // Carrega a lista de produtos vinda do JSON
        produtos = await resposta.json();

        // Renderiza a tela assim que os dados chegarem
        render();

    } catch (erro) {
        console.error('Erro ao carregar produtos.json:', erro);
        const main = document.getElementById('app');
        if (main) {
            main.innerHTML = `
                <div style="text-align: center; padding: 50px; color: #ff5252;">
                    <h2>⚠️ Não foi possível carregar os produtos</h2>
                    <p>Verifique se o arquivo <strong>produtos.json</strong> está na mesma pasta do projeto e se você está executando em um servidor local (ex: Live Server).</p>
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
// 5. CONFIGURAÇÕES E TEMA (LOCALSTORAGE)
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
// 6. ROTEADOR E NAVEGAÇÃO
// ==========================================
function navegaPara(tela) {
    estado.telaAtual = tela;
    render();
}

function render() {
    const main = document.getElementById('app');
    if (!main) return;

    atualizarBadge();
    atualizarLogoHeader(); // Atualiza a logo conforme a categoria selecionada

    if (estado.telaAtual === 'home') {
        renderHome(main);
    } else if (estado.telaAtual === 'carrinho') {
        renderCarrinho(main);
    } else if (estado.telaAtual === 'cadastro') {
        renderCadastro(main);
    } else if (estado.telaAtual === 'configuracoes') {
        renderConfiguracoes(main);
    }
}

// ==========================================
// 7. RENDERS DE TELAS
// ==========================================

// Helper para preços
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
    const produtosDestaque = produtos.filter(p => p.destaque);
    const listaFiltrada = estado.categoriaFiltro === 'todos' 
        ? produtos 
        : produtos.filter(p => p.categoria === estado.categoriaFiltro);

    const htmlDestaques = estado.categoriaFiltro === 'todos' ? `
        <section class="destaques-section">
            <h2 class="secao-titulo">🔥 Destaques da Semana</h2>
            <div class="destaques-grid">
                ${produtosDestaque.map(p => {
                    const semEstoque = p.estoque <= 0;
                    return `
                        <div class="card-destaque ${semEstoque ? 'card-esgotado' : ''}">
                            <span class="badge-destaque">EM ALTA</span>
                            <img src="${p.imagem}" alt="${p.nome}">
                            <div class="destaque-info">
                                <h3>${p.nome}</h3>
                                ${renderPrecoHTML(p)}
                                <button class="btn-comprar" data-id="${p.id}" ${semEstoque ? 'disabled' : ''}>
                                    ${semEstoque ? 'Esgotado' : '⚡ Comprar Agora'}
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </section>
        <h2 class="secao-titulo">🛒 Todos os Produtos</h2>
    ` : `
        <!-- Banner exibido ao filtrar uma categoria -->
        <div class="categoria-header-banner">
            <img src="${logosCategorias[estado.categoriaFiltro] || logosCategorias['todos']}" 
                 alt="${nomesCategorias[estado.categoriaFiltro]}" 
                 class="img-categoria-banner">
            <h2>${nomesCategorias[estado.categoriaFiltro]}</h2>
        </div>
    `;

    container.innerHTML = `
        ${htmlDestaques}
        <div class="cards">
            ${listaFiltrada.map(p => {
                const semEstoque = p.estoque <= 0;
                return `
                    <div class="card ${semEstoque ? 'card-esgotado' : ''}">
                        <img src="${p.imagem}" class="imagem_produto" alt="${p.nome}">
                        <h3>${p.nome}</h3>
                        ${renderPrecoHTML(p)}
                        <small style="margin: 0 15px 10px; color: #a0a3c4;">
                            ${semEstoque ? 'Sem estoque disponível' : `Estoque: ${p.estoque} un.`}
                        </small>
                        <button class="btn-comprar" data-id="${p.id}" ${semEstoque ? 'disabled' : ''}>
                            ${semEstoque ? 'Esgotado' : 'Comprar'}
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    // Eventos de compra
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
            render();
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

    // Botões do Carrinho
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
// 8. INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Aplica o tema e atualiza a UI com dados salvos
    aplicarTema(getConfiguracoes().tema);
    atualizarUIHeader();

    // 2. Eventos nos botões do topo/header
    const btnLogo = document.getElementById('logoLink');
    const btnCarrinho = document.getElementById('btnIrCarrinho');
    const btnCadastro = document.getElementById('btnIrCadastro');
    const btnConfig = document.getElementById('btnIrConfig');

    if (btnLogo) btnLogo.addEventListener('click', (e) => { 
        e.preventDefault(); 
        estado.categoriaFiltro = 'todos'; // Reseta o filtro para ver todas as categorias e a logo inicial
        navegaPara('home'); 
    });
    if (btnCarrinho) btnCarrinho.addEventListener('click', () => navegaPara('carrinho'));
    if (btnCadastro) btnCadastro.addEventListener('click', () => navegaPara('cadastro'));
    if (btnConfig) btnConfig.addEventListener('click', () => navegaPara('configuracoes'));

    // 3. Controle da Sidebar / Menu Hambúrguer
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

    // 4. Filtros de Categorias
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            estado.categoriaFiltro = link.getAttribute('data-categoria');
            fecharMenu();
            navegaPara('home');
        });
    });

    // 5. Busca produtos no produtos.json e inicia o render
    carregarProdutos();
});