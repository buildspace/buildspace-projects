Estamos avançando por aqui! Neste ponto, temos: configuramos nosso aplicativo React, criamos um botão conecte sua carteira, configuramos alguma renderização condicional com base no estado da carteira Solana do usuário.

Em nosso Portal de GIFs, queremos mostrar os GIFs que as pessoas enviam ao nosso aplicativo!

Só precisamos construir a interface do usuário para lidar com isso. Como ainda não escrevemos nosso programa Solana, usaremos dados de teste para garantir que as coisas funcionem conforme o esperado. Então tudo o que precisamos fazer é chamar o programa mais tarde pelo nosso aplicativo (mais sobre isso em breve).

### 🧪 Exibindo dados de teste

Para começar, devemos falar sobre quando queremos que nossa grade de GIFs seja renderizada. Se você pensar nisso, a única vez que nossa grade de GIFs será renderizada é **quando o usuário se conectou + autorizou sua carteira ao nosso aplicativo.**

Isso é bem direto! Então vamos começar fazendo alguns dados de teste para eliminar essa primeira condição. Novamente, atualizaremos isso mais tarde no projeto para usar os dados em seu programa Solana em vez do frontend.

Fique comigo aqui!

No topo do seu arquivo em `App.js` vá em frente e crie uma propriedade chamada `TEST_GIFS` . Nesta propriedade, você a preencherá com alguns de seus GIFs favoritos!

Vou criar um tema em torno do meu: **[Squid Game](https://en.wikipedia.org/wiki/Squid_Game) 🦑.**

```javascript
const TEST_GIFS = [
  "https://i.giphy.com/media/eIG0HfouRQJQr1wBzz/giphy.webp",
  "https://media3.giphy.com/media/L71a8LW2UrKwPaWNYM/giphy.gif?cid=ecf05e47rr9qizx2msjucl1xyvuu47d7kf25tqt2lvo024uo&rid=giphy.gif&ct=g",
  "https://media4.giphy.com/media/AeFmQjHMtEySooOc8K/giphy.gif?cid=ecf05e47qdzhdma2y3ugn32lkgi972z9mpfzocjj6z1ro4ec&rid=giphy.gif&ct=g",
  "https://i.giphy.com/media/PAqjdPkJLDsmBRSYUp/giphy.webp",
];
```

Este é o seu momento de se divertir. Adicione quantos GIFs à sua lista de teste e faça com o tema que você quiser.

Talvez você queira que seu site seja apenas GIFs com temas de anime. Talvez você queira que sejam apenas GIFs com temas de filmes. Talvez você queira apenas GIFs com temas de videogame.

**Altere o título e a descrição do seu site para corresponder ao tipo de GIFs que você deseja que as pessoas enviem.**

```jsx
// Mude isso. Faça isso com o tema que você se interessar.
// Ex. memes, musica, games, animais fofinhos, qualquer coisa!
<p className="header">🖼 GIF Portal</p>
<p className="sub-text">
  Veja sua coleção de GIF no metaverso ✨
</p>
```

Eu sei que parece bobo, mas essas pequenas mudanças realmente tornarão seu site um pouco mais divertido. E isso pode motivá-lo a terminá-lo até o fim.

ÓTIMO. Temos alguns GIFs legais para testar nosso aplicativo agora. Então, como vamos realmente exibir esses dados? Lembra quando escrevemos aquela função `renderNotConnectedContainer`? Vamos usar a mesma abordagem desta vez, mas renderizar nossa grade de GIFs!

Vamos começar criando uma nova função chamada `renderConnectedContainer` logo abaixo do `renderNotConnectedContainer`. Isso terá um código de interface do usuário simples que mapeará todos os nossos links GIF e os renderizará:

```jsx
const renderConnectedContainer = () => (
  <div className="connected-container">
    <div className="gif-grid">
      {TEST_GIFS.map((gif) => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);
```

Estamos quase lá! Você provavelmente salvou seu arquivo e ainda não viu nada aparecer no seu aplicativo! Lembre-se - esses métodos de renderização precisam ser **chamados** para serem executados! Vamos descer para onde adicionamos `{!walletAddress && renderNotConnectedContainer()}`.

Se quisermos que isso seja exibido apenas quando o usuário estiver conectado ao nosso aplicativo, qual propriedade podemos usar para decidir isso? Provavelmente o `walletAddress` certo? Se tivermos um `walletAddress`, isso deve significar que temos uma carteira conectada! Ótimo.

Então, logo abaixo de onde você chamou o `renderNotConnectedContainer`, vamos em frente e adicione isso:

```javascript
return (
  <div className="App">
    <div className="container">
      <div className="header-container">
        <p className="header">🖼 GIF Portal</p>
        <p className="sub-text">Veja sua coleção de GIF no metaverso ✨</p>
        {!walletAddress && renderNotConnectedContainer()}
        {/* Precisamos apenas adicionar o inverso aqui! */}
        {walletAddress && renderConnectedContainer()}
      </div>
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`feito por @${TWITTER_HANDLE}`}</a>
      </div>
    </div>
  </div>
);
```

**_AGORA,_** se você salvar seu arquivo com essas alterações, verá todos os seus lindos GIFs aparecerem 😮.

_Observação: se você estiver com uma conexão de internet lenta, os GIFs podem demorar um pouco para carregar._

Você pode ver que tudo parece "funcionar". Eu forneci alguns estilos para este aplicativo, em `App.css`, para que você não tenha que se preocupar muito em obter essa configuração.

Neste ponto, você deve fazer algumas alterações neste arquivo! É aqui que todo o seu estilo vai viver. Achei que esse tipo de formato ficaria legal, mas você pode ter outra configuração ainda melhor!

![https://i.imgur.com/PtpFGIa.png](https://i.imgur.com/PtpFGIa.png)

Por exemplo, se o seu aplicativo da web é um lugar onde as pessoas enviam GIFs de animais fofos, talvez a sensação do modo escuro do site agora não orne! Você decide. Altere-o como quiser.

### 🔤 Criando uma caixa para inserir GIF

**Nosso aplicativo está tomando forma - e estamos a cerca de 10 minutos de começar a escrever nosso primeiro programa Solana que alimentará nosso aplicativo da web aqui com dados reais em vez de dados de teste forçados.**

Tome um momento para olhar para a magia que você criou :).

São coisas que **MILHÕES** de pessoas no mundo gostariam de saber como fazer. A maioria das pessoas está apenas falando sobre essas coisas no Twitter. Mas, você está realmente tomando as medidas para fazê-lo. Loucos adereços para você meu amigo.

É hora de pensarmos em como outras pessoas podem adicionar seus próprios GIFs ao nosso aplicativo. Nós vamos ter uma abordagem de entrada aqui. Quando alguém visitar seu aplicativo, poderá adicionar um link ao seu GIF favorito, que chamará nosso programa Solana para lidar com o resto! Por enquanto, vamos configurar a entrada e a ação que serão chamadas aqui.

Vamos começar com a entrada. Queremos que essa caixa de entrada seja exibida apenas quando o usuário conectar sua carteira ao nosso aplicativo. Então, isso significa que vamos querer adicionar este código ao nosso método de renderização `renderConnectedContainer`:

```jsx
const renderConnectedContainer = () => (
  <div className="connected-container">
    {/* Vá em frente e adicione esse 'input' e esse 'button' para iniciar */}
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <input type="text" placeholder="Entre com o link do gif!" />
      <button type="submit" className="cta-button submit-gif-button">
        Submit
      </button>
    </form>
    <div className="gif-grid">
      {TEST_GIFS.map((gif) => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);
```

As principais coisas que adicionamos aqui são uma caixa `input` e um `button` de envio .

Você pode escrever nesta caixa de texto e clicar no botão ou pressionar enter, mas você notará que nada acontece! Ainda precisamos escrever a lógica e conectá-la ao envio do formulário.

Para isso, vamos usar alguns novos atributos interessantes.

`onChange` é uma função que é acionada toda vez que o valor da caixa de entrada muda. Novamente, se você já é um React Pro - você pode pular essas coisas.

Para que isso funcione corretamente, precisaremos criar uma nova propriedade de estado chamada `inputValue` . Vamos começar por aí -

Logo abaixo de `const [walletAddress, setWalletAddress] = useState(null);` adicione isto:

```javascript
const [inputValue, setInputValue] = useState("");
```

Psh - FÁCIL. Agora só precisamos conectar isso ao nosso elemento de 'input'! Vá até o seu elemento `input` e altere-o para ficar assim:

```jsx
<input
  type="text"
  placeholder="Entre com o link do gif!"
  value={inputValue}
  onChange={onInputChange}
/>
```

Você provavelmente terá um erro aqui que diz `onInputChange is not defined.` e `inputValue is not defined.` Bem, isso é uma correção fácil, vamos apenas defini-los!

Logo abaixo da sua função `connectWallet` adicione isto:

```javascript
const onInputChange = (event) => {
  const { value } = event.target;
  setInputValue(value);
};
```

Esta função super simples será acionada enquanto você digita na caixa de texto e, em seguida, define o valor dela para nossa propriedade `inputValue`. Dessa forma, quando estivermos prontos para enviar nosso link GIF para nosso programa Solana, podemos acessar facilmente essa propriedade para obter o valor.

Finalmente — vamos conectar o envio do formulário. Crie uma nova função na ação `connectWallet` chamada `sendGif`:

```javascript
const sendGif = async () => {
  if (inputValue.length > 0) {
    console.log("Gif link:", inputValue);
  } else {
    console.log("Input vazio. Tente novamente.");
  }
};
```

Em primeiro lugar, estamos tornando esta função `async` para mais tarde quando terminarmos de adicionar nossa interação com nosso programa Solana.

Então, simplesmente, verificamos se há algum valor de entrada em nossa caixa de entrada. Se houver imprima o link GIF, senão imprima que está vazio. Novamente, iremos revisitar esta função mais tarde para a implementação completa :).

**_ EITA _**. Então vá em frente e adicione um link GIF à sua caixa de texto e abra seu console! Depois de pressionar o botão enviar, você deverá ver o `Link GIF: YOUR_GIF_LINK`.

Espere um segundo, nada aconteceu?

Isso porque ainda precisamos chamar esse método no atributo `onSubmit` em nosso formulário! Fácil. Basta atualizar o manipulador `onSubmit` para chamar nosso novo método `sendGif`.

```jsx
<form
  onSubmit={(event) => {
    event.preventDefault();
    sendGif();
  }}
>
```

Tente novamente e agora você deve ver seu link impresso no console!

### 🌈 Defina os dados do GIF no estado

Antes de passarmos para a parte Solana disso, precisamos configurar apenas mais uma coisa... na verdade, buscar nossos dados no carregamento! Agora, nós apenas renderizamos cegamente `TEST_GIFS`.

O fluxo ficará mais ou menos assim:

1. Abra o aplicativo da web.
2. Conecte a carteira.
3. Busque a lista de GIFs do nosso programa Solana assim que a carteira estiver conectada.

Como temos essa configuração de dados de teste, podemos simular facilmente essa busca para que seja apenas plug and play quando estivermos prontos para chamar nosso programa!

**Estamos fazendo muita configuração aqui. Por quê? Porque valerá a pena mais tarde não se preocupar com essas coisas.** Solana não é muito fácil, especialmente se você é novo no Rust. Então, é melhor configurar coisas idiotas de interface do usuário agora que podemos nos concentrar totalmente em nosso programa Solana depois.

Legal vamos fazer isso. Vamos manter nossa lista de GIFs em uma propriedade de estado em nosso componente.

Então, vamos começar criando esta propriedade de estado logo abaixo de nossa declaração `walletAddress`:

```javascript
// State
const [walletAddress, setWalletAddress] = useState(null);
const [inputValue, setInputValue] = useState("");
const [gifList, setGifList] = useState([]);
```

Então precisamos ir em frente e configurar outro `useEffect` que será chamado quando nosso estado `walletAddress` mudar. Lembre-se, só queremos buscar nossa lista de GIFs quando um usuário conectou sua carteira ao nosso aplicativo.

Logo abaixo do seu `useEffect` atual **crie outro** `useEffect`.

```jsx
useEffect(() => {
  const onLoad = async () => {
    await checkIfWalletIsConnected();
  };
  window.addEventListener("load", onLoad);
  return () => window.removeEventListener("load", onLoad);
}, []);

useEffect(() => {
  if (walletAddress) {
    console.log("Obtendo lista de GIFs...");

    // Chama o programa da Solana aqui.

    // Define o estado
    setGifList(TEST_GIFS);
  }
}, [walletAddress]);
```

Tudo o que estamos dizendo aqui é se tivermos um `walletAddress`, vá em frente e execute nossa lógica de busca. No momento, vamos apenas definir nossos dados de teste, pois ainda não configuramos a interação com nosso programa!

Então, uma vez que nossos dados de teste estejam definidos, queremos usá-los! Para isso, vamos voltar para a função `renderConnectedContainer` e fazer uma alteração de uma linha:

```jsx
const renderConnectedContainer = () => (
  <div className="connected-container">
    <form
      onSubmit={(event) => {
        event.preventDefault();
        sendGif();
      }}
    >
      <input
        type="text"
        placeholder="Entre com o link do gif!!"
        value={inputValue}
        onChange={onInputChange}
      />
      <button type="submit" className="cta-button submit-gif-button">
        Submit
      </button>
    </form>
    <div className="gif-grid">
      {/* Map através da 'gifList' ao invés da 'TEST_GIFS' */}
      {gifList.map((gif) => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))}
    </div>
  </div>
);
```

Agora vamos adicionar algumas linhas a sendGif() para que, quando você enviar o formulário, ele adicione o GIF à gifList e limpe o campo de texto:

```javascript
const sendGif = async () => {
  if (inputValue.length > 0) {
    console.log("Gif link:", inputValue);
    setGifList([...gifList, inputValue]);
    setInputValue("");
  } else {
    console.log("Input vazio. Tente novamente.");
  }
};
```

É tão fácil. Agora, quando mudarmos nosso `useEffect` para buscar a lista de GIFs do nosso programa Solana, teremos tudo pronto para ser renderizado!

**Esta é a base do nosso aplicativo web! ÉPICO.**

Agora é hora de começarmos a construir coisas em nosso programa Solana. Voltaremos ao React de vez em quando para executar alguns testes e configurar as peças finais do nosso aplicativo descentralizado 🌌

### 🚨 Relatório de progresso

_Faça isso senão Farza vai ficar triste :(_

Poste uma captura de tela do seu épico GIF Grid para que todos vejam em `#progress` :).
