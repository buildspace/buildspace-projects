### 🛍 Renderizando o botão de conexão à carteira

**Só queremos que nosso botão "Conectar à carteira" seja renderizado quando nosso usuário não tiver realmente conectado sua carteira ao aplicativo.**

Então, por que não buscamos as informações da carteira diretamente da biblioteca do adaptador de carteira que instalamos? **Assim** também podemos usar isso como sinalizador para determinar se devemos mostrar ou ocultar nosso botão.

Primeiro você precisará importar `useWallet` para o seu componente assim:

```jsx
import { useWallet } from "@solana/wallet-adapter-react";
```
Muito bem. Agora que estamos prontos para buscar as informações da carteira, vamos atualizar algumas coisas em nosso código aqui:

```jsx
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// Constantes
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const Home = () => {
    const wallet = useWallet();
    // Ações
    const renderNotConnectedContainer = () => (
        <div>
            <img src="https://media.giphy.com/media/eSwGh3YK54JKU/giphy.gif" alt="emoji" />

            <div className="button-container">
                <WalletMultiButton className="cta-button connect-wallet-button" />
            </div>
        </div>
    );

    return (
        <div className="App">
            <div className="container">
                <div className="header-container">
                    <p className="header">🍭 Candy Drop</p>
                    <p className="sub-text">Máquina de NFTs com cunhagem justa</p>
                    {/* Renderize seu botão conectar à carteira aqui */}
                    {wallet.publicKey ? "Hello World" : renderNotConnectedContainer()}
                </div>

                <div className="footer-container">
                    <img alt="Twitter Logo" className="twitter-logo" src="twitter-logo.svg" />
                    <a className="footer-text" href={TWITTER_LINK} target="_blank" rel="noreferrer">{`Construído no @${TWITTER_HANDLE}`}</a>
                </div>
            </div>
        </div>
    );
};

export default Home;

```
Vamos dar uma olhada nas mudanças bem rapidamente:

```jsx
const wallet = useWallet();
```

Acho que isso é bem autoexplicativo. `useWallet` é um gancho personalizado fornecido por `@solana/wallet-adapter-react`. Acabamos de conectar nossa Phantom Wallet e agora recebemos os dados da carteira do usuário. Agora que temos isso, podemos usar um operador ternário para fazer renderização condicional. Você pode aprender mais sobre o operador ternário [aqui](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator).

```jsx
{/* Adicione a condição para mostrar isso apenas se não tivermos um endereço de carteira */}
{wallet.publicKey ? "Hello World" : renderNotConnectedContainer()}
```
Aqui, estamos dizendo ao React para renderizar o `Hello World` apenas se tivermos uma `publicKey` disponível. Portanto, se não houver `publicKey`, isso significa que um usuário não conectou sua carteira e devemos mostrar a ele o botão para conectar sua carteira.

Vá em frente, atualize sua página e pressione o botão Selecionar carteira! Se tudo funcionar, você finalmente verá a extensão Phantom Wallet aparecer assim:

![Untitled](https://i.imgur.com/wXQyWEe.png)

Depois de pressionar em conectar, seu botão deve desaparecer! ISSO É EXCELENTE!!

**Você acabou de conectar uma carteira Solana ao seu aplicativo. Isso é muito irado!**

Demos passos bem grandes aqui! Você tem sua configuração básica de interface do usuário e pode facilmente "autenticar" um usuário com sua carteira Solana. Fácil.

Em seguida, vamos configurar as funções que precisamos para chamar nosso programa Solana + obter alguns dados. Nosso app para a web por enquanto está meio chato/vazio! Vamos mudar isso :).

*Nota: Nas configurações da carteira Phantom (que você pode acessar clicando na engrenagem no canto inferior direito), você verá uma seção "Aplicativos confiáveis". Aqui, você verá seu URL do Replit, ou `localhost:3000` se estiver executando seu aplicativo localmente. Sinta-se à vontade para **revogar** isso se quiser testar o caso de alguém que nunca esteve conectado antes acessar seu site. Ele basicamente redefinirá o acesso de suas carteiras ao site e mostrará o botão "Conectar à carteira" novamente.*

### 🚨 Relatório de progresso

Por favor, faça isso, senão o Farza vai ficar triste :(

Publique em `#progress` uma captura de tela do seu console exibindo sua chave pública! Não se preocupe, é seguro compartilhar a chave pública :).
