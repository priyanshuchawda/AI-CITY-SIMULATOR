# AI-Powered Virtual City Simulator

## Environment Setup

To run this project, you need to set up environment variables for each service. Follow these steps:

1. Navigate to each service directory:
   - `ai-city-simulator-backend/services/city-service`
   - `ai-city-simulator-backend/services/ai-service`
   - `ai-city-simulator-backend/services/economy-service`
   - `ai-city-simulator-backend/services/user-service`

2. In each directory, create a `.env` file based on the `.env.example` file.

3. Fill in the actual values for each environment variable in the `.env` files:

   ```javascript
   MONGODB_URI=mongodb://username:password@host:port/database
   POSTGRESQL_URI=postgresql://username:password@host:port/database
   NEO4J_URI=bolt://host:port
   NEO4J_USER=your_neo4j_username
   NEO4J_PASSWORD=your_neo4j_password
   ```

   Replace the placeholders with your actual database credentials and connection details.

4. Ensure that the `.env` files are listed in your `.gitignore` to prevent committing sensitive information.

These environment variables are crucial for connecting to the databases used in the project. Make sure they are correctly set before running any of the services.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

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

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
