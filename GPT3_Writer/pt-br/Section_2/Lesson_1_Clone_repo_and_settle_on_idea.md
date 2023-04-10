[https://vimeo.com/775481176](https://vimeo.com/775481176)


Vamos então construir algo!

Já mostrei vários casos de uso e tipos de prompts. O que você provavelmente percebeu é que o GPT-3 é meio ruim como “assistente geral”, mas é bem eficiente quando você cria um prompt realmente bom para uma tarefa específica. Ex: escrever tweets, gerar ideias para startups, criar letras para uma música, etc.

Um bom prompt pode levar de 15 a 20 minutos para ser criado. **Mas, uma vez criado esse prompt, você pode continuar usando-o em milhares de casos.** É disso que eu quero que você se lembre.

Por exemplo, descobri que esse prompt gera títulos principais decentes para landing pages:

```
Escreva uma lista de títulos principais curtos para uma landing page no estilo da Apple, para uma startup que constrói o seguinte:
```

A partir daqui, eu poderia criar um site que ajudaria **qualquer pessoa** a gerar títulos principais para landing pages! Tudo o que eles precisariam fazer seria me dar uma descrição de sua startup e eu inseriria ela no prompt aqui.

O mais incrível sobre a OpenAI é que isso pode ser feito por meio da API, então você pode criar ferramentas personalizadas e especializadas, alimentadas pelo GPT-3 + os prompts mágicos que você descobrir.

Então, como eu mostrei lá no início deste projeto, vamos construir duas coisas:

- Primeiro, um **aplicativo da web** que permite que qualquer pessoa use o GPT-3 para um propósito especializado que você criar (por exemplo, escrever um roteiro de filme, criar uma cópia de anúncio, gerar uma carta de amor, o que quiser).
- Segundo, uma **extensão do Chrome** que permite que as pessoas usem seus prompts do GPT-3 em qualquer site que desejarem (por exemplo, gerar tweets diretamente no Twitter, criar uma postagem interessante diretamente no LinkedIn, gerar um título principal para uma landing page diretamente no Webflow, etc).

### Clone o repositório

Se você ainda não tem uma ideia do "propósito especializado" do seu aplicativo da web/extensão do Chrome, não se preocupe! Um passo de cada vez. Vamos fazer o projeto-base funcionar primeiro.

Criamos um projeto básico com o React/NextJS + um pouco de CSS para manter as coisas fluindo. Vá em frente e faça um fork do projeto [aqui](https://github.com/buildspace/gpt3-writer-starter).

Para fazer isso, basta clicar em "**Fork**" na parte superior e, em seguida, clonar o repositório bifurcado. Isso vai bifurcar o repositório para a sua conta pessoal, o que tornará mais fácil enviar o código e implantar o nosso projeto depois.

Seria bem legal se você nos deixasse uma estrela por lá também!

![Untitled](https://i.imgur.com/bTgmHpL.png)

Após a bifurcação, vá em frente e clone o repositório. O URL da clonagem será específico para você. Deve ficar assim:

```
https://github.com/SEU_USERNAME_DO_GITHUB_AQUI/gpt3-writer-starter.git
```

E a partir daí, estamos prontos para começar. Dê `cd` no projeto, instale o `next`, o `react` e o `react-dom` e, em seguida, execute o `yarn` para iniciar o projeto.

```
# dê cd no repositório
cd gpt3-writer-starter

# instale o next se você não o tiver
yarn add next react react-dom

# execute
yarn dev
```

Em seguida, vá para [localhost:3000](http://localhost:3000) e você verá o seguinte:

![Untitled](https://i.imgur.com/5Ucablc.png)

**Uma nota para quem estiver familiarizado com o React**: sinta-se à vontade para acelerar esta parte do projeto.

**Uma nota para quem** *não está tão familiarizado* **com o React**: você não precisa ser um especialista em React para fazer isso. Se houver algo que você não entenda ao seguir este tutorial, basta pesquisar no Google e seguir em frente.

### Adicione uma caixa de texto + botão de geração

Lembre-se! Nosso objetivo é criar um site onde os usuários possam digitar algo e então ter algum texto gerado pelo GPT-3 para uma finalidade específica (por exemplo, gerar títulos de músicas de heavy metal, gerar discursos no tom de Barack Obama, etc.).

Não se preocupe em alterar seu título principal ou subtítulo ainda. Deixe-os como estão por enquanto. Nós chegaremos neles!

A primeira coisa que queremos fazer é adicionar um local onde os usuários possam digitar algo! Então, vamos adicionar um elemento `textarea`, ou seja, uma área de texto. Adicione-o com o seguinte código abaixo em `index.js`. Novamente, adicionei um pouco de CSS para ajudá-lo e garantir que as coisas fiquem decentes.

```jsx
const Home = () => {
  return (
    <div className="root">
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>e aí… insira seu título principal aqui</h1>
          </div>
          <div className="header-subtitle">
            <h2>insira seu subtítulo aqui</h2>
          </div>
        </div>
        {/* Adicione esse código aqui */}
        <div className="prompt-container">
          <textarea placeholder="digite aqui..." className="prompt-box" />
        </div>
      </div>
      <div className="badge-container grow">
        <a
          href="https://buildspace.so/builds/ai-writer"
          target="_blank"
          rel="noreferrer"
        >
          <div className="badge">
            <Image src={buildspaceLogo} alt="buildspace logo" />
            <p>construído com a buildspace</p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Home;

```

*Observação: sempre que eu mudar o código, adicionarei um pequeno comentário acima da parte que eu mudei/adicionei para facilitar as coisas para você. Por exemplo, no código acima eu adicionei o comentário `{/* Adicione esse código aqui */}`, logo acima da div que adicionei para o `textarea`.*

Depois de fazer isso, você terá algo parecido com a imagem abaixo. Tente digitar na área de texto para garantir que tudo esteja funcionando conforme o planejado.


![Untitled](https://i.imgur.com/f3OCGVf.png)

O elemento `textarea` é muito legal, pois nos dá uma maneira simples de permitir que os usuários digitem em nosso aplicativo da web e também nos dá uma maneira fácil de realmente capturar o que o usuário está digitando, para que possamos enviá-lo para a API do GPT-3 mais tarde.

Vamos configurar esse sistema de captura para podermos saber o que nosso usuário está digitando. Vamos adicionar um gancho do React ([React Hook](https://reactjs.org/docs/hooks-intro.html)) para isso. Vá em frente e importe `useState` no topo do seu arquivo:

```jsx
import { useState } from 'react';
```

A partir daí, vamos criar duas novas variáveis de estado que usaremos daqui a pouco: `userInput` e `setUserInput`. Vá em frente e adicione esta linha logo abaixo de `const Home = () => {`.

```jsx
const [userInput, setUserInput] = useState('');
```

Agora, vamos usar essas variáveis no elemento `textarea` que você criou anteriormente.

```jsx
<textarea
  className="prompt-box"
  placeholder="digite aqui..."
  value={userInput}
  onChange={onUserChangedText}
/>;
```

*Lembre-se: Seu código irá apresentar um erro aqui, porque ainda não criamos a função `onUserChangedText`.*

O que estamos fazendo aqui? Primeiro, definimos o valor (`value`) do `textarea` para `userInput`, o que significa que qualquer coisa que estiver na variável `userInput` será exibida no elemento `textarea`.

Então, temos o parâmetro `onChange`. Sempre que o usuário digitar algo, ele irá chamar `onUserChangedText`. Então, vamos escrever essa função. É bem simples. Adicione isso abaixo de onde você tem `const [userInput, setUserInput]`:

```jsx
const onUserChangedText = (event) => {
  console.log(event.target.value);
  setUserInput(event.target.value);
};
```

Tudo o que isso faz é chamar `setUserInput`, que é definido para qualquer texto que for inserido no elemento `textarea`. Dessa forma, o valor de `userInput` será sempre atualizado com o que estiver na área de texto.

Fácil! Vamos testar. Vá para o seu console e comece a digitar na área de texto para garantir que você está capturando a entrada corretamente:

![Untitled](https://i.imgur.com/X6cS8xx.png)

Consegue ver como ele dispara um evento para cada tecla que você digita? Estamos pegando esse objeto do evento, capturando o texto, imprimindo-o e mantendo-o em nosso estado de entrada. Fique à vontade para remover a instrução `console.log` agora, para que ela não polua seu console.

Agora, vamos apenas adicionar um botão de geração que o usuário pode clicar para gerar algo mágico. Mais tarde, conectaremos isso à API do GPT-3. Mas, por enquanto, vamos adicioná-lo como um botão que não faz nada.

```jsx
<div className="prompt-container">
  <textarea
    placeholder="digite aqui..."
    className="prompt-box"
    value={userInput}
    onChange={onUserChangedText}
  />
  {/* Novo código que adicionei aqui */}
  <div className="prompt-buttons">
    <a className="generate-button" onClick={null}>
      <div className="generate">
        <p>Gerar</p>
      </div>
    </a>
  </div>
</div>
```

Eu coloquei o `onClick={null}` por enquanto, e mais tarde escreveremos uma função para conectá-lo à API do GPT-3. 

Irado! Seu aplicativo deve estar com uma aparência bem interessante agora, pois quase toda a interface do usuário está no lugar.


![Untitled](https://i.imgur.com/bf3JEzb.png)

### Defina o seu título principal e subtítulo

Neste ponto, você tem um aplicativo da web com uma aparência limpa que permite que as pessoas insiram algum texto que enviaremos posteriormente para o GPT-3. Aí sim!!

Então, antes de adicionarmos o GPT-3, precisamos fazer algo realmente importante: precisamos decidir sobre um título principal e subtítulo.

Imagine uma pessoa aleatória acessando o seu escritor GPT-3. **O que você gostaria que ela fizesse?**

Novamente, usar o GPT-3 apenas como um assistente geral é meio sem graça, e podemos simplesmente usar o Playground para isso. Use-o para ajudar a decidir sobre algo específico que você quer que essa coisa faça.

*É claro que você pode mudar isso mais tarde*, mas é útil ter pelo menos algo que você ache legal antes de prosseguirmos.

Aqui temos alguns exemplos:

- **Título principal**: Gerar um thread no Twitter sobre criptomoedas. **Subtítulo**: Escreva uma frase rápida sobre o que você deseja que o thread de tweets aborde (ex: Ethereum e seu preço, Solana e sua velocidade de transação, Bitcoin e sua longevidade).
- **Título principal**: Faça Donald Trump explicar coisas para você. **Subtítulo**: Escreva um tópico que você gostaria que Donald Trump explicasse para você (ex: fissão nuclear, como funcionam os aviões, o significado da vida).
- **Título principal**: Fale com o Goku, do Dragon Ball Z. **Subtítulo**: Escreva uma mensagem para o Goku e pergunte a ele sobre qualquer coisa (ex: qual é o significado da vida, como você ficou tão forte, etc.).

É como uma landing page! O título principal é curto e objetivo. E o subtítulo explica um pouco mais.

Além disso, observe como cada caso de uso é específico! Quanto mais específico for o caso de uso, melhor será o desempenho do GPT-3. Existem muuuuitos casos de uso! O GPT-3 pode fazer de tudo, desde gerar código até escrever mensagens de texto incríveis para responder ao seu encontro do Tinder. Seja criativo e divirta-se com isso!

Assim que criar seu título principal e seu subtítulo, altere-os no código!

```jsx
<div className="header-title">
  <h1>e aí… insira seu título principal aqui</h1>
</div>
<div className="header-subtitle">
  <h2>insira seu subtítulo aqui</h2>
</div>
```

Para o meu aplicativo da web, eu vou construir algo bem simples: uma ferramenta geradora de postagens de blog, mas com o meu toque especial, que neste caso será o estilo claro e conciso de Paul Graham, que tem um tom que eu gosto muito.

Eu aprendo **muito** com postagens de blog, mas é realmente difícil encontrar boas postagens, especialmente sobre tópicos que não são tão populares.

Por exemplo, outro dia eu estava pesquisando sobre fissão nuclear na internet, mas todas as postagens eram extremamente técnicas ou muito simples. Além disso, eu não gostava do estilo de escrita da maioria delas.

Eu quero gerar postagens realmente boas para aprender com elas! Além disso, eu poderia até usar as postagens geradas no meu próprio blog, para ajudar outras pessoas.

Vamos lá!

![Untitled](https://i.imgur.com/GxwnSCs.png)

Por favor, **não copie** nenhum dos meus títulos aqui! Crie seu próprio caso de uso específico. Adicione o seu próprio toque especial nessa coisa. Caso contrário, eu garanto que não será divertido.

### Por favor, faça isso, senão o Farza vai ficar triste

Vá em frente e tire uma captura de tela do seu escritor GPT-3 com o seu novo e elegante título principal e seu subtítulo. Compartilhe a captura em #progress para inspirar outras pessoas que estão procurando por casos de uso interessantes.
