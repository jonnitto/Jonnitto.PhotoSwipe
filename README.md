[![Latest stable version]][packagist] [![Total downloads]][packagist] [![License]][packagist] [![GitHub forks]][fork] [![GitHub stars]][stargazers] [![GitHub watchers]][subscription] [![GitHub followers]][followers] [![Follow Jon on Twitter]][twitter]

# Jonnitto.PhotoSwipe

[PhotoSwipe] for [Neos CMS]
![Screenshot of PhotoSwipe][screenshot]

| Version  | Neos            |
| -------- | --------------- |
| 0.\*     | 2.\*            |
| > 1.4    | 3.\* + 4.\*     |
| 2.\*     | 3.3 + 4.\*      |
| > 3.\*   | 3.3 + 4.\*      |
| >= 3.1.2 | 3.3, 4.\*, 5.\* |

## Needed Markup

In consider to work, a link need to have the class `lightbox` and some `data-` attributes. If an image is inside the link, this image is used for small thumbnail for an faster UI experience.

### `data-title`

This attribute is used for the caption in the lightbox. If this is not given, it search inside the link for a `figcaption` and uses this as caption. This is also a great way if you want to have HTML some markup inside your caption.

### `data-size`

The size of the image to enlarge, e.g. `2560x1200`. Example:

```html
<a class="lightbox" data-size="2560x1200" href="path/to/image.jpg">...</a>
```

An alternative Markup would be:

```html
<a
    class="lightbox"
    data-width="2560"
    data-height="1200"
    href="path/to/image.jpg"
    >...</a
>
```

### `data-ratio` and `data-ratio-image`

If it not possible the get the size of the enlarged image (e.g. because the image is set to async), you can pass also `data-ratio` or `data-ratio-image`. Be aware, that this works best if you also pass the `data-width` (for zooming purposes). `data-ratio-image` can be a small version of the image (e.g. 100px wide). If this is given, it tries to get the dimensions and calculate the ratio from the filename. If this is not possible, the image get loaded and the ratio is calculated with `naturalWidth` and `naturalHeight`. After the first time an asnc picture is loaded, Neos replace the path width the filename where the ratio can be calculated without downloading the image.

## Javascript variables

There are three global variables who get set during the intialisation:

`PhotoSwipe` The prototype from PhotoSwipe  
`PhotoSwipeUI` The prototype from PhotoSwipeUI  
`neosPhotoSwipe` This object stores some informations and functions who can help you achive your requirements:

| Path                          | Description                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------- |
| `defaults`                    | The default settings for PhotoSwipe (you can adust them in the [`Settings.yaml`] file)      |
| `pswp`                        | This is a reference to the markup of the lightbox                                           |
| `dataset`                     | The `dataset` of the `pswp` element                                                         |
| `open(items, options)`        | With this function you can open a lightbox via javascript                                   |
| `init({ gallery, lightbox })` | With this function you can initalize a new gallery. Normally this get called automatically. |
| `initDom()`                   | This function calls `init()` if `dataset.init` is set to `true`                             |
| `gallery`                     | This is a reference to the object created with `new PhotoSwipe()`                           |

## Javascript events

There are several events who get fired and you can react on. The events contains also some data like the instance, etc.

| Event                           | Description                                                                |
| ------------------------------- | -------------------------------------------------------------------------- |
| `neosPhotoSwipe.open.before`    | This event is fired before the code from `instance.open` gets exectued.    |
| `neosPhotoSwipe.open.after`     | This event is fired after the code from `instance.open` was exectued.      |
| `neosPhotoSwipe.init.before`    | This event is fired before the code from `instance.init` gets exectued.    |
| `neosPhotoSwipe.init.after`     | This event is fired after the code from `instance.init` was exectued.      |
| `neosPhotoSwipe.initDom.before` | This event is fired before the code from `instance.initDom` gets exectued. |
| `neosPhotoSwipe.initDom.after`  | This event is fired after the code from `instance.initDom` was exectued.   |

## Installation

Most of the time you have to make small adjustments to a package (e.g.
configuration in [`Settings.yaml`]). Because of that, it is important to add the
corresponding package to the composer from your theme package. Mostly this is
the site packages located under `Packages/Sites/`. To install it correctly go to
your theme package (e.g.`Packages/Sites/Foo.Bar`) and run following command:

```bash
composer require jonnitto/photoswipe --no-update
```

To install the package under Neos 2.\* you have to enter

```bash
composer require "jonnitto/photoswipe:^0.2" --no-update
```

The `--no-update` command prevent the automatic update of the dependencies.
After the package was added to your theme `composer.json`, go back to the root
of the Neos installation and run `composer update`. Et voilà! Your desired
package is now installed correctly.

## License

Licensed under MIT, see [LICENSE]

[packagist]: https://packagist.org/packages/jonnitto/photoswipe
[neos cms]: https://www.neos.io
[photoswipe]: http://photoswipe.com/
[latest stable version]: https://poser.pugx.org/jonnitto/photoswipe/v/stable
[total downloads]: https://poser.pugx.org/jonnitto/photoswipe/downloads
[license]: https://poser.pugx.org/jonnitto/photoswipe/license
[github forks]: https://img.shields.io/github/forks/jonnitto/Jonnitto.PhotoSwipe.svg?style=social&label=Fork
[github stars]: https://img.shields.io/github/stars/jonnitto/Jonnitto.PhotoSwipe.svg?style=social&label=Stars
[github watchers]: https://img.shields.io/github/watchers/jonnitto/Jonnitto.PhotoSwipe.svg?style=social&label=Watch
[github followers]: https://img.shields.io/github/followers/jonnitto.svg?style=social&label=Follow
[follow jon on twitter]: https://img.shields.io/twitter/follow/jonnitto.svg?style=social&label=Follow
[twitter]: https://twitter.com/jonnitto
[fork]: https://github.com/jonnitto/Jonnitto.PhotoSwipe/fork
[stargazers]: https://github.com/jonnitto/Jonnitto.PhotoSwipe/stargazers
[subscription]: https://github.com/jonnitto/Jonnitto.PhotoSwipe/subscription
[followers]: https://github.com/jonnitto/followers
[screenshot]: https://user-images.githubusercontent.com/4510166/74859417-45f9be80-5347-11ea-901c-ad0ea5df07cf.jpg
[license]: LICENSE
[`settings.yaml`]: Configuration/Settings.yaml
