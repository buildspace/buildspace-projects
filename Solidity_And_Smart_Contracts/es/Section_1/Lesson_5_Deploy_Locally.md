## 👀 Escribiremos código para implementar localmente.

*¿Oye, pero no ya habíamos desplegado a mi red local?*
Pues sí, pero...
Recuerdas cuando ejecutamos `scripts/run.js` eso significa que:

1\.	Creamos una red local nueva de Ethereum.\
2\.	Implementamos nuestro contrato.\
3\.	Luego, cuando el código termina de correr Hardhat automáticamente **destruirá** esa red local.

Necesitamos encontrar una manera de que la red local se mantenga funcionando. ¿Pero por qué? Bueno, piensa en un servidor local, quieres que se mantenga funcional porque quieres seguir usándolo. Por ejemplo, si tienes un servidor local con una API que tu hiciste ¿pues lo más seguro es que quieras mantener vivo al servidor para que puedas seguir trabajando con el y hacer pruebas no? 
Eso es lo que vamos a hacer.

Por favor ve a tu terminal y crea una **nueva** ventana. En esta ventana utiliza el comando cd para ir al proyecto my-wave-portal ya que estés ahí ejecuta lo siguiente:
```bash
npx hardhat node
```

BOOM.

Acabas de inicializar una red local de Ethereum que **se mantiene viva y activa.** ¡Como podrás ver Hardhat nos da 20 cuentas para trabajar con ellas y además 10,000 ETH somos millonarios! Wow este es el mejor proyecto del mundo!
Actualmente, esta es una cadena de bloques vacía, no tienes bloques.
Vamos a crear un bloque nuevo con nuestro contrato inteligente. ¡Hagámoslo!

En la carpeta `scripts` crearemos un archivo llamado `deploy.js`. Aquí tienes el código que debe tener, como puedes ver es muy similar al código de `run.js`. 

```javascript
const main = async () => {
  const [deployer] = await hre.ethers.getSigners();
  const accountBalance = await deployer.getBalance();

  console.log("Deploying contracts with account: ", deployer.address);
  console.log("Account balance: ", accountBalance.toString());

  const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
  const waveContract = await waveContractFactory.deploy();
  await waveContract.deployed();

  console.log("WavePortal address: ", waveContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
```

## 🎉 Implementación

A continuación, el comando que vamos a ejecutar para la implementación local es:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Necesitas asegurar que esto lo estás haciendo desde el directorio** `my-wave-portal` **y desde una ventana de terminal diferente. No vamos a utilizar la ventana de Terminal que mantiene viva nuestra red Ethereum.**

Una vez que hagamos esto vamos a obtener:

![](https://i.imgur.com/ZXehYOk.png)
 
Épico.

Hemos desplegado el contrato y tenemos su dirección en la cadena de bloques. Nuestro sitio web necesitará saber donde buscar el contrato en la cadena de bloques. (Imagínense tener que buscar el contrato en toda la cadena de bloques. Eso sería... ¡malo!).
En la ventana de Terminal, la que mantiene nuestra red Ethereum local viva vamos a ver algo nuevo.

![](https://i.imgur.com/DmhZRJN.png)
 
Muy interesante. ¿Pero que es el gas? ¿Qué quiere decir bloque #1? ¿qué es el código de “Transaction”? 
Quiero que por favor vayas a google y lo busques, también puedes hacer todas las preguntas en #general-chill-chat :)

## 🚨 Antes de avanzar a la siguiente lección.

Sinceramente, deberías darte unas palmaditas en la espalda, ¡has hecho mucho!
A continuación, vamos a construir un sitio web que va a interactuar con nuestra red local de Ethereum y será increíble. 
Dirígete a #progress en Discord y muéstranos como vas con el proyecto y danos tus comentarios.

## 🎁 Resumen de la sección

¡Excelente! Llegaste al final de esta sección, revisa [este link](https://gist.github.com/adilanchian/9f745fdfa9186047e7a779c02f4bffb7) 
si quieres asegurarte que tu código está completamente correcto.

📝Tu respuesta
 Envíanos una captura de pantalla de tu Terminal mostrándonos el resultado obtenido.
