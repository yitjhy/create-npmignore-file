#! /usr/bin/env node

const inquirer = require('inquirer');
const fs = require('fs');
const _ = require('ramda');

const basePath = './';

const getNpmIgnoreFileData = () => {
  return `.*.swp
  ._*
  .DS_Store
  .git
  .hg
  .npmrc
  .lock-wscript
  .svn
  .wafpickle-*
  config.gypi
  CVS
  npm-debug.log
  .idea
  .history
  **/*.md`
}

const writeInFile = (path, content) => {
  const dirPath = path.substring(0, path.lastIndexOf('/'));
  if (fs.existsSync(dirPath)) {
    fs.writeFile(path, content, () => {
      console.log('写入成功');
    })
  } else {
    fs.mkdir(dirPath, {recursive: true}, () => {
      fs.writeFile(path, content, () => {
        console.log('创建成功');
      })
    })
  }
  return true;
}

const start = async () => {
  const promptList = [
    {
      type: 'list',
      message: '请选择发布的环境:',
      name: 'env',
      choices: [
        "公网",
        "内网",
      ],
    }
  ];
  const { env } = await inquirer.prompt(promptList);
  console.log(env);
  if (env === '内网') {
    const httpPath = `${basePath}/.npmignore`;
    const writeInHttpFile = _.curry(writeInFile)(httpPath);
    _.compose(writeInHttpFile, getNpmIgnoreFileData)();
  } else {
    fs.unlinkSync('./.npmignore');
  }
}

start().then();