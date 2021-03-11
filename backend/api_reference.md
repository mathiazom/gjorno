# 🤝 API reference

### Content

1. [Authorization](#authorization)
2. User
    * [Register a new user](#register-a-new-user)
    * [Log in user](#log-in-user)
    * [Retrieve all users](#retrieve-all-users)
    * [Retrieve currently logged in user](#retrieve-currently-logged-in-user)
    * [Update info about currently logged in user](#update-info-about-currently-logged-in-user)
4. Activities
    * [Retrieve all activities](#retrieve-all-activities)
    * [Retrieve single activity](#retrieve-single-activity)
    * [Retrieve activities of currently logged in user](#retrieve-activities-of-currently-logged-in-user)
    * [Create an activity](#create-an-activity)
    * [Update an existing activity](#update-an-existing-activity)
4. Activity registration
    * [Register logged in user to activity](#register-logged-in-user-to-an-activity)
    * [Unregister logged in user from activity](#unregister-logged-in-user-from-an-activity)
    * [Retrieve all registrations for an activity](#retrieve-all-registrations-for-an-activity)
5. Categories
    * [Retrieve all categories](#retrieve-all-categories)

### General info
The API is available at [`localhost:8000/api`](http://localhost:8000/api). Accessing this URL in the browser will present the [Browsable API](https://www.django-rest-framework.org/topics/browsable-api/). Like the admin site, it's a useful tool for testing requests and inspecting the structure of the API.

🚧 Some requests require the url to end with a `/`, so make sure you have used the exact format shown here.

### Authorization
🔑 Most requests require a logged in user. This is handled by including a `Authorization` header in the request:
```
Authorization: Token {token}
```
where `{token}` is the authentication token returned on login/registration (see below).

Using `axios`, you can set the token as a header like this:
```javascript
...
axios.post(
  /*url*/,
  /*data*/,
  {
    headers: {
        "Authorization": `Token ${window.localStorage.getItem("Token")}`                 
    }
  }
)
...
```

🌟 The authorization token should be stored in the browser as long as the user is supposed to be logged in. This can be done with [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage). Remember to remove the token when you want the user to be logged out!


## Register a new user
#### `POST localhost:8000/auth/register/`

Example request body (`email` and `is_organization` are optional)
```json
{
    "username": "friedrich",
    "password1": "gf6vWucmrP5T2Vsf",
    "password2": "gf6vWucmrP5T2Vsf",
    "email": "friedrich@anwendungen.de",
    "phone_number": "+4956922484",
    "is_organization": false
}
```
A valid request will receive a response with the users *authentication token*:
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


## Retrieve all users
#### `GET localhost:8000/api/users/`
Expects no request body

Example response for a valid request to database with three users:
```json
[
  {
      "phone_number": "+4956922484",
      "username": "friedrich",
      "email": "friedrich@anwendungen.de",
      "is_organization": true
  },
  {
      "phone_number": "+4942414114",
      "username": "wilhelm",
      "email": "wilhelm@gruber.de",
      "is_organization": false
  },
  {
      "phone_number": "+4326854241",
      "username": "famousfoxglove",
      "email": "famousfox@glove.at",
      "is_organization": false
  }
]
```


## Retrieve currently logged in user
#### `GET localhost:8000/api/current_user/`

🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Example response:
```json
{
    "phone_number": "+4942414114",
    "username": "wilhelm",
    "email": "wilhelm@gruber.de",
    "is_organization": false
}
```


## Update info about currently logged in user
#### `PUT localhost:8000/api/current_user/`

🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Example request body:
```json
{
  "phone_number": "+4942414114",
  "username": "wilhelm",
  "email": "wilhelm@gruber.de",
  "is_organization": false
}
```
If user was successfully updated, the respone body will contain the updated user.


## Retrieve all activities
#### `GET localhost:8000/api/activities/`
Expects no request body

Example response for a valid request to database with three activities:
```json
[
    {
        "id": 5,
        "username": "wilhelm",
        "title": "This field is required.",
        "ingress": "none",
        "description": "This field is required.",
        "has_registration": false,
        "user": 32,
        "categories": [
            14
        ],
        "is_author": true
    },
    {
        "id": 4,
        "username": "wilhelm",
        "title": "Apud ferio substantivo hu ial",
        "ingress": "Ruli hekto obl co, ho ido stif frota.",
        "description": "El ajn aligi substantiva, kaj et lanta dekono tempopunkto, dolaro responde pov on.",
        "has_registration": false,
        "user": 19,
        "categories": [
            14
        ],
        "is_author": true
    },
    {
        "id": 2,
        "username": "famousfoxglove",
        "title": "Stet clita kasd gubergren, no sea takimata sanctus",
        "ingress": "Vulputate velit esse molestie consequat",
        "description": "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.",
        "has_registration": false,
        "user": 19,
        "categories": [
            15
        ],
        "is_author": false
    },
    {
        "id": 1,
        "username": "famousfoxglove",
        "title": "Consectetuer adipiscing elit",
        "ingress": "Duis autem vel eum iriure dolor in hendrerit in vu",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "has_registration": true,
        "registration_capacity": 4,
        "registration_deadline": "2022-03-15T15:20:24Z",
        "starting_time": "2022-03-15T15:20:24Z",
        "location": "Laguna Sporada 2",
        "user": 19,
        "categories": [
            25
        ],
        "registrations_count": 1,
        "is_author": false
    }
]
```


## Retrieve single activity
#### `GET localhost:8000/api/activities/{activity_id}/`

Expects no request body

Example response for a valid `id`, here with `id=2`
```json
{
    "id": 2,
    "username": "famousfoxglove",
    "title": "Stet clita kasd gubergren, no sea takimata sanctus",
    "ingress": "Vulputate velit esse molestie consequat",
    "description": "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.",
    "has_registration": false,
    "user": 19,
    "categories": [
        15
    ],
    "is_author": false
}
```


## Retrieve activities of currently logged in user
#### `GET localhost:8000/api/my_activities/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Example response for a valid request to database where logged in user has `id=12`:
```json
[
    {
        "id": 5,
        "username": "wilhelm",
        "title": "This field is required.",
        "ingress": "none",
        "description": "This field is required.",
        "has_registration": false,
        "user": 32,
        "categories": [
            14
        ],
        "is_author": true
    },
    {
        "id": 4,
        "username": "wilhelm",
        "title": "Apud ferio substantivo hu ial",
        "ingress": "Ruli hekto obl co, ho ido stif frota.",
        "description": "El ajn aligi substantiva, kaj et lanta dekono tempopunkto, dolaro responde pov on.",
        "has_registration": false,
        "user": 19,
        "categories": [
            14
        ],
        "is_author": true
    }
]
```


## Create an activity
#### `POST localhost:8000/api/activities/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Example request body
```json
{
    "title": "Dolore magna aliquyam erat voluptua",
    "ingress": "At vero eos et accusam et justo",
    "description": "At vero eos et accusam et justo duo dolores et ea rebum.",
    "categories": [16],
    "has_registration": true,
    "registration_capacity": 4,
    "registration_deadline": "2022-03-15T15:20:24Z",
    "starting_time": "2022-03-15T15:20:24Z",
    "location": "Laguna Sporada 2",
}
```
where `"categories"` is a list of available category `id`s (not yet available from API).

Registration fields (capacity, deadline, start time and location) are not required if `has_registration: true` or `has_registration` is not included in request.

🚧 Notice that no user id is provided. This is automatically attached in the backend based on the authentication token!

If activity was successfully created, the respone body will contain the new activity.


## Update an existing activity
#### `PUT localhost:8000/api/activities/{activity_id}/`

🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Example request body (same as for `POST`)
```json
{
    "title": "Dolore magna aliquyam erat voluptua",
    "ingress": "At vero eos et accusam et justo",
    "description": "At vero eos et accusam et justo duo dolores et ea rebum.",
    "categories": [16],
    "has_registration": true,
    "registration_capacity": 10,
    "registration_deadline": "2022-03-15T15:20:24Z",
    "starting_time": "2022-03-15T15:20:24Z",
    "location": "Laguna Sporada 2",
}
```
If activity was successfully updated, the respone body will contain the updated activity.


## Register logged in user to an activity
#### `POST localhost:8000/api/activities/{activity_id}/register/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Example response to valid request:
```json
{
    "id": 9,
    "activity": 1,
    "user": 19
}
```


## Unregister logged in user from an activity
#### `POST localhost:8000/api/activities/{activity_id}/unregister/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Response to valid request:
> User was successfully unregistered


## Retrieve all registrations for an activity
#### `GET localhost:8000/api/activities/{activity_id}/registrations/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

🚧 Only activity author can view this information

Expects no request body

Example response to valid request:
```json
[
    {
        "id": 8,
        "activity": 1,
        "user": 32
    },
    {
        "id": 10,
        "activity": 1,
        "user": 19
    }
]
```


## Retrieve all categories
#### `GET localhost:8000/api/categories/`
Expects no request body

Example response for a valid request:
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
