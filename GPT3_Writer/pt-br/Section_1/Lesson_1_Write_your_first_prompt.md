
Como fazemos em todas as coisas da buildspace, vamos apenas mergulhar sem explicar nada rsrs. Acho que você entenderá muito disso rapidamente, assim que começar a mexer com o projeto.

### Tenha acesso à OpenAI

A primeira coisa que você precisa fazer é criar uma conta na OpenAI [aqui](https://beta.openai.com/playground). Depois de criar uma nova conta, a OpenAI depositará $18 em créditos em sua conta. Isso é mais do que suficiente para você mexer, construir seu produto e até mesmo oferecer suporte a cerca de 100 usuários. Bem incrível.

Depois de criar uma conta, vá para o [Playground](https://beta.openai.com/playground). É aqui que vamos gastar um pouco de tempo antes mesmo de começarmos a escrever qualquer código.

Não se preocupe muito ainda com aquelas configurações à direita, nós chegaremos a elas. Apenas certifique-se de que seu modelo seja `text-davinci-003` e de que a “Temperatura” esteja definida como `0.7`. **E também certifique-se de que `Maximum length` (comprimento máximo) esteja definido como `650`.**

*Observação: se você já teve uma conta no passado, precisará criar uma nova com um e-mail e número de telefone diferentes, pois os créditos expiram depois de 3 meses.*

### Mentalidade de Prompt

Um “prompt” é o que você insere no GPT-3.

Quero deixar algo muito claro sobre algo — **os próximos 30 minutos podem ser super mágicos ou podem ser dolorosos.** Os prompts podem ser realmente irritantes de escrever e só quero que você saiba disso.

A engenharia de prompts é uma habilidade - você não será bom nisso no começo, e está tudo bem. Apenas certifique-se de continuar evoluindo. **Lembre-se, seu objetivo é entregar este projeto. Nada mais.** Não se prenda em tentar fazer **uma** coisa funcionar.

Algumas dicas que gostaria de ter tido quando estava aprendendo a engenharia de prompts:

- Bons resultados não virão imediatamente. Eu levo de 6 a 12 tentativas para chegar a um ponto em que acho decente. Não espere mágica na primeira tentativa.
- Itere rapidamente e não fique muito apegado a prompts específicos com os quais você está trabalhando.
- Se sua saída não ficar parecida com a minha, está tudo bem. A saída do GPT-3 pode mesmo variar muito com base em algumas palavras.
- Não fique obcecado em tentar fazer um prompt específico funcionar. Após 6-12 tentativas, sinta-se à vontade para dizer f@*#-se e: a) iniciar o prompt do zero e alterá-lo significativamente ou b) seguir para a próxima lição.

### Crie seus primeiros prompts para contar uma história

Tudo o que você precisa para começar é dar um prompt ao GPT-3, que é o texto inicial que você insere em português simples. Pode parecer estranho, mas o prompt de texto é, na verdade, como você “programa” o modelo.

Quero que você tenha uma ideia do processo de experimentação de um prompt que começa simples e fica mais complexo. E primeiramente iremos fazer com que o GPT-3 produza uma história personalizada. Vamos lá!

No playground, insira o seguinte:

```
Escreva alguns títulos de anime.
```

Aqui está o que ele me dá:

```
Escreva alguns títulos de anime.

1. Attack on Titan
2. Death Note
3. Naruto
4. One Piece
5. Tokyo Ghoul
```

*Observação: o que você vê pode ser diferente, porque cada vez que o GPT-3 é executado, há aleatoriedade injetada no modelo, portanto, as saídas serão diferentes.*

Muito legal - esses são animes que realmente existem. Isso porque o GPT-3 foi treinado com uma imensa quantidade de textos da internet. Não se esqueça de pedir a ele para escrever outras coisas para você (ex. algo sobre filmes, música, qualquer coisa).

Mas eu quero algo **mais** personalizado! Quero títulos para um **novo** anime que me tenha como personagem principal. Vá em frente e exclua tudo do Playground.

Vou mudar meu prompt.

```
Me dê títulos de anime sobre um garoto chamado Farza.
```

**Certifique-se de alterar seu prompt para ser sobre você.** Eu direi isso muitas vezes durante esta compilação. Por favor, não copie minhas instruções palavra por palavra. Se tudo o que você está fazendo é copiar e colar, isso será uma total perda de tempo.

Use seu próprio nome. Talvez você não queira títulos de “anime”, talvez queira títulos de filmes de “ficção científica”. Talvez você não queira títulos sobre “um menino”, talvez queira títulos sobre um “dragão”. Seja criativo. Veja o que acontece.

Quando executo meu prompt, recebo:

```
Me dê títulos de anime sobre um garoto chamado Farza.

1. Farza e os Sete Mares

2. Farza e o Reino Perdido

3. Farza e a Busca pelo Santo Graal

4. Farza e a Última Cruzada

5. Farza e a Viagem ao Novo Mundo

6. Farza e a Terra dos Dragões

7. Farza e a Torre de Babel
```

Bem legal! Mas ainda não parece super personalizado. Eu sinto que já ouvi essas histórias antes. Elas não parecem realmente novas. **Precisamos dar mais informações ao GPT-3 sobre o que queremos.**

Por enquanto, eu meio que gosto de “Farza e o Reino Perdido” - então, vou pegar esse título e agora criar um prompt simples para produzir uma história. Mais uma vez, por favor, não copie e cole meus prompts - use seu próprio nome, seu próprio cenário etc. Talvez você queira que sua história seja ambientada no espaço ou debaixo d'água, ou talvez você queira que sua história inclua Elon Musk como seu amigo de aventuras - faça o que quiser.

**Apenas não me copie.** Se você utilizar apenas o que eu lhe der, não será tão mágico. Você precisa ter certeza de incluir seus próprios interesses nos prompts. Somente assim você sentirá a magia.

```
Conte-me uma história intitulada "Farza e o Reino Perdido", ambientada nos anos 1500 e que parece um anime.
```

Eis o que eu obtenho:

```
Conte-me uma história intitulada "Farza e o Reino Perdido", ambientada nos anos 1500 e que parece um anime.

Farza era uma jovem menina que vivia no século 1500 em um pequeno reino que estava prestes a ser conquistado por um reino maior. Um dia, ela encontrou uma passagem  secreta que a levou a um reino perdido que estava escondido do resto do mundo. Este reino estava cheio de criaturas mágicas e tesouros, e Farza rapidamente percebeu que ela era a única que sabia sobre ele. Ela decidiu manter isso em segredo e jurou proteger o reino e seus habitantes. Ao longo dos anos, ela se tornou uma poderosa feiticeira e liderou o reino à segurança.

```

Isso é muito louco. **O mais incrível é que o GPT-3 entende o que é a estrutura de uma boa história.** Esta é uma base bem legal, agora tudo o que preciso fazer é fornecer ao prompt um pouco mais de informação.

Por exemplo - neste caso, o GPT-3 pensa que Farza é uma menina, eu sou um menino! Além disso, adoro a ideia de um reino perdido estar cheio de coisas secretas e mágicas, então vou manter isso. Também adoro a ideia de que o reino foi conquistado por alguém diferente.

Mas, eu sinto que a história precisa de um vilão.

Vamos fazer acontecer.

Eu mudo meu prompt para fornecer mais informações: Quem é Farza? Qual é o cenário? Quem é o vilão? Qual é a trama básica que eu quero? 

```
Conte-me uma história intitulada "Farza e o Reino Perdido", ambientada nos anos 1500 e que parece um anime.

Farza: um garoto de 26 anos que não sabe que possui poderes secretos.
Cenário: um reino pobre e quebrado, que foi destruído por Furqan.
Furqan: o vilão da história, é uma figura misteriosa com poderes malucos.
Enredo: Farza quer derrotar Furqan e recuperar o reino.

História:
```

*Observação: eu digo especificamente ao GPT-3 onde quero que minha história comece, escrevendo `História:`. Isso simplesmente ajuda o GPT-3 a entender que queremos que ele comece imediatamente a produzir a história.*

Observe todas as informações que dou GPT-3 aqui! `Farza`, `Cenário`, `Furqan`, e `Enredo`. Faço isso porque estou tentando explicar ao GPT-3 o que eu quero. Novamente, queremos apenas ser o mais específico possível e literalmente dizer ao GPT-3 o que queremos. Ele pode fazer todo o pensamento criativo, mas **precisamos dar a ele diretrizes básicas**.

**Certifique-se de criar seu próprio cenário, enredo, vilão, etc.**

Dica para facilitar esta parte: *pense em seus programas favoritos, filmes preferidos, etc.* Misture e combine elementos deles. É aí que isso fica divertido rsrs. Talvez seu cenário seja do seu filme de ficção científica favorito, seu enredo seja de um livro que você gosta e seu vilão seja Elon Musk, Tom Cruise ou alguma pessoa real aleatória rsrs.

Aqui está o que vejo quando executo o prompt:

```
Conte-me uma história intitulada "Farza e o Reino Perdido", ambientada nos anos 1500 e que parece um anime.

Farza: um garoto de 26 anos que não sabe que possui poderes secretos.
Cenário: um reino pobre e quebrado, que foi destruído por Furqan.
Furqan: o vilão da história, é uma figura misteriosa com poderes malucos.
Enredo: Farza quer derrotar Furqan e recuperar o reino.

História:

Farza sempre foi um pouco estranho. Ele nasceu em um vilarejo na periferia do reino e nunca realmente se encaixou. Ele sempre sonhou acordado com aventuras e emoções, mas tudo sempre parecia muito fora de alcance.

Um dia, Farza se deparou com uma caverna escondida. Dentro dela, ele encontrou uma espada mágica. Quando ele pegou a espada, sentiu uma onda de poder. De repente, ele percebeu que estava destinado a fazer coisas grandiosas.

Ele partiu em uma jornada para encontrar Furqan, o feiticeiro malvado que havia destruído o reino. Ao longo do caminho, fez novos amigos e descobriu seus próprios poderes ocultos.

Eventualmente, ele confrontou Furqan e conseguiu derrotá-lo. Ele recuperou o reino e se tornou seu governante legítimo.

A história de Farza é de coragem, determinação e esperança. É um conto inspirado em anime sobre um menino que encontrou forças para salvar seu reino.
```

**Que irado!**

O GPT-3 criou toda essa ideia de uma **caverna escondida**, **uma espada mágica**... tudo isso. Parece literalmente um anime. Nesse ritmo, talvez eu pegue [os 10 milhões de dólares que acabamos de arrecadar](https://buildspace.so/raise) e gaste transformando a buildspace em um estúdio de anime rsrs.

### Algumas recomendações

Quando eu comecei a mexer com o GPT-3, eu estava obcecado em deixar meu prompt/história perfeito. Mas, esse foi o meu erro. A saída não será perfeita.

Você está nesta jornada por apenas 15 minutos. Continue!

Então, se sua história ainda não está tão legal ou você está percebendo que ela tem apenas algumas frases, **você precisa continuar melhorando seu prompt**. Imagine que você recebe o que dá ao GPT-3. Você seria capaz de escrever uma história convincente?

Além disso, você pode literalmente dizer ao GPT-3 o que deseja. Por exemplo, se sentir que sua história não parece muito completa, você pode literalmente dizer: `Conte-me uma história completa com começo, meio e fim.` Na verdade, adicionei isso mais tarde e funcionou muito bem.

Reserve algum tempo aqui para brincar com seu prompt. 99% das vezes, não é o GPT-3 que é o problema. É o seu prompt. Você vai melhorar com o tempo!

Algumas recomendações:

- **Sua história tem apenas 1-2 frases todas as vezes?** Não se preocupe, está tudo bem. Mostraremos algumas correções para isso mais tarde. Mas, por enquanto, tente dar ao GPT-3 mais informações sobre seu personagem, o enredo que deseja e o cenário. Seu personagem é engraçado? O mundo em que eles vivem é algum planeta espacial futurista? Deixe tudo pronto para o GPT-3!
- **Não conseguiu uma boa história?** Experimente e faça da sua história algo que se misture com alguma coisa do mundo real. Você pode literalmente dizer ao GPT-3 para fazer isso. Por exemplo: `Conte-me uma história completa com começo, meio e fim, intitulada "Farza e a Caixa Mágica Vermelha". Esta história deve combinar as vibrações de Game of Thrones e Breaking Bad.` Quanto mais contexto e comparações você der ao GPT-3, melhor.
- **E o mais importante** — não fique obcecado com a mesma história/prompt. Depois de algumas tentativas, não há problema em dizer f*@%-se, apagar todo o seu prompt, e tentar algo completamente novo.

### Temperatura

Existem várias opções malucas à direita, que são os “hiperparâmetros”. O principal é a "Temperatura".

A temperatura é basicamente o quão arriscado você quer que o modelo seja. Uma temperatura mais alta significa que o modelo ficará um pouco mais desequilibrado e cometerá mais erros. Uma temperatura mais baixa significa que o modelo assumirá menos riscos e dará apenas a “resposta certa” mais padrão.

Uma temperatura acima de `0,9` é melhor para coisas mais criativas, como contar uma história. Uma temperatura abaixo de `0,1` é melhor para prompts com respostas bem definidas.

Então vamos mexer nisso. Pegue o prompt que você já escreveu acima, defina a temperatura para `0,9` e veja o que acontece.


```
Conte-me uma história intitulada "Farza e o Reino Perdido", ambientada nos anos 1500 e que parece um anime.

Farza: um garoto de 26 anos que não sabe que possui poderes secretos.
Cenário: um reino pobre e quebrado, que foi destruído por Furqan.
Furqan: o vilão da história, é uma figura misteriosa com poderes malucos.
Enredo: Farza quer derrotar Furqan e recuperar o reino.

História:

Farza era apenas um menino normal, vivendo em um reino pobre e quebrado que havia sido destruído por Furqan. Mas ele mal sabia que tinha poderes secretos que poderiam ajudá-lo a derrotar o vilão e retomar o reino.

Um dia, Farza decidiu enfrentar Furqan e desafiá-lo para um duelo. Farza confiava em suas habilidades, mas Furqan era muito mais forte e mais experiente. A batalha foi acirrada, mas finalmente Furqan saiu vitorioso.

No entanto, quando ele estava prestes a desferir o golpe final, os poderes latentes de Farza despertaram repentinamente e ele foi capaz de mudar o rumo da batalha. No final, Farza saiu vitorioso e o reino estava finalmente livre da tirania de Furqan.
```

Ok, isso literalmente me deu arrepios.

*“No entanto, quando ele estava prestes a desferir o golpe final, os poderes latentes de Farza despertaram repentinamente e ele foi capaz de mudar o rumo da batalha.”*

Isso é algo do tipo “O Senhor dos Anéis”.

A princípio, a história aparenta ser padrão. Mas, no último parágrafo - é aqui que está a mágica. **O GPT-3 gerou um final com uma reviravolta para mim.** Como deixamos o modelo correr mais riscos com uma temperatura mais alta, acabou fazendo o mais arriscado possível: escrever uma reviravolta! 

**Sua história provavelmente *não* terá reviravoltas.**

Na verdade, sua história pode ser *pior* quando você define uma temperatura mais alta. Você só precisa descobrir por si mesmo e testar diferentes combinações de prompts/temperaturas. 

Tudo isso faz parte do jogo de engenharia de prompt! 

*Observação: Se você realmente quer uma reviravolta na história - eu consegui algumas reviravoltas bem loucas com este formato, onde eu literalmente peço um final de reviravolta na história e digo ao GPT-3 o que eu quero que, em geral, o final da reviravolta na história inclua. Eu também descobri que dar exemplos de boas histórias como Harry Potter, Breaking Bad, Naruto, etc ajuda bastante.*

```
Conte-me uma história completa com começo, meio e fim intitulada "Farza e a caixa mágica vermelha". No final da história, inclua uma reviravolta bem maluca entre Farza e a Caixa Vermelha, onde algo louco acontece com Farza. Faça com que a história pareça realmente incrível, assim como a do Harry Potter.
```

**Continue mexendo na temperatura enquanto executa esses diferentes prompts.** Eu gosto de mudar a temperatura em cerca de 0,1 algumas vezes para testar. Além disso, o mesmo prompt em uma temperatura diferente pode criar resultados completamente diferentes.

Então, basicamente, a lição é: você precisa ajustar mais do que apenas o prompt para obter bons resultados. Você também precisa ajustar seus hiperparâmetros.

Não teve uma reviravolta na história? Não se preocupe. Siga adiante! Há muito mais no GPT-3 que ainda precisamos desbloquear e que pode melhorar muito seu desempenho.

### Por favor, faça isso, senão o Farza vai ficar triste

Vá em frente e tire uma captura de tela da sua história no Playground e poste-a em #prompts no Discord. Juntamente com a imagem, inclua seu **prompt** na mensagem para que outras pessoas possam vê-lo facilmente e se inspirar.

E, se você está procurando por inspiração, pode encontrá-la por lá!

