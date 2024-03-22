# Run via Docker
docker build -t react-facemorph .
docker run --name facemorph -p 5000:8080 -d react-facemorph 

# Setup local
brew install nvm
brew install pyenv
pyenv install 3.12.2
brew install openssl readline sqlite3 xz zlib tcl-tk ffmpeg
nvm install 16
nvm use 16
npm install --no-optional
pip install -r dev_py_face_morph/requirements.txt

# Run local
npm run dev && npm run start-dev