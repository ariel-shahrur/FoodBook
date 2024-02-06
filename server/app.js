require('dotenv').config()
var express = require('express');
var cors = require('cors');
const myRepository = require('./repository/myRepository');
const feedRouter = require('./routers/feed');
const favoriteRouter = require('./routers/favorite');
const cartRouter = require('./routers/cart');
const managementRouter = require('./routers/ManagementAccont');
const messagesRouter = require('./routers/messages');
const app = express();
app.use(express.json());
const authenticateMiddleware = require('./middleware/auth').authenticateMiddleware
app.use(cors({origins: ['http://127.0.0.1:3000','http://localhost:3000']}));
app.use('/feed', feedRouter);
app.use('/favorite', favoriteRouter);
app.use('/cart', cartRouter);
app.use('/management', managementRouter);
app.use('/messages', messagesRouter);
const multer = require('multer');
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('./uploads'));


app.get('/images/:recipeId',async (req,res)=>{
  const recipeId=req.params.recipeId;
  let arr= await myRepository.getAllImagesByRecipeId(recipeId);
  return res.send(arr);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Specify your upload directory
  },
  filename:async function  (req, file, cb) {
    let recipeId = req.headers.recipeid;
    await myRepository.insertImagesToDataBase(recipeId, file.originalname);
    cb(null,  file.originalname);
  }
});

const fileFilter = (req, file, cb) => {//check if all file that provide are imageType
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

app.post('/upload', upload.array('files'), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files provided' });
  }
});

app.post('/signup',async (req,res)=>{
    try {
        await myRepository.addCustomer(req.body);
        res.status(201).send('User added successfully');
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})

app.post('/login', async (req,res)=>{
    try {
        const user = await myRepository.costumerLogin(req.body.username,req.body.password);
        res.status(200).send(user);
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})

app.post('/uploadrecipe',authenticateMiddleware,async (req,res)=>{
    try {
        let recipeId=await myRepository.addRecipePost(req);
        res.status(201).json({recipeId:recipeId});
    }
    catch (err) {
        res.status(400).send({error: err.message});
    }
})



app.use(express.static('public'));
//=========================
const port = process.env.PORT || 3005;

app.listen(port, function () {
    console.log(`My app is listening on port ${port}!`);
});