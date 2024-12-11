# Cell's World - O Micromundo Celular

Repositório oficial do projeto **Cell's World**, desenvolvido como parte da Prática Profissional dos alunos do IFRN Campus Caicó.

## Equipe
- **Flaubert Cauê Dantas**  
- **Jainne Beatriz de Araújo Silva**  
- **Paulino Alexandre da Silva Bisneto**  
- **Paulo Victor de Moura Adelino**  
- **Sávio Sáron Câmara de Araújo**  
- **Vitória Rebeca Nóbrega Damásio**

## Instruções após baixar o projeto

Após clonar o repositório, é necessário instalar as dependências do projeto. Para isso, execute o comando `npm install` no diretório raiz. Depois de concluída a instalação, inicie o servidor de desenvolvimento com o comando `npm run dev`. O projeto será aberto automaticamente no navegador ou poderá ser acessado pelo endereço exibido no terminal.

### Configuração das modelagens

1. Localize a constante `models` no arquivo `src/App.jsx` e insira a sua modelagem no seguinte formato:

    ```javascript
    const models = [
        {
            path: './assets/models/nomedoarquivo.glb ou .gltf',
            position: new THREE.Vector3(x, y, z),
            scale: new THREE.Vector3(x, y, z),
        },
        // Adicione mais modelagens aqui
    ];
    ```

2. Adicione a função `toggleVisibility` no mesmo arquivo. Ela será usada para alternar a visibilidade de cada modelagem:

    ```javascript
    const toggleVisibility = (index) => {
        // Lógica para alternar visibilidade da modelagem no índice fornecido
        console.log(`Alternando visibilidade da modelagem ${index}`);
    };
    ```

3. Adicione um botão correspondente para cada modelagem no retorno do componente, utilizando o modelo abaixo:

    ```javascript
    return (
        <div>
            <h1>Cell's World - O Micromundo Celular</h1>
            <div>
                {models.map((model, index) => (
                    <strong key={index}>
                        <button 
                            className="button" 
                            onClick={() => toggleVisibility(index)}>
                            Modelagem {index + 1}
                        </button>
                    </strong>
                ))}
            </div>
            <div id="canvas">
                {/* Componente de renderização das modelagens */}
            </div>
        </div>
    );
    ```

Certifique-se de ajustar os índices e os nomes das modelagens conforme necessário.

### Adicionando novas modelagens

1. Após realizar o download das modelagens do Google Drive, copie os arquivos para a pasta `models`, localizada no diretório `assets` (`CELL-S-WORLD/assets/models`).

2. Atualize a constante `models` no arquivo `src/App.jsx` com os detalhes da nova modelagem, seguindo o formato descrito acima.

## Drive
Devido às limitações do GitHub para hospedar arquivos de modelagem, disponibilizamos um link para nosso Google Drive contendo todas as modelagens do projeto.  
[Drive com as modelagens](https://drive.google.com/drive/folders/1tNqPm9_AdeHLthgLYem9xtRRmJWSSkEs?usp=sharing)

Sinta-se à vontade para adicionar novas modelagens ao projeto.

## Considerações finais
Agradecemos pelo interesse em nosso trabalho!
