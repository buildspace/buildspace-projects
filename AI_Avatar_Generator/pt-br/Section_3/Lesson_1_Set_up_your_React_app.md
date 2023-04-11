Neste ponto, você treinou o seu próprio modelo do Dreambooth. Isso é **incrível**. Você já está fazendo o que 98% do mundo não tem ideia de como fazer. Espero que você tenha combinado isso com suas habilidades lendárias de engenharia de prompts para obter algumas imagens como esta:

![https://hackmd.io/_uploads/SJfjrpNqj.png](https://hackmd.io/_uploads/SJfjrpNqj.png)

Agora, vamos ainda mais longe, criando um aplicativo web que usa este modelo! Como falamos anteriormente, seu aplicativo web será capaz de gerar um avatar seu a partir de qualquer navegador web. E mais importante, você poderá enviar isso para seus amigos e eles poderão criar algumas imagens com base em seu modelo personalizado. Espero que você tenha bons amigos rs.

A beleza disso é que você não precisa usar um rosto humano (até rostos de alienígenas contam rs). Mas falando sério, você pode treinar um modelo de uma árvore, uma ponte, ou até mesmo sua guitarra. É incrível ver o que você pode trabalhar aqui, para ser honesto.

### Obtenha o código inicial

Vamos começar com o fork (bifurcação) do repositório inicial. Vamos fazer isso para podermos usar uma ferramenta chamada [railway](https://railway.app/), para implantar facilmente o aplicativo de geração de imagens para o mundo! [Clique aqui para bifurcar o repositório](https://github.com/buildspace/ai-avatar-starter/fork). 

Vá em frente e clone seu novo fork, abra a pasta em seu editor de texto favorito (eu estou usando o VS Code) e execute o comando `npm i`. Em seguida, você estará pronto para iniciar o projeto executando `npm run dev`.

Se tudo funcionou, você deve ser capaz de navegar até [localhost:3000](http://localhost:3000) em seu navegador favorito e ver:

![https://hackmd.io/_uploads/H17PFTEqj.png](https://hackmd.io/_uploads/H17PFTEqj.png)

Muito bem! Vamos trabalhar com o `Next.js` para construir nossa IU + uma única API para isso :). Se você nunca usou o Next antes, não se preocupe. Vou levá-lo pelas terras mágicas deste framework.

**AGORA** - volte para o seu editor de código e vamos inserir algumas coisas básicas nele.

Primeiro, altere os títulos do seu código! Vá para o arquivo `index.js` na pasta `pages` e atualize o título e a descrição com o tipo de gerador que você está criando. Vamos construir um gerador de imagens engraçadas, então vou mudar o meu para - "Gerador de imagens engraçadas" + mude a descrição para "Transforme-me em quem você quiser! Certifique-se de se referir a mim como "abraza" no prompt".

```jsx
const Home = () => {
  return (
    <div className="root">
      <Head>
        {/* Adicione um título aqui */}
        <title>Gerador de imagens engraçadas | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            {/* Adicione um título aqui */}
            <h1>Gerador de imagens engraçadas</h1>
          </div>
          <div className="header-subtitle">
            {/* Adicione a descrição aqui */}
            <h2>
              Transforme-me em quem você quiser! Certifique-se de se referir a mim como "abraza" no prompt
            </h2>
          </div>
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-avatar"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>construa com a buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};
```

Ótimo. Isso está ficando muito bom. A próxima coisa que vamos querer configurar é um local para os usuários digitarem! Precisamos ser capazes de receber um prompt e enviá-lo para a nossa API de inferência.

Vamos começar adicionando um contêiner de prompt logo abaixo da div que contém nossa descrição:

```jsx
<div className="root">
  <Head>
    <title>Gerador de imagens engraçadas | buildspace</title>
  </Head>
  <div className="container">
    <div className="header">
      <div className="header-title">
        <h1>Gerador de imagens engraçadas</h1>
      </div>
      <div className="header-subtitle">
        <h2>
          Transforme-me em quem você quiser! Certifique-se de se referir a mim como "abraza" no prompt
        </h2>
      </div>
      {/* Adicione contêiner de prompt aqui */}
      <div className="prompt-container">
        <input className="prompt-box" />
      </div>
    </div>
  </div>
  <div className="badge-container grow">
    <a
      href="https://buildspace.so/builds/ai-avatar"
      target="_blank"
      rel="noreferrer"
    >
      <div className="badge">
        <Image src={buildspaceLogo} alt="buildspace logo" />
        <p>construa com a buildspace</p>
      </div>
    </a>
  </div>
</div>
```

Perfeito! Eu adicionei um pouco de CSS básico no arquivo `styles/styles.css` deste projeto, mas sinta-se à vontade para mudá-lo como quiser - lembre-se de que este é o **seu** projeto.

![https://hackmd.io/_uploads/rkvdK6N5o.png](https://hackmd.io/_uploads/rkvdK6N5o.png)

Isso vai conter toda a IU que precisamos para obter uma entrada de prompt do nosso usuário para a nossa API. Agora, para capturar essa entrada, precisamos criar algumas propriedades de estado. Vá em frente e importe o `useState` no topo do seu arquivo e crie uma propriedade de estado para a entrada - `input`:

```jsx
// Adicione a importação useState aqui
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  // Crie a propriedade de estado
  const [input, setInput] = useState('');
  
  return (
    // resto do código
  )
}

export default Home;
```

Agora que temos uma maneira de armazenar o que alguém está escrevendo em nossa caixa de entrada, precisamos dizer à caixa de entrada para ler essa propriedade! Volte para onde você criou sua entrada e adicione esta propriedade:

```jsx
<div className="prompt-container">
  {/* Adicionar a propriedade para ler o valor de entrada */}
  <input className="prompt-box" value={input} />
</div>
```

Legal - quase lá! Se você começar a digitar em sua caixa de entrada, você irá perceber que nada está sendo mostrado. Bem, é porque à medida que digitamos, precisamos salvar as alterações em nosso estado da entrada, ou seja, no estado do `input`. Para fazer isso, precisamos usar a propriedade `onChange` de nossa entrada e dar a ela uma função que pegue o texto e o salve em nosso estado.
Comece criando uma nova função chamada `onChange`, logo abaixo de onde você declarou o `input`:

```jsx
const Home = () => {
  const [input, setInput] = useState('');
  // Adicione essa função
  const onChange = (event) => {
    setInput(event.target.value);
  };
  
  return (
    // resto do código	
  )
}

export default Home;
```

Isso irá receber um evento. Nós apenas pegamos o valor deste evento e o definimos no estado da entrada.

Agora, só precisamos dizer para a nossa IU de entrada chamar essa função toda vez que alguém digitar. Adicione a propriedade `onChange` ao seu input assim:

```jsx
<div className="prompt-container">
  {/* Adicione a propriedade onChange */}
  <input className="prompt-box" value={input} onChange={onChange} />
</div>
```

Vá em frente e comece a digitar na caixa de entrada. Agora você deve ver o texto aparecer! Fácil, fácil, meu amigo - estamos bem encaminhados. Ok, agora vem a parte emocionante - **fazer uma chamada de rede para usar nossa API de Inferência do Hugging Face**.

Se você nunca trabalhou com APIs, não tenha medo. Você está prestes a se surpreender muito.

Para começar, na verdade precisamos de uma maneira de executar nossa solicitação de rede. Vamos criar um botão que pegará nossa entrada e a enviará para a internet. Para isso, vamos adicionar um pouco mais de recursos à IU assim:


```jsx
<div className="prompt-container">
  <input className="prompt-box" value={input} onChange={onChange} />
  {/* Adicione seu botão de prompt no contêiner de prompt */}
  <div className="prompt-buttons">
    <a className="generate-button">
      <div className="generate">
        <p>Gerar</p>
      </div>
    </a>
  </div>
</div>
```

Neste ponto, você deve ver algo como isto:

![https://hackmd.io/_uploads/rkSFt6N9s.png](https://hackmd.io/_uploads/rkSFt6N9s.png)

Tente clicar no botão - nada acontece, certo? Isso acontece porque ainda não dissemos ao botão para fazer algo quando clicamos nele! Para isso, vamos fazer algo muito semelhante ao que fizemos com o evento `onChange`.

Comece criando uma nova função logo abaixo da função `onChange` que declaramos anteriormente, chamada `generateAction`:

```jsx
const Home = () => {
  const [input, setInput] = useState('');
  const onChange = (event) => {
    setInput(event.target.value);
  };
  // Adicione a função generateAction
  const generateAction = async () => {
    console.log('Gerando...');	
  }

  return (
    // resto do código
  )
}
export default Home;
```

Vamos adicionar um `console.log` por enquanto só para garantir que as coisas estejam funcionando como esperado.

Se você tentar pressionar o botão “Gerar”, notará que ainda não acontece nada. Precisamos dizer ao nosso botão para executar essa função quando clicamos nele.

Volte para onde você declarou o botão Gerar e adicione uma propriedade chamada `onClick`:


```jsx
<div className="prompt-container">
  <input className="prompt-box" value={input} onChange={onChange} />
  <div className="prompt-buttons">
    {/* Adicione a propriedade onClick aqui */}
    <a className="generate-button" onClick={generateAction}>
      <div className="generate">
        <p>Gerar</p>
      </div>
    </a>
  </div>
</div>
```

Épico! Depois de fazer isso, vá para a sua página, abra o inspetor do navegador e vá para a guia Console. Quando você clicar no botão Gerar, você deve ver `Gerando...` na tela, como mostrado abaixo:

![https://hackmd.io/_uploads/Hke5t64cs.png](https://hackmd.io/_uploads/Hke5t64cs.png)

É isso aí! Percebeu como é fácil? Você já está na metade do caminho para chamar uma API.
