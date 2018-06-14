import express from 'express';
import PythonShell from 'python-shell';
import multer from 'multer';
import serverRender from './serverRender';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import config from './config';


const server  = express();

server.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public')
}));  

server.set('view engine', 'ejs');

const upload = multer({
  dest:'images/', 
  limits: {fileSize: 1000000, files: 2},
  fileFilter:  (req, file, callback) => {
    // console.info(file);
    if (!file.originalname.match(/\.(jpg|jpeg)$/)) {

      return callback(new Error('Only Images are allowed !'), false);
    }

    callback(null, true);
  }
});

server.get('/', (req, res) => {
  serverRender().then(({initialMarkup, initialData}) => {
    res.render('index', {
      initialMarkup,
      initialData
    });
  }).catch(console.error);
});

server.post('/images/upload',upload.fields([{ name: 'src_file', maxCount: 1 }, { name: 'target_file', maxCount: 1 }]), (req, res) => {
  // console.info(JSON.stringify(req.fields));
  // console.info(req.body);
  // console.info(req.files);
  let srcImgpath = `images/${req.files.src_file[0].filename}`;
  let targetImgPath = `images/${req.files.target_file[0].filename}`;
  let new_file_name = `${req.files.src_file[0].filename}_${req.files.target_file[0].filename}.mp4`;

  let options = {
    mode: 'text',
    pythonPath: config.pyEnvPath,
    scriptPath: config.pyScriptPath,
    args: [srcImgpath,targetImgPath,`${config.pyScriptPath}/shape_predictor_68_face_landmarks.dat`, `public/${new_file_name}`]
  };

  PythonShell.run('face_morph.py', options, function (err, results) {
    if (err) throw err;
    // results is an array consisting of messages collected during execution
    console.info('results: %j', results);
    res.send(`${config.serverUrl}/${new_file_name}`);
    // res.sendFile('morph_video.mp4', {root: path.join(__dirname, 'public')});
    // res.status(200).json({
    //     message: 'Image Uploaded Successfully !', 
    //     srcPath: srcImgpath, 
    //     pyResult: results,
    //     targetPath: targetImgPath
    // });
  });
  
});
    




server.use(express.static('public'));

server.listen(config.port, config.host, () => {
  console.info(`Listening on port ${config.host}:${config.port}`);
});
  