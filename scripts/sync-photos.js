const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/photos.json');
const PUBLIC_DIR = path.join(__dirname, '../public/photography');

function syncPhotos() {
  const photosData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const folders = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  folders.forEach(folder => {
    const folderPath = path.join(PUBLIC_DIR, folder);
    const files = fs.readdirSync(folderPath)
      .filter(file => /\.(jpe?g|png|gif|webp|heic|jpeg)$/i.test(file))
      .map(file => `/photography/${folder}/${file}`);

    const existingTrip = photosData.find(t => t.name === folder);
    if (existingTrip) {
      // Update photos if folder name matches name in JSON
      existingTrip.photos = files;
    } else {
      // Add new trip if folder name doesn't exist in JSON
      photosData.unshift({
        name: folder,
        photos: files
      });
    }
  });

  fs.writeFileSync(DATA_FILE, JSON.stringify(photosData, null, 2));
  console.log('Successfully synced photography data!');
}

syncPhotos();
