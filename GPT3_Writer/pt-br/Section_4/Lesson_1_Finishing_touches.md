
*Observação: tudo aqui é opcional, exceto a última parte de implantação para a produção. Não pule isso!*

### Opcional: faça a extensão funcionar em qualquer site que você quiser

Você agora tem uma extensão do Chrome que pode literalmente injetar em uma página da web e gerar texto usando o GPT-3 onde quer que o usuário esteja escrevendo.

Eu realmente quero que você dê um passo atrás e entenda a loucura que isso é.

**Você tem novos poderes. As possibilidades são infinitas.**

Hoje, mostrei a você como fazer essa coisa funcionar no Calmly, que é um site que uso muito para escrever. Mas agora você pode seguir as mesmas instruções exatas para fazer isso funcionar em qualquer site que quiser - Twitter, Gmail, Notion, Reddit, qualquer um.

Lembre-se de que a razão pela qual não funcionará em nenhum site agora é porque cada site tem uma estrutura HTML muito diferente. Então, se você quiser fazê-lo funcionar em outro site, basta inspecionar a estrutura HTML do site desejado e depois escrever algum código específico para a estrutura HTML deste site, da mesma forma que fizemos com o Calmly.

Por exemplo, o Twitter tem uma estrutura muito mais complexa, como você pode ver abaixo. Mas, poderíamos usar a mesma estratégia que usamos com o Calmly.

![Untitled](https://i.imgur.com/AVAy3fi.pngs)

Espero que você possa ver agora como as extensões do Chrome são incríveis rsrs. Elas lhe dão uma quantidade insana de poder.

Eu não ficaria surpreso se um de vocês ganhasse 1 milhão de dólares em receita recorrente mensal (MRR) com sua extensão do Chrome. Eu literalmente pagaria 49 dólares por mês por uma extensão do Chrome que fizesse qualquer uma dessas coisas:

- Injetar diretamente no Figma para ajudar os designers a escrever um texto de teste para meus projetos.
- Injetar diretamente no Google Ads para ajudar os profissionais de marketing a escrever o texto do anúncio.
- Injetar diretamente no Twitter ajuda os usuários a responder a DMs mais rapidamente, de maneira mais personalizada. Mais ou menos como o preenchimento automático do Gmail.
- Injetar diretamente no Webflow para ajudar os usuários a escrever o texto da landing page enquanto estão realmente trabalhando na landing page.
- Injetar diretamente no Notion para ajudar as equipes de produto a ter novas ideias e escrever especificações realmente boas e acompanhá-las em um só lugar.

As possibilidades são realmente infinitas.

Sinta-se à vontade para tentar fazer sua extensão funcionar no site que escolher. Apenas saiba que vai exigir uma quantidade sólida de tentativa e erro, nem todos os sites têm uma estrutura HTML tão simples quanto o Calmly!

### Opcional: configure sua extensão para download

Digamos que você realmente queira disponibilizar sua extensão do Chrome para download diretamente na loja online do Chrome, a Chrome Web Store, como a maioria das extensões. *A propósito - a Chrome Web Store é suportada em todos os navegadores baseados em Chromium - o que significa que usuários do Brave, Edge, etc. podem adicionar a extensão diretamente da Chrome Web Store.*

![Untitled](https://i.imgur.com/oHxDLjO.png)

Bem, você precisaria enviá-la para aprovação, o que pode levar alguns dias. Se você quiser seguir esse caminho, pode ler mais sobre isso [aqui](https://developer.chrome.com/docs/webstore/publish/). É altamente recomendável que você explore isso mais tarde, depois de aprimorar mais sua extensão.

Mas, por enquanto, o que podemos fazer é, se alguém quiser usar sua extensão, podemos apenas fornecer um link de download para o código. Em seguida, eles podem fazer a mesma coisa que você, acessando chrome://extensions/ e carregando a extensão manualmente no navegador, executando “Load Unpacked” (Carregar sem compactação).

Isso pode parecer ruim, mas, é melhor do que nada! Além disso, se os usuários passam pela dor de realmente fazer isso, isso significa que eles realmente querem seu produto. Você sempre pode diminuir essa dor mais tarde, quando souber que alguém realmente deseja o que você construiu.

Vá em frente e envie seu código mais recente para o repositório da sua extensão. O Github oferece uma maneira fácil para as pessoas baixarem um arquivo ZIP com todo o repositório. Então, o legal agora é que você pode vincular este repositório diretamente no seu aplicativo da web!

Em seu aplicativo da web, você pode colocar o link para a sua extensão e adicionar algo na parte inferior como -- “Gostou desta ferramenta? Baixe a extensão”. Dessa forma, as pessoas podem experimentar sua ferramenta no aplicativo da web e depois baixar a extensão se estiverem curiosas.

Agora, o aplicativo da web e a extensão devem parecer mais como um produto completo em vez de duas coisas separadas que não têm relação alguma!

### Adicione alguma personalização

Antes de implantarmos o aplicativo da web, faça algumas mudanças finais nele. Realmente faça ele parecer seu! Adicione imagens, gifs, mude as cores. Faça parecer temático para o seu caso de uso. Até mesmo mudar as cores dos botões pode tornar a experiência mais personalizada.

### GTFOL: Vamos para a produção!

É hora de dar o fora do localhost, ou melhor, [GTFOL](https://www.urbandictionary.com/define.php?term=GTFOL).

Nós não queremos ficar apenas no localhost. Isso seria muito chato! Afinal, essa ferramenta de escrita do GPT-3 é muito mais divertida quando você vê como outras pessoas a usam!

Além disso, implantar um aplicativo NextJS ficou tão fácil que deve levar apenas alguns minutos - e então você terá um link para a sua criação que pode compartilhar com o mundo.

Vamos usar o [Railway](https://railway.app?referralCode=buildspace), que é um serviço de implantação como o Vercel/Netlify. É gratuito para usar. Você pode usar o que quiser, como AWS, Netlify, etc.

A razão pela qual estou indo com o Railway em vez do Vercel é porque no plano Hobby do Vercel, as funções sem servidor expiram após 10 segundos. Isso é ruim porque a OpenAI pode levar de 30 a 40 segundos para responder com prompts mais longos. Você terá que começar o teste profissional que encerrará seu aplicativo depois de 14 dias, a menos que você pague $20/mês rsrs. 

![](https://hackmd.io/_uploads/HkecEt3Pj.png)

Acesse o Railway e conecte sua conta do Github. Depois de concluir a configuração e aceitar os termos de serviço, você receberá 500 horas gratuitas!

![](https://hackmd.io/_uploads/H1sWrFnvs.png)

Tudo o que precisamos fazer agora é colocar o código final em seu repositório do Github. Abra uma nova janela do terminal, dê `cd` na pasta do seu projeto e execute o seguinte comando:

```bash
git add .
git commit -m "latest build"
git push
```

*Observação: nós temos um arquivo .gitignore que nos impede de enviar acidentalmente o arquivo `.env` e outros arquivos que não queremos enviar para o controle de origem.*

Aqui está como você pode implantá-lo no Railway:
[https://www.loom.com/share/15d1b1c45d0b46199d677ca3dc222d17](https://www.loom.com/share/15d1b1c45d0b46199d677ca3dc222d17)

**Observação: o Railway não fornecerá um domínio rsrs.** 
Você terá que gerá-lo na aba de configurações do seu projeto:
![](https://hackmd.io/_uploads/ryTbIFhDi.png)

**VOCÊ TERMINOU. VAMOS LÁ!**

### Por favor, faça isso, senão o Farza vai ficar triste

Assim que você implantar sua aplicação web, tire uma captura de tela dela e publique-a em #progress! Mostre ao mundo que você deu o fora do localhost.
