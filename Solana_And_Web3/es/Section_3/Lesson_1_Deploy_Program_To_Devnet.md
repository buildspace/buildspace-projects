Prácticamente tenemos una API básica ahora, ¿verdad :)?

Podemos **ENVIAR** datos y podemos **OBTENER** datos.

¡Conectemos nuestra aplicación web con nuestro programa! Lo que tendremos que hacer es implementar en la red de desarrollo. Esta es una red administrada por Solana que se ejecuta en SOL falso o de prueba.

Técnicamente, *podríamos* implementar nuestro programa localmente con `solana-test-validator` y construir nuestra aplicación web usando el programa local, pero aquí en buildspace estamos muy interesados en llegar a producir lo más rápido posible :). ¡¿Por qué perder el tiempo localmente cuando podemos implementar en la cadena de bloques real?! Jeje.

Además, creo que es más fácil crear la aplicación web una vez que implementamos nuestro programa Solana en la red de desarrollo. Hagámoslo.

*Nota: asegúrate de que `solana-test-validator` **no** se esté ejecutando en ninguna parte.*

### 🌳 Configura el entorno para devnet

En realidad, es bastante complicado implementarlo en devnet. Sígueme aquí y asegúrate de no perderte ningún paso :).
Primero, cambiemos a devnet:

```bash
solana config set --url devnet
```

Una vez que hiciste eso, ahora ejecuta:

```bash
solana config get
```

Y ahora verás que apuntas a [`https://api.devnet.solana.com`](https://api.devnet.solana.com/). ¡Así es como Anchor sabrá dónde desplegarse!
A partir de aquí, tendremos que hacernos de algunos SOL en la red de desarrollo. En realidad, es bastante fácil, solo ejecutamos dos veces:

```bash
solana airdrop 2
```
Ahora, ejecuta:
```bash
solana balance
```

¡Y deberías ver que tienes 4 SOL falsos o de prueba en tu cartera! ¡Esto te muestra tu saldo en devnet!

*Nota: a veces obtendrás un error que dice algo así como "fondos insuficientes"; cada vez que eso suceda, simplemente ejecuta el `2` SOL como lo hicimos arriba. Nota: `2` es el máximo que puedes obtener a la vez en este momento. Por lo tanto, deberás actualizar la cartera en alguna ocasión.*

### ✨ Cambiando algunas variables

Ahora, necesitamos cambiar algunas variables en `Anchor.toml`. Aquí es donde se pone un poco complicado.

En `Anchor.toml`, cambie `[programs.localnet]` a `[programs.devnet]`.

Luego, cambie `cluster = "localnet"` a `cluster = "devnet"`.

Ahora, ejecuta:

```bash
anchor build
```

Esto creará una nueva compilación para nosotros con una identificación de programa. Podemos acceder a él ejecutando:

```bash
solana address -k target/deploy/myepicproject-keypair.json
```

Esto generará la identificación de su programa, ** cópialo **. Hablaremos de este tema en un segundo.

Ahora, ve a `lib.rs`. Verás esta identificación en la parte superior.

```bash
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
```

¿Entonces qué es esto? Me confundió mucho cuando estaba investigando por primera vez jajaja.

Básicamente, es una identificación generada inicialmente por `anchor init` que especifica la identificación de nuestro programa.

Eso es importante porque la identificación del programa especifica cómo cargar y ejecutar el programa y contiene información sobre cómo el tiempo de ejecución de Solana debe ejecutar el programa.

La identificación del programa también ayuda al tiempo de ejecución de Solana a ver todas las cuentas creadas por el propio programa. Entonces, ¿recuerdas cómo nuestro programa crea "cuentas" que contienen datos relacionados con el programa? Pues con este ID Solana puede ver rápidamente todas las cuentas generadas por el programa y referenciarlas fácilmente.

Por lo tanto, **necesitamos cambiar este ID de programa** en `declare_id!` a la salida de `solana address -k target/deploy/myepicproject-keypair.json`. ¿Por qué? Bueno, el `anchor init` que nos dio fue solo un marcador de posición. ¡Ahora tendremos una identificación de programa con la que realmente podemos implementar!

* Nota: ¡la identificación del programa de todos será diferente! Esto es generado por Anchor.*
* 
Ahora, vaya a `Anchor.toml` y en `[programs.devnet]` podrás ver algo como `myepicproject = "Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"`. Continua y cambia esta identificación a la misma salida de identificación cuando ejecutes `solana address -k target/deploy/myepicproject-keypair.json`.

Genial, ¡cambiaste la identificación de tu programa en dos lugares!

Finalmente, una vez que hayas hecho todo esto, debemos ejecutar el comando de compilación nuevamente:

```bash
anchor build
```

¿Por qué? ¡Porque queremos construir el proyecto con nuestra nueva identificación de programa! Anchor genera ciertos archivos en una compilación en el directorio "objetivo" y queremos asegurarnos de que esos archivos generados tengan la mejor identificación del programa y la más reciente.

** Fueron muchos pasos. Es fácil equivocarse y obtener un error aleatorio y confuso. En conclusión:**
```
solana config set --url devnet

// Make sure you're on devnet.
solana config get

anchor build

// Get the new program id.
solana address -k target/deploy/myepicproject-keypair.json

// Update Anchor.toml and lib.rs w/ new program id.
// Make sure Anchor.toml is on devnet.

// Build again.
anchor build
```

### 🚀 ¡Implementando en devnet!

Y finalmente, ¡estás listo para hacer la implementación :)! Adelante, hazlo:

```bash
anchor deploy
```

Deberás ver la frase "Implementación exitosa" (Deploy success) :).

Una vez que lo hayas hecho, ve a [Solana Explorer](https://explorer.solana.com/?cluster=devnet) para ver si todo funcionó bien. *Nota: asegúrate de ir a la parte superior derecha, hacer clic en "Mainnet" y luego haga clic en "Devnet" ya que implementamos en Devnet.*

En el explorador, pega tu ID de programa (el mismo que teníamos de `solana address -k target/deploy/myepicproject-keypair.json`) y búscalo.

![Untitled](https://i.imgur.com/U2wgQpj.png)

¡¡Verás tu programa desplegado!! Desplázate hacia abajo y ve el historial de transacciones y verás la implementación allí mismo.

![Untitled](https://i.imgur.com/KeTHI7p.png)

**HEYYYY: ACABAS DE IMPLEMENTAR A LA CADENA DE BLOQUES DE SOLANA REAL. INCREIBLE.**

Por supuesto, esto no es "Mainnet", pero "Devnet" está a cargo de mineros reales y es legítimo.

**No hay tantos "desarrolladores de Solana". Entonces, en este punto, probablemente estés en el 10% superior de los desarrolladores de Solana, jajaja. ¡Felicitaciones!**

*Nota: A partir de este momento, no hagas cambios en lib.rs hasta que yo te lo indique. Cada vez que cambias tu programa, deberás volver a implementar y seguir los pasos anteriores nuevamente. Siempre pierdo pasos con facilidad y obtengo errores extraños jajaja. Centrémonos en la aplicación web ahora, y luego te mostraré un buen flujo de trabajo para cambiar su programa + ¡reimplementar después!*

### 🚨 Reporte de avances

*Por favor haz esto sino Farza se pondrá triste :(*

Desplegaste un programa Solana!!! Caramba, sí, ¡esto es enorme!

Hemos visto que los mejores constructores se han acostumbrado a "construir en público". ¡Todo esto significa compartir algunos aprendizajes sobre el logro que acaban de alcanzar!

Este también es un buen momento para tuitear que estás aprendiendo sobre Solana y que acabas de implementar un programa en Solana Devnet. ¡Inspira a otros a unirse a web3!

Asegúrate de incluir el enlace de Solana Explorer y adjunta una captura de pantalla del programa implementado. ¡Agrega una captura de pantalla de Solana Explorer! Etiqueta `@_buildspace` ;).
