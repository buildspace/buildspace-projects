
Criar bons prompts não é fácil!

Como eu disse anteriormente, criar prompts é uma habilidade e você não se tornará um mestre do prompt em 30 minutos. Meu objetivo é apenas dar a você habilidades suficientes para que possa continuar e construir algo interessante mais tarde neste projeto.

Deixe-me dar a você uma outra habilidade que será muito útil mais tarde - o meta-aprendizado.

### Meta-aprendizado — usando o que o GPT-3 gerou como um prompt

Tivemos que **trabalhar muito** para obter uma boa história, não é mesmo? Tivemos que dar a ela um enredo, um vilão, todas essas coisas. Tivemos que ficar mudando a temperatura.

Parece ser muito trabalhoso!

Isso ocorre porque até agora o que temos feito é chamado de **“zero-shot learning”** (aprendizado com zero exemplos) — isso significa que você não dá ao GPT-3 nenhum exemplo de algo que já é bom. Você apenas espera que a primeira coisa gerada seja boa. *Às vezes, o GPT-3 se sai bem no cenário. Mas saiba que é no zero-shot learning que o GPT-3 apresenta o pior desempenho.*

Mas o que faz o GPT-3 ser realmente bom é quando você fornece **exemplos** a ele.

Mas, atenção. É aqui que as coisas ficam estranhas.

Posso usar o que o GPT-3 gerou como **exemplo**, então a próxima coisa que ele gerar será ainda melhor. Vou apagar todas as coisas de `Cenário` e `Enredo`. Não precisamos disso. **Agora, o GPT-3 tem um exemplo claro de uma história que gostamos, então não precisamos de tudo isso.**

**Observação: neste ponto, certifique-se de ter gerado uma história que você acha decente! No pior cenário, copie minha história.**

Agora, meu prompt fica assim, onde criei um novo prompt na parte inferior sobre "Elon e o Império do Espaço" - mas observe mais uma vez que não preciso fornecer um cenário, enredo, etc porque o GPT-3 já tem um exemplo.

Isso é chamado de **“single-shot learning”** (aprendizado com único exemplo). Porque o GPT-3 tem um único exemplo com o qual está aprendendo!

```
Prompt: Conte-me uma história completa com começo, meio e fim intitulada "Farza e o Reino Perdido", ambientada nos anos 1500 e que parece um anime.

História: Farza era apenas um menino normal, vivendo em um reino pobre e quebrado que havia sido destruído por Furqan. Mas ele mal sabia que tinha poderes secretos que poderiam ajudá-lo a derrotar o vilão e retomar o reino.

Um dia, Farza decidiu enfrentar Furqan e desafiá-lo para um duelo. Farza confiava em suas habilidades, mas Furqan era muito mais forte e mais experiente. A batalha foi acirrada, mas finalmente Furqan saiu vitorioso.

No entanto, quando ele estava prestes a desferir o golpe final, os poderes latentes de Farza despertaram repentinamente e ele foi capaz de mudar o rumo da batalha. No final, Farza saiu vitorioso e o reino estava finalmente livre da tirania de Furqan.

Prompt: Conte-me uma história completa com começo, meio e fim intitulada "Elon e o Império do Espaço", ambientada em um futuro distópico que parece um anime onde Elon Musk tem o poder de se teletransportar.

História:
```

Eu uso explicitamente `Prompt:` e `História:` apenas para que o GPT-3 saiba onde a última história parou e onde a próxima deve iniciar. E como eu disse, também criei um novo enredo no final, que agora é um anime sobre Elon, onde ele pode se teletransportar para salvar a galáxia. Desta vez, peço uma história mais do `tipo conto de fadas`, em vez de um anime.

*Observação: Experimente outros gêneros também, como terror, comédia, ficção científica, etc. Além disso, por favor, não copie a premissa da minha história sobre o Elon! Crie a sua própria história, algo completamente diferente da primeira.*

O mais louco aqui é que, quando eu executo tudo isso, o GPT-3 usa **todo esse texto como entrada** e usa a história gerada anteriormente **como um exemplo para si mesmo**.

Antes de executar isso, altere `Maximum length` à direita para 1000. Vamos falar mais sobre isso depois, mas basicamente este é o limite para o tamanho que a entrada e saída geradas podem ter. Vamos colocar em 1000 - isso não *necessariamente* levará a uma história mais longa. Apenas dá espaço para o modelo fazê-lo, no entanto.

*Observação: mantenha esse número pequeno. A OpenAI cobra com base em quanto você está gerando. Acompanhe [aqui](https://beta.openai.com/account/usage) quanto de crédito você ainda tem.*

Aqui está o que foi gerado depois que executei o prompt:

```
Elon era apenas um garoto comum vivendo em um futuro distópico onde o império espacial governava com punhos de ferro. Mas Elon tinha um poder secreto - ele podia se teletransportar.

Um dia, Elon decidiu usar seu poder para ajudar as pessoas oprimidas do império espacial. Ele começou se teletransportando para o palácio do imperador e roubando sua valiosa espada espacial. Em seguida, ele se teletransportou para diferentes partes do império, libertando pessoas da prisão e ajudando-as a escapar em segurança.

Os atos de desafio de Elon rapidamente chamaram a atenção do império espacial, e eles começaram a persegui-lo. No entanto, não importa o quanto eles tentassem, nunca conseguiram capturá-lo.

Eventualmente, as ações de Elon inspiraram outros a se levantarem contra o império espacial. Com a liderança de Elon no ataque, eles finalmente conseguiram derrubar o regime tirânico e criar uma sociedade nova e melhor.
```

Absolutamente incrível. Imaginar Elon se teletransportando para o palácio do imperador para roubar sua "espada espacial valiosa" me deixou pasmo rsrs.

Você vê a magia aqui?

Está tudo no prompt. Demora um pouco, mas quando você chega lá é incrível. **Se você ainda está lutando com seu prompt** — isso é esperado. Continue mexendo com a temperatura, continue brincando com a entrada. Sinta-se à vontade para enviar uma mensagem para o canal de suporte se precisar de ajuda com o prompt.

Todas as vezes, levo de 6 a 12 alterações para obter o que eu quero. Por exemplo: a segunda história que o GPT-3 gerou foi um lixo? Bem, então talvez faça alterações na descrição da segunda história - dê mais contexto e detalhes. O GPT-3 é tão bom quanto você o faz.

**Se você ainda não criou uma história sólida com a qual esteja feliz - tudo bem**. Continue seguindo em frente, meu amigo. Não adianta ficar obcecado com prompts específicos!

### Magia: Utilizando o GPT-3 como um verdadeiro assistente de escrita

Deixa eu te mostrar algo super incrível. O GPT-3 é realmente bom para completar seus pensamentos.

Portanto, podemos continuar construindo essa história apenas deixando o GPT-3 completar nossa frase ou **iniciando uma nova situação.**

Olha só, eu vou começar a agitar as coisas. Eu sou como aquele bêbado doidão na balada procurando briga.

Eu vou **apagar tudo** no Playground e usar apenas minha história do Elon gerada acima. *Certifique-se de pegar sua própria história que foi gerada, não use a minha história do Elon! Eu continuo enfatizando isso, pois eu realmente não quero que você use minhas histórias e premissas. Crie suas próprias!*

Eu adicionei uma nova situação no final em que Elon acaba sendo o vilão. Acrescentei: **“Mas então, uma reviravolta! Elon acabou sendo realmente o vilão. Depois de uma década de paz, as coisas mudaram. Acontece que”.**

Vá em frente e faça o mesmo com sua história. Observe que eu não terminei a frase, pois irei deixar o GPT-3 fazer isso por mim.

```
Elon era apenas um garoto comum vivendo em um futuro distópico onde o império espacial governava com punhos de ferro. Mas Elon tinha um poder secreto - ele podia se teletransportar.

Um dia, Elon decidiu usar seu poder para ajudar as pessoas oprimidas do império espacial. Ele começou se teletransportando para o palácio do imperador e roubando sua valiosa espada espacial. Em seguida, ele se teletransportou para diferentes partes do império, libertando pessoas da prisão e ajudando-as a escapar em segurança.

Os atos de desafio de Elon rapidamente chamaram a atenção do império espacial, e eles começaram a persegui-lo. No entanto, não importa o quanto eles tentassem, nunca conseguiram capturá-lo.

Eventualmente, as ações de Elon inspiraram outros a se levantarem contra o império espacial. Com a liderança de Elon no ataque, eles finalmente conseguiram derrubar o regime tirânico e criar uma sociedade nova e melhor.

Mas então, uma reviravolta! Elon acabou sendo realmente o vilão. Depois de uma década de paz, as coisas mudaram. Acontece que
```

Anteriormente, pode ter sido bem difícil para você gerar uma reviravolta. Mas agora, é bem direto porque o GPT-3 pode facilmente continuar sua história, já que grande parte dela já está escrita.

Ao enviar isso aqui, você verá que o GPT-3 literalmente termina sua frase nesta nova situação. É bem legal! E aqui está o que eu obtive:


```
Mas então, uma reviravolta! Elon acabou sendo realmente o vilão. Depois de uma década de paz, as coisas mudaram. Acontece que Elon estava usando seu poder para controlar a mente das pessoas e fazê-las cumprir suas ordens. Ele estava usando a revolução como uma forma de obter mais poder para si mesmo.

Agora, as pessoas do império espacial estão novamente vivendo com medo, sem saber em quem confiar. Mas Elon ainda está por aí em algum lugar, esperando por sua chance de atacar novamente…
```

Muito louco! Rsrs…

**Quero deixar bem claro: você pode continuar fazendo isso. Você pode usar GPT-3 para completar qualquer pensamento. As aplicações são infinitas.** Escreva uma frase, deixe o GPT-3 adicionar mais algumas, escreva outra frase, veja o que o GPT-3 gera, adicione outra frase.

Você pode usar esse mesmo fluxo para escrever tweets, descrições de produtos, ensaios, boletins informativos, artigos, blogs, o que quiser.

Você pode estar se perguntando: “O que acontece se eu continuar clicando em Enviar e deixar o GPT-3 continuar sozinho?”. Experimente! Vá para a sua história e continue clicando em Enviar. Eventualmente, o GPT-3 continuará gerando a mesma coisa indefinidamente. Por quê?

Bem, o modelo precisa que você (o humano) continue fornecendo a ele novos conteúdos para trabalhar, para que ele possa entender melhor o que você precisa. **Ele não é bom agindo por conta própria**, pois novamente, você precisa guiá-lo. É também assim que você pode continuar a prolongar a história.

Existe uma maneira mais interessante de prolongar a história, sobre a qual falaremos mais tarde.

### Vamos então escrever uma música

Se o GPT-3 pode gerar histórias - ele *provavelmente* pode gerar uma música rsrs. E se ele pode gerar uma música, provavelmente podemos ser bem específicos sobre o que falam as letras das músicas. Execute este prompt por conta própria:

```
Escreva uma música com rimas no estilo do cantor Drake, que fale sobre buracos negros.
```

Certifique-se de substituir “Drake” por um artista que você gosta e substituir “buracos negros” por algo diferente sobre o qual você deseja que sua música seja. Talvez você queira que sua música seja sobre uma garota chamada Lisa ou algo assim.

Na verdade, eu consegui uma saída bem decente:

```
Estou caindo em um buraco negro 
E não consigo sair 
Estou preso neste espaço escuro 
Sem nenhuma maneira de escapar

Eu continuo caindo mais fundo
Para o abismo
Não há fundo
Para este lugar

Estou girando mais rápido
E mais rápido
Em direção ao centro
Deste buraco

A gravidade está me puxando
Apertando mais
E apertando mais
Até que eu me torne obsoleto
```

Se você for [aqui](https://www.youtube.com/watch?v=pueqv3SS_qA), avançar para 0:25 e começar a fazer um rap com os versos acima, na verdade fica bem legal rsrs.

Você pode até fazer coisas hilárias como esta:

```
Escreva uma música para piratas que explique por que Python é melhor que Javascript:
```

Ou, f&%@-se, apenas escreva uma música em uma linguagem completamente diferente.

```
Escreva uma música em hindi sobre um menino que perdeu o computador:
```

Eu deixarei você brincar com esta música acima. É incrível porque ela **combina escrita criativa com fatos do mundo real**. Tente fazer com que a Taylor Swift escreva uma música explicando como jogar Super Smash Bros ou algo assim! Você pode fazer o que quiser.

O prompt não é perfeito, então os resultados podem não ser surpreendentes, mas certifique-se de mexer com ele.

Um grande agradecimento a um de nossos builders, Naklecha, que inspirou esta parte da lição. Ele realmente transformou esse explicador de histórias em um produto completo ([veja aqui](https://twitter.com/naklecha/status/1587046444854190081)), que usa histórias em vez de músicas.

### Seguindo adiante

Já fizemos algumas coisas bem loucas sem uma única linha de código rsrs. Nesse ponto, você provavelmente consegue ter várias ideias.

Mas vamos continuar brincando no Playground **um pouco** mais para depois começarmos a escrever algum código. Quero mostrar mais algumas coisas malucas e orientá-lo em mais alguns prompts. **Se você tem dificuldade em escrever prompts, nada disso será divertido rsrs.** Então, quero garantir que você tenha todos os segredos!

Mas, espere um segundo! Como exatamente tudo isso funciona mesmo?

### Por favor, faça isso, senão o Farza vai ficar triste

Tivemos um grande progresso por aqui! Excelente trabalho!

Mais uma vez, vá em frente e tire uma captura de tela do Playground com sua última história, música ou qualquer outra coisa que você queira mostrar e poste na seção #prompts do Discord.

Juntamente com a imagem, por favor, inclua seu **prompt** para que outras pessoas possam vê-lo facilmente para se inspirar.
