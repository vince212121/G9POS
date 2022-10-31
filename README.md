# G9POS
Point of sale application

## To run with Docker
1. Install docker desktop
2. Install WSL2 
3. Run ```docker-compose up -d``` to start in the background or ```docker-compose up``` in the root directory where ```docker-compose.yml``` install
4. To stop the container, use ```docker-compose down``` if started in the background or Ctrl + C if you used the other command
5. To use ```manage.py``` commands, use ```docker-compose exec backend python manage.py (insert command)```

## To run this locally
1. Install the latest version of python
2. Set up a virtual env: ```python -m venv .venv``` in the root directory
3. Start the virtual environment with ```. .\.venv\Scripts\activate``` (this will need to be ran every time you want to run this)
4. With the virtual env on - indicated with the brackets in the terminal (ex. (.venv)) -, go to the backend folder
5. Then run ```pip install -r requirements.txt``` to install the backend packages
6. Run ```python manage.py migrate``` to create the sql database
7. Now you can run the server by using ```python manage.py runserver```

## Setting up the frontend server
1. Install the latest LTS version of nodejs
2. Switch to the frontend folder
3. Run ```npm install``` to install the dependencies
4. In scripts, replace ```"start": "WATCHPACK_POLLING=true react-scripts start",``` with ```"start": "react-scripts start",```
5. Then run ```npm start``` to start the environment
