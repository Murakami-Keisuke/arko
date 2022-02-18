let order = [];
let editable = true;


const onEdit=(e)=>{
    editable = false;
    const parent = e.target.closest('form');
    const editarea = parent.querySelectorAll('.editarea');
    const input = parent.querySelectorAll('input');
    const grip = parent.querySelectorAll('.grip');
    // console.log(input);
    input.forEach((i)=>{
        i.disabled=false;
    });
    editarea.forEach((i)=>{
        i.style.display="inline-block"
    });

grip.forEach((i)=>{
    i.style.display= 'block';
});
    e.target.classList.remove("btn-outline-primary");
    e.target.classList.add("btn-danger");
    e.target.value = "保存";

    e.target.addEventListener('click', saveEdit);
    e.target.removeEventListener('click', onEdit);

    Dragable(e);
}

const saveEdit = (e)=>{
    console.log('savebtn');
    const parent = e.target.closest('form');
    reset_sort(parent);

    e.target.type='submit';
}


const addNew = (e)=>{
    if(!editable){
        alert('編集中は追加できません。');
        return;

    }else{
        const count = e.target.parentNode.querySelectorAll('.valid_row').length;
        const addnew_sort_no = e.target.parentNode.querySelector('[name="addnew_sort_no"]');
        addnew_sort_no.value = count+1;
        console.log('addnew_sort_no.value:'+addnew_sort_no.value);
        e.target.type='submit';
    }

}

// すべてのフィールドのSort_noの再定義-------------------------------
const reset_sort = (parent) => {
    const input_sort = parent.querySelectorAll('.sort_no');
    input_sort.forEach((i)=>{
        let parent_row = i.closest('.row');
        let check= parent_row.querySelector('input[name*="DELETE"]:checked');
        if(check){
            console.log('DELETE caught');
            let index= order.indexOf(parent_row.id);
            order.splice(index , 1);
        }
    });
    console.log(input_sort);
    for (let i = 0; i < input_sort.length; i++) {
        let current_elm = input_sort.item(i).closest(".row").id;
        let current_elm_index = order.indexOf(current_elm);
        if(current_elm_index == -1){continue} 
        input_sort.item(i).value = current_elm_index + 1;
    }
    order = [];
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
    if(elm_drag==elm_under){
        return
    }
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
    console.log('drag:'+event);
}

const On_DragOver = (event) => {
    event.preventDefault();
    let list_elm = event.target.closest(".draggable_row");
    list_elm.style.borderTop = '5px solid blue';
}

const On_DragLeave = (event) => {
    let list_elm = event.target.closest(".draggable_row");
    if(list_elm.id=="for_sort"){
        list_elm.style.borderTop = '0';

    }else{
        list_elm.style.borderTop = '1px lightgray solid';
    }
   
}

const On_Drop = (event) => {
    event.preventDefault();
    let elm_under = event.target.closest(".draggable_row");
    let id = event.dataTransfer.getData('text/plain');
    console.log(id);
    let elm_drag = document.getElementById(id);
    elm_under.parentNode.insertBefore(elm_drag, elm_under);
    if(elm_under.id=="for_sort"){
        elm_under.style.borderTop = '0';

    }else{
        elm_under.style.borderTop = '1px lightgray solid';
    }
    resetOrder(elm_drag, elm_under);
}

// ドラッグイベントの追加------------------------------------
const Dragable = (e) => {
    const parent = e.target.closest('form');
    const Dragelm = parent.querySelectorAll('.draggable_row');
    const grip = parent.querySelectorAll('.grip');
    console.log('Dragelm:'+Dragelm);
    Dragelm.forEach((i) => {
        i.addEventListener('dragstart', On_DragStart);
        i.addEventListener('dragover', On_DragOver);
        i.addEventListener('dragleave', On_DragLeave);
        i.addEventListener('drop', On_Drop);
    });
    setOrder(Dragelm);
}


const color_set = ()=>{
    let color_area = document.querySelectorAll('.color_area');
    color_area.forEach((i)=>{
        let parent_row = i.closest('.row');
        let color_value = parent_row.querySelector('.color').value;
        i.style.backgroundColor=color_value;
    });



}

const mngset = (e)=>{
    const stat_from = e.target.parentNode.querySelector('[name="stat_FROM"]').value;
    const stat_to = e.target.parentNode.querySelector('[name="stat_TO"]').value;
    if(stat_from == stat_to){
        return;
    }

    res = confirm('操作は元に戻せません。本当によろしいですか？');
    if(!res){
        return;
    }else{
        e.target.type = 'submit';
    }

}

// ---------------------------------------------------------------
window.onload=()=>{
    // sabebtnへのイベントの追加
    const savebtn=document.querySelector("[name='savebtn']");
    // console.log(savebtn);
    savebtn.addEventListener('click', onEdit);

    // addnewbtnへのイベントの追加
    const addbtn=document.querySelector("[name='addbtn']");
    // console.log(addbtn);
    addbtn.addEventListener('click', addNew);

    const mngbtn = document.querySelector("[name='mngbtn']");
    mngbtn.addEventListener('click', mngset);

    color_set();

};