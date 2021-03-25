# Development Environment Setup

## Downloads 
First download the following:

 - https://code.visualstudio.com/
 - https://nodejs.org/en/
 - https://desktop.github.com/ (Optional, command line git will also work)

# Installation
First install Visual Studio Code, and Node.js.
Once you have them both installed, open up a Command Line or terminal.

Run the following command to update NPM  (Node Package Manager) to support NPX.

   ```
npm install -g npm
```

This will allow you to create react apps directly, but you should be able to pull ours from the repo.

You may also want to navigate to the extensions in VS Code, and install the "Node Debug" extension for debugging support.
https://marketplace.visualstudio.com/items?itemName=ms-vscode.node-debug2

Finally, install GitHub desktop.
Once installed, open, and select File> Clone Repository.
You will need to log in with your GitHub user information, and you will see the project listed below "Your Repositories".

If you don't see it there, select "URL", and paste the following.
https://github.com/Aj-Jones/CS441Project

If you don't have access to the repo, please let me know.

Once the repository clones, you are setup!

# Project Management 
Ensure that we follow git flow branching structure

![Git Flow Diagram](https://www.campingcoder.com/post/20180412-git-flow.png)


We will be primarily pushing to feature branches, and consolidating on Develop.
Master will only be used for stable "release" versions.
