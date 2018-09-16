# OdontoFy 


Plataforma de gestión especializada en clínicas odontológicas en la nube.

[ODONTOFY](http://odontofy.com/) integra el ciclo completo de atención y seguimiento de pacientes, 
así como de los empleados y profesionales. De manera sencilla brinda las
funcionalidades necesarias para llevar todo el control contable y financiero.

## Funcionalidades actuales

 - Afiliación de las clínicas
 - Definición de sus costos por tratamientos
 - Registro de empleados por roles
 - Registro de un paciente(cumpliendo el estándar de la historia clínica
   odontológica internacional)
 - Exportación de la historia clínica
 - Agendamiento de pacientes (Asignación de un odontólogo en una fecha
   determinada)
 - Definición de un plan diagnóstico
 - Odontograma
 - Lista de tratamientos que serán aplicados



## Empezando

Para correr el proyecto debera descargar el repositorio e instalar las dependecias necesarias:

### Prerequisitos

Usamos el sistema de control de versiones distribuidas Git. Puede descargar la version 
correspondiente a su sistema operativo en: [GIT](http://git-scm.com/).

Utilizamos nodejs LTS javascript del lado del servidor para publicar el sistema: [NODE](http://nodejs.org/).

**Verifique su version de node `v6.x.x` y npm `3.x.x` Versiones anteriores producen Error.**

Mediante el comando `node -v` y `npm -v` en la terminal o consola.


### Clone odontofy

Esto generará una copia identica del proyecto en su ordenador incluyendo las versiones y registro de cambios que han realizado los desarrolladores para ello utilice [GIT](http://git-scm.com/). Tenga en cuenta que debe contar con los permisos correspondientes:

```
git clone https://hdelcastillo@bitbucket.org/mvcruzata/odondofy.git
cd odondofy
```

### Instalando Dependencias

Una vez clonado deberá instalar los paquetes usados antes de poder ejecutar el servidor ejecutando el comando:

```
npm install
```

### Ejecutar Aplicación

Para levantar el servidor y poder ver los avances del proyecto

```
npm start
```

Ahora podra ver la aplicacion en `http://localhost:3000/`.