# Chuckle-Doodle.github.io
steps for displaying timeline application
*navigate to where you want to clone this repository
**clone this project then cd into the root directory of the project
*** Linux users and Windows users running WSL will need to also install dos2unix
1. python3 -m venv env (do steps 1 and 2 only if you want to use a Python Virtual Environment!)
2. source env/bin/activate
3. pip install -e .
4. ./bin/timelineAppdb create (if on WSL, first run dos2unix ./bin/timelineAppdb then do step #4)
5. ./bin/timelineApprun (if on WSL, first run dos2unix ./bin/timelineApprun then do step #5)
6. nodeenv --python-virtualenv
7. deactivate
8. source env/bin/activate
9. npm install .

