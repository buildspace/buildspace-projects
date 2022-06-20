🔤 Gerando randomicamente palavras em uma imagem.
------------------

Bacana — nós criamos um contrato que agora cria NFTs dentro da rede (on-chain). Mas ainda é sempre o mesmo NFT argh !!! Vamos torná-lo dinâmico. 

**Eu escrevi [esse código](https://gist.github.com/danicuki/f72e714a00800c24b23d3c5004f6557e) que irá gerar um SVG com uma combinação de três palavras aleatórias.**

Eu acho que essa seria a melhor maneira para as pessoas olharem todo o código de uma vez e entender como ele está funcionando.

Eu também escrevi um comentário acima da maioria das linhas que adicionei/alterei! Quando você olhar para este código, tente escrevê-lo você mesmo. Pesquise no Google as funções que você não entende!

Eu quero fazer algumas observações sobre algumas dessas linhas.

📝 Escolha as suas próprias palavras.
------------------

```solidity
string[] firstWords = ["SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA"];
string[] secondWords = ["SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA"];
string[] thirdWords = ["SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA", "SUA_PALAVRA"];
```

Estas são nossas palavras aleatórias!! Por favor, divirta-se com isso. Certifique-se de que cada palavra seja única e sem espaços!

Quanto mais engraçadas as palavras, melhor será rs. Eu gostei de fazer de cada array um determinado tema. Por exemplo, `firstWords` pode ser um nome de refrigerante. Então, `secondWords` pode ser uma comida. E `thirdWords` podem ser nomes de frutas aleatórios. Sei lá... Divirta-se com isso!!! Deixe com a sua cara

Aqui estão alguns dos meus. Eu gosto que a primeira linha tenha palavras que parecem "descrever" algo!

![](https://i.imgur.com/vyEdTtx.png)

Talvez você queira gerar um nome de banda aleatório. Talvez você queira gerar nomes de personagens aleatórios para suas sessões de Dungeons and Dragons. Faça o que você quiser. Talvez você não dê a mínima para combinações de três palavras e só queira fazer SVGs de pinguins de pixel art. Vá em frente. Faça o que você quiser :).

Observação: Eu Recomendo entre 15-20 palavras por array. Notei que cerca de 10 geralmente não é aleatório o suficiente.

🥴 Números aleatórios.
------------------

```solidity
function pickRandomFirstWord
```

Esta função parece meio descoladona, né? Vamos falar sobre como estamos escolhendo aleatoriamente as coisas dos arrays

Então, gerar um número aleatório em contratos inteligentes é amplamente conhecido como um **problema difícil**.

Por quê? Bem, pense em como um número aleatório é gerado normalmente. Quando você gera um número aleatório normalmente em um programa, **pegará vários números diferentes de seu computador como uma fonte de aleatoriedade** como: a velocidade das ventoinhas, a temperatura da CPU, o número de vezes que você pressionou "L" às 15:52 desde que comprou o computador, a velocidade da sua internet e vários outros variáveis que são difíceis de controlar. Ele pega **todos** esses números que são "aleatórios" e os coloca juntos em um algoritmo que gera um número que parece ser a melhor tentativa de um número verdadeiramente "aleatório". Fez sentido?

No blockchain, não há **quase nenhuma fonte de aleatoriedade**. É determinista e tudo o que o contrato vê, o público vê. Por causa disso, alguém poderia enganar o sistema apenas olhando para o smart contract, vendo em que variável ele se baseia para aleatoriedade, e então a pessoa poderia manipulá-lo, se quisesse.

```solidity
random(string(abi.encodePacked("PRIMEIRA_PALAVRA", Strings.toString(tokenId))));
```

O que isso está fazendo é pegar duas coisas: a string atual `PRIMEIRA_PALAVRA` e uma versão stringificada do `tokenId`. Eu combino essas duas strings usando `abi.encodePacked` e então essa string combinada é o que eu uso como fonte de aleatoriedade.

**Isso não é aleatoriedade verdadeira.** Mas é o melhor que temos por agora!

Existem outras maneiras de gerar números aleatórios no blockchain (verifique o [Chainlink](https://docs.chain.link/docs/chainlink-vrf/)), mas o Solidity nativamente não nos dá nada confiável porque não pode! Todos as varaiveis que nosso contrato pode acessar são públicas e nunca verdadeiramente aleatórios.

Isso pode ser um pouco irritante para alguns aplicativos como o nosso aqui! Em qualquer caso, ninguém vai atacar nosso pequeno aplicativo, mas quero que você saiba de tudo isso quando estiver construindo um dApp que tem milhões de usuários!

✨  Criando o SVG dinamicamente.
------------------

Verifique a variável `string baseSvg` no contrato. Isso ta louco demais rs. Basicamente, a única parte do nosso SVG que muda é o combo de três palavras, certo? Então o que fazemos é criar uma variável `baseSvg` que podemos reutilizar continuamente conforme criamos novos NFTs.


Em seguida, reunimos tudo usando:

```
string memory finalSvg = string(abi.encodePacked(baseSvg, first, second, third, "</text></svg>"));
```
`</text></svg>` são as tags de fechamento! Então, para `finalSvg`, estamos dizendo: "Ei - vá combinar meu baseSVG, meu combo de três palavras que acabei de gerar e minhas tags de fechamento." É isso aí :)! Parece assustador, mas tudo o que estamos fazendo é trabalhar com o código SVG.

😎 Executando!
------------------------

Depois de escrever tudo, vá em frente e execute-o usando `npx hardhat run scripts/run.js`. Verifique a saída produzido por `console.log(finalSvg);`.

Isto é oque aparece no meu terminal.

```plaintext
Meu contrato de NFT! Tchu-hu
Contrato implantado em: 0x5FbDB2315678afecb367f032d93F642f64180aa3

--------------------
<svg  xmlns='http://www.w3.org/2000/svg'  preserveAspectRatio='xMinYMin meet'  viewBox='0 0 350 350'>  <defs>    <linearGradient id='Gradient1'>      <stop class='stop1' offset='0%'/>      <stop class='stop2' offset='50%'/>      <stop class='stop3' offset='100%'/>    </linearGradient>  </defs>  <style>    .base {      fill: blue;      font-family: serif;      font-size: 20px;      color: #FFF;    }    .stop1 { stop-color: green; }    .stop2 { stop-color: white; stop-opacity: 0; }    .stop3 { stop-color: yellow; }      </style>  <rect width='100%' height='100%' fill='url(#Gradient1)' />  <text    x='50%'    y='50%'    class='base'    dominant-baseline='middle'    text-anchor='middle'  >FantaAcarajeAmora</text></svg>
--------------------

Um NFT com ID 0 foi cunhado para 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

--------------------
<svg  xmlns='http://www.w3.org/2000/svg'  preserveAspectRatio='xMinYMin meet'  viewBox='0 0 350 350'>  <defs>    <linearGradient id='Gradient1'>      <stop class='stop1' offset='0%'/>      <stop class='stop2' offset='50%'/>      <stop class='stop3' offset='100%'/>    </linearGradient>  </defs>  <style>    .base {      fill: blue;      font-family: serif;      font-size: 20px;      color: #FFF;    }    .stop1 { stop-color: green; }    .stop2 { stop-color: white; stop-opacity: 0; }    .stop3 { stop-color: yellow; }      </style>  <rect width='100%' height='100%' fill='url(#Gradient1)' />  <text    x='50%'    y='50%'    class='base'    dominant-baseline='middle'    text-anchor='middle'  >GrapeteMoquecaAcai</text></svg>
--------------------

Um NFT com ID 1 foi cunhado para 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

Haha, isso é um monte de coisas. Vá em frente e copie um dos SVGs que foi gerado em seu terminal e cole-o [aqui](https://www.svgviewer.dev/) para ver o que você obtém.

Você poderá ver o SVG que foi gerado! Aqui está o meu:

![Untitled](https://i.imgur.com/2pX1cen.png)

**TACALE PAU NESSE CARRINHO!!!!** Geramos isso aleatoriamente em nosso contrato! Se você pegar o outro SVG gerado perceberá que ele é diferente. Tudo está sendo gerado instantaneamente. YAY.

👩‍💻 Gerando os metadados dinamicamente.
------------------

Agora, precisamos definir os metadados JSON! Primeiro, precisamos de algumas funções auxiliares. Crie uma pasta chamada `libraries` em `contracts`. Em `libraries`, crie um arquivo chamado` Base64.sol` e copie e cole o código [desse link](https://gist.github.com/danicuki/4157b854d6dc83021674c5b08bd5f2df) nele. Este arquivo tem algumas funções auxiliares criadas por outra pessoa para nos ajudar a converter nosso SVG e JSON para Base64 no Solidity.

Okay, agora atualize o nosso contrato.

**Mesma coisa, escrevi todo o código e adicionei comentários [nesse link](https://gist.github.com/danicuki/0d93584e94042de12b4722fa10faa0dc).**

Sinta-se à vontade para copiar e colar algumas dessas partes e entender como funciona depois de executá-lo :). Às vezes eu gosto de fazer isso porque posso ver o código sendo executado e entender como funciona depois!!

Depois de executar o contrato, aqui está o que recebo do terminal:

```plaintext
Compiled 2 Solidity files successfully
Meu contrato de NFT! Tchu-hu
Contrato implantado em: 0x5FbDB2315678afecb367f032d93F642f64180aa3

--------------------
data:application/json;base64,eyJuYW1lIjogIkZhbnRhQWNhcmFqZUFtb3JhIiwgImRlc2NyaXB0aW9uIjogIlVtYSBjb2xlY2FvIGFjbGFtYWRhIGUgZmFtb3NhIGRlIE5GVHMgbWFyYXZpbGhvc29zLiIsICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUFnZUcxc2JuTTlKMmgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TURBdmMzWm5KeUFnY0hKbGMyVnlkbVZCYzNCbFkzUlNZWFJwYnowbmVFMXBibGxOYVc0Z2JXVmxkQ2NnSUhacFpYZENiM2c5SnpBZ01DQXpOVEFnTXpVd0p6NGdJRHhrWldaelBpQWdJQ0E4YkdsdVpXRnlSM0poWkdsbGJuUWdhV1E5SjBkeVlXUnBaVzUwTVNjK0lDQWdJQ0FnUEhOMGIzQWdZMnhoYzNNOUozTjBiM0F4SnlCdlptWnpaWFE5SnpBbEp5OCtJQ0FnSUNBZ1BITjBiM0FnWTJ4aGMzTTlKM04wYjNBeUp5QnZabVp6WlhROUp6VXdKU2N2UGlBZ0lDQWdJRHh6ZEc5d0lHTnNZWE56UFNkemRHOXdNeWNnYjJabWMyVjBQU2N4TURBbEp5OCtJQ0FnSUR3dmJHbHVaV0Z5UjNKaFpHbGxiblErSUNBOEwyUmxabk0rSUNBOGMzUjViR1UrSUNBZ0lDNWlZWE5sSUhzZ0lDQWdJQ0JtYVd4c09pQmliSFZsT3lBZ0lDQWdJR1p2Ym5RdFptRnRhV3g1T2lCelpYSnBaanNnSUNBZ0lDQm1iMjUwTFhOcGVtVTZJREl3Y0hnN0lDQWdJQ0FnWTI5c2IzSTZJQ05HUmtZN0lDQWdJSDBnSUNBZ0xuTjBiM0F4SUhzZ2MzUnZjQzFqYjJ4dmNqb2daM0psWlc0N0lIMGdJQ0FnTG5OMGIzQXlJSHNnYzNSdmNDMWpiMnh2Y2pvZ2QyaHBkR1U3SUhOMGIzQXRiM0JoWTJsMGVUb2dNRHNnZlNBZ0lDQXVjM1J2Y0RNZ2V5QnpkRzl3TFdOdmJHOXlPaUI1Wld4c2IzYzdJSDBnSUNBZ0lDQThMM04wZVd4bFBpQWdQSEpsWTNRZ2QybGtkR2c5SnpFd01DVW5JR2hsYVdkb2REMG5NVEF3SlNjZ1ptbHNiRDBuZFhKc0tDTkhjbUZrYVdWdWRERXBKeUF2UGlBZ1BIUmxlSFFnSUNBZ2VEMG5OVEFsSnlBZ0lDQjVQU2MxTUNVbklDQWdJR05zWVhOelBTZGlZWE5sSnlBZ0lDQmtiMjFwYm1GdWRDMWlZWE5sYkdsdVpUMG5iV2xrWkd4bEp5QWdJQ0IwWlhoMExXRnVZMmh2Y2owbmJXbGtaR3hsSnlBZ1BrWmhiblJoUVdOaGNtRnFaVUZ0YjNKaFBDOTBaWGgwUGp3dmMzWm5QZz09In0=
--------------------

Um NFT com ID 0 foi cunhado para 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

--------------------
data:application/json;base64,eyJuYW1lIjogIkdyYXBldGVNb3F1ZWNhQWNhaSIsICJkZXNjcmlwdGlvbiI6ICJVbWEgY29sZWNhbyBhY2xhbWFkYSBlIGZhbW9zYSBkZSBORlRzIG1hcmF2aWxob3Nvcy4iLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlBZ2VHMXNibk05SjJoMGRIQTZMeTkzZDNjdWR6TXViM0puTHpJd01EQXZjM1puSnlBZ2NISmxjMlZ5ZG1WQmMzQmxZM1JTWVhScGJ6MG5lRTFwYmxsTmFXNGdiV1ZsZENjZ0lIWnBaWGRDYjNnOUp6QWdNQ0F6TlRBZ016VXdKejRnSUR4a1pXWnpQaUFnSUNBOGJHbHVaV0Z5UjNKaFpHbGxiblFnYVdROUowZHlZV1JwWlc1ME1TYytJQ0FnSUNBZ1BITjBiM0FnWTJ4aGMzTTlKM04wYjNBeEp5QnZabVp6WlhROUp6QWxKeTgrSUNBZ0lDQWdQSE4wYjNBZ1kyeGhjM005SjNOMGIzQXlKeUJ2Wm1aelpYUTlKelV3SlNjdlBpQWdJQ0FnSUR4emRHOXdJR05zWVhOelBTZHpkRzl3TXljZ2IyWm1jMlYwUFNjeE1EQWxKeTgrSUNBZ0lEd3ZiR2x1WldGeVIzSmhaR2xsYm5RK0lDQThMMlJsWm5NK0lDQThjM1I1YkdVK0lDQWdJQzVpWVhObElIc2dJQ0FnSUNCbWFXeHNPaUJpYkhWbE95QWdJQ0FnSUdadmJuUXRabUZ0YVd4NU9pQnpaWEpwWmpzZ0lDQWdJQ0JtYjI1MExYTnBlbVU2SURJd2NIZzdJQ0FnSUNBZ1kyOXNiM0k2SUNOR1JrWTdJQ0FnSUgwZ0lDQWdMbk4wYjNBeElIc2djM1J2Y0MxamIyeHZjam9nWjNKbFpXNDdJSDBnSUNBZ0xuTjBiM0F5SUhzZ2MzUnZjQzFqYjJ4dmNqb2dkMmhwZEdVN0lITjBiM0F0YjNCaFkybDBlVG9nTURzZ2ZTQWdJQ0F1YzNSdmNETWdleUJ6ZEc5d0xXTnZiRzl5T2lCNVpXeHNiM2M3SUgwZ0lDQWdJQ0E4TDNOMGVXeGxQaUFnUEhKbFkzUWdkMmxrZEdnOUp6RXdNQ1VuSUdobGFXZG9kRDBuTVRBd0pTY2dabWxzYkQwbmRYSnNLQ05IY21Ga2FXVnVkREVwSnlBdlBpQWdQSFJsZUhRZ0lDQWdlRDBuTlRBbEp5QWdJQ0I1UFNjMU1DVW5JQ0FnSUdOc1lYTnpQU2RpWVhObEp5QWdJQ0JrYjIxcGJtRnVkQzFpWVhObGJHbHVaVDBuYldsa1pHeGxKeUFnSUNCMFpYaDBMV0Z1WTJodmNqMG5iV2xrWkd4bEp5QWdQa2R5WVhCbGRHVk5iM0YxWldOaFFXTmhhVHd2ZEdWNGRENDhMM04yWno0PSJ9
--------------------

Um NFT com ID 1 foi cunhado para 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

ISSO É ÉPICO. 

NOS ACABAMOS DE GERAR DINAMICAMENTE UM NFT INTEIRO. DENTRO DA BLOCKCHAIN (ON-CHAIN). ESTE É UM MOMENTO ÉPICO. 

Se você pegar um dos blobs `data:application/json;base64` e jogar na barra de endereço do navegador, verá todos os metadados JSON como antes. Exceto que agora tudo é feito automaticamente em nosso contrato :).

👀 Como raios funciona o `finalTokenUri`?
------------------

Essa linha grande com `string memory json = Base64.encode` pode parecer um pouco confusa, mas, só parece confusa por causa de todas as aspas rs. Tudo o que estamos fazendo é codificar em base64 os metadados JSON! Mas - está tudo **on-chain**. Então, todo esse JSON viverá no próprio contrato.

Nós tambem adicionamos dinamicamente o `name` e o SVG codificado em base64!

Finalmente, temos este `finalTokenUri` onde colocamos tudo junto e fazemos:

```solidity
abi.encodePacked("data:application/json;base64,", json)
```

Tudo o que está acontecendo aqui é que estamos juntando tudo e adicionando o nosso velho conhecido `data:application/json;base64,` que fizemos antes e depois acrescentamos o json codificado em base64!!


🛠 Debugando o conteudo de `finalTokenUri`
------------------------

Agora que você configurou o tokenURI, como sabemos se ele está realmente correto? Afinal, ele contém todos os nossos dados para nosso NFT! Você pode usar uma ferramenta legal como - [NFT Preview](https://nftpreview.0xdev.codes/) para ver uma visualização rápida da imagem e o conteúdo do json sem deployar de novo e e de novo na testnet do opensea.

Para facilitar, você pode passar o código `tokenURI` como um parâmetro de consulta como este,

```solidity
string memory finalTokenUri = string(
    abi.encodePacked("data:application/json;base64,", json)
);
console.log("\n--------------------");
console.log(
    string(
        abi.encodePacked(
            "https://nftpreview.0xdev.codes/?code=",
            finalTokenUri
        )
    )
);
console.log("--------------------\n");
```
![image](https://i.imgur.com/rDuu89V.png)

🚀 Deployando na Rinkeby
------------------
A parte mais legal é que podemos apenas re-deployar sem alterar nosso script usando:

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Assim que fizermos o redeploy, você poderá ver seus NFTs em [https://testnets.opensea.io/](https://testnets.opensea.io/) assim que pesquisar o endereço do contrato recém deployado. Novamente, **não clique o botão enter**. O OpenSea é estranho, então você precisa clicar na própria coleção quando ela aparecer.

OBSERVAÇÃO: Lembre-se de usar `https://rinkeby.rarible.com/token/INSIRA_O_ENDEREÇO_DE_CONTRATO_AQUI:INSIRA_O_TOKEN_ID_AQUI` se você estiver usando o Rarible.

Os contratos são **permanentes**. Então, toda vez que você redeployar o nosso contrato na verdade, estamos criando uma coleção totalmente nova.

Você deve conseguir ver a nova coleção no OpenSea ou no Rarible :)!

🤖 Permitindo que os usuários cunhem (Mint).
------------------

Épico - agora podemos cunhar NFTs dinamicamente e temos esta função `makeAnEpicNFT` que os usuários podem chamar. Muito progresso foi feito!! Mas não há como pessoas aleatórias criarem NFTs :(.

Tudo o que precisamos é um site que permita que os usuários criem um NFT por conta própria.


Então, vamos construir isso :)!

🚨 Relatório de progresso.
------------------------

Se você tiver um, envie uma captura de tela de seu novo NFT gerado dinamicamente no OpenSea/Rarible em #progress :). Além disso - se você ainda não tweetou uma imagem de sua coleção maravilhosa de NFT, agora é a hora de fazê-lo!! Lembre-se de marcar @web3dev_ !!! Vamos trazer o máximo de pessoas possível para esse bootcamp!