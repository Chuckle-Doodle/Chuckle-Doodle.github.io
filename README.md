# Timelines and Maps for History Analysis

First are the steps for running this application in development mode. For production, don't do step 10 and start the server a different way. Please note we are using a Python virtual environment in this guide. BEFORE STARTING:

  - Navigate to where you want to clone this repository.
  - Clone this repository then cd into it.
  - Install Python 3 if you don't have it.
  - If running Linux or Windows, install dos2unix and pathlib before starting.
  - Install sqlite3 if you don't have it.
```sh
python3 -m venv env
source env/bin/activate
pip install -e .
nodeenv --python-virtualenv
deactivate
source env/bin/activate
npm install .
npx webpack
./bin/timelineApprun (if on Windows Subsystem for Linux, first run dos2unix ./bin/timelineApprun)
```
  - Navigate to localhost:8000 or selected host:port in a web browser to access application!

# How to put application online through AWS

1. Create AWS Account
    -ddd
2. Start EC2 instance with the following settings:
    -“Ubuntu Server 20.04 LTS” Amazon Machine Image (AMI)
    -t2.micro instance type
    -add a rule to allow both SSH and HTTP traffic in and out of your instance.
    -Make sure to create a key pair and download it.
3. SSH into instance.
    -Copy or move your instance’s SSH key to your project directory and set the permissions to read-only with the command "chmod 400 <your SSH key>"
    ```sh
    ssh -i <your instance's SSH key> ubuntu@<your instance's public DNS>
    ```
4. Install nginx
    ```sh
    sudo apt-get update
    sudo apt-get install nginx
    ```
5. Configure nginx by editing /etc/nginx/sites-available/default
    ```sh
    sudoedit /etc/nginx/sites-available/default
    ```
    -Replace the entire default server settings with the settings specified below. Save and exit.
    ```sh
    server {
      listen 80;
      server_name <Public DNS (IPv4)>;
      location / {
        proxy_pass http://localhost:8000;
      }
    }
    ```
6. Configure nginx by editing /etc/nginx/nginx.conf
    ```sh
    sudoedit /etc/nginx/nginx.conf
    ```
    -Modify one line in /etc/nginx/nginx.conf, uncomment the line saying, server_names_hash_bucket_size and change its value to 128. Save and exit.
    ```sh
    server_names_hash_bucket_size 128;
    ```
7. Restart the nginx server
    ```sh
    sudo systemctl restart nginx
    ```
8. Make sure you have Python virtual environment tools installed.
    ```sh
    sudo apt-get install python3-venv sqlite3
    ```
9. Clone your web source code and cd into the cloned project.
10. Run following commands to install backend then frontend
    ```sh
    python3 -m venv env
    source env/bin/activate
    pip install --upgrade pip setuptools wheel
    pip install -e .
    pip install gunicorn
    pip install nodeenv
    nodeenv --python-virtualenv
    source env/bin/activate
    npm install .
    ```
11. Run server
    ```sh
    pkill -f gunicorn
    pgrep -af gunicorn
    gunicorn -b localhost:8000 -w 2 -D timelineApp:app (alternative: gunicorn -b localhost:8000 -w 2 timelineApp:app --log-level debug)
    ```
12. Browse to your Public DNS name (or refresh) and you should see your web app.

### Todos

 - improve organization for integrating different types of reference views, like timelines, maps, etc
 - finish editStory functionality
