### 👾 Configuração dos dados do NFT

Okay, agora nós vamos de fato fazer o deploy dos metadados associados com o nosso NFT de filiação. Nós não fizemos isso ainda. Tudo o que fizemos até agora foi criar o contrato ERC-1155 e adicionar alguns dados básicos. Não configuramos o nosso NFT de filiação de fato, vamos fazer isso!

Vá para `scripts/3-config-nft.js` e adicione:

```jsx
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("INSERT_EDITION_DROP_ADDRESS");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "Capacete Super Estilo",
        description: "Esse NFT vai te dar acesso ao MTBDAO!",
        image: readFileSync("scripts/assets/capacete.png"),
      },
    ]);
    console.log("✅ Novo NFT criado com sucesso no !");
  } catch (error) {
    console.error("falha ao criar o novo NFT", error);
  }
})()
```

Bem direto!

A primeira coisa que estamos fazendo é acessar nosso contrato `editionDrop`, que é o nosso contrato ERC-1155. Em `INSIRA_O_ENDEREÇO_DO_DROP_MODULE` colocamos o endereço que foi impresso no passo anterior. É o endereço impresso logo depois de `Contrato editionDrop implantado com sucesso, endereço:`.
Você também pode achar esse endereço no seu [dashboard no thirdweb](https://thirdweb.com/dashboard?utm_source=web3dev&utm_medium=web3dev_project). O seu dashboard thirdweb vai mostrar o projeto que você está trabalhando no momento e também o endereço do módulo para que você copie e cole facilmente 

![image](https://i.imgur.com/EyDAOky.png)


Logo após nós estamos configurando nosso NFT no nosso contrato ERC-1155 usando `createBatch`. Precisamos configurar algumas prioridades:

- **name**: O nome do nosso NFT.
- **description**: a descrição do nosso NFT.
- **image**: a imagem do nosso NFT. Essa é a imagem do NFT que os usuários vão reivindicar para poder acessar nossa DAO.

*Lembre-se, dado que é um ERC-1155, todos os nosso membros vão cunhar o mesmo NFT.*

Certifique-se de substituir `image: readFileSync("scripts/assets/capacete.png")` com a sua própria imagem. Mesmo de antes, certifique-se de que é uma imagem local, isso não vai funcionar se você usar um link da internet.

Eu estou criando a MTBDAO, então, meus membros vão precisar de um capacete lindão para se juntarem hehe:

![capacete.png](https://i.imgur.com/orLMro7.png)

Seja criativo com a sua, não me copie!

Quando você estiver pronto, rode:

```plaintext
node scripts/3-config-nft.js
```

Aqui está o que eu recebo:

```plaintext
👋 SDK inicializado pelo endereço: 0xf9aD3D930AB5df972558636A2B8749e772aC9297
✅ Novo NFT criado com sucesso no drop!
```

### 😼 Configurando a condição de reivindicação.

Agora precisamos configurar nossas condições de reivindicação. Qual o # máximo de NFTs que podem ser cunhados? Quando os usuários podem começar a cunhar os NFTs? Novamente, normalmente isto é lógica que você teria que escrever no seu contrato mas nesse caso o thirdweb faz isso ficar fácil. 

Vá para `scripts/4-set-claim-condition.js` e adicione:

```jsx
import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("INSERT_EDITION_DROP_ADDRESS");

(async () => {
  try {
    // Especifique as condições.
    const claimConditions = [{
      // Quando as pessoas vão poder reivindicar seus NFTs
      startTime: new Date(),
      // Número máximo de NFTs
      maxQuantity: 50_000,
      // o preço do NFT (grátis)
      price: 0,
      // Quantos NFTs podem ser reivindicados por transação.
      quantityLimitPerTransaction: 1,
      // tempo de espera entre transações infinito significa que cada
      // pessoa só pode solicitar um único NFT.
      waitInSeconds: MaxUint256,
    }]
    
    await editionDrop.claimConditions.set("0", claimConditions);

    console.log("✅ Condições de reinvidicação configuradas com sucesso!");
  } catch (error) {
    console.error("Falha ao definir condições de reinvidicação", error);
  }
})()
```

A mesma coisa que antes aqui, certifique-se de substituir `INSIRA_O_ENDEREÇO_DO_DROP_MODULE` com o endereço do seu contrato ERC-1155. 

`startTime` é o momento em que os usuários vão poder começar a cunhar os NFTs e nesse caso nós configuramos essa data para a hora atual, o que significa que usuários podem começar a cunhar imediatamente.

`maxQuantity` é o # máximo do nosso NFT de filiação que pode ser cunhado. `quantityLimitPerTransaction` especifica quantos tokens alguém pode reivindicar numa única transação, nós colocamos apenas um porque queremos que os usuários cunhem um NFT por vez! Em alguns casos você vai querer cunhar vários NFTs para o seu usuário de uma vez (ex. quando ele abrir uma caixa de recompensas com múltiplos NFTs) mas nesse caso só queremos um.

Finalmente, nós fazemos `editionDrop.claimConditions.set("0", claimConditions)` e isso vai na verdade **interagir com o nosso contrato que está on-chain** e ajustar as condições, muito massa! Por que passamos um `0`? Bem, basicamente nosso NFT de filiação tem um `tokenId` de `0` visto que é o primeiro token no nosso contrato ERC-1155. Lembre-se — com o ERC-1155 nós podemos ter várias pessoas cunhando o mesmo NFT. Nesse caso, todo mundo cunha um NFT com o id `0`. Mas poderíamos ter um NFT diferente com o id `1`, talvez poderíamos dar esse NFT para os membros da DAO que estão se destacando! Tudo depende da gente.

Depois de rodar `node scripts/4-set-claim-condition.js` aqui está o que eu recebo:

```
👋 SDK inicializado pelo endereço: 0xf9aD3D930AB5df972558636A2B8749e772aC9297
✅ Condições de reinvidicação configuradas com sucesso!
```

Boom! Nós interagimos com o nosso smart contract com sucesso e demos ao nosso NFT certas regras que ele deve seguir, isso aí! Se você copiar e colar o endereço do seu bundle drop impresso aí em cima e procurar em `https://goerli.etherscan.io/` você verá lá a prova de que nós interagimos com o contrato!

![Untitled](https://i.imgur.com/sioQiQA.png)

### 🚨 Relatório de Progresso

*Por favor faça isso ou o danicuki vai ficar triste :(.*

Ei! Vá em frente e compartilhe o NFT de filiação que você escolheu em `#progresso` e diga para nós por que você escolheu esse NFT épico para sua DAO