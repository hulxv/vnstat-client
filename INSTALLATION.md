## Build From Source code

#### Requirements

- [vnstat (^2.8)](https://github.com/vergoh/vnstat)
- [node (^16.9.1)](https://nodejs.org/en/)
- [yarnpkg (^1.22.11)](https://yarnpkg.com/getting-started/install)

```bash
# clone repo
git clone https://github.com/Hulxv/vnstat-client.git
cd ./vnstat-client
 # To install required packages
yarn install
 # To build the app
yarn build
cd ./dist
# Run App
./vnstat-client-1.0.0.AppImage
```

## Download & Installation

- ### Ubuntu/Debian based
  Download from [here](https://github.com/Hulxv/vnstat-client/releases/download/v22.1.6/vnstat-client_22.1.6_amd64.deb) or :

```bash
$ wget https://github.com/Hulxv/vnstat-client/releases/download/v22.1.6/vnstat-client_22.1.6_amd64.deb
```

then

```bash
$ sudo dpkg -i ~/path-to-file/vnstat-client_22.1.6_amd64.deb
```

- ### Arch Linux based
  Download from [here](https://github.com/Hulxv/vnstat-client/releases/download/v22.1.6/vnstat-client-22.1.6.pacman) or :

```bash
$ wget https://github.com/Hulxv/vnstat-client/releases/download/v22.1.6/vnstat-client-22.1.6.pacman
```

then:

```bash
$ sudo pacman -U ~/path-to-file/vnstat-client-22.1.6.pacman
```

- ### AppImage
  Download from [here](https://github.com/Hulxv/vnstat-client/releases/download/v22.1.6/vnstat-client-22.1.6.AppImage) or :

```bash
$ wget https://github.com/Hulxv/vnstat-client/releases/download/v22.1.6/vnstat-client-22.1.6.AppImage
```

then:

```bash
$ chmod +x ~/path-to-file/vnstat-client-22.1.6.AppImage
$ ~/path-to-file/vnstat-client-22.1.6.AppImage
```
