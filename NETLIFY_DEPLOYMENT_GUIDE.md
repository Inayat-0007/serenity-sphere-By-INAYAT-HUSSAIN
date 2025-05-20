# Deploying Your SerenityShpere Website to Netlify

## What's Been Updated
- The hero image has been changed from a generic gradient to a realistic meditation image that better represents your digital wellness platform
- A `netlify.toml` configuration file has been added to properly configure your deployment

## How to Deploy to Netlify

### Option 1: Direct from GitHub
1. Push your code to a GitHub repository
2. Log in to Netlify using your credentials:
   - Email: mohammadinayathussain552000@gmail.com
   - Password: @Inayat786Netlify
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub as your Git provider
5. Select your repository
6. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist/public`
7. Click "Deploy site"

### Option 2: Manual Deployment (Direct Upload)
1. Build the project locally:
   ```
   npm run build
   ```
2. Log in to Netlify using your credentials
3. Click "Add new site" → "Deploy manually"
4. Drag and drop the `dist/public` folder to the Netlify upload area
5. Your site will be deployed immediately

### Option 3: Using Netlify CLI
1. Install Netlify CLI globally (if not already installed):
   ```
   npm install -g netlify-cli
   ```
2. Log in to Netlify:
   ```
   netlify login
   ```
3. Link your project to Netlify:
   ```
   netlify init
   ```
4. Choose to create a new site or link to an existing one
5. Deploy your site:
   ```
   netlify deploy --prod
   ```

## Important Configuration Details
- The `netlify.toml` file in your project root contains the necessary configuration
- The site will be built using `npm run build` 
- The publish directory is set to `dist/public`
- URL redirects are configured to support your single-page application

After deploying, your wellness platform will be available at a Netlify URL, or you can configure a custom domain in the Netlify dashboard.