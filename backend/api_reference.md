# 🤝 API reference

### Content

1. [Authorization](#authorization)
2. User
    * [Register a new user](#register-a-new-user)
    * [Log in user](#log-in-user)
    * [Retrieve all users](#retrieve-all-users)
    * [Retrieve currently logged in user](#retrieve-currently-logged-in-user)
    * [Update info about currently logged in user](#update-info-about-currently-logged-in-user)
3. Activity
    * [Retrieve all activities](#retrieve-all-activities)
    * [Retrieve single activity](#retrieve-single-activity)
   *  [Retrieve single activity and register unique view](#retrieve-single-activity-and-register-unique-view)
    * [Retrieve activities of currently logged in user](#retrieve-activities-of-currently-logged-in-user)
    * [Create an activity](#create-an-activity)
    * [Update an existing activity](#update-an-existing-activity)
4. Category
   * [Retrieve all categories](#retrieve-all-categories)
5. Images
   * [Retrieve all admin images](#retrieve-all-admin-images-not-user-uploads)
6. Activity registration
    * [Register logged in user to activity](#register-logged-in-user-to-an-activity)
    * [Unregister logged in user from activity](#unregister-logged-in-user-from-an-activity)
    * [Retrieve all activities where logged in user is registered](#retrieve-all-activities-where-logged-in-user-is-registered)
    * [Retrieve all users registered for an activity](#retrieve-all-users-registered-for-an-activity)
7. Log
    * [Create activity log](#create-activity-log)
    * [Retrieve logs of logged in user](#retrieve-logs-of-logged-in-user)
    * [Remove activity log](#remove-activity-log)
8. Favorite
    * [Favorite an activity](#favorite-an-activity)
    * [Unfavorite an activity](#unfavorite-an-activity)
    * [Retrieve activities favorited by logged in user](#unfavorite-an-activity)
   
9. Email
    * [Send message to activity author](#send-message-to-activity-author)

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

Example request body:
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

## Retrieve single activity and register unique view
#### `GET localhost:8000/api/activities/{activity_id}?register_view`

Expects no request body

Response is identical to the one above, but the request is treated as a user viewing the activity. If no user is logged in, this request is identical to the one above.

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
    "location": "Laguna Sporada 2"
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
    "location": "Laguna Sporada 2"
}
```

🚧 This request requires the use of FormData, because of the image file.

If activity was successfully updated, the respone body will contain the updated activity.


## Retrieve all categories
#### `GET localhost:8000/api/categories/`
Expects no request body

Example response for a valid request:
```json

[
   {
      "id": 1,
      "title": "Gåtur",
      "color": "#BBEDEE"
   },
   {
      "id": 2,
      "title": "Skitur",
      "color": "#9896EE"
   },
   {
      "id": 3,
      "title": "Ålesund",
      "color": "#EEAE51"
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

## Register logged in user to an activity
#### `POST localhost:8000/api/activities/{activity_id}/register/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Response to valid request:
> User was successfully registered


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
#### `GET localhost:8000/api/activities/{activity_id}/participants/`
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

## Create activity log
#### `POST localhost:8000/api/activities/{activity_id}/log/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Response to valid request:
> Activity successfully logged

## Retrieve logs of logged in user
#### `GET localhost:8000/api/my_logs/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Example response to valid request:
```json
[
    {
        "activity": 4,
        "log_id": 4,
        "log_timestamp": "2021-02-08T21:07:36+01:00",
        "username": "upayliea",
        "is_organization": true,
        "title": "Skitur på Valdresflye",
        "ingress": "Dette er en fin skitur med flott utsikt på vestsida av Valdresflye. Vi starter på toppen av Flye og går mod Torfinnsbu",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
        "image": "/media/uploads/activities/7.jpg",
        "has_registration": true,
        "registration_capacity": 100,
        "registration_deadline": "2021-04-09T13:33:43+02:00",
        "starting_time": "2021-04-11T11:00:00+02:00",
        "location": "Shell på Fagernes",
        "price": null,
        "activity_level": 2,
        "user": 12,
        "categories": [
            2
        ],
        "registrations_count": 0
    },
    {
        "activity": 1,
        "log_id": 20,
        "log_timestamp": "2021-03-24T16:45:43+01:00",
        "username": "apedicani",
        "is_organization": true,
        "title": "Ut på tur Drammen",
        "ingress": "Vi starter opp igjen med turer som er for innbyggere som er bosatt i Drammen Kommune. Turene er åpne for alle som ønsker å være med.",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
        "image": "/media/uploads/activities/6.jpg",
        "has_registration": true,
        "registration_capacity": 50,
        "registration_deadline": "2021-04-09T13:30:22+02:00",
        "starting_time": "2021-04-10T12:00:00+02:00",
        "location": "DNT-butikken",
        "price": null,
        "activity_level": 1,
        "user": 20,
        "categories": [
            1
        ],
        "registrations_count": 0
    }
]
```

## Remove activity log
#### `DELETE localhost:8000/api/my_logs/{log_id}/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Response to valid request:
> 204 No Content

## Favorite an activity
#### `POST localhost:8000/api/activities/{activity_id}/favorite/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Response to valid request:
> Activity successfully favorited

## Unfavorite an activity
#### `POST localhost:8000/api/activities/{activity_id}/unfavorite/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Response to valid request:
> Activity successfully unfavorited

## Retrieve activities favorited by logged in user
#### `GET localhost:8000/api/my_favorite_activities/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Expects no request body

Example response to valid request:
```json
[
    {
        "id": 1,
        "username": "apedicani",
        "is_organization": true,
        "title": "Ut på tur Drammen",
        "ingress": "Vi starter opp igjen med turer som er for innbyggere som er bosatt i Drammen Kommune. Turene er åpne for alle som ønsker å være med.",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.",
        "image": "http://localhost:8000/media/uploads/activities/6.jpg",
        "has_registration": true,
        "registration_capacity": 50,
        "registration_deadline": "2021-04-09T13:30:22+02:00",
        "starting_time": "2021-04-10T12:00:00+02:00",
        "location": "DNT-butikken",
        "price": null,
        "activity_level": 1,
        "user": 20,
        "categories": [
            1
        ],
        "registrations_count": 0
    },
    {
        "id": 2,
        "username": "pbacksal2",
        "is_organization": true,
        "title": "Apalviksætra frå Fylling",
        "ingress": "Dette er den kortaste ruta til Apalviksætra og ein går stort sett i motbakke opp til sætra, med tilsvarande nedoverbakkar på returen for dei som liker å renne.",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.",
        "image": "http://localhost:8000/media/uploads/activities/2.jpg",
        "has_registration": false,
        "price": null,
        "activity_level": 2,
        "user": 4,
        "categories": [
            2,
            3
        ]
    },
    {
        "id": 8,
        "username": "fnewlynd",
        "is_organization": false,
        "title": "Appelsinhaugen",
        "ingress": "Fursetfjellet er utgangspunktet for en rekke fine familieturer og trimturer. På solværsdager er det et yrende folkeliv her.",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. \r\n\r\nStet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. \r\n\r\nLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum.",
        "image": "http://localhost:8000/media/uploads/activities/3.jpg",
        "has_registration": false,
        "price": null,
        "activity_level": 2,
        "user": 15,
        "categories": [
            2,
            4
        ]
    }
]
```

## Send message to activity author
#### `POST localhost:8000/api/activities/{activity_id}/contact/`
🔑 Requires the `Authorization` header (see [Authorization](#authorization))

Example request body

```json
{
   "title": "Matservering under turneringen?",
   "message": "Jeg har meldt meg på frisbeegolf-turneringen deres, og lurer på om det blir noe matservering underveis?"
}
```

Response to valid request:
> Email sent!

