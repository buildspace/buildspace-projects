

### Construindo seu primeiro Service Worker

Agora vem a parte divertida, que é realmente usar a nossa extensão para chamar a OpenAI. A maneira como vamos chamar a OpenAI será um pouco diferente do nosso site. Em nosso site, tivemos entradas de texto que recebiam o texto digitado e chamavam um ponto de extremidade de API específico que criamos para chamar a OpenAI. Chegamos até a usar um módulo sofisticado do Node nas chamadas. Desta vez, faremos as coisas um pouco diferentes.

O objetivo é destacar o texto em nosso navegador, clicar com o botão direito do mouse e ver uma opção que diga "Gerar postagem de blog". Tudo o que obtivermos do GPT-3, injetaremos diretamente em nosso site 🙂.

**Novamente, para minha extensão, trabalharei com o [Calmly](https://www.calmlywriter.com/online/)**, e recomendo que você acompanhe com ele. Posteriormente, você poderá usar o mesmo fluxo para qualquer site onde deseja gerar texto.

Para fazer tudo isso funcionar, precisaremos configurar esta coisa chamada service worker. Você pode pensar nisso como uma configuração de servidor para seu aplicativo. Em vez de ter todo o nosso código sendo executado em nossa IU, podemos fazer com que ela execute ações enquanto nosso service worker faz tudo em segundo plano!

No nosso caso, precisamos ir ao GPT-3, obter nosso resultado de conclusão e enviá-lo para a IU para ser injetado na guia do navegador do Calmly! Teremos algumas etapas intermediárias, mas vamos começar criando o arquivo rsrs.

Vá em frente e crie um diretório scripts e um arquivo `contextMenuServiceWorker.js` dentro dele. A primeira coisa que vamos abordar neste arquivo é configurar nosso `contextMenu`! Precisamos dizer à nossa extensão qual arquivo será usado para nosso `service_worker`. Para isso, vamos ao arquivo `manifest.json` novamente e adicionar isso:

```json
{
  "name": "gerador mágico de postagens de blog",
  "description": "destaque o título da postagem do blog, nós iremos gerar o restante",
  "version": "1.0",
  "manifest_version": 3,
  "icons": {
    "48": "assets/48.png",
    "72": "assets/72.png",
    "96": "assets/96.png",
    "144": "assets/144.png"
  },
  "action": {
    "default_popup": "index.html",
    "default_title": "Gerar postagem de blog"
  },
  // Adicione isso aqui
  "background": {
    "service_worker": "scripts/contextMenuServiceWorker.js"
  },
  "permissions": ["contextMenus", "tabs", "storage"]
}
```

Agora que nossa extensão sabe onde está nosso service worker, podemos começar escrevendo a lógica para nosso item `contextMenu`!

Lembre-se, queremos destacar um certo texto no Calmly, clicar com o botão direito do mouse e selecionar uma opção que diga “Gerar postagem no blog”. Confira como é simples:


```javascript
// Adicione isso em scripts/contextMenuServiceWorker.js
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'context-run',
    title: 'Gerar postagem de blog',
    contexts: ['selection'],
  });
});

// Adicione um ouvinte de evento
chrome.contextMenus.onClicked.addListener(generateCompletionAction);
```

Excelente! Então o que estamos fazendo aqui é ouvir quando a extensão é instalada. Quando isso acontecer, criamos uma nova opção em nosso menu: “Gerar postagem de blog”. Em seguida, configuramos um ouvinte para chamar a função `generateCompletionAction` sempre que essa opção do menu for clicada.

Vamos criar essa função logo acima de onde configuramos nossos ouvintes para então verificarmos nosso `contextMenu`:


```javascript
// Nova função aqui
const generateCompletionAction = async (info) => {}

// Não toque nisso
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'context-run',
    title: 'Gerar postagem de blog',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener(generateCompletionAction);
```

**Muito bom!**. Não se esqueça de voltar à sua extensão e clicar no botão para recarregá-la, caso contrário, você não verá nenhum dos novos códigos aplicados à sua extensão!

Vamos pular para o Calmly e começar a escrever 🤘. Depois de anotar algumas coisas, destaque o texto, clique com o botão direito do mouse e confira:

![Untitled](https://i.imgur.com/YeT4PPn.png)

**Uau!** — Que irado isso! Incrível como foi fácil fazer isso funcionar, não é mesmo? Esse é um dos benefícios de construir uma extensão do Chrome e também faz parte das funcionalidades "ocultas" que eu mencionei anteriormente :).

Tudo bem então. Vamos fazer com que a seleção faça algo épico. Vamos começar capturando o texto selecionado e preparando-o para ser enviado para o GPT-3! Vamos começar adicionando isso à função `generateCompleteAction`:


```javascript
const generateCompletionAction = async (info) => {
  try {
    const { selectionText } = info;
    const basePromptPrefix = `
        Escreva um sumário detalhado para uma postagem de blog com o título abaixo.

        Título:
	`;
  } catch (error) {
    console.log(error);
  }
};
```

Bem simples! As coisas devem parecer bem familiares para você agora. A primeira coisa a notar é que toda vez que a função `generateCompletionAction` é chamada, nosso ouvinte passa um objeto `info`. Esse objeto tem nossa propriedade `selectionText` (o que você destacou).

Depois de configurar isso, podemos começar com nosso prompt-base. Você já tem os códigos de trapaça do seu site, então sinta-se à vontade para usá-los novamente aqui!

Ok, legal! Estamos prontos para chamar o GPT-3. Vamos começar declarando uma nova função de geração chamada `generate`, logo acima de `generateCompletionAction`. Depois disso, adicione a linha logo abaixo do seu `basePromptPrefix` que chamará nossa função de geração:

```jsx
// Configure sua função de geração
const generate = async (prompt) => {}

const generateCompletionAction = async (info) => {
	try {
    const { selectionText } = info;
    const basePromptPrefix =
      `
        Escreva um sumário detalhado para uma postagem de blog com o título abaixo.

        Título:
      `;

    // Adicione isso para chamar o GPT-3
    const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);

    // Vamos ver o que obtemos!
    console.log(baseCompletion.text)	
  } catch (error) {
    console.log(error);
  }
};
```

A função `generate` vai realmente economizar um bom tempo (você vai ver em breve). Este será todo o código que usaremos para chamar a API do GPT-3. Você notará imediatamente que isso parece bem diferente de quando chamamos nossa landing page. Isso porque usamos uma biblioteca de pacotes da OpenAI que configurou grande parte do código básico para nós. Estamos fazendo isso do jeito "Javascript leve" hehe.

Ei, você está aprendendo algumas coisas exclusivas, olha só! Legal, vamos então escrever isso:

```javascript
// Função para obter e decodificar a chave da API
const getKey = () => {}

const generate = async (prompt) => {
  // Obtenha sua chave de API do armazenamento
  const key = await getKey();
  const url = 'https://api.openai.com/v1/completions';
	
  // Chame o ponto de extremidade “completion”
  const completionResponse = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 1250,
      temperature: 0.7,
    }),
  });
	
  // Selecione a melhor opção e envie de volta
  const completion = await completionResponse.json();
  return completion.choices.pop();
}
```

Isso é tudo! Algumas coisas a serem observadas aqui:

1. Precisamos saber o url da chamada da API, que é [https://api.openai.com/v1/completions](https://api.openai.com/v1/completions). Você pode encontrá-lo consultando a [documentação para esta API](https://beta.openai.com/docs/api-reference/completions).
2. A função `getKey`! Você se lembra da chave que armazenamos no estado da extensão? Em breve adicionaremos a lógica para isso, mas esta função tem o mesmo nome de sua ação rsrs.
3. Temos que garantir que estamos fazendo uma solicitação de método `POST` + incluindo nossa Autorização no objeto de cabeçalho! Tudo isso é necessário para que a API da OpenAI diga: "Ei, isso é o que espero que essa chamada pareça e você tem permissão para acessar esses dados!"
4. Finalmente, o corpo. Passamos as opções que queremos que o GPT-3 use. Isso deve parecer bem familiar, pois são os mesmos dados que você inseriu ao chamar o GPT-3 por meio de sua biblioteca.

Neste ponto (assumindo que você tenha uma chave de API adequada), você deve ser capaz de chamar o GPT-3 da mesma forma que fez em sua landing page. Vamos implementar rapidamente nossa função `getKey` e então estaremos no caminho certo para despachar esta coisa 🚢:

```javascript
const getKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      if (result['openai-key']) {
        const decodedKey = atob(result['openai-key']);
        resolve(decodedKey);
      }
    });
  });
};
```

Isso deve se parecer com a função `saveKey`, porém no sentido inverso.

Acho que é hora de testarmos tudo. Este é um momento realmente emocionante. Você está prestes a desbloquear um potencial infinito em todos os sites com isso. **Esta primeira chamada significa muito**.

Vá em frente e atualize seu aplicativo na página da extensão. Em seguida, vá ao Camly ou em qualquer site que você esteja usando e deixe essa coisa rolaaaar.

Espere um segundo... como você sabe se alguma coisa aconteceu? Se você abrir o console do navegador nas configurações do desenvolvedor, verá… absolutamente nada!

Isso ocorre porque os service workers têm seus *próprios consoles*. Volte para o menu de extensões e clique no link do service worker. Isso abrirá uma nova janela do DevTools, onde você poderá ver todos os logs vindos do service worker 🙂.


![Untitled](https://i.imgur.com/2RHaPDt.png)

Tudo bem, tudo bem... Vamos tentar mais uma vez:

![Screenshot 2022-11-27 at 5.35.16 AM.png](https://i.imgur.com/MGC5R0l.png)

Agora estamos oficialmente chamando o GPT-3 de uma extensão do Chrome… **Caramba**! Você fez um hat-trick aqui - chamou o GPT-3 do playground, criou o aplicativo da web e a extensão do Chrome.

Agora que temos nosso primeiro prompt funcionando, vamos configurar nosso encadeamento de prompts! Lembre-se, o encadeamento de prompts é a arma secreta que tornará sua extensão **verdadeiramente** valiosa.

Lembra daquela função `generate` que você escreveu anteriormente? Este é o momento em que ela vai economizar um pouco do seu tempo rsrs.

Retorne em `generateCompletionAction`, vá em frente e adicione estas últimas linhas:

```javascript
const generateCompletionAction = async (info) => {
  try {
    const { selectionText } = info;
    const basePromptPrefix = `
      Escreva um sumário detalhado para uma postagem de blog com o título abaixo.
   		 
      Título:
      `;

    const baseCompletion = await generate(
      `${basePromptPrefix}${selectionText}`
    );

    // Adicione seu segundo prompt aqui
    const secondPrompt = `
      Pegue o sumário e o título da postagem do blog abaixo e gere uma postagem de blog escrita no estilo de Paul Graham. Faça parecer uma história. Não apenas liste os pontos. Mergulhe fundo em cada um. Explique o porquê.
      
      Título: ${selectionText}
      
      Sumário: ${baseCompletion.text}
      
      Postagem de blog:
      `;

    // Chame seu segundo prompt
    const secondPromptCompletion = await generate(secondPrompt);
  } catch (error) {
    console.log(error);
  }
};
```

É isso! Vamos nessa! O código reutilizável nos serviu como um bom código. Basicamente, fizemos exatamente a mesma coisa que fizemos com o primeiro prompt, mas aqui passamos a saída do primeiro prompt!

Agora tudo o que precisamos fazer é injetar tudo isso no Calmly. Há apenas um problema aqui. Nosso service worker não tem acesso ao DOM e não tem como manipular a IU... Esse é o objetivo desta extensão, não é?

Não se preocupe, vamos te ajudar.

### Por favor, faça isso, senão o Farza vai ficar triste

Publique a sua saída da OpenAI no console do service worker em #progress, no Discord. Isso tudo aqui é bem avançado… Parabéns! :)
