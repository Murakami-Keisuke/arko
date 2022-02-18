
let editable = true;

const OnEdit = (e)=>{
    if(editable == false){
        alert("編集中の部分がまだ保存されていません。");
        return
    }

    editable=false;
    console.log('onedit')
    const parent = e.target.closest('form');
    const group_form = parent.querySelector('.group_form');
    const is_active =parent.querySelector('.is_active_true');
    const can_delete = parent.querySelector('.can_delete');

    group_form.disabled = false;
    is_active.disabled = false;
    can_delete.style.display='inline-block';

    e.target.classList.remove("btn-outline-primary");
    e.target.classList.add("btn-danger");
    e.target.value = "保存";
    e.target.addEventListener('click', SaveEdit);
    e.target.removeEventListener('click', OnEdit);

}

const SaveEdit = (e)=>{
    let res=true;
    console.log("save");
    const delete_form = e.target.parentNode.querySelector('.delete_form')
    if(delete_form.checked == true){
        res = confirm('本当に削除してもよろしいですか？まずは削除せずに、ユーザーを無効にすることをおすすめします。')
        if(res == false){
            return;
        }
    }
    editable=true;
    // ボタンのタイプを変えて送信
    e.target.type = "submit";
}

const pre_set = ()=>{
    const my_username = document.querySelector('input[name="my_username"]').value;
    const list = document.querySelectorAll('form');
    list.forEach((i)=>{
        let is_active_value = i.querySelector('input[name="is_active_value"]').value;
        let checkform = i.querySelector('.is_active_true');
        if(is_active_value=='True'){
            checkform.checked = true;
        }

        let group_value = i.querySelector('input[name="group_value"]').value;
        qset= 'option[value='+group_value+']'
        let group_option = i.querySelector(qset);
        group_option.selected = true;

        let thisname = i.querySelector('.thisname').innerText;
        if(thisname == my_username){
            i.querySelector('.btn').style.display='none';
        }
    });
}

window.onload = ()=>{
    pre_set()
    const button = document.querySelectorAll('.btn');
    button.forEach((i) => {
        i.addEventListener('click',OnEdit);
    });

};