## 📤 Configuración para poder implementarlo a la Cadena de Bloques.

Continuemos y vamos a cerrar la terminal con la que corrimos la red local de cadena de bloques en la que ejecutamos `npx hardhat node`. 
Ya no lo vamos a necesitar, era para mostrarles como implementar localmente.
Ahora lo vamos a hacer de verdad, vamos a desplegar a la cadena de bloques.

Por favor ahora necesito que crees una cuenta de QuickNode [aquí](https://www.quicknode.com?tap_a=67226-09396e&tap_s=3047999-9900de).

Una disculpa por pedirles que creen tantas cuentas, pero, este ecosistema es complejo y queremos que tomes ventaja de las increíbles herramientas que existen, 
QuickNode nos ayuda a implementar en la cadena de bloques real de Ethereum de forma sencilla.

## 💳 Transacciones.

Bueno, cuando queremos realizar una acción en la cadena de bloques de Ethereum a esto lo llamamos *“Transacciones”*. Por ejemplo, 
enviar cierta cantidad de ETH a alguien es una transacción. Hacer algo que modifique o actualice una variable de nuestro contrato también se considera 
una transacción.

Entonces al invocar `wave` y que haga `totalWaves += 1`, ¡esto es una transacción! **Implementar un contrato inteligente se considera también una transacción.**

Recuerda, la Cadena de Bloques no tiene dueños, es un montón de computadoras conectadas alrededor del mundo administradas por **mineros** que tienen una 
copia de la Cadena de Bloques.

Cuando despleguemos nuestro contrato lo que haremos es **decirles a esos mineros**, “Oigan, este es un nuevo contrato, por favor añadan mi contrato inteligente 
a la cadena de bloques y díganles a todos que mi contrato funciona”.

Aquí es donde aparece QuickNode.

Esencialmente, QuickNode nos ayuda a transmitir nuestra transacción de creación de contratos para los mineros la tomen lo antes posible, una vez que la 
transacción es minada se transmite a la cadena de bloques como una transacción legítima. Dado esto todos los mineros actualizan su copia de la cadena de bloques.

Esto es complicado, y no te preocupes si no lo entiendes por completo. Mientras más código escribas y sigas construyendo esta aplicación, naturalmente te irá 
haciendo mayor sentido.

Crea una cuenta de QuickNode [aquí](https://www.quicknode.com?tap_a=67226-09396e&tap_s=3047999-9900de).

Por favor revisa el siguiente video para que veas como obtener tu “API KEY” para la red de pruebas.
[Loom](https://www.loom.com/share/c079028c612340e8b7439d0d2103a313)

## 🕸️ Redes de pruebas.

No vamos a hacer una implementación en la “Red Principal de Ethereum” al final del proyecto. ¿porqué? Pues porque cuesta dinero real y no vale la pena. 
Vamos a utilizar una “red de pruebas” la cual es un clon de la red principal y utiliza tokens “falsos” para que podamos hacer todas las pruebas que queramos. 
Pero, también es importante saber que las redes de prueba también son operadas y mantenidas por mineros reales y que imitan escenarios del mundo real.

Por eso es increíble porque podremos probar nuestra aplicación en un escenario del mundo real y haremos lo siguiente:
1\.	Transmitir nuestra transacción.
2\.	Esperar a que sea reconocida por mineros reales.
3\.	Esperar a que sea minada e integrada.
4\.	Esperar a que sea transmitida hacia la cadena de bloques y que todos los mineros actualicen su copia.

Esto es lo que vamos a hacer en las siguientes lecciones :)

## 🤑 Obtengamos un poco de dinero de prueba.

Existen algunas redes de prueba y vamos a usar una que se llama “Rinkeby” la cual es mantenida por la Fundación Ethereum.

Para poder hacer una implementación en Rinkeby necesitamos ether ficticio. ¿Porqué? Pues si quisieras hacer implementaciones en la red principal de Ethereum 
necesitas usar dinero real. Por lo que las redes de pruebas imitan el funcionamiento de la red principal, la única diferencia es que no hay dinero real involucrado.

Para poder obtener ETH ficticio necesitamos solicitarlo en la red. **Este ETH ficticio solo va a funcionar en la red de prueba especifica.** 
Podrás obtener un poco de ETH para Rinkeby mediante un “grifo”. Asegurate de que tu Metamask tenga configurada y activa la red de pruebas Rinkeby 
antes de usar el “grifo”.

Para MyCrypto necesitas conectar tu cartera, hacer una cuenta y usar la misma liga para solicitar fondos. 
Para el grifo “oficial” de Rinkeby si la página dice que tiene 0 pares no vale la pena hacer la publicación de solicitud de en Twitter o Facebook.

| Name             | Link                                  | Amount          | Time         |
| ---------------- | ------------------------------------- | --------------- | ------------ |
| MyCrypto         | https://app.mycrypto.com/faucet       | 0.01            | None         |
| Official Rinkeby | https://faucet.rinkeby.io/            | 3 / 7.5 / 18.75 | 8h / 1d / 3d |
| Chainlink        | https://faucets.chain.link/rinkeby    | 0.1             | None         |

## 🙃 ¿Estás teniendo problemas para obtener el ETH de prueba?

Si las soluciones propuestas arriba no funcionan, usa el comando `/faucet` en el canal #faucet-request y nuestro bot les enviará un poco. 
Si quieres obtener más mándanos tu dirección pública y el meme más chistoso que tengas y probablemente yo mismo o alguien más te enviaremos 
un poco de ETH de pruebas lo antes posible. Mienstras mejor sea tu meme más rápido obtendrás el ETH. LOL.

## 📈 Implementando en la red de Pruebas Rinkeby.

Vamos a necesitar cambiar el archivo `hardhat.config.js` el cuál podrás encontrar en el directorio raíz del contrato inteligente de nuestro proyecto.

```javascript
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: "YOUR_QUICKNODE_API_URL",
      accounts: ["YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY"]
    },
  },
};
```
**Nota: NO VAYAS A ENVIAR ESTE ARCHIVO A GITHUB. ESTE ARCHIVO CONTIENE TU LLAVE PRIVADA. PODRÍAS SER HACKEADO, ROBADO, ESTAFADO. 
ESTA LLAVE PRIVADA ES LA MISMA QUE SE UTILIZA PARA LA RED PRINCIPAL DE ETHEREUM.**

**Si quieres subir este proyecto a Github o usar el control de versiones git es una buena práctica la de protegerte de subir llaves secretas a alguien más. 
Un buen método es no cargar tu hardhat config file y añadirlo a .gitignore.**

Otra forma de proteger tu llave privada y mantener `hardhat.config.js` seguro es usando dotenv. Se instala así:

```bash
npm install --save dotenv
```

Ahora podremos actualizar hardhat.config.js para usar dotenv:

```javascript
require("@nomiclabs/hardhat-waffle");
// Import and configure dotenv
require("dotenv").config();

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      // This value will be replaced on runtime
      url: process.env.STAGING_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_QUICKNODE_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```
En el folder raíz del proyecto, hay que crear un archivo `.env` y ahí añadir los secretos. Se verá algo así:

```
STAGING_QUICKNODE_KEY=REPLACE_WITH_ACTUAL_QUICKNODE_URL
PROD_QUICKNODE_KEY=BLAHBLAH
PRIVATE_KEY=BLAHBLAH
```
Finalmente añade el archivo `.env` a tu archivo `.gitignore` y así Git lo ignorará y esta información secreta no abandonará tu máquina. 
Si estás confundido al hacer esto busca un video en youtube sobre el tema, es algo realmente sencillo de hacer.

Ahora deberás utilizar el API URL del panel de control de QuickNode y pégalo donde corresponda, después vas a necesitar la llave **privada** de rinkeby 
(no es tu dirección pública) esta llave la puedes obtener de metamask y debes pegarla donde corresponde.

**Nota: Para accesar a tu llave privada eso se puede hacer abriendo Metamask, cambiar la red a “Rinkeby Test Network” (Red de pruebas Rinkeby), 
dar click en los tres puntos y seleccionar “Account Details” (Detalles de cuenta) > “Export Private Key” (Exportar Llave Privada).**

¿Para que necesitamos utilizar la llave privada? Porque para realizar una transacción como desplegar un contrato, 
necesitas “iniciar sesión” en la cadena de bloques. Tu usuario es tu dirección pública y tu contraseña es tu llave privada. 
Es como iniciar sesión en AWS o en Google Cloud para implementar algo.

Bueno, una vez que tengas lista la configuración ya estamos listos para desplegar el código que hemos escrito.

Ejecutemos este comando desde el directorio raíz de `my-wave-portal`. Debes notar que cambiamos `localhost` a `rinkeby`.

```bash
npx hardhat run scripts/deploy.js --network rinkeby
```
## ❤️ ¡Implementado!

Esto es lo que debes obtener:

```bash
Deploying contracts with the account: 0xF79A3bb8d5b93686c4068E2A97eAeC5fE4843E7D
Account balance: 3198297774605223721
WavePortal address: 0xd5f08a0ae197482FA808cE84E00E97d940dBD26E
```
Copia la dirección del contrato desplegado de la última línea y guárdala en algún lugar. 
¡No la pierdas! La vamos a necesitar para la interfaz posteriormente :) Evidentemente tu dirección debe ser distinta a la mía que ves aquí.

**Acabas de implementar tu primer contrato inteligente. SIIIIIIIIII!**

Inclusive podrías utilizar esta dirección y pegarla en Etherscan [aquí](https://rinkeby.etherscan.io/).
Etherscan es un sitio que nos muestra el estatus de la cadena de bloques y nos ayuda a localizar una transacción, ya deberías poder ver tu transacción ahí :) 
Puede tomar unos minutos para que aparezca.

¡Por ejemplo, la mía está [aquí](https://rinkeby.etherscan.io/address/0xd5f08a0ae197482FA808cE84E00E97d940dBD26E)!

## 🚨 Antes de que continues a la siguiente lección

**¡Hiciste mucho!**

Es algo importante que ya hayas llegado hasta acá. Creaste e implementaste algo en la cadena de bloques. **¡Caramba!**. **Estoy orgulloso de ti.**

Ahora tu ese “alguien” que en realidad está “haciendo “eso de lo que todo mundo está “hablando”.

Hemos visto que los mejores constructores se están acostumbrando a "construir en público". ¡Esto significa compartir los aprendizajes sobre el logro que acabas de alcanzar!

Por favor coloca esta actualización rápida en buildspace ahora mismo presionando (Post update) "Publicar actualización" en la esquina superior derecha de esta página. 

[Loom](https://www.loom.com/share/19f0af7b490144948d1b31ec96318c0b)

Cada vez estás más cerca de dominar las artes del web3.

¡Sigue así!
--

*¡Muchas gracias a todos los que han comentado en twitter sobre nosotros, ustedes son leyendas! <3*

![](https://i.imgur.com/1lMrpFh.png)

![](https://i.imgur.com/W9Xcn4A.png)

![](https://i.imgur.com/k3lJlls.png)








