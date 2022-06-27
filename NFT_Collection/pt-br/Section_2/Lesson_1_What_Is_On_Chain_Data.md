## 🔗 O que "on-chain" significa e porque é importante.

Nesse momento, nós temos um grande problema com nossas NFTs.

O que acontece se o imgur cair? Então - nosso link da imagem seria absolutamente inútil, e nosso NFT e o Chaves estarão perdidos! E pior, o que acontece se o site que hospeda o arquivo JSON cair? Então - nossa NFT estaria completamente quebrada pois os metdadados não seriam acessíveis.

Uma maneira de consertar esse problema é armazenar os dados da nossa NFT "on-chain", significando que os dados vivem no contrado ao invés de nas mãos de um terceiro (third-party). Isso significa que nossa NFT será verdadeiramente permanente :). Nesse caso, a única situação onde perdemos nossos dados da NFT seria se a blockchain caísse. E se isso acontecer - bom, aí temos problemas maiores.

Mas, assumindo que a blockchain não caia, nossa NFT vai estar ali para sempre! Isso é bem atraente, porque também significa que se você vender uma NFT, o comprador pode estar confiante que ela não vai quebrar. Muitos projetos populares usam dados "On-chain", [Este aqui](https://techcrunch.com/2021/09/03/loot-games-the-crypto-world/) é um exemplo muito popular!

🖼 O que são SVGs?

---

Uma maneira comum de armazenar dados NFT para imagens é usando um SVG. Um SVG é uma imagem, mas a imagem é construída com código.

Por exemplo, aqui está um exemplo simples de SVG que renderiza uma caixa preta com algum texto branco no meio.

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMinYMin meet"
  viewBox="0 0 350 350"
>
  <defs>
    <linearGradient id="Gradient1">
      <stop class="stop1" offset="0%"/>
      <stop class="stop2" offset="50%"/>
      <stop class="stop3" offset="100%"/>
    </linearGradient>
  </defs>
  <style>
    .base {
      fill: blue;
      font-family: serif;
      font-size: 20px;
      color: #FFF;
    }
    .stop1 { stop-color: green; }
    .stop2 { stop-color: white; stop-opacity: 0; }
    .stop3 { stop-color: yellow; }
    
  </style>
  <rect width="100%" height="100%" fill="url(#Gradient1)" />
  <text
    x="50%"
    y="50%"
    class="base"
    dominant-baseline="middle"
    text-anchor="middle"
  >
    TubainaMoquecaMaracuja
  </text>
</svg>
```

Vá para [esse](https://www.svgviewer.dev/) site e cole o código acima para vê-lo. Sinta-se livre para mexer nele.

Isso é muito legal porque nos deixa criar **imagens com código**.

SVGs podem ser **muito** customizados. Você pode até animá-los. Sinta-se livre para ler mais sobre eles [aqui](https://developer.mozilla.org/pt-BR/docs/Web/SVG/Tutorial).

## 🤘 O que nós vamos fazer.

Primeiro, nós vamos aprender sobre como colocar todos os dados das nossas NFTs "on-chain". Nossa NFT vai ser simplesmente uma caixa com **três palavras engraçadas no centro**. Como o SVG acima. Nós vamos hardcodar o SVG acima no nosso contrato que falam "TubainaMoquecaMaracuja".

Depois disso, nós vamos aprender como **gerar dinamicamente** nossas NFTs no contrato. Assim, **toda vez que alguém mintar uma NFT, vão conseguir um diferente e hilário combo de três palavras**. Por exemplo:

- TubainaMoquecaMaracuja
- GuaranaFeijoadaPitanga
- FantaAcaiGraviola

Vai ser épico :). Vamos fazer isso!