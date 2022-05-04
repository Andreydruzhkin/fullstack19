const http = require("http");
const mysql = require("mysql2");                        //Запрвшиваем базу

http.createServer(function(request, response){
    let data = [];
    let result;
    request.on("data", chunk => {
        data.push(chunk);                               //складываем кусочки в массив
    });
    request.on("end", () => {
        if(data.length) {                               //проверка что не нулевая длина массива      
            data = Buffer.concat(data).toString();      //превращаем data в строку
            let g = new URLSearchParams(data);          //делает ключ значение из параметров
            result = Object.fromEntries(g);             //обращаемся к объекту и передаем параметр g
            console.log(result);                        //получаем объект - результат

            const connection = mysql.createConnection({       //объект для подключения к базе данных
                host: "localhost",                            //внутрь передаем объект с параметрами
                user: "root",
                database: "fullstack19",
                password: ""                                  //пароль от сервера, он пустой
            });
            connection.connect(function (err) {               //метод connect c калбэк ф-цией, которая будет выдавать ошибку
                if (err) {
                    return console.error(err.message);
                } else
                    console.log("success");
            });
            connection.query("SELECT id FROM users WHERE email=?", [result.email], function (err, res){ //отправляем запрос в БД методом query
                if(res.length){console.log("exist")}                                                    //
                else{
                    const user = [result.name, result.lastname, result.email, result.pass];             
                    connection.query("INSERT INTO `users`(`name`, `lastname`, `email`, `pass`) VALUES (?,?,?,?)", user,
                        function (error, result, metadata) {
                            console.log(error);
                            console.log(result);
                        })
                }
            })
        }
        response.end("Данные успешно получены");
    });
}).listen(3000);