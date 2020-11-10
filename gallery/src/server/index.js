const express = require('express');
const os = require('os');

const app = express();

app.use(express.static('dist'));
app.get('/api/getUsername', (req, res) => res.send({ username: os.userInfo().username }));


const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({extended:true}))

var fs = require('fs')



app.post('/api/authenticate', (req, res) => {
	// if(req.body.username == 'username' && req.body.password == 'password')

	// if()

	if(req.body.password == 'password')
		res.send({ success: true })
	else 
		res.send({ success: false })
})


const multer = require('multer');
const storage = multer.diskStorage(
    {
        destination: function ( req, file, cb ) { if(!fs.existsSync(__dirname + '/uploads/images/'+req.body.username))
        											fs.mkdirSync(__dirname + '/uploads/images/'+req.body.username)
        										  cb(null, __dirname + '/uploads/images/'+req.body.username) },
        filename: function ( req, file, cb ) { cb( null, file.originalname) }
    }
);
const upload = multer( { storage: storage } );



app.post('/api/upload', upload.single('photo'), (req, res) => {
	console.log('request body username is: ' + req.body.username)
    res.send({ success: true });
});


app.post('/api/fetchImageList', (req, res) => {
	let username = req.body.username 
	let fileList = []
	if(fs.existsSync(__dirname + '/uploads/images/'+username))
	{
		fs.readdir(__dirname + '/uploads/images/'+username, (err, files) =>{
			files.forEach(file => {
				console.log(file)
				fileList.push(file)
			})

			console.log('filelist length: ' + fileList.length)

			res.send({success: true, files: fileList})
		})
	}
})


app.post('/api/fetchImage', (req, res) => {
	res.sendFile(__dirname + '/uploads/images/'+req.body.username+'/'+req.body.fileName)
	// res.send({ data: 'hi' })
})



app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));







