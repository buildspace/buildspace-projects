
Quero revisar mais alguns tipos de prompt e, em seguida, entraremos em alguns códigos.

### Encadeamento de prompts — uma estratégia altamente subestimada

Uma coisa bem incrível que você pode fazer com o GPT-3 é o encadeamento de prompts (prompt chaining). É aqui que você usa a saída de um prompt como entrada para outro prompt.

Deixa eu te mostrar — **digamos que eu queira escrever um thread de tweets sobre startups**.

Eu realmente gosto do estilo de escrita do Paul Graham, então pedi ao GPT-3 para escrever uma dissertação sobre essa coisa que tenho pensado, onde as startups não se resumem a “resolver um problema”. Quando começamos a buildspace, não estávamos tentando resolver um problema… estávamos apenas brincando. Eu acredito que quando tudo o que fazemos é focar nos problemas, a startup perde sua alma. Para mim, acredito mais em entender o usuário.

Qual assunto você gostaria de ver em uma dissertação sobre startups? Pergunte ao Paul Graham! Crie seu próprio prompt.

Aqui está o meu prompt — deixei a frase aberta no final porque quero que o GPT-3 a complete.

```
Ajude-me a escrever uma dissertação no estilo de Paul Graham, o co-fundador da Y-Combinator.

Eu não acho que se trata sempre de "resolver um problema", às vezes vale a pena pensar sobre
```

Então, o GPT-3 completou.

```
Ajude-me a escrever uma dissertação no estilo de Paul Graham, o co-fundador da Y-Combinator.

Eu não acho que se trata sempre de "resolver um problema", às vezes vale a pena pensar no problema de uma forma diferente.

Nos primeiros dias de uma startup, muitas vezes é mais importante focar em construir algo que as pessoas querem do que na solução de um problema específico. É mais fácil mudar sua abordagem mais tarde, quando você tem uma compreensão melhor do que as pessoas querem e qual é o problema. 

É por isso que costumo encorajar os fundadores a começar construindo algo pequeno e simples, em vez de tentar resolver um grande problema desde o início. É importante obter feedback dos usuários o mais cedo possível, para validar suas suposições e corrigir o curso, se necessário. 

Claro que existem exceções a essa regra, e alguns problemas são tão grandes e complexos que faz sentido focar neles desde o início. Mas, em geral, acredito que é mais importante focar em construir algo que as pessoas desejam do que resolver um problema específico.
```

Realmente, muito bom!! Mas, eu quero transformar isso em um thread de tweets.

Deixa eu te mostrar algo irado. Abra uma nova guia com um Playground vazio. Portanto, você deve ter duas guias agora. Uma com a dissertação (Playground #1) e outra visualizações (Playground #2).

No Playground #2, vá em frente e escreva este prompt:

```
Pegue a dissertação abaixo e a transforme em um thread de tweets. Numere os tweets e mostre os intervalos entre eles.
```

Agora, abaixo disso, copie e cole a saída do Playground #1. Então, para mim o prompt fica assim:

```
Pegue a dissertação abaixo e a transforme em um thread de tweets.

Eu não acho que se trata sempre de "resolver um problema", às vezes vale a pena pensar no problema de uma forma diferente. Nos primeiros dias de uma startup, muitas vezes é mais importante focar em construir algo que as pessoas querem do que na solução de um problema específico. É mais fácil mudar sua abordagem mais tarde, quando você tem uma compreensão melhor do que as pessoas querem e qual é o problema. É por isso que costumo encorajar os fundadores a começar construindo algo pequeno e simples, em vez de tentar resolver um grande problema desde o início. É importante obter feedback dos usuários o mais cedo possível, para validar suas suposições e corrigir o curso, se necessário. Claro que existem exceções a essa regra, e alguns problemas são tão grandes e complexos que faz sentido focar neles desde o início. Mas, em geral, acredito que é mais importante focar em construir algo que as pessoas desejam do que resolver um problema específico.
```

Quando eu executo o Playground #2, eis o que é gerado:

```
1/ Eu não acho que se trata sempre de "resolver um problema". Às vezes é mais importante focar em construir algo que as pessoas querem. 

2/ É por isso que costumo encorajar os fundadores a começar construindo algo pequeno e simples, em vez de tentar resolver um grande problema desde o início.

3/ É importante obter feedback dos usuários o mais cedo possível, para validar suas suposições e corrigir o curso, se necessário.

4/ Claro que existem exceções a essa regra, e alguns problemas são tão grandes e complexos que faz sentido focar neles desde o início.

5/ Mas, em geral, acredito que é mais importante focar em construir algo que as pessoas desejam do que resolver um problema específico.
```

Muito incrível, não é? Agora você tem um thread do Twitter de 2 minutos sobre um pensamento que teve - e que parece bem legal também. Está bem conciso e claro, exatamente como Paul Graham escreve.

Agora qualquer pessoa pode ser um líder de pensamentos rsrs.

**Isso é chamado de encadeamento de prompts.** Pegamos a saída do prompt do Playground #1 e a inserimos em outro prompt especializado, no Playground #2. Você pode continuar fazendo isso, e ficará ainda melhor em uma tarefa especializada.

Por que isso funciona tão bem?

Bem, novamente, o GPT-3 se sai melhor quando: 1) você fornece mais exemplos, 2) você é altamente específico em termos do que você pede a ele. O encadeamento de prompts combina esses dois!

Aqui estão outros exemplos de prompts que você pode encadear:

- **gerar um sumário para um blog → escrever uma frase para cada seção → para cada frase, escrever dois parágrafos → pronto.**
- **gerar uma triste história de amor entre um menino e uma menina → gerar um refrão de rap → gerar um refrão que rime e tenha a letra no estilo do cantor Drake → gerar o verso de introdução e encerramento baseado no refrão → pronto.**
- **gerar título principal para a landing page (página de destino) de um produto → gerar um texto mais detalhado para o produto → gerar texto de anúncio direcionado a pessoas de 26 anos no Paquistão → pronto.**

O encadeamento de prompts é **altamente** subestimado e não é muito discutido. Ele realmente permite que você obtenha um ótimo desempenho para as tarefas específicas que você tem em mente. Um grande agradecimento ao meu amigo [Sharif](https://twitter.com/sharifshameem) por me mostrar isso!

### Crie uma startup com o GPT-3 de ponta a ponta: da ideia à apresentação aos investidores, em 5 minutos

Vamos colocar essas habilidades de prompt à prova e construir uma startup com o GPT-3, desde a ideia até a apresentação do projeto (pitch) aos investidores. Ter boas ideias é um dos maiores desafios ao iniciar uma startup, então vamos perguntar ao GPT-3!

Vou pedir boas ideias sobre “GPT-3 e leitura”, porque acho que o GPT-3 é super legal e ler é algo que todos querem fazer! Eu também pedi especificamente que ele gerasse ideias para coisas que uma criança poderia usar. Fiz isso porque dirigi uma empresa chamada [ZipSchool](https://mobile.twitter.com/FarzaTV/status/1488965852519022592), que produzia conteúdo científico para crianças.

```
Dê-me algumas ideias de startups legais relacionadas ao GPT-3 e leitura para crianças:
```

Certifique-se de pedir para gerar ideias sobre coisas que você está interessado!

Novamente, seja o mais específico possível. Qual tecnologia você quer que sua startup utilize? Qual é o público em que você está interessado? O que você realmente quer que o produto faça?

Minha saída ficou bem legal.

```
Dê-me algumas ideias de startups legais relacionadas ao GPT-3 e leitura para crianças:

1. Um aplicativo de leitura baseado no GPT-3, que pode personalizar o material de leitura para cada criança com base em seu nível de leitura, interesses e necessidades.

2. Um aplicativo baseado no GPT-3, que pode gerar material de leitura personalizado para crianças com base em seus interesses e áreas de necessidade.

3. Um aplicativo baseado no GPT-3, que pode ler em voz alta para as crianças, destacando as palavras à medida que avança, para que elas possam acompanhar.

4. Um aplicativo baseado no GPT-3, que pode responder a perguntas que as crianças possam ter sobre o material que estão lendo, ajudando-as a entender e se envolver com o texto.
```

Adorei a primeira ideia - é linda.

Imagine se as crianças pudessem aprender a ler com histórias personalizadas geradas especialmente para elas.

As histórias seriam perfeitas para elas. O GPT-3 poderia até gerar histórias que elas realmente gostassem (por exemplo, histórias de detetive, histórias de aventura, etc). As histórias até poderiam incluir os nomes dos personagens que elas inventaram, e elas poderiam estar nas próprias histórias. Além disso, poderíamos até dizer ao GPT-3 para usar certos tipos de vocabulário para garantir que o nível de leitura seja adequado.

**Antes de prosseguir, certifique-se de gerar uma ideia que você gosta, em um setor que considera interessante. Realidade virtual, criptomoedas, realidade aumentada, jogos, FinTechs, consumidor etc. Você precisará brincar muito com o setor, o público-alvo, etc. Como sempre, não me copie! Seja excelente em prompts!**

### Escreva o título principal para a landing page da sua startup fictícia

Agora, preste atenção. Eu vou usar a saída anterior e encadear em um novo prompt. Eu quero ir mais a fundo aqui e escrever um texto para a landing page. **Escrever textos para landing pages é sempre muito difícil para mim**, pois é complicado ser breve, conciso e descritivo ao mesmo tempo.

Sempre adorei o marketing e os textos da Apple! Vamos gerar algo parecido com isso:

Abra o Playground #2. Aqui está o prompt inicial:

```
Escreva uma lista de títulos principais curtos para uma landing page no estilo da Apple, para uma startup que cria o seguinte:

<insira aqui a ideia gerada acima>
```

Então, para mim, o prompt totalmente encadeado se parece com isso, e tudo o que fiz foi pegar a ideia que o GPT-3 gerou para mim. Novamente, você deve alterar seu prompt. Talvez você prefira outras marcas, como a Disney ou a Nike. Talvez você goste de títulos mais inspiradores! Novamente, você realmente só precisa dizer ao GPT-3 o que deseja.

```
Escreva uma lista de títulos principais curtos para uma landing page no estilo da Apple, para uma startup que cria o seguinte:

Um aplicativo de leitura baseado no GPT-3, que pode personalizar o material de leitura para cada criança com base em seu nível de leitura, interesses e necessidades.
```

Eis o que foi gerado para mim:

```
1. O aplicativo definitivo de leitura para crianças - alimentado pelo GPT-3!
2. Personalize o material de leitura para cada criança - com base em seu nível de leitura, interesses e necessidades.
3. O aplicativo de leitura perfeito para crianças de todas as idades e habilidades!
4. Faça com que seus filhos leiam com a ajuda do GPT-3!
5. O melhor aplicativo de leitura para crianças - alimentado pelo GPT-3!
```

Muito bom! Mas nós podemos fazer algo melhor. No prompt, devemos incluir para quem é este produto! Afinal, uma landing page geralmente é bem otimizada para um tipo de usuário específico.

Vou especificar que é para pais, porque imagino que vou estar direcionando minha campanha principalmente para pais que dão o aplicativo para seus filhos pequenos. Também não quero palavras confusas nele, como "GPT-3", pois a maioria das pessoas nem sabe o que é isso.

Não vou me aprofundar muito mais neste exemplo, mas certifique-se de experimentar por si mesmo.

Se você quiser dar uma olhada, aqui está o meu prompt:

```
Escreva uma lista de títulos principais curtos para uma landing page no estilo da Apple, para uma startup. Escreva o texto para atrair os pais com filhos no jardim de infância. Não inclua termos confusos nele, como GPT-3. A startup cria:

<insira aqui a ideia gerada acima>
```

### Escreva uma apresentação!

Incrível! Agora temos uma ideia + um título principal para a landing page. Agora só precisamos criar um plano de negócios e levantar algum dinheiro de alguns investidores! Mas caramba, escrever apresentações é difícil. É hora de pedir ao GPT-3 para fazer uma para nós.

Aqui está o prompt que criei. Preencha com sua ideia de startup que o GPT-3 gerou acima. Eu também incluo as peças básicas de uma apresentação que o Y-Combinator diz para incluir [aqui](https://www.ycombinator.com/library/2u-how-to-build-your-seed-round-pitch-deck).

```
Escreva uma apresentação direcionada a um investidor para uma startup que inclua o problema que está sendo solucionado, a solução, o tamanho do mercado e o plano de negócios. Esta startup cria um:
```

Aqui está meu prompt completo com a ideia abaixo. Sinta-se à vontade para editar a ideia que o GPT-3 gerou, se necessário. Se você sentir que deseja reformular a ideia ou se tiver outra ideia, basta alterar o prompt conforme necessário:

```
Escreva uma apresentação direcionada a um investidor para uma startup que inclua o problema que está sendo solucionado, a solução, o tamanho do mercado e o plano de negócios. Esta startup cria um: Aplicativo de leitura alimentado pelo GPT-3, que pode personalizar o material de leitura para cada criança com base em seu nível de leitura, interesses e necessidades. 
```

Uma vez que eu executo isso, a saída é bem impressionante:

```
Olá,

Nossa startup está desenvolvendo um aplicativo de leitura alimentado pelo GPT-3, que pode personalizar o material de leitura para cada criança com base em seu nível de leitura, interesses e necessidades. Usando processamento de linguagem natural e aprendizado de máquina, nosso aplicativo é capaz de fornecer uma experiência de leitura personalizada para cada criança.

O mercado de aplicativos de leitura está crescendo rapidamente e deve valer 2.4 bilhões de dólares até 2025. Nosso aplicativo estará disponível por uma assinatura mensal de 9,99 dólares.

Temos uma equipe forte de desenvolvedores e educadores experientes que estão comprometidos em tornar nosso aplicativo o melhor possível. Temos um plano de negócios claro e confiamos em nossa capacidade de executá-lo.

Gostaríamos de ter a oportunidade de apresentar nossa startup e responder a quaisquer perguntas que você possa ter. Obrigado pelo seu tempo!
```

**O GPT-3 literalmente escreveu uma apresentação melhor do que 99% dos fundadores rsrs.**

Ele inclui todas as coisas boas - o tamanho do mercado, o plano de negócios, a equipe etc. Inclui até o fato de que o aplicativo iria custar 9,99 dólares por mês rsrs. No entanto, ele poderia ter feito um trabalho melhor na explicação do problema que o produto resolve. Mas, podemos apenas mudar nosso prompt e dizer ao GPT-3 para garantir que ele se concentre mais nisso.

Mais uma vez, sua apresentação gerada pode não estar boa o suficiente agora. Aproveite o tempo para brincar com o prompt.

Seja bem específico com o GPT-3 — *“inclua uma descrição da assinatura mensal”*, *“inclua uma descrição do tamanho do mercado”*, *“inclua como planejamos gastar o dinheiro”*, etc. Você pode até fazer coisas como *“Escreva um e-mail para apresentar a startup para um investidor, no estilo de Paul Graham”* ou qualquer outro fundador que você considere legítimo!

Sempre que você ler a saída e pensar: “Nossa! Eu gostaria que o GPT-3 tivesse me dado mais de X” - basta literalmente pedir para o GPT-3 fazer a coisa X!!

### Vamos construir algo de verdade

Espero que essa tenha sido uma aventura divertida para você - minha esperança é que você esteja transbordando de ideias sobre coisas legais que pode criar. Um site para ajudar as pessoas a escrever textos para landing pages, um aplicativo para ajudar as pessoas a escrever tweets melhores, uma ferramenta para ajudar os roteiristas a criar mundos mais interessantes, etc.

Os casos de uso com o GPT-3 são literalmente infinitos e eu só abordei alguns. Caramba, essa coisa pode até gerar RegEx para você — [confira esse aplicativo construído por um de nossos ex-alunos](https://twitter.com/gd3kr/status/1545370626273120256) que se tornou **viral**.

Eu ainda nem mostrei as coisas que ele pode fazer com códigos! [Este](https://www.buildgpt3.com/) é um site muito bom! Recomendo que você navegue por ele para obter mais exemplos de prompts e casos de uso + demonstrações.

Ei! Eu até dei a você uma ideia de startup gratuita com este aplicativo de leitura para crianças que gera histórias com o GPT-3 rsrs. Também dei a você um exemplo de e-mail gratuito para enviar aos investidores! Espero que um de vocês consiga arrecadar alguns milhões com isso rsrs.

Atualização: um de nossos ex-alunos está [trabalhando em um aplicativo desses agora](https://onceuponabot.com/). Por enquanto, você pode usá-lo gratuitamente!

### Por favor, faça isso, senão o Farza vai ficar triste

Tem ideias para algo que você gostaria de construir? Eu sei que este projeto é intitulado “construa seu assistente de escrita de IA”, mas sinta-se à vontade para construir o que você quiser rsrs. Algumas ideias malucas aleatórias:

- Um treinador esportivo de IA, onde as pessoas podem escolher quem querem como seu treinador. Imagine o Goku dando conselhos para seus treinos e criando seus planos de treinamento.
- Um assistente de escrita para o Notion, que ajuda as pessoas a escrever documentos de produtos claros - ele usaria a especificação como entrada e produziria uma versão da especificação mais clara e mais acionável.
- Uma ferramenta que gera títulos realmente bons para vídeos do YouTube e faz testes A/B automáticos para ver qual deles obtém mais visualizações.
- Um gerador de receitas que pega a lista de ingredientes da sua geladeira e gera uma receita de algo que você pode fazer com ela.

As ideias são infinitas.

Antes de seguir adiante, crie sua própria ideia maluca que você acha que seria legal. Quando criar uma, poste-a em #ideas. Sinta-se à vontade para conferir o canal em busca de ideias que outras pessoas tiveram, bem como para inspiração!

*P.S: A maioria das ideias pode ser testada rapidamente no Playground. Sempre que tiver uma ideia, escreva um prompt rápido para ela no Playground e veja como fica. Vamos iterar!*
