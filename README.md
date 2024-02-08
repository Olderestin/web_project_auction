## Prerequisites

- **Required**: Python 3.x, Docker
- **For pip method**: pip
- **For poetry method**: poetry
- **For Docker method**: only Docker
___
## Installation & Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/Olderestin/web_project_auction.git

2. Navigate to the project directory:
   ```bash
   cd web_project_auction

3. Create a .env file based on the provided example (don't forget to fill it):
   ```bash
   cp .env.example .env
___
## Method 1: Using pip

1. Install dependencies:
    ```bash
    pip install -r requirements.txt

2. Up the database with docker:
   ```bash
   docker compose -f docker-compose-local.yml up --build -d

3. Make migrations:
    ```bash
    python manage.py migrate

4.  Run the app:
    ```bash
    python manage.py runserver
___
## Method 2: Using Poetry

1. Install dependencies:
    ```bash
    poetry install

2. Up the database with docker:
   ```bash
   docker compose -f docker-compose-local.yml up --build -d

3. Make migrations:
    ```bash
    python manage.py migrate

4.  Run the app:
    ```bash
    python manage.py runserver

___
## Method 3: Using Docker

4. Build and run app with Docker container:
   ```bash
   docker compose up --build
___
## Note:
- After run the app you can find API documantation on this url [http://127.0.0.1:8000/api/swagger/](http://127.0.0.1:8000/api/swagger/)
- Url example with access token:
  ```bash
  curl -X 'GET' \
  'http://127.0.0.1:8000/api/auth/profile/' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA2NjI1OTIxLCJpYXQiOjE3MDY2MjU2MjEsImp0aSI6IjZlZDIyZTYxNDczZTQzYTg4OGRiZTdkYjcwMDZlNDU3IiwidXNlcl9pZCI6MX0.P3WwkbDGvLaRo6HDe1ZXpkNEHkY9OGFTMoPHqoNNhlk' \
  -H 'X-CSRFToken: s4b7EiDrdBWe1RRa8kNIWyrb8Feur0J2EwLB0URZnjNlQPy3L3V30EwmlwoW6QSu'
