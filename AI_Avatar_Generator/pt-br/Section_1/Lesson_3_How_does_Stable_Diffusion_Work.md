Vamos dar um passo atrás e falar sobre como tudo isso funciona. O Stable Diffusion é um modelo de aprendizado profundo (deep learning) de texto para imagem, mas o que isso significa??? Entender como ele funciona o tornará muito melhor em usá-lo.

**Observação** - *Vou simplificar muitas coisas aqui e me ater às partes importantes. Essa tecnologia é única e você precisa ter um doutorado para entendê-la, então pularei a parte matemática rsrs.*

### Os conceitos básicos por trás do Stable Diffusion

Pense na última legenda de imagem que você viu. Provavelmente estava em um blog ou artigo em algum lugar na internet e você a ignorou. Existem bilhões dessas imagens por aí: de alta qualidade, disponíveis gratuitamente, descritas com precisão suficiente. Essas imagens compõem a maior parte dos dados de treinamento para modelos de geração de imagens.

Veja bem, para gerar imagens a partir de texto, primeiro precisamos "treinar" um modelo de aprendizado de máquina (machine learning) em um grande conjunto de dados de imagens e suas descrições de texto correspondentes. Esses dados de treinamento são usados para ensinar ao modelo as relações entre as palavras nas descrições de texto e as características visuais das imagens correspondentes.

**Basicamente, damos a um computador bilhões de imagens e dizemos o que cada uma dessas imagens contém, “ensinando” efetivamente o que são as coisas.** 

Sabe como aqueles CAPTCHAs pedem para você selecionar as caixas com as calçadas ou os semáforos? Você está realmente treinando a IA lá rsrs.

Uma vez que ensinamos ao modelo como vincular palavras em uma descrição de texto às imagens correspondentes, ele pode usar o aprendizado profundo para descobrir as relações entre as duas por conta própria. A forma como o "aprendizado profundo" funciona é criando redes neurais com camadas de "neurônios" interconectados, que processam e analisam grandes quantidades de dados para resolver problemas como a correspondência de texto para imagens.

**Tudo isso significa que ele pode pegar uma nova descrição de texto e fazer uma nova imagem relacionada.**

Essa parte não é particularmente nova - essa tecnologia existe há um tempo e não produz resultados de alta qualidade.

![](https://hackmd.io/_uploads/H1q-DpE5i.png)

### Explorando a magia do CLIP

A magia do Stable Diffusion acontece com o CLIP. Há **MUITA** coisa acontecendo aqui, então vamos começar com o conceito de embeddings.

Computadores não veem imagens ou palavras. Eles não são tão poderosos como a máquina multifuncional com bilhões de CPUs que está em nossas cabeças.

Quando olhamos para algo, a luz da imagem entra em nossos olhos e é convertida em sinais elétricos pela retina. Nosso cérebro processa esses sinais e reconhece as coisas que estamos vendo.

Os computadores precisam fazer um tipo semelhante de processamento - eles têm um dicionário que mapeia partes de palavras para números. Isso é chamado de embedding de texto.

Ao representar palavras ou imagens como vetores numéricos, podemos usar esses vetores como entrada para algoritmos de aprendizado de máquina, que podem então aprender com os dados e fazer previsões ou gerar novos dados.

![](https://hackmd.io/_uploads/BkFDw6Eqo.png)

[Source](https://www.youtube.com/watch?v=F1X4fHzF4mQ)

Executar o embedding de uma imagem requer alguns passos adicionais - primeiro, ela é processada por uma rede neural convolucional (convolutional neural network, ou CNN), que é um tipo de modelo de aprendizado profundo projetado para aprender automaticamente as características e padrões importantes na imagem. Dessa forma, podemos representar as características importantes de uma imagem em um vetor numérico e realizar operações matemáticas com ele.

Então, **temos um embedding tanto para o texto quanto para a imagem - basicamente, uma representação numérica da imagem e sua legenda.** 

É aqui que entra o CLIP - sua função é pegar essas duas representações numéricas e encontrar as semelhanças mais relevantes. É isso que nos dá resultados nítidos e realistas, sem artefatos estranhos. Se você quiser ver isso em ação, [confira este link](https://huggingface.co/spaces/EleutherAI/clip-guided-diffusion).

![](https://hackmd.io/_uploads/rJYFv6Nco.png)

[Source](https://www.youtube.com/watch?v=F1X4fHzF4mQ)

### A difusão do Stable Diffusion

Pense no monte de objetos redondos que você já viu na vida. Como você sabe que uma bola de futebol é diferente de uma bola de boliche só de olhar para elas? Pelo seu visual, é claro! 

![football-prank.gif](https://hackmd.io/_uploads/HybC9mB5o.gif)

Provavelmente você nunca pensou sobre isso, mas em sua mente, você tem pelo menos três "eixos" - um para forma, outro para cor e outro talvez para tamanho. Bolas de futebol estão em um ponto deste gráfico, bolas de boliche estão em outro.

O Stable Diffusion faz algo semelhante, exceto que ele tem **muito mais** dimensões e variáveis. Aqui, nosso grande cérebro fica para trás - ele não pode visualizar mais do que 3 dimensões, mas nossos modelos têm mais de 500 dimensões e um número insano de variáveis. Isso é chamado de **espaço latente (latent space)**.


![](https://hackmd.io/_uploads/SkK9v6Nco.png)

Imagine que você esteja treinando um modelo de aprendizado de máquina para gerar imagens de gatos a partir de textos. O espaço latente, nesse caso, seria um espaço onde cada ponto representa uma imagem de gato diferente. Então, se você inserir a descrição de um gato branco e fofo no espaço latente, o modelo irá navegar pelo espaço e encontrar o ponto que representa um gato branco e fofo. Em seguida, usará esse ponto como ponto de partida para gerar uma nova imagem de gato relacionada.

É por isso que nossas sugestões são tão poderosas - **elas trabalham em dimensões que não podemos sequer imaginar**.

Precisamos de centenas de coordenadas matemáticas para navegar até um ponto usando texto. É por isso que nossos resultados melhoram quando adicionamos mais modificadores.

O processo de navegar por esse espaço e encontrar pontos relacionados a uma entrada é chamado de difusão. Uma vez encontrado o ponto mais próximo do prompt de texto, o modelo utiliza mais magia da IA para gerar a imagem de saída. 

![](https://hackmd.io/_uploads/HJEowaE5j.png)

[Fonte](https://www.youtube.com/watch?v=SVcsDDABEkM)

Excelente! Agora você conhece os fundamentos do Stable Diffusion. Confira [este link](https://jalammar.github.io/illustrated-stable-diffusion/) para uma explicação detalhada das várias partes, caso esteja curioso e queira se aprofundar.

Você pode sentir que não há muito sentido em entender como tudo isso funciona, mas agora que você sabe, será capaz de construir coisas que outros nem sequer imaginam. Enquanto eu estava escrevendo isso, a OpenAI lançou seu [novo e aprimorado modelo de embedding](https://openai.com/blog/new-and-improved-embedding-model/), que é 99,8% mais barato. 

O modelo para o GPT-3 não é de código aberto, então não podemos usá-lo para criar aplicativos personalizados, mas podemos usar a API de embeddings para comparar conjuntos de texto diretamente. Isso pode ser usado para todos os tipos de aplicativos incríveis, como sistemas de recomendação e pesquisa de linguagem natural!

O que você acabou de aprender vai se multiplicar e te levar a lugares que você nem imagina. :)

