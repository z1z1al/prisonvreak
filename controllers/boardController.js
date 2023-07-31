const fs = require('fs');
const ejs = require('ejs');
const moment = require('moment');
const boardModel = require('../models/boardModel');

// 컨트롤러 함수
const boardController = {
  showList: (req, res) => {
    fs.readFile('views/board.html', 'utf8', (error, data) => {
      boardModel.getPosts((error, results) => {
        res.send(ejs.render(data, { data: results }));
      });
    });
  },

  deletePost: (req, res) => {
    const postNum = req.params.post_num;
    boardModel.deletePost(postNum, () => {
      res.redirect('/board');
    });
  },

  showInsertForm: (req, res) => {
    fs.readFile('views/boardInsert.html', 'utf8', (error, data) => {
      res.send(data);
    });
  },

  insertPost: (req, res) => {
    const body = req.body;
    const koreanTime = moment().format('YYYY-MM-DD HH:mm:ss');
    boardModel.insertPost(
      body.post_title,
      body.post_content,
      body.post_usernum,
      koreanTime,
      () => {
        res.redirect('/board');
      }
    );
  },

  showEditForm: (req, res) => {
    fs.readFile('views/boardEdit.html', 'utf8', (error, data) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      } else {
        const postNum = req.params.post_num;
        boardModel.getPostById(postNum, (error, result) => {
          if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
          } else {
            res.send(ejs.render(data, { data: result }));
          }
        });
      }
    });
  },

  updatePost: (req, res) => {
    const body = req.body;
    const koreanTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const postNum = req.params.post_num;
    boardModel.updatePost(
      body.post_title,
      body.post_content,
      koreanTime,
      postNum,
      () => {
        res.redirect('/board');
      }
    );
  },
};

const postController = {
  showList: (req, res) => {
    fs.readFile('views/post.html', 'utf8', (error, data) => {
      boardModel.getPosts((error, results) => {
        res.send(ejs.render(data, { data: results }));
      });
    });
  },

  showForm: (req, res) => {
    fs.readFile('views/postShow.html', 'utf8', (error, data) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      } else {
        const postNum = req.params.post_num;
        boardModel.getPostById(postNum, (error, result) => {
          if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
          } else {
            boardModel.incrementPostHit(postNum, (error) => { // 조회수 증가
              if (error) {
                console.error(error);
              }
              res.send(ejs.render(data, { data: result }));
            });
          }
        });
      }
    });
  },

  
}

module.exports = { boardController, postController};