### Obtendo fotos legais de si mesmo

**Chegou a hora! Hora de começar o treinamento.** 

A primeira coisa que você precisará fazer é coletar dados de treinamento. Como estamos criando avatares de IA de nós mesmos, teremos que obter um monte de fotos. Para sua primeira tentativa, recomendo usar de 5 a 10 imagens. No entanto, elas não podem ser apenas selfies comuns, temos que ter muito cuidado com o que ensinamos à IA.

Aqui estão algumas regras para suas fotos:

1. **As fotos devem conter apenas você** - Sem amigos, cachorros, empadinhas, tias;
2. **Fundos claros** - Se você não puder obter fundos brancos, use o [https://remove.bg/](https://remove.bg/) to remove them entirely;
3. **Qualidade da imagem** - As fotos devem estar bem iluminadas;
4. **Tamanho da imagem** - Pelo menos 720p no mínimo. Você pode usar webcams de laptop, mas precisa estar em um lugar bem iluminado (super importante!).

Você precisa ter cuidado aqui - mais imagens **não** significam melhores resultados! Para meu primeiro conjunto, usei 19 fotos e o resultado ficou meio ruim. O grande erro que cometi foi usar um fundo azul em **todas** as fotos. Eu ensinei ao SD que sempre tenho um fundo azul, então ele gerou resultados com fundos azuis!

![](https://hackmd.io/_uploads/H1hAD6Ncj.png)

Vamos tirar algumas fotos!! Pegue seu telefone, webcam, câmera DSLR - o que você tiver e comece a fotografar. Suas fotos devem mostrar as características que você deseja que o SD aprenda. Talvez você queira enfatizar sua mandíbula ou fazer um corte de cabelo como o do Zac Efron. Depende de você rsrs. Confira as fotos que eu tirei abaixo:

![](https://hackmd.io/_uploads/rJxzOpEqo.png)

Assim que tiver todas as suas fotos e estiver satisfeito com os fundos, podemos prepará-las para o processamento. A principal coisa que precisamos fazer aqui é redimensioná-las para 512x512, porque é o tamanho de todas as imagens que iremos gerar. Vá para o [Birme](https://www.birme.net/?target_width=512&target_height=512) e redimensione todas as suas fotos para 512x512.

A última coisa que você precisa fazer é renomear todas as suas fotos com um rótulo único. O SD tem milhões de pontos de dados para o que é um "homem", "mulher" ou "desenvolvedor de IA bonitão". Provavelmente tem muitos resultados para o seu primeiro nome também. Então, precisamos dar a você, o sujeito, um nome distinto que possamos usar em prompts.

Estou juntando meu primeiro e último nomes para obter "abraza". Então, em um prompt, eu colocaria "Retrato a óleo de **Abraza** como lutador profissional de Vincent Van Gogh".

Bem simples, né? Você pode tentar alguns ângulos diferentes, mas certifique-se de que são fotos próximas. Fotos do torso também funcionam, mas mantenha-as acima do cinto.

Nossos dados estão prontos! Vamos em frente! 

### Treinando com o Google Colab

O evento principal - **treinamento**. Aqui é onde as coisas começam a ficar **REALMENTE** legais.

Como isso exige muita computação, precisamos de algumas GPUs potentes para isso. Não tem uma GPU potente? Não se preocupe! O Google Colab está aqui para ajudar!

O Google Colab é basicamente um IDE dentro de um navegador. Está conectado à plataforma Google Cloud, então nunca precisamos instalar nenhuma dependência básica e recebemos muita computação gratuita. Obrigado, Google!

Usaremos o Python para esta parte, exceto que você não precisará realmente escrever nenhum código em Python ou configurar um ambiente Python! Isso será feito com a magia dos notebooks do projeto Jupyter.

Confira este rápido resumo sobre os notebooks do Jupyter no Google Colab:

[https://www.loom.com/share/8fca2d8ef42642d4b5e76ed5279c67d3](https://www.loom.com/share/8fca2d8ef42642d4b5e76ed5279c67d3)

**Podemos** usar os notebooks do Jupyter no VS Code, mas usaremos o Google Colab porque temos poder computacional gratuito! Quem pode dizer não a uma GPU Tesla T4 gratuita?

Os notebooks do Colab podem ser compartilhados como arquivos, então vou fornecer apenas um link que você pode copiar para o seu Google Drive.

Vamos lá!!!!
