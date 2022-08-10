### 😡 Revogue as funções.

Se você se lembra, você na verdade ainda tem direitos de cunhagem no contrato ERC-20. Isso significa que você pode ir e criar mais tokens se você quiser, o que pode deixar os membros da sua DAO malucos rs. Você pode ir e cunhar tipo um bilhão de tokens para você lol.

É melhor você revogar sua função de cunhagem completamente.

Dessa maneira, apenas o contrato de votação é capaz de cunhar novos tokens. Nós podemos fazer isso adicionando o seguinte em `scripts/11-revoke-roles.js`:

```jsx
import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("INSIRA_O_ENDEREÇO_DO_TOKEN_MODULE");

(async () => {
  try {
    // Mostre os papeis atuais.
    const allRoles = await token.roles.getAll();

    console.log("👀 Papeis que existem agora:", allRoles);

    // Remova todos os superpoderes que sua carteira tinha sobre o contrato ERC-20.
    await token.roles.setAll({ admin: [], minter: [] });
    console.log(
      "🎉 Papeis depois de remover nós mesmos",
      await token.roles.getAll()
    );
    console.log("✅ Revogados nossos super-poderes sobre os tokens ERC-20");

  } catch (error) {
    console.error("Falha ao remover nossos direitos sobre o tesouro da DAO", error);
  }
})();
```

Quando eu rodo isso usando `node scripts/11-revoke-roles.js` eu recebo:

```plaintext
$ node scripts/11-revoke-roles.js 
👋 SDK inicializado pelo endereço: 0xf9aD3D930AB5df972558636A2B8749e772aC9297
👀 Papeis que existem agora: {
  admin: [ '0xf9aD3D930AB5df972558636A2B8749e772aC9297' ],
  minter: [
    '0xf9aD3D930AB5df972558636A2B8749e772aC9297',
    '0xB6f4Dcb245638F5C1b694FA8f28E4C37400A437b'
  ],
  transfer: [
    '0xf9aD3D930AB5df972558636A2B8749e772aC9297',
    '0x0000000000000000000000000000000000000000'
  ]
}
🎉 Papeis depois de remover nós mesmos {
  admin: [],
  minter: [],
  transfer: [
    '0xf9aD3D930AB5df972558636A2B8749e772aC9297',
    '0x0000000000000000000000000000000000000000'
  ]
}
✅ Revogados nossos super-poderes sobre os tokens ERC-20
```

No começo você pode ver que meu endereço `0xf9aD3D9` tinha vários privilégios sobre o ERC-20. Então, depois de rodar `token.roles.setAll({ admin: [], minter: [] })` você vai ver que a única pessoa que tem a função de cunhagem é o contrato de votação!

Agora nós estamos livre de um possível "roubo" vindo de admins :).

Você verá que ainda tenho a função `transfer` em conjunto com `AddressZero`, na matriz de papeis significa que todos podem transferir tokens (que é o que queremos). Não importa que nosso endereço também esteja lá.

### 👍 Lide com erro de network não suportada.

Primeiramente, vamos importar um último hook `useNetwork` no topo de `App.jsx` para poder reconhecer uma conexão de fora da rede Goerli. Também importamos `ChainId` do thirdweb SDK:

```jsx
import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk'
```

Então definimos nosso hook `useNetwork` abaixo do `useAddress`:

```jsx
const network = useNetwork();
``` 

Depois, adicione o trecho a seguir no seu arquivo `App.jsx` logo abaixo da função `mintNft`.

```jsx
if (address && (network?.[0].data.chain.id !== ChainId.Goerli)) {
  return (
    <div className="unsupported-network">
      <h2>Por favor, conecte-se à rede Goerli</h2>
      <p>
        Essa dapp só funciona com a rede Goerli, por favor 
        troque de rede na sua carteira.
      </p>
    </div>
  );
}
```

Bem simples! Mas bem útil. Uma mensagem vai ser mostrada se o usuário não estiver na rede Goerli!

### 🤑 Veja o seu token na Uniswap.

Você pode estar se perguntando como tokens como [ENS DAO](https://coinmarketcap.com/currencies/ethereum-name-service/) ou o mais recente [Constitution DAO](https://coinmarketcap.com/currencies/constitutiondao/) tem tokens de governança que valem dinheiro de verdade. Bem, Basicamente, é porque outras pessoas podem de fato comprar seus tokens de governança diretamente em exchanges decentralizadas como Uniswap.

Por exemplo — talvez uma pessoa aleatória acorde e diga, “Ei, eu te dou $100 por 100 $BIKES por que eu quero me juntar à MTBDAO e ter algum poder de governança”. Bem, isso significa que $BIKES tem valor real agora. Isso significa que 1 $BIKES = 1 Us Dollar. E uma vez que existem 1.000.000 $BIKES, isso significa que o valor de mercado totalmente diluído do meu token valeria $1.000.000.

Bem louco, certo :)?

Pessoas geralmente fazem trocas como essas na Uniswap.

Acredite ou não, seu token agora vai aparecer na Uniswap dentro da Goerli.

Aqui está um vídeo rápido para você fazer você mesmo: 

[Loom](https://www.loom.com/share/994d0e73f7f14af8a732d40e3d84c45e)

Você pode ler mais sobre liquidity pools [aqui](https://www.web3dev.com.br/fatimalima/a-uniswap-v3-explicada-2b8g). Você vai notar no vídeo que não existia uma para $BIKES. Mas, tecnicamente qualquer pessoa poderia vir e criar uma pool que permite pessoas trocarem $ETH por $BIKES. Essa pool poderia ter $100. Ou, poderia ter $1.000.000.000. Depende de quão popular meu token é!

### 🎨 Personalize um pouco seu web app!

Tire algum tempo para personalizar seu web app um pouco. Mude algumas cores. Mude os textos. Adicione alguns emojis legais. Vá para `public/index.html` e mude coisas como o título e a descrição!

Ideia aleatória: quando as pessoas estão votando, toque o hino do país ou algo do tipo lolol.

Tire algum tempo aqui antes de seguir em frente para fazer essas páginas suas. Mesmo que tudo que você faça seja mudar a cor do background está tudo bem. Se divirta com isso.

### 🚨 Relatório de Progresso

*Por favor faça isso ou Yan vai ficar triste :(.*

Vá em frente e poste uma captura de tela em `#progresso` do seu DAO dashboard depois de algumas customizações!
