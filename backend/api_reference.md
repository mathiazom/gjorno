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
    * [Retrieve all activities where logged in user is registered](#retrieve-all-activities-where-logged-in-user-is-registered)
    * [Retrieve all users registered for an activity](#retrieve-all-users-registered-for-an-activity)
5. Categories
    * [Retrieve all categories](#retrieve-all-categories)
    * [Retrieve all admin images](#retrieve-all-admin-images-not-user-uploads)

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
        "is_organization": false,
        "title": "This field is required.",
        "ingress": "none",
        "description": "This field is required.",
        "image": "http://localhost:8000/media/uploads/CCNIta.png",
        "has_registration": false,
        "user": 32,
        "categories": [
            14
        ],
        "is_author": true,
        "is_registered": false
    },
    {
        "id": 4,
        "username": "wilhelm",
        "is_organization": false,
        "title": "Apud ferio substantivo hu ial",
        "ingress": "Ruli hekto obl co, ho ido stif frota.",
        "description": "El ajn aligi substantiva, kaj et lanta dekono tempopunkto, dolaro responde pov on.",
        "image": null,
        "has_registration": false,
        "user": 19,
        "categories": [
            14
        ],
        "is_author": true,
        "is_registered": false
    },
    {
        "id": 2,
        "username": "famousfoxglove",
        "is_organization": false,
        "title": "Stet clita kasd gubergren, no sea takimata sanctus",
        "ingress": "Vulputate velit esse molestie consequat",
        "description": "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.",
        "image": "http://localhost:8000/media/uploads/469536.jpg",
        "has_registration": false,
        "user": 19,
        "categories": [
            15
        ],
        "is_author": false,
        "is_registered": true
    },
    {
        "id": 1,
        "username": "famousfoxglove",
        "is_organization": false,
        "title": "Consectetuer adipiscing elit",
        "ingress": "Duis autem vel eum iriure dolor in hendrerit in vu",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        "image": null,
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
        "is_author": false,
        "is_registered": false
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
    "is_organization": false,
    "title": "Stet clita kasd gubergren, no sea takimata sanctus",
    "ingress": "Vulputate velit esse molestie consequat",
    "description": "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.",
    "image": "http://localhost:8000/media/uploads/469536.jpg",
    "has_registration": false,
    "user": 19,
    "categories": [
        15
    ],
    "is_author": false,
    "is_registered": true
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
        "is_organization": false,
        "title": "This field is required.",
        "ingress": "none",
        "description": "This field is required.",
        "image": "http://localhost:8000/media/uploads/CCNIta.png",
        "has_registration": false,
        "user": 32,
        "categories": [
            14
        ]
    },
    {
        "id": 4,
        "username": "wilhelm",
        "is_organization": false,
        "title": "Apud ferio substantivo hu ial",
        "ingress": "Ruli hekto obl co, ho ido stif frota.",
        "description": "El ajn aligi substantiva, kaj et lanta dekono tempopunkto, dolaro responde pov on.",
        "image": null,
        "has_registration": false,
        "user": 19,
        "categories": [
            14
        ]
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
    "image": "<IMAGE FILE>",
    "has_registration": true,
    "registration_capacity": 4,
    "registration_deadline": "2022-03-15T15:20:24Z",
    "starting_time": "2022-03-15T15:20:24Z",
    "location": "Laguna Sporada 2",
}
```
where `"categories"` is a list of available category `id`s.

🚧 This request requires the use of FormData, because of the image file.

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
    "image": "<IMAGE FILE>",
    "has_registration": true,
    "registration_capacity": 10,
    "registration_deadline": "2022-03-15T15:20:24Z",
    "starting_time": "2022-03-15T15:20:24Z",
    "location": "Laguna Sporada 2",
}
```

🚧 This request requires the use of FormData, because of the image file.

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


## Retrieve all activities where logged in user is registered
#### `GET localhost:8000/api/my_registered_activities/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Example response for a valid request:
```json
[
    {
        "id": 2,
        "username": "Tekna",
        "is_organization": true,
        "title": "Dolore magna aliquyam erat voluptua",
        "ingress": "At vero eos et accusam et justo",
        "description": "At vero eos et accusam et justo duo dolores et ea rebum.",
        "image": null,
        "has_registration": true,
        "registration_capacity": 10,
        "registration_deadline": "2022-03-20T20:10:09Z",
        "starting_time": "2023-03-20T20:10:11Z",
        "location": "cawdwacda",
        "user": 36,
        "categories": [
            16
        ],
        "registrations_count": 1
    },
    {
        "id": 1,
        "username": "friedrich",
        "is_organization": false,
        "title": "Duis autem vel eum iriure dolor in hendrerit in vu",
        "ingress": "none",
        "description": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
        "image": "http://localhost:8000/media/uploads/giphy_G5JzyTM.webp",
        "has_registration": true,
        "registration_capacity": 4,
        "registration_deadline": "2022-03-15T15:20:24Z",
        "starting_time": "2022-03-15T15:20:24Z",
        "location": "Laguna Sporada 2",
        "user": 26,
        "categories": [
            25
        ],
        "registrations_count": 2
    }
]
```


## Retrieve all users registered for an activity
#### `GET localhost:8000/api/activities/{activity_id}/registrations/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

🚧 Only activity author can view this information

Expects no request body

Example response to valid request:
```json
[
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

## Retrieve all admin images (not user uploads)
#### `GET localhost:8000/api/images/`
Expects no request body

Example response for a valid request:
```json
[
    {
        "id": 1,
        "title": "Skog",
        "image": "http://localhost:8000/media/uploads/1226404797_preview_1119379893_preview_Forest_River.jpg"
    },
    {
        "id": 2,
        "title": "Dune",
        "image": "http://localhost:8000/media/uploads/christoffer-engstrom-8NuHwPbO62k-unsplash.jpg"
    },
    {
        "id": 3,
        "title": "Night",
        "image": "http://localhost:8000/media/uploads/756630.jpg"
    },
    {
        "id": 6,
        "title": "Forca",
        "image": "http://localhost:8000/media/uploads/yc9yzfnqcnkc.png"
    }
]
```
