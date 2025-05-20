# Pushing Your SerenityShpere Project to GitHub

## Step 1: Download Your Project
- Click on the three dots (⋮) in the file explorer
- Select "Download as ZIP"
- Save the ZIP file to your computer
- Extract the ZIP file to a folder on your computer

## Step 2: Create a GitHub Repository
- Go to [GitHub](https://github.com)
- Log in to your account
- Click on the "+" icon in the top right corner
- Select "New repository"
- Name your repository (e.g., "serenity-sphere")
- Add a description (optional)
- Choose whether to make it public or private
- Click "Create repository"

## Step 3: Upload Your Project to GitHub
There are two ways to do this:

### Option 1: Using Git Commands
1. Open a terminal or command prompt
2. Navigate to your extracted project folder:
   ```bash
   cd path/to/extracted/folder
   ```
3. Initialize a Git repository:
   ```bash
   git init
   ```
4. Add all files to the repository:
   ```bash
   git add .
   ```
5. Commit the changes:
   ```bash
   git commit -m "Initial commit"
   ```
6. Add your GitHub repository as a remote:
   ```bash
   git remote add origin https://github.com/yourusername/serenity-sphere.git
   ```
   (Replace "yourusername" with your GitHub username and "serenity-sphere" with your repository name)
7. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```
   (If you're using an older version of Git, you might need to use `master` instead of `main`)

### Option 2: Using GitHub's Upload Feature
1. Go to your new repository on GitHub
2. Click on "uploading an existing file" link
3. Drag and drop all the files and folders from your extracted project
4. Add a commit message
5. Click "Commit changes"

## Step 4: Verify Your Repository
- Check that all your files have been uploaded correctly
- Make sure there are no sensitive credentials exposed in your code

## Step 5: Deploy from GitHub to Netlify
Now that your code is on GitHub, you can easily deploy to Netlify:
1. Go to [Netlify](https://app.netlify.com/)
2. Log in with your account (mohammadinayathussain552000@gmail.com)
3. Click "Add new site" → "Import an existing project"
4. Select GitHub as your Git provider
5. Authorize Netlify to access your GitHub account if prompted
6. Select your repository (serenity-sphere)
7. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
8. Click "Deploy site"

Your SerenityShpere website with the updated meditation image will now be deployed from your GitHub repository to Netlify!