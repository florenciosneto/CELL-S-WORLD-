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

1. Localize a constante `models` no arquivo `src/App.jsx` e insira a sua modelagem no formato de glb ou gltf:

    ```javascript
    const models = [
        {
            path: './assets/models/complexoGolgi_V1.glb',
            position: new THREE.Vector3(0, -20, 0),
            scale: new THREE.Vector3(10, 10, 10),
        },
            path: './assets/models/Modelagem.glb',
            position: new THREE.Vector3(12, -43, 0),
            scale: new THREE.Vector3(10, 32, 10),
    
    ];
    ```

2. Após isso adicione mais um botão na `div app-container` para a sua modelagem ficar visivel :

    ```javascript
        <strong><button className="button" onClick={() => toggleVisibility(0)}>Complexo de Golgi</button></strong>
        <strong><button className="button" onClick={() => toggleVisibility(1)}>Modelagem</button></strong>
    ```

Certifique-se de ajustar os índices e os nomes das modelagens conforme necessário.

### Drive
Devido às limitações do GitHub para hospedar arquivos de modelagem, disponibilizamos um link para nosso Google Drive contendo todas as modelagens do projeto.  
[Drive com as modelagens](https://drive.google.com/drive/folders/1tNqPm9_AdeHLthgLYem9xtRRmJWSSkEs?usp=sharing)

Sinta-se à vontade para adicionar novas modelagens ao projeto.

### Adicionando novas modelagens

1. Após realizar o download das modelagens do Google Drive, copie os arquivos para a pasta `models`, localizada no diretório `assets` (`CELL-S-WORLD/assets/models`).

2. Atualize a constante `models` no arquivo `src/App.jsx` com os detalhes da nova modelagem, seguindo o formato descrito acima.

## Considerações finais
Agradecemos pelo interesse em nosso trabalho!
