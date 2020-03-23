"""
timelineApp development configuration.

"""

import os

# Root of this application, useful if it doesn't occupy an entire domain
APPLICATION_ROOT = '/'

# Secret key for encrypting cookies
SECRET_KEY = b'\xea\x86\xf7&\x8b\x85\xc7i\xaaoJ\x8c\x93\xd8\xa0+._\xd9*\x9b\xd6\xd7\xd0'  # noqa: E501  pylint: disable=line-too-long
SESSION_COOKIE_NAME = 'login'

# File Upload to var/uploads/
UPLOAD_FOLDER = os.path.join(
    os.path.dirname(os.path.dirname(os.path.realpath(__file__))),
    'var', 'uploads'
)
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif', 'pdf'])
MAX_CONTENT_LENGTH = 16 * 1024 * 1024

# Database file is var/timelineApp.sqlite3
DATABASE_FILENAME = os.path.join(
    os.path.dirname(os.path.dirname(os.path.realpath(__file__))),
    'var', 'timelineApp.sqlite3'
)