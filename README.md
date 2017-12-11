[![Latest Stable Version](https://poser.pugx.org/jonnitto/photoswipe/v/stable)](https://packagist.org/packages/jonnitto/photoswipe)
[![Total Downloads](https://poser.pugx.org/jonnitto/photoswipe/downloads)](https://packagist.org/packages/jonnitto/photoswipe)
[![License](https://poser.pugx.org/jonnitto/photoswipe/license)](https://packagist.org/packages/jonnitto/photoswipe)
[![GitHub forks](https://img.shields.io/github/forks/jonnitto/Jonnitto.PhotoSwipe.svg?style=social&label=Fork)](https://github.com/jonnitto/Jonnitto.PhotoSwipe/fork)
[![GitHub stars](https://img.shields.io/github/stars/jonnitto/Jonnitto.PhotoSwipe.svg?style=social&label=Stars)](https://github.com/jonnitto/Jonnitto.PhotoSwipe/stargazers)
[![GitHub watchers](https://img.shields.io/github/watchers/jonnitto/Jonnitto.PhotoSwipe.svg?style=social&label=Watch)](https://github.com/jonnitto/Jonnitto.PhotoSwipe/subscription)
[![GitHub followers](https://img.shields.io/github/followers/jonnitto.svg?style=social&label=Follow)](https://github.com/jonnitto/followers)
[![Follow Jon on Twitter](https://img.shields.io/twitter/follow/jonnitto.svg?style=social&label=Follow)](https://twitter.com/jonnitto)

# Jonnitto.PhotoSwipe

[PhotoSwipe](http://photoswipe.com/) for [Neos CMS](https://www.neos.io)

| Version | Neos |
| ------- | ---- |
| 0.\*    | 2.\* |
| 1.\*    | 3.\* |

## Installation

Most of the time you have to make small adjustments to a package (e.g.
configuration in `Settings.yaml`). Because of that, it is important to add the
corresponding package to the composer from your theme package. Mostly this is
the site packages located under `Packages/Sites/`. To install it correctly go to
your theme package (e.g.`Packages/Sites/Foo.Bar`) and run following command:

```
composer require jonnitto/photoswipe --no-update
```

To install the package under Neos 2.\* you have to enter

```
composer require "jonnitto/photoswipe:^0.2" --no-update
```

The `--no-update` command prevent the automatic update of the dependencies.
After the package was added to your theme `composer.json`, go back to the root
of the Neos installation and run `composer update`. Et voilà! Your desired
package is now installed correctly.

## License

Licensed under MIT, see [LICENSE](LICENSE)
