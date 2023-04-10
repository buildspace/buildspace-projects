
Você pode estar se perguntando como essa coisa funciona. Honestamente, entender como isso funciona irá aprimorar ainda mais seu uso.

*Observação: se você já sabe como o GPT-3 (aprendizado profundo) funciona, fique à vontade para pular essa parte.*

### Os fundamentos por trás do GPT-3

Você pode ter ouvido por aí que o GPT-3 é composto de muitos "parâmetros" – cada parâmetro é um **número especializado**. Quando você insere uma frase no GPT-3, ele combinará essa frase com todos os seus parâmetros para prever o que deve vir a seguir.

O GPT-3 tem **175 bilhões desses parâmetros**, e isso ocupa 800 GB.

Cada parâmetro na verdade se parece com isto:


```
saída = entrada * parâmetro
```

*Observação: estou simplificando bastante a matemática aqui, pois estamos apenas tentando entender os conceitos. Muitos cálculos acontecem dentro do GPT-3, mas não estou tentando ensiná-lo sobre derivadas agora rsrs.*

Então, no caso acima, a “entrada” é a frase que estamos fornecendo e o “parâmetro” é um número exclusivo. **Reunimos todas as saídas dos 175 bilhões de parâmetros exclusivos, as combinamos e obtemos nossa saída final: palavras que completam a frase.**

Você pode estar se perguntando como podemos multiplicar uma frase com vários números. Basicamente, cada frase é dividida em “**tokens**” e convertida em um conjunto de números.

O GPT-3 possui um dicionário criado para mapear pedaços de palavras para números. Por exemplo, a palavra “gangue” pode ser representada como um token `4332`.

E fazendo isso, tudo é apenas um número para o GPT-3.

Ele não vê palavras, frases, etc. **Tudo o que vê são números** (Matrix?). Mesmo quando ele gera algo, ele gera como números - mas, no Playground, ele irá converter automaticamente os tokens em palavras em inglês com base em seu dicionário.

Isso é muito impressionante - significa que o GPT-3 não entende a linguagem como nós entendemos. Em vez disso, ele entende a linguagem como uma coleção de números e as relações que esses números têm com os parâmetros.

Quando vemos “Eu comi comida e eu”, sabemos o que isso significa porque entendemos as palavras. Então, saberemos como completar a frase.

Quando o GPT-3 vê “Eu comi comida e eu”, pode ver a frase como *“40222 5332 13211 433 45455”.* Ele pega essas entradas, **as combina com seus parâmetros** e gera “*45533 2233 4543”*, que completa a frase “Eu comi comida que estava boa”.

### Parâmetros — o coração do GPT-3

O parâmetro parece ser a coisa mágica aqui, e você está certo nisso.

Como diabos o GPT-3 sabe como completar as frases?

**Bem, porque os parâmetros foram “treinados” em um conjunto de dados que incluía uma infinidade de textos de toda a Internet** — Wikipédia, artigos de notícias, blogs, repositórios do github, twitter, fóruns, todas essas coisas. O GPT-3 é treinado em quase 500 bilhões de tokens da Internet. Todos aqueles comentários no YouTube, todas aquelas críticas de filmes, todas aquelas páginas de destino de produtos, o GPT-3 viu tudo isso.

Então, o que significa quando dizemos que os parâmetros são “treinados” nesses dados?

Aqui está uma frase que eu retirei da página da Wikipedia sobre o Naruto:

```
Uma raposa poderosa conhecida como Nove Caudas ataca Konoha
```

Ao treinar o GPT-3, o que acontece é que **removemos** a última palavra e dizemos ao GPT-3 para prever o que vem a seguir. Então, por exemplo, durante o treinamento diríamos:

```
Uma raposa poderosa conhecida como Nove Caudas ataca
```

Agora, se o GPT-3 gerar “Índia” no final desta frase, o que acontece? Bem, precisamos dizer ao GPT-3 que ele estava errado! Mas como dizemos ao GPT-3 - “Ei, você deveria ter dito Konoha, não Índia”.

O que fazemos aqui é calcular a diferença entre “Índia” e “Konoha” — lembre-se, o GPT-3 lida com números. Então podemos dizer: “Ei, você nos deu 4333, mas precisávamos de 32213”. Calculamos a diferença como um “erro”.

Por favor, observe: estou simplificando tudo isso. A matemática que está acontecendo nos bastidores para calcular o erro é muito mais complexa. Mas, queremos que você entenda isso conceitualmente!

Esse erro é então usado para atualizar cada parâmetro no modelo - dizemos ao GPT-3 que ele errou a resposta correta por um valor x e para ajustar ligeiramente todos os seus parâmetros para que seja mais provável gerar a resposta correta na próxima vez.

Isso é chamado de “treinamento não supervisionado”. Veja uma explicação visual [aqui](https://jalammar.github.io/images/gpt3/03-gpt3-training-step-back-prop.gif).

**Este processo continua… e continua… e continua.**

No treinamento, continuamos dando ao GPT-3 **bilhões** de frases para completar até que ele fique realmente bom em completar frases. E ele continua fazendo isso... por um longo tempo, em muitos textos. 

Curiosidade: custa cerca de 5 milhões de dólares em tempo de GPU para treinar o GPT-3.

### Há muito mais coisas nisso tudo

Como o GPT-3 é enorme em termos de número de parâmetros e como o conjunto de dados usado para treiná-lo é imenso, obtemos algo mágico – um modelo que parece ter uma compreensão real da linguagem, contexto, cultura e conhecimento factual.

**Ele é uma fera treinada em dados gerados por bilhões de pessoas que utilizam a internet**. E essa é uma das principais razões pelas quais o GPT-3 é tão bom. O conjunto de dados usado para treiná-lo foi a internet, que é bem vasta e diversificada.

O que expliquei acima são, na verdade, os fundamentos de algo chamado “aprendizado profundo” – e o aprendizado profundo é o coração do GPT-3.

Você provavelmente tem muitas outras perguntas – *Qual é a matemática por trás disso? O que é exatamente um parâmetro e como ele é atualizado? O que diabos é aprendizado profundo?*

**Aqui está o meu conselho: continue experimentando com o GPT-3 e termine este projeto. Não fique obcecado com o funcionamento dele agora.** Depois de terminar este projeto, recomendo acessar [este link](https://course.fast.ai/Lessons/lesson3.html) para aprender mais sobre aprendizado profundo, se você estiver curioso.

Além disso, está tudo bem se você simplesmente **não entender como essa coisa funciona ou não se importar** e apenas quiser usá-la. Duvido que 99% de vocês entendam *profundamente* como a placa de circuito em seus smartphones funciona. A maioria de nós realmente não se importa! Queremos apenas usar nossos smartphones.

E está tudo bem. Você não precisa entender tudo.

Desde que você entenda os conceitos fundamentais, estamos prontos para seguir em frente!!

