# Cell's World - O Micromundo Celular

Repositório oficial do projeto **Cell's World**, desenvolvido como parte da Prática Profissional dos alunos do IFRN Campus Caicó.

## Equipe
- **Flaubert Cauê Dantas**  
- **Jainne Beatriz de Araújo Silva**  
- **Paulino Alexandre da Silva Bisneto**  
- **Paulo Victor de Moura Adelino**  
- **Sávio Sáron Câmara de Araújo**  
- **Vitória Rebeca Nóbrega Damásio**

## Drive
Devido às limitações do GitHub para hospedar arquivos de modelagem, disponibilizamos um link para nosso Google Drive contendo todas as modelagens do projeto.  
Após realizar o download, copie os arquivos para a pasta `models`, localizada no diretório `assets` (`CELL-S-WORLD/assets/models`).  

[Drive com as modelagens](https://drive.google.com/drive/folders/1TymQksEjWN6DXedaLqXeAzSIzWI35Pvk?usp=drive_link)

Sinta-se à vontade para adicionar novas modelagens ao projeto.  

Após clonar o repositório, é necessário instalar as dependências do projeto. Para isso, execute o comando npm install no diretório raiz. Depois de concluída a instalação, inicie o servidor de desenvolvimento com o comando npm run dev. O projeto será aberto automaticamente no navegador, ou você poderá acessá-lo pelo endereço exibido no terminal.

Se desejar adicionar suas próprias modelagens, comece copiando os arquivos das modelagens para a pasta models, localizada no diretório assets (CELL-S-WORLD/assets/models). Caso precise de exemplos, você pode consultar os arquivos disponíveis no Drive com as modelagens.

Após isso, localize a constante models no arquivo src/App.jsx e insira sua modelagem no formato:
{
    path: './assets/models/nomedoarquivo.glb ou .gltf', 
    position: new THREE.Vector3(x, y, z), 
    scale: new THREE.Vector3(x, y, z),
},

Depois, adicione um botão correspondente no retorno do componente, utilizando o modelo:
<strong>
    <button 
        className="button" 
        onClick={() => toggleVisibility(/* índice correspondente */)}>
        Nome da modelagem
    </button>
</strong>

Certifique-se de ajustar o índice em toggleVisibility de acordo com o número total de botões no projeto.

Sinta-se à vontade para contribuir com novas modelagens e aprimorar o projeto! Se tiver dúvidas, consulte o código ou a documentação disponível.

## Considerações finais
Agradecemos pelo interesse em nosso trabalho!  

