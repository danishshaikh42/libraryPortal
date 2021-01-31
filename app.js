const http = require('http');
const con = require('./modules/database/databaseConnector');
const responseGenerator = require('./utils/responseGenerator');
const config = require('./config');

http.createServer((request, response) => {
    const { headers, method, url } = request;
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();

        response.on('error', (err) => {
            console.error(err);
        });

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');

        const responseBody = { headers, method, url, body };

        //Create a Book
        if (responseBody.url == "/createBook") {
            let bookDetails = JSON.parse(responseBody.body);
            let author = bookDetails.author;
            let title = bookDetails.title;
            let isbn = bookDetails.isbn;
            let releaseDate = bookDetails.releaseDate;

            let queryToInsertBookDetails = "INSERT INTO mstBook SET author = ?, title = ?, isbn = ?, releaseDate = ?";
            let values = [author, title, isbn, releaseDate];
            con.query(queryToInsertBookDetails, values, (errQueryToInsertBookDetails, resQueryToInsertBookDetails) => {
                if (!errQueryToInsertBookDetails) {
                    res.write(responseGenerator.getResponse(200, "Book Details Inserted successfully!!!", null));
                } else {
                    res.write(responseGenerator.getResponse(500, "Failed to process your request", null));
                }
            });
        } else if (responseBody.url == "/readBooks") {
            let queryToReadBookDetails = "SELECT author, title, isbn, releaseDate FROM mstBooks WHERE isDeleted = 0";
            con.query(queryToReadBookDetails, values, (errQueryToReadBookDetails, resQueryToReadBookDetails) => {
                if (!errQueryToReadBookDetails) {
                    res.write(responseGenerator.getResponse(200, "Book Details shown successfully!!!", null));
                } else {
                    res.write(responseGenerator.getResponse(500, "Failed to process your request", resQueryToReadBookDetails));
                }
            });
        } else if (responseBody.url == "/updateBooks") {
            let queryToUpdateBookDetails = "UPDATE mstBooks SET author = ?, title = ?, isbn = ?, releaseDate = ?";
            con.query(queryToUpdateBookDetails, values, (errQueryToUpdateBookDetails, resQueryToUpdateBookDetails) => {
                if (!errQueryToUpdateBookDetails) {
                    res.write(responseGenerator.getResponse(200, "Book Details updated successfully!!!", null));
                } else {
                    res.write(responseGenerator.getResponse(500, "Failed to process your request", null));
                }
            });
        }
        else if (responseBody.url == "/deleteBook") {
            let bookDetails = JSON.parse(responseBody.body);
            let bookId = bookDetails.bookId;
            let queryToDeleteBook = "DELETE FROM mstBooks SET isDeleted = 1 WHERE id = ?";
            con.query(queryToDeleteBook, bookId, (errQueryToDeleteBook, resQueryToDeleteBook) => {
                if (!errQueryToDeleteBook) {
                    res.write(responseGenerator.getResponse(200, "Book deleted successfully!!!", null));
                } else {
                    res.write(responseGenerator.getResponse(500, "Failed to process your request", null));
                }
            });
        } else {
            response.write("Invalid URL");
            response.end();
        }
    });
}).listen(config.port);
