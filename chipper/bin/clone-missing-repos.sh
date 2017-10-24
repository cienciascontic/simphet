#!/bin/bash
#
# Clones all missing repos
#
if [ -d ./chipper ];
then
   repos=(`comm -23 <(sort -u ./chipper/bin/data/active-repos) <(/bin/ls -1 .)`)
   for repo in "${repos[@]}"
   do
      git clone git@github.com:phetsims/"$repo".git
   done
else
   echo "I don't see chipper. Are you running this script in your working directory?"
fi
