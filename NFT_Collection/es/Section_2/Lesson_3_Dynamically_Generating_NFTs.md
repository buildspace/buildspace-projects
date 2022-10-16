## 🔤 Generemos aleatoriamente palabras en una imagen.

Genial: creamos un contrato que ahora está acuñando NFT en toda la cadena. Pero ¡sigue siendo siempre el mismo NFT argh! Ahora hagámoslo dinámico.

**Escribí todo el código [aquí](https://gist.github.com/farzaa/b788ba3a8dbaf6f1ef9af57eefa63c27) que generará un SVG con una combinación de tres palabras aleatorias.**

Me imagino que esta sería la mejor manera para que las personas vean todo el código a la vez y obtengan una idea de cómo funciona.
¡También escribí un comentario sobre la mayoría de las líneas que agregué/cambié! Cuando mire este código, intenta escribirlo tú mismo. ¡Busca en Google las funciones que no entiendas!

Quiero hacer algunas notas adicionales sobre algunas de estas líneas de código.

## 📝 ¡Escoge tus propias palabras!

```solidity
string[] firstWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];

string[] secondWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];

string[] thirdWords = ["YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD", "YOUR_WORD"];
```
Estas serán nuestras palabras aleatorias, por favor diviértete con esto. Sólo asegúrate que cada palabra sea una palabra individual y que no contenga espacios.
Mientras más graciosas sean las palabras esto será mejor LOL. En este caso, a mí me gusta que cada palabra sea sobre un tema determinado. Por ejemplo, `firstWords` pueden ser los nombres de tus personajes de anime favoritos. Después, `secondWords` pueden ser tus platillos favoritos y `thirdWords` pueden ser nombres de animales. Diviértete con esto, hazlo tuyo. 

Éstas son las mías. La primera fila de palabras son las de “describen” algo.

![](https://i.imgur.com/ADawgrB.png)

A lo mejor quieres generar nombres de bandas musicales aleatorios. Tal vez quieras generar nombres de personajes aleatorios para tus partidas de Calabozos y Dragones. Hazlo como tu quieras. Inclusive a tu no te interesa hacer estas combinaciones de tres palabras y tan sólo quieres hacer SVGs de pingüinos pixeleados. Adelante. Haz cualquier cosa que quieras :)

Nota: Recomiendo que utilices entre 15 y 20 palabras por arreglo, he notado que si usas menos de 10 usualmente no se genera aleatoriedad.

## 🥴 Números Aleatorios.

```solidity
function pickRandomFirstWord
```

Esta función parece un poco funky. ¿no crees? Ahora hablemos de cómo elegir aleatoriamente elementos de las matrices.
Por lo tanto, generar un número aleatorio en contratos inteligentes es ampliamente reconocido como un **problema difícil**.

¿Por qué? Bueno, piensa en cómo se genera normalmente un número aleatorio. Cuando se busca generar un número aleatorio normalmente en un programa, **este tomará un montón de números diferentes de su computadora como fuente de aleatoriedad** como: la velocidad de los ventiladores, la temperatura de la CPU, la cantidad de veces que presionas la tecla " L" a las 3:52 p. m. desde que compraste la computadora, tu velocidad de Internet y muchos otros números que son difíciles de controlar para ti. Toma **todos** estos números que son "aleatorios" y los junta en un algoritmo que genera un número que considera que es el mejor intento de un número verdaderamente "aleatorio". ¿Tiene sentido no crees?

En la “Cadena de Bloques” no existe **claramente una fuente de aleatoriedad**. Porque es donde las entradas o condiciones iniciales producirán invariablemente las mismas salidas o resultados. Todo lo que el contrato contiene es visto por todos. Debido a eso, alguien podría jugar con el sistema simplemente mirando el contrato inteligente, viendo en qué números se basa para la aleatoriedad, y luego la persona podría engañarlo al sistema si quisiera. 

```solidity
random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
```

Lo que este código hace es utilizar dos cosas: la cadena real `FIRST_WORD` y una versión en cadena del `tokenId`. Combinamos estas dos cadenas usando `abi.encodePacked` y luego esa cadena combinada es lo que uso como fuente de aleatoriedad.

**Esto no es verdadera aleatoriedad**. ¡Pero es lo mejor que tenemos por el momento!

Hay otras formas de generar números aleatorios en la cadena de bloques (consultemos [Chainlink](https://docs.chain.link/docs/chainlink-vrf/)), pero Solidity no nos brinda nada confiable de forma nativa porque no puede. Todos los números a los que puede acceder nuestro contrato son públicos y nunca verdaderamente aleatorios.

¡Esto puede ser un poco molesto para algunas aplicaciones como la nuestra en este proyecto! De todos modos, no creo que nadie atacará nuestra aplicación, ¡pero es importante que sepas todo esto llegues a crear una dApp que tenga millones de usuarios!

## ✨ Creando el SVG de forma dinámica.

Revisa la variable `string baseSvg` en el contrato. ¡¡Esto es salvaje!!
Básicamente, la única pieza de nuestro SVG que siempre cambia es el combo de tres palabras y para lograr esto lo que hacemos es crear una variable `baseSvg` que podremos usar una y otra vez al momento de crear nuevos NFTs.

Vamos a juntarlo todo y usemos:

```
string memory finalSvg = string(abi.encodePacked(baseSvg, first, second, third, "</text></svg>"));
```

`</text></svg>` son las etiquetas de cierre, así que para `finalSvg` lo que decimos es: combina baseSVG, la combinación de tres palabras que acabamos de generar y finalmente mis etiquetas de cierre. ¡Eso es todo :)! Todo lo que estamos haciendo es trabajar con el código SVG.

## 😎 Ejecutémoslo.

Una vez que terminamos de escribir todo este código continuemos y ejecutémoslo usando:
`npx hardhat run scripts/run.js`

Revisa el resultado obtenido por `console.log(finalSvg);`

Esto es lo que yo obtuve en mi terminal:

```plaintext
This is my NFT contract. Woah!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

--------------------
<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>SandwichSakuraNinja</text></svg>
--------------------

An NFT w/ ID 0 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

--------------------
<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 24px; }</style><rect width='100%' height='100%' fill='black' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>GoatSasukeNinja</text></svg>
--------------------

An NFT w/ ID 1 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

Jajaja esto es mucho trabajo. Continuemos y por favor copia uno de los SVGs que obtuviste en tu terminal y pégalo [aquí](https://www.svgviewer.dev/) para ver que es lo que obtienes.

Tienes la posibilidad de ver el SVG que acabas de generar, aquí está el mío:

![Untitled](https://i.imgur.com/uS8SXYu.png)
 
**VAMOSSSSS!!** ¡Generamos esto aleatoriamente en nuestro contrato! Si copias y pegas el otro SVG que generamos, notarás que también es diferente. Todo se va generando sobre la marcha. HURRA.

## 👩‍💻 Generar dinámicamente los metadatos.

¡Ahora, necesitamos configurar los metadatos JSON! Primero, vamos a necesitar crear algunas funciones auxiliares. Hay que crear una carpeta llamado `libraries` en `contracts`. En `libraries`, creamos un archivo llamado `Base64.sol` ahí copiamos y pegamos [este](https://gist.github.com/farzaa/f13f5d9bda13af68cc96b54851345832) código. Este archivo tiene algunas funciones auxiliares creadas por otra persona para ayudarnos a convertir nuestro SVG y JSON a Base64 en Solidity.

Bueno, ahora nuestro contrato está actualizado.
**Al escribir todo el código también agregué comentarios [aquí](https://gist.github.com/farzaa/dc45da3eb91a41913767f3eb4d7830f1)**.

Sería interesante si copias y pegas algunas de estas líneas y tratas de comprender cómo funciona después de ejecutarlo :). ¡A veces me gusta hacer esto porque puedo ver cómo se ejecuta el código y entender cómo funciona!

Una vez que ejecuto el contrato, esto es lo que obtendremos:

```plaintext
Compilation finished successfully
This is my NFT contract. Woah!
Contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

--------------------
data:application/json;base64,eyJuYW1lIjogIlNhbmR3aWNoU2FrdXJhTmluamEiLCAiZGVzY3JpcHRpb24iOiAiQSBoaWdobHkgYWNjbGFpbWVkIGNvbGxlY3Rpb24gb2Ygc3F1YXJlcy4iLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBuYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNuSUhCeVpYTmxjblpsUVhOd1pXTjBVbUYwYVc4OUozaE5hVzVaVFdsdUlHMWxaWFFuSUhacFpYZENiM2c5SnpBZ01DQXpOVEFnTXpVd0p6NDhjM1I1YkdVK0xtSmhjMlVnZXlCbWFXeHNPaUIzYUdsMFpUc2dabTl1ZEMxbVlXMXBiSGs2SUhObGNtbG1PeUJtYjI1MExYTnBlbVU2SURJMGNIZzdJSDA4TDNOMGVXeGxQanh5WldOMElIZHBaSFJvUFNjeE1EQWxKeUJvWldsbmFIUTlKekV3TUNVbklHWnBiR3c5SjJKc1lXTnJKeUF2UGp4MFpYaDBJSGc5SnpVd0pTY2dlVDBuTlRBbEp5QmpiR0Z6Y3owblltRnpaU2NnWkc5dGFXNWhiblF0WW1GelpXeHBibVU5SjIxcFpHUnNaU2NnZEdWNGRDMWhibU5vYjNJOUoyMXBaR1JzWlNjK1UyRnVaSGRwWTJoVFlXdDFjbUZPYVc1cVlUd3ZkR1Y0ZEQ0OEwzTjJaejQ9In0=
--------------------

An NFT w/ ID 0 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

--------------------
data:application/json;base64,eyJuYW1lIjogIkdvYXRTYXN1a2VOaW5qYSIsICJkZXNjcmlwdGlvbiI6ICJBIGhpZ2hseSBhY2NsYWltZWQgY29sbGVjdGlvbiBvZiBzcXVhcmVzLiIsICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MG5hSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY25JSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SjNoTmFXNVpUV2x1SUcxbFpYUW5JSFpwWlhkQ2IzZzlKekFnTUNBek5UQWdNelV3Sno0OGMzUjViR1UrTG1KaGMyVWdleUJtYVd4c09pQjNhR2wwWlRzZ1ptOXVkQzFtWVcxcGJIazZJSE5sY21sbU95Qm1iMjUwTFhOcGVtVTZJREkwY0hnN0lIMDhMM04wZVd4bFBqeHlaV04wSUhkcFpIUm9QU2N4TURBbEp5Qm9aV2xuYUhROUp6RXdNQ1VuSUdacGJHdzlKMkpzWVdOckp5QXZQangwWlhoMElIZzlKelV3SlNjZ2VUMG5OVEFsSnlCamJHRnpjejBuWW1GelpTY2daRzl0YVc1aGJuUXRZbUZ6Wld4cGJtVTlKMjFwWkdSc1pTY2dkR1Y0ZEMxaGJtTm9iM0k5SjIxcFpHUnNaU2MrUjI5aGRGTmhjM1ZyWlU1cGJtcGhQQzkwWlhoMFBqd3ZjM1puUGc9PSJ9
--------------------

An NFT w/ ID 1 has been minted to 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
```

ESTO ES INCREÍBLE.
HEMOS GENERADO NFTs COMPLETOS DE FORMA DINÁMICA. EN CADENA. ÉSTE ES UN MOMENTO ÉPICO.

Si copias uno de los `data:application/json;base64` y lo colocas en la barra de direcciones del navegador, verás todos los metadatos JSON tal como los teníamos antes. Pero ahora, todo se hace automáticamente y en nuestro contrato :).

## 👀 ¿Cómo diablos funciona `finalTokenUri`?

Esa línea de código muy grande con `string memory json = Base64.encode` puede parecer bastante confusa, pero solo parece confusa debido a todas las comillas jajaja. ¡Todo lo que estamos haciendo es codificar en base64 los metadatos JSON! Pero, todo está **en cadena**. Entonces, todo ese JSON vivirá en el contrato mismo.

¡También agregamos dinámicamente el nombre y el SVG codificado en base64!
Finalmente, tenemos este `finalTokenUri` donde lo ponemos todo junto donde hacemos:

```solidity
abi.encodePacked("data:application/json;base64,", json)
```

Todo lo que sucede aquí es que estamos juntando todo y agregamos los mismos datos antiguos `data:application/json;base64,`.

## 🛠 Depuremos el contenido de finalTokenUri

Ahora que tenemos tokenURI configurado, ¿cómo saber si todo es realmente correcto? Podemos usar una herramienta genial como [NFT Preview](https://nftpreview.0xdev.codes/) para ver una vista previa rápida de la imagen y el contenido del json sin implementarlo una y otra vez en la red de prueba de Opensea.

Para hacerlo más fácil, puede pasar el código `tokenURI` como un parámetro de consulta como este:

```solidity
string memory finalTokenUri = string(
    abi.encodePacked("data:application/json;base64,", json)
);

console.log("\n--------------------");
console.log(
    string(
        abi.encodePacked(
            "https://nftpreview.0xdev.codes/?code=",
            finalTokenUri
        )
    )
);
console.log("--------------------\n");
```
![image](https://i.imgur.com/CsBxROj.png)
 
## 🚀 Implementemos en Rinkeby

La mejor parte es que podemos volver a implementar sin cambiar nuestro script tan sólo usando:
```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

Una vez que volvamos a implementar podremos ver nuestros NFTs en [https://testnets.opensea.io/](https://testnets.opensea.io/) una vez que busquemos la dirección del contrato. Una vez más, por favor no des clic a enter. OpenSea es extraño, por lo que deberás esperar y hacer clic en la colección cuando ésta aparezca.

Nota: Recordemos usar `https://rinkeby.rarible.com/token/INSERT_DEPLOY_CONTRACT_ADDRESS_HERE:INSERT_TOKEN_ID_HERE` sí estamos utilizando Rarible.

Los contratos son **permanentes**. Así que siempre que hagas una implementación nueva de nuestro contrato es como si estuviéramos creando una nueva colección de NFTs.

¡Deberías ser capaz de ver la nueva colección en OpenSea y en Rarible :)!

## 🤖 Permitamos que los usuarios creen los NFTs.

Genial: ahora podemos acuñar NFTs de forma dinámica y hemos creado esta función `makeAnEpicNFT` que es la que los usuarios pueden llamar. ¡¡Hemos avanzado mucho!! peeeero, todavía no hay forma en los usuarios puedan generar los NFT en este momento :(.

Necesitamos crear un sitio web que permita a los usuarios crear NFTs por ellos mismos.

Entonces, ¡vamos a construirlo :)!

## 🚨 Reporte de avances.

Mándanos una captura de pantalla y publícala en #progress de tu nuevo y dinámicamente generado NFT en OpenSea o Rarible. Además, si no has twitteado una imagen de tu excelente colección de NFTs aún, ¡¡ahora es el momento de hacerlo!! Recuerdo etiquetar a @_buildspace!!! Nosotros daremos RT a todos los que podamos.
