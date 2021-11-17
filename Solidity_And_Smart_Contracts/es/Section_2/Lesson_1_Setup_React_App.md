💻 Configurar un cliente
------------------

¡Es hora de empezar a trabajar en nuestro sitio web! Nuestro contrato es bastante simple, pero ¡vamos a aprender cómo nuestro front end puede interactuar con nuestro contrato lo antes posible!

Hay como 100 maneras diferentes de configurar un proyecto básico de react y desplegarlo. Voy a mostrarte cómo hacerlo aquí en 10 minutos y al final tendrás una aplicación react completamente desplegada con su propio dominio y todo.

🤯 Replit
---------

**Nota: No tienes que usar replit para crear + desplegar tu sitio. Si quieres usar create-react-app + Vercel/Heroku/AWS -- eso está perfecto. [Aquí](https://github.com/buildspace/waveportal-starter-project) hay un enlace al repo base que puedes clonar y trabajar localmente.**

¡Usaremos [Replit](https://replit.com/~)! Es un IDE que nos permite construir fácilmente aplicaciones web y desplegarlas desde el navegador. Es una pasada. En lugar de tener que configurar un entorno local completo y escribir comandos para desplegar, todo se nos da hecho.

Hazte una cuenta en Replit antes de seguir adelante.

Ya he creado un proyecto react básico que puedes **copiar** en Replit. **Sólo tienes que ir [aquí](https://replit.com/@adilanchian/waveportal-starter-project), y cerca de la derecha verás el botón "Fork".** Asegúrate de que estás conectado, y luego haz clic. Mágicamente clonarás mi repo y el IDE completo en tu navegador para trabajar con el código. Una vez que deje de cargar y te muestre algo de código, haz clic en el botón "Run" en la parte superior. Esto puede tardar de 2 a 3 minutos la primera vez. Básicamente, Replit está arrancando tu proyecto y desplegándolo en un dominio real.

**Una última cosa a tener en cuenta aquí - ¡Replit puede no mostrar tu aplicación de inmediato! Si esto sucede, sólo tienes que refrescar tu página y volver a intentarlo. Te prometo que funcionará 🤘.**

Hice un video rápido sobre cómo editar el código en Replit, desplegar, obtener el modo oscuro. Dale un vistazo: 
[Loom](https://www.loom.com/share/babd8d81b83b4af2a196d6ea656e379a)

🦊 Metamask
-----------

Genial, tenemos un proyecto React **desplegado** con el que podemos trabajar fácilmente. Ha sido fácil :).

Lo siguiente que necesitamos es una cartera de Ethereum. Hay un montón de ellas, pero, para este proyecto vamos a utilizar Metamask. Descarga la extensión del navegador y configura tu cartera [aquí](https://metamask.io/download.html). Incluso si ya tienes otro proveedor de carteras, usa Metamask por ahora.

¿Por qué necesitamos Metamask? Pues bien, tenemos que ser capaces de llamar a las funciones de nuestro smart contract que viven en la blockchain. Y, para hacer eso necesitamos tener una cartera que tenga nuestra dirección de Ethereum y nuestra clave privada.

**Pero necesitamos algo que conecte nuestro sitio web con nuestra cartera para poder pasar de forma segura las credenciales de nuestra cartera a nuestra web para que ésta pueda usar esas credenciales para llamar a nuestro smart contract. Necesitas tener credenciales válidas para acceder a las funciones de los smart contract.**

Es casi como la autenticación. Necesitamos algo para "iniciar sesión" en la blockchain y luego usar esas credenciales de inicio de sesión para hacer solicitudes de API desde nuestro sitio web.

Así que, ¡sigue adelante y configúralo todo! Su flujo de configuración es bastante auto explicativo :).

🚨 Antes de hacer click en "Next Lesson"
-------------------------------------------

*Nota: si no haces esto, Farza estará muy triste :(.*

Comparte un enlace a tu sitio web y publícalo en #progress. Cambia el CSS y el texto para que sea original. ¿Quizás quieres que sea más colorido? ¿Tal vez no te interesan los saludos y quieres hacer un clon descentralizado de Twitter? Haz lo que quieras esta es tu aplicación :).
