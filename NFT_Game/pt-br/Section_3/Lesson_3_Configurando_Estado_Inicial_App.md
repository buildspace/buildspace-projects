Agora que temos acesso ao endereço da carteira, nós podemos começar a mintar personagens NFT a partir do nosso contrato!

Essa seção vai te ajudar a entender como vamos renderizar cada estado do nosso app. Vamos quebrar a lógica em partes rapidamente:

1. Se o usuário não tiver se conectado ao app - **Mostre o botão de conectar a carteira.**

2. Se o usuário conectou com o app **E** não tem uma NFT - **Mostre o componente `SelectCharacter`.**

3. Se o usuário conectou com o app E tem um personagem NFT - **Mostre o componente `Arena`.** A `Arena` é onde os usuários vão poder atacar nosso boss!

Boa. Parece que nós temos três visões diferentes que precisamos criar! Nós vamos ver algumas coisas bem legais de React.js que podem ser novas pra você. Se você não entende isso completamente - **não se preocupe**! Faça algumas pesquisas e lembre-se o Google é seu amigo :).

### 🧱 Configurando o componente SelectCharacter.

Vamos começar criando nosso componente `SelectCharacter`! Vá para a pasta `src/Components/SelectCharacter` e crie um novo arquivo chamado `index.js`. Esse diretório terá a nossa lógica principal para o nosso componente `SelectCharacter` e seu estilo! Você deve ver um arquivo `SelectCharacter.css` com várias estilizações!

Ah, uma coisa para notar - você provavelmente vai ver o componente `LoadingIndicator` na pasta `Components`. Não se preocupe com isso agora, vamos ver isso depois.

Agora que temos nossa estrutura de pastas configuradas, vamos adicionar a lógica base para um componente. Comece criando um novo arquivo chamado `index.js` na sua pasta nova `SelectCharacter`. Nessa pasta, vá em frente e adicione o seguinte código.

```javascript
import React, { useEffect, useState } from "react";
import "./SelectCharacter.css";

/*
 * Não se preocupe com setCharacterNFT ainda, vamos falar dele logo.
 */
const SelectCharacter = ({ setCharacterNFT }) => {
  return (
    <div className="select-character-container">
      <h2>Mint seu Herói. Escolha com sabedoria.</h2>
    </div>
  );
};

export default SelectCharacter;
```

Muito bom! Viu como foi fácil? Você já tem um componente pronto! Vamos em frente e configurar nossa renderização condicional para que possamos ver essa coisa.

### 👁 Mostrando o componente SelectCharacter.

Nós vamos precisar voltar para `App.js` e importar nosso novo componente. Logo abaixo de onde você importou `App.css`, adicione essa linha:

```javascript
import SelectCharacter from "./Components/SelectCharacter";
```

Agora você tem acesso ao nosso novo componente! Precisamos adicionar algumas coisas mais chiques aqui para conseguir que o nosso arquivo renderize. Vamos dar uma olhada na lógica que estamos tentando para a conta de novo:

Se o usuário conectou com o app **E** não tem uma NFT - **Mostre o componente `SelectCharacter`.**

Nós estamos segurando o estado para se alguém conectou a carteira ou não, mas não temos nada configurado para saber se alguém mintou um personagem NFT!

Nós vamos começar criando uma função de renderização chamada: `renderContent`. Isso vai cuidar de toda a lógica do que vamos renderizar. Vamos começar adicionando essa nova função bem abaixo de onde declaramos `checkIfWalletIsConnected`:

```javascript
// Métodos de renderização
const renderContent = () => {};
```

Bom. Agora que temos isso configurado, vamos começar adicionando nossa lógica para dois cenários que estamos prontos para lidar:

1. Se o usuário não tiver se conectado ao app - **Mostre o botão de conectar a carteira.**

2. Se o usuário conectou com o app **E** não tem uma NFT - **Mostre o componente `SelectCharacter`.**

```javascript
// Métodos de renderização
const renderContent = () => {
  /*
   * cenário #1
   */
  if (!currentAccount) {
    return (
      <div className="connect-wallet-container">
        <img
          src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
          alt="Monty Python Gif"
        />
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWalletAction}
        >
          Conecte sua carteira para começar
        </button>
      </div>
    );
    /*
     * cenário #2
     */
  } else if (currentAccount && !characterNFT) {
    return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
  }
};
```

Opa 😅. Seu app está provavelmente gritando para você que `characterNFT` e `setCharacterNFT` são `undefined`. Se você pensar sobre isso, nós nunca configuramos nenhuma variável de estado para isso! Isso é bem fácil de arrumar - só adicione outra variável de estado em `App.js`:

```javascript
// Estado
const [currentAccount, setCurrentAccount] = useState(null);

/*
 * Logo abaixo da conta, configure essa propriedade de novo estado.
 */
const [characterNFT, setCharacterNFT] = useState(null);
```

**_Muito BOM._** Nós estamos bem perto. Mais uma coisa para colocar isso pra funcionar perfeitamente - **chamar o método de renderização!** Isso é tão simples quando recolocar o nosso botão no HTML com nosso método de renderização. Deve parecer com isso:

```javascript
return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header gradient-text">⚔️ Metaverso Slayer ⚔️</p>
        <p className="sub-text">Team up to protect the Metaverse!</p>
        {/*
         * Aqui é onde nosso botão e código de imagem ficava! Lembre-se que movemos para o método de renderização.
         */}
        {renderContent()}
      </div>
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built with @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  </div>
);
```

Nota: Lembre-se de importar SelectCharacter adicionando essa linha ao início do seu arquivo:

`import SelectCharacter from './Components/SelectCharacter';`

### 🥵 Tenha certeza que tudo está funcionando!

Nós fizemos muita coisa! Nesse ponto, vamos ter certeza que os métodos estão funcionando:

**Cenário #1**

O primeirio cenário é que o usuário não tenha conectado a sua carteira ao nosso app - então mostre o botão de conectar carteira!

Nota: tenha certeza que sua carteira não está conectado ao app por um projeto antigo. Para fazer isso, clique na extensão do Metamask e clique nos três pontos na direita. Você deve ver algo como "Sites Conectados". Vá em frente e clique nisso. Você deve ver `[localhost:3000](http://localhost:3000)` com um ícone de lata de lixo do lado. Clique no ícone para remover a conexão da sua carteira do seu app.

![Untitled](https://i.imgur.com/zPAVBYb.png)

Vá em frente e recarregue a página e você deve ver um botão "Connect To Wallet" pronto! Vá em frente e conecte! Uma vez que fizer isso, seu console deve escrever a palavra `Connected` e o seu endereço público da carteira!

![Untitled](https://i.imgur.com/LvoDEBK.png)

Boa - Cenário #1 **FOI**.

**Cenário #2**

Vá em frente e conecte sua carteira! Uma vez que sua carteira estiver conectada, você deve ver seu app renderizando alguma coisa que parece com isso:

![Untitled](https://i.imgur.com/K3kvxeE.png)

**BOOM.** Bom trabalho! Você acabou de criar um componente em React, configurou uma condição de renderização, **_e_** configurou o seu Login de carteira, pronto e funcionando! Com os projetos da WEB3DEV, é tudo sobre fazer o próprio projeto. Sinta-se livre para fazer o que quiser com essas páginas!

Na próxima seção vamos começar a interagir com o nosso contrato e ver se o endereço da carteira conectada já mintou um personagem NFT. Isso vai desbloquear que façamos o seguinte:

1. Escreva a lógica para mintar o personagem NFT.
2. Configure o componente `Arena` para que possamos derrubar o boss na nossa maneira 😈.