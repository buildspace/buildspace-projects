### ✈️ Actualicemos el programa

Supongamos que quieres agregar alguna funcionalidad nueva al programa Solana.

Antes te dije que no debes tocar `lib.rs` porque poder trabajar localmente y volver a implementar se vuelve complicado.

Entonces, básicamente con Solana casi *nunca* trabajo en `localnet` por lo general. Es realmente molesto cambiar constantemente entre `localnet` y `devnet`.

En cambio, actualizo mi programa y luego, para probarlo, simplemente ejecuto mi script a través de `anchor test` en `tests/myepicproject.js` para asegurarme de que todo funciona y Anchor realmente ejecutará la prueba en `devnet` directamente, lo cual es muy genial.

Luego, cuando esté listo para probar las actualizaciones de mi programa en mi aplicación web, solo hago una `anchor deploy`. A partir de ahí, debes asegurarte de obtener el archivo IDL actualizado para la aplicación web.

**Cada vez que vuelvas a implementar, debes actualizar el archivo IDL en la aplicación web**

Entonces, copiaría el contenido de la IDL actualizada del proyecto Solana en `target/idl/myepicproject.json` y luego pegaría el contenido en `app/src/idl.json` en la aplicación web. 

Ahora quiero repasar un par de características **opcionales** que podría agregar que creo que serían divertidas. Estos son opcionales. Tampoco te explicaré a detalle sobre cómo construirlos. Averígualo tú mismo.

### 🏠 Mostrar la dirección pública de un usuario en la aplicación web

Actualmente no estamos usando la dirección pública del usuario para nada en este momento en:

```rust
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
}
```

¡Sería genial mostrar la dirección pública del usuario debajo del GIF que enviaron! Hacer algo como `item.userAddress.toString()` en su aplicación web debería funcionar. Intenta implementarlo por tu cuenta.

### 🙉 Permite que los usuarios voten por los GIF de la aplicación

Que cada GIF comenzara con 0 votos, y las personas pudieran "votar a favor" sus GIF favoritos en la aplicación web.

Aunque no te voy a decir cómo hacerlo ;). ¡Averígualo si quieres! Sugerencia: deberás crear una función `update_item` en el programa Solana. Allí, tendras que averiguar cómo entrar en `gif_list`, encontrar el GIF que está siendo votado y luego hacer algo como `votos += 1` en él.

¡¡A ver si puedes resolverlo!!

### 💰 Envía una "recompensa" en Solana a quienes envíen los mejores GIF

¡Un tema que no cubrimos en absoluto aquí es cómo enviar dinero a otros usuarios!

Sería genial si te gustara TANTO cierto GIF enviado por otro usuario que pudieras enviarle una pequeña recompensa a ese usuario. Tal vez como 50 centavos o como un dólar de SOL. ¡Quizás puedas hacer clic en "propina", ingreses la cantidad de SOL que quieres dar como propina y darle clic en enviar para enviarlo directamente a la cartera de ese usuario!

**Las tarifa de gas (comisiones) son súper bajas en Solana y significa que enviar pequeñas cantidades de dinero tiene sentido.** Si vas a hacer esto, inclusive podrías crear una versión de Patreon o BuyMeACoffee en Solana. No es algo tan loco. Ya tienes todas las habilidades básicas.

¿Quién necesita Stripe y PayPal cuando tienes una cadena de bloques de tarifa de gas súper bajas que permite realizar pagos instantáneos?

Esta es otra cosa que quiero que descubras si quieres pasar el rato en [Anchor Discord](https://discord.gg/8HwmBtt2ss) o preguntándole a tus compañeros buildspacers. **¿Por qué no te digo las respuestas?** Jaja, porque quiero que seas activo en la comunidad de Solana, averigües y aprendas luchando un poco.

Por ejemplo, aquí estoy yo haciendo la misma pregunta jajaja:

![Sin título](https://i.imgur.com/b94aOcG.png)

¡Un saludo a cqfd#6977 por cierto, una leyenda absoluta! Incluso tuvo una llamada conmigo para compartir en pantalla un error que estaba recibiendo. Sé amable en Anchor Discord y no hagas preguntas al azar. Esfuérzate por buscar en Discord para ver si alguien más ha tenido la misma pregunta que tú y siempre se agradecido cuando alguien te ayude ;).

Ser amable siempre funciona.

### 👍 Un montón de programas de ejemplo

Hay una gran cantidad de programas de ejemplo o práctica que puedes encontrar en el repositorio de Anchor [aquí] (https://github.com/project-serum/anchor/tree/master/tests). Puedes mirar diferentes ejemplos para descubrir cómo implementar distintas cosas por tu cuenta.
