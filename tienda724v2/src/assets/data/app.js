function openMenu(type) {
    let bodyHeight = document.getElementById('body-height')
    let higthMax = bodyHeight.scrollHeight
    console.log(higthMax + "px !important")

    if (type == 'user-tables-responsive') {
        document.getElementById("menu-users-tables-responsive").setAttribute("style", `height: ${higthMax}px !important`);
        document.getElementById("menu-users-tables-responsive").classList.toggle("show");
        document.getElementById("menu-options-tables-responsive").classList.remove("show");
        document.getElementById("menu-information-tables-responsive").classList.remove("show");

    }
    if (type == 'options-tables-responsive') {
        document.getElementById("menu-options-tables-responsive").setAttribute("style", `height: ${higthMax}px !important`);
        document.getElementById("menu-users-tables-responsive").classList.remove("show");
        document.getElementById("menu-options-tables-responsive").classList.toggle("show");
        document.getElementById("menu-information-tables-responsive").classList.remove("show");
    }
    if (type == 'information-tables-responsive') {
        document.getElementById("menu-information-tables-responsive").setAttribute("style", `height: ${higthMax}px !important`);
        document.getElementById("menu-information-tables-responsive").classList.toggle("show");
        document.getElementById("menu-users-tables-responsive").classList.remove("show");
        document.getElementById("menu-options").classList.remove("show");
    }
    if (type == 'categories-tables-responsive') {
        document.getElementById("menu-categories-tables-responsive").setAttribute("style", `height: ${higthMax}px !important`);
        document.getElementById("menu-categories-tables-responsive").classList.toggle("show");
    }
    if (type == 'subcategories-tables-responsive') {
        document.getElementById("menu-subcategories-tables-responsive").setAttribute("style", `height: ${higthMax}px !important`);
        document.getElementById("menu-subcategories-tables-responsive").classList.toggle("show");
    }
}

function repeatMenu() {
    let divScroll = document.getElementById('div-scroll-tables-responsive')
    let higthMax = divScroll.scrollHeight - 300
    let higth = divScroll.scrollTop
    if (higthMax == higth) {
        let div = document.createElement('div');
        document.getElementById('list-user-tables-responsive').innerHTML += `<div>
        <li class=" uk-margin-remove uk-flex uk-flex-middle cursor-pointer items-menu">
            <img src="data/1.png " alt=" ">
            <h4 class="uk-text-bold uk-margin-remove color-blue">Ventas</h4>
        </li>
        </div>
        <li class=" uk-margin-remove uk-flex uk-flex-middle cursor-pointer items-menu padding-top-20 ">
            <img class="padding-right-30 " src="data/2.png " alt=" ">
            <h4 class="uk-text-bold uk-margin-remove color-blue ">Compras</h4>
        </li>
        <li class=" uk-margin-remove uk-flex uk-flex-middle cursor-pointer items-menu padding-top-20 ">
            <img class="padding-right-30 " src="data/3.png " alt=" ">
            <h4 class="uk-text-bold uk-margin-remove color-blue ">Entradas</h4>
        </li>
        <li class=" uk-margin-remove uk-flex uk-flex-middle cursor-pointer items-menu padding-top-20 ">
            <img class="padding-right-30 " src="data/4.png " alt=" ">
            <h4 class="uk-text-bold uk-margin-remove color-blue ">Salidas</h4>
        </li>
        <li class=" uk-margin-remove uk-flex uk-flex-middle cursor-pointer items-menu padding-top-20 ">
            <img class="padding-right-30 " src="data/5.png " alt=" ">
            <h4 class="uk-text-bold uk-margin-remove color-blue ">Devoluciones</h4>
        </li>
        <li class=" uk-margin-remove uk-flex uk-flex-middle cursor-pointer items-menu padding-top-20 ">
            <img class="padding-right-30 " src="data/6.png " alt=" ">
            <h4 class="uk-text-bold uk-margin-remove color-blue ">Catalogo de productos</h4>
        </li>
        <li class=" uk-margin-remove uk-flex uk-flex-middle cursor-pointer items-menu padding-top-20 ">
            <img class="padding-right-30 " src="data/7.png " alt=" ">
            <h4 class="uk-text-bold uk-margin-remove color-blue ">Inventario</h4>
        </li>
        <li class=" uk-margin-remove uk-flex uk-flex-middle cursor-pointer items-menu padding-top-20 ">
            <img class="padding-right-30 " src="data/8.png " alt=" ">
            <h4 class="uk-text-bold uk-margin-remove color-blue ">Reportes</h4>
        </li>
        <li class=" uk-margin-remove uk-flex uk-flex-middle cursor-pointer items-menu padding-top-20 ">
            <img class="padding-right-30 " src="data/9.png " alt=" ">
            <h4 class="uk-text-bold uk-margin-remove color-blue ">Terceros</h4>
        </li>
        <li class=" uk-margin-remove uk-flex uk-flex-middle cursor-pointer items-menu padding-top-20 ">
            <img class="padding-right-30 " src="data/10.png " alt=" ">
            <h4 class="uk-text-bold uk-margin-remove color-blue ">Contabilidad</h4>
        </li>
        <li class=" uk-margin-remove uk-flex uk-flex-middle cursor-pointer items-menu padding-top-20 ">
        <img class="padding-right-30 " src="data/14.png " alt=" ">
        <h4 class="uk-text-bold uk-margin-remove color-blue ">Mesas</h4>
    </li>`
    }
}