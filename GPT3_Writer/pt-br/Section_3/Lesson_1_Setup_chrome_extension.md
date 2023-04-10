[https://vimeo.com/775481289](https://vimeo.com/775481289)

Neste ponto, você provavelmente está bem envolvido no código. Ajustando seu modelo, deixando seu site ainda mais limpo e conectado com a sua ideia. Mas eu quero que você tire um minuto para dar um passo atrás e olhar para onde você começou, onde você está e para onde está indo.

Talvez você tenha acabado de ouvir falar sobre essa coisa chamada GPT-3, ou talvez esteja interessado nisso há algum tempo. De qualquer forma, você começou brincando com isso em uma ferramenta chamada OpenAI Playground. Você aprendeu algumas coisas incríveis, como o encadeamento de prompts e como pode treinar / melhorar seus modelos.

Você pegou tudo isso e construiu um site onde qualquer pessoa pode acessar e usar sua IA personalizada. Você acabou de dar às pessoas uma maneira de acessar a loucura que é o GPT-3 por meio de sua própria ideia + site, e isso é totalmente épico!

**Agora** vamos dar um passo adiante, pois queremos mostrar como você pode usar o GPT-3 em qualquer lugar na Internet com extensões do Chrome.

### Mas que diabos estamos construindo?

Construir um site onde as pessoas possam usar o GPT-3 em um ambiente fechado é legal, mas e se você pudesse acessar o poder do GPT-3 em qualquer lugar na web? Como vimos, o GPT-3 é muito mais poderoso quando tem contexto e um monte de coisas para trabalhar, e é por isso que utilizamos o encadeamento de prompts.

Faremos isso construindo uma extensão do navegador Chrome, que nos permitirá injetar respostas do GPT-3 em um escritor de texto online, muito parecido com o playground da OpenAI. Vou continuar com a ideia do escritor de postagens de blog que criei para o site e você também deve continuar desenvolvendo sua ideia!

### Por que construir uma extensão?

As extensões de navegador são seriamente subestimadas. Basicamente, elas são uma maneira fácil de modificar partes da internet e podem criar produtos **incríveis**. Recentemente, o PayPal comprou o Honey, uma extensão de navegador que adiciona cupons a compras online, por 4 bilhões de dólares 🤯.

Ao combinar a versatilidade das extensões de navegador com o enorme cérebro que o GPT-3 possui, você pode usar qualquer coisa da Internet para gerar outras coisas. Imagine uma extensão que gera respostas para tweets, como a [Blackmagic](https://blackmagic.so/) rsrs.

Um contexto importante aqui é que você precisa focar sua extensão em **uma** área ou site. Pense no Grammarly - ele funciona com elementos `textarea`. Os gerenciadores de senha funcionam apenas com entradas de senha (`password`). Eu vou mostrar os códigos de trapaça (cheat codes) em um site e deixar você livre para pegar e construir as ideias malucas que tiver :).

### Como uma extensão funciona

As extensões de navegador são bem simples - elas são feitas com as mesmas coisas que você utiliza para criar sites: **HTML**, **CSS** e **JS**. Você pode pensar em uma extensão como um aplicativo da web anexado ao Chrome que possui funcionalidades "ocultas" para liberar coisas às quais os sites comuns geralmente não têm acesso!

As três principais partes com as quais vamos trabalhar são:

1. **A interface do usuário pop-up** - construída com HTML/CSS simples. É isso que o usuário vê quando clica no ícone da extensão
2. **Scripts de conteúdo** - arquivos JS que lidam com a lógica de nossa extensão, incluindo a lógica de nossa IU pop-up
3. **O service worker** - também um arquivo JS, é como o nosso servidor: é carregado para lidar com tarefas em segundo plano quando necessário e fica ocioso depois de concluído

![Untitled](https://i.imgur.com/qhkATwy.png)

Caso você prefira uma abordagem mais visual, aqui está um gráfico bem útil da arquitetura do processo, retirado da [documentação do Chrome](https://developer.chrome.com/docs/extensions/mv3/architecture-overview/).

Assim como a maioria das extensões, a nossa extensão irá receber dados do navegador, processá-los de alguma forma e, em seguida, injetar uma resposta na IU (na mesma aba em que estamos).

**VAMOS LÁÁÁÁÁÁÁÁ!** 

### Iniciando

Comece a construir sua extensão de navegador de 5 bilhões de dólares clonando [este repositório](https://github.com/buildspace/gpt3-writer-extension-starter). Não há etapa de configuração ou construção aqui, os arquivos têm tudo o que você precisa para começar. Como isso é baseado em Chromium, funcionará em quase todos os navegadores populares - Google Chrome (rsrs), Brave e até mesmo o Microsoft Edge (cadê meus amigos do Edge??).

```
git clone https://github.com/buildspace/gpt3-writer-extension-starter
cd gpt3-writer-extension-starter/
```

Não há nada aqui, exceto alguns ativos e um arquivo `manifest.json`. O arquivo `manifest.json` contém vários metadados e informa ao navegador o nome da extensão, quais ativos são necessários, quais permissões são necessárias para executá-la e identifica quais arquivos devem ser executados em segundo plano e na página.

### Construindo o arquivo manifest.json

O objetivo desta extensão é que você construa em cima da sua ideia atual. Por exemplo, se você está criando um gerador de postagem de blog e usa o Substack o tempo todo, poderá construir essa extensão para funcionar com o Substack e inserir o texto gerado pelo GPT-3 **DIRETAMENTE** no editor de texto do Substack. É bem poderoso, e você está prestes a desbloquear esse novo poder.

Vou continuar construindo meu gerador mágico de postagens de blog, para injetá-lo em um site chamado [Calmly](https://www.calmlywriter.com/online/). É um editor de texto que uso o tempo todo. Novamente - você pode mudar a direção das coisas aqui. Se você tem uma ideia incrível do que o GPT-3 pode fazer em um site/aplicativo específico, vá em frente.

Mas, a estratégia que vou mostrar aqui para injetar no Calmly pode ser usada em qualquer site da web - Reddit, Notion, Twitter, o que for.

Aqui está o básico que fornecemos no `manifest.json` - este é o momento de alterá-lo para sua ideia de aplicativo:

```json
{
  // Mude para o seu título
  "name": "gerador mágico de postagens de blog",
  // Mude para sua descrição
  "description": "destaque o título da postagem do blog, nós iremos gerar o restante",
  "version": "1.0",
  "manifest_version": 3,
  // Atualize esses recursos na pasta
  "icons": {
    "48": "assets/48.png",
    "72": "assets/72.png",
    "96": "assets/96.png",
    "144": "assets/144.png"
  },
  "action": {
    "default_popup": "index.html",
    // Mude o título padrão
    "default_title": "Gerar postagem de blog"
  }
}

```

A propósito, se você copiar e colar, precisará remover os comentários.

Como as extensões podem basicamente se tornar malware executado em seu navegador, a segurança é um grande problema para elas. Você precisa declarar explicitamente quais permissões sua extensão precisa. Certifique-se de adicionar esta linha, que explicaremos mais tarde:

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
  // Adicione esta linha
  "permissions": ["contextMenus", "tabs", "storage"]
}
```

### Criando uma IU para sua extensão

Nossa extensão terá uma IU super básica. Essa IU será para inserir nossa chave de API da OpenAI. Você vai precisar dela porque:

1. Você precisa de uma chave de API para chamar o GPT-3
2. Não queremos apenas codificá-la rigidamente, então estamos pedindo ao usuário que a insira
3. Queremos que seja guardada no armazenamento da extensão, que só pode ser acessado pelo usuário do computador

Dessa forma, não precisamos nos preocupar com os créditos da OpenAI - os usuários fazem tudo!

Dê uma olhada no arquivo `manifest.json` e encontre a ação `default_popup`. Este é o arquivo que criaremos para aparecer em nossa extensão quando a abrirmos!

Crie um novo arquivo na raiz do seu projeto chamado `index.html`.

```html
<html>
    <head>
        <link rel="stylesheet" href="index.css">
    </head>
    <body>
        <div id="key_needed">
            <p>Para começar, adicione sua chave de API da OpenAI!</p>
            <input id="key_input" />
            <button id="save_key_button">Adicione chave</button>
        </div>
        <div id="key_entered">
           <p>Você inseriu sua chave de API da OpenAI.</p>
           <button id="change_key_button">Altere a chave</button>
        </div>
    </body>
    <script src="index.js"></script>
</html>
```

Super simples, apenas algumas importações e classes. Mostraremos a div `key_needed` quando o armazenamento estiver vazio e a ocultaremos com a div `key_entered` quando houver uma chave no armazenamento.

Vamos agora estilizar tudo isso com o CSS. Primeiro, precisamos criar um arquivo `index.css` na raiz do seu projeto e configurá-lo assim:

```css
body {
    min-width: 250px;
}

#key_entered {
    display: none;
}
```

Novamente, tudo bem básico. É só começar com `key_entered` como uma `div` oculta e então usaremos o JavaScript para alterar essa propriedade. Isso nos levará ao arquivo `index.js`, que também é importado na página HTML. Vá em frente e crie um arquivo `index.js` na raiz deste diretório também!

Vamos começar escrevendo alguns ouvintes de eventos (listeners) para sabermos quando os botões são clicados!

```javascript
document.getElementById('save_key_button').addEventListener('click', saveKey);
document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey);
```

Você pode ver que estamos ouvindo os eventos de clique de `save_key_button` e `change_key_button`. Ambos chamarão funções diferentes. Vamos criar a declaração da função para ambos, mas vamos começar com o primeiro ouvinte e criar a função `saveKey`:

```javascript
const saveKey = () => {}

const changeKey = () => {}

document.getElementById('save_key_button').addEventListener('click', saveKey);
document
  .getElementById('change_key_button')
  .addEventListener('click', changeKey);
```

Legal! Queremos salvar a chave de API da OpenAI que é inserida. Isso pode parecer suspeito, mas não se preocupe, é bem seguro. A coisa mais segura a fazer aqui seria criar um serviço inteiro para lidar com essas solicitações - mas deixaremos isso com você 🙂

E é assim que fica:

```javascript
const saveKey = () => {
  const input = document.getElementById('key_input');

  if (input) {
    const { value } = input;

    // Codifique a string
    const encodedValue = encode(value);

    // Salve no armazenamento do Google
    chrome.storage.local.set({ 'openai-key': encodedValue }, () => {
      document.getElementById('key_needed').style.display = 'none';
      document.getElementById('key_entered').style.display = 'block';
    });
  }
};
```

Estamos pegando o valor de entrada da caixa de entrada, fazendo um pouco de codificação Base64 nele (o que dificulta a leitura a olho nu), para, em seguida, definir a chave no armazenamento do Google e finalmente alterar a configuração de CSS para mostrar a caixa de diálogo "você inseriu a chave".

Você pode estar recebendo um erro do JS aqui. Ainda precisamos adicionar a função `encode`! É uma linha super simples que você irá colocar logo acima da função `saveKey`:

```javascript
const encode = (input) => {
  return btoa(input);
};
```
Como o nome da função sugere, estamos codificando qualquer coisa que seja passada adiante. `btoa` significa [Binary to ASCII](https://developer.mozilla.org/en-US/docs/Web/API/btoa), ou Binário para ASCII. Tudo o que estamos fazendo aqui é mudar o formato, o que **não** é nada seguro rsrs.

Por fim, vamos adicionar um pouco de sofisticação à função `changeKey`:

```javascript
const changeKey = () => {
  document.getElementById('key_needed').style.display = 'block';
  document.getElementById('key_entered').style.display = 'none';
};
```

Essa é uma função realmente simples que permite mostrar a IU de `key_needed` para inserir uma nova chave de API, se necessário. Mais uma vez no alvo da simplicidade… vamos lá!

Agora que temos esses dois estados diferentes. Como vamos saber qual mostrar primeiro? Na verdade, podemos escrever uma função que é executada toda vez que a extensão é aberta para verificar se há uma chave no armazenamento da extensão. Se já houver uma chave, mostre a IU de `key_entered`, caso contrário, mostre a IU de `key_needed`.

No topo do seu arquivo `index.js`, vá em frente e adicione isso:

```javascript
const checkForKey = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(['openai-key'], (result) => {
      resolve(result['openai-key']);
    });
  });
};
```

Tudo o que estamos fazendo aqui é verificar se a chave existe no nosso estado. Se ela estiver lá, vá em frente e retorne-a! Usamos uma promessa (promise) aqui porque precisamos esperar a chamada de retorno na seção `chrome.storage`. Uma vez que ela é chamada, podemos resolver nossa promessa.

Por fim, chame isso na parte inferior do seu arquivo. Todas as vezes que sua extensão for aberta, isso será executado:

```javascript
checkForKey().then((response) => {
  if (response) {
    document.getElementById('key_needed').style.display = 'none';
    document.getElementById('key_entered').style.display = 'block';
  }
});
```

Esperamos que a promessa seja resolvida e então a definimos de acordo. Se a chave estiver lá, mostre a IU `key_entered`. Melzinho na chupeta.

Escrevemos **BASTANTE**, mas na verdade não testamos nada para ver se funciona rsrs. Como você pode testar sua extensão de forma rápida e fácil? Confira estes passos:


1. **Vá para extensões** - Acesse o seu navegador e vá para `chrome://extensions` (observe que isso será diferente se você estiver usando outro navegador baseado em Chromium). Aqui você verá uma lista de extensões.
2. Certifique-se de ativar o modo de desenvolvedor no canto superior direito.
3. **Carregue a extensão descompactada** - Vamos carregar nossa extensão no navegador para realmente testá-la! Navegue até a raiz da pasta do seu projeto
4. **Deixe fluir** - Se tudo correu bem, você deve ver a sua extensão em toda a sua glória na lista de extensões!

    
![Screenshot 2022-11-27 at 5.20.23 AM.png](https://i.imgur.com/dvkOyi0.png)
    

Assim como qualquer outra extensão, você deve ser capaz de vê-la na lista de extensões! Vá em frente e clique nela para ver a mágica **acontecer** ✨.

![Screenshot 2022-11-23 at 5.14.09 PM.png](https://i.imgur.com/0h1mgyI.png)

Após pressionar o botão "Adicione chave", sua IU deverá mudar! Brinque com ela algumas vezes para garantir que esteja tudo funcionando!

E assim terminamos com a IU! Tudo o mais em nossa extensão acontecerá usando menus de contexto (a caixa que aparece quando você clica com o botão direito em qualquer lugar da Internet).

Você pode fazer todo tipo de coisa com a IU em extensões - usar o React, fazê-las aparecer para o lado… é um mundo muito irado. Mais tarde, quando terminar com o resto, volte para a IU. As barras laterais são bem divertidas de se brincar.

Uma grande observação aqui - **não há carregamento automático do código**!

Portanto, toda vez que você atualizar seu código, precisará voltar à lista, encontrar a sua extensão e pressionar o botão de atualização no canto inferior direito:

![Untitled](https://i.imgur.com/Ma9zU1C.png)

Mas isso não é tudo! Lembre-se de que as extensões são **injetadas nas guias** do seu navegador quando a guia é carregada. Apenas recarregar a extensão não é suficiente. Você também precisa atualizar a guia em que está usando a extensão. Então o fluxo será:

1. Altere o código da extensão no VS Code
2. Recarregue a extensão no seu navegador
3. Recarregue qualquer guia na qual você deseja usar a extensão
4. Clique na extensão e adicione a chave da API
5. Teste!

Você vai se acostumar com isso bem rápido!

7 em cada 10 problemas que vejo no Discord são por causa disso. Pode haver alterações que você escreveu que ainda não foram aplicadas à sua extensão. Às vezes, se você perceber que seu código não está atualizando, recomendo simplesmente excluir a extensão e carregá-la do zero.

### Por favor, faça isso, senão o Farza vai ficar triste

Faça uma postagem em #progress com uma captura de tela da sua nova e sofisticada extensão do Chrome!
