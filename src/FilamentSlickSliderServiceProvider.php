<?php

namespace AbdelhamidErrahmouni\FilamentSlickSlider;

use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Assets\Asset;
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;
use Spatie\LaravelPackageTools\Commands\InstallCommand;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class FilamentSlickSliderServiceProvider extends PackageServiceProvider
{
    public static string $name = 'filament-slider';

    public static string $viewNamespace = 'filament-slider';

    public function configurePackage(Package $package): void
    {
        $package->name(static::$name)
            ->hasInstallCommand(function (InstallCommand $command) {
                $command
                    ->askToStarRepoOnGitHub('abdelhamiderrahmouni/filament-slick-slider');
            });

        if (file_exists($package->basePath('/../resources/views'))) {
            $package->hasViews(static::$viewNamespace);
        }
    }

    public function packageRegistered(): void {}

    public function packageBooted(): void
    {
        // Asset Registration
        FilamentAsset::register(
            $this->getAssets(),
            $this->getAssetPackageName()
        );

    }

    protected function getAssetPackageName(): ?string
    {
        return 'abdelhamiderrahmouni/filament-slick-slider';
    }

    /**
     * @return array<Asset>
     */
    protected function getAssets(): array
    {
        return [
            AlpineComponent::make('filament-slick-slider-scripts', __DIR__ . '/../resources/dist/components/filament-slider.js'),
            Css::make('filament-slick-slider-styles', __DIR__ . '/../resources/dist/filament-slider.css'),
            Css::make('filament-slider', __DIR__ . '/../resources/dist/components/filament-slider.css'),
        ];
    }
}
