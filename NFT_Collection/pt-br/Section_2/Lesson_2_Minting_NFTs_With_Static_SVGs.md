## 🤘 Criando nosso SVG

Aqui está nosso SVG novamente.

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

Depois, precisamos de algum jeito pegar os dados das nossas NFT sem hospedar em algum lugar como o imgur (que pode cair ou morrer a qualquer momento!). Vá até [esse](https://www.utilities-online.info/base64) site. Cole todo o código SVG acima e clique em "encode" para pegar seu SVG base 64 encoded. Agora, está pronto para alguma mágica? Abra uma nova guia. E no URL, digite isso:

```plaintext
data:image/svg+xml;base64,INSIRA_SEU_SVG_ENCODADO_EM_BASE64_AQUI
```

Então por exemplo, o meu se parece com isso:

```plaintext
data:image/svg+xml;base64,PHN2ZwogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0IgogIHZpZXdCb3g9IjAgMCAzNTAgMzUwIgo+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9IkdyYWRpZW50MSI+CiAgICAgIDxzdG9wIGNsYXNzPSJzdG9wMSIgb2Zmc2V0PSIwJSIvPgogICAgICA8c3RvcCBjbGFzcz0ic3RvcDIiIG9mZnNldD0iNTAlIi8+CiAgICAgIDxzdG9wIGNsYXNzPSJzdG9wMyIgb2Zmc2V0PSIxMDAlIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8c3R5bGU+CiAgICAuYmFzZSB7CiAgICAgIGZpbGw6IGJsdWU7CiAgICAgIGZvbnQtZmFtaWx5OiBzZXJpZjsKICAgICAgZm9udC1zaXplOiAyMHB4OwogICAgICBjb2xvcjogI0ZGRjsKICAgIH0KICAgIC5zdG9wMSB7IHN0b3AtY29sb3I6IGdyZWVuOyB9CiAgICAuc3RvcDIgeyBzdG9wLWNvbG9yOiB3aGl0ZTsgc3RvcC1vcGFjaXR5OiAwOyB9CiAgICAuc3RvcDMgeyBzdG9wLWNvbG9yOiB5ZWxsb3c7IH0KICAgIAogIDwvc3R5bGU+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNHcmFkaWVudDEpIiAvPgogIDx0ZXh0CiAgICB4PSI1MCUiCiAgICB5PSI1MCUiCiAgICBjbGFzcz0iYmFzZSIKICAgIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiCiAgICB0ZXh0LWFuY2hvcj0ibWlkZGxlIgogID4KICAgIFR1YmFpbmFNb3F1ZWNhTWFyYWN1amEKICA8L3RleHQ+Cjwvc3ZnPg==
```

Nós tornamos nosso código SVG em uma string :). Base64 é basicamente um padrão aceito para encodificar dados em uma string. Então quando falamos `data:image/svg+xml;base64`, estamos basicamente dizendo: "Ei, estou prestes a ter dar dados codificados com base64, por favor processe como um SVG, obrigado!".

Pegue toda essa string, `data:image/svg+xml;base64,INSIRA_SEU_SVG_ENCODADO_EM_BASE64_AQUI` e cole na barra de pesquisa do seu browser e BOOM! Você verá o SVG! Nota: se você tiver um erro, cheque duas vezes se seguiu todos os passos corretamente. É fácil se confundir :).

Ok, **épico**. Essa é uma maneira de manter os dados da nossa imagem NFT permanentes e disponíveis para sempre. Todos os centros de dados do mundo podem queimar, e porque nós temos a string codificada com base64, nós sempre vamos poder ver o SVG enquanto tivermos um computador e um browser.

![Untitled](https://i.imgur.com/xS0sYcT.png)

☠️ Nos livrando do JSON hospedado.

Lembra dos metadados JSON?

Então, eu mudei um pouco para nossas NFTs de três palavras :). Mesma coisa! Um nome, descrição e imagem. Mas agora, ao invés de apontar para um link imgur, vamos apontar para a nossa string codificada com base64.

```json
{
  "name": "TubainaMoquecaMaracuja",
  "description": "Um NFT super famoso de uma coleção de quadrados",
  "image": "data:image/svg+xml;base64,INSIRA_SEU_SVG_ENCODADO_EM_BASE64_AQUI"
}
```

Nota: não esqueça as aspas ao redor de `data:image/svg+xml;base64,INSIRA_SEU_SVG_ENCODADO_EM_BASE64_AQUI`.

Por exemplo, o meu parece com isso:

```json
{
  "name": "TubainaMoquecaMaracuja",
  "description": "Um NFT super famoso de uma coleção de quadrados",
  "image": "data:image/svg+xml;base64,PHN2ZwogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWluWU1pbiBtZWV0IgogIHZpZXdCb3g9IjAgMCAzNTAgMzUwIgo+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9IkdyYWRpZW50MSI+CiAgICAgIDxzdG9wIGNsYXNzPSJzdG9wMSIgb2Zmc2V0PSIwJSIvPgogICAgICA8c3RvcCBjbGFzcz0ic3RvcDIiIG9mZnNldD0iNTAlIi8+CiAgICAgIDxzdG9wIGNsYXNzPSJzdG9wMyIgb2Zmc2V0PSIxMDAlIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8c3R5bGU+CiAgICAuYmFzZSB7CiAgICAgIGZpbGw6IGJsdWU7CiAgICAgIGZvbnQtZmFtaWx5OiBzZXJpZjsKICAgICAgZm9udC1zaXplOiAyMHB4OwogICAgICBjb2xvcjogI0ZGRjsKICAgIH0KICAgIC5zdG9wMSB7IHN0b3AtY29sb3I6IGdyZWVuOyB9CiAgICAuc3RvcDIgeyBzdG9wLWNvbG9yOiB3aGl0ZTsgc3RvcC1vcGFjaXR5OiAwOyB9CiAgICAuc3RvcDMgeyBzdG9wLWNvbG9yOiB5ZWxsb3c7IH0KICAgIAogIDwvc3R5bGU+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNHcmFkaWVudDEpIiAvPgogIDx0ZXh0CiAgICB4PSI1MCUiCiAgICB5PSI1MCUiCiAgICBjbGFzcz0iYmFzZSIKICAgIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiCiAgICB0ZXh0LWFuY2hvcj0ibWlkZGxlIgogID4KICAgIFR1YmFpbmFNb3F1ZWNhTWFyYWN1amEKICA8L3RleHQ+Cjwvc3ZnPg=="
}
```

Mas espere - onde o nosso chique arquivo JSON vai? Nesse momento, estamos hospedando [nesse](https://jsonkeeper.com/) site. Se ele cair, nossa linda NFT se foi pra sempre! Aqui o que vamos fazer: **nós vamos codificar nosso arquivo JSON com base64 também.** Do mesmo jeito que nosso SVG.

Vá para [esse](https://www.utilities-online.info/base64) site de novo. Cole todos os metadados JSON com o SVG codificado com base64 (deve se parecer com o que eu tenho abaixo) e clique em "encode".

Abra uma nova aba. E no URL cole isso:

```plaintext
data:application/json;base64,INSIRA_SEU_JSON_ENCODADO_EM_BASE64_AQUI
```

Por exemplo, o meu parece com isso:

```plaintext
data:application/json;base64,ewogICJuYW1lIjogIlR1YmFpbmFNb3F1ZWNhTWFyYWN1amEiLAogICJkZXNjcmlwdGlvbiI6ICJVbSBORlQgc3VwZXIgZmFtb3NvIGRlIHVtYSBjb2xlw6fDo28gZGUgcXVhZHJhZG9zIiwKICAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWndvZ0lIaHRiRzV6UFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1EQXdMM04yWnlJS0lDQndjbVZ6WlhKMlpVRnpjR1ZqZEZKaGRHbHZQU0o0VFdsdVdVMXBiaUJ0WldWMElnb2dJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWdvK0NpQWdQR1JsWm5NK0NpQWdJQ0E4YkdsdVpXRnlSM0poWkdsbGJuUWdhV1E5SWtkeVlXUnBaVzUwTVNJK0NpQWdJQ0FnSUR4emRHOXdJR05zWVhOelBTSnpkRzl3TVNJZ2IyWm1jMlYwUFNJd0pTSXZQZ29nSUNBZ0lDQThjM1J2Y0NCamJHRnpjejBpYzNSdmNESWlJRzltWm5ObGREMGlOVEFsSWk4K0NpQWdJQ0FnSUR4emRHOXdJR05zWVhOelBTSnpkRzl3TXlJZ2IyWm1jMlYwUFNJeE1EQWxJaTgrQ2lBZ0lDQThMMnhwYm1WaGNrZHlZV1JwWlc1MFBnb2dJRHd2WkdWbWN6NEtJQ0E4YzNSNWJHVStDaUFnSUNBdVltRnpaU0I3Q2lBZ0lDQWdJR1pwYkd3NklHSnNkV1U3Q2lBZ0lDQWdJR1p2Ym5RdFptRnRhV3g1T2lCelpYSnBaanNLSUNBZ0lDQWdabTl1ZEMxemFYcGxPaUF5TUhCNE93b2dJQ0FnSUNCamIyeHZjam9nSTBaR1Jqc0tJQ0FnSUgwS0lDQWdJQzV6ZEc5d01TQjdJSE4wYjNBdFkyOXNiM0k2SUdkeVpXVnVPeUI5Q2lBZ0lDQXVjM1J2Y0RJZ2V5QnpkRzl3TFdOdmJHOXlPaUIzYUdsMFpUc2djM1J2Y0MxdmNHRmphWFI1T2lBd095QjlDaUFnSUNBdWMzUnZjRE1nZXlCemRHOXdMV052Ykc5eU9pQjVaV3hzYjNjN0lIMEtJQ0FnSUFvZ0lEd3ZjM1I1YkdVK0NpQWdQSEpsWTNRZ2QybGtkR2c5SWpFd01DVWlJR2hsYVdkb2REMGlNVEF3SlNJZ1ptbHNiRDBpZFhKc0tDTkhjbUZrYVdWdWRERXBJaUF2UGdvZ0lEeDBaWGgwQ2lBZ0lDQjRQU0kxTUNVaUNpQWdJQ0I1UFNJMU1DVWlDaUFnSUNCamJHRnpjejBpWW1GelpTSUtJQ0FnSUdSdmJXbHVZVzUwTFdKaGMyVnNhVzVsUFNKdGFXUmtiR1VpQ2lBZ0lDQjBaWGgwTFdGdVkyaHZjajBpYldsa1pHeGxJZ29nSUQ0S0lDQWdJRlIxWW1GcGJtRk5iM0YxWldOaFRXRnlZV04xYW1FS0lDQThMM1JsZUhRK0Nqd3ZjM1puUGc9PSIKfQo=
```

Quando colarmos o nosso URI inteiro na barra de pesquisa do browser, você vai ver o JSON inteiro em toda sua glória. **BOOOM!** Agora nós temos uma maneira de manter nossos metadados JSON permanentes e para sempre disponíveis.

Aqui está um screenshot do meu:

![Untitled](https://i.imgur.com/pOcoU27.png)

Nota: É **muito fácil** se confundir aqui em codificar e copiar e colar as coisas. Então, seja cuidadoso!!! Cheque duas vezes que tudo funciona. Se as coisas estão dando errado, siga os passos novamente.

## 🚀 Mudando o contrato, fazendo deploy

Ok, incrível, nós conseguimos esse chique arquivo JSON codificado com base64. Como conseguimos ele no nosso contrato? Vá para `MyEpicNFT.sol` e - copiamos e colamos toda a grande string no nosso contrato.

Só precisamos mudar uma linha.

```solidity
_setTokenURI(newItemId, "data:application/json;base64,INSIRA_SEU_JSON_ENCODADO_EM_BASE64_AQUI")
```

Por exemplo, o meu se parece com:

```solidity
_setTokenURI(newItemId, "data:application/json;base64,ewogICJuYW1lIjogIlR1YmFpbmFNb3F1ZWNhTWFyYWN1amEiLAogICJkZXNjcmlwdGlvbiI6ICJVbSBORlQgc3VwZXIgZmFtb3NvIGRlIHVtYSBjb2xlw6fDo28gZGUgcXVhZHJhZG9zIiwKICAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWndvZ0lIaHRiRzV6UFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1EQXdMM04yWnlJS0lDQndjbVZ6WlhKMlpVRnpjR1ZqZEZKaGRHbHZQU0o0VFdsdVdVMXBiaUJ0WldWMElnb2dJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWdvK0NpQWdQR1JsWm5NK0NpQWdJQ0E4YkdsdVpXRnlSM0poWkdsbGJuUWdhV1E5SWtkeVlXUnBaVzUwTVNJK0NpQWdJQ0FnSUR4emRHOXdJR05zWVhOelBTSnpkRzl3TVNJZ2IyWm1jMlYwUFNJd0pTSXZQZ29nSUNBZ0lDQThjM1J2Y0NCamJHRnpjejBpYzNSdmNESWlJRzltWm5ObGREMGlOVEFsSWk4K0NpQWdJQ0FnSUR4emRHOXdJR05zWVhOelBTSnpkRzl3TXlJZ2IyWm1jMlYwUFNJeE1EQWxJaTgrQ2lBZ0lDQThMMnhwYm1WaGNrZHlZV1JwWlc1MFBnb2dJRHd2WkdWbWN6NEtJQ0E4YzNSNWJHVStDaUFnSUNBdVltRnpaU0I3Q2lBZ0lDQWdJR1pwYkd3NklHSnNkV1U3Q2lBZ0lDQWdJR1p2Ym5RdFptRnRhV3g1T2lCelpYSnBaanNLSUNBZ0lDQWdabTl1ZEMxemFYcGxPaUF5TUhCNE93b2dJQ0FnSUNCamIyeHZjam9nSTBaR1Jqc0tJQ0FnSUgwS0lDQWdJQzV6ZEc5d01TQjdJSE4wYjNBdFkyOXNiM0k2SUdkeVpXVnVPeUI5Q2lBZ0lDQXVjM1J2Y0RJZ2V5QnpkRzl3TFdOdmJHOXlPaUIzYUdsMFpUc2djM1J2Y0MxdmNHRmphWFI1T2lBd095QjlDaUFnSUNBdWMzUnZjRE1nZXlCemRHOXdMV052Ykc5eU9pQjVaV3hzYjNjN0lIMEtJQ0FnSUFvZ0lEd3ZjM1I1YkdVK0NpQWdQSEpsWTNRZ2QybGtkR2c5SWpFd01DVWlJR2hsYVdkb2REMGlNVEF3SlNJZ1ptbHNiRDBpZFhKc0tDTkhjbUZrYVdWdWRERXBJaUF2UGdvZ0lEeDBaWGgwQ2lBZ0lDQjRQU0kxTUNVaUNpQWdJQ0I1UFNJMU1DVWlDaUFnSUNCamJHRnpjejBpWW1GelpTSUtJQ0FnSUdSdmJXbHVZVzUwTFdKaGMyVnNhVzVsUFNKdGFXUmtiR1VpQ2lBZ0lDQjBaWGgwTFdGdVkyaHZjajBpYldsa1pHeGxJZ29nSUQ0S0lDQWdJRlIxWW1GcGJtRk5iM0YxWldOaFRXRnlZV04xYW1FS0lDQThMM1JsZUhRK0Nqd3ZjM1puUGc9PSIKfQo=")
```

Finalmente, vamos fazer deploy do nosso contrato atualizado, mintar a NFT, e ter certeza que funciona corretamente no OpenSea! Faça o deploy usando o mesmo comando. Eu mudei o meu script de deploy para mintar uma NFT ao invés de duas, sinta-se livre para fazer o mesmo!

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Depois, a mesma coisa de antes, espere um minuto ou dois, pegue o endereço do contrato, procure no [https://testnets.opensea.io/](https://testnets.opensea.io/) e você deve ver sua NFT ali :). De novo, não clique "Enter" quando estiver procurando -- você deve clicar na coleção quando aparecer na barra de pesquisa.

Nota: lembre de usar `https://rinkeby.rarible.com/token/INSIRA_O_ENDEREÇO_DO_CONTRATO_AQUI:INSIRA_O_TOKEN_ID_AQUI` se o OpenSea estiver muito lento.

![Untitled](https://i.imgur.com/lYCAzph.png)

🚨 Relatório de progresso.
------------------------
Se você tem um NFT chique, não esquece de mandar um print dele na OpenSea no canal `#progresso` da sua turma no Discord!
