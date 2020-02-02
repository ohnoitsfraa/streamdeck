# StreamDeck

## What?

This is a node project that uses the awesome [elgato stream deck](https://github.com/lange/node-elgato-stream-deck#readme) package by Lange. I added a script that reads a config JSON file to display all the icons configured in it, either by showing an icon that you've premade and put into the src/icons/premade directory, or by generating an icon on the fly with the [txt2png](https://github.com/tkrkt/text2png) package by tkrkt.

## Why?

The original Stream Deck software by Elgato is fine, but I wanted more control over what I could do with it. Plus, the Stream Deck is also just a fun toy to play with in your downtime.

## How?

Under the src folder you will find an example.json. The structure is pretty basic. You can define what you want to show on your Stream Deck by creating a config.json under the src folder. You either provide an icon file for each display (0.png for example), or you choose to use the fill option and enter some text, a font, colors, fontsize, etc. The third option is use the display as a folder, then you have to provide the displays that are under that folder. Just take a look at the example.json and it will be clear I guess.

After successfully creating the config.json and providing the png files needed in the src/icons/premade folder, you will have to run the project. You can do this by **npm run start** to run it once or **npm run watch** if you want to use it while developing.

If you just want to run in the background, you can **npm run daemon:start**. Stopping it can be done by running **npm run daemon:stop**. Additionally you can also delete the entire process by using **npm run daemon:delete**

The daemon uses the [PM2](https://pm2.keymetrics.io/) package to do this. If you want the process to persist you can provide a startup script to do this, for more information visit the [PM2 docs](https://pm2.keymetrics.io/docs/usage/startup/).


## Contributing

I'm open to contributions of course, I just made this in a few hours to play around with my stream deck. The goal is to eventually also create a frontend application so you don't have to edit the config.json manually anymore. But for now it will do.