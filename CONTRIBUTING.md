# Contributing

We'd love for you to contribute and to make this project even better than it is today! If this interests you, please make sure to follow the steps below before creating a Pull Request.

Before accepting any Pull Request, we would like to remind you to follow the following steps:

1. Install all dependencies
```sh
npm install
```

2. Run a full build
```sh
npm run build:prod
```

3. Fix any Linting or TypeScript issues (if any) returned by the build process

4. Run all Cypress E2E tests
```bash
npm run dev         # run a local development server on port 8080 in watch mode (or `npm run serve` without watch)
npm run cypress     # open Cypress UI tool
```

5. If you completed step 2 and 3, then the final step would be to proceed with your Pull Request
   - **NOTE** even though the `dist/` folder is included in Git for portability, you could choose (we actually strongly recommend) that you ignore/disregard these files from being included in your Pull Request.
