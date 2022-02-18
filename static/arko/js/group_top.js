
let editable = true;
let order = [];


// 編集ボタンの動作
const OnEdit = (e) => {
    console.log('addbtn clicked');
    if(!editable){
        alert("編集中の部分がまだ保存されていません。");
        return;
    }
    const parentelm = e.target.closest(".main_wrapper");
    const editconfirm = parentelm.querySelectorAll(".edit_confirm");
    const editform = parentelm.querySelectorAll('input');
    const selectform = parentelm.querySelectorAll('select');
    const DnDspan = parentelm.querySelector('.DnD');
    // console.log(editform);
    e.target.classList.remove("btn-outline-primary");
    e.target.classList.add("btn-danger");
    e.target.value = "保存";
    editconfirm.forEach((i) => {
        i.style.display = "block";
    });
    editform.forEach((form) => {
        form.disabled = false;
    });
    selectform.forEach((form) => {
        form.disabled = false;
    });
    DnDspan.style.display='inline-block';
    e.target.addEventListener('click', SaveEdit);
    e.target.removeEventListener('click', OnEdit);

    // カードリンクの無効化（すべてのカード）
    const card_link = document.querySelectorAll('.card_link');
    // console.log(card_link);
    card_link.forEach((i)=>{
        i.removeAttribute('href');
    });
    Dragable(e);
    editable= false;
}

// すべてのフィールドのSort_noの再定義
const reset_sort = (parent) => {
    const input_sort = parent.querySelectorAll('.sort_no');
    input_sort.forEach((i)=>{
        let parent_li = i.closest('li');
        let check= parent_li.querySelector('input[type="checkbox"]:checked');
        if(check){
            let index= order.indexOf(parent_li.id);
            order.splice(index , 1);
        }
    });
    console.log(input_sort);
    for (let i = 0; i < input_sort.length; i++) {
        let current_elm = input_sort.item(i).closest("li").id;
        let current_elm_index = order.indexOf(current_elm);
        if(current_elm_index == -1){continue} 
        input_sort.item(i).value = current_elm_index + 1;
    }
    order = [];
}

// 保存ボタンの動作
const SaveEdit = (e) => {
    console.log('savebtn clicked');
    // ドラッグイベントの削除
    const parent = e.target.closest('form');
    const Dragelm = parent.querySelectorAll('.drag-list');
    // console.log(Dragelm);
    Dragelm.forEach((i) => {
        i.draggable = false;
        i.removeEventListener('dragstart', On_DragStart);
        i.removeEventListener('dragover', On_DragOver);
        i.removeEventListener('dragleave', On_DragLeave);
        i.removeEventListener('drop', On_Drop);
    });

    // 削除されるアイテムがあるのかチェックボックスを調べる
    const checkedelm = parent.querySelectorAll('input[type="checkbox"]:checked');
    // console.log(checkedelm);
    if (checkedelm.length !== 0) {
        res = confirm("削除する項目があります。含まれるコンテンツもすべて削除されます。本当によろしいですか？");
        if (!res) {
            return;
        }
    }
    const loading = document.querySelector(".loading");
    loading.style.display="flex";
    reset_sort(parent);
    editable=true;
    // ボタンのタイプを変えて送信
    e.target.type = "submit";
}

// ドラッグ前の順番の取得-------------------------------------------------------
const setOrder = (Dragelm) => {
    for (let i = 0; i < Dragelm.length; i++) {
        let corrent_elm = Dragelm.item(i).id;
        order.push(corrent_elm);
    }
    console.log(order);
}

// ドラッグ後の順番の設定
const resetOrder = (elm_drag, elm_under) => {
    const drag_index = order.indexOf(elm_drag.id);
    order.splice(drag_index, 1);
    const under_index = order.indexOf(elm_under.id);
    order.splice(under_index, 0, elm_drag.id);
    console.log('drag_index:' + drag_index + '  under_index:' + under_index);
    // console.log(order);

}

// ドラッグ関係の関数
const On_DragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
    // console.log(event);
}

const On_DragOver = (event) => {
    event.preventDefault();
    let list_elm = event.target.closest("li");
    list_elm.style.borderTop = '5px solid blue';
}

const On_DragLeave = (event) => {
    let list_elm = event.target.closest("li");
    list_elm.style.borderTop = '0';
}

const On_Drop = (event) => {
    event.preventDefault();
    let elm_under = event.target.closest("li");
    let id = event.dataTransfer.getData('text/plain');
    console.log(id);
    let elm_drag = document.getElementById(id);
    elm_under.parentNode.insertBefore(elm_drag, elm_under);
    elm_under.style.borderTop = '0';
    resetOrder(elm_drag, elm_under);
}

// ドラッグリストへのイベントの追加
const Dragable = (e) => {
    const parent = e.target.closest('form');
    const Dragelm = parent.querySelectorAll('.drag-list');
    // console.log(Dragelm);
    Dragelm.forEach((i) => {
        i.addEventListener('dragstart', On_DragStart);
        i.addEventListener('dragover', On_DragOver);
        i.addEventListener('dragleave', On_DragLeave);
        i.addEventListener('drop', On_Drop);
    });
    setOrder(Dragelm);
}

// 追加ボタンの動作抑制-----------------------------------------------------
const addNew = (e) =>{
    if(!editable){
        alert("編集中の部分がまだ保存されていません。");
        e.preventDefault();
        return false;
    }
    const parent_form = e.target.closest('form');
    const id_input = parent_form.querySelector('.id_input');
    console.log('id_input: '+id_input.name);
    if(id_input.value==0){
        alert("コンテンツを追加するための親要素がまだありません。");
        return false;
    }else{
        let parent_wrapper;

        if(e.target.name=="multiadd_new"){()=>{}
            parent_wrapper = document.querySelector('.main_room_wrapper');
        }else{
            parent_wrapper = e.target.closest('.main_wrapper');
        }
        // console.log(parent_wrapper);
        const count = parent_wrapper.querySelectorAll(".valid_list").length;
        const input = parent_form.querySelector(".sort_no");
        // console.log(input + 'count:'+count);
        input.value = count + 1;
        const loading = document.querySelector(".loading");
        loading.style.display="flex";
        e.target.type = "submit";
    }
    
}

// アクティブカードの見た目変更---------------------------------------------
const active_card_search = ()=>{
    let active_block_id = document.querySelector("#block_id").value;
    active_block_id = "#block_" + active_block_id;
    let active_block_card = document.querySelector(active_block_id);
    let active_block_card_a = ''
    if(active_block_card){
        active_block_card= active_block_card.querySelector('.card_wrapper');
        active_block_card_a = active_block_card.querySelector('a');
        active_block_card_a.removeAttribute('href');
        // console.log(active_block_card);
        active_block_card.classList.add('card_wrapper_active');
        // console.log(active_block_card.classList);
    
    }
    
    let active_card_id = document.querySelector("#card_id").value;
    active_card_id = "#card_" + active_card_id;
    let active_card_card = document.querySelector(active_card_id);
    let active_card_card_a = '';
    if(active_card_card){
        active_card_card= active_card_card.querySelector('.card_wrapper');
        active_card_card_a = active_card_card.querySelector('a');
        active_card_card_a.removeAttribute('href');
        // console.log(active_block_card.classList);
        active_card_card.classList.add('card_wrapper_active');
    }
    
}

// ---------------------------------------------------------------------------
window.onload=(()=>{
    active_card_search()
    // 追加ボタンへのイベントの追加
    const addbtn = document.querySelectorAll(".addbtn");
    console.log(addbtn);
    if (addbtn) {
        addbtn.forEach((i) => {
            i.addEventListener('click', addNew);
        });
    }
    // 編集ボタンへのイベントの追加
    const editbtn = document.querySelectorAll(".edit_btn");
    if (editbtn) {
        editbtn.forEach((i) => {
            i.addEventListener('click', OnEdit);
        });
    }
});