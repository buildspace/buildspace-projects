## 🔗 Qué significa "on-chain" (en cadena) y por qué es importante.

Tenemos un gran problema en este momento con los NFT que generamos.
¿Qué pasaría si imgur se cae? Bueno, entonces nuestro enlace de `imagen` es absolutamente inútil y nuestro NFT se pierde y nuestro Bob Esponja se pierde. Peor aún, ¿qué sucede si el sitio web que aloja el archivo JSON deja de funcionar? Bueno, entonces nuestro NFT está completamente roto porque los metadatos no serían accesibles.

Una forma de solucionar este problema es almacenar todos nuestros datos NFT "en cadena", lo que significa que los datos viven en el contrato en sí y no en manos de un tercero. Esto significa que nuestro NFT será verdaderamente permanente :). En este caso, la única situación en la que perdemos nuestros datos NFT es si la propia cadena de bloques deja de funcionar. Y si eso sucede, ¡entonces tenemos problemas más grandes!
Pero, suponiendo que la cadena de bloques permanezca activa para siempre, ¡el NFT estará activo para siempre! Esto es muy atractivo porque también significa que, si vendes un NFT, el comprador puede estar seguro de que el NFT no se romperá o dejará de existir. Muchos proyectos populares usan datos en cadena, ¡[Loot](https://techcrunch.com/2021/09/03/loot-games-the-crypto-world/) es un ejemplo muy popular!

## 🖼 ¿Qué son los SVGs?

Una forma común de almacenar datos NFT para imágenes es utilizando un SVG. Un SVG es una imagen, pero la imagen en sí está construida con código.
Por ejemplo, aquí hay un SVG realmente simple, un cuadro negro con un texto blanco en el medio.

```html
<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
    <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
    <rect width="100%" height="100%" fill="black" />
    <text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">EpicLordHamburger</text>
</svg>
```

Vamos a [este](https://www.svgviewer.dev/) sitio web y pega el código de arriba para verlo. Siéntete libre de jugar en el.

Esto es genial porque nos permite crear **imágenes con código**.

Los SVG se pueden personalizar **mucho**. Incluso puedes animarlos jajaja. Puedes leer más sobre ellos [aquí](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial).

## 🤘 ¿Qué vamos a hacer?

Primero, vamos a aprender cómo obtener todos nuestros datos NFT “en cadena”. Nuestro NFT será simplemente un **cuadro con un divertido combo de tres palabras en el centro**. Al igual que el SVG de arriba. Vamos a codificar el SVG de arriba en nuestro contrato que dice "EpicLordHamburger".

Después de eso, aprenderemos cómo generar dinámicamente estos NFT en nuestro contrato. Por lo tanto, **cada vez que alguien acuñe un NFT, obtendrá un combo diferente e hilarante de tres palabras**. Por ejemplo:

- EpicLordHamburger
- NinjaSandwichBoomerang
- SasukeInterstellarSwift

Esto será increíble :). ¡Hagámoslo!
