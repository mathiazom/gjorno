# 🤝 API reference

The API is available at [`localhost:8000/api`](http://localhost:8000/api). Accessing this URL in the browser will present the [Browsable API](https://www.django-rest-framework.org/topics/browsable-api/). Like the admin site, it's a useful tool for testing requests and inspecting the structure of the API.

🚧 Some requests require the url to end with a `/`, so make sure you have used the exact format shown here.

### Authorization
🔑 Most requests require a logged in user. This is handled by including a `Authorization` header in the request:
```
Authorization: Token {token}
```
where `{token}` is the authentication token returned on login/registration (see below).

Using `axios`, you can set the default token (on register/login/logout) like this:
```javascript
axios.defaults.headers.common['Authorization'] = `Token ${token}`;
```
All subsequent requests will then include this header.

🌟 The authorization token should be stored in the browser as long as the user is supposed to be logged in. This can be done with [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

🚧 Remember to remove the token when you want the user to be logged out!

## Register a new user
#### `POST localhost:8000/auth/register/`

Example request body (`email` is optional)
```json
{
    "username": "friedrich",
    "password1": "gf6vWucmrP5T2Vsf",
    "password2": "gf6vWucmrP5T2Vsf",
    "email": "friedrich@anwendungen.de",
    "phone_number": "+4956922484"
}
```
A valid request will receive a reponse with the users *authentication token*:
```json
{
    "key": "fedeaaf95f2326139bb04605eaf6a5767832bbb1"
}
```
This token will be needed for requests where a logged in user is required (see below).


## Log in user
#### `POST localhost:8000/auth/login/`

Example request body
```json
{
    "username": "friedrich",
    "password": "gf6vWucmrP5T2Vsf"
}
```
A valid request will receive a reponse with the users *authentication token* (see above)

## Retrieve all activities
#### `GET localhost:8000/api/activities/`
Expects no request body

Example response for a valid request to database with three activities:
```json
[
    {
        "id": 22,
        "title": "Walk around the lake",
        "description": "I think this is a a great walk",
        "user": 12,
        "categories": [
            14
        ]
    },
    {
        "id": 23,
        "title": "Football at 9",
        "description": "Would be great to get teams of around 7",
        "user": 12,
        "categories": [
            14
        ]
    },
    {
        "id": 24,
        "title": "Squash",
        "description": "Need a squash partner",
        "user": 14,
        "categories": [
            16
        ]
    }
]
```

## Retrieve activities of currently logged in user
#### `GET localhost:8000/api/my_activities/`
🔑 Requires the `Authorization` header (see [above](#authorization))

Expects no request body

Example response for a valid request to database where logged in user has `id=12`:
```json
[
    {
        "id": 22,
        "title": "Walk around the lake",
        "description": "I think this is a a great walk",
        "user": 12,
        "categories": [
            14
        ]
    },
    {
        "id": 23,
        "title": "Football at 9",
        "description": "Would be great to get teams of around 7",
        "user": 12,
        "categories": [
            145
        ]
    }
]
```

## Retrieve single activity (with `id={id}`)
#### `GET localhost:8000/api/activities/{id}/`

Expects no request body

Example response for a valid `id`, here with `id=22`
```json
{
    "id": 22,
    "title": "Walk around the lake",
    "description": "I think this is a a great walk",
    "user": 12,
    "categories": [
        14
    ]
}
```


## Create an activity
#### `POST localhost:8000/api/activities/`
🔑 Requires the `Authorization` header (see [above](#authorization))

Example request body
```json
{
    "title": "Dolore magna aliquyam erat voluptua",
    "description": "At vero eos et accusam et justo duo dolores et ea rebum.",
    "categories": [16]
}
```
where `"categories"` is a list of available category `id`s (not yet available from API).

🚧 Notice that no user id is provided. This is automatically attached in the backend based on the authentication token!

If activity was successfully created, the respone body will contain the new activity.


## Update an existing activity (with `id={id}`)
#### `PUT localhost:8000/api/activities/{id}/`

🔑 Requires the `Authorization` header (see [above](#authorization))

Example request body (same as for `POST`)
```json
{
    "title": "Dolore magna aliquyam erat voluptua",
    "description": "At vero eos et accusam et justo duo dolores et ea rebum.",
    "categories": [16]
}
```
If activity was successfully updated, the respone body will contain the updated activity.


## Update a subset of attributes of an existing activity (with `id={id}`)
#### `PATCH localhost:8000/api/activities/{id}/`
> Differs from `PUT` by not requiring all attributes to be updated

🔑 Requires the `Authorization` header (see [above](#authorization))

Example request body (updates only `title` and `categories`, keeps original `description`)
```json
{
    "title": "Dolores et ea rebum",
    "categories": [15]
}
```

## Retrieve all categories
#### `GET localhost:8000/api/categories/`
Expects no request body

Example response for a valid request to database with two categories:
```json
[
  {
    "id": 1,
    "title": "Dolor"
  },
  {
    "id": 2,
    "title": "Amet"
  }
]
```

## Retrieve all users
#### `GET localhost:8000/api/users/`
Expects no request body

Example response for a valid request to database with three users:
```json
[
  {
      "phone_number": "+4956922484",
      "username": "friedrich",
      "email": "friedrich@anwendungen.de"
  },
  {
      "phone_number": "+4942414114",
      "username": "wilhelm",
      "email": "wilhelm@gruber.de"
  },
  {
      "phone_number": "+4326854241",
      "username": "famousfoxglove",
      "email": "famousfox@glove.at"
  }
]
```


## Retrieve currently logged in user
#### `GET localhost:8000/api/current_user/`

🔑 Requires the `Authorization` header (see [above](#authorization))

Expects no request body

Example response:
```json
{
    "phone_number": "+4326854241",
    "username": "famousfoxglove",
    "email": "famousfox@glove.at"
}
```



## Update info about currently logged in user
#### `PUT localhost:8000/api/current_user/`

🔑 Requires the `Authorization` header (see [above](#authorization))

Example request body:
```json
{
  "phone_number": "+4942414114",
  "username": "wilhelm",
  "email": "wilhelm@gruber.de"
}
```
If user was successfully updated, the respone body will contain the updated user.

## Update a subset of info about currently logged in user
#### `PATCH localhost:8000/api/current_user/`
> Differs from `PUT` by not requiring all attributes to be updated

🔑 Requires the `Authorization` header (see [above](#authorization))

Example request body (updates `email`, leaves other attributes unchanged):
```json
{
  "email": "wilhelm@eiker.de"
}
```
If user was successfully updated, the respone body will contain the updated user.
