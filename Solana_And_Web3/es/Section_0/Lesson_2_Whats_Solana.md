Vamos a pasar mucho tiempo en Solana para este proyecto y tendrás mucho tiempo para aprender sobre qué diablos es Solana **al desarrollarlo**.

No te preocupes, llegaremos a un montón de cosas como que Solana tiene tarifas de gasolina bajas, que es realmente rápido, etc.

**No** quiero que gastemos mucho tiempo en teoría en este momento.

Lo último que quiero que hagas es comenzar a ver toneladas de videos aleatorios de YT o publicaciones de Wikipedia. Creo que hacer eso es bueno, pero *primero termina este proyecto.* ¡Después investiga y estudia todo lo demás!

Te prometo que toda tu investigación tendrá mucho más sentido una vez que realmente termines este proyecto.
Sin embargo, creo que es valioso tener una comprensión básica de algunos de los conceptos y obtener una imagen de alto nivel de cómo funcionan las cosas en Solana. Entonces, vamos a hacerlo :).

### 👩‍💻Programas

En Solana, se escriben "Programas de Solana".
*Nota: ¡Esto es como un contrato inteligente para el caso de Ethereum!*

Un programa de Solana es un fragmento de código que vive en la cadena de bloques. La cadena de bloques es un lugar donde cualquiera puede ejecutar este código por una tarifa. Puedes pensar en la cadena de bloques como AWS o Heroku. Pero, en lugar de estar a cargo de una gran corporación, estas cadenas están a cargo de "mineros". En el mundo de Solana se les llama "validadores".

### 🏦 Cuentas

En Solana, los programas no tienen estado. Esto es muy diferente de Ethereum. En Ethereum, escribimos "contratos inteligentes" y los contratos en realidad mantienen un estado en el que puede almacenar datos sobre variables directamente en los contratos.

En Solana, cómo funciona es que los usuarios tienen "cuentas" y los programas de Solana pueden interactuar con las "cuentas" propias de los usuarios. Un usuario puede poseer miles de cuentas. La forma más fácil de pensar en una cuenta es algo así como un archivo. Los usuarios pueden tener muchos archivos diferentes. Los desarrolladores pueden escribir programas que puedan comunicarse con estos archivos.

*El programa en sí no contiene los datos de un usuario. El programa solo habla con "cuentas" que contienen los datos del usuario.*

¡Esa es prácticamente toda la teoría que realmente necesitamos repasar ahora mismo! Si todavía no tiene sentido, ¡no te preocupes! A mí me tomó algún tiempo comprender. Creo que tiene más sentido cuando pasemos al código.

### 👀 "¿Debería usar Solana o Ethereum?"

Hmmmm. Esta es una pregunta difícil. También puede ser una pregunta equivocada. Lo siento, sé que no es la respuesta que quieres, pero la verdadera respuesta es: *eso depende.*

Por ejemplo, hoy en día, realmente no hablamos sobre qué *lenguaje de servidor backend* es el "mejor".

Simplemente elegimos el que nos resulte más cómodo o el que tenga más sentido dado nuestros casos de uso. Por ejemplo, si la velocidad es el objetivo, escribir su backend en Go puede tener sentido. Si solo quieres hacer que algo despegue, algo como Node o Ruby podría ser mejor.

Así es más o menos cómo deberíamos ver las diferentes cadenas de bloques. Cada una tiene sus propias ventajas y desventajas, y debes elegir la que se adapte a tu caso de uso o nivel de comodidad. Solana es conocida como una cadena de bloques súper rápida y de bajo costo, ¡y en este proyecto la vamos a utilizar para que puedas tener una idea de cómo funciona! **¡¡Forma tu propia opinión!!**

### ⛓Cadenas de Bloques cruzadas en el futuro.

Cada cadena de bloques tiene sus propios pros y contras. No creo que ninguna de las grandes cadenas de bloques sea "la mejor". Y **no** **necesitamos que** solo una sea la mejor. La competencia es buena. Un mundo donde *solo* Apple fabrica teléfonos inteligentes apestaría. Un mundo donde solo Krispy Kreme hiciera donas apestaría. Necesitamos mucha gente que empuje la industria hacia adelante a su manera.

*Esta es solo una opinión personal*, pero creo que nos estamos moviendo rápidamente hacia un mundo en el que vamos a tener muchas cadenas de bloques diferentes (que ya están sucediendo ahora). Esto es realmente algo bueno. En lugar de que una cadena de bloques sea la clara ganadora, tenemos muchas cadenas diferentes, cada una con sus propias especialidades.

**Ahora tenemos [puentes](https://wiki.polkadot.network/docs/learn-bridges) que permiten que diferentes cadenas de bloques se comuniquen entre sí.**

Eso significa que puedes implementar tu programa en Solana y hacer que se comunique con un contrato en una cadena de bloques diferente como Ethereum, Avalanche, Polygon, etc. Por ejemplo, puedes comprar un NFT en Ethereum y luego moverlo a Solana si así lo deseas. O tal vez podrías utilizar un puente que permita mover fácilmente tokens de la cadena Solana a la cadena Ethereum.

Lo que **apestaría** es que tuviéramos más de 100 cadenas de bloques diferentes y **ninguna** de ellas pudiera comunicarse entre sí. Luego, cada cadena se convierte en un jardín amurallado donde la transferencia de datos entre cadenas es casi imposible. Los usuarios perderían la libertad de elección.

Los puentes son cada vez más populares. ¡Eres libre de leer [esta](https://medium.com/1kxnetwork/blockchain-bridges-5db6afac44f8) publicación cuando quieras! Pero por ahora, vamos a construir.
