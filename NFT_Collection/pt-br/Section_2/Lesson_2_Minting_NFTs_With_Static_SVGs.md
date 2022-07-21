## 🤘 Criando nosso SVG

Aqui está nosso SVG caixa preta novamente.

```html
<svg
  xmlns="http://www.w3.org/2000/svg"
  preserveAspectRatio="xMinYMin meet"
  viewBox="0 0 350 350"
>
  <style>
    .base {
      fill: white;
      font-family: serif;
      font-size: 14px;
    }
  </style>
  <rect width="100%" height="100%" fill="black" />
  <text
    x="50%"
    y="50%"
    class="base"
    dominant-baseline="middle"
    text-anchor="middle"
  >
    EpicLordHamburger
  </text>
</svg>
```

Depois, precisamos de algum jeito pegar os dados das nossas NFT sem hospedar em algum lugar como o imgur (que pode cair ou morrer a qualquer momento!). Vá até [esse](https://www.utilities-online.info/base64) site. Cole todo o código SVG acima e clique em "encode" para pegar seu SVG base 64 encoded. Agora, está pronto para alguma mágica? Abra uma nova guia. E no URL, digite isso:

```plaintext
data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE
```

Então por exemplo, o meu se parece com isso:

```plaintext
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4=
```

Nós tornamos nosso código SVG em uma string :). Base64 é basicamente um padrão aceito para encodificar dados em uma string. Então quando falamos `data:image/svg+xml;base64`, estamos basicamente dizendo: "Ei, estou prestes a ter dar dados codificados com base64, por favor processe como um SVG, obrigado!".

Pegue toda essa string, `data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE` e cole na barra de pesquisa do seu browser e BOOM! Você verá o SVG! Nota: se você tiver um erro, cheque duas vezes se seguiu todos os passos corretamente. É fácil se confundir :).

Ok, **épico**. Essa é uma maneira de manter os dados da nossa imagem NFT permanentes e disponíveis para sempre. Todos os centros de dados do mundo podem queimar, e porque nós temos a string codificada com base64, nós sempre vamos poder ver o SVG enquanto tivermos um computador e um browser.

![Untitled](https://i.imgur.com/f9mXVSb.png)

☠️ Nos livrando do JSON hospedado.

Lembra dos metadados JSON?

Então, eu mudei um pouco para nossas NFTs de três palavras :). Mesma coisa! Um nome, descrição e imagem. Mas agora, ao invés de apontar para um link imgur, vamos apontar para a nossa string codificada com base64.

```json
{
  "name": "EpicLordHamburger",
  "description": "An NFT from the highly acclaimed square collection",
  "image": "data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE"
}
```

Nota: não esqueça as aspas ao redor de `data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE`.

Por exemplo, o meu parece com isso:

```json
{
  "name": "EpicLordHamburger",
  "description": "An NFT from the highly acclaimed square collection",
  "image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4="
}
```

Mas espere - onde o nosso chique arquivo JSON vai? Nesse momento, estamos hospedando [nesse](https://jsonkeeper.com/) site. Se ele cair, nossa linda NFT se foi pra sempre! Aqui o que vamos fazer: **nós vamos codificar nosso arquivo JSON com base64 também.** Do mesmo jeito que nosso SVG.

Vá para [esse](https://www.utilities-online.info/base64) site de novo. Cole todos os metadados JSON com o SVG codificado com base64 (deve se parecer com o que eu tenho abaixo) e clique "Q".

Abra uma nova aba. E no URL cole isso:

```plaintext
data:application/json;base64,INSERT_YOUR_BASE64_ENCODED_JSON_HERE
```

Por exemplo, o meu parece com isso:

```plaintext
data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=
```

Quando colarmos o nosso URI inteiro na barra de pesquisa do browser, você vai ver o JSON inteiro em toda sua glória. **BOOOM!** Agora nós temos uma maneira de manter nossos metadados JSON permanentes e para sempre disponíveis.

Aqui está um screenshot do meu:

![Untitled](https://i.imgur.com/y1ZaYGf.png)

Nota: É **muito fácil** se confundir aqui em codificar e copiar e colar as coisas. Então, seja cuidadoso!!! Cheque duas vezes que tudo funciona. Se as coisas estão dando errado, siga os passos novamente.

## 🚀 Mudando o contrato, fazendo deploy

Ok, incrível, nós conseguimos esse chique arquivo JSON codificado com base64. Como conseguimos ele no nosso contrato? Vá para `MyEpicNFT.sol` e - copiamos e colamos toda a grande string no nosso contrato.

Só precisamos mudar uma linha.

```solidity
_setTokenURI(newItemId, "data:application/json;base64,INSERT_BASE_64_ENCODED_JSON_HERE")
```

Por exemplo, o meu se parece com:

```solidity
_setTokenURI(newItemId, "data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=")
```

Finalmente, vamos fazer deploy do nosso contrato atualizado, mintar a NFT, e ter certeza que funciona corretamente no OpenSea! Faça o deploy usando o mesmo comando. Eu mudei o meu script de deploy para mintar uma NFT ao invés de duas, sinta-se livre para fazer o mesmo!

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Depois, a mesma coisa de antes, espere um minuto ou dois, pegue o endereço do contrato, procure no [https://testnets.opensea.io/](https://testnets.opensea.io/) e você deve ver sua NFT ali :). De novo, não clique "Enter" quando estiver procurando -- você deve clicar na coleção quando aparecer na barra de pesquisa.

Nota: lembre de usar `https://rinkeby.rarible.com/token/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE` se o OpenSea estiver muito lento.

![Untitled](https://i.imgur.com/Z2mKTpK.png)