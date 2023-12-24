[![Latest stable version]][packagist] [![Total downloads]][packagist] [![License]][packagist] [![GitHub forks]][fork] [![GitHub stars]][stargazers] [![GitHub watchers]][subscription] [![GitHub followers]][followers] [![Follow Jon on Twitter]][twitter]

# Jonnitto.PhotoSwipe

**This package includes [PhotoSwipe] into [Neos CMS]**

| Version  | Neos        | Maintained |
| -------- | ----------- | :--------: |
| 0.\*     | 2.\*        |     ✗      |
| > 1.4    | 3.\* + 4.\* |     ✗      |
| 2.\*     | 3.3 + 4.\*  |     ✗      |
| > 3.\*   | 3.3 + 4.\*  |     ✗      |
| >= 3.1.2 | 3.3 - 8.\*  |     ✗      |
| 4.\*     | 7.3 - 8.\*  |     ✓      |

## Required HTML markup

Each element that matches the selector `a.lightbox` must have such attributes:

- Image URL in `href` or `data-pswp-src` attribute (latter has higher priority).
- Image width in `data-pswp-width`.
- Image height in `data-pswp-height`.

And optionally:

- `<img>` thumbnail within the link element that will be displayed before the large image is loaded
- Optional `data-cropped="true"` attribute if thumbnail is cropped. See also
  [Animating from Cropped Thumbnail](https://photoswipe.com/opening-or-closing-transition#animating-from-cropped-thumbnail).
  PhotoSwipe API supports almost any markup and any data source, [read more about it here](https://photoswipe.com/data-sources#custom-html-markup).

Example:

```html
<a
  class="lightbox"
  data-pswp-width="2560"
  data-pswp-height="1200"
  href="path/to/image.jpg"
  >...</a
>
```

## Javascript variables

There is one global variable who get set during the intialisation:

`neosPhotoSwipe` This object stores the `lightbox` variable from PhotoSwiper. (The variable who get used to call
`lightbox.init()`). With this, you can add you own [event listener](https://photoswipe.com/events/) or trigger
[methods](https://photoswipe.com/methods/).

## Installation

Most of the time you have to make small adjustments to a package (e.g.
configuration in [`Settings.yaml`]). Because of that, it is important to add the
corresponding package to the composer from your theme package. Mostly this is
the site packages located under `Packages/Sites/`. To install it correctly go to
your theme package (e.g.`Packages/Sites/Foo.Bar`) and run following command:

```bash
composer require jonnitto/photoswipe --no-update
```

The `--no-update` command prevent the automatic update of the dependencies.
After the package was added to your theme `composer.json`, go back to the root
of the Neos installation and run `composer update`. Et voilà! Your desired
package is now installed correctly.

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
[`settings.yaml`]: Configuration/Settings.yaml
