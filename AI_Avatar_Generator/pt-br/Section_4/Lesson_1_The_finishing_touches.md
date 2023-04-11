### Oculte seu identificador de sujeito exclusivo

É meio chato que seus usuários tenham que digitar "abraza" para gerar prompts personalizados. Mas isso é fácil de corrigir! Basta usar a função `replace()` do JavaScript para ocultar o identificador de sujeito dos usuários!

Antes de fazer a chamada da API em `index.js`, dentro de `generateAction`, coloque algo assim:

```jsx
const finalInput = input.replace(/raza/gi, 'abraza');

const response = await fetch('/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'image/jpeg',
  },
  body: JSON.stringify({ input: finalInput }),
});
```

`replace` recebe uma expressão regular, e é isso que o detalhe `/raza/gi` significa. Você pode usar algo como o [AutoRegex](https://www.autoregex.xyz/), que é um tradutor de expressões regulares alimentado pelo GPT, se você tiver várias grafias ou apelidos disponíveis! Na maioria das vezes, `replace("nome", "rótulo_único")` funcionará muito bem.

Você pode ler mais sobre o `replace` [aqui](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace), que é bem simples, e sobre expressões regulares [aqui](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp) (elas não são nada simples 💀).

### Gerar variações de avatares com seu prompt

Você pode ter percebido que, quando envia seu prompt na solicitação POST, recebe exatamente a mesma imagem toda vez que executar POST para essa solicitação. Isso é bom, no entanto, se você quiser obter variações diferentes do seu prompt, pode adicionar um novo cabeçalho `x-use-cache: false` aos cabeçalhos da sua solicitação POST.

Em `api/generate.js`, dentro de `generateAction`, adicione o cabeçalho `x-use-cache` na chamada `fetch` e defina-o como `false`:


```jsx
const response = await fetch(
    `https://api-inference.huggingface.co/models/buildspace/ai-avatar-generator`,
    {
        headers: {
            Authorization: `Bearer ${process.env.HF_AUTH_KEY}`,
            'Content-Type': 'application/json',
            'x-use-cache': 'false'
        },
        method: 'POST',
        body: JSON.stringify({
            inputs: input,
        }),
    }
);
```

Isso impedirá o uso da imagem anteriormente gerada e permitirá buscar uma nova imagem no ponto de extremidade da API do Hugging Face, em vez de buscar a imagem gerada anteriormente do cache.

Agora gere um avatar com um prompt na IU e gere outro com o mesmo prompt e confira as variações!

### Dê aos seus usuários alguns prompts sofisticados

Vamos conceder um pouco de sua magia aos usuários? Eles terão resultados muito melhores se você der a eles alguns prompts que possam modificar. Provavelmente, eles não conhecem todos esses artistas sofisticados, então vamos criar alguns botões que preencham esses prompts!

Eu não vou guiá-lo através disso, mas realmente tudo o que seria é um conjunto de botões que atualizam o valor do `input` em `index.js` para prompts pré-definidos.

Enquanto você estiver nisso, pode também dividir a barra de entrada em quatro partes principais - artista, técnica, vibe, descritores. Isso treinará os usuários em escrever bons prompts sem que eles percebam!

Então, você precisa construir duas coisas:
 
1. Alguns botões que preencham automaticamente o campo de entrada do prompt com prompts pré-definidos;
2. Quatro campos para cada seção. 

Aqui está uma imagem meio bagunçada de como isso pode ficar:

![https://hackmd.io/_uploads/BJ_I96Vqo.png](https://hackmd.io/_uploads/BJ_I96Vqo.png)

Tudo o que você precisa fazer é concatenar - [`concat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/concat) - os campos juntos para o prompt final. Fácil, né? 

Essas duas partes são realmente importantes! A maioria dos desenvolvedores não pensa muito em como pequenos ajustes como esses afetam a experiência do usuário. Ao ser explícito sobre o que o usuário precisa descrever, desde sua avó até seu cachorro, todos poderão gerar coisas legais.

**Projetar produtos simples exige mais trabalho do que produtos complicados e bagunçados.**

Meu projeto tem muito espaço para melhoria. Deveria o campo do artista ser um menu suspenso em vez do que temos? O que é um descritor? Como se parecem as vibes?

Deixo para você levar isso ainda mais longe, talvez armazenar imagens geradas e seus prompts em um banco de dados para que seus usuários possam ver os resultados antigos enquanto aguardam a geração de novas imagens? Isso seria bem legal!

### Como permito que outras pessoas gerem seus próprios avatares?

O grande gerador de dinheiro. Fazer as pessoas gerarem suas próprias imagens. Não há como contornar o treinamento de modelos - você precisará usar o Dreambooth para criar um modelo personalizado **para cada pessoa**. Isso **irá** custar dinheiro. A maneira como os grandes players, como o Lensa e o AvatarAI, fazem isso é alugando GPUs por meio de provedores de nuvem como AWS ou GCP.

Toda a sua operação é uma maneira programática das partes manuais que você fez nesta construção.

Se eu tivesse que adivinhar, o fluxo deles é provavelmente algo como:

1. Obter 5-10 imagens do usuário;
2. Processar imagens (redimensionar, remover fundo);
3. Ajustar o modelo do Stable Diffusion com GPUs;
4. Usar prompts predefinidos para gerar 50-100 imagens;
5. Enviar imagens para o usuário e talvez excluir o modelo.

Tudo isso é relativamente simples de fazer programaticamente. O truque aqui é obter GPUs pelo preço mais barato possível. Não sei se você pode conseguir GPUs tão baratas quanto o Lensa (US$3,49 para 100 avatares rsrs), mas a oportunidade aqui está nos passos #2 e #3, eu acho. 

Existem plataformas incríveis por aí que ajudam você a criar esses fluxos por um preço mais barato, como a [banana.dev](https://banana.dev). Certifique-se de reivindicar seu NFT no final para obter alguns créditos incríveis dessas plataformas. Talvez seja tudo o que você precisa para começar seu negócio 🤘.

## Implantando com o Railway

**GTFOL! Hora de ir para a produção.**

É hora de sair do Localhost - [GTFOL](https://www.urbandictionary.com/define.php?term=GTFOL&utm_source=buildspace.so&utm_medium=buildspace_project).

Não queremos apenas ficar no localhost, afinal. Isso seria entediante! O objetivo deste aplicativo é permitir que seus amigos e familiares criem realidades alternativas com você.

Implantar um aplicativo do NextJS ficou **SUPER** fácil - isso deve levar apenas alguns minutos - e então você terá um link para sua criação que pode compartilhar com o mundo.

Confira este vídeo para descobrir o que você precisa fazer aqui.

[https://vimeo.com/786802338](https://vimeo.com/786802338)
