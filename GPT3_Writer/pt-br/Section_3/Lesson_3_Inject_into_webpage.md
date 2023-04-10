

### Comunicando com a guia do aplicativo da web

Primeiramente, se você não sabe o que é o DOM, faça uma pesquisa rápida no Google para entender um pouco mais sobre ele. A IU é a única parte de qualquer site que tem acesso ao DOM e isso porque ela precisa manipular e interagir com ele!

Coisas como seu service worker não têm ideia do que é o DOM e como manipulá-lo. Assim como um servidor, ele executa o código em seu próprio ambiente e o DOM não pode acessá-lo.

É aí que as **mensagens** entram no jogo! Na verdade, você pode se comunicar entre um service worker e o DOM enviando uma mensagem como “Ei, DOM! Tenho uma mensagem para você. Veja e faça algo com isso”.

No nosso caso, vamos pegar nossa saída do GPT-3 e enviá-la para o nosso frontend para injetar no DOM do Calmly.

O fluxo é bem simples, mas ajuda manter tudo organizado. O plano de jogo é:

1. Escreva um mensageiro em nosso service worker que envia mensagens para nossa IU
2. Crie um novo arquivo que possa ouvir as mensagens de nosso service worker
3. Quando enviamos uma determinada mensagem, a extensão injeta um valor no DOM

Pense nisso como ir a um restaurante e pedir comida. Você (o cliente) é o aplicativo. A extensão é um garçom. O chef não pode falar com você (apenas finja que ele foi trancado na cozinha pelo Gordon Ramsay). Você envia um pedido ao chef GPT-3. A extensão leva o pedido ao chef e traz de volta um delicioso prato gerado por IA.

Na verdade, é bem simples quando você olha para isso de um nível superior. Chega de papo. Vamos construir!

Volte para o arquivo `contextMenuServiceWorker.js` e adicione uma nova função chamada `sendMessage`, logo abaixo de onde declaramos `getKey`.

```javascript
const sendMessage = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0].id;

    chrome.tabs.sendMessage(
      activeTab,
      { message: 'injetar', content },
      (response) => {
        if (response.status === 'falhou') {
          console.log('A injeção falhou.');
        }
      }
    );
  });
};
```

Este bloco de código está fazendo algumas coisas… 

1. Primeiro, estamos procurando a guia que está ativa no momento. Para enviar uma mensagem, precisamos fazê-lo em uma guia ativa
2. Em seguida, usamos uma função elegante, `sendMessage`, fornecida pelo Chrome. Ela leva 3 coisas - a guia (`tab`), a carga útil (`payload`) e o retorno da chamada (`callback`). Nossa carga útil incluirá uma mensagem chamada `injetar` e o conteúdo de tudo o que já passamos
3. Por fim, nossa mensagem responderá com um status, para nos informar que as coisas estão funcionando bem 🤘

Legal! Agora que temos isso, vamos começar a enviar algumas mensagens. Vamos adicionar alguns tipos diferentes aqui:

1. Uma mensagem para quando começarmos a gerar uma conclusão
2. Uma mensagem para quando estivermos prontos para enviar nossa saída final
3. Uma mensagem caso tenhamos um erro, para que o usuário possa ver o que está acontecendo

Vamos seguir adiante. Vá para a função `generateCompletionAction` e adicione estas linhas:

```jsx
const generateCompletionAction = async (info) => {
  try {
    // Enviar mensagem com geração de texto (isso será como um indicador de carregamento)
    sendMessage('gerando...');

    const { selectionText } = info;
    const basePromptPrefix = `
      Escreva um sumário detalhado para uma postagem de blog com o título abaixo.
      
      Título:
      `;

      const baseCompletion = await generate(
        `${basePromptPrefix}${selectionText}`
      );
      
      const secondPrompt = `
        Pegue o sumário e o título da postagem do blog abaixo e gere uma postagem de blog escrita no estilo de Paul Graham. Faça parecer uma história. Não apenas liste os pontos. Mergulhe fundo em cada um. Explique o porquê.
        
        Título: ${selectionText}
        
        Sumário: ${baseCompletion.text}
        
        Postagem de blog:
		  `;
      
      const secondPromptCompletion = await generate(secondPrompt);
      
      // Envie a saída quando terminarmos
      sendMessage(secondPromptCompletion.text);
  } catch (error) {
    console.log(error);

    // Adicione isso aqui também para ver se encontramos algum erro!
    sendMessage(error.toString());
  }
};
```

Ok ok ok! **AGORA ESTAMOS PROGREDINDO**.

Então, estamos enviando mensagens, mas não temos nada para recebê-las. É como se você estivesse gritando com toda as força dos seus pulmões em uma floresta, mas ninguém está lá para ouvir 😟.

Como queremos que nossa IU receba a mensagem, devemos configurar um ouvinte ali. Para fazermos isso, precisamos criar um arquivo que lida com scripts para nós no lado da IU. É aí que entra o arquivo `content.js`.

### Ouvindo mensagens

Vamos em frente! Adicione alguns ouvintes criando primeiro um novo arquivo chamado `content.js`, em nossa pasta `scripts`! Este arquivo conterá todos os nossos scripts para o frontend de nossa extensão, como o script da manipulação do DOM 🤘.

Agora, para nossa extensão saber que este é o arquivo que usaremos para os script de frontend, precisamos informar isso ao arquivo `manifest.json`. Então, vá em frente e adicione isto a ele:

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
  "background": {
    "service_worker": "scripts/contextMenuServiceWorker.js"
  },
  "permissions": ["contextMenus", "tabs", "storage"],
  // Adicione este array aqui
  "content_scripts": [
    {
      "matches": ["http://*/*", "https://*/*"],
      "js": ["scripts/content.js"]
    }
  ]
}
```

Este array diz para qualquer site que visitamos para nos permitir executar código de script nele, para fazer coisas como a manipulação de DOM.

Agora, se decidirmos executar isso agora, receberemos um erro em nosso service worker dizendo que nenhuma resposta foi retornada de nossa mensagem - conexão fechada. Nosso arquivo `content.js` está aqui para mudar isso por estar por perto para ouvir as mensagens de nosso service worker.

Vamos para nosso arquivo `content.js` para configurar nosso ouvinte:


```javascript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'injetar') {
    const { content } = request;

    console.log(content);

    sendResponse({ status: 'sucesso' });
  }
});
```

Isso é muito semelhante à nossa função `sendMessage`, mas ao contrário! Quando esse ouvinte for acionado, ele receberá 3 props: `request`, `sender` e `sendResponse`. Vamos nos preocupar com `request` e `sendResponse` por enquanto.

Nossa solicitação será o objeto que contém as coisas interessantes — a mensagem e o conteúdo. Mas antes de processar qualquer coisa, queremos ter certeza de verificar se nossa mensagem é para nossa ação de injeção. Se for, vamos pegar o conteúdo que estiver em `content`.

Por enquanto, vamos apenas mostrar a saída de tudo o que a mensagem nos envia e, em seguida, usar o retorno de chamada `sendResponse` para enviar uma mensagem de volta dizendo que as coisas estão perfeitas e nada deu errado 👀.

Estamos prontos para testar nossas funções de mensagem! Se você nunca trabalhou com esse tipo de mensagem antes, prepare-se para se surpreender. Grande parte deste projeto tem alguns momentos mágicos bem incríveis. E este será um deles!

Vá em frente, recarregue sua extensão e volte para o Calmly! Antes de testarmos isso completamente, alguns 🚨LEMBRETES MUITO IMPORTANTES 🚨!

Você precisará remover a extensão e instalá-la novamente, pois está adicionando novos scripts. Depois disso, seguiremos com o fluxo de teste padrão:

1. Recarregue qualquer guia em que você deseja usar a extensão
2. Clique na extensão e adicione a chave de API
3. Para ver as mensagens de log do arquivo `content.js`, basta abrir o console na guia do navegador da web (não os logs de extensão)! Lembre-se de que estamos lidando com um script de frontend :)

Se você não recarregar a extensão, as coisas não funcionarão como esperado. Se você olhar para o console errado, não verá nada! :P

![Screenshot 2022-11-27 at 5.47.18 AM.png](https://i.imgur.com/8h7w1EJ.png)

BOOM! É assim que conseguimos nosso `gerando...` e a saída do GTP-3!

Estamos tããão perto agora! É aqui que a verdadeira personalização entra em jogo. Até este ponto, se você ainda não mudou sua extensão para ser algo diferente de um gerador de postagem de blog, então reserve um tempo agora e pense nisso. Este é o seu momento de trazer o poder do GPT-3 para qualquer site que você queira, fazendo o que quiser. Bem irado.

### Está na hora — injetando no Calmly

Você provavelmente está pensando: “Caramba, Farza! Você continua se empolgando nessa coisa de injeção, mas nem mostrou como fazer isso”. Tudo bem… eu estou aqui agora!

Vamos mergulhar de volta em nosso arquivo `content.js`. Quando recebemos nosso conteúdo, queremos pegar e adaptar este arquivo de forma que o Calmly (ou o site que você está usando) possa recebê-lo e renderizá-lo como se você o tivesse digitado.

Esta é provavelmente uma das partes mais difíceis deste processo. Cada site faz isso de maneira diferente e possui elementos diversos. Dependendo dos sites que planeja usar, você precisará vasculhar muito o HTML para entender como ele está estruturado! É um processo difícil, mas, tenha certeza… é incrível quando você vê tudo se encaixando.

Vá em frente e adicione estas duas linhas em seu ouvinte de mensagens e declare uma nova função em `content.js`:

```javascript
// Declare uma nova função
const insert = (content) => {}

chrome.runtime.onMessage.addListener(
  // Este é o ouvinte de mensagens
  (request, sender, sendResponse) => {
    if (request.message === 'injetar') {
      const { content } = request;
			
      // Chame esta função de inserção
      const result = insert(content);
			
      //  Se algo deu errado, envie um status de falha
      if (!result) {
        sendResponse({ status: 'falhou' });
      }

      sendResponse({ status: 'sucesso' });
    }
  }
);
```

É incrível como o Chrome facilita a conexão com esses eventos e a adição de nossa própria lógica personalizada. Vamos usar a função `insert` para realmente encontrar o HTML adequado no qual precisamos injetar nossa saída e, em seguida, retornar uma resposta.

Antes de nos aprofundarmos na função `insert`, vou fazer o layout do fluxo que devemos seguir com comentários dentro da função e preencher um a um (na verdade, isso é chamado de pseudocódigo):


```javascript
const insert = (content) => {
  // Encontre a seção de entrada do editor Calmly

  // Encontre a primeira tag <p> para que possamos substituí-la por nossa injeção

  // Divida o conteúdo utilizando \n

  // Envolva em tags <p>

  // Insira ao HTML, um de cada vez

  // Se tiver sucesso, retorne True
  return true;
};
```

Irado! Esse tipo de brainstorming sempre me ajuda a estabelecer algum tipo de fluxo sem escrever código, pois os passos que preciso dar para chegar onde quero ir ficam bem claros. Vamos começar do topo, encontrando a seção de entrada do editor Calmly.

Para obter tudo o que precisamos aqui, precisaremos inspecionar o site! Se você nunca inspecionou um site antes, esta será uma ótima maneira de começar. Usar o inspetor pode auxiliar na depuração do seu código, ver como outros sites estruturam seus códigos e até mesmo ajudar com um desenvolvimento mais rápido!

Tudo o que você precisa fazer é pressionar `CMD + OPTION + i` (macOS) ou `CTRL + ALT + i` (Windows) para obter um pop-up com todos os elementos da página!

Uau. Tem muita coisa acontecendo aqui rsrs. O primeiro passo, porém, é descobrir onde podemos realmente escrever no Calmly, porque, bem, é onde estamos tentando inserir nosso texto.


![Untitled](https://i.imgur.com/DiO4GiK.png)

Explore um pouco por aqui! Você perceberá que pode usar o cursor para passar o mouse sobre os elementos ou apenas as teclas de seta. Mais uma vez, o objetivo do Calmly é encontrar a `div` onde digitei “olá :)”.

Olhando mais fundo, podemos ver que uma tag `<p>` é criada e inserida dentro desta `div`. Mas o que realmente estamos procurando aqui?

Basicamente, precisamos escrever um código que diga: leve-me a esta `div` e insira uma tag `<p>` com algum texto nela. Ok, legal! Nós podemos fazer isso! Mas como? Chamando o Javascript para o resgate!

O elemento `document` tem toneladas de operações sofisticadas para nos ajudar a identificar elementos específicos em HTML e manipulá-los.

**OK! HORA DO CÓDIGO:**

```javascript
// Encontre a seção de entrada do editor Calmly
const elements = document.getElementsByClassName('droid');

if (elements.length === 0) {
  return;
}

const element = elements[0];
```

Então, isso é realmente bem simples! Se você percebeu, aquela `div` que contém nossas tags `<p>` tem uma classe chamada `droid`. Temos uma maneira fácil de achar isso, com o `getElementsByClassName` !

Você notará que ele retorna uma lista desses itens, porque tecnicamente pode haver várias divs com esse nome de classe. Como sabemos que esta é a div mais ao topo com este nome de classe, é seguro apenas retirá-la do topo.

Agora vamos fazer algo um pouco estranho. Remova o primeiro elemento `<p>` da `div` `droid`:


```jsx
// Pegue a primeira tag <p> para que possamos substituí-la por nossa injeção
const pToRemove = element.childNodes[0];
pToRemove.remove();
```

Isso é apenas para dar um toque de sofisticação, mas essencialmente queremos que pareça que você está enviando algo e que tenha diferentes estados de carregamento.

Imagine que você tenha um fluxo que se pareça com isso:

![Screenshot 2022-11-27 at 5.49.31 AM.png](https://i.imgur.com/Ivkr8cH.png)

Seria muito melhor se isso fosse substituído na primeira linha, certo? Então é isso que essas duas linhas estão fazendo antes de inserir a próxima parte do conteúdo.

Ótimo! Então estamos pegando algumas divs apenas manipulando algum texto… muito legal, certo? Agora vamos pegar alguns dados reais e mexer com eles para injetar.

A resposta do GPT-3 é realmente bem formatada (obrigado, OpenAI), por isso queremos ter certeza de fazer a mesma coisa aqui também! É aqui que entra o passo 3:

```javascript
// Divida o conteúdo utilizando \n
const splitContent = content.split('\n');
```

Se você nunca viu isso antes, tudo o que isso significa é “nova linha”. Isso informa ao seu editor de texto para recuar o texto para a próxima linha. Recuos são muito importantes, especialmente em uma postagem de blog! Eles ajudam a separar o conteúdo e mostram ênfase em certas partes. Então, queremos ter certeza de considerar isso.

Se dermos uma olhada no que o Calmly faz quando pressionamos Enter (ou adicionamos uma nova linha), podemos ver que ele adiciona este tipo de HTML:

![Untitled](https://i.imgur.com/Kbo5ZLt.png)

Isso significa que, se encontrarmos um `\n`, devemos criar essa tag `<p>` com um elemento `<br>` (break).

**Tudo certo!** Para capturar essas coisas, vamos realmente percorrer a string de conteúdo e dividi-la nesses caracteres de nova linha. Isso nos ajudará a saber onde e quando adicionar uma nova linha no Calmly :).

Para fazer isso, podemos escrever este pequeno pedaço de código maneiro:

```javascript
// Envolva em tags <p>
splitContent.forEach((content) => {
  const p = document.createElement('p');

  if (content === '') {
    const br = document.createElement('br');
    p.appendChild(br);
  } else {
    p.textContent = content;
  }

  // Insira ao HTML, um de cada vez
  element.appendChild(p);
});
```

Antes de tudo, vamos percorrer nossa string de conteúdo e colocar cada linha em uma tag `<p>`! Na verdade, isso consiste em criar uma nova tag `<p>` através do código e inserir o texto no `textContent` do elemento.

Novamente, se colocarmos um `\n` (que também é `' '`), vamos colocar também um elemento `<br>` dentro da tag `<p>`!

Por fim, pegamos aquela tag `<p>` que foi lindamente construída e a anexamos ao elemento `div` `droid` que abordamos anteriormente. Acho que eram os droides que estávamos procurando.

### Opcional - adicionando permissão de host

Se você estiver enfrentando um problema em que sua área de texto de destino não está sendo preenchida pela resposta da OpenAI, é porque você não tem [permissão de host](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/) para modificar os dados. Para conceder permissão, basta adicionar `"host_permissions": ["https://*/*"],` em `manifest.json`:

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
  "background": {
    "service_worker": "scripts/contextMenuServiceWorker.js"
  },
  "permissions": ["contextMenus", "tabs", "storage"],
  // Adicione a linha de código aqui
  "host_permissions": ["https://*/*"],
  "content_scripts": [
    {
      "matches": ["http://*/*", "https://*/*"],
      "js": ["scripts/content.js"]
    }
  ]
}
```


**MUITO BEM!** Parece que estamos prontos para testar direito essa coisa :). Se as coisas funcionarem, você acabou de desbloquear uma habilidade muito incrível: GPT-3 + extensões do Chrome.

De fato, isso não é fácil de se envolver, e você está aqui fazendo exatamente isso. Certo, vamos ver essa coisa voar.

Vá em frente, recarregue sua extensão, atualize sua página da web e execute seu fluxo de testes:

![Screenshot 2022-11-27 at 5.54.24 AM.png](https://i.imgur.com/x4kRkqO.png)

**UAU! Isso é maravilhoso! 🥲.** Que loucura… Você deve ter visto `gerando…` na tela. Assim, sua próxima postagem de blog chegará direto no Calmly!

Parabéns, meu amigo. **VOCÊ CONSEGUIU!** Agora você pode fazer chamadas ao GPT-3 de qualquer lugar da web!

### Por favor, faça isso, senão o Farza vai ficar triste

Poste uma captura de tela em #progress, mostrando o texto gerado no Calmly pelo script de injeção. Excelente trabalho!
