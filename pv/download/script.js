document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const heroDownloadBtn = document.getElementById('heroDownloadBtn');
    const downloadAppBannerBtn = document.getElementById('downloadAppBannerBtn');
    const categoriesDownloadBtn = document.getElementById('categoriesDownloadBtn');
    const finalDownloadBtn = document.getElementById('finalDownloadBtn');
    const systemSelectModal = document.getElementById('systemSelectModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const ageVerificationModal = document.getElementById('ageVerificationModal');
    const confirmAgeBtn = document.getElementById('confirmAgeBtn');
    const declineAgeBtn = document.getElementById('declineAgeBtn');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Verificar se o usuário já confirmou a idade
    const ageVerified = localStorage.getItem('ageVerified');
    
    // Mostrar modal de verificação de idade se ainda não foi verificado
    if (!ageVerified && ageVerificationModal) {
        ageVerificationModal.style.display = 'flex';
    }
    
    // Confirmar idade
    if (confirmAgeBtn) {
        confirmAgeBtn.addEventListener('click', function() {
            localStorage.setItem('ageVerified', 'true');
            ageVerificationModal.style.display = 'none';
        });
    }
    
    // Recusar verificação de idade
    if (declineAgeBtn) {
        declineAgeBtn.addEventListener('click', function() {
            window.location.href = 'https://www.google.com';
        });
    }
    
    // Abrir modal de seleção de sistema
    function openSystemSelectModal() {
        if (systemSelectModal) {
            // Verificar idade primeiro
            if (!ageVerified && ageVerificationModal) {
                ageVerificationModal.style.display = 'flex';
                
                // Adicionar evento para abrir o modal de sistema após verificação
                if (confirmAgeBtn) {
                    const originalClickHandler = confirmAgeBtn.onclick;
                    confirmAgeBtn.onclick = function() {
                        if (originalClickHandler) {
                            originalClickHandler();
                        }
                        systemSelectModal.style.display = 'flex';
                    };
                }
            } else {
                systemSelectModal.style.display = 'flex';
            }
        }
    }
    
    // Fechar modal de seleção de sistema
    function closeSystemSelectModal() {
        if (systemSelectModal) {
            systemSelectModal.style.display = 'none';
        }
    }
    
    // Função para mostrar mensagem para iPhone
    function showIPhoneMessage() {
        // Criar o modal de mensagem
        const messageModal = document.createElement("div");
        messageModal.className = "modal";
        messageModal.style.display = "flex";

        // Conteúdo do modal
        messageModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Aviso - iPhone</h2>
                    <button class="close-btn" id="closeIPhoneMessageBtn">&times;</button>
                </div>
                <div class="modal-body" style="text-align: center; padding: 30px;">
                    <div style="font-size: 60px; color: var(--primary-color); margin-bottom: 20px;">
                        <i class="fab fa-apple"></i>
                    </div>
                    <p style="font-size: 18px; margin-bottom: 15px;">No momento, o aplicativo OnlyFlix não está disponível para dispositivos iPhone.</p>
                    <p style="opacity: 0.8; margin-bottom: 15px;">Devido às políticas da App Store, estamos trabalhando em uma solução alternativa para usuários iOS.</p>
                    <p style="color: var(--primary-color); font-weight: bold;">Agradecemos sua compreensão e interesse!</p>
                </div>
            </div>
        `;

        // Adicionar o modal ao corpo do documento
        document.body.appendChild(messageModal);

        // Fechar o modal de seleção de sistema
        if (systemSelectModal) {
            systemSelectModal.style.display = 'none';
        }

        // Configurar o botão de fechar
        const closeIPhoneMessageBtn = document.getElementById("closeIPhoneMessageBtn");
        if (closeIPhoneMessageBtn) {
            closeIPhoneMessageBtn.addEventListener("click", () => {
                messageModal.remove();
            });
        }

        // Fechar ao clicar fora do modal
        messageModal.addEventListener("click", (e) => {
            if (e.target === messageModal) {
                messageModal.remove();
            }
        });
    }
    
    // Adicionar eventos aos botões de download
    if (loginBtn) loginBtn.addEventListener('click', openSystemSelectModal);
    if (registerBtn) registerBtn.addEventListener('click', openSystemSelectModal);
    if (heroDownloadBtn) heroDownloadBtn.addEventListener('click', openSystemSelectModal);
    if (downloadAppBannerBtn) downloadAppBannerBtn.addEventListener('click', openSystemSelectModal);
    if (categoriesDownloadBtn) categoriesDownloadBtn.addEventListener('click', openSystemSelectModal);
    if (finalDownloadBtn) finalDownloadBtn.addEventListener('click', openSystemSelectModal);
    
    // Botão para fechar o modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeSystemSelectModal);
    }
    
    // Fechar modal ao clicar fora
    if (systemSelectModal) {
        systemSelectModal.addEventListener('click', function(e) {
            if (e.target === systemSelectModal) {
                closeSystemSelectModal();
            }
        });
    }
    
    // Selecionar sistema e redirecionar
    const systemBtns = document.querySelectorAll('.system-btn');
    systemBtns.forEach((btn) => {
        btn.addEventListener('click', function() {
            const system = this.getAttribute('data-system');
            
            // Verificar se é iPhone
            if (system === 'iphone') {
                showIPhoneMessage();
                return;
            }
            
            // Armazenar o sistema selecionado no localStorage
            localStorage.setItem('currentSystem', system);
            
            // Redirecionar para a página de tutorial específica do sistema
            window.location.href = `tutorial-${system}.html`;
        });
    });
    
    // Adicionar eventos para os cards de categoria
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', openSystemSelectModal);
    });
    
    // Toggle para os itens de FAQ
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Fechar todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle do item atual
            item.classList.toggle('active');
        });
    });
});