FROM python:3.10.9

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait

COPY requirements.txt /app/temp/

RUN pip install --upgrade pip
RUN pip install -r /app/temp/requirements.txt

WORKDIR /app/
COPY . /app/

CMD /wait && python manage.py migrate && python manage.py runserver 0.0.0.0:8000