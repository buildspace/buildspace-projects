

Então, agora precisamos chamar a API da OpenAI!

Não podemos simplesmente chamá-la diretamente do nosso frontend porque assim **exporíamos nossa chave de API aos usuários**. Qualquer pessoa poderia simplesmente abrir o painel de inspeção e facilmente pegar nossa chave. E não queremos fazer isso, porque se fizermos, qualquer pessoa pode abusar de nossa chave de API e nos fazer gastar muito dinheiro.

Mas lembre-se - agora ainda estamos trabalhando com os $18 em créditos que a OpenAI nos deu inicialmente. Mas mesmo assim, não queremos que ninguém pegue nossa chave de API e gaste todos os nossos créditos! Novamente, você pode ver o quanto foi usado [aqui](https://beta.openai.com/account/usage).

Então, o que precisamos fazer é configurar um backend para chamar a OpenAI com segurança. Em seguida, nosso frontend chamaria a nossa função do backend - dessa forma, nossos usuários nunca poderiam acessar nossa chave API.

Normalmente, configurar um servidor é uma dor de cabeça enorme.

Na verdade, agora estamos usando algo chamado NextJS - que é um framework para React. Isso torna **muito** fácil configurar *funções* de *backend* *sem servidor*. Essas são funções que são executadas na nuvem sob demanda, então não precisamos manter nosso próprio servidor. Problema resolvido.

Fácil, fácil! Vamos para a configuração!

### Adicione o Ponto de Extremidade (Endpoint) da API

Vamos criar uma nova função sem servidor que nosso frontend usará. Deixe-me mostrar como é fácil com o NextJS.

Crie uma nova pasta chamada `api` dentro da pasta `pages`. Dentro do diretório `api`, crie um arquivo chamado `generate.js`. Tenha cuidado com o local onde você cria o arquivo ou como o nomeia - o NextJS faz sua mágica com base em nomes de arquivo + caminhos de arquivo.

![Untitled](https://i.imgur.com/PdkI939.png)

Em `api/generate.js`, vamos escrever nosso código de backend para chamar a OpenAI!

Vá em frente e adicione o seguinte:

```jsx
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
```
*Observação: Se você estiver enfrentando algum problema com o módulo da OpenAI, tente executar `npm install openai` no seu terminal*

Isso é bem simples! Estamos usando a biblioteca JS da OpenAI para configurar a API mais facilmente. Mas você verá aqui que precisamos de `process.env.OPENAI_API_KEY`. Isso virá do nosso arquivo `.env`, que é um arquivo que contém as informações secretas que você não deseja enviar acidentalmente para o GitHub.

*Observação: você pode copiar e colar sua chave de API diretamente aqui, mas, quando o código for enviado para o GitHub, qualquer pessoa poderá vê-la!*

Então, vá em frente e crie um arquivo chamado `.env` na raiz do seu projeto. Dentro dele, tudo o que você precisa é isso:


```jsx
OPENAI_API_KEY=INSIRA_SUA_CHAVE_DE_API_AQUI
```

Gere sua chave de API [aqui](https://beta.openai.com/account/api-keys) e cole-a no local indicado. Você **não** precisa formatar o arquivo `.env`, apenas cole a chave sem aspas ou espaços, como mostrado acima!

Veja como fica na minha tela:

![Untitled](https://i.imgur.com/A0BsiHa.png)

*Observação: você pode ter que reinicializar seu terminal e executar `yarn dev` novamente. Às vezes, nosso frontend pode não reconhecer o arquivo `.env` sem uma reinicialização.*

Legal! Agora vamos terminar o `generate.js` para chamar a API da OpenAI. Adicione o seguinte código abaixo da linha `const openai`:

```jsx
const basePromptPrefix = "";
const generateAction = async (req, res) => {
  // Execute o primeiro prompt
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.7,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  res.status(200).json({ output: basePromptOutput });
};

export default generateAction;
```

Pronto! Terminamos. Criamos uma função de backend sem servidor que chama a OpenAI com segurança. Vamos detalhar isso um pouco:

Primeiro, estamos usando o ponto de extremidade `createCompletion` que você pode conferir [aqui](https://beta.openai.com/docs/api-reference/completions/create). Ele tem **muitas** opções. As 4 informações mais importantes que precisamos fornecer são:

- `model`: que é o tipo de modelo que queremos usar. Hoje, o modelo mais avançado é o `text-davinci-003`. Você pode explorar outros modelos [aqui](https://beta.openai.com/docs/models/gpt-3).
- `prompt`: este é o prompt que estamos passando, assim como faríamos no Playground. Neste caso, passamos `basePromptPrefix`, que é uma string vazia no momento (que usaremos mais tarde), e `req.body.userInput`, que será a entrada que o usuário digita no elemento `textarea` da IU (interface do usuário) e que enviamos para esta função da API.
- `temperature`: já conhecemos essa configuração do Playground. Você pode ajustá-la mais tarde com base em suas necessidades.
- `max_tokens`: estou definindo isso como `250` por enquanto, que é cerca de 1.000 caracteres no total. Se você estiver lidando com prompts mais longos e saídas mais longas, poderá aumentar esse número posteriormente. Mas, para fins de teste, é melhor mantê-lo baixo. Certamente aumentarei esse valor mais tarde, pois quero gerar postagens de blog mais longas para mim.

Acredite ou não, esta função está pronta para ser chamada de nosso frontend. Essa é a mágica do NextJS - ele faz o trabalho duro de configurar um backend sem servidor para nós.

### Conecte o botão mágico

Vamos conectar nosso botão "Gerar" para chamar nossa nova e sofisticada API.

Coloque o código a seguir *abaixo* de onde você tem `const [userInput, setUserInput]`.

```jsx
const [apiOutput, setApiOutput] = useState('')
const [isGenerating, setIsGenerating] = useState(false)

const callGenerateEndpoint = async () => {
  setIsGenerating(true);
  
  console.log("Chamando a OpenAI...")
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userInput }),
  });

  const data = await response.json();
  const { output } = data;
  console.log("A OpenAI respondeu...", output.text)

  setApiOutput(`${output.text}`);
  setIsGenerating(false);
}
```

Não há nada muito complicado aqui.

Primeiro, eu criei uma variável de estado para `isGenerating`. Isso nos permitirá criar facilmente um estado de carregamento mais tarde, para que possamos dizer aos nossos usuários para aguardar a resposta da API da OpenAI. Em seguida, crio `apiOutput`, que será onde armazenaremos a saída da API que queremos mostrar ao usuário.

Em seguida, pulamos para a função `callGenerateEndpoint`. O resumo:

- Eu chamo `setIsGenerating(true)` para definir o estado de carregamento como `true`. No final da função, coloco `setIsGenerating(false)`, porque é quando terminamos com a API e podemos definir o estado de carregamento como `false`.
- Faço uma simples busca (`fetch`) em nossa API - observe a rota que uso: `/api/generate`. O NextJS cria automaticamente essa rota para nós com base na estrutura do nosso diretório: `api/generate.js`. Bem legal!
- A partir daí, converto a resposta em JSON fazendo `await response.json()` e, em seguida, tenho minha saída, ou seja, meu `output`. *Observação: estou usando [desestruturação de objetos](https://www.javascripttutorial.net/es6/javascript-object-destructuring/) aqui.*
- Finalmente, uso `setApiOutput` para realmente definir `apiOutput` com o texto real que o GPT-3 gerou.

Para testar isso tudo, adicione `callGenerateEndpoint` ao evento `onClick` do seu botão "Gerar", fazendo:

```jsx
<a className="generate-button" onClick={callGenerateEndpoint}>
  <div className="generate">
    <p>Gerar</p>
  </div>
</a>
```

Agora, vá em frente e digite algo dentro da área de texto para testar as coisas, clique em "Gerar" e você deverá ver uma resposta no console como na imagem abaixo:

![Untitled](https://i.imgur.com/QFkmaEs.png)

**Observação: a API da OpenAI pode ser lenta às vezes.**

### Adicione a saída do GPT-3 à nossa Interface do Usuário

Vamos mostrar a saída em nossa IU. Já temos a saída em `apiOutput`, mas ainda precisamos mostrá-la! Aqui está o código para fazer isso:

```jsx
<div className="prompt-container">
  <textarea
    placeholder="digite aqui..."
    className="prompt-box"
    value={userInput}
    onChange={onUserChangedText}
  />
  <div className="prompt-buttons">
    <a className="generate-button" onClick={callGenerateEndpoint}>
      <div className="generate">
        <p>Gerar</p>
      </div>
    </a>
  </div>
  {/* Novo código que adicionei aqui */}
  {apiOutput && (
  <div className="output">
    <div className="output-header-container">
      <div className="output-header">
        <h3>Saída</h3>
      </div>
    </div>
    <div className="output-content">
      <p>{apiOutput}</p>
    </div>
  </div>
)}
</div>
```

Nada de especial aqui. Eu simplesmente exibo a saída usando `{apiOutput}` dentro de uma `div` com a classe CSS `output-content`. Sinta-se à vontade para verificar o CSS em `styles.css` sempre que quiser. Se quiser, você também pode mudar um pouco as coisas.

Aqui está minha tela quando eu testo.

![Untitled](https://i.imgur.com/sz7Dda7.png)

Poxa, é uma pena ver o Elon Musk insatisfeito com a direção que a Tesla está tomando. Espero que ele resolva isso rsrs. *Observação: o espaçamento pode ser diferente do meu, dependendo se o GPT-3 coloca uma nova linha ou não*.

### Adicione um estado de carregamento simples

Maaaaaais uma coisa para adicionar bem rapidinho - um estado de carregamento! Já temos o estado de carregamento salvo em `isGenerating`, que será `true` se estivermos aguardando a API e `false` se não estivermos.

Tudo o que precisamos fazer é exibir este estado! Aqui está o código:

```jsx
<div className="prompt-buttons">
  <a
    className={isGenerating ? 'generate-button loading' : 'generate-button'}
    onClick={callGenerateEndpoint}
  >
    <div className="generate">
    {isGenerating ? <span className="loader"></span> : <p>Gerar</p>}
    </div>
  </a>
</div>
```

Na verdade, eu usei algumas coisas sofisticadas aqui. A primeira coisa que você me vê fazendo é mudando o `className` com base no valor de `isGenerating`. Se você nunca viu a sintaxe `? :`, isso é chamado de [operador ternário](https://www.javascripttutorial.net/javascript-ternary-operator/). Funciona assim:

```jsx
seIssoForVerdadeiro ? entãoFaçaIsso : senãoFaçaIsso
```

Basicamente, é uma forma mais limpa de `if` + `else`.

Então, se `isGenerating` for verdadeiro, usamos a classe `generate-button loading`, que reduzirá a opacidade do nosso botão. Se for falso, usaremos a classe normal `generate-button`, que mantém o botão brilhante.

Eu uso a mesma lógica abaixo disso.

Se `isGenerating` for verdadeiro, mostramos uma animação de carregamento e, se for falso, mostramos apenas a palavra "Gerar"! Simples. Aqui está como o estado de carregamento deve ser exibido:

![Untitled](https://i.imgur.com/2zYhvhJ.png)

### Por favor, faça isso, senão o Farza vai ficar triste

Vá em frente, faça uma captura de tela do seu aplicativo da web, que agora deve estar limpo e simples de mexer, com alguma saída na tela e poste em #progress! Ótimo trabalho até agora. A maioria das pessoas teria parado ou se distraído, mas você se manteve focado. Vamos continuar. Ainda precisamos sair do localhost!