import { pokemon_data } from './pokemon_data.js'

const category_list = ["image", "index", "name", "hp", "type"];

let current_page_number = 1;
let page_size = 5;

setCurrentList(pokemon_data);

window.pageSizeChange = function() {pageSizeChange()};
window.toggleTable = function() {toggleTable()};
window.closeModal = function() {closeModal()};

function toggleTable(){
    generateTable();
    generatePagination();
}

function pageSizeChange(){
    let page_size_value = document.getElementById("page_size_selection").value;
    if (page_size_value > 0){
        setPageSize(page_size_value);
        if(getCurrentPage() > Math.ceil(getCurrentList().length / getPageSize())){
            setCurrentPage(Math.ceil(getCurrentList().length / getPageSize()));
        }
        generateTable();
        generatePagination();
    }
}

function getCurrentList(){
    return JSON.parse(localStorage.getItem("input_list"));
}

function setCurrentList(input_list){
    localStorage.setItem("input_list", JSON.stringify(input_list));
}

function createRowImage(item) {
    let img = document.createElement('img');
    img.classList.add("row_image_inner");
    let image_source = "/images/" + item.image
    img.src = image_source;
    img.alt = item.altText;
    img.addEventListener("click",
    () => {
        triggerModal(image_source);
    },
    false
    )
    return img
}

function triggerModal(image_source){
    var modal = document.getElementById("modal")
    var modal_img = document.getElementById("modal_content");
    modal.style.display = "block";
    modal_img.src = image_source;

}

function closeModal(){
    let modal = document.getElementById("modal");
    modal.style.display = "none";
    console.log("hoi")
}

function createRowCategory(item, category) {
    let div = document.createElement("div")
    div.classList.add("row_" + category);
    if (category == "image"){
        div.appendChild(createRowImage(item));
    }
    else if (category == "name"){
        let link = document.createElement("a");
        link.href = "/details.html?index=" + item["index"];
        link.innerText = item[category];
        div.appendChild(link);
    }
    else{
        div.innerText = item[category];
    }
    return div
}

function createTableRow(item) {
    let row = document.createElement('div');
    row.classList.add("table_row");

    for (let i = 0; i < category_list.length; i++) {
        let category = category_list[i]
        row.append(createRowCategory(item, category))
    }
    return row
}

function createFieldset(item, category){
    let fieldset = document.createElement("fieldset");
    let legend = document.createElement("legend");
    legend.innerText = category;
    let div = document.createElement("div");
    div.id = category;
    div.innerText = item[category];
    fieldset.appendChild(legend);
    fieldset.appendChild(div);
    return fieldset
}

function createTile(item) {
    let tile = document.createElement("div");
    tile.classList.add("tile");
    tile.classList.add("details");
    let left = document.createElement('div');
    left.id = "left";
    let image = document.createElement("img");
    image.id = "main_image";
    image.src = "/images/" + item.image;
    left.appendChild(image);
    tile.appendChild(left);
    let right = document.createElement("div");
    right.id = "right";

    let name = document.createElement("a");
    name.href = "/details.html?index=" + item["index"];
    name.innerText = item.name;
    name.id = "name";

    let description = document.createElement("div");
    description.id = "description";
    let stats = document.createElement("div");
    stats.id = "stats";
    let fieldset_index = createFieldset(item, "index");
    let fieldset_hp = createFieldset(item, "hp");
    let fieldset_type = createFieldset(item, "type");
    stats.appendChild(fieldset_index);
    stats.appendChild(fieldset_hp);
    stats.appendChild(fieldset_type);
    right.appendChild(name);
    right.appendChild(description);
    right.appendChild(stats);
    tile.appendChild(left);
    tile.appendChild(right);
    return tile
}

function getAllTypes(){
    let output_type_list = [];
    
    for (let i = 0; i < pokemon_data.length; i++) {
        if (!output_type_list.includes(pokemon_data[i]["type"])){
            output_type_list.push(pokemon_data[i]["type"]);
        }
    }
    return output_type_list.sort();
}

function generateTableHeader(){
    let table_header = document.getElementById('table_header');
    for (let i = 0; i < category_list.length; i++) {
        let category = category_list[i]
        let div = document.createElement("div")
        div.innerText = category;
        div.id = "header_" + category;
        div.classList.add("row_" + category);
        if (category == "hp" || category == "index"){
            div.addEventListener("click",
            () => {
                sortListByCategory(category);
            },
            false
            )
            div.innerHTML = category + " <i class='fa fa-sort'></i>";
        }
        else if(category == "type"){
            let dropdown = document.createElement("select");
            dropdown.id = "typeDropdown";
            dropdown.options.add(new Option("All", "All"));
            let type_list = getAllTypes();
            for (let j = 0; j < type_list.length; j++) {
                dropdown.options.add(new Option(type_list[j], type_list[j]))
            }
            dropdown.addEventListener("change",
            () => {
                filterListByTypeValue(dropdown);
            }
            )
            div.appendChild(dropdown);
        }
        table_header.append(div)
    }
    return table_header;
}

function sortListByCategory(category){
    let output_list = getCurrentList();
    let ascending = !checkSortAscendingDirection(category); // Invert, because we want to sort the other way
    for (let i = 0; i < output_list.length; i++) {
        for (let j = 0; j < (output_list.length - i - 1); j++) {
            if (parseInt(output_list[j][category]) < parseInt(output_list[j + 1][category])) {
                let temp = output_list[j]
                output_list[j] = output_list[j + 1]
                output_list[j + 1] = temp
            }
        }
    }
    if (ascending == true){
        output_list.reverse();
    }
    setCurrentList(output_list);
    generateTable();
}

function checkSortAscendingDirection(category){
    console.log(getCurrentList()[0]);
    let current_list = getCurrentList();
    if( current_list.length < 2){
        return true;
    }
    let first_element = current_list[0][category];
    let last_element = current_list[current_list.length - 1][category];
    if (first_element > last_element){
        return false;
    }
    return true;
}

function filterListByTypeValue(dropdown){
    let type_value = dropdown.value;
    let output_list = [];
    let input_list = structuredClone(pokemon_data);
    if (type_value == "All"){
        output_list = input_list;
    }
    else{
        for (let i = 0; i < input_list.length; i++) {
            if (input_list[i]["type"] == type_value){
                output_list.push(input_list[i]);
            }
        }
    }
    setCurrentList(output_list)
    setCurrentPage(1);
    generateTable();
    generatePagination()
}

function generateMainTable(){
    generateTableHeader();
    generateTable();
    generatePagination();
    updateTitle()
}

function updateTitle(){
    document.title = "Page " + getCurrentPage() + " - Pokémon-verzameling"
}

function changePage(page_button){
    let new_page = page_button.value;
    setCurrentPage(new_page);
    generateTable();
    generatePagination();
    updateTitle();
}

function generatePaginationButton(button_value, button_text){
    let page_button = document.createElement("button")

    page_button.classList.add("pagination_button")
    if(getCurrentPage() == button_value){
        page_button.classList.add("highlight")
    }
    page_button.value = button_value;
    page_button.innerText = button_text;
    page_button.addEventListener("click",
    () => {
        changePage(page_button);
    },
    false
    )
    return page_button;
}

function generatePagination(){
    let number_of_pagination_buttons = 6;
    let pagination_div = document.getElementById("pagination")
    pagination_div.innerHTML = "";
    let page_size = getPageSize();
    let start_index = getCurrentPage() - Math.floor(number_of_pagination_buttons/2);
    if (start_index < 0){
        start_index = 0;
    }
    let end_index = start_index + number_of_pagination_buttons;
    let max_index = Math.ceil(getCurrentList().length / page_size); 
    if (end_index > max_index){
        end_index = max_index;
    }

    // First page button, if necessary
    if (start_index != 0){
        pagination_div.appendChild(generatePaginationButton(1, "|<"));
    }
    for (let i = start_index; i < end_index; i ++){
        let button_value = i + 1;
        let page_button = generatePaginationButton(button_value, button_value)
        pagination_div.appendChild(page_button);
    }
    // Last page button, if necessary
    if (end_index != max_index){
        pagination_div.appendChild(generatePaginationButton(max_index, ">|"));
    }
}

function getCurrentPage(){
    return current_page_number;
}

function setCurrentPage(page_number){
    if (page_number < 1){
        page_number = 1;
    }
    current_page_number = page_number;
}

function getPageSize(){
    return page_size;
}

function setPageSize(new_page_size){
    page_size = new_page_size;
}

function generateStats(){
    document.getElementById("total").innerText = pokemon_data.length;
    document.getElementById("this_list").innerText = getCurrentList().length;
}

function generateTable() {
    let input_list = getCurrentList();
    let table_content = document.getElementById("table_content");
    if (document.getElementById("table_toggle").checked == true){
        table_content.classList.add("tiles");
    }
    else{
        table_content.classList.remove("tiles");
    }
    table_content.innerHTML = "";

    let page_size = getPageSize();
    let start_index = (getCurrentPage()-1) * page_size;
    let end_index = getCurrentPage() * page_size;
    if (end_index > input_list.length){
        end_index = input_list.length;
    }
    input_list = input_list.slice(start_index, end_index)

    for (let i = 0; i < input_list.length; i++) {
        let item = input_list[i]
        if (document.getElementById("table_toggle").checked == true){
            var row = createTile(item);
        }
        else{
            var row = createTableRow(item);
        }
        table_content.appendChild(row);
    }
    generateStats();
}

generateMainTable();
