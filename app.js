// 以 Express 建立 Web 伺服器
var express = require("express");
var app = express();

// 允許跨域使用本服務
var cors = require("cors");
app.use(cors());


// 以 body-parser 模組協助 Express 解析表單與JSON資料
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Web 伺服器的靜態檔案置於 public 資料夾
app.use(express.static("public"));

// 以 express-session 管理狀態資訊
// var session = require('express-session');
// app.use(session({
// 	secret: 'secretKey',
// 	resave: false,
// 	saveUninitialized: true
// }));

// 指定 esj 為 Express 的畫面處理引擎
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);
// app.set('views', __dirname + '/view');

// 一切就緒，開始接受用戶端連線
app.listen(80);
console.log("Web伺服器就緒，開始接受用戶端連線.");
console.log("「Ctrl + C」可結束伺服器程式.");

// 建立資料庫連線
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '',
	database: 'homework'
});

connection.connect(function (err) {
	// if (err) throw err;
	if (err) {
		console.log(JSON.stringify(err));
		return;
	}
});

// 依 HTTP 的 Method (POST/GET/PUT/DELETE) 進行增查修刪

app.get("/todos", function (request, response) {

	connection.query('select * from todo_list ORDER BY end_time DESC',
		'',
		function (err, rows) {
			if (err) {
				console.log(JSON.stringify(err));
				return;
			}

			response.send(JSON.stringify(rows));
		}
	);

})


app.post("/todos", function (request, response) {
	connection.query(
		"insert into todo_list set title = ?, end_time = ?",
		[
			request.body.title,
			request.body.end_time
		]
	);

	response.send(JSON.stringify(request.body));

})


app.put("/todos", function (request, response) {

	connection.query(
		"update todo_list set title = ?, end_time = ? where id = ?",
		[
			request.body.title,
			request.body.end_time,
			request.body.id
		]);

	response.send(JSON.stringify(request.body));

})


app.delete("/todos", function (request, response) {

	connection.query(
		"delete from todo_list where id = " + request.body.id,
		[]
	);

	response.send(JSON.stringify(request.body));

})

