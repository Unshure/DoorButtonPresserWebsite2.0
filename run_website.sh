#! /usr/bin/env bash

set -e


# Setup script
sudo apt update && sudo apt upgrade
sudo apt remove nodejs npm -y
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.2/install.sh | bash
echo "export NVM_NODEJS_ORG_MIRROR=https://unofficial-builds.nodejs.org/download/release" >> ~/.bashrc
source ~/.bashrc
nvm install --lts
nvm use --lts
node -v
npm -v


# Install Pigpio: https://github.com/fivdi/pigpio
sudo apt-get install pigpio

# Install Dependencies 
cd ./doorbuttonpresserserver
npm install
npm run build

cd ../doorbuttonpresserwebsite
npm install
npm run build

cd ..
