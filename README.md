# README

## Miru-Web

Saeloun timetracking application.

### Installation

* Step 1: Clone repo to local
```
git clone https://github.com/saeloun/miru-web.git
```
* Step 2: Install ruby 3.0.3
```
rvm install $(cat .ruby-version)
```
* Step 3: Install Node 16.4.2
```
nvm install $(cat .nvmrc)
```
* Step 4: Install gem 
```
bundle install
```
* Step 5: Install node packages
```
yarn install
```
* Step 6: Running app in local
```
foreman start -f Procfile.dev
```
