# Forge Configurator Inventor
Demo application showcasing Configuration with Design Automation for Inventor

## Architecture
See [high level diagram](architecture.png)

## Prerequisites

### Web Application 
1. .NET Core 3.1
1. Node.js
1. (recommended) Visual Studio Code with extensions:
    * [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome) (for debugging client side code)
    * [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
    * [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
### App Bundles
1. Autodesk Inventor 2021
1. Visual Studio 2019

## Setup
1. Create a forge app at https://forge.autodesk.com/, and select the Design Automation V3 API
1. Put https://localhost:5001 as callback URL.
1. Note the Client ID and Secret generated.
1. Clone repository
1. Specify [forge credentials](#specify-forge-credentials).
1. Copy AppBundles\ExtractParametersPlugin\InventorBinFolder.props.template file to AppBundles\ExtractParametersPlugin\InventorBinFolder.props
1. Replace PATH_TO_YOUR_INVENTOR_BIN string in the AppBundles\ExtractParametersPlugin\InventorBinFolder.props with your actual Inventor's bin folder
1. Specify if access should be limited in `WebApplication\appsettings.json`. Set `Enabled` to `true` or `false`, and populate the `Domains` and `Addresses` fields with comma delimited lists such as `["autodesk.com", "company.com"]` and `["person@company2.com", "person@company3.com"]`.

## Build
* Building the projects also installs required packages (this can take several minutes).
### App Bundles
* Open the `forge-configurator-inventor.sln` file with Visual Studio 2019 and build the solution.
* You may need to copy `C:\Program Files\Autodesk\Inventor 2021\Bin\Public Assemblies\Autodesk.Inventor.Interop.dll` to `<repository_root>\packages\autodesk` if you have compiler errors.
### Web Application
* From a command prompt, go to the `WebApplication` directory, and run `dotnet build`.

## Run The Web Application Without Debugging

1. From a command prompt, go to the `WebApplication` directory, and run `dotnet run`
1. Open https://localhost:5001

### Clear and load initial data during app launch time

 - Create initial data: from the `WebApplication` directory, run `dotnet run initialize=true`
 - Clear data: from the `WebApplication` directory, run `dotnet run clear=true`
 - Clear and then load initial data: from the `WebApplication` directory, run `dotnet run initialize=true clear=true`

## Debug The Web Application With VS Code

1. Open the repository root folder in VS Code
1. In the Run tab, select the `Server/Client` configuration and click the "Start Debugging" (arrow) button
    * You may need to refresh the browser after it launches if you see the error `This site can't be reached`
    * If you see the error `Your Connection is not private`, click `Advanced` and then `Proceed to localhost (unsafe)`. This is due a development certificate being used.

## Run/Debug Tests
### Backend
* Note that running the tests clears initialization data, so you will either need to change forge credentials before running them, or run the initializer again afterward. See [Clear and load initial data...](#clear-and-load-initial-data-during-app-launch-time)
1. From Visual Studio 2019
    * Open Test Explorer and select tests to run or debug
1. From Visual Studo Code
    * Open a test file in the `WebApplication.Tests` directory and click on either `Run Test` or `Debug Test` above one of the methods decorated with the `[Fact]` attribute. Or, above the class declaration click on either `Run All Tests` or `Debug All Tests`
1. From the command line, in either the root or `WebApplication.Tests` directory run `dotnet test`
### Frontend
1. In Visual Studio Code, on the Run tab, select the `Debug Jest All` configuration and click the "Start Debugging" (arrow) button
1. Alternatively, using the command line go to WebApplication/ClientApp and execute `npm test`
### UI Tests
* For UI tests we are using `CodeCeptJs` framework. All tests are stored in `ClientApp/src/ui-tests/` and we filter all files end with `*_test.js`. 
* Set environment variables `SDRA_USERNAME` and `SDRA_PASSWORD` for `Sign-in` workflow. We are using Autodesk Account credentials for `Sign-in`.
    * Also you can create `.env` file in this location `WebApplication/ClientApp` to define the environment variables - for more details follow this link https://www.npmjs.com/package/dotenv
* Note that the server needs to be running for these tests

1. From the `WebApplication/ClientApp` directory:
    * For all UI tests Run this command: `npx codeceptjs run` or `npm run uitest`.
    * For particular file you can use this command: `npx codeceptjs run src/ui-tests/<test file name>`

# Additional Information
## Specify Forge credentials
Use one of the following approaches:
* Set environment variables `FORGE_CLIENT_ID` and `FORGE_CLIENT_SECRET`.
* Create `appsettings.Local.json` in the `WebApplication` directory and use the following as its content template:
```json
{
    "Forge": {
        "clientId": "<YOUR CLIENT ID>",
        "clientSecret": "<YOUR CLIENT SECRET>"
       }
}
```
* Set environment variables `Forge__ClientId` and `Forge__ClientSecret`.
* _(not on dev machine)_ Modify `appsettings.json` (or `appsettings.<ENVIRONMENT>.json`) with the template above.

## Backend
We are using the forge service on the backend https://forge.autodesk.com/

### .NET Core
We are using the latest version of .NET Core (3.1 at the time of writing) https://dotnet.microsoft.com/download/dotnet-core/3.1

The project was initally created using the command `dotnet new react`

### Forge Design Automation
https://forge.autodesk.com/en/docs/design-automation/v3/developers_guide/overview/

C# SDK https://github.com/Autodesk-Forge/forge-api-dotnet-design.automation

We are using the Inventor and Revit engines.

### OSS
Used for storing your designs. For communication with Forge Design Automation

https://forge.autodesk.com/en/docs/data/v2/developers_guide/overview/

C# SDK https://github.com/Autodesk-Forge/forge-api-dotnet-client

## Client app

### React
https://reactjs.org/

### Redux
https://redux.js.org/

We are using redux-thunk for complex and asynchronous operations https://github.com/reduxjs/redux-thunk

#### Redux DevTool
In `index.js` replace
```js
const store = createStoreWithMiddleware(mainReducer);
```
with
```js
const store = createStoreWithMiddleware(mainReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
```

### Autodesk HIG React

https://github.com/Autodesk/hig

Table is not part of todays React HIG implementation so we will use https://github.com/Autodesk/react-base-table

## How to

### Add npm package to project

We are using npm.

1. Using command line go to WebApplication/ClientApp and run `npm install <package>`
    * Note that packages are normally installed as part of the build, but only if the `npm_modules` directory is not found. This means that when new packages are added, `WebApplication/ClientApp/npm install` needs to be run again manually by other users (who did not add the new package).

### Manually run linter
* For JavaScript code: `npm run lint`
* For CSS: `npm run lint-css`

### Suppress pre-commit hook
Use `--no-verify` command line option for git.
