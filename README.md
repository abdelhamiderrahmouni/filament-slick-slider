# Filament Slick Slider

[![Latest Version on Packagist](https://img.shields.io/packagist/v/abdelhamiderrahmouni/filament-slick-slider.svg?style=flat-square)](https://packagist.org/packages/abdelhamiderrahmouni/filament-slick-slider)
[![Total Downloads](https://img.shields.io/packagist/dt/abdelhamiderrahmouni/filament-slick-slider.svg?style=flat-square)](https://packagist.org/packages/abdelhamiderrahmouni/filament-slick-slider)

This component lets users intuitively select single values or ranges by moving a slider handle.  
It is perfect for scenarios requiring accurate input, such as setting numbers, adjusting audio levels, or satisfaction levels.

## Installation

You can install the package via composer:

```bash
composer require abdelhamiderrahmouni/filament-slick-slider
```

## Usage

### Simple Input Slider

```php
InputSliderGroup::make()
->sliders([
    InputSlider::make('min')
])
->label('Limit')
```


### Multiple Input

```php
InputSliderGroup::make()
->sliders([
    InputSlider::make('min'),
    InputSlider::make('max')
])
->label('Limit')
```

### Connect

```php
InputSliderGroup::make()
->sliders([
    InputSlider::make('min'),
    InputSlider::make('max')
])
->connect([
    false,
    true,
    false
])
->label('Limit')
```

### Maximum & Minimum

```php
InputSliderGroup::make()
->sliders([
    InputSlider::make('min'),
    InputSlider::make('max')
])
->connect([
    false,
    true,
    false
])
->max(100)
->min(0)
->label('Limit')
```


### Complete

```php
InputSliderGroup::make()
    ->sliders([
        InputSlider::make('min'),
        InputSlider::make('max')->default(50),
    ])
    ->connect([
        true,
        false,
        true
    ]) // array length must be sliders length + 1
    ->range([
        "min" => 30,
        "max" => 100
    ])
    ->step(10)
    ->behaviour([
        InputSliderBehaviour::DRAG,
        InputSliderBehaviour::TAP
    ])
    ->enableTooltips()
    ->label("Limit")
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Credits

- [Abdelhamid Errahmouni](https://github.com/abdelhamiderrahmouni)
- [Rupadana](https://github.com/rupadana)
- [All Contributors](../../contributors)
- This package is a fork of [filament-slider](https://github.com/abdelhamiderrahmouni/filament-slick-slider) by [Rupadana](https://github.com/rupadana)
  
## License

The MIT License (MIT). Please see [License File](LICENSE.md) for more information.
