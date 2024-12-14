# Gestión de Historias Clínicas - Aplicación Web

## Instalacion y uso  

### Dependencias

Para usar el codigo, es necesario tener instalado Node.js (v16 o superior) para usar npm e instalar las depedencias del proyecto.  
Con el comando npm install se debe tener:  
- React
- TypeScript
- Tailwind CSS
- React Router
- Supabase.js
Para usar Supabase.js, necesitas tener una cuenta y un proyecto configurado en Supabase. Accede a los servicios de Supabase utilizando variables de entorno.
- SUPABASE_URL: El URL del proyecto SupaBase
- SUPABASE_ANON_KEY: Clave publica del proyecto Supabase.


### Ejecutar el codigo

Al tener todo correctamente instalado, el comando de vite `npm run dev` iniciara el servidor de desarrollo con todas las funcionalidades de vite, mostrando la aplicacion en el navegador.  
Para 

## Descripción De la aplicacion

Este proyecto es una **aplicación web de gestión de historias clínicas** diseñada para consultorios médicos pequeños. La aplicación permite a los usuarios gestionar de manera segura la información médica de los pacientes, incluyendo la creación, edición y visualización de historias clínicas y evoluciones. Además, ofrece funcionalidades de autenticación, control de acceso y gestión de consultorios médicos mediante un sistema flexible y escalable basado en la nube.

El proyecto está implementado utilizando **React**, **TypeScript**, **Tailwind CSS** para el front-end, y **Supabase** para el back-end, aprovechando sus servicios de autenticación, bases de datos y almacenamiento. El despliegue está gestionado con **Vercel**, lo que garantiza una entrega eficiente y continua.

## Funcionalidades Principales

- **Autenticación de Usuarios**: Integrada con Supabase Auth, se asegura que solo los usuarios registrados puedan acceder al sistema.
- **Gestión de Consultorios**: Los usuarios pueden crear o unirse a consultorios médicos mediante un código único.
- **Gestión de Pacientes**: Funcionalidades CRUD para agregar, editar y eliminar pacientes de un consultorio.
- **Historias Clínicas y Evoluciones**: Registro completo de la información médica de los pacientes, con soporte para la creación y modificación de historias clínicas y evoluciones.
- **Búsqueda y Filtrado**: Funciones para buscar pacientes y filtrar la información según varios criterios como nombre, cédula y fecha.
- **Escalabilidad**: La aplicación está diseñada como un **SaaS**, permitiendo que múltiples consultorios puedan usar la misma plataforma de manera eficiente.
- **Diseño Responsivo**: Interfaces diseñadas para adaptarse a dispositivos móviles y de escritorio.
- **Extensibilidad**: El sistema está diseñado para permitir la incorporación de nuevas funcionalidades en el futuro.

## Tecnologías

- **Front-end**: React, TypeScript, Tailwind CSS, Fluent UI
- **Back-end**: Supabase (Autenticación, PostgreSQL, Almacenamiento)
- **Despliegue**: Vercel
- **Prototipado**: Figma

## Instrucciones de Uso

### 1. Registro y Autenticación de Usuarios

- **Crear una cuenta**:
  1. En la página principal de la aplicación, haz clic en "Crear Cuenta".
  2. Llena los campos requeridos (nombre, correo electrónico, contraseña) y confirma tu contraseña.

- **Iniciar sesión**:
  1. En la página principal, ingresa tu correo electrónico y contraseña.
  2. Si las credenciales son correctas, accederás al dashboard principal de la aplicación.

### 2. Gestión de Consultorios Médicos

- **Crear un nuevo consultorio**:
  1. Una vez que hayas iniciado sesión, selecciona la opción "Crear Consultorio".
  2. Ingresa el nombre, dirección y otros datos del consultorio.
  3. Se te generará un código único de consultorio que podrás compartir con otros usuarios para que se unan.

- **Unirse a un consultorio existente**:
  1. Si ya tienes un código de consultorio, selecciona la opción "Unirse a Consultorio".
  2. Ingresa el código proporcionado por el administrador del consultorio.
  3. Una vez validado, serás agregado al consultorio como miembro.

### 3. Gestión de Pacientes

- **Agregar un nuevo paciente**:
  1. En el dashboard del consultorio, selecciona "Pacientes" en el menú lateral.
  2. Haz clic en "Crear Paciente" y completa el formulario con la información básica del paciente (nombre, cédula, fecha de nacimiento, etc.).
  3. Guarda la información para crear un nuevo registro de paciente.

- **Editar información del paciente**:
  1. Si por alguna razon no completas la informacion del paciente, puedes presionar el boton 'presionar mas tarde'
  2. Esto permitira ver el formulario incompleto en la seccion "terminar mas tarde" de la seccion de Pacientes

### 4. Gestión de Historias Clínicas

- **Añadir evoluciones médicas**:
  1. En la tabla de historias, selecciona la historia clínica a la cual deseas añadir una evolución.
  2. Haz clic en "Agregar" y llena los campos necesarios, como el motivo de la evolución, examen físico, diagnóstico y plan de tratamiento.
  3. Guarda la evolución para añadirla al historial médico del paciente, o presiona "continuar mas tarde" para terminar la evolucion mas tarde
  4. En caso de haber puesto la evolucion para terminar mas tarde, esta se encontrara en la seccion de terminar mas tarde

### 5. Búsqueda y Filtrado de Pacientes

- **Buscar pacientes**:
  1. Utiliza la barra de búsqueda en el dashboard de pacientes para buscar por nombre o cédula.
  2. Los resultados se actualizarán automáticamente conforme escribes.

- **Filtrar por criterios específicos**:
  1. Usa los filtros disponibles para buscar pacientes por fecha de ingreso, nombre, cédula, o cualquier otro criterio relevante.
  2. Aplica los filtros para reducir la lista de pacientes según tus necesidades.

### 6. Cerrar Sesión

- Para cerrar sesión, haz clic en tu perfil (ubicado en la esquina superior derecha del dashboard) y selecciona "Cerrar Sesión".
- Esto te desconectará de la aplicación y tendrás que iniciar sesión nuevamente para acceder a tu cuenta.

### 7. Configuraciones

- En la seccion de configuracciones, accesible mediante el menu lateral, se puede:
 1. Cambiar el tema
 2. Cambiar la contrasenia
 3. Autorizar o rechazar usuarios a la empresa