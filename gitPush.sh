#!/bin/bash
hasGit=`which git` # 判断是否存在git
msg=${1:-'auto commit'} # 获取终端输入的第一个参数，若为空则为auto commit
if [ ! $hasGit ];then
  echo 'Please download git first!';
  exit 1;
else
  git remote update
  git fetch --all
  result=`git symbolic-ref --short -q HEAD` # 获取分支名
  current_id=`git log -n 1 origin/release --pretty=format:"%H"`
  git reset --soft $current_id
  git add .
  git commit -m "$msg"
  echo "curBranch $result"
  git push origin  -f $result # 提交代码到github(修改了远程项目名)
fi