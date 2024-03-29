// Importa el módulo nodemailer
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    // Servicio de correo utilizado (en este caso, Gmail)
    service: 'gmail',
     // Host del servidor de correo (obtenido de variables de entorno)
    host: process.env.HOST_MAILTRAP,
     // Puerto del servidor de correo (obtenido de variables de entorno)
    port: process.env.PORT_MAILTRAP,
    auth: {
        // Usuario de correo (obtenido de variables de entorno)
        user: process.env.USER_MAILTRAP,
         // Contraseña de correo (obtenida de variables de entorno)
        pass: process.env.PASS_MAILTRAP,
    }
});

const sendMailToUser = (userMail, token) => {
    let mailOptions = {
        // Remitente del correo (obtenido de variables de entorno)
        from: process.env.USER_MAILTRAP,
         // Destinatario del correo (pasado como argumento)
        to: userMail,
         // Asunto del correo
        subject: "Verifica tu cuenta",
        html: `
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff; display: flex; justify-content: center; align-items: center; margin-top: 20px; width: 100%;">
            <div style="max-width: 90%; padding: 2rem; text-align: center; border: 1px solid #dddddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #214E34; /* Fondo verde */ padding: 1rem; border-radius: 10px; /* Bordes redondeados */">
                    <h1 style="color: #ffffff; margin-bottom: 2rem;">!Bienvenido a nuestra página web! Por favor verifica tu cuenta</h1>
                </div>
                <div style="text-align: left; margin-bottom: 1rem;">
                    <p style="color: #333333; margin-bottom: 2rem; text-align: justify;">Estamos encantados de tenerte aquí y deseamos que tengas la mejor experiencia de compra en línea. En nuestra tienda en línea, encontrarás una amplia variedad de productos de alta calidad, para satisfacer tus necesidades y gustos.
                        Si tienes alguna pregunta, inquietud o necesitas asistencia, nuestro equipo de soporte estará encantado de ayudarte en todo momento. Queremos que tu experiencia de compra sea fácil, segura y satisfactoria.
                        ¡Encuentra productos increíbles y disfruta de la comodidad de comprar desde la comodidad de tu hogar! Esperamos que encuentres todo lo que buscas y más.
                        ¡Gracias por elegirnos!
                        
                        </p>
                </div>
                <a href=${process.env.URL}/login/confirmar/${token} style="background-color: #011638; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; transition: background-color 0.3s; cursor: pointer; display: inline-block; margin-bottom: 1rem; cursor: pointer;">Confirmar cuenta</a>
                <footer style="background-color: #ffffff; padding: 1rem; text-align: center;">
                    <p style="color: #666666; margin: 0;">© 2024 Poner nombre Micromercado. Todos los derechos reservados.</p>
                </footer>
            </div>
        </body> 
        `
    };
    // Envía el correo electrónico utilizando el objeto de transporte
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            // Muestra el error en la consola si ocurrió algún problema durante el envío
            console.log(error);
        } else {
            // Muestra un mensaje de confirmación si el correo se envió correctamente
            console.log('Correo enviado: ' + info.response);
        }
    });
};

const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transporter.sendMail({
        // Remitente del correo
    from: 'nombredelamicroempresa@vet.com',
     // Destinatario del correo
    to: userMail,
     // Asunto del correo
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff; display: flex; justify-content: center; align-items: center; margin-top: 20px; width: 100%;">
        <div style="max-width: 90%; padding: 2rem; text-align: center; border: 1px solid #dddddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #214E34; /* Fondo verde */ padding: 1rem; border-radius: 10px; /* Bordes redondeados */">
                <h1 style="color: #ffffff; /* Texto blanco */ margin-bottom: 2rem;">Restablece tu contraseña</h1>
            </div>
            <div style="text-align: left; margin-bottom: 1rem;">
                <p style="color: #333333; margin-bottom: 2rem; text-align: justify;">Para garantizar la seguridad de tu cuenta, te pedimos que restablezcas tu contraseña. Sigue el enlace a continuación para completar el proceso:</p>
            </div>
            <a href=${process.env.URL}/login/recuperar-password/${token} style="background-color: #011638; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 5px; transition: background-color 0.3s; cursor: pointer; display: inline-block; margin-bottom: 1rem; cursor: pointer;">Restablecer Contraseña</a>
            <footer style="background-color: #ffffff; padding: 1rem; text-align: center;">
                <p style="color: #666666; margin: 0;">© 2024 Poner nombre Micromercado. Todos los derechos reservados.</p>
            </footer>
        </div>
    </body>
    `
    });
    // Muestra un mensaje de confirmación si el correo se envió correctamente
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

const sendMailToEmpresa = async(userMail,password)=>{
    let info = await transporter.sendMail({
        // Remitente del correo
    from: 'admin@vet.com',
     // Destinatario del correo
    to: userMail,
     // Asunto del correo
    subject: "Correo de bienvenida",
    html: `
    <h1>Sistema de gestión (VET-ESFOT 🐶 😺)</h1>
    <hr>
    <p>Contraseña de acceso: ${password}</p>
    <a href=${process.env.URL_FRONTEND}login>Clic para iniciar sesión</a>
    <hr>
    <footer>Grandote te da la Bienvenida!</footer>
    `
    });
    // Muestra un mensaje de confirmación si el correo se envió correctamente
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

module.exports = {
    sendMailToUser,
    sendMailToRecoveryPassword,
    sendMailToEmpresa
}