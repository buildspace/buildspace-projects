

A primeira coisa que você precisa fazer é descobrir seu **prompt-base**. Basicamente, a fórmula aqui é:

```
finalPrompt = basePrompt + userInput
```

Então, `finalPrompt` é o que enviamos para o GPT-3 a partir de nossa API. Lembre-se, o problema agora é **que não temos um `basePrompt`**. Tudo o que estamos fazendo é enviar o `userInput` para o GPT-3.

Por exemplo, digamos que você esteja construindo um site que gera receitas saudáveis com base em uma lista de ingredientes fornecidos pelo usuário. Você pode imaginar que o usuário lhe dará algo parecido com isso:


```jsx
brócolis, frango, arroz, feijão, maionese, páprica
```

Se tudo o que fizermos for enviar isso para o GPT-3, ele não terá ideia do que fazer.

Isso significa que você precisaria de um prompt-base que **espera** por esse tipo de entrada. Aqui está um prompt-base simples que testei no Playground com base no exemplo acima:

```
Escreva uma receita detalhada passo a passo de um chef profissional para algo saudável que eu possa fazer com os seguintes ingredientes:

brócolis, frango, páprica, arroz, azeite, manteiga, alho, salsa, ovos

1. Aqueça uma frigideira grande.
2. Enquanto isso, corte o brócolis em pequenos floretes.
3. Tempere os peitos de frango com páprica, sal e pimenta.
4. Na frigideira, aqueça o azeite em fogo médio-alto.
5. Adicione o frango à frigideira e cozinhe até que fique dourado e cozido por completo, cerca de 4 minutos de cada lado.
6. Retire o frango da frigideira e reserve.
7. Na frigideira, derreta a manteiga em fogo médio.
8. Adicione o alho e cozinhe até ficar perfumado, cerca de 1 minuto.
9. Adicione o brócolis e cozinhe até ficar macio, cerca de 5 minutos.
10. Adicione o frango cozido de volta à frigideira.
11. Misture o arroz cozido e a salsa.
12. Faça 4 cavidades na mistura de arroz e quebre um ovo em cada cavidade.
13. Cubra a frigideira e cozinhe até que os ovos estejam cozidos ao seu gosto, cerca de 5 minutos.
14. Sirva imediatamente.
```

Muito legal! Nesse caso, meu `basePrompt` é:

```
Escreva uma receita detalhada passo a passo de um chef profissional para algo saudável que eu possa fazer com os seguintes ingredientes:
```

E meu `userInput` é:

```
brócolis, frango, páprica, arroz, azeite, manteiga, alho, salsa, ovos
```

Então, vejamos mais um exemplo no qual estou trabalhando – um gerador de postagem de blog. Eu brinquei no Playground e descobri que este prompt funcionou muito bem para mim:

```
Escreva uma postagem de blog no estilo de Paul Graham com o título abaixo. Certifique-se de que a postagem do blog se aprofunde no tópico e mostre que o escritor fez sua pesquisa.

Título: Os Prós e Contras dos Grandes Modelos de Linguagem

Os modelos de linguagem são um tipo de inteligência artificial usado para prever a próxima palavra em uma sequência. Eles são treinados em grandes quantidades de dados, e quanto maior for o conjunto de dados de treinamento, mais precisas serão as previsões.

Existem várias vantagens em usar grandes modelos de linguagem. Primeiro, eles podem lidar com sequências longas de texto, o que é importante para tarefas como tradução e resumo. Segundo, eles podem aprender com uma grande variedade de fontes de dados, incluindo textos formais e informais. Isso permite que eles capturem as nuances do uso da linguagem, o que é difícil para modelos menores.

No entanto, grandes modelos de linguagem também têm várias desvantagens. Primeiro, eles requerem muita potência computacional, o que pode ser caro. Em segundo lugar, podem ser mais difíceis de interpretar do que modelos menores, tornando difícil entender por que eles fazem certas previsões. Finalmente, podem ser tendenciosos em relação aos dados de treinamento, que podem não ser representativos do mundo real.

No geral, grandes modelos de linguagem têm tanto vantagens quanto desvantagens. Embora possam ser muito poderosos, também apresentam alguns riscos. Ao decidir se deve ou não usar um grande modelo de linguagem, é importante ponderar os prós e contras cuidadosamente.
```

Então, neste caso, meu `basePrompt` foi:

```
Escreva uma postagem de blog no estilo de Paul Graham com o título abaixo. Certifique-se de que a postagem do blog se aprofunde no tópico e mostre que o escritor fez sua pesquisa.

Título:
```

E meu `userInput` foi o título abaixo. Essa é a parte que muda! Nossos usuários podem nos dar a entrada que quiserem. Mas, nosso prompt-base não muda. 

```
Os Prós e Contras dos Grandes Modelos de Linguagem
```

Antes de prosseguir, descubra o `basePrompt` para o que quer que esteja trabalhando. Se você está com dificuldades, pergunte-se primeiro: **"O que meu usuário está inserindo?"** A partir daí, você pode trabalhar de trás para frente e pensar em um prompt realmente bom para o GPT-3.

**Passe cerca de 5 a 10 minutos no Playground e faça algumas descobertas de prompt**, e não se esqueça de brincar com seus hiperparâmetros! Para mim, descobri que uma temperatura de `0,8` e um comprimento máximo de `500` funcionam muito bem.

Mas, novamente, seus resultados serão muito diferentes porque você tem seu próprio caso de uso, então apenas brinque um pouco com isso.

### Adicione seu prompt-base à sua API

Legal! Neste ponto, você deve ter um `basePrompt` para seu caso de uso. Anote também seus hiperparâmetros. A próxima coisa que precisamos fazer é adicionar algumas coisas novas ao arquivo `api/generate.js`.

Tudo o que você precisa fazer é colar seu prompt-base em `basePromptPrefix`.

Então, para mim, é assim que fica:

```jsx
const basePromptPrefix =
`
Escreva uma postagem de blog no estilo de Paul Graham com o título abaixo. Certifique-se de que a postagem do blog se aprofunde no tópico e mostre que o escritor fez sua pesquisa.

Título:
`
```

*Observação: aqui eu uso o acento grave em vez de aspas; isso é chamado de [template literal](https://www.w3schools.com/js/js_string_templates.asp). Basicamente, se usássemos apenas as aspas, as novas linhas não seriam respeitadas - seria apenas uma grande frase sem novas linhas. E eu quero novas linhas no meu prompt!*

E, acredite ou não, é tudo o que você precisa fazer! Em nosso prompt, já fazemos:

```
prompt: `${basePromptPrefix}${req.body.userInput}`
```

Isso combinará o prompt-base com o que o usuário nos der.

Na verdade, vou adicionar um `\n` a isso no final. Por quê? Bem, o GPT-3 tem um desempenho melhor em tarefas de geração quando sabe onde começar a escrever. Portanto, neste caso, deixo especificado para que comece a escrever em uma nova linha:

```
prompt: `${basePromptPrefix}${req.body.userInput}\n`
```

**Por exemplo, se eu não tivesse isso**, o GPT-3 começaria a escrever diretamente após o meu título e na mesma linha, então poderia tentar completar automaticamente meu título em vez de escrever minha postagem real!

Mas saiba que isso não é necessário para todos os casos de uso e também depende do que você está fazendo. Talvez você queira que o GPT-3 complete uma frase automaticamente, caso em que faz sentido **não** ter um `\n`.

Por exemplo, se você tem este prompt:

```
Meu nome é Abraham Lincoln e minha opinião sobre ${req.body.userInput} é que
```

**Observação: este é um exemplo de prompt em que eu injeto a entrada do usuário no meio do prompt-base.**

Neste caso acima, queremos que Lincoln comece a falar depois disso, então não precisaríamos de uma nova linha aqui.

Por último, se você quiser mudar `temperature` ou `max_tokens` em `generate.js`, vá em frente! Na verdade, defino `max_tokens` em `1250`, pois quero que o GPT-3 me dê postagens mais longas.

*Observação: lembre-se! Só porque você aumentou `max_tokens` não significa que você obterá saídas mais longas magicamente. Tudo depende do prompt.*

### Testando!

Você agora deve ser capaz de acessar e testar o seu aplicativo da web. Eu também alterei o `placeholder` do meu elemento `textarea` com um exemplo de título de postagem de blog para ajudar o usuário a entender o que ele poderia digitar. Você deveria fazer o mesmo!

Se necessário, altere também o subtítulo. Deixe claro para o usuário o que ele precisa fazer para obter bons resultados do seu prompt.

![Untitled](https://i.imgur.com/GXLzBtx.png)

### Melhorando seu prompt + encadeamento de prompts

**Aviso: se você acabar tendo dificuldades com esta parte, sinta-se à vontade para ignorá-la completamente e ir para a próxima seção. Ela não é obrigatória, mas fará com que seus resultados sejam muito melhores. No entanto, é difícil porque requer muita experimentação/engenharia de prompt no Playground. Além disso, se suas habilidades em JS não forem tão boas, o código nesta seção também pode ser bem difícil para você.** 

Legal, você conseguiu fazer algo funcionar! 

*Agora você só precisa passar um tempo melhorando seu prompt. Já mostrei vários truques nesta compilação. Por exemplo, no momento estou utilizando o zero-shot learning, onde não estou dando exemplos para meu prompt! Mesmo que eu utilizasse o single-shot learning, meus resultados melhorariam muito.* 

O principal truque que lhe mostrei e que pode aumentar em 10 vezes a qualidade dos seus resultados é o **encadeamento de prompts**.

Não posso ajudá-lo diretamente com seu prompt, porque o prompt de cada pessoa é bem diferente. Mas, mostrarei como usei o encadeamento de prompts para aumentar em 10 vezes meus resultados. E você também poderá aplicar meus aprendizados ao seu projeto!

*Observação: talvez você já esteja satisfeito com seus resultados. Se for esse o caso, legal! Eu ainda recomendo que você explore o encadeamento de prompts, pois você nunca sabe o que pode obter.*

Então, olha só o que eu fiz. Fui ao Playground e:

1. No Playground #1, fiz meu primeiro prompt gerar um sumário para o meu post do blog.
2. No Playground #2, criei um segundo prompt para pegar esse sumário do Playground #1 e gerar um post completo para o blog com base nele.

**No encadeamento de prompts, a saída do seu primeiro prompt gera conteúdo que seu segundo prompt pode usar para gerar ainda mais conteúdo.** Novamente, será diferente para cada um de vocês.

Aqui estão meus dois prompts que criei após muita experimentação:

Prompt #1:

```
Escreva um sumário detalhado para uma postagem de blog com o título abaixo.

Título: TÍTULO_DO_USUÁRIO_VAI_AQUI
```

Prompt #2:

```
Pegue o sumário e o título da postagem do blog abaixo e gere uma postagem de blog escrita no estilo de Paul Graham. Faça parecer uma história. Não apenas liste os pontos. Mergulhe fundo em cada um. Explique o porquê.

Título: TÍTULO_DO_USUÁRIO_VAI_AQUI

Sumário: SAÍDA_DO_PROMPT_UM_AQUI

Postagem de blog:
```

Meu segundo prompt constrói sobre o meu primeiro prompt, e é isso que você também precisa fazer para o seu próprio caso de uso. É meio complicado, mas você consegue.

**Então, meus novos prompts acabaram gerando resultados incrivelmente bons para mim que eram 10 vezes melhores do que meu prompt anterior.** Eu apenas brinquei um pouco com isso em dois Playgrounds. Experimente o encadeamento de prompts no seu caso de uso! Veja o que acontece.

### Adicione o encadeamento de prompts à sua API

Agora, vamos configurar tudo em `api/generate.js`!

O seu será **bem** diferente porque você terá prompts diferentes! Mas, mais uma vez, vou mostrar como fiz o meu para que você possa usar a mesma estratégia para o seu.

Precisamos encadear duas solicitações de API. Assim como você está usando dois Playgrounds e copiando e colando resultados, precisamos fazer a mesma coisa, mas tudo programaticamente. Aqui está o que vamos fazer:

1. A Solicitação de API #1 leva o Prompt #1 + entrada do usuário
2. A Solicitação de API #2 leva o Prompt #2 + resposta da Solicitação de API #1.

Aqui está o meu código atualizado em `generate.js`, onde adicionei comentários para explicar o que estou fazendo!

```jsx
const basePromptPrefix =
`
Escreva um sumário detalhado para uma postagem de blog com o título abaixo.

Título:
`

const generateAction = async (req, res) => {
  console.log(`API: ${basePromptPrefix}${req.body.userInput}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}${req.body.userInput}`,
    temperature: 0.8,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // Aqui construo o Prompt #2
  const secondPrompt = 
  `
  Pegue o sumário e o título da postagem do blog abaixo e gere uma postagem de blog escrita no estilo de Paul Graham. Faça parecer uma história. Não apenas liste os pontos. Mergulhe fundo em cada um. Explique o porquê.

  Título: ${req.body.userInput}

  Sumário: ${basePromptOutput.text}

  Postagem de blog:
  `
  
  // Eu chamo a API da OpenAI uma segunda vez com o prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // Eu defino uma temperatura mais alta para este. Você decide!
    temperature: 0.85,
	  // Eu também aumento max_tokens
    max_tokens: 1250,
  });
  
  // Obtenha a saída
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  // Envie a saída do prompt #2 para nossa IU em vez da saída do prompt #1.
  res.status(200).json({ output: secondPromptOutput });
};

export default generateAction;
```

A linha mais importante aqui é const `secondPrompt`. É aqui que "construo" meu segundo prompt com base na saída de `basePromptOutput`. Também uso `${req.body.userInput}` aqui para fornecer ainda mais contexto para o meu modelo. No final, altero o resultado JSON final para `{ output: secondPromptOutput }`, para que meu usuário veja a saída do segundo prompt em nossa IU.

Aliás, nenhuma mudança na IU é necessária aqui. Tudo o que estamos fazendo é alterando o backend.

Então... como está o seu produto agora? O meu está absolutamente incrível rsrs. Ele tem criado algumas postagens de blog de alta qualidade sobre tudo, desde anime até fissão nuclear e conselhos sobre relacionamento. Coisa linda!

### Por favor, faça isso, senão o Farza vai ficar triste

Você chegou bem longe! Estou orgulhoso de você. **Dê a si mesmo um tapinha nas costas, você está fazendo coisas insanas!!** Vá em frente e tire uma captura de tela do seu aplicativo da web com um de seus prompts e saídas favoritos e poste em #progress. Quero ver todas as coisas incríveis que vocês estão gerando rsrs.

Além disso, é hora de **conseguir seu primeiro usuário**. Se você tiver alguém por perto, mostre o que você está fazendo (ex. mãe, amigo, colega de quarto, etc)! Chame-os, mostre o que você construiu e peça para eles brincarem com o seu aplicativo da web. Veja o que eles dizem!

