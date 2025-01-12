// * look at line 39 *
const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// routes
const loginRouter = require('./routes/login');
const questionsRouter = require('./routes/questions');
// controllers
const authenticationController = require('./controllers/authenticationController.js');
const infoController = require('./controllers/infoController.js');


app.use(
  cookieSession({
    name: 'session-name',
    keys: ['key1', 'key2'],
  }),
  );
  
  
  app.use(passport.initialize());
  app.use(passport.session());
  app.use('/assets', express.static(path.resolve(__dirname, '../client/components/assets/')));
  app.use(express.static(path.join(__dirname, '../client/')));
  app.use('/login', loginRouter.router);
  // serve build.js
  app.use('/build', express.static(path.resolve(__dirname, '../build/')));
app.use('/questions', questionsRouter.router);

app.get('/profile', authenticationController.checkUserLoggedIn, (req, res) => res.status(200).sendFile(path.join(__dirname, '../client/index.html')));

app.get('/getUserInfo', infoController.getUserInfo);
app.get('/getCategories', infoController.getCategories);
app.get('/getCompanies', infoController.getCompanies);
app.post('/getQuestions', infoController.getQuestions, infoController.retrieveQuestions);

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  return res.redirect('/');
});

// app.post('/Messages', infoController.postMessageBoard, (req, res) => console.log('end of chain'));
app.use('/*', authenticationController.checkUserLoggedIn, (req, res) => res.status(200).sendFile(path.join(__dirname, '../client/index.html')));
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
