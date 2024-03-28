// Importar Cloudinary
const cloudinary = require('cloudinary').v2;
// Importamos dotenv
const dotenv = require('dotenv').config()

// Establecer las variables de entorno
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});

// Crear el metodo para enviar la imagen a clodinary y que la misma
// se almacene en un directorio llamado productos

const uploadImage = async(filePath) => {
    return await cloudinary.uploader.upload( filePath, { folder : 'productos' })
}

const deleteImage = async (publicId)=>{
    
    return await cloudinary.uploader.destroy( publicId )
}

module.exports = {
    uploadImage,
    deleteImage
}