### 😡 Revogue as funções.

Se você se lembra, você na verdade ainda tem direitos de cunhagem no contrato ERC-20. Isso significa que você pode ir e criar mais tokens se você quiser, o que pode deixar os membros da sua DAO malucos rs. Você pode ir e cunhar tipo um bilhão de tokens para você lol.

É melhor você revogar sua função de cunhagem completamente.

Dessa maneira, apenas o contrato de votação é capaz de cunhar novos tokens. Nós podemos fazer isso adicionando o seguinte em `scripts/11-revoke-roles.js`:

```jsx
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule(
  "INSIRA_O_ENDEREÇO_DO_TOKEN_MODULE",
);

(async () => {
  try {
    // Mostre as funçÕes atuais.
    console.log(
      "👀 Roles that exist right now:",
      await tokenModule.getAllRoleMembers()
    );

    // Remova todos os superpoderes que sua carteira tinha sobre o contrato ERC-20.
    await tokenModule.revokeAllRolesFromAddress(process.env.WALLET_ADDRESS);
    console.log(
      "🎉 Roles after revoking ourselves",
      await tokenModule.getAllRoleMembers()
    );
    console.log("✅ Successfully revoked our superpowers from the ERC-20 contract");

  } catch (error) {
    console.error("Failed to revoke ourselves from the DAO treasury", error);
  }
})();
```

Quando eu rodo isso usando `node scripts/11-revoke-roles.js` eu recebo:

```plaintext
web3dev-dao-starter % node scripts/11-revoke-roles.js
👀 Roles that exist right now: {
  admin: [ '0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D' ],
  minter: [
    '0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D',
    '0xFE667920172882D0695E199b361E94325F0641B6'
  ],
  pauser: [ '0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D' ],
  transfer: [ '0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D' ]
}
🎉 Roles after revoking ourselves {
  admin: [],
  minter: [ '0xFE667920172882D0695E199b361E94325F0641B6' ],
  pauser: [],
  transfer: []
}
✅ Successfully revoked our superpowers from the ERC-20 contract
```

No começo você pode ver que meu endereço `0xF79A3bb8` tinha vários privilégios sobre o ERC-20. Então, depois de rodar `tokenModule.revokeAllRolesFromAddress` você vai ver que a única pessoa que tem a função de cunhagem é o contrato de votação!

Agora nós estamos livre de um possível "roubo" vindo de admins :).

### 👍 Lide com erro de network não suportada.

Primeiramente, você precisa importar o tipo `UnsupportedChainIdError` no topo de `App.jsx` para poder reconhecer uma conexão de fora da rede Rinkeby. Adicione a linha abaixo dos seus outros imports.

```jsx
import { UnsupportedChainIdError } from "@web3-react/core";
```

Depois, adicione o trecho a seguir no seu arquivo `App.jsx` logo abaixo do último `useEffect`.

```jsx
if (error instanceof UnsupportedChainIdError ) {
  return (
    <div className="unsupported-network">
      <h2>Please connect to Rinkeby</h2>
      <p>
        This dapp only works on the Rinkeby network, please switch networks
        in your connected wallet.
      </p>
    </div>
  );
}
```

Bem simples! Mas bem útil. Uma mensagem vai ser mostrada se o usuário não estiver na rede Rinkeby!

### 🤑 Veja o seu token na Uniswap.

Você pode estar se perguntando como tokens como [ENS DAO](https://coinmarketcap.com/currencies/ethereum-name-service/) ou o mais recente [Constitution DAO](https://coinmarketcap.com/currencies/constitutiondao/) tem tokens de governança que valem dinheiro de verdade. Bem, Basicamente, é porque outras pessoas podem de fato comprar seus tokens de governança diretamente em exchanges decentralizadas como Uniswap.

Por exemplo — talvez uma pessoa aleatória acorde e diga, “Ei, eu te dou $100 por 100 $HOKAGE por que eu quero me juntar à NarutoDAO e ter algum poder de governança”. Bem, isso significa que $HOKAGE tem valor real agora. Isso significa que 1 $HOKAGE = 1 Us Dollar. E uma vez que existem 1.000.000 $HOKAGE, isso significa que o valor de mercado totalmente diluído do meu token valeria $1.000.000.

Bem louco, certo :)?

Pessoas geralmente fazem trocas como essas na Uniswap.

Acredite ou não, seu token agora vai aparecer na Uniswap dentro da Rinkeby.

Aqui está um vídeo rápido para você fazer você mesmo: 

[REVIEW](https://www.loom.com/share/8c235f0c5d974c978e5dbd564bbca59d)

Você pode ler mais sobre liquidity pools [aqui](https://docs.uniswap.org/protocol/V2/concepts/core-concepts/pools). Você vai notar no vídeo que não existia uma para $HOKAGE. Mas, tecnicamente qualquer pessoa poderia vir e criar uma pool que permite pessoas trocarem $ETH por $HOKAGE. Essa pool poderia ter $100. Ou, poderia ter $1.000.000.000. Depende de quão popular meu token é!

### 🎨 Personalize um pouco seu web app!

Tire algum tempo para personalizar seu web app um pouco. Mude algumas cores. Mude os textos. Adicione alguns emojis legais. Vá para `public/index.html` e mude coisas como o título e a descrição!

Ideia aleatória: quando as pessoas estão votando, toque o hino do país ou algo do tipo lolol.

Tire algum tempo aqui antes de seguir em frente para fazer essas páginas suas. Mesmo que tudo que você faça seja mudar a cor do background está tudo bem. Se divirta com isso.

### 🚨 Relatório de Progresso

*Por favor faça isso ou Yan vai ficar triste :(.*

Vá em frente e poste uma captura de tela em `#progresso` do seu DAO dashboard depois de algumas customizações!
