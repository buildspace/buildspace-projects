## 🤖 Acuñando NFTs con SVG estáticos.

## 🤘 Crea tus SVG

Aquí el código de nuestra caja negra de SVG nuevamente:

```html
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
    <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
    <rect width="100%" height="100%" fill="black" />
    <text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">EpicLordHamburger</text>
</svg>
```

A continuación, queremos obtener los datos en nuestro NFT sin tener que alojarlos en algún lugar como imgur (¡que puede fallar o morir en cualquier momento!). Dirígete a [este](https://www.utilities-online.info/base64) sitio web. Pegue su código SVG completo arriba y luego haga clic en "codificar" para obtener su SVG codificado en base64. Ahora, ¿listo para un poco de magia? Abre una nueva pestaña. Y en la barra de URL pega esto:

```plaintext
data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE
```

Por ejemplo, el mío se ve así:

```plaintext
data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4=
```

Convertimos nuestro código SVG en una bonita cadena :). base64 es básicamente un estándar aceptado para codificar datos en una cadena. Entonces, cuando decimos `data:image/svg+xml;base64`, básicamente estamos diciendo: "Oye, te estoy dando datos codificados en base64, procésalos como un SVG, ¡gracias!".

Tome toda la cadena `data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE` y péguela en la barra de direcciones de su navegador y verá el SVG. Nota: si obtiene un error, verifique que haya seguido todos los pasos correctamente. Es fácil equivocarse :).

Bueno, **épico**. Esta es una forma de mantener nuestros datos de imágenes NFT permanentes y disponibles para siempre. Todos los centros de datos del mundo pueden incendiarse, pero dado que tenemos esta cadena codificada en base64, veríamos el SVG siempre que tengamos una computadora y un navegador.

![Untitled](https://i.imgur.com/f9mXVSb.png)
 
## ☠️ ¡Deshagámonos del archivo JSON alojado!

¿Recuerdas nuestros metadatos JSON?

Lo hice algunos cambios para nuestros NFT de tres palabras :). ¡La misma cosa! Un nombre, descripción e imagen. Pero ahora, en lugar de apuntar a un enlace imgur, apuntamos a nuestra cadena codificada en base64.

```json
{
    "name": "EpicLordHamburger",
    "description": "An NFT from the highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE"
}
```

Nota: no olvides poner las comillas alrededor de:
`data:image/svg+xml;base64,INSERT_YOUR_BASE64_ENCODED_SVG_HERE`.

Por ejemplo, el mío se ve así:

```json
{
    "name": "EpicLordHamburger",
    "description": "An NFT from the highly acclaimed square collection",
    "image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4="
}
```

Un momento, ¿adónde irá nuestro nuevo y elegante archivo JSON? En este momento, lo alojamos en [este](https://jsonkeeper.com/) sitio web aleatorio. Si ese sitio web deja de funcionar, ¡nuestro hermoso NFT desaparecerá para siempre! Así que esto es lo que vamos a hacer. **Vamos a codificar en base64 todo nuestro archivo JSON.** Al igual que codificamos nuestro SVG.

Dirígete a [este](https://www.utilities-online.info/base64) sitio web de nuevo. Pegue sus metadatos JSON completos con el SVG codificado en base64 (debería verse como lo que tengo arriba) y luego haga clic en "codificar" para obtener su JSON codificado.

Abre una nueva pestaña. Y en la barra de URL pega esto:

```plaintext
data:application/json;base64,INSERT_YOUR_BASE64_ENCODED_JSON_HERE
```

Por ejemplo, la mía se ve así:

```plaintext
data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=
```

Cuando pegues este URI completo en la barra de direcciones del navegador, podrás ver el JSON completo en todo su esplendor. **¡BOOOOM!** Ahora tenemos una manera de mantener nuestros metadatos JSON permanentes y disponibles para siempre.

Aquí hay una captura de pantalla mía:

![Untitled](https://i.imgur.com/y1ZaYGf.png)
 
Nota: En este paso es **muy fácil** equivocarse aquí cuando codificas + copias y pegas cosas. ¡¡¡Así que ten mucho cuidado!!! Y vuelve a comprobar que todo funciona. Si las cosas se están rompiendo, ¡repite todos los pasos nuevamente!

## 🚀 Hagamos cambios en el contrato e implementemos.

De acuerdo, esto es increíble, tenemos este elegante archivo JSON codificado en base64. ¿Cómo lo ponemos en nuestro contrato inteligente? Vamos a `MyEpicNFT.sol` y copiamos y pegamos toda la cadena grande en nuestro contrato.

Solo hay que cambiar una línea de código.
```solidity
_setTokenURI(newItemId, "data:application/json;base64,INSERT_BASE_64_ENCODED_JSON_HERE")
```

Por ejemplo, el mío se ve así:

```solidity
_setTokenURI(newItemId, "data:application/json;base64,ewogICAgIm5hbWUiOiAiRXBpY0xvcmRIYW1idXJnZXIiLAogICAgImRlc2NyaXB0aW9uIjogIkFuIE5GVCBmcm9tIHRoZSBoaWdobHkgYWNjbGFpbWVkIHNxdWFyZSBjb2xsZWN0aW9uIiwKICAgICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0TkNpQWdJQ0E4YzNSNWJHVStMbUpoYzJVZ2V5Qm1hV3hzT2lCM2FHbDBaVHNnWm05dWRDMW1ZVzFwYkhrNklITmxjbWxtT3lCbWIyNTBMWE5wZW1VNklERTBjSGc3SUgwOEwzTjBlV3hsUGcwS0lDQWdJRHh5WldOMElIZHBaSFJvUFNJeE1EQWxJaUJvWldsbmFIUTlJakV3TUNVaUlHWnBiR3c5SW1Kc1lXTnJJaUF2UGcwS0lDQWdJRHgwWlhoMElIZzlJalV3SlNJZ2VUMGlOVEFsSWlCamJHRnpjejBpWW1GelpTSWdaRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlJbTFwWkdSc1pTSWdkR1Y0ZEMxaGJtTm9iM0k5SW0xcFpHUnNaU0krUlhCcFkweHZjbVJJWVcxaWRYSm5aWEk4TDNSbGVIUStEUW84TDNOMlp6ND0iCn0=")
```

Finalmente, implementaremos nuestro contrato actualizado, acuñemos el NFT y vamos a asegurarnos de que funcione correctamente en OpenSea. Despleguemos usando el mismo comando. Cambié un poco mi secuencia de comandos de implementación para solo acuñar un NFT en lugar de dos, ¡siéntete libre de hacer lo mismo!

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Luego, igual que antes, esperemos un par de minutos, tomemos la dirección del contrato, buscamos en [https://testnets.opensea.io/](https://testnets.opensea.io/) y el NFT debe estar allí :). Nuevamente, no des clic en "Enter" cuando busques el NFT; debes hacer clic en la colección cuando aparezca en la barra de búsqueda. ¿De acuerdo?

Nota: Recuerda usar
`https://rinkeby.rarible.com/token/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE` si OpenSea estuviera lento.

![Untitled](https://i.imgur.com/Z2mKTpK.png)
 
## 🚨 Reporte de avances.
Si obtuviste un elegante NFT, ¡mándanos una captura de pantalla en OpenSea en el canal `#progress` en Discord!
