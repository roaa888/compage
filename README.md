# Compage - A Spargo.js Framework

An opinionated and simple framework with Spargo.js built in - providing sane
defaults to get any developer started on building their next big idea.

### Getting Started

___

#### Development
To get started with development, follow these steps: 

1. Make sure you have [bun](https://github.com/oven-sh/bun) installed - 
a lightning fast node replacement with amazing memory management.
2. Make sure you have node installed (to build assets).
3. Clone this repo.
4. cd into the newly cloned directory.
5. Run this command:

```bash
bun install
```

6. Then build the assets with this command:

```bash
bun run start
```

7. Then start the server with this command:

```bash
bun run dev
```

8. Open http://localhost:3000/ with your browser to see the site!

___

### Directory Structure

* public - Is automatically served to the front end and is used to host assets.
* src
  * api - Holds all the api endpoints, automatically available at /api/*.
  * handlers - Holds all the route handlers for routes that have params.
  * layouts - Holds all the layout files.
  * resources - Holds all the JavaScript and CSS for the frontend.
  * routes - Holds all the routes.
* index.ts - The server starting point.
* utils.ts - Helper file.

___

### Routing

Compage uses file based routing, and currently there are 3 different ways of setting up a route:

1. Regular get route: just create a new html file in the routes directory and the name of the file will become the path. Of course, if a long path is required with multiple segments, then just create an underscore (_) delimited string of all the segments (i.e. deeply_nested_route.html will be made available at /deeply/nested/route).
2. A route with any number of parameters: This follows the same process as a get route, but any segment with a param should have a colon (:) put before the name (i.e. blog_:post.html to be available at /blog/:post). Then, a handler file must be created in the handlers directory with the same name, but ending in .ts (i.e. blog_:post.ts). In this TypeScript file should be a single exported handler method that will then have all the params passed into it.
3. An API route. Simply create a TypeScript file in the api directory with the following 3 things exported:
   1. type - The type of request (i.e. get, post, push, delete, etc.).
   2. path - The path that the api route should be available at (remember, params should have a colon (:) before them).
   3. handler - The method that will be called when a user calls the route.

___

### Templating

#### *Coming Soon*

___

### Handling User Provided Data

#### *Coming Soon*

___

### CSP Management

#### *Coming Soon*

___

### Using Spargo.js

#### *Coming Soon*

___

### Deployment

#### *Coming Soon*

___

### Docs Site

#### *Coming Soon*