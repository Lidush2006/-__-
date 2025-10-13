const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Создаем папку для загрузок, если её нет
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Генерируем уникальное имя файла
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB максимум на файл
        files: 3 // максимум 3 файла
    },
    fileFilter: function (req, file, cb) {
        // Проверяем, что файл является изображением
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Разрешены только изображения'), false);
        }
    }
});

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Маршрут для обработки формы
app.post('/api/ads', upload.array('photos', 3), (req, res) => {
    try {
        // Получаем данные из формы
        const { name, phone, title, address, description, price, rooms } = req.body;
        
        // Получаем информацию о загруженных файлах
        const photos = req.files ? req.files.map(file => ({
            filename: file.filename,
            originalname: file.originalname,
            path: file.path,
            size: file.size
        })) : [];
        
        // Здесь можно сохранить данные в базу данных
        console.log('Новое объявление:');
        console.log('Имя:', name);
        console.log('Телефон:', phone);
        console.log('Заголовок:', title);
        console.log('Адрес:', address);
        console.log('Описание:', description);
        console.log('Цена:', price);
        console.log('Комнаты:', rooms);
        console.log('Фотографии:', photos);
        
        // Отправляем ответ
        res.json({
            success: true,
            message: 'Объявление успешно отправлено',
            data: {
                name,
                phone,
                title,
                address,
                description,
                price,
                rooms,
                photos: photos.map(photo => photo.filename)
            }
        });
        
    } catch (error) {
        console.error('Ошибка при обработке формы:', error);
        res.status(500).json({
            success: false,
            message: 'Ошибка при обработке формы'
        });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});