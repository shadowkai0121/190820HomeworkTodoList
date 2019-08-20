Vue.component('edit-tag', {
    props: ['todo'],
    template: '#editTagForm',
    methods: {
        editTag(e) {
            e.preventDefault();

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
})

Vue.component('todo-item', {
    props: ['todo'],
    template: '#todoItem',
    methods: {
        remove() {

            sendRequest("DELETE", app.todoUrl, { id: this.todo.id });

            let removeIndex = app.todos.indexOf(this.todo);

            app.todos.splice(removeIndex, 1);

        },
        edit() {

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


let app = new Vue({
    el: '#app',
    data: {
        todoUrl: "/todos",
        showCreateForm: false,
        showEditForm: false,
        todos: [
            { id: 1, title: 'Line 1', end_time: '2019-08-20' },
            { id: 2, title: 'Line 2', end_time: '2019-08-20' },
            { id: 3, title: 'Line 3', end_time: '2019-08-20' },
        ],
        // 接收子組件的資料並傳給另一個組件
        todo: { id: 0, title: '', end_time: '' }
    },
    mounted() {
        axios.get('/todos')
            .then(res => {
                this.todos = res.data;
            })
            .catch(err => {
                console.log(err);
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
 */

function sendRequest(
    method, url, data, whenSuccess,
    contentType = "application/json", whenError
) {
    switch (contentType.toLowerCase()) {
        case "application/json":
            data = JSON.stringify(data);
            break;
        default:
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
