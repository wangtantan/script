# Mac打开bash自动读取.bashrc配置

git_branch ()
{
  ref=$(git symbolic-ref HEAD 2> /dev/null) || return;
  echo "("${ref#refs/heads/}")"
}

# \[\033[1;32m\]染绿色\[\033[0m\]
PS1='\[\033[1;32m\]\h:\u \[\033[0m\]\w \[\033[1;32m\]$(git_branch)\[\033[0m\]\$ '
