# Backend

This project uses [Django](https://www.djangoproject.com/), a Python Web framework, as a REST API backend with the [Django REST framework](https://www.django-rest-framework.org/). This exposes various URL paths for the frontend to point its requests to, e.g. `/activities` to fetch all activities currently in the database.

<br>

## Setup

This is a step-by-step guide for setting up your own instance of the backend on your local machine.

#### 🌟 Python Virtual Environment

A virtual environment is useful when installing `pip` packages for a single project only. The alternative would be to install packages globally for your whole machine, which could get messy.

##### Installation

```
pip install virtualenv
```

##### Creation

```
virtualenv venv
```
or in case that fails try
```
python -m virtualenv venv
```
> venv is just a name here, it could just as well be heinrich, william, franz ...

##### Activation

Windows
```
. venv\Scripts\activate
```
macOS
```
. venv\bin\activate
```

<br>

#### 📦 Installing required modules
> Make sure you have activated the virtualenv before you start installing modules

The [`requirements.txt`](requirements.txt) file specifies all the required modules to be able to run the backend. This includes `Django`, `djangorestframework`, `django-rest-auth` and a whole bunch of other stuff...

In order to install these packages you simply run a single command while inside the same directory as `requirements.txt` and with an activated virtual environment.

```
pip install -r requirements.txt
```

<br>

#### 🏇 Running Django

Before running the server, we have to initialize the underlying database
```
python manage.py migrate
```

It's also useful to create an admin user
```
python manage.py createsuperuser
```

Finally the following command will start the Django backend

```
python manage.py runserver
```

It is now ready to handle requests 🥳

<br>

#### 🧙‍♂️ Admin Interface

Django provides a handy interface for inspecting and moderating backend data, the [Admin site](https://docs.djangoproject.com/en/3.1/ref/contrib/admin/). It's available for superusers at [`localhost:8000/admin`](http://localhost:8000/admin)


<br>

## API Reference

The API is available at [`localhost:8000/api`](http://localhost:8000/api). Accessing this URL in the browser will present the [Browsable API](https://www.django-rest-framework.org/topics/browsable-api/). Like the admin site, it's a useful tool for testing requests and inspecting the structure of the API.

#### 🤝 Currently supported requests

#### `GET localhost:8000/api/activities`
> Returns all activities
