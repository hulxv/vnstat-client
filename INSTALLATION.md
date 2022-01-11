# Installation

## Build From Source code

#### Requirements

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
./vnstat-client-22.1.9.AppImage
```

---

## Download & Installation

- ### Ubuntu/Debian based
  Download from [here](https://github.com/Hulxv/vnstat-client/releases/download/v22.1.9/vnstat-client_22.1.9_amd64.deb) or :

```bash
wget https://github.com/Hulxv/vnstat-client/releases/download/v22.1.9/vnstat-client_22.1.9_amd64.deb
```

then:

```bash
sudo dpkg -i ~/path-to-file/vnstat-client_22.1.9_amd64.deb
```

<br/>

- ### Arch Linux based

```bash
sudo pacman -S yay # If you already have 'yay', You can skip this step
```

```bash
yay -S vnstat-client
```

<br/>

- ### AppImage
  Download from [here](https://github.com/Hulxv/vnstat-client/releases/download/v22.1.9/vnstat-client-22.1.9.AppImage) or :

```bash
wget https://github.com/Hulxv/vnstat-client/releases/download/v22.1.9/vnstat-client-22.1.9.AppImage
```

then:

```bash
chmod +x ~/path-to-file/vnstat-client-22.1.9.AppImage && ~/path-to-file/vnstat-client-22.1.9.AppImage
```
