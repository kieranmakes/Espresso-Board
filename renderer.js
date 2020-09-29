// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const { clipboard } = require('electron');


let clipboard_refrences = [];
let current_clipboard = "";
let list_group = document.querySelector('.list-group');
let filler_logo = document.querySelector('#filler-icon');
let list_items = [];

clipboard.writeText('');


function update_display() {
    check_clipboard_for_changes();
    filler_logo_toggle();
}

function check_clipboard_for_changes () {

    current_clipboard = clipboard.readText();
    console.log(current_clipboard);
    
    if (!clipboard_refrences.includes(current_clipboard)
        && current_clipboard !== "") {
            clipboard_refrences.push(current_clipboard);   
            let new_list_item = create_new_list_item();
            list_items.push(new_list_item);
            update_listings_displayed();
    }
}

function filler_logo_toggle(){
    if (list_items.length === 0){
        filler_logo.style.visibility = 'visible';
    }else {
        filler_logo.style.visibility = 'hidden';
    }
}

function update_listings_displayed() {
    list_items.forEach( item => {
        list_group.prepend(item);
    });
}

function clear_listings_displayed_inside_a_node(node) {
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function create_new_list_item () {

    let new_list_item = document.createElement("li");
    new_list_item.classList.add('list-group-item');
    let text = document.createTextNode(current_clipboard);
    new_list_item.appendChild(text);

    let pre = document.createElement("pre");
    pre.appendChild(new_list_item);
    new_list_item = pre;

    new_list_item.addEventListener('click', event => {
        click_list_item_handler(new_list_item);
    });

    new_list_item.addEventListener('contextmenu', event => {
        right_click_list_item_handler(new_list_item); 
    });

    return new_list_item;
}

function click_list_item_handler (list_item){
        // write data of what was clicked to clipboard
        clipboard.writeText(event.target.innerText); 
        let index = list_items.findIndex(item => item === list_item);
        list_items.splice(index, 1);
        list_items.push(list_item);
        clear_listings_displayed_inside_a_node(list_group);
        update_listings_displayed();
}

function right_click_list_item_handler (list_item){
    clipboard.writeText('');
    let displayed_index = list_items.findIndex(item => item === list_item);
    let refrence_index = clipboard_refrences.findIndex(item => item === list_item);
    list_items.splice(displayed_index, 1);
    
    console.log(clipboard_refrences);
    clipboard_refrences.splice(refrence_index, 1);
    console.log(clipboard_refrences);

    clear_listings_displayed_inside_a_node(list_group);
    update_listings_displayed();
}

setInterval(update_display, 500);