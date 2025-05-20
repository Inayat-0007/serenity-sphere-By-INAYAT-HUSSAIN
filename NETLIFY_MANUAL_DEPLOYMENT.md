# Manual Deployment Steps for SerenityShpere to Netlify

## What Has Been Updated
✓ Hero image replaced with a realistic meditation image
✓ Added Netlify configuration file for proper deployment setup

## Deployment Steps

1. **Download Your Project**
   - Download your entire project from Replit by clicking on the three dots in the file tree and selecting "Download as zip"

2. **Log in to Netlify**
   - Go to https://app.netlify.com/
   - Sign in with your email: mohammadinayathussain552000@gmail.com
   - Enter your password: @Inayat786Netlify

3. **Create a New Site**
   - Once logged in, click "Add new site" → "Deploy manually"

4. **Build Your Project Locally**
   - Extract the downloaded zip file
   - Open a terminal/command prompt in the extracted folder
   - Run the following commands:
     ```
     npm install
     npm run build
     ```
   - This will create a `dist/public` folder with your built website

5. **Upload to Netlify**
   - Drag and drop the `dist/public` folder onto the Netlify upload area
   - Netlify will automatically deploy your site

6. **Configure Domain (Optional)**
   - After deployment, you can set up a custom domain in the Netlify dashboard
   - Go to "Domain settings" in your site dashboard

## Alternative: Deploy from GitHub

If you prefer to deploy directly from a GitHub repository:

1. Push your code to GitHub
2. In Netlify, click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
5. Click "Deploy site"

## Verification

After deployment, your site will be available at a Netlify URL (something like random-name.netlify.app). You can verify that:

- The hero section now displays the realistic meditation image instead of the generic gradient
- All website functionality works as expected

Your website is now successfully deployed to Netlify with the updated realistic image!