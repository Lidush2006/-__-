document.getElementById('adForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        price: document.getElementById('price').value,
        to_email: 'Liduskurbonov@gmail.com' // Ваша почта
    };

    // Получаем файлы фото
    const photoFiles = document.getElementById('photos').files;
    const attachments = [];

    // Конвертируем фото в base64 (для EmailJS)
    for (let i = 0; i < Math.min(photoFiles.length, 3); i++) {
        const file = photoFiles[i];
        const base64File = await toBase64(file);
        attachments.push({
            filename: file.name,
            content: base64File.split(',')[1] // Убираем префикс
        });
    }

    // Добавляем фото к данным формы
    formData.attachments = attachments;

    // Отправка через EmailJS
    emailjs.send('mcnr2SOd9Iz5zEZey', 'YOUR_TEMPLATE_ID', formData)
        .then(() => {
            alert('Объявление отправлено! Проверьте вашу почту.');
            document.getElementById('adForm').reset();
            document.getElementById('preview').innerHTML = '';
        }, (error) => {
            alert('Ошибка: ' + error.text);
        });
});

// Функция конвертации файла в base64
function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

// Превью фото перед отправкой
document.getElementById('photos').addEventListener('change', function(e) {
    const preview = document.getElementById('preview');
    preview.innerHTML = '';
    
    for (let i = 0; i < Math.min(this.files.length, 3); i++) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(this.files[i]);
        img.style.height = '100px';
        img.style.margin = '5px';
        preview.appendChild(img);
    }
});