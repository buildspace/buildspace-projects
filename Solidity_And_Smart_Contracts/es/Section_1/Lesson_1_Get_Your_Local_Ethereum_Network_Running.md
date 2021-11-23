✅ Configura tu ambiente para comenzar a trabajar con la blockchain
---------------------------------------------------

​​Antes que nada, necesitamos que nuestra red local de Ethereum funcione. ¡De esta forma vamos a poder compilar y probar el código de nuestro contrato inteligente! ¿Sabes, cómo necesitas ejecutar un entorno local para trabajar en él? ¡Aquí es lo mismo!

Por ahora, todo lo que necesitas saber es que un contrato inteligente es un fragmento de código que vive en la blockchain. La blockchain es un lugar público donde cualquiera puede leer y escribir datos de forma segura por una tarifa. Piensa en eso como AWS o Heroku, ¡excepto que no le pertenece a nadie!

Entonces, en este caso, queremos que la gente nos 👋. El panorama general aquí es:

1\. **Vamos a escribir un contrato inteligente**. Ese contrato tiene toda la logica sobre cómo se manejan los 👋. Esto es como el código en el servidor.

2\. **Nuestro contrato inteligente será desplegado a la blockchain.** De esta forma, cualquier persona en el mundo podrá acceder y ejecutar nuestro contrato inteligente (si le damos permiso para hacerlo). Entonces, más o menos como un servidor :).

3\. **Vamos a construir un sitio web para el cliente** Esto permitirá a las personas interactuar fácilmente con nuestro contrato inteligente en la blockchain.

Voy a explicar algunas cosas en profundidad, según sea necesario (p. ej., como funciona la mineria, como se compilan y ejecutan los contratos inteligentes, etc) *pero por ahora centrémonos en hacer que las cosas funcionen*.

Si tienes algún problema en esta sección, deja un mensaje en Discord en `#section-1-help`.

✨ La magia de Hardhat
----------------------

1\. Vamos a utilizar mucho una herramienta llamada Hardhat. Esto nos permitirá levantar fácilmente una red local de Ethereum y nos dará ETH falsos de prueba y cuentas de prueba falsas con las que trabajar. Es como un servidor local, excepto que el "servidor" es la blockchain.

2\. Compilar rápidamente contratos inteligentes y probarlos en nuestra blockchain local.

Primero, vas a necesitar obtener node/npm. Si no lo tienes, lo puedes obtener [aquí](https://hardhat.org/tutorial/setting-up-the-environment.html).

Después, vayamos a la terminal (Git bash no va a funcionar). Cambia al directorio en el que desees trabajar. Una vez allí, ejecuta los siguientes comandos:

```bash
mkdir my-wave-portal
cd my-wave-portal
npm init -y
npm install --save-dev hardhat
```

👏 Pon en marcha el proyecto de muestra
---------------------------

Genial, ahora deberiamos tener hardhat. Vamos a crear un proyecto de muestra.

Ejecutar:

```bash
npx hardhat
```

Elige la opción de crear un proyecto de muestra (Create a sample project). El resto de las opciones puedes dejar los valores por defecto.

El proyecto de muestra va a decirte que instales `hardhat-waffle` y `hardhat-ethers`. Estas son otras librerías que usaremos más adelante :).

Continua e instala estas otras dependencias sólo en caso de que estas no se haya instalado automáticamente.

```bash
npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers ethers
```

Finalmente, ejecuta `npx hardhat accounts` y esto debería imprimir muchas cadenas de texto que se verán algo como esto:

`0xa0Ee7A142d267C1f36714E4a8F75612F20a79720`

Estas son direcciones de Ethereum que Hardhat generó para nosotros para simular usuarios reales en la blockchain. Esto nos va a ayudar mucho después en el proyecto cuando queramos simular usuarios enviando 👋!

🌟 Ejecutarlo
---------

Para asegurarte que todo está funcionando, ejecutar:

```bash
 npx hardhat compile
```
Después, ejecutar:

```bash
npx hardhat test
```

Deberias ver algo como esto:

![](https://i.imgur.com/rjPvls0.png)

Hagamos una pequeña limpieza.

Ve y abre el código del proyecto ahora en tu editor de códigos favorito. ¡A mi me gusta más VSCode! Queremos eliminar algunos archivos que se generaron para nosotros. No vamos a necesitar nada de eso. ¡Somos profesionales ;)!

Ve y elimina el archivo `sample-test.js` en la carpeta `test`. También elimina `sample-script.js` en la carpeta `scripts`. Finalmente, elimina `Greeter.sol` en la carpeta `contracts`. ¡No elimines las carpetas, solo los archivos!

🚨 Antes de hacer click en "Siguiente Lección"
-------------------------------------------

*Nota: Si no haces esto, Farza se pondrá triste :(.*

Dirígete a #progress y comparte una captura de pantalla de **tu** terminal el resultado de la prueba ¡Acabas de ejecutar un contrato inteligente, eso es cosa seria!! Muestralo ;).

PD: Si tu **no** tienes acceso a #progress, asegurate vincular tu Discord, unete a Discord [aquí](https://discord.gg/mXDqs6Ubcc), contáctanos en #general ¡Te vamos a ayudar a obtener acceso a los canales adecuados!
