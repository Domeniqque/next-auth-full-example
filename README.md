# Next authentication with an existent backend

> Based on [this Rocketseat example](https://github.com/rocketseat-education/ignite-reactjs-next-auth-jwt)

This examples shows how we can handle with all the authentication flows with Next. It's includes:

- login
- logout
- token rotation (aka refresh tokens)
- validate user roles and permissions
- retry the requests that are failed while the application was revalidating the token.

## Instructions

First clone and try to run the [backend mock](https://github.com/rocketseat-education/ignite-reactjs-auth-backend):

```bash
git clone git@github.com:rocketseat-education/ignite-reactjs-next-auth-jwt.git
yarn && yarn dev
```

After, install all dependencies using yarn and run the next application.

```bash
git clone git@github.com:Domeniqque/next-auth-full-example.git
yarn && yarn dev
```

Finally, try sign in using the credentials in server [database.ts file](https://github.com/rocketseat-education/ignite-reactjs-auth-backend/blob/master/src/database.ts).
