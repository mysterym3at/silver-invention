
# mysterym3at.github.io

#  Cloudflare DB 


## Schema:
### Applying the Schema
Apply to local:

`cd api`
`npx wrangler d1 execute vendula_bags_db --local --file=schema.sql`

Apply to remote:

`npx wrangler d1 execute vendula_bags_db --remote --file=schema.sql`

## Get Production Backup

Export from Production
`npm run backup`

## SYNC to prod

Export from Production
`npx wrangler d1 export "vendula-bags-db" --remote --output=production_backup.sql`

Import to local
`npx wrangler d1 execute "vendula-bags-db" --local --file=production_backup.sql`

## Update Table Config Schema
### Add Columns

### Delete Columns

### Update Columns

## Update/Launch DB Tables Changes - API 

### Update



### Insert


### Delete

## Clear SQL Files

### Individually
`> api/sql/{TABLE}/{FILE}`

### By REST Type

### By TABLE


### All 
`npm run clear-sql`

## 

`npx wrangler d1 execute "vendula-bags-db" --local --file=production_backup.sql`


## Deploy after Changes: Whenever you update wrangler.toml, you must re-deploy your worker for the new bindings to take effect on the production network:

Run this from the api/ folder
`npx wrangler deploy`

Local Development: When running npx wrangler dev, Wrangler automatically reads this wrangler.toml and maps your local D1 SQLite database to the DB binding, allowing you to test exactly as it will run in production.

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## *Run if react-scripts is causing errors starting *
### `npm install react-scripts --save-dev`

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)



