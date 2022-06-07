🌊 Dê ao usuário o link do OpenSea
--------------

Uma coisa que seria incrível é que, após o NFT ser cunhado, forneceríamos um link para seu NFT no OpenSea que eles poderiam compartilhar no Twitter ou com seus amigos!

O link para um NFT no OpenSea se parece com este:

`https://testnets.opensea.io/assets/0x88a3a1dd73f982e32764eadbf182c3126e69a5cb/9`

Basicamente, são duas variáveis.

`https://testnets.opensea.io/assets/INSIRA_O_ENDEREÇO_DE_CONTRATO_AQUI/INSIRA_O_TOKEN_ID_AQUI`

--------------------
**Nota: se você estiver usando o Rarible e o OpenSea está demorando para mostrar os metadados do seu NFT - verifique a escrita do link abaixo, eles são muito semelhante! Na verdade, gosto de usar o Rarible em vez do OpenSea, geralmente é muito mais rápido mostrar os metadados. O que é bom porque seus usuários podem ver instantaneamente seu NFT!**

O link para um NFT no Rarible se parece com este:

`https://rinkeby.rarible.com/token/0xb6be7bd567e737c878be478ae1ab33fcf6f716e0:0`

Basicamente, são duas variaveis.

`https://rinkeby.rarible.com/token/INSIRA_O_ENDEREÇO_DE_CONTRATO_AQUI:INSIRA_O_TOKEN_ID_AQUI`

--------------------

Então, nosso aplicativo da web tem o endereço do contrato, mas não o id do token! Portanto, precisaremos alterar nosso contrato para recuperá-lo. Vamos fazer isso.

Estaremos usando algo chamado `Events` no Solidity. Esses são como webhooks. Vamos escrever uma parte do código e fazê-lo funcionar primeiro!

Adicione esta linha abaixo da linha onde você cria suas três matrizes com suas palavras aleatórias!

`event NewEpicNFTMinted(address sender, uint256 tokenId);`

Então, adicione esta linha no final da função `makeAnEpicNFT`, então, esta é a última linha na função:

`emit NewEpicNFTMinted(msg.sender, newItemId);`

Em um nível básico, os `Events` são mensagens que nossos contratos emitem e que podemos capturar em nosso cliente em tempo real. No caso a nossa NFT, só porque nossa transação é minerada **não significa que a transação resultou na cunhagem de NFT**. Pode ter sido apenas um erro!! Mesmo se houvesse um erro, ainda teria sido extraído no processo.

É por isso que uso os `Events` aqui. Sou capaz de emitir `(emit)` um evento no contrato e, em seguida, capturar esse evento no front-end. Observe que no meu `event` envio o `newItemId` que precisamos no frontend, certo :)?

Novamente, é como um web hook. Exceto que este vai ser o webhook mais fácil de configurar rs.

Certifique-se de ler mais sobre eventos [aqui](https://docs.soliditylang.org/en/v0.4.21/contracts.html#events).

Como sempre quando mudamos nosso contrato.

1. Redeploy.
2. Atualize o endereço do contrato em `App.js`.
3. Atualiza o ABI file no web app.

Se você bagunçar alguma dessas coisas, *obterá* erros :).

Agora, em nosso frontend, adicionamos esta linha mágica (vou mostrar onde colocá-la um pouco).

```javascript
connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
	console.log(from, tokenId.toNumber())
	alert(`Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`)
});
```

Ok, isso é muito incrível. Em tempo real, capturaremos o evento de mintagem, obteremos o tokenId e forneceremos ao usuário seu link OpenSea para seu NFT recém-criado.

O código para `App.js` e do contrato esta [Rever este link](https://gist.github.com/farzaa/5015532446dfdb267711592107a285a9). Não é nada sofisticado. Apenas configurando um event listener! Fiz questão de inserir comentários nas linhas que adicionei para facilitar a visualização do que alterei. Certifique-se de adicionar uma chamada para `setupEventListener()` em dois lugares como eu faço no código! Não se confunda :).

🖼 Fundos coloridos!
--------------

Apenas por diversão, mudei o contrato para escolher aleatoriamente um fundo colorido. Não vou revisar o código aqui porque foi apenas para diversão, mas fique à vontade para ver os comentários [Rever este link](https://gist.github.com/farzaa/b3b8ec8aded7e5876b8a1ab786347cc9). Lembre-se de que, se alterar o contrato, você precisará redeployar, atualizar o arquivo ABI e atualizar o endereço do contrato.


😎 Defina um limite para o número de NFTs cunhados
--------------

Então, eu o desafio a mudar seu contrato para permitir que apenas um conjunto finitos de NFTs seja cunhado (por exemplo, talvez você queira que apenas 50 NFTs sejam cunhados no máximo!!). Seria ainda mais incrível se em seu site dissesse algo como `4/50 NFTs cunhados até agora` ou algo parecido para fazer seu usuário se sentir superespecial ao receber um NFT !!!

Dica, você precisará de algo que no solidity é chamado de `require`. E você também precisará criar uma função como `getTotalNFTsMintedSoFar` para seu aplicativo da web chamar.

❌ Alerte o usuário quando ele estiver na rede errada.
--------------

Seu site **apenas** funcionará no Rinkeby (já que é onde reside o seu contrato).

Vamos adicionar uma boa mensagem informando os usuários sobre isso!

Para isso, fazemos uma solicitação RPC para a blockchain para ver o ID da chain à qual nossa carteira se conecta. (Por que uma chain e não uma rede? [Boa pergunta!](https://ethereum.stackexchange.com/questions/37533/what-is-a-chainid-in-ethereum-how-is-it-different-than-networkid-and-how-is-it))

Já endereçamos solicitações ao blockchain. Usamos `ethereum.request` com os métodos `eth_accounts` e `eth_requestAccounts`. Agora usamos `eth_chainId` para obter o ID.

```javascript
let chainId = await ethereum.request({ method: 'eth_chainId' });
console.log("Connected to chain " + chainId);
// String, hex code of the chainId of the Rinkebey test network
const rinkebyChainId = "0x4"; 
if (chainId !== rinkebyChainId) {
	alert("You are not connected to the Rinkeby Test Network!");
}
```
Pronto, agora o usuário saberá se está na rede errada!
A solicitação está em conformidade com o [EIP-695](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-695.md), portanto, retorna o valor hexadecimal da rede como uma string.
Você pode achar os IDs de outras redes [aqui](https://docs.metamask.io/guide/ethereum-provider.html#chain-ids). 

🙉 Animação de mineração
--------------

Alguns de seus usuários podem ficar super confusos quando clicam em mint e nada acontece por 15 segundos rs! Talvez adicione uma animação de carregamento? Faça acontecer! Mas não vou cobrir sobre isso aqui :).

🐦 Adicione o seu Twitter
-----------------

Adicione seu Twitter na parte inferior :)! Já lhe dei um pequeno modelo para isso.

👀 Adicione um botão para permitir que as pessoas vejam a coleção!
-----------------

Talvez a parte mais importante!

Normalmente, quando as pessoas querem ver uma coleção NFT, elas olham para ela no OpenSea!! É uma maneira super fácil das pessoas admirarem a sua coleção. Portanto, se você der o link do seu site ao seu amigo, eles saberão que é legítimo!!

Adicione um pequeno botão que diz "🌊 Exibir coleção no OpenSea" e quando seus usuários clicarem nele, ele será vinculado à sua coleção! Lembre-se de que o link de suas coleções muda toda vez que você altera o contrato. Portanto, certifique-se de vincular sua coleção mais recente e final. Por exemplo, [essa](https://testnets.opensea.io/collection/squarenft-vu901lkj40) é a minha coleção.

Nota: Este link você precisará codificar. Eu deixei uma variável no topo para você preencher. Ela não pode ser gerada dinamicamente a menos que você use a API OpenSea (que é um exagero por enquanto rs).


🚨 Relatório de progresso!
-----------------

Você está quase no fim :). Poste uma captura de tela em #progress com aquele pequeno pop-up que fornece ao usuário o link direto do OpenSea!