# vnStat Installation Guide

## Installation :

- ### Ubuntu/Debian based distros

  Like: Manjaro linux, Arco linux, etc...

  - Update packages
    ```bash
    sudo apt update
    sudo apt upgrade
    ```
  - Install
    ```
    sudo apt install vnstat
    ```

- ### Arch linux based
  Like: Manjaro linux, Arco linux, etc...
  - Update packages
    ```bash
    sudo pacman -Syyu
    ```
  - Install
    ```
    sudo pacman -S vnstat
    ```

## Run vnStat Daemon

- ### Systemd
  ```
  sudo systemctl enable vnstat
  sudo systemctl start vnstat
  ```
- ### Sysvinit
  ```
  sudo chkconfig vnstat on
  sudo service vnstat start
  ```
