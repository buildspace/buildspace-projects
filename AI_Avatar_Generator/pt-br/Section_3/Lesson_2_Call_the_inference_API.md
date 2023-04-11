É hora de escrever a lógica que vai realmente chamar nossa API. Vamos voltar à função `generateAction` e começar adicionando isso:

```jsx
const generateAction = async () => {
  console.log('Gerando...');

  // Adicione a solicitação de busca (fetch)
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });

  const data = await response.json();
};
```

O primeiro bloco de código é a parte que realmente irá para a internet e dirá "ei `/api/generate`, você pode pegar minha entrada e me dar uma imagem de volta?" Assim que recebermos uma resposta, queremos convertê-la para o formato `JSON` para que possamos verificar algumas coisas diferentes.

Beleza, vamos continuar. Adicione este código logo abaixo de onde você está convertendo a resposta para `JSON`:

```jsx
const generateAction = async () => {
  console.log('Gerando...');

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });
  
  const data = await response.json();

  // Se o modelo ainda estiver carregando, diminua o tempo da tentativa.
  if (response.status === 503) {
    console.log('O modelo ainda está carregando. :(')
    return;
  }

  // Se ocorrer outro erro, mostre um erro.
  if (!response.ok) {
    console.log(`Erro: ${data.error}`);
    return;
  }
};
```

Nesse bloco, estamos verificando dois estados diferentes - `503` e `ok` (que é realmente apenas o código de status `200`).

Lembra quando estávamos testando nosso modelo no Hugging Face com sua IU e às vezes ela tinha um indicador de carregamento dizendo "O modelo está carregando"? Bem, o Hugging Face retornará um status `503` se esse for o caso! Na verdade, é muito bom, porque podemos lidar com isso sem problemas.

Então, estamos verificando se há outros erros e, se houver, certifique-se de capturar e mostrar esses erros.

Se tudo correr bem (como sempre deveria, certo?), vamos pegar nossa imagem e salvá-la no estado para exibição.

Certo. Em primeiro lugar, vamos criar uma nova propriedade de estado chamada `img`:

```jsx
const Home = () => {
  const [input, setInput] = useState('');
  // Criar nova propriedade de estado
  const [img, setImg] = useState(''); 
  
  // resto do código
}

export default Home;
```
Depois de definir tudo, podemos voltar para a função `generateAction` e adicionar esta linha ao final dela:

```jsx
const generateAction = async () => {
  console.log('Gerando...');

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });
  
  const data = await response.json();

  if (response.status === 503) {
    console.log('O modelo ainda está carregando...');
    return;
  }

  if (!response.ok) {
    console.log(`Erro: ${data.error}`);
    return;
  }

  // Defina dados de imagem na propriedade de estado
  setImg(data.image);
};
```

E pronto! Neste ponto, você está usando Fetch com sucesso para enviar uma solicitação para a Internet. Bem mágico, né?

Digite algo em sua entrada, dê uma olhada e... espere um segundo... está tudo quebrado rsrs.

![https://hackmd.io/_uploads/BJxjF6Nqo.png](https://hackmd.io/_uploads/BJxjF6Nqo.png)

Recebemos um erro `404`? Um erro `404` geralmente significa que o ponto de extremidade (ou API) não pôde ser encontrado! Há um passo muito importante que estamos deixando passar aqui - que é **realmente escrever o código da API**.

A beleza do `Next.js` é que você pode facilmente criar funções sem servidor (serverless functions) dentro do mesmo projeto e não se preocupar com qualquer hospedagem / manutenção de servidores / etc. É incrivelmente legal e feito apenas criando arquivos e escrevendo algum código neles! Para fazer essa coisa funcionar, vamos em frente e escrever nosso primeiro ponto de extremidade :).

Vá em frente e comece criando uma nova pasta no diretório `pages` chamada `api`. Dentro dessa pasta, você vai criar um novo arquivo chamado `generate.js`.

O incrível do `Next.js` é como ele usa a estrutura de pastas para definir seu caminho de API. Por exemplo, acabamos de criar uma pasta chamada `api` e dentro dessa pasta um arquivo chamado `generate`. Se você voltar ao seu arquivo `index.js`, notará que o ponto de extremidade da API que estamos chamando é `api/generate`. Ele literalmente usa a estrutura de pasta!

Certo, bem incrível! Vamos escrever um pouco de código. A primeira coisa a fazer é escrever uma função que será executada quando atingirmos esse ponto de extremidade:

```jsx
const generateAction = async (req, res) => {
  console.log('Solicitação recebida')
}

export default generateAction;
```

Você começará a ver muitas semelhanças aqui conforme avançamos, mas igual ao que fizemos antes, vamos registrar algumas coisas quando isso for chamado. A única diferença é que essas declarações de log aparecerão no seu terminal, onde você executou o comando `npm run dev`.

Depois de configurar isso, vá em frente e execute novamente o comando `npm run dev` e pressione o botão gerar.

![https://hackmd.io/_uploads/Byb3YaV9i.png](https://hackmd.io/_uploads/Byb3YaV9i.png)

Se você inspecionar a aba de rede, verá sua solicitação passando. **Excelente**! Vemos grandes mudanças aqui. 

Você pode notar que ela fica presa em “pendente”, mas não se preocupe, vamos consertar isso em breve :). Você também deve perceber que no terminal do VS Code, "Solicitação recebida" foi impresso!

Agora que sabemos que estamos recebendo solicitações de nosso frontend, vamos realmente fazer as coisas que precisamos fazer rsrs.

Dentro da função `generateAction`, vamos começar pegando a entrada de nossa solicitação. Lembra que estamos enviando o texto de entrada quando enviamos a solicitação? Podemos pegá-lo assim:

```jsx
const generateAction = async (req, res) => {
  console.log('Solicitação recebida');
  // Pegar a entrada do corpo da requisição
  const input = JSON.parse(req.body).input;
};

export default generateAction;
```

Neste ponto, teremos a entrada que foi enviada pela IU e podemos usá-la para chamar nossa API de inferência no Hugging Face. Para isso, vamos escrever outra solicitação fetch.

Vou colocar o código aqui e explicar mais detalhes:

```jsx
const generateAction = async (req, res) => {
  console.log('Solicitação recebida');

  const input = JSON.parse(req.body).input;

  // Adicione a solicitação fetch para o Hugging Face
  const response = await fetch(
    `https://api-inference.huggingface.co/models/buildspace/ai-avatar-generator`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: input,
      }),
    }
  );
};

export default generateAction;
```

Isso deve ser bem parecido com o que vimos no frontend, exceto com algumas adições!

Primeiro - o url. Este url é o caminho que aponta para o seu modelo do Hugging face. Este é o meu caminho, mas para encontrar o seu tudo que você precisa é isto:

`https://api-inference.huggingface.co/models/{NOME_DO_USUÁRIO}/{NOME_DO_MODELO}`

A próxima coisa que você notará é que há um objeto `headers` em nossa solicitação. Para que o Hugging Face nos permita usar sua API de inferência, precisamos ter uma chave de API associada à nossa conta. Essa chave informará ao Hugging Face que estamos autorizados a acessar essa API de inferência, **então certifique-se de mantê-la em segredo**.

Acesse a página de [tokens](https://huggingface.co/settings/tokens) e obtenha um token de gravação - você pode usar o mesmo que gerou para o Colab. Ele funcionará bem.

Na nossa função `generateAction`, você verá uma sintaxe estranha que se parece com `process.env.HF_AUTH_KEY`. Esta é uma maneira especial para o `Next.js` ler chaves secretas como esta sem expô-la ao usuário! Imagine se todo mundo pudesse ver sua senha toda vez que você fizesse login em um site? Isso ajuda a evitar essa situação!

Para começar, dê uma olhada no arquivo `.example.env`. Isso foi criado para mostrar como precisamos configurar corretamente nossa chave da API. Crie um novo arquivo chamado `.env` na raiz do seu projeto e use a mesma configuração assim:

```jsx
HF_AUTH_KEY=SUA_CHAVE_DE_API_AQUI
```

Não se esqueça de interromper o processo no terminal pressionando `CMD/CTRL` + `C` e executar novamente o comando `npm run dev` para garantir que o arquivo seja compilado com seu projeto, caso contrário, ele pode não ser detectado!

**CERTO** – agora a última coisa aqui é a propriedade chamada `body`. É aqui que vamos pegar a entrada que recebemos do usuário e passá-la para o Hugging Face! Você pode notar que o objeto tem essa propriedade chamada `inputs`.

Se você voltar para o seu modelo no site do Hugging Face, abra o inspetor de rede e execute outra conversão de texto para imagem.

![https://hackmd.io/_uploads/SygpY6N9o.png](https://hackmd.io/_uploads/SygpY6N9o.png)

Na carga útil (payload), você verá que ela espera que a propriedade `inputs` seja o texto que você digitou! Isso é legal, porque você acabou de fazer engenharia reversa - pegando habilidades daqui e dali! [Você também pode explorar a documentação detalhada dos parâmetros de inferência da API aqui.](https://huggingface.co/docs/api-inference/detailed_parameters) :)

Ok, ok, ok - estamos quase prontos para executar isso. Vamos adicionar **MAIS** algumas verificações antes de tentarmos pela primeira vez. Dê uma olhada neste código abaixo e coloque-o sob o seu fetch:

```jsx
const generateAction = async (req, res) => {
  console.log('Solicitação recebida');

  const input = JSON.parse(req.body).input;

  const response = await fetch(
    `https://api-inference.huggingface.co/models/buildspace/ai-avatar-generator`,
    {
      headers: {
        Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        inputs: input,
      }),
    }
  );

  // Verifique os diferentes status para enviar a carga útil adequada
  if (response.ok) {
    const buffer = await response.arrayBuffer();
    res.status(200).json({ image: buffer });
  } else if (response.status === 503) {
    const json = await response.json();
    res.status(503).json(json);
  } else {
    const json = await response.json();
    res.status(response.status).json({ error: response.statusText });
  }
};

export default generateAction;
```

Isso deve ser bem autoexplicativo - estamos verificando três status diferentes: `ok`, `503` e qualquer outro erro! Vamos analisar isso um pouco mais:

`ok` - lembre-se de que essencialmente é qualquer código de status bem-sucedido, como um `200`. Isso significa que a chamada foi um sucesso e deve retornar a imagem. Agora, a parte interessante aqui é converter nossa resposta em um `arrayBuffer`. Para definirmos nossa imagem em nossa IU, precisamos convertê-la em uma forma que nossa IU possa ler. Vamos começar com um ArrayBuffer e ver o que acontece. :)

`503` - receberemos isso quando nosso modelo ainda estiver sendo carregado. Essa resposta incluirá duas propriedades - `error` e `estimated_time`. `error` será apenas uma mensagem informando o que está acontecendo e o `estimated_time` é quanto tempo pode levar para carregar o modelo. Em breve, usaremos o `estimated_time` para configurar um método de tentativa novamente, então mantenha isso em mente!

`qualquer outro erro` - se houver outros erros, envie-os de volta para nossa IU com o problema - este item é fácil.

**OK! EXCELENTE!** Estamos em um bom ponto para testar nossa primeira execução aqui. Vamos em frente, ver o que acontece e continuar a construir a partir daí! Sugiro manter a aba da rede aberta para que você possa ver sua solicitação passar e ser concluída. :)

Escreva um prompt, clique em Gerar e vamos ver o que acontece:

![https://hackmd.io/_uploads/SyARF64qo.png](https://hackmd.io/_uploads/SyARF64qo.png)

Caramba! Assim mesmo, eu recebi uma resposta! Você pode ver aqui que eu não tive problemas em responder com meu ArrayBuffer!

Agora, vamos mudar um pouco o prompt - uau, recebemos um 503 😅. Parece que nosso modelo ainda está sendo carregado aqui:

![https://hackmd.io/_uploads/B1ag5aVqi.png](https://hackmd.io/_uploads/B1ag5aVqi.png)

Hmmm, então temos um problema, não é mesmo? Quando recebemos um `503`, precisamos fazer a solicitação novamente quando achamos que o modelo foi carregado.

Bem, temos o tempo estimado restante, por que não enviamos uma solicitação depois de esperar x segundos?

Vamos voltar para o nosso arquivo `index.js` e começar adicionando três coisas - uma propriedade `maxRetries`, uma propriedade `retryCount` e uma propriedade `retry`:

```jsx
const Home = () => {
  // Não tente novamente mais de 20 vezes
  const maxRetries = 20;
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  // Números de novas tentativas 
  const [retry, setRetry] = useState(0);
  // Números de novas tentativas restantes
  const [retryCount, setRetryCount] = useState(maxRetries);
  // resto do código
}

export default Home;
```

Ok, muitas novas propriedades foram introduzidas aqui - mas deixe-me explicar. Sabemos que quando recebemos um `503`, recebemos o número (em segundos) de quanto tempo levará para o modelo ser carregado. Esse número pode mudar, então vamos certificar de definir isso em uma propriedade de estado, `retry`.

Podemos usar essa propriedade para configurar um temporizador para esperar x segundos, mas às vezes os modelos podem levar até 10 minutos para serem carregados na memória (uma das limitações de uma instância gratuita como esta) e não queremos continuar a fazer spam neste ponto de extremidade por 10 minutos.

É aí que entra `maxRetries`. Depois de 20 tentativas, vamos apenas deixar uma mensagem no console dizendo - "ei, você precisa esperar mais tempo para que isso seja carregado antes de tentar fazer uma solicitação".

Finalmente, controlamos as tentativas restantes com a propriedade `retryCount`! Após cada solicitação, contaremos esse número de forma decrescente.

Agora que temos isso sob controle, vamos adicionar um pouco de código à nossa função `generateAction` em `index.js`:

```jsx
const generateAction = async () => {
    console.log('Gerando...');

    // Se for uma solicitação de nova tentativa, retry, remova retryCount
    if (retry > 0) {
      setRetryCount((prevState) => {
        if (prevState === 0) {
          return 0;
        } else {
          return prevState - 1;
        }
      });

      setRetry(0);
    }

    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: JSON.stringify({ input }),
    });

    const data = await response.json();

    if (response.status === 503) {
      // Defina a propriedade estimated_time no estado
      setRetry(data.estimated_time);
      return;
    }

    if (!response.ok) {
      console.log(`Erro: ${data.error}`);
      return;
    }

    setImg(data.image);
  };
```

No início do arquivo `index.js`, você perceberá que verificamos se `retry` é maior que 0. Se for, definimos nossa propriedade `retryCount` como um valor menor, já que estamos prestes a fazer outra chamada para a API de inferência. Então, definimos `retry` de volta para 0.

Em seguida, você perceberá que definimos `retry` com o valor de `estimated_time`. Agora sabemos quanto tempo devemos esperar antes de fazer essa solicitação novamente!

Legal! Agora o problema é: onde realmente chamamos essa propriedade `retry`? Tudo o que fizemos foi lidar com isso em uma nova tentativa.

Para isso, vamos usar o `useEffect` do React. O que queremos que aconteça é o acionamento de uma nova tentativa quando a propriedade `retry` mudar. `useEffect` é perfeito para isso porque ele executará algum código sempre que uma determinada propriedade mudar (assim como `retry`).

Comece importando o `useEffect` no topo do arquivo `index.js`:

```jsx
// Adicione o useEffect aqui
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {...}

export default Home
```

Agora, logo acima da nossa função de renderização, vamos adicionar isto:

```jsx
const Home = () => {
	const maxRetries = 20;
  const [input, setInput] = useState('');
  const [img, setImg] = useState('');
  const [retry, setRetry] = useState(0);
  const [retryCount, setRetryCount] = useState(maxRetries);
  const onChange = (event) => {
    setInput(event.target.value);
  };
  
  const generateAction = async () => {...}
  
    // Adicione o useEffect aqui
  useEffect(() => {
    const runRetry = async () => {
      if (retryCount === 0) {
        console.log(`O Modelo ainda está carregando após ${maxRetries} tentativas. Tente solicitar novamente em 5 minutos.`);
        setRetryCount(maxRetries);
        return;
        }

      console.log(`Tentando novamente em ${retry} segundos.`);

      await sleep(retry * 1000);

      await generateAction();
    };

    if (retry === 0) {
      return;
    }

    runRetry();
  }, [retry]);
	
  return (
    // resto do código
    );
};
```

Este código pode parecer confuso, mas eu te ajudo a entender. Vamos lá:

```jsx
if (retryCount === 0) {
  console.log(
    `O Modelo ainda está carregando após ${maxRetries} tentativas. Tente solicitar novamente em 5 minutos.`
  );
  setRetryCount(maxRetries);
  return;
}
```

Você consegue ver essa função dentro de outra função? Isso é bem estranho rsrs.

Não se preocupe muito com o porquê disso estar aqui, mas basicamente precisamos executar uma função assíncrona - `async` - dentro de um `useEffect` e é assim que fazemos!

Esta função é a parte principal. Aqui, primeiro verificamos se `retryCount` é 0, se for, não executamos mais solicitações. Bem simples!

```jsx
console.log(`Tentando novamente em ${retry} segundos.`);

await sleep(retry * 1000);
```

Se tivermos algumas tentativas restantes, precisamos esperar um tempo para executar o `retry`. É aí que a função `sleep` entra em jogo! Você pode ter percebido que nunca a definimos, então vamos adicioná-la logo acima do nosso `useEffect`, assim:

```jsx
const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};
```

Estamos usando uma implementação sofisticada de `setTimeout` para permitir que ele "durma" ou "espere" até continuar! As promises, ou promessas, são um recurso incrível do Javascript — [dê uma olhada mais profunda nelas aqui](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) se estiver interessado!

```jsx
await generateAction();
```

Finalmente, se estamos prontos para seguir em frente, chamamos `generateAction`! Isso percorrerá as verificações iniciais que escrevemos naquela função. :)

Algumas coisas a mais para observar neste `useEffect`:

```jsx
if (retry === 0) {
  return;
}

runRetry();
```

Queremos realmente executar `runRetry` quando a propriedade `retry` mudar. A única coisa que precisamos verificar é se `retry` é 0, já que a propriedade é inicializada com 0.

Então, se olharmos para trás, isso é o que acabou de acontecer:

- Escrevemos nossa API `generate` e vamos capturar se recebermos um `503`;
- Se recebermos um `503`, vamos reenviar a solicitação em x segundos, definindo a propriedade `retry`;
- Uma vez que `retry` é definido, verifique se atingimos `maxRetries`, se não, execute a solicitação após x segundos.

Isso é um material de desenvolvimento web bem avançado, então dê parabéns a si mesmo antes de executar isso. Há muita coisa acontecendo aqui e você acabou de construir tudo isso - **excelente**!

Certo, vamos abrir nosso console no navegador e tentar executar um prompt novamente:

![https://hackmd.io/_uploads/B1DMc6Vqo.png](https://hackmd.io/_uploads/B1DMc6Vqo.png)

Caramba, você está executando as novas tentativas. Isso é incrível! Agora isso vai continuar até você receber uma resposta de imagem. 🤘

Você pode perceber ao executar isso que a IU parece **SUPER** confusa. A única maneira de saber se algo está acontecendo é se você abrir o console rsrs. Você não vai pedir para sua mãe abrir o console do navegador dela, certo? Vamos consertar isso adicionando um indicador de carregamento!

Comece criando uma nova propriedade de estado chamada `isGenerating` onde declaramos todos os nossos outros estados:

```jsx
const maxRetries = 20;
const [input, setInput] = useState('');
const [img, setImg] = useState('');
const [retry, setRetry] = useState(0);
const [retryCount, setRetryCount] = useState(maxRetries);
// Adicione o estado isGenerating 
const [isGenerating, setIsGenerating] = useState(false);
```

Então, vá para a função `generateAction` e adicione esses itens:

```jsx
const generateAction = async () => {
  console.log('Gerando...');

  // Adicione esta verificação para garantir que não haja clique duplo
  if (isGenerating && retry === 0) return;

  // O carregamento começou
  setIsGenerating(true);

  if (retry > 0) {
    setRetryCount((prevState) => {
      if (prevState === 0) {
        return 0;
      } else {
        return prevState - 1;
      }
    });

    setRetry(0);
  }

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'image/jpeg',
    },
    body: JSON.stringify({ input }),
  });

  const data = await response.json();

  if (response.status === 503) {
    setRetry(data.estimated_time);
    return;
  }

  if (!response.ok) {
    console.log(`Erro: ${data.error}`);
    // Pare o carregamento
    setIsGenerating(false);
    return;
  }

  setImg(data.image);
  // Tudo pronto - pare o carregamento!
  setIsGenerating(false);
};
```

Como você pode ver aqui, há quatro pontos diferentes que vamos usar neste estado. Agora que estamos alterando esta propriedade, vamos fazer algo com ela. Vá para sua função de renderização, vá para a div `prompt-buttons` e adicione isto:

```jsx
<div className="prompt-container">
  <input className="prompt-box" value={input} onChange={onChange} />
  <div className="prompt-buttons">
    {/* Ajuste classNames para alterar as classes. */}
    <a
      className={
        isGenerating ? 'generate-button loading' : 'generate-button'
      }
      onClick={generateAction}
    >
      {/* Ajuste para mostrar um indicador de carregamento. */}
      <div className="generate">
        {isGenerating ? (
          <span className="loader"></span>
        ) : (
          <p>Gerar</p>
        )}
      </div>
    </a>
  </div>
</div>
```

Muitas das definições CSS em torno deste indicador de carregamento estão localizadas em `styles/styles.css`, então verifique e altere para se adequar ao seu fluxo e vibe.

Agora que temos um indicador de carregamento definido, vamos testar novamente - digite outro prompt e deixe rolar:

![https://hackmd.io/_uploads/rJ27cpE9i.png](https://hackmd.io/_uploads/rJ27cpE9i.png)

Aeee! O indicador de carregamento está funcionando como esperado! Incrível.

**Nossa**. Eu sei que isso foi bem extenso, mas você merece os créditos. Você passou por uma das partes mais difíceis deste programa.

### Por favor, faça isso, senão o Raza ficará triste

Este é um momento bem legal. Vá para o canal `#progress` no Discord e compartilhe uma captura de tela da sua aplicação web que você está executando! Se você vir a de outra pessoa, deixe um feedback para ela também. :)
