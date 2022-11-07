Parabéns. Você está no caminho certo para se tornar um magnata do comércio eletrônico. Jeff Bezos quem?

### 🚢 Movendo-se para a rede principal

Minha parte favorita sobre este projeto é o fato de **não haver custo de implantação**. QUALQUER UM pode "implantar" este projeto gratuitamente e começar a gerar renda vendendo suas coisas. Para começar a aceitar transações na rede principal, basta atualizar duas variáveis.

1. O endereço do token "USDC" em createTransaction.js. O endereço do token SPL USDC da rede principal é EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v, portanto, sua instrução deve ficar assim:

```jsx
const usdcAddress = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
```

2. A enumeração de rede (network) em WalletAdapterNetwork, dentro do _app.js e createTransaction.js:

```jsx
const network = WalletAdapterNetwork.Mainnet;
```

Ta-da! Seu aplicativo agora está recebendo dinheiro real na rede principal. Isso é mágico.

### 🚀 Implante para o mundo (GTFOL)

A implantação de um aplicativo React ficou tão fácil que não há razão para não fazê-lo neste momento rsrs. Além disso, é grátis. Você chegou até aqui, a implantação é a etapa final. Além disso, seus colegas construtores do buildspace não devem ser privados de seus NFTs!! Por favor, nos dê a oportunidade de cunhar suas criações raras hehe.

**Nota:** Como o Vercel é um sistema de arquivos somente leitura, adicionar pedidos ou produtos do aplicativo da web **não funcionará**! Isso é porque seus arquivos json do "banco de dados" não serão salvos. Se você não quiser usar o Vercel, tudo bem. Use o que quiser.

Basicamente:

- Envie seu código mais recente para o Github;
- Conecte o Vercel ao seu repositório;
- Certifique-se de adicionar suas variáveis .env;
- Implantação do aplicativo;
- Feito.

Nota: No Vercel, você precisará adicionar a 6ª variável de ambiente CI=false. Isso garantirá que nossa compilação não falhe devido a avisos.

![Vercel upload](https://i.imgur.com/wn2Uhj4.png)

### 😍 Olá, Mestre da Solana

Super emocionante que você chegou ao fim. Isso é grandioso!! Solana é uma plataforma bem recente e muito poderosa, e agora você colocou as mãos na massa com sua tecnologia central. Aí sim!! Agora você tem todas as habilidades que precisa para construir sua própria Gumroad.

Obrigado por contribuir para o futuro da web3 aprendendo essas coisas. O fato de você saber como isso funciona e como codificá-lo é um superpoder. Use seu poder com sabedoria ;).

### 🥞 Carreiras na Web3

Muitas pessoas também conseguiram empregos em tempo integral nas principais empresas da web3 via buildspace. Estou constantemente vendo as pessoas acertarem suas entrevistas depois de fazerem alguns projetos do buildspace.

![Nick being a boss at his job application](https://i.imgur.com/CNzLdQc.png)

**As pessoas parecem pensar que a web3 só precisa de pessoas que possam codificar contratos inteligentes ou escrever código que faça interface com a blockchain. Não é verdade.**

Há muito trabalho a fazer e a maior parte do trabalho nem precisa ser feito com contratos inteligentes rsrs. **Ser um engenheiro em web3 significa apenas pegar suas habilidades de web2 e aplicá-las à web3.**

Eu gostaria de passar rapidamente pelo significado de "trabalhar na web3" como engenheiro. Você precisa ser um profissional de Solana? Você precisa saber como funciona cada pequena coisa sobre a blockchain?

Por exemplo, digamos que você seja um ótimo engenheiro de frontend. Se você terminou este projeto, você tem quase tudo o que precisa para ser um ótimo engenheiro de frontend em uma empresa web3. Por exemplo, a empresa pode dizer "Ei - por favor, vá e construa nosso recurso de conexão à carteira" - e você já terá uma ideia sólida de como fazer isso :).

Eu só quero inspirá-lo a trabalhar na web3 rsrs. Essa área é incrível. E seria legal se você desse uma chance ;).

Certifique-se de clicar em "Work" no topo da página e preencher seu perfil, se ainda não o fez!!! Somos parceiros de algumas das melhores empresas web3 do mundo (ex. Uniswap, OpenSea, Chainlink, Edge e Node, entre outras) e elas querem contratar desenvolvedores da rede buildspace :). Você já adquiriu uma habilidade que é extremamente valiosa e as empresas estão pagando caro por incríveis engenheiros da web3.

### 🤟 Seu NFT!

Enviaremos seu NFT por airdrop dentro de uma hora e enviaremos um e-mail assim que ele estiver em sua carteira. Esse processo está rodando em automático! Se você não receber o e-mail dentro de 24 horas, por favor, envie-nos uma mensagem no Discord em #feedback e marque @alec#8853.

Certifique-se de clicar no botão na parte inferior desta página e enviar seu link final. Caso contrário, nosso sistema não o marcará como "concluído".

### 🌈 Antes de sair

Vá para #showcase no Discord e envie-nos um link para o seu produto final com o qual podemos mexer :).

Além disso, você deveria postar no Twitter seu projeto final e mostrar ao mundo sua criação épica! O que você fez não foi nada fácil. Talvez até faça um pequeno vídeo mostrando seu projeto e anexe-o ao tweet. Deixe seu tweet bonito e mostre-o para todos!!

E se você quiser, marque @_buildspace :). Isso nos dá muita motivação sempre que vemos as pessoas enviarem seus projetos. Além disso, você pode inspirar outra pessoa a entrar em Solana.

Dê-nos essa dose de dopamina, por favor.

Por fim, o que também seria incrível é se você nos dissesse em #feedback como gostou deste projeto e de sua estrutura. O que você mais gostou no buildspace? O que não te agradou? O que gostaria que mudássemos para projetos futuros? Seu feedback seria incrível!

Vejo você por aí!!!
