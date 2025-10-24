//Глобальные переменные
let authorColors = new Map();
let charEmoji = new Map();
let story = [];
let currentDialogueIndex = 0;

document.addEventListener('DOMContentLoaded', function() {

    //Прогрузка элементов
    const dropZone = document.getElementById('dropZone');
    const novelContainer = document.getElementById('novelContainer');
    const dialogueBox = document.getElementById('dialogueBox');
    const authorName = document.getElementById('authorName');
    const dialogueText = document.getElementById('dialogueText');
    const nextButton = document.getElementById('nextButton');

    //Отмена действий браузера при перетаскивании
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    //Отмена действий браузера при отпускании
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        handleDroppedFile(e.dataTransfer.files[0]);
    });

    //При нажатии на элемент вылезает форма выбора файла
    dropZone.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt';
        input.onchange = function(e) {
            handleDroppedFile(e.target.files[0]);
        };
        input.click();
    });

    //Обработка нажатия на кнопку
    nextButton.addEventListener('click', showNextDialogue);

    //Обработка файла от пользователя
    function handleDroppedFile(file) {
        if (file && file.type === 'text/plain') {
            const reader = new FileReader();
            reader.onload = function(e) {
                varDesignate(e.target.result);
                dropZone.style.display = 'none';
                novelContainer.classList.remove('hidden');
                novelContainer.classList.add('fade-in');
                showCurrentDialogue();
            };
            reader.readAsText(file);
        }
    }

    //Создание контейнера персонажей
    function createCharacterContainer() {
        const characterContainer = document.createElement('div');
        characterContainer.id = 'characterContainer';
        characterContainer.className = 'character-container';
        document.querySelector('.novel-container').insertBefore(characterContainer, dialogueBox);
    }

    //Обновление персонажей
    function updateCharacters(charactersData) {
        const characterContainer = document.getElementById('characterContainer');
        if (!characterContainer) {
            createCharacterContainer();
            return updateCharacters(charactersData);
        }

        //Очищаем предыдущих персонажей
        characterContainer.innerHTML = '';

        //Добавляем новых персонажей
        charactersData.forEach(character => {
            const characterDiv = document.createElement('div');
            characterDiv.className = 'character';
            
            const horizontalPos = character.pos[0];
            const verticalPos = character.pos[1];
            const rotation = character.rotation || 0;
            const size = character.size || 100;
            
            characterDiv.style.left = `${horizontalPos}%`;
            characterDiv.style.top = `${100-verticalPos}%`;
            characterDiv.style.transform = `translateX(-50%) rotate(${rotation}deg)`;
            
            const characterEmoji = document.createElement('div');
            characterEmoji.className = 'character-emoji';
            
            //Применяем размер
            const scale = size / 100;
            characterEmoji.style.transform = `scale(${scale})`;
            
            characterEmoji.textContent = character.getEmoji();
            characterEmoji.title = `${character.name} (${horizontalPos}%, ${verticalPos}%)`;
            
            //Добавляем подпись с именем персонажа
            const nameLabel = document.createElement('div');
            nameLabel.className = 'character-name';
            nameLabel.textContent = character.name;
            
            characterDiv.appendChild(characterEmoji);
            characterDiv.appendChild(nameLabel);
            characterContainer.appendChild(characterDiv);
        });
    }

    //Отображение диалога
    function showCurrentDialogue() {
        if (currentDialogueIndex < story.length) { //Подгрузка для диалога 
            const currentData = story[currentDialogueIndex];
            const authorColor = currentData.getAuthorColor();
            
            dialogueBox.style.backgroundColor = authorColor;
            dialogueBox.style.opacity = '0.8';
            
            authorName.textContent = currentData.author;
            dialogueText.textContent = currentData.text;

            updateCharacters(currentData.characters);
        
        } else { //Обновление страницы при конце
            location.reload();
        }
    }

    //Увеличение индекса и показ диалога
    function showNextDialogue() { 
        currentDialogueIndex++;
        showCurrentDialogue();
    }
});

//Парсинг
function varDesignate(fileContent){
    
    //Цвета
    temp = fileContent.split('\r')
    for(const obj of temp[0].split("|")){
        authorColors.set(obj.split(":")[0], obj.split(":")[1]);
        charEmoji.set(obj.split(":")[0], obj.split(":")[2])
    }

    document.title = temp[1]; //Название
    
    //История
    for(let i = 0; i<temp.length-2; i+=2){
        obj1 = temp.slice(2)[i].split("|");
        obj2 = temp.slice(2)[i+1].split("#");
        chars = [];
        for(const c of obj1.slice(1)){
            chars.push(
                new Character(
                    c.split("#")[0],
                    c.split("#")[1].split(",").slice(0, 2).map(o => parseInt(o)),
                    parseInt(c.split("#")[1].split(",").slice(2, 3)),
                    parseInt(c.split("#")[1].split(",").slice(3, 4))    
                )
            )
        }

        story.push(
            new AreaData(
                obj2[1].replace("\n", ""),
                obj2[0].replace("\n", ""),
                chars,
                obj1[0]
            )
        )
    }

    console.log(story)
}