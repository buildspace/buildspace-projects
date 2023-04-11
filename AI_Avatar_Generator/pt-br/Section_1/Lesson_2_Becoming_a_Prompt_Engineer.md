Vamos direto ao assunto - no final desta seção, você terá gerado sua primeira imagem de avatar de IA enquanto entra na loucura dos prompts.

Por que não começamos com o que é um prompt?

Um prompt é como um feitiço - é uma frase ou conjunto de frases que descreve uma imagem que você deseja. Você tem que usar as palavras certas na ordem certa ou as coisas vão ficar estranhas.

![](https://hackmd.io/_uploads/S1e-I649j.png)

Vamos escrever muitos prompts e entraremos rapidamente nas partes mais avançadas, então sugiro conferir este incrível texto, [Prompt Engineering 101](https://buildspace.so/notes/prompt-engineering-101-sd), do nosso mestre em prompts e residente, Jeffrey, para se atualizar. Dê uma olhada no [Twitter](https://twitter.com/ser_ando) dele, pois ele posta coisas incríveis por lá.

Já adiantando: criar prompts é uma habilidade. Você não se tornará um deus do prompt em 30 minutos. A maioria dos seus prompts será ruim, mas tudo bem.

**Quando você é ruim em algo, a única garantia é que você vai melhorar. :)** 

Existem alguns lugares onde você pode gerar imagens, vamos começar com o [DreamStudio](https://beta.dreamstudio.ai/), que é a ferramenta oficial fornecida pela Stability AI, a empresa por trás do Stable Diffusion. Ele é disponibilizado em sua versão mais recente e permite que você configure algumas coisas importantes.

![https://hackmd.io/_uploads/HyiEJG3ds.png](https://hackmd.io/_uploads/HyiEJG3ds.png)

Você começará com 100 créditos, o que será suficiente para gerar de 100 a 200 imagens com base em suas configurações. Certifique-se de abrir as configurações e aumentar o número de etapas (steps), pois quanto maior o número de etapas, mais precisa será a imagem. Eu escolhi 75 etapas. Você também deve alterar o modelo para Stable Diffusion 2.1 (ou o que for mais recente). Eu também configurei para gerar apenas duas imagens por prompt, porque não quero gastar todos os créditos rapidamente rsrs.

O que eu quero que você faça aqui é **encontrar o seu estilo**. Brinque com todos os modificadores que eu vou compartilhar. Vamos construir camada por camada, então você terá muitas chances de misturar as coisas.

Eu vou basear o meu site na criação de avatares de IA do mundo do Senhor dos Anéis. Este é o seu momento de escolher um tema e se aprofundar nele. Seu aplicativo ficará 10 vezes melhor se você tiver uma direção a seguir.

Ok, ok, chega de explicação - vamos começar.

### Curso rápido de História/Teoria da Arte

Sabe quando as pessoas brincam sobre a História da Arte ser uma graduação inútil? É o completo oposto com a arte de IA rsrs. Como Jeffrey mencionou no texto “101” - você precisa conhecer as técnicas de artistas reais e os vários estilos para saber *como* retratar a próxima Criação de Adão.

Esses modelos não são alienígenas de outro planeta - eles são toda a humanidade espremida em um único programa. Tudo o que colocamos na internet na última década culminou nessas entidades gigantescas que rotulam as coisas, assim como nós.

Vamos gerar obras de arte épicas enquanto passamos por cada pilar que torna a arte tão atraente. Você poderá ver como cada parte interage com as outras e como elas se misturam perfeitamente.

**À medida que fazemos uma viagem pela história da arte, vamos experimentar ativamente os prompts no DreamStudio! Portanto, verifique se ele está aberto e pronto para entrar em ação  🤘**

**Artista**

**Leonardo. Raphael. Michelangelo. Donatello.** 

Quase todos os artistas mais renomados do mundo têm estilos de arte distintos. A internet está cheia de seus trabalhos e todo tipo de derivados - inspirações, homenagens, imitações. Isso torna o uso de nomes de artistas em prompts **incrivelmente** poderoso.

Os nomes de artistas vão ter o **maior** impacto no estilo da sua imagem. Eles vão ser a base sobre a qual sua imagem é construída e serão responsáveis por uma boa parte da vibe.

Se, como eu, os únicos artistas que você conhece são aqueles que são nomeados em homenagem às Tartarugas Ninjas, aqui está uma lista de vários artistas que você pode experimentar:

- James Gurney
- John Singer Sargent
- Edgar Degas
- Paul Cezanne
- Jan van Eyck

Este modificador em particular é bem complicado - todos os modelos de texto para imagem são treinados em arte retirada da internet, sem permissão explícita de seus criadores. Há muitas discussões em andamento sobre **quem** é o proprietário das imagens geradas usando esses modelos e muitos artistas estão irritados porque não consentem com o uso de sua arte para treinamento. 

Os nomes nesta lista não foram escolhidos por acaso - 4 deles são retratistas historicamente famosos (que já morreram), o quinto concordou com o uso de seu nome em arte de AI.

Tudo isso é para dizer - **respeite as decisões dos artistas e não use estilos de arte específicos sem permissão de seus criadores.**

Você poderia ir a sites como o [ArtStation](https://www.artstation.com/) e o [DeviantArt](https://www.deviantart.com/) para encontrar mais artistas que você gosta, ou talvez tomar um banho e ir ao seu museu de arte local. Prometo que valerá a pena e você aprenderá muito mais sobre arte.

**Hora de gerar**

Eu moro em Auckland, Nova Zelândia - a apenas uma hora de distância da Terra Média, então vou usar o Stable Diffusion (SD) para imaginar Gandalf se ele fosse feito pela Disney. Aqui está o meu primeiro prompt!

```json
Uma foto de perfil do Gandalf do filme O Senhor dos Anéis, no estilo da Pixar, sorrindo, em frente ao Condado (The Shire)
```

Bem simples! Você aprenderá que não **precisa** de muitos detalhes em seus prompts, basta especificar o que deseja. Esta é uma distinção importante. Aumentei as etapas nas configurações para 150 - isso torna os resultados melhores, mas custa mais tempo de GPU.

Aqui está o melhor que recebi:


![](https://hackmd.io/_uploads/S1h7GWH9j.png)

Não ficou ruim. O cabelo está um pouco estranho e ele está sem dentes, mas este é apenas o nosso primeiro prompt :P.

Vamos tentar mudar a técnica!

**Técnica**
**Acrílico. Aquarela. Microsoft Paint.** 

Vincent Van Gogh nunca fez arte pixel, mas com o poder do Stable Diffusion, você pode descobrir como isso poderia ter ficado.

Fique com técnicas mais populares como ilustrações digitais, pinturas e arte pixel. Quanto mais conteúdo houver, melhor o Stable Diffusion será nisso. Uma pintura de sombra não será tão boa quanto uma pintura a óleo porque a internet tem muito mais pinturas a óleo.

Aqui está uma lista de técnicas com as quais você pode brincar:

- Pintura acrílica 
- Aquarela 
- Arte pixel 
- Ilustração digital 
- Escultura em mármore 
- Fotografia Polaroid 
- Renderização 3D

Algumas dessas técnicas podem ser combinadas! Aqui está uma escultura do Dr. Estranho feita com "mármore cromado de cobre" que o [Jeffrey criou com o MidJourney](https://twitter.com/ser_ando/status/1600335448039006208):

![](https://hackmd.io/_uploads/rJLILpVqi.png)

Estamos realmente no futuro.

Acho que quero ver como ficaria uma renderização 3D do Gandalf. Aqui está meu prompt atualizado:

```
Uma renderização 3D, estilo Pixar, do Gandalf do filme O Senhor dos Anéis, sorrindo com a boca fechada, em frente ao Condado, colinas verdes ao fundo
```

Não mudou muito. Adicionei "renderização 3D" e deixei o resto como está.

![](https://hackmd.io/_uploads/By4v8aNqj.png)

**Incrível**! Viu como isso é legal?

**Estética**

Você já escolheu a técnica e o artista. Agora, temos que escolher a vibe - é algo lo-fi ou vamos para o cyberpunk?

Aqui estão as minhas favoritas:

- Fantasia
- Vaporwave
- Cyberpunk
- Steampunk
- Gótico
- Ficção científica, futurista

[Aqui está uma lista enorme de estéticas](https://aesthetics.fandom.com/wiki/List_of_Aesthetics) para você conferir. Você também pode criar suas próprias vibes! Aqui está uma moda Dronecore feita com GPT-3:

![](https://hackmd.io/_uploads/BJxK8TE5s.png)

[Fonte](https://twitter.com/fabianstelzer/status/1599525776952414208)

Eu quero alguma coisa com cores de mundos de fantasia, então eu digitei isso:

```
Uma obra de arte 3D, estilo Pixar, do Gandalf do filme O Senhor dos Anéis, sorrindo com a boca fechada, em frente ao Condado, colinas verdes ao fundo, cores vivas e fantásticas
```

![](https://hackmd.io/_uploads/SJEqI6V5o.png)

Isso está começando a parecer uma versão da Pixar de O Senhor dos Anéis rsrs.

**Descritor**

O último ingrediente que quero cobrir é o mais vago - não é uma área específica, são descritores gerais.

- **Tempo**: anos 1970, idade da pedra, apocalipse, antigo, grande depressão, Segunda Guerra Mundial, vitoriano
- **Estações**: inverno, verão, primavera, outono
- **Feriados**: Eid al-Fitr, Natal, Diwali, Páscoa, Halloween, Hanukkah
- **Detalhes**: detalhado, hiper-realista, alta definição, em tendência no site ArtStation (sim, realmente)

Dê uma chance a isso e adicione alguns desses descritores ao seu prompt! Quando você conseguir uma imagem de que goste, certifique-se de compartilhá-la no canal `#prompts` em nosso Discord para mostrar aos outros o que você criou!

Há **muito mais** que você pode fazer com os prompts. Você pode passar semanas aprendendo tudo sobre como os humanos descrevem as coisas. Eu vou deixar você fazer isso sozinho, mas lembre-se:

**Os modelos de IA são treinados em quase toda a mídia humana na internet**. 

Isso significa que tudo o que você pode encontrar na internet, este modelo provavelmente também sabe. Imagens de filmes famosos. Fan art de personagens. Descrições de cenas icônicas de diretores específicos. Fotos de diferentes ângulos de câmera, filmes diferentes, resoluções, iluminação, lentes, gêneros de foto. A IA viu tudo (exceto as coisas NSFW, ou seja, impróprias, pois elas foram removidas :P).

Eu descobri que a internet é maior do que minha imaginação imediata, então se você pode imaginar, é provável que a IA saiba sobre isso. Você só precisa encontrar as palavras certas.

Aqui estão alguns links úteis com vários exemplos do que as palavras podem fazer:

[**Técnica**](https://docs.google.com/document/d/1_yQfkfrS-6PuTyYEVxs-GMSjF6dRpapIAsGANmxeYSg/edit)

[**Cor**](https://docs.google.com/document/d/1XVfmu8313A4P6HudVDJVO5fqDxtiKoGzFjhSdgH7EYc/edit)

[**Câmera**](https://docs.google.com/document/d/1kh853h409DeRTg-bVo_MSYXrWjMDRMX9kLq9XVFngus/edit)

[**Iluminação**](https://docs.google.com/document/d/1qcpgNsA-M998zy0ngVvNcMs2AYHpMuAjAefM6p63Tp8/edit)

[**Filme**](https://docs.google.com/document/d/1vM9izOU4bQIcrKxAZiw85Q826zb6kBsjUQKdawm3lyk/view)

Dê um passo para trás e olhe suas belas (e nem tão belas) criações. Você está a caminho de gerar a próxima onda de arte incrível para o mundo - agora vamos aumentar isso em 10x. 

### Sinalizações de configurações avançadas

Bem, bem, bem - que bom te ver aqui na seção avançada 😏. Espero que tenha encontrado um pouco de magia gerando imagens com o DreamStudio. Vamos ver como podemos fazer com que isso fique ainda melhor, deixando tudo mais fácil para o SD entender.

A maioria dos modelos por aí tem maneiras de configurar as configurações *dentro* de seu prompt. O que você pode fazer e como irá fazer depende do modelo. Por exemplo, o DreamStudio permite que você combine várias solicitações com o caractere barra vertical (pipe) `|`:


```
Retrato ilustrado do Gandalf do filme Senhor dos Anéis: 2.0 | O Condado ao fundo: 0.4 | Pintura a óleo renascentista
```

Os números após o prompt indicam o peso, que pode variar em +/-10.0. Clique no ponto de interrogação no canto superior esquerdo da caixa de entrada do prompt para mais detalhes.

![](https://hackmd.io/_uploads/r1jo86Vcj.png)

Parece que terei que aumentar o peso do plano de fundo, mas isso ficou bem legal!

Para os outros modelos por aí, cada um tem seus pesos diferentes. Se você decidir usar algo diferente, como o Midjourney, certifique-se de verificar o manual deles! 

### Prompts negativos

Nós falamos bastante sobre como dizer ao Stable Diffusion se você quer algo em suas imagens, mas e se você **não** quiser algo? Deixe-me mostrar como funciona :).

Você deve ter percebido que eu disse ao Stable Diffusion que eu quero que o Gandalf sorria com a boca fechada em várias prompts. Isso porque geralmente os dentes aparecem estragados. Posso fazer a mesma coisa dando a ele um peso negativo assim: `sorrindo:-1`

```
Retrato renascentista do Gandalf do filme O Senhor dos Anéis, no estilo da Escola de Atenas, cores vibrantes, altamente detalhado: 2.0 | O Condado ao fundo: 0,8 | Pintura barroca detalhada, Michelangelo Buonarroti, Rafael : 1,0 | Sorrindo: -1 | Duplicação: -1
```

Aqui está o que recebi:

![](https://hackmd.io/_uploads/r1vT8aE9i.png)

**UAU**. Estou gostando cada vez mais da arte clássica.

Aumentei o peso para o segundo bloco e dois deles têm o Condado ao fundo! Para os outros, simplesmente pesquisei no Google "pinturas renascentistas famosas", porque sei que o Stable Diffusion conhece todas as mais populares. Escolhi os nomes e artistas das que gostei e fui para o [Lexica](https://lexica.art/) - um mecanismo de busca do Stable Diffusion.

Procurei por nomes de artistas e até mesmo apenas pela palavra `renascimento` para ver quais prompts funcionam bem. Como alguém que não sabia que o período da arte clássica existia até os meus 16 anos, acho isso muito legal!

A única coisa que não gosto aqui é o quanto o prompt está ficando cheio. Alguns serviços, como o Lexica, têm um campo dedicado para prompts negativos. Dê uma olhada:

![](https://hackmd.io/_uploads/S1rAIaEqs.png)

É engraçado, isso é considerado "avançado", mas na verdade não é tão ruim, certo? É mais como se você tivesse mais ferramentas à sua disposição para tornar suas sugestões ainda **melhores**. 

### Por favor, faça isso, senão o Raza ficará triste

Você deve estar se saindo **MUITO** bem na criação de prompts incríveis! Neste ponto, reserve uns 30 minutos para experimentar com prompts até encontrar um que o surpreenda.

Vá em frente, copie seu avatar e poste-o em `#prompts` no Discord. Certifique-se de incluir sua sugestão na mensagem para dar inspiração aos outros.
