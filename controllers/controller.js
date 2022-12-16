const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const {parse} = require('csv-parse');
const j2c = require('objects-to-csv');
const moment = require('moment');

const bookParser = () => {
    return fs.readFileAsync(path.join(__dirname, '../books.csv'),'utf-8')
    .then((data) => {
        return new Promise((resolve, reject) => {
            parse(data, {
                columns: true,
                delimiter: ';',
            }, (err, parsedData) => {
                if (err) {
                    return reject(err);
                }
                return resolve(parsedData);
            });
        })
    })
    .then((parsedBook) => {
        return parsedBook;
    })
}

const magazineParser = () => {
    return fs.readFileAsync(path.join(__dirname, '../magazines.csv'),'utf-8')
    .then((data1) => {
        return new Promise((resolve, reject) => {
            parse(data1, {
                columns: true,
                delimiter: ';'
            }, (err, parsedData1) => {
                if (err) {
                    return reject(err);
                }
                return resolve(parsedData1);
            });
        })
    })
    .then((parsedMagazine) => {
        return parsedMagazine;
    })
}

exports.readCsvFile = async (req,res) => {
    try {
        const books = await bookParser();
        const magazines = await magazineParser();
         res.json({
            message: 'success',
            books,
            magazines
        })
    } catch (err) {
        console.log("err",err)
        res.json({
            message: 'failure',
            errorMessage: 'Something went wrong'||err
        })   
    }
}

exports.findIsbnNo = async (req,res) => {
    try {
        const isbnNumber = req.params.isbn;
        const books = await bookParser();
        const magazines = await magazineParser();
        const isbnBook = books.filter((p) => {
            return p.isbn == isbnNumber;
        })
        const isbnMagazine = magazines.filter((p) => {
            return p.isbn == isbnNumber;
        })
        res.json({
            message:'success',
            isbnBook,
            isbnMagazine
        })
    } catch (err) {
        console.log("err",err)
        res.json({
            message: 'failure',
            errorMessage: 'Something went wrong'||err
        })  
    }
}

exports.findByEmail = async (req,res) => {
    try {
        const authorEmail = req.query.authorEmail;
        console.log("authoerEmail",authorEmail,typeof authorEmail)
        const books = await bookParser();
        const magazines = await magazineParser();
        const authorBooks = books.filter((p) => {
            return p.authors == authorEmail;
        })
        const authorMagazines = magazines.filter((p) => {
            return p.authors == authorEmail;
        })
        res.json({
            message:'success',
            authorBooks,
            authorMagazines
        })
    } catch (err) {
        console.log("err",err)
        res.json({
            message: 'failure',
            errorMessage: 'Something went wrong'||err
        })
    }
}

exports.addBookAndMagazine = async (req,res) => {
    try {
        let books,magazines;
        const mTitle = req.body.magazineTitle;
        const mIsbn = req.body.magazineIsbn;
        const mAuthor = req.body.magazineAuthor;
        const mPublishedAt = req.body.magazinePublishedAt;
    
        const bTitle = req.body.bookTitle;
        const bIsbn = req.body.bookIsbn;
        const bAuthor = req.body.bookAuthor;
        const bDescription = req.body.bookDescription;
        console.log("titleee",bTitle,bIsbn)
        books = await bookParser();
        magazines = await magazineParser();
        
        books.push({
            title: bTitle,
            isbn: bIsbn,
            authors: bAuthor,
            description: bDescription
        })
    
        magazines.push({
            title: mTitle,
            isbn: mIsbn,
            authors: mAuthor,
            publishedAt: mPublishedAt
        })

        let newBookArr = books.map((e) => {
            let obj = {};
            obj.title = e.title;
            obj.isbn = e.isbn;
            obj.authors = e.authors;
            obj.description = e.description;
            return obj;
        })

        let newMagazineArr = magazines.map((e) => {
            let obj = {};
            obj.title = e.title;
            obj.isbn = e.isbn;
            obj.authors = e.authors;
            obj.publishedAt = e.publishedAt;
            return obj;
        })
        console.log("newBookArr",newBookArr)
        const localFileLink = path.join(__dirname, `../uploads/${moment().unix()}`);
        const js2Csv = await new j2c(newBookArr);
        await js2Csv.toDisk(localFileLink);
        return res.download(localFileLink, function (err) {
            if (err) {
              console.log(err);
            }
            fs.unlink(localFileLink, (err) => {
              if (err) {
                logger.error(err, ' Error uploading file');
              }
            });
        });

    } catch (err) {
        console.log("err",err)
        res.json({
            message: 'failure',
            errorMessage: 'Something went wrong'||err
        })
    }

}