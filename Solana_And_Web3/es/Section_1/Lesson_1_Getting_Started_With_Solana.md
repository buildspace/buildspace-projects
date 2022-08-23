Antes de comenzar, ¡ve [este](https://giphy.com/clips/hamlet-jJjb9AUHOiP3nJJMdy) video es muy importante y asegúrate de que el sonido esté activado pasando el cursor sobre él! Inclusive yo lo vería más de una vez.

Bien, una vez que hayas terminado de hacerlo, ¡continuemos!

Vamos a comenzar con una de las cosas más mágicas de web3, conectarse al producto con tu cartera digital.

Vamos a permitir que el usuario se "autorice" esencialmente con su cartera Solana. Construir este tipo de autenticación suele ser bastante difícil. Necesitarías tener una base de datos de nombres de usuario, contraseña, etc.

¡En este caso **es mucho más** fácil de lo que piensas! Así lo haremos:

1. Obtenga el código base de la aplicación web para este proyecto (te proporcioné algunos HTML/CSS de inicio para que puedas concentrarte en las cosas que realmente importan).
2. Escribe el código que permitirá a los usuarios conectar su cartera Solana y conectarse a tu aplicación para configurar un estado básico de "autenticación".
3. Vamos directo a escribir tu primer programa de Solana con Rust y hacer la implementación en la cadena de bloques real.

Va a ser **MUY EMOCIONANTE.**

Una cosa que realmente amamos en buildspace es la increíble creatividad que ustedes ponen en los proyectos. Haz tuyo este proyecto y haz las cosas como mejor te parezca.

**Si todo lo que vas a hacer es copiar/pegar código, esto no será tan divertido.**

El código base de la aplicación web que te proporciono es solo para que comiences. Cambia las cosas. Tal vez odias los colores que usé. Cámbialo todo. Tal vez quieras hacer que el sitio tenga más temática de anime. Hazlo.

Si termina cambiando las cosas, etiquétame en `#progress` y comentame: "hey, Farza, he mejorado tu código" y pon una captura de pantalla.
Muy bien, hagamos esto.

### 🏁 Empecemos

Vamos a usar **React.js** para construir nuestra aplicación web. Si ya estás familiarizado con React, esto será pan comido. Si no has trabajado mucho con React, ¡no te preocupes! Todavía podrás completar este proyecto, pero puede parecer un poco más difícil.

¡Sin embargo, no te rindas! Cuanto más te esfuerces, más aprendes 🧠.

Si no tienes experiencia con React, [puedes consultar este curso de introducción](https://scrimba.com/learn/learnreact) antes de comenzar con esta sección o tal vez consultar la documentación oficial [aquí](https://reactjs.org/docs/getting-started.html). O no hagas nada especial, solo aviéntate a hacerlo. **Lo que funcione para ti :).**

¡Serás un Mago de React después de este proyecto si es que aún no lo eres 🧙‍♂!

### ⬇️ Obtener el código

¡Vamos a usar [Replit](https://replit.com/~)!

Es un IDE basado en navegador que nos permite crear fácilmente aplicaciones web e implementarlas desde el navegador. Funciona muy bien. Ya no vamos a tener que configurar un entorno local completo y escribir los comandos para implementar, todo esto ya te lo proporciona replit.

Nota: **No es forzoso que uses replit para crear e implementar este sitio web. Si deseas trabajar localmente en VSCode y usar Vercel/Heroku/AWS para implementar y confías en tus habilidades de desarrollo web, eso es genial. [Aquí está el enlace](https://github.com/buildspace/gif-portal-starter) al repositorio base que puede clonar y trabajar localmente.**

Si decides hacerlo con Replit, ¡debes crear una cuenta con ellos antes de continuar!

Ya tengo creado un proyecto de React básico que puedes **bifurcar, clonar** en Replit.

 [Simplemente haz clic aquí](https://replit.com/@adilanchian/gif-portal-starter-project?v=1)**, y a la derecha verás el botón "Fork".** Asegúrate de haber iniciado sesión y después haz clic ahí.
 
Clonarás mágicamente mi repositorio y tendrás el IDE completo en tu navegador para trabajar el código. Una vez que termine de cargarse y te muestre el código, haz clic en "ejecutar" en la parte superior y estarás listo para comenzar. Puede tomar de 2 a 4 minutos la primera vez que lo haces.

**Para tener en cuenta: a medida que avancemos en este proyecto, puedes notar que estamos haciendo referencia a archivos `.js`. En Replit, si estás creando nuevos archivos JavaScript, ¡deberá usar la extensión `.jsx` en lugar del `.js`! Replit requiere que usar la extensión de archivo `.jsx` :).**

Aquí hay un video rápido que hice para otro proyecto, pero repasa algunos conceptos básicos de Replit:

[Loom](https://www.loom.com/share/8e8f47eacf6d448eb5d25b6908021035)

Y así de simple, ya tienes configurada una interfaz para tu aplicación web3 😎.

🚨 Reporte de avances
*Por favor haz esto sino Farza estará triste :(*

Publique una captura de pantalla de tu aplicación web en `#progress` :). **
