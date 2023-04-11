Estamos chegando ao final disso tudo! Configuramos uma IU, chamamos nossa API de Inferência e lidamos com cenários para quando nosso modelo estiver carregando. Acho que é hora de realmente exibir esta imagem na IU, certo?

Vamos começar adicionando alguns elementos de IU em nossa função de renderização assim:

```jsx
<div className="root">
  <Head>
    <title>Gerador de imagens engraçada | buildspace</title>
  </Head>
  <div className="container">
    <div className="header">
      <div className="header-title">
        <h1>Gerador de imagens engraçada</h1>
      </div>
      <div className="header-subtitle">
        <h2>
          Transforme-me em quem você quiser! Certifique-se de se referir a mim como "abraza" no prompt
        </h2>
      </div>
      <div className="prompt-container">
        <input className="prompt-box" value={input} onChange={onChange} />
        <div className="prompt-buttons">
          <a
            className={
              isGenerating ? 'generate-button loading' : 'generate-button'
            }
            onClick={generateAction}
          >
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
    </div>
    {/* Adicione o contêiner de saída */}
    {img && (
      <div className="output-content">
        <Image src={img} width={512} height={512} alt={input} />
      </div>
    )}
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

Próximo ao final, você verá uma lógica que diz: "se houver algo na propriedade `img`, exiba esta imagem".

Incrível! E se deixarmos isso um pouco mais legal? Quando pressionarmos "gerar", vamos remover o prompt da caixa de entrada e exibi-lo abaixo da imagem que mostramos em nossa IU!

Para fazer isso, crie mais uma propriedade de estado chamada `finalPrompt` assim:

```jsx
const maxRetries = 20;
const [input, setInput] = useState('');
const [img, setImg] = useState('');
const [retry, setRetry] = useState(0);
const [retryCount, setRetryCount] = useState(maxRetries);
const [isGenerating, setIsGenerating] = useState(false);
// Adicione o novo estado aqui
const [finalPrompt, setFinalPrompt] = useState('');
```

Agora que temos isso, vá para a função `generateAction` e adicione esta linha no final disso:

```jsx
const generateAction = async () => {
    console.log('Gerando...');

    if (isGenerating && retry === 0) return;

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
      setIsGenerating(false);
      return;
    }

    // Defina o prompt final aqui
    setFinalPrompt(input);
    // Remova o conteúdo da caixa de entrada
    setInput('');
    setImg(data.image);
    setIsGenerating(false);
  };
```

Pegamos a entrada e a definimos como uma nova propriedade e, finalmente, a removemos da entrada atual.

Depois de concluirmos isso, temos mais uma coisa a fazer - exibir a imagem! Vá até onde você declarou onde exibirá a imagem e adicione isso:

```jsx
{img && (
  <div className="output-content">
    <Image src={img} width={512} height={512} alt={finalPrompt} />
    {/* Adicione o prompt aqui  */}
    <p>{finalPrompt}</p>
  </div>
)}
```

Vamos lá! Estamos prontos para exibir algumas imagens, e isso é realmente emocionante. Vamos rodar um prompt e ver nossa imagem em toda a sua glória:

![https://hackmd.io/_uploads/rk_NcaVci.png](https://hackmd.io/_uploads/rk_NcaVci.png)

Espera aí... O que aconteceu? A exibição da imagem está quebrada demais rsrs.

Na verdade, há mais uma coisa que precisamos fazer para que isso funcione corretamente. Se você se lembra de nossa API, onde estávamos retornando um `ArrayBuffer` para nosso frontend. Bem, para exibir uma imagem, precisamos converter esse `ArrayBuffer` em uma string `base64`. Essa é a única maneira de nosso frontend entender que isso é uma imagem!

Para isso, vamos voltar para o `generate.js` e criar uma nova função chamada `bufferToBase64`:

```jsx
const bufferToBase64 = (buffer) => {
  let arr = new Uint8Array(buffer);
  const base64 = btoa(
    arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
  )
  return `data:image/png;base64,${base64}`;
};
```

Esta é uma função super simples, que recebe um `arrayBuffer` e adiciona alguns decoradores de imagem para que nossa IU saiba que é uma imagem!

Agora, pegue essa função e, dentro da nossa `generateAction`, adicione esta função na resposta `ok`:

```jsx
const generateAction = async (req, res) => {
  console.log('Requisição recebida');

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

  if (response.ok) {
    const buffer = await response.arrayBuffer();
    // Converta para base64
    const base64 = bufferToBase64(buffer);
    // Certifique-se de mudar para base64
    res.status(200).json({ image: base64 });
  } else if (response.status === 503) {
    const json = await response.json();
    res.status(503).json(json);
  } else {
    const json = await response.json();
    res.status(response.status).json({ error: response.statusText });
  }
};
```

**OK** - AGORA isso vai funcionar (prometo hehe). Execute mais uma vez e veja toda a glória do seu aplicativo web tomar forma 🥲. 

![https://hackmd.io/_uploads/ByhHqTVci.png](https://hackmd.io/_uploads/ByhHqTVci.png)

Tire um momento para olhar para as últimas coisas que você fez. Talvez você não soubesse nada sobre como treinar modelos e agora treinou o seu próprio (muito impressionante, para ser sincero)!

Agora você pode pegar este site e melhorá-lo. Você até pode começar a ganhar dinheiro com ele!

Na próxima seção, vou te dar algumas ideias que podem aprimorar ainda mais sua página atual.
