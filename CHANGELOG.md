# Change Log

-   ## [v5.0.0-beta](https://github.com/Hulxv/vnstat-client/releases/tag/v5.0.0-beta) ( Latest )

> Wednesday, July 27, 2022

> **Warning**
> The versioning scheme has been changed to follow semantic versioning, and this version is the first beta from the **5th** release from vnstat-client.

### New features:

-   Integerate with [vnstat-server](https://github.com/Hulxv/vnstat-server):
    -   Traffic
    -   Configuration
    -   daemon
    -   interface
    -   info

### Improve:

-   vnStat not detect alert UI
-   vnStat database not found alert UI

### Fix

-   vnstat detection alert doesn't apper

---

-   ## [v22.5.28](https://github.com/Hulxv/vnstat-client/releases/tag/v22.5.28)

> Saturday, 28 May, 2022

### New features:

-   Support arm64

### Others:

-   Bug fixs

---

-   ## [v22.2.11](https://github.com/Hulxv/vnstat-client/releases/tag/v22.2.11)

    > Friday, 11 Feb, 2022

    ### New features:

    -   Network statistics monitor
    -   Support `sysvinit` init system in addition to `systemd`
    -   Support [vnStat 2.9](https://github.com/vergoh/vnstat/releases/tag/v2.9)

    ### Others:

    -   Fixing UI issues
    -   Fixing bugs
    -   Improve UI

---

-   ## [v22.1.9](https://github.com/Hulxv/vnstat-client/releases/tag/v22.1.9)

> Thursday, 9 Jan, 2022

-   Fix issue #1.
-   Fix typos (Thanks to [vergoh](https://github.com/vergoh) for suggest [typos](https://github.com/crate-ci/typos)).

---

-   ## [v22.1.6](https://github.com/Hulxv/vnstat-client/releases/tag/v22.1.6) ( Initial release )

    > Sunday, 6 Jan, 2022

-   ### Features

    -   Display statistics for your usage for different intervals
        -   Daily
        -   Weekly
        -   Monthly
        -   Yearly
        -   Custom Interval you choose
    -   Different types of stats display
        -   Bar Chart
        -   Line Chart
        -   Table
    -   Export all information as:
        -   CSV
        -   XML
        -   JSON
    -   Beautiful UI (Thanks [Chakra UI](https://chakra-ui.com/) for this great UI components library)
    -   Different themes and color schemes for UI and Charts (Line/Bar Chart and Thanks for [Nivo](https://nivo.rocks/) for great charts library)
    -   Full controlling in vnStat Daemon (Support systemd only)
    -   Easy changing vnStat's configurations

        And more!
