document.addEventListener('DOMContentLoaded', function() {
    // Função para criar a grade de perfis
    function createProfilesGrid() {
        const profilesGrid = document.getElementById('profiles-grid');
        const rows = 3;
        const cols = 3;
        
        // Limpar o grid
        profilesGrid.innerHTML = '';
        
        // Criar os elementos de perfil
        for (let i = 0; i < rows * cols; i++) {
            const profileItem = document.createElement('div');
            profileItem.className = 'profile-item';
            
            // Aqui você pode substituir pelo caminho real das suas imagens
            // Por enquanto, usamos um placeholder
            const img = document.createElement('img');
            img.src = `images/profile-${i+1}.jpg`;
            img.alt = 'Perfil';
            
            // Tratamento de erro para imagens que não existem
            img.onerror = function() {
                // Criar um placeholder colorido
                this.style.backgroundColor = '#333';
                this.style.display = 'block';
                this.alt = 'Imagem de perfil';
                this.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // Imagem transparente
            };
            
            profileItem.appendChild(img);
            profilesGrid.appendChild(profileItem);
        }
    }
    
    // Inicializar a grade de perfis
    createProfilesGrid();
});