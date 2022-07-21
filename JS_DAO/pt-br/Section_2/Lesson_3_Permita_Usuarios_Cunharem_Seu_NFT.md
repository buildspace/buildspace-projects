Vamos para `App.jsx`. O que nós vamos fazer agora é

1) Se detectarmos que o usuário tem um NFT de filiação, mostramos para ele nossa tela de "DAO dashboard" onde ele pode votar nas propostas e ver informações relacionadas a DAO.

2) Se detectarmos que o usuário não tem nosso NFT, vamos mostrar o botão para ele cunhar um.

Vamos fazer isso! Vamos atacar o caso #1 primeiro, precisamos detectar se o usuário tem nosso NFT.

### 🤔 Checando se o usuário tem um NFT de filiação.

Vá para `App.jsx`. Adicione no topo:

```jsx
import { ThirdwebSDK } from "@3rdweb/sdk";
```

A partir daí, aqui está o que vamos adicionar:

```jsx
// Nós instaciamos o SDK na rede Rinkeby.
const sdk = new ThirdwebSDK("rinkeby");

// Nós podemos pegar uma referência para o nosso contrato ERC-1155.
const bundleDropModule = sdk.getBundleDropModule(
  "INSIRA_O_ENDEREÇO_DO_BUNDLE_DROP",
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  // Variável de estado para sabermos se o usuário tem nosso NFT.
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);

  useEffect(() => {
    // Se ele não tiver uma carteira conectada, saia!
    if (!address) {
      return;
    }
    
    // Veja se o usuário tem o NFT usando bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // Se o saldo for maior do que 0, ele tem nosso NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  // ... inclua todo o seu outro código que já estava abaixo.
```

Nós dizemos para o thirdweb que nós queremos estar na Rinkeby apenas usando `new ThirdwebSDK("rinkeby")`. Então, nós criamos o `bundleDropModule` e tudo o que nós precisamos é do endereço do nosso contrato ERC-1155! Quando fazemos isso, o thirdweb nos dá um pequeno objeto que podemos facilmente usar para interagir com o nosso contrato.

A partir daí, nós usamos `bundleDropModule.balanceOf(address, "0")` para checar se o usuário tem o nosso NFT. Isso vai na verdade requisitar os dados ao nosso contrato que está na blockchain. Por que nós usamos `0`? Bem, se você se lembra o `0` é o tokenId do nosso NFT de filiação. Então aqui estamos perguntando ao nosso contrato, "Ei, esse usuário é dono de um token com o id 0?".

Quando você atualizar a página, verá algo como isso aqui:

![Untitled](https://i.imgur.com/m6e1sJb.png)

Perfeito! Nós recebemos "esse usuário não tem um NFT de filiação". Vamos criar um botão que permite o usuário cunhar um.

### ✨ Construa um botão "Mint NFT".

Vamos fazer isso! Volte para `App.jsx`. Eu coloquei alguns comentários nas linhas que eu adicionei:

```javascript
import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
  "INSIRA_O_ENDEREÇO_DO_BUNDLE_DROP",
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)

  // O assinante é necessário para assinar transações na blockchain.
  // Sem isso não podemos escrever dados, apenas lê-los.
  const signer = provider ? provider.getSigner() : undefined;

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming nos permite manter facilmente um estado de carregamento enquanto o NFT é cunhado.
  const [isClaiming, setIsClaiming] = useState(false);

  // Outro useEffect!
  useEffect(() => {
    // Nós passamos o assinante para o sdk, que nos permite interagir
    // como nosso contrato!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    if (!address) {
      return;
    }
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("🌟 this user has a membership NFT!")
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.")
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to NarutoDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  const mintNft = () => {
    setIsClaiming(true);
    // Chama bundleDropModule.claim("0", 1) para cunhar o NFT para a carteira do usuário.
    bundleDropModule
    .claim("0", 1)
    .then(() => {
      // Configura o estado de reivindicação.
      setHasClaimedNFT(true);
      // Mostre para o usuário seu novo NFT!
      console.log(
        `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
      );
    })
    .catch((err) => {
      console.error("failed to claim", err);
    })
    .finally(() => {
      // Pare o estado de carregamento.
      setIsClaiming(false);
    });
  }

  // Renderiza a tela de cunhagem do NFT.
  return (
    <div className="mint-nft">
      <h1>Mint your free 🍪DAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;
```

Okay, um monte de coisas acontecendo! A primeira coisa que fazemos é configurar nosso `signer` que é o que precisamos para de fato mandar transações em favor de um usuário. Veja mais [aqui](https://docs.ethers.io/v5/api/signer/). A partir daí, nós chamamos `bundleDropModule.claim("0", 1)` para de fato cunhar o NFT na carteira do usuário quando ele clicar no botão. Nesse caso o tokenId do nosso NFT de filiação é `0` então nós passamos 0. Depois, passamos `1` porque só queremos cunhar um NFT de filiação para a carteira do usuário!

Quando tudo está pronto, nós fazemos `setIsClaiming(false)` para parar o estado de carregamento. E depois fazemos `setHasClaimedNFT(true)` para que o nosso app react possa saber que essa usuário reivindicou seu NFT com sucesso.

Quando você de fato vai cunhar o NFT, a Metamask vai mostrar um pop-up para que você pague a taxa de transação. Uma vez que a cunhagem foi feita, você deve ver `Successfully Minted!` no seu console junto com o link para o Opensea Testnet. Em [`testnets.opensea.io`](http://testnets.opensea.io/) nós podemos de fato ver os NFTs cunhados na testnet, o que é bem legal! Quando você for para o seu link, você verá algo tipo assim:

![Untitled](https://i.imgur.com/PjjDSxd.png)

Legal! Aqui você consegue ver que meu NFT tem 6 donos. Você também verá que diz "Você tem 1" o que é o que você verá do seu lado desde que você tenha cunhado seu NFT!

![Untitled](https://i.imgur.com/fdn9Qs4.png)

Isso é por que eu pedi para alguns amigos meus cunharem esse NFT para mim como um teste. Novamente, porque é um ERC-1155 **todo mundo é dono do mesmo NFT**. Isso é bem legal e é também mais eficiente em termos de taxas. Cunhar um ERC721 custa 96,073 gas. Cunhar um ERC1155 custa 51,935 gas. Por que? Porque todo mundo está compartilhando os mesmos dados do NFT. Nós não precisamos copiar novos dados para cada usuários.

### 🛑 Mostre o seu Dashboard apenas se o usuário tiver o NFT.

Okay, se você se lembra nós temos que lidar com dois casos:

1) Se detectarmos que o usuário tem um NFT de filiação, mostramos para ele nossa tela de "DAO dashboard" onde ele pode votar nas propostas e ver informações relacionadas a DAO.

2) Se detectarmos que o usuário não tem nosso NFT, vamos mostrar o botão para ele cunhar um.

Isso é bem fácil. Tudo que precisamos fazer é adicionar o código abaixo em `App.jsx`

```jsx
if (!address) {
  return (
    <div className="landing">
      <h1>Welcome to NarutoDAO</h1>
      <button onClick={() => connectWallet("injected")} className="btn-hero">
        Connect your wallet
      </button>
    </div>
  );
}

// Adicione esse pedacinho!
if (hasClaimedNFT) {
  return (
    <div className="member-page">
      <h1>🍪DAO Member Page</h1>
      <p>Congratulations on being a member</p>
    </div>
  );
};
```

É isto! Agora, quando você atualizar a página você vai ver que você está na página de membros da DAO. Sim!!! Se você desconectar sua carteira do web app, você será redirecionado para a página de "Connect Wallet".

Finalmente, se você conectar sua carteira e **não** tiver seu NFT de filiação, vai ser mostrado o botão para você cunhar um. Eu recomendo que você teste esse caso:

1) **desconecte** sua carteira do web app

2) [crie uma nova conta](https://metamask.zendesk.com/hc/en-us/articles/360015289452-How-to-create-an-additional-account-in-your-MetaMask-wallet) 

O que vai te dar um novo endereço público para que você tenha outro endereço para receber o NFT. A Metamask permite que você tenha quantas contas você quiser.

Certifique-se de testar todos os casos!

1) Carteira desconectada:

![Untitled](https://i.imgur.com/wIWqk4L.png)

2) Carteira conectada, mas o usuário não tem o NFT de filiação:

![Untitled](https://i.imgur.com/4y06Gvb.png)

3) Usuário tem o NFT de filiação, então mostre a ela a página que apenas membros da DAO podem ver:

![Untitled](https://i.imgur.com/SVy3Yne.png)

### 🚨 Relatório de Progresso

*Por favor faça isso ou Farza vai ficar triste :(.*

Vá em frente e compartilhe uma screenshot do seu NFT de filiação no OpenSea em `#progress`.