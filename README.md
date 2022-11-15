![Logo](https://cdn.discordapp.com/attachments/1013489547419590759/1041840249795530762/logoBlue.png)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Discord](https://img.shields.io/discord/1034695813026283580?color=%235865F2&label=Discord&logo=Discord)](https://discord.gg/DuMJjretE2)
![Version](https://img.shields.io/badge/version-0.5.0-ff69b4)

- [About](#about)
- [Features](#current-features)
- [Planned Features](#upcoming-features)
- [Issues and Excuses](#issues-and-excuses)
- [License](#license)
- [Authors](#authors)

# About

-     http://streambingo.live (Waiting for CNAME from DNS and SSL Certificate)
-     https://streambingo.up.railway.app (Temp link)

Hi, Hello.
Stream Bingo was an idea I had after coming across a website called https://nobody.live that displayed all of the current Twitch streamers that currently have no viewers.
Curious on how creating such a website was possible, I started to program. I came up with the idea of stream bingo, because, well, just displaying random streams seemed boring.
Originally,. the website was create for a YouTube project that has since been finished.
You can find that project here: https://www.youtube.com/watch?v=eh8HaIL4VS0

Now, the project is live for anyone to use.

The project is hosted on https://railway.app with future plans to be migrated to docker. (If i can take the time out to learn docker)

If you have any question or want to be involved, reach out to me on Discord.
https://discord.gg/DuMJjretE2

Ok, bye.

# Issues and Excuses

-   Issue # 1 - Loading screen
      There is a reason why the loading screen is there, it's loading. But why? Cost effectiveness? Maybe.
      The Twitch API allows you to make 800 calls to the API per minute. And it is free. So, there is no cost there.
      Railway.app on the other hand, charges me per usage.
      So, what does this mean?
      This means that there is a fine balance between cost effectiveness and optimization. 
      Yes, I *could* have the app constantly compiling and editing a list of live streams and feed that list to the client with little to no delay.
      Maybe, just for a start, I could iterate and update the list of streams every fifteen minutes, this way the list is almost always up to date.

      If one call to the Twitch API returns 100 streams, then on average I would have to make 500 calls to the API every 15 minutes to get all *english speaking only* live streams from Twitch.
      That is 48,000 API calls a day through a hosting service that charges me per usage.

      Currently, it doesn't make sense to do things this way.
      Why? Users.

      48,000 calls to the twitch API is the same as 100 users a day.
      Until the website reaches 100 users a day, it is more cost effective to load streams based on request.

## Current Features

-   Category filtering using a search query.
-   Max view count filtering.
-   Randomizable bingo card based on predetermined values.
-   Fully editable bingo card.

## Upcoming Features

-   Chat integration.
-   Donation link to support server costs.
-   Mobile support.
-   Overall better HTML and CSS work.
-   About page/overlay.
-   General Optimizations.

### License

[MIT](https://choosealicense.com/licenses/mit/)

### Authors

-   [@BearTheCoder](https://www.github.com/BearTheCoder)
