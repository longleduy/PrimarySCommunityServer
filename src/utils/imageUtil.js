import cloudinary from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

export const uploadImage = async (base64Uri, option = {}) => {
    const result = await cloudinary.v2.uploader.upload(base64Uri, option);
    return result.secure_url;
}