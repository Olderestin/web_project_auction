# Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/Olderestin/web_project_auction.git

2. Navigate to the project directory:
   ```bash
   cd web_project_auction

3. Change branch:
   ```bash
   git checkout backend_dev

3. Create a .env file based on the provided example (don't forget to fill it):
   ```bash
   cp .env.example .env

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

