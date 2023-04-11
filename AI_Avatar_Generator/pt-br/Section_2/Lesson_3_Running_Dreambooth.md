**Antes de começar, certifique-se de que sua conta do Google Drive tenha pelo menos 5 GB de espaço livre**. Vamos salvar o modelo finamente ajustado no Google Drive e ele ocupa cerca de 2-3 gigas.

Vamos usar uma versão extra especial do Stable Diffusion, que é otimizada para memória. A melhor parte? Todo o fluxo de trabalho de treinamento/ajuste acontecerá no Google Colab sem escrever uma única linha de código!

Mas tenha cuidado - embora o Colab seja gratuito, os recursos não estão permanentemente disponíveis. Certifique-se de ter pelo menos **60 minutos** disponíveis para passar por esta seção, pois se você deixar o Colab em execução, poderá ficar sem horas gratuitas.

Se você ***realmente*** precisar sair a qualquer momento antes que o treinamento termine, terá que desconectar sua sessão de tempo de execução usando o menu suspenso ao lado das barras de RAM/Disk na parte superior direita. Isso irá redefinir seu ambiente, então quando você voltar na próxima vez, terá que começar do início (passo 1 no notebook).


![https://hackmd.io/_uploads/S17baDlYs.png](https://hackmd.io/_uploads/S17baDlYs.png)

Comece [clicando neste link](https://colab.research.google.com/github/buildspace/diffusers/blob/main/examples/dreambooth/DreamBooth_Stable_Diffusion.ipynb). Ele abrirá um notebook do Jupyter no Colab. A primeira coisa que você deve fazer é garantir que esteja na conta do Google correta. Se não estiver, clique em seu perfil no canto superior direito e mude para uma conta com pelo menos 5 gigas livres.

Em seguida, copie o notebook para o seu Google Drive. Isso o abrirá em uma nova aba.

![](https://hackmd.io/_uploads/H1ONOTVco.png)

Estamos prontos para começar!

O notebook tem algumas partes extras que você pode ignorar na primeira execução.

**Lembre-se** - você só precisa executar cada bloco uma vez.

O primeiro bloco conectará nosso notebook a uma máquina virtual e mostrará a conexão que estamos usando. Este bloco também inicia um temporizador - você só tem um número limitado de horas de GPU gratuitas.

![](https://hackmd.io/_uploads/SyBBupV5j.png)

### Configure o ambiente

A primeira coisa que vamos fazer é cuidar dos requisitos. Toda vez que abrimos um novo notebook do Colab, estamos nos conectando a uma máquina virtual completamente nova. Você precisará instalar os requisitos toda vez que sua máquina se desconectar - o estado é apagado.

![](https://hackmd.io/_uploads/ryrUu6N9i.png)

Isso vai levar cerca de 2-4 minutos.

Enquanto isso estiver rodando, vá para o [Hugging Face](https://huggingface.co?ref=buildspace) e se cadastre. Depois de criar uma conta, vamos precisar gerar um token de acesso! Isso será usado na seção "Login to Hugging Face" do Colab.

Para gerar isso, basta clicar no seu perfil, clicar em "Configurações" e ir para "Access Tokens" (Tokens de acesso) na esquerda :).

Aqui, você vai pressionar "New token" na parte inferior da página. Nomeie o token da forma que quiser e certifique-se de dar a ele a função write (gravação) (mais sobre isso depois).

![](https://hackmd.io/_uploads/BJ1wdTNqi.png)

Coloque ele no campo de token e execute quando o bloco de requisitos estiver concluído.

![](https://hackmd.io/_uploads/SyG_dpV9o.png)

**Espere aí - o que é o Hugging Face?**

Para passarmos de texto → imagem em nosso aplicativo, precisamos executar o Stable Diffusion! Por enquanto, seremos capazes de fazer isso no Colab, mas o Colab não tem pontos de extremidade (endpoints) de API que ele possa expor. Isso significa que precisamos ser capazes de hospedar e executar o SD em algum lugar - lembre-se de que isso é extremamente intensivo em GPU, o que significa que somente cerca de 1% do mundo poderá usar nosso aplicativo rsrs.

Felizmente, o mundo já vem usando computação em nuvem há muito tempo e podemos alugar as GPUs mais recentes da NVIDIA sem problemas 🤘. **MAS** - essas GPUs de luxo podem custar centenas de dólares por mês apenas para manutenção.

É aí que entra o Hugging Face (🤗). É uma das maiores bibliotecas de IA do mundo, buscando expandir o mundo da IA por meio do código aberto.

Muitos neurônios foram dedicados a tentar descobrir como poderíamos tornar isso gratuito para todos e estamos **MUITO animados** para mostrar exatamente como fazer isso.

Mas por enquanto, vamos voltar ao Colab.

Agora, precisamos de uma biblioteca chamada xformers. Ela é uma dependência adicional que irá acelerar seriamente a velocidade com que o Stable Diffusion é executado. Você não precisa saber como o xformers funciona, apenas que definitivamente deve usá-lo sempre que possível, pois dobrará o seu desempenho.

A versão precisará ser mantida atualizada. A versão é a 0.0.15 no momento em que escrevo - se isso quebrar, vá para a seção de ajuda `#section-2` e marque os moderadores.

### Configure seu modelo

Vamos dar uma pequena pausa aqui! Você acabou de fazer muitas coisas incríveis no Colab:

1. Começou a usar uma GPU gratuita do Google
2. Configurou sua conta do Hugging Face + criou um token de acesso
3. Instalou a biblioteca xformers

**A internet é louca, cara!**

Agora precisamos dizer ao notebook qual modelo queremos usar. Como estamos nos conectando ao Hugging Face, podemos ler qualquer modelo público de lá.

A Versão 2.1 é muito instável com prompts, então estou usando a v1.5. Você pode experimentar a v2.1 mais tarde, por enquanto apenas insira este caminho no campo `MODEL_NAME` e continue:

```
runwayml/stable-diffusion-v1-5
```

O modo como você escolhe um modelo é colocando o caminho do URL do Hugging Face. Então, `https://huggingface.co/runwayml/stable-diffusion-v1-5` se torna `runwayml/stable-diffusion-v1-5`.

Muito importante -- **certifique-se de que a opção** `save_to_gdrive` esteja marcada! Assim, se o notebook travar por algum motivo, você não precisará treinar todo o modelo novamente 🥲.

**Por favor, observe que**, embora você **possa** usar outros modelos refinados, nosso notebook suporta apenas o Stable Diffusion v1.5 e v2.1. Se você conseguiu obter o modelo MidJourney, ele não funcionará aqui.

### Configure os recursos de treinamento

A beleza desse modelo é que ele é incrivelmente otimizado e pode ser configurado para ser executado com recursos comparativamente menores. Felizmente, não precisaremos mexer com isso - o Google Colab cuidará de tudo.

Vá para a etapa 5.5 para que possamos dizer ao Stable Diffusion em que estamos treinando.

**Instance prompt**: isso descreve exatamente do que são as suas imagens. No nosso caso, é o que decidimos como o nome ("abraza" para mim) e "homem/mulher/pessoa". Esse é o **rótulo** para as imagens que carregamos.

**Class prompt**: isso simplesmente descreve a que mais o Stable Diffusion deve relacionar seu modelo. "homem", "mulher" ou "pessoa" funcionam. :)

![](https://hackmd.io/_uploads/SJWi_TE9i.png)

### Passo 6 - Carregue as imagens

Este é bem simples! Execute o bloco, um botão "Choose Files" (Escolher arquivos) aparecerá. Clique para escolher os arquivos e carregue as imagens que preparamos anteriormente.

![](https://hackmd.io/_uploads/r17adp4qi.png)

### Passo 7 - Configure opções de treinamento

Espere, espere, espere. Já estamos nos preparando para treinar essa coisa com nosso rosto? Parece que um truque de mágica foi revelado a você, não é mesmo? Espero que você esteja vendo que fazer isso, embora leve um tempo considerável, é realmente bem compatível com a tecnologia atual disponível lá fora! Vamos então executar essa coisa!🤘

Esse próximo passo pode parecer intimidante, mas você não precisa mexer na maioria das opções!

Novamente, deixei essas opções aqui caso você realmente saiba o que está fazendo e queira personalizar o modelo, mas para a sua primeira vez tudo o que você precisa fazer é:

1. **Mude o `max_train_steps`**. Você deve manter esse número menor que 2000 - quanto mais alto for, mais tempo o treinamento levará e mais "familiar" o SD (Stable Diffusion) se tornará com você. Mantenha esse número baixo para evitar sobreajuste. A regra geral aqui é 100 passos para cada imagem, mais 100 se você tiver menos de 10 imagens. Então, para 6 imagens, basta definir para 700! Se achar que os resultados não se parecem o suficiente com você, basta voltar aqui e aumentar esse número rsrs.
2. **Atualize o `save_sample_prompt` para um prompt com o seu sujeito.** Logo após o treinamento, este bloco irá gerar 4 imagens suas com esse prompt. Eu recomendo ser um pouco mais criativo do que apenas "Foto da pessoa xyz", pois assim elas irão ficar bem entediantes. Use suas habilidades de prompt aqui!

![](https://hackmd.io/_uploads/BJflFa4qs.png)

Enquanto o treinamento está acontecendo, tire um momento para se levantar e esticar seu corpo! Sua coluna agradecerá e você será capaz de olhar para telas por um período muito mais longo em sua vida. 

![https://hackmd.io/_uploads/rJ2Zt6Nqs.png](https://hackmd.io/_uploads/rJ2Zt6Nqs.png)

Quando acabar de se alongar, execute os blocos 7.2 e 7.3 sem fazer alterações. Você deve ver suas primeiras imagens!!!  

**AGORA VOCÊ É UM ENGENHEIRO DE APRENDIZADO DE MÁQUINA! AEEEEEE!!**

Bem, talvez ainda não.

Execute os dois próximos blocos - você não precisará alterar nada nesta primeira execução.

O passo 8 converte os pesos para um formato CKPT - isso é necessário se quisermos fazer o upload para o Hugging Face e obter pontos de extremidade de inferência.

O passo 9 prepara o modelo convertido para que esteja pronto para a inferência. Novamente - você não precisa saber como isso funciona, esta parte está aqui no caso de você querer alterar o caminho do modelo - `model_path`. 

### Gere as imagens

Estamos aqui - a terra prometida. Use seus poderes mágicos de prompt e o identificador exclusivo do assunto para fazer alguma magia acontecer.

Você pode aumentar as etapas de inferência para obter resultados mais detalhados ou aumentar a escala de orientação para tornar a IA mais obediente ao seu prompt. Eu gosto de 7,5 para a escala de orientação e 50 para as etapas de inferência.

Descobri que ele funciona melhor com temas bem definidos com muito material online, como programas de TV, bandas, fanart.

Aqui estou eu como um personagem de Peaky Blinders, um chefe da máfia e como um membro da banda Blink182:

![https://hackmd.io/_uploads/HygXHa49i.png](https://hackmd.io/_uploads/HygXHa49i.png)

Consegui todos esses na **primeira** tentativa! **SURREAL!** 

Aqui estão os prompts que usei:

```
1. Arte conceitual de pintura a óleo de [SUJEITO] por [ARTISTA], extremamente detalhado, artstation, 4k.

2. Retrato de [SUJEITO] em [SÉRIE DE TV], pintura digital altamente detalhada, artstation, arte conceitual, suave, foco nítido, ilustração, arte de [ARTISTA 1], [ARTISTA 2] e [ARTISTA 3].

3. Retrato de [PESSOA] como [PERSONAGEM], musculoso, fantasia, intrincado, elegante, pintura digital altamente detalhada, artstation, arte conceitual, suave, foco nítido, ilustração, arte de [ARTISTA] e [ARTISTA 2] e [ARTISTA 3].
```

Eu misturei alguns artistas diferentes aqui - o truque é garantir que seus estilos sejam semelhantes.

O grande pote de ouro que está lhe dando toda essa mágica é o arquivo `.CKPT` de 4 GB em sua pasta do Google Drive. É para isso que trabalhamos todo esse tempo - um modelo do Stable Diffusion personalizado, treinado em **você** (ou seu gato).

Em seguida, vamos colocá-lo no Hugging Face e configurar um aplicativo React para permitir que o mundo o experimente!

### Carregue para o Hugging Face

O último passo (#11) é extra especial - ele pega seu modelo ajustado personalizado e todos os arquivos necessários e os coloca no Hugging Face.

Ao hospedar modelos, geralmente precisamos resolver dois grandes problemas:

1. **Onde hospedamos nosso novo modelo sofisticado?**
2. **Como iremos realmente chamar nosso modelo hospedado?**

O Hugging Face resolveu esses dois problemas para nós! Ele está hospedando nosso modelo e tem pontos de extremidade da API de inferência que podemos acessar.

Você não precisará fazer muito aqui - basta alterar o nome do conceito (ex: SD-Raza) e inserir um token de gravação do Hugging Face (você pode usar o mesmo que gerou no início!), clicar no botão para executar e ver a mágica acontecer.

![https://hackmd.io/_uploads/ByCNKTN5s.png](https://hackmd.io/_uploads/ByCNKTN5s.png)

Clique no link e você verá isso no lado direito:

![https://hackmd.io/_uploads/BJMIKpNqi.png](https://hackmd.io/_uploads/BJMIKpNqi.png)

Esta é a IU (interface do usuário) para a sua API de inferência! Coloque um prompt ali e veja a mágica acontecer! :D

Assim que você clicar em "compute", você vai notar que receberá a mensagem "Model is loading" (modelo está carregando). Isso é uma das limitações de usar o Hugging Face como um serviço gratuito. Como custa muito dinheiro para manter este modelo na memória, o Hugging Face vai automaticamente limpar o seu modelo da memória se ele não estiver sendo utilizado. Isso economiza recursos e dinheiro para eles em um modelo que não está recebendo muito tráfego.

Às vezes, esse processo pode levar até **5 minutos**. Então, não se preocupe se tiver que esperar vários minutos.

Assim como no Colab, você acabou de gerar uma imagem! Acesse o seu [link de uso clicando aqui](https://api-inference.huggingface.co/dashboard/usage). Isso é realmente legal. O Hugging Face te dá 30.000 caracteres gratuitos (basicamente, créditos para executar essas consultas). Isso é mais do que suficiente para começar. :)

**Uau - você acabou de criar um modelo personalizado, hospedá-lo em algum lugar e agora tem um ponto de extremidade que pode chamar em seu aplicativo web! 👀**

### Por favor, faça isso, senão o Raza ficará triste

A parte mais legal do MidJourney é o servidor do Discord. Você pode ver o que todo mundo está fazendo e realmente se inspirar. Eu quero que você compartilhe seus melhores prompts em `#prompts`. Conte-nos o que funciona e o que não funciona! Esta nova tecnologia é um mistério, podemos descobrir juntos! :)

