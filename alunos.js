document.addEventListener('DOMContentLoaded', () => {
    carregarLivros();
    async function getLivroDetalhes(livroID) {
        try {
            const res = await fetch(`https://estante-jacomel.vercel.app/livros/${livroID}`);
            const data = await res.json();

            document.querySelector('#modalTitulo').textContent = data.nomeLivro;
            document.querySelector('#modalCapa').style.backgroundImage = `url(${data.capa})`;
            document.querySelector('#modalAutor').textContent = data.autor;
            document.querySelector('#modalStatus').textContent = data.status;
            document.querySelector('#modalDetalhes').style.animation = 'modalSlideUp 0.3s ease-in-out forwards';

            document.querySelector('#livroReservado').textContent = `${data.autor} - ${data.nomeLivro}`;
            document.querySelector('#modalDescricao').textContent = data.descricao;
            document.querySelector('#modalSinopse').textContent = data.sinopse;

            if (data.status === 'disponível') {
                document.querySelector('#btnReservar').style = 'display: block;';
                document.querySelector('#modalStatus').style = 'color: var(--cor-disponivel); border-color: var(--cor-disponivel); background: rgba(74, 124, 89, 0.05);';
            } else {
                document.querySelector('#btnReservar').style = 'display: none;';
                document.querySelector('#modalStatus').style = 'color: var(--cor-indisponivel); border-color: var(--cor-indisponivel); background: rgba(74, 124, 89, 0.05);';
            }
        } catch (error) {
            console.log('>> [FRONTEND] Erro ao buscar livro:', error);
        }
    }

    async function inserirNome(nome, turma, livroName) {
        try {
            const res = await fetch('https://estante-jacomel.vercel.app/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    turma,
                    livroName
                })
            });
            const data = await res.json();

            if (data.status == "ok200") {
                setTimeout(() => {
                    document.querySelector('.btn-confirmar').style = 'background-color: var(--cor-disponivel); color: white; pointer-events: none; cursor: not-allowed; border: 2px solid var(--cor-disponivel);';
                    document.querySelector('.btn-confirmar').innerText = 'Reserva enviada com sucesso!';
                    document.querySelector('#turma').value = '';
                    document.querySelector('#nomeAluno').value = '';
                    document.querySelector('.btn-secondary2').innerText = 'Fechar';
                }, 2000);
            }
        } catch (error) {
            console.log('>> [FRONTEND] Erro ao inserir nome:', error);
        }
    }

    async function carregarLivros() {
        try {
            const res = await fetch('https://estante-jacomel.vercel.app/livros');
            const data = await res.json();
            const status = data.status;

            data.forEach(livro => {
                const livroCard = document.createElement('div');
                livroCard.classList.add('livro-card');
                livroCard.id = livro.slugID;
                livroCard.addEventListener('click', () => {
                    getLivroDetalhes(livro.slugID);
                });
                livroCard.innerHTML = `
                    <div class="livro-capa">
                        <img src="${livro.capa}" alt="">
                    </div>
                    <div class="livro-info">
                        <h3 class="livro-titulo">${livro.nomeLivro}</h3>
                        <p class="livro-autor">${livro.autor}</p>
                        <span class="livro-status ${livro.status}">${livro.status}</span>
                    </div>
                `;
                document.querySelector('.catalogo').appendChild(livroCard);

                
            });

        } catch (error) {
            console.log('>> [FRONTEND] Erro ao carregar livros:', error);
        }
    }


    const inputPesquisa = document.querySelector('.search-bar input');
    const closeButtons = [document.querySelector('.close-modal'), document.querySelector('.btn-secondary')];
    const closeButtons2 = [document.querySelector('.close-modal2'), document.querySelector('.btn-secondary2')];

    inputPesquisa.addEventListener('input', () => {
        const textoPesquisa = inputPesquisa.value.toLowerCase();
        const livros = document.querySelectorAll('.livro-card');
        livros.forEach(livro => {
            if (livro.innerText.toLowerCase().includes(textoPesquisa)) {
                livro.style.display = 'inline-block';
            } else {
                livro.style.display = 'none';
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('#modalDetalhes').style.animation = 'modalSlideDown 0.3s ease-in-out forwards';
            document.querySelector('#livroReservado').textContent = '...';
        });
    });

    closeButtons2.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('#modalReserva').style.animation = 'modalSlideDown 0.3s ease-in-out forwards';
            document.querySelector('#livroReservado').textContent = '...';
            document.querySelector('.btn-confirmar').style = 'background-color: var(--cor-tinta); color: white; pointer-events: auto; cursor: pointer; border: 2px solid var(--cor-tinta);';
            document.querySelector('.btn-confirmar').innerText = 'Confirmar Reserva';
        });
    });

    document.querySelector('#btnReservar').addEventListener('click', () => {
        document.querySelector('#modalDetalhes').style.animation = 'modalSlideDown 0.3s ease-in-out forwards';
        document.querySelector('#modalReserva').style.animation = 'modalSlideUp 0.3s ease-in-out forwards';
    });

    document.querySelector('.btn-confirmar').addEventListener('click', (e) => {
        const nameValue = document.querySelector('#nomeAluno').value;
        const turmaValue = document.querySelector('#turma').value;
        const livroName = document.querySelector('#livroReservado').textContent;

        if (nameValue && turmaValue) {
            document.querySelector('.btn-confirmar').style = 'pointer-events: none; cursor: wait;';
            document.querySelector('.btn-confirmar').innerText = 'Fazendo reserva, aguarde...';
            inserirNome(nameValue, turmaValue, livroName);
        } else {
            alert('Preencha todos os campos!');
        }
    });

    document.querySelector('.atualizarLista').addEventListener('click', () => {
        document.querySelector('.catalogo').innerHTML = '';
        document.querySelector('.search-bar input').value = '';
        carregarLivros();
    });

});