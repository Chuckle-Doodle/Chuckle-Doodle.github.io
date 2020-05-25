# Chuckle-Doodle.github.io
steps for running application in development mode.  For production, don't do step 10 and start server different way.
*navigate to where you want to clone this repository
**clone this project then cd into the root directory of the project
*** Linux users and Windows users running WSL will need to also install dos2unix and pathlab (pip install pathlib)
1. python3 -m venv env (do steps 1, 2, 4, 5, 6 only if you want to use a Python Virtual Environment!)
2. source env/bin/activate
3. pip install -e .
4. nodeenv --python-virtualenv
5. deactivate
6. source env/bin/activate
7. npm install .
8. npx webpack --watch
9. ./bin/timelineAppdb create (if on WSL, first run dos2unix ./bin/timelineAppdb then do step #9)
10. ./bin/timelineApprun (if on WSL, first run dos2unix ./bin/timelineApprun then do step #10)
11. Navigate to localhost:8000 or selected host:port in a web browser to access application!
