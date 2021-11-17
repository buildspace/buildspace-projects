📤 Configuración para el despliegue en la blockchain
-----------------------------------------

Sigue adelante y cierra el terminal con tu red local de blockchain en funcionamiento que es donde ejecutaste `npx hardhat node`. No lo necesitaremos más ;). Principalmente quería mostrarte cómo funciona el despliegue local.

Ahora vamos a hacer el verdadero trabajo, desplegando en la blockchain real.

Crea una cuenta en Alchemy [aquí](https://alchemy.com/?r=b93d1f12b8828a57).

Perdonad por obligaros a hacer tantas cuentas, pero este ecosistema es complejo y queremos aprovechar las increíbles herramientas que hay. Lo que hace Alchemy es que nos da una forma sencilla de desplegar en la blockchain real de Ethereum.

💳 Transacciones
---------------

Cuando queremos realizar una acción en la blockchain de Ethereum lo llamamos una *transacción*. Por ejemplo, enviar a alguien Ethereum es una transacción. Hacer algo que actualice una variable en nuestro contrato también se considera una transacción.

Así que cuando llamamos a `wave` y hacemos `totalWaves += 1`, ¡eso es una transacción! **Desplegar un smart contract también es una transacción.**

Recuerda que la blockchain no tiene dueño. Es sólo un montón de ordenadores alrededor del mundo dirigidos por **mineros** que tienen una copia de la blockchain.

Cuando desplegamos nuestro contrato, tenemos que decirle a **todos esos** mineros, "oye, este es un nuevo smart contract, por favor, añade mi smart contract a la blockchain y luego cuéntaselo a todos los demás".

Aquí es donde entra Alchemy.

Alchemy esencialmente nos ayuda a difundir nuestra transacción de creación de contrato para que pueda ser recogida por los mineros lo más rápidamente posible. Una vez que la transacción es minada, se transmite a la blockchain como una transacción legítima. A partir de ahí, todo el mundo actualiza su copia de la blockchain.

Esto es complicado. No te preocupes si no lo entiendes del todo. A medida que escribas más código y crees esta aplicación, todo tendrá más sentido.

Así que hazte una cuenta en Alchemy [aquí](https://alchemy.com/?r=b93d1f12b8828a57).

Mira el vídeo de abajo para ver cómo conseguir tu clave API para una red de prueba.
[Loom](https://www.loom.com/share/21aa1d64ea634c0c9da8fc5faaf24283)

🕸️ Testnets
------------

No vamos a desplegar en la "Ethereum mainnet" hasta el final. ¿Por qué? ¡Porque cuesta $ reales y no vale la pena meter la pata! Vamos a empezar con una "testnet" que es un clon de la "mainnet" pero que utiliza $ falsos para que podamos probar cosas tanto como queramos. Sin embargo, es importante saber que las redes de prueba están dirigidas por mineros reales e imitan los escenarios del mundo real.

Esto es impresionante porque podemos probar nuestra aplicación en un escenario del mundo real donde realmente vamos a:

1\. Transmitir nuestra transacción

2\. Esperar a que sea recogida por los mineros reales

3\. Esperar a que sea minada

4\. Esperar a que se transmita a la blockchain para que todos los mineros actualicen sus copias.

Así que, harás todo esto dentro de las próximas lecciones :).

🤑 Conseguir algunos $ falsos
------------------------

Hay varias redes de prueba y la que vamos a utilizar se llama "Rinkeby" que es administrada por la fundación Ethereum.

Para poder desplegar en Rinkeby, necesitamos ether falso. ¿Por qué? Porque si se desplegara en la red mainnet de Ethereum, se utilizaría dinero real. Por lo tanto, las redes de prueba copian el funcionamiento de la red principal, con la única diferencia de que no se utiliza dinero real.

Para conseguir ETH falsos, tenemos que pedir a la red algunos. **El ETH falso sólo funcionará en esta red de prueba específica.** Puedes conseguir ether falsos mediante un faucet.

Para MyCrypto, tendrás que conectar tu cartera, crear una cuenta y luego hacer click en el mismo enlace de nuevo para solicitar fondos. Para el faucet oficial de Rinkeby, si tiene listados 0 peers, no vale la pena hacer un tweet/publicación en Facebook.

| Nombre           | Link                                  | Cantidad        | Tiempo         |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | None         |
| Buildspace       | https://buildspace-faucet.vercel.app/ | 0.025           | 1d           |
| Ethily           | https://ethily.io/rinkeby-faucet/     | 0.2             | 1s           |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8h / 1d / 3d |


🙃 ¿Tienes problemas para conseguir Testnet ETH?
-----------------------------------

Si lo anterior no funciona, utiliza el comando `/faucet` en el canal #faucet-request y nuestro bot te enviará un poco. Si quieres más, envía la dirección de tu cartera pública y deja un gif gracioso. Yo, o alguien del curso, te enviará algunos ETH falsos tan pronto como podamos. Cuanto más gracioso sea el gif, más rápido te enviarán ETH falsos XD.

📈 Despliega en Rinkeby testnet.
---------------------------------

Necesitaremos cambiar nuestro archivo `hardhat.config.js`. Puedes encontrarlo en el directorio raíz de tu proyecto de smart contract.

```javascript
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  redes: {
    rinkeby: {
      url: 'TU_ALCHEMY_API_URL',
      cuentas: ['TU_KEY_PRIVADA_DE_RINCKEBY'],
    },
  },
};
```

**Nota: No envíes este archivo a GITHUB. TIENE TU CLAVE PRIVADA. TE HACKEARÁN Y TE ROBARÁN. ESTA CLAVE PRIVADA ES LA MISMA QUE TU CLAVE PRIVADA DE MAINNET.** Hablaremos de las variables `.env` más adelante y de cómo mantener estas cosas en secreto.

Puedes pillar tu URL de la API desde el panel de control de Alchemy y pegarlo. A continuación, necesitarás tu **clave privada** de rinkeby (¡no tu dirección pública!) que puedes obtener de metamask y pegarla allí también.

**Nota: El acceso a tu clave privada puede hacerse abriendo MetaMask, cambiando la red a "Rinkeby Test Network" y luego haciendo clic en los tres puntos y seleccionando "Account Details" > "Export Private Key "**.

¿Por qué necesitas usar tu clave privada? Porque para realizar una transacción como el despliegue de un contrato, necesitas "iniciar sesión" en la blockchain. Y, tu nombre de usuario es tu dirección pública y tu contraseña es tu clave privada. Es un poco como iniciar sesión en AWS o GCP para desplegar.

Una vez que tengas tu configuración, estaremos listos para desplegar con el script de despliegue que escribimos antes.

Ejecuta este comando desde el directorio raíz de `my-wave-portal`. Fíjate que lo único que hacemos es cambiar de `localhost` a `rinkeby`.

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```

❤️ ¡Desplegado! 
-------------

Este es mi resultado:

```bash
Desplegando contrato con la cuenta: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Saldo de la cuenta: 3198297774605223721
Dirección de WavePortal: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```

Copia esa dirección del contrato desplegado en la última línea y guárdala en algún sitio. No la pierdas. La necesitarás para el frontend más adelante :). La tuya será diferente a la mía.

**Acabas de desplegar tu contrato. WOOOOOOO.**

Puedes tomar esa dirección y pegarla en Etherscan [aquí](https://rinkeby.etherscan.io/). Etherscan es un lugar que nos muestra el estado del blockchain y nos ayuda a ver en qué punto se encuentra nuestra transacción. Deberías ver tu transacción aquí :). ¡Puede tardar un minuto en aparecer!

¡Por ejemplo, [aquí está](https://rinkeby.etherscan.io/address/0xd5f08a0ae197482FA808cE84E00E97d940dBD26E) la mía!

🚨 Antes de hacer click en "Next Lesson"
---------------------------------

**ACABAS DE HACER ALGO GRANDE.**

Deberías **tweetear** que acabas de escribir y desplegar tu primer smart contract y etiquetar a @_buildspace. Si quieres, incluye una captura de pantalla de la página de Etherscan que muestra que tu contrato está en la blockchain.

Es muy importante que hayas llegado hasta aquí. Has creado y desplegado algo en la blockchain real. **Holy Guacamole**. **Estoy orgulloso de ti.**

Ahora eres alguien que realmente está "haciendo" la cosa de la que casi todos los demás sólo están "hablando".

Estás un paso más cerca de dominar las artes de la web3.

SIGUE ADELANTE :).

--

*Gracias a la gente que ya ha twitteando sobre nosotros, sois los mejores <3.*

![](https://i.imgur.com/1lMrpFh.png)

![](https://i.imgur.com/W9Xcn4A.png)

![](https://i.imgur.com/k3lJlls.png)