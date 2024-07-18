# Minimarket Mika y Vale
Para poder clonar y utilizar este repositorio para ver su funcionamiento o para realizar mejoras, se necesitan las siguientes herramientas:
- **Git**
- Un editor de texto compatible con **Node.js** como Visual Studio Code
- **MongoDB Compass** para usar de manera local o **MongoDB Atlas** para usar en la nube
- **Node.js**
- **Postman** o cualquier otra aplicación que permita realizar peticiones a la API
## Instalación
### Como primer paso, se debe de clonar este repositorio:
```
git clone https://github.com/miguel-Paredes/backend-Servicio-Web
```
### Abrir el proyecto en el editor de texto.
### Instalar las dependencias:
```
npm i
```
## Configuraciones
### En la carpeta raiz del proyecto se debe de crear un archivo .env
```
New-Item -ItemType File -Name ".env"
```
### Copiamos toda la información que se encuentra en el archivo .env.example
![imagen](https://github.com/Miguel-Paredes/Backend-Servicio-Web/assets/117743367/652b190e-189d-46ba-b804-3d8d1badd0dd)
### Para la base de datos **MongoDB**
#### Para MongoDB **Compass** se debe de colocar en la variable de entorno **Base_de_Datos** el siguiente enlace:
```
mongodb://0.0.0.0:27017/tesis
```
#### Para MongoDB **Atlas**:
- Ingresar a MongoDB Atlas
- Crear una nueva base de datos, guiarse por el siguiente Link: https://www.freecodecamp.org/espanol/news/tutorial-de-mongodb-atlas-como-empezar/
- Una vez creado connectarse mediante la URL, puede guiarse igualmente por el link anterior o dirigirse directamente a la seccion mediante este: https://www.freecodecamp.org/espanol/news/tutorial-de-mongodb-atlas-como-empezar/#:~:text=Connectarte%20a%20tu%20cluster
- Agregar el link generado con los cambios en la variable de entorno `Base_de_Datos`
#### Para el envio de correos **Nodemailer**:
Para el presente proyecto, se utilizarán correos de Hotmail u Outlook. En la variable `USER_MAILTRAP`, coloca un correo electrónico con uno de estos dos dominios. En la variable `PASS_MAILTRAP`, introduce tu contraseña. Es importante destacar que la contraseña no debe contener el carácter **#**, ya que el archivo `.env` podría interpretarlo como un comentario.
#### Para poder colocar imagenes **Cloudinary**
- Ingresar a https://cloudinary.com/users/login
- Nos dirigimos a Dashboard, copiamos la información de Cloud name y la colocamos en la variable de entorno `CLOUD_NAME`, posteriormente damos click en **Go to API Keys**
![imagen](https://github.com/Miguel-Paredes/Backend-Servicio-Web/assets/117743367/e1e096f4-61ba-43c6-bfed-45bf517b8857)
- Creamos una API Key dando click en el en **Generate New API Key**
![imagen](https://github.com/Miguel-Paredes/Backend-Servicio-Web/assets/117743367/fe18b198-0045-4d0f-80aa-cd5743590335)
- Copiamos **API Key** y lo colocamos en la variable de entorno `API_KEY`
- Para la `API_SECRET` damos click en el ojo que se encuentra debajo de **API Secret** y del lado derecho de la credencial
![imagen](https://github.com/Miguel-Paredes/Backend-Servicio-Web/assets/117743367/557e8861-216e-4871-b852-bad18fe33071)
- Colocamos el código de confirmación que nos llego por correo y copiamos para colocarla en la variable `API_SECRET`
#### Para configurar el correo y el celular del administrador
Colocar un correo en la variable `EMAIL_ADMINISTRADOR` y un número celular que empiece con **09** en `CELULAR_ADMINISTRADOR`
## Uso
Una vez hechas todas las configuraciones se puede usar el comando:
```
npm start
```
Este comando pondra en funcionamiento nuestra API, al momento de ponerse en funcionamiento la información del administrador se generara automaticamente y se guardara en la Base de Datos
## Postman
Para su interactuar con cada uno de los endpoints correspondientes utilizar la herramienta Postman mediante el siguiente enlace. https://documenter.getpostman.com/view/33300172/2sA3e1CAK2
