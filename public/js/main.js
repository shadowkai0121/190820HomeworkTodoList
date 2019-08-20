// Modal component
Vue.component('edit-tag', {
    props: ['todo'],
    template: '#editTagForm',
    methods: {
        editTag(e) {
            e.preventDefault();

            // 呼叫 axios
            sendRequest("put", app.todoUrl, this.todo, () => {
                // 成功後執行 ...

                // 取得 todo 在原始陣列中的位置
                let editIndex = app.todos.findIndex(todo => {
                    return this.todo.id === todo.id;
                });

                // 修改資料
                app.todos[editIndex].title = this.todo.title;

                app.todos[editIndex].end_time = this.todo.end_time;

                // 關閉 Modal
                app.showEditForm = false;

            });

        }
    }
})

Vue.component('create-tag', {
    data() {
        return {
            todo: {
                id: 0,
                title: '',
                end_time: ''
            }
        }
    },
    template: '#createTagForm',
    methods: {
        createTag(e) {

            e.preventDefault();

            sendRequest("post", app.todoUrl, this.todo, () => {

                // 取得 app.todos 中最大的 id + 1 做為新 id
                this.todo.id = 1 +
                    Math.max.apply(Math, app.todos.map(todo => { return todo.id; }));

                // 插入 todos 開頭
                app.todos.splice(0, 0, this.todo);

                // 關閉 Modal
                app.showCreateForm = false;

            });
        }
    }
})

Vue.component('Modal', {
    template: '#modalTemplate'
});
// Modal component end

// Todo list component
Vue.component('todo-item', {
    props: ['todo'],
    template: '#todoItem',
    methods: {
        remove() {

            sendRequest("DELETE", app.todoUrl, { id: this.todo.id });

            let removeIndex = app.todos.indexOf(this.todo);

            // 移除畫面上的元素
            app.todos.splice(removeIndex, 1);

        },
        edit() {

            // 同步表單上的資料
            app.todo.id = this.todo.id;
            app.todo.title = this.todo.title;
            app.todo.end_time = this.todo.end_time;

            app.showEditForm = true;
        }
    },
});

Vue.component('todo-list', {
    props: ['todos'],
    template: '#todoList',
});
// Todo list component end


let app = new Vue({
    el: '#app',
    data: {
        todoUrl: "/todos",
        // Modal controller
        showCreateForm: false,
        showEditForm: false,
        todos: [
            { id: 1, title: 'Line 1', end_time: '2019-08-20' },
            { id: 2, title: 'Line 2', end_time: '2019-08-20' },
            { id: 3, title: 'Line 3', end_time: '2019-08-20' },
        ],
        // 接收元件的資料並傳給另一個元件
        todo: { id: 0, title: '', end_time: '' }
    },
    mounted() {

        // 從 server 更新 todo list 資料
        sendRequest("get", this.todoUrl, '', res => {
            this.todos = res.data;
        });

    },
    methods: {
        createFormModal() {
            this.showCreateForm = !this.showCreateForm;
        },
        editFormModal() {
            this.showEditForm = !this.showEditForm;
        }
    },
});


/**
 *  Axios 整合包!
 *  
 *  @param string method ["get", "post", "put", "delete"]
 * 
 *  @param string url
 * 
 *  @param any data { key: "value"}
 * 
 *  @param string contentType 設定請求內容格式
 * 
 *  @param function whenSuccess 當接收到成功回應時使用的回呼函數
 *
 *  @param function whenError 錯誤回應時使用的回呼函數
 * 
 */
function sendRequest(
    method = "", url = "", data, whenSuccess,
    contentType = "application/json", whenError
) {
    switch (contentType.toLowerCase()) {
        case "application/json":
            data = JSON.stringify(data);
            break;
        default:
            // 轉換成 url-encoded 格式
            contentType = "application/x-www-form-urlencoded";
            data = Object.keys(data).map(key => key + '=' + data[key]).join('&');
            break;
    }

    const option = {
        method: method,
        url: url,
        headers: {
            "Content-Type": contentType
        },
        data: data
    }

    axios(option)
        .then(whenSuccess)
        .catch(whenError);
}