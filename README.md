
# Mindful Extension

The internet has become a wonderful place to spread ideas and beliefs, and no one should be scared to share them online. The purpose of this extension is to make you more “mindful” of the things you say online, so more people can feel free to express themselves online.

![Mindful Tile](img/Mindful_Extension_Tile.png)


### Prerequisites

You will need:


* Node.js (tested on v11.9.0)
* npm (tested on v6.13.4)
* Windows or Mac (tested on these platforms, should work on Linux)
* Understanding of Chrome Extension and  Artitecture
* Understanding of JavaScript
* A passion of making the world a better place!


### Installing (Local Development)


Clone Reop (if getting code from Github - else, move to next step)

```
git clone <repo url>
```

Install Dependencies

```
npm install
```

Run dev build (with Extension Hot Reloading)

```
npm run build
```

To create minified dist build, run

```
npm run dist-build
```
Package app for store disribution (mostly for chrome):

```
npm run store-dist
```
The ```img``` folder is for Chrome store images

## Running the tests

To test the code, run:

```
npm run standard
```



## Built With

* [VadarSentiment](https://github.com/vaderSentiment/vaderSentiment-jshttps://github.com/vaderSentiment/vaderSentiment-js) - Used for sentiment analysis (emojis)
    * [Current version](https://github.com/vaderSentiment/vaderSentiment-js/tree/1.1.3)

* [Tensorflow.js Toxicity Model](https://github.com/tensorflow/tfjs-models/tree/master/toxicity) - Used for advanced text analysis
    * [Current version](https://github.com/tensorflow/tfjs-models/tree/toxicity-v1.2.2/toxicity)

* For versions, refer to [package.json](package.json)

<!-- ## Contributing

Please read [CONTRIBUTING.md] for details on our code of conduct, and the process for submitting pull requests to us. -->

## Versioning

We use [SemVer](http://semver.org/) for versioning.

## Authors

* **Mitchell Mark-George** - *Initial work* 

See also the list of [contributors](https://github.com/MitchellMarkGeorge/Mindful/contributors) who participated in this project.

## License

This project is licensed under the AGPL-3.0-only License - see the [LICENSE.txt](LICENSE.txt) file for details


