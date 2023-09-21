const itemForm = document.querySelector("#item-form");
const itemInput = document.querySelector("#item-input");
const itemList = document.querySelector("#item-list");
const clearBtn = document.querySelector('#clear');
const itemFilter = document.querySelector('#filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;



// const submitbtn = document.querySelector(".btn");

checkUI();
itemForm.addEventListener('submit', onAddItemSubmit);
itemList.addEventListener('click', onClickIcon);
clearBtn.addEventListener('click', clearItems);
itemFilter.addEventListener('input', filterItems);
document.addEventListener('DOMContentLoaded', displayUI);

function displayUI(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e){
    e.preventDefault();

    const newItem = itemInput.value;

    if(newItem === ''){
        alert("Enter something");
        return;
    } 

    if(isEditMode){
        const itemtoEdit = itemList.querySelector('.edit-mode');
        removeItemsFromStorage(itemtoEdit.textContent);
        itemtoEdit.classList.remove('edit-mode');
        itemtoEdit.remove();
        isEditMode = false;
    }else{
        if(checkDuplicates(newItem)){
            alert('Item already exists');
            return;
        }
    }
    

    addItemToDOM(newItem);

    addItemToStorage(newItem);
  
    checkUI();
    itemInput.value = '';
   
}

function addItemToDOM(item){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
    itemList.appendChild(li);
}

function createButton(classes){
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}

function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();
  

    itemsFromStorage.push(item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));

}

function getItemsFromStorage(){
    let itemsFromStorage;
    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    }else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    } 

    return itemsFromStorage;
}

function onClickIcon(e){
    const target = e.target.parentElement;
    if(target.classList.contains('remove-item')){
        removeItem(target.parentElement);
    }else{
        setEditModeOn(e.target);
    }
}

function setEditModeOn(item){
    isEditMode = true;
    itemList.querySelectorAll('li')
    .forEach((i)=>i.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item'
    formBtn.style.backgroundColor = '#228B22';
    itemInput.value = item.textContent;
}

function removeItem(item){
    if(confirm('Are you sure?')){
        item.remove();
        removeItemsFromStorage(item.textContent);

        checkUI();
    }
}

function removeItemsFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();
    itemsFromStorage= itemsFromStorage.filter((i) => i !== item);

    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

    
function clearItems(){
    while(itemList.firstChild){
        itemList.removeChild(itemList.firstChild);
    }

    localStorage.removeItem('items');
    checkUI();

}

function checkUI(){
    const items = itemList.querySelectorAll('li');
    if(items.length===0){
        itemFilter.style.display = 'none';
        clearBtn.style.display = 'none';
    }else{
        itemFilter.style.display = 'block';
        clearBtn.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item'
    formBtn.style.backgroundColor = '#333'; 
    isEditMode = false;
};

function checkDuplicates(item){
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}


function filterItems(e){
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach((item)=>{
        const itemName = item.firstChild.textContent.toLowerCase();
        if(itemName.indexOf(text) != -1){
            item.style.display = 'flex';
        }else{
            item.style.display = 'none';
        }
    });

}