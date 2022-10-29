const cloudinary = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: 'de9syj0aq',
  api_key: '488776918953183',
  api_secret: 'gMEyLgcyrdwd1Fpg5wf3VRY-bVo',
});

module.exports = cloudinary;

// exports.uploads = function (file, folder) {
//   return new Promise((resolve) => {
//     cloudinary.uploader.upload(
//       file,
//       (result) => {
//         resolve({
//           url: result.url,
//           id: result.public_id,
//         });
//       },
//       {
//         resource_type: 'auto',
//         folder: folder,
//       }
//     );
//   });
// };
