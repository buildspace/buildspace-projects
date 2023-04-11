Agora você está bem familiarizado com o que é o Stable Diffusion e como ele funciona. Exceto por um grande problema - **você não pode ensinar coisas novas a ele**. Não há como eu dar a ele 10 fotos do meu cachorro e fazê-lo gerar imagens do meu cachorro na cama para que eu possa fazê-lo pensar que ele quebrou as regras.

É aqui que o [Dreambooth](https://dreambooth.github.io/) entra. É uma técnica de aprendizado de máquina que permite gerar imagens fotorrealistas de assuntos específicos em uma variedade de contextos diferentes.

O Stable Diffusion sabe tudo sobre o mundo em geral - como são as nuvens, o quão careca é Dwayne "The Rock" Johnson e do que são feitos os arco-íris. Usando o Dreambooth, você pode ensiná-lo como **você** é!

### Como o Dreambooth e o SD funcionam juntos?

Para usar o Dreambooth, precisamos fornecer alguns dados de treinamento: um conjunto de imagens de nós mesmos, ou de quem queremos gerar imagens, juntamente com um rótulo (nosso nome) e a classe de objetos a que a coisa pertence (humano).

O Dreambooth então ajusta um modelo pré-treinado de texto para imagem para aprender a reconhecer e gerar imagens do assunto específico.

![](https://hackmd.io/_uploads/r10nDpEqi.png)

### Como funciona?

Diferente da magia, essa tecnologia fica ainda mais legal quando você sabe o truque.

Nós temos o modelo OG Stable Diffusion, que não é a parte especial. O que realmente vai fazer a diferença é o conjunto de fotos de entrada que usaremos. Aqui está um fluxo simplificado de como funcionará:

1. O modelo do SD é treinado em um conjunto de dados de imagens que representam um assunto (você).
2. Usando as fotos de entrada, o modelo extrai as principais características e características dos rostos nas fotos.
3. O modelo usa as características extraídas para gerar novas imagens sintetizadas que se assemelham às fotos de entrada, mas têm seu próprio estilo único e variações baseadas em nosso texto.

Logo você poderá se transformar em Thor (também conhecido como Thorza), como eu fiz abaixo.

![](https://hackmd.io/_uploads/ryi6v6Ncj.png)

### Treinar modelos do Dreambooth é uma grande conquista

Sabe todas aquelas fotos de perfil estilizadas com IA que você vê no Twitter e no Instagram? Todas elas foram geradas por meio do refinamento de modelos do SD usando Dreambooth. Isso é o que o aplicativo Lensa cobra caro para fazer. Toda essa tecnologia de código aberto foi disponibilizada para todos ao mesmo tempo, e coube aos desenvolvedores criar e lançar rapidamente seus aplicativos.

Embora não seja provável que você consiga criar um aplicativo com uma receita recorrente de $50k da noite para o dia usando essa tecnologia, você saberá como ela funciona e estará pronto para aproveitar a oportunidade da próxima vez que surgir!