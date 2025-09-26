<?php

namespace AbdelhamidErrahmouni\FilamentSlickSlider\Components;

use AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns\HasBehaviour;
use AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns\HasRange;
use AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns\HasSliders;
use AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns\HasSnap;
use AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns\HasStep;
use AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns\HasTooltips;
use Closure;
use Error;
use Filament\Forms\Components\Component;
use Filament\Forms\Components\Concerns\CanBeValidated;
use Filament\Forms\Components\Concerns\HasChildComponents;
use Filament\Forms\Components\Concerns\HasHelperText;
use Filament\Forms\Components\Concerns\HasHint;
use Filament\Forms\Components\Concerns\HasLabel;
use Filament\Support\RawJs;

class InputSliderGroup extends Component
{
    use CanBeValidated;
    use HasChildComponents;
    use HasHelperText;
    use HasHint;
    use HasLabel;
    use HasBehaviour;
    use HasRange;
    use HasSliders;
    use HasSnap;
    use HasStep;
    use HasTooltips;

    protected string $view = 'filament-slider::components.input-slider';

    protected int | Closure $max = 10;

    protected int | Closure $min = 0;

    protected RawJs | Closure | string | null $format = null;

    protected bool | array | Closure $connect = true;

    public static function make(?string $label = null): static
    {
        $static = new static;

        return $static
            ->label($label)
            ->id('slider-input-' . str()->random(4));
    }

    /**
     * Set the value of max
     *
     * @return self
     */
    public function max(int | Closure $max): static
    {
        $this->max = $max;

        return $this;
    }

    /**
     * Get the value of max
     */
    public function getMax(): int
    {
        return (int) $this->evaluate($this->max);
    }

    /**
     * Set the value of min
     *
     * @return self
     */
    public function min(int | Closure $min): static
    {
        $this->min = $min;

        return $this;
    }

    /**
     * Get the value of min
     */
    public function getMin(): int
    {
        return (int) $this->evaluate($this->min);
    }

    public function getStates(): array
    {
        return collect($this->getSliders())->map(function ($slider) {
            // return '$wire.' . $this->applyStateBindingModifiers("entangle('{$slider->getStatePath()}', false)", isOptimisticallyLive: false);

            return $slider->getStatePath();
        })
        ->toArray();
    }

    public function getStart(): array
    {
        return collect($this->getSliders())->map(function (InputSlider $slider) {
            return $slider->getState() ?? $slider->getDefaultState();
        })
        ->toArray();
    }

    /**
     * Get the value of connect
     */
    public function getConnect(): array|bool
    {
        $connect = $this->evaluate($this->connect);

        if ($connect && is_array($connect)) {
            if (! (count($connect) == count($this->getSliders()) + 1)) {
                throw new \InvalidArgumentException('connect property must be total sliders + 1 ');
            }

            return $connect;
        }

        return $connect;
    }

    /**
     * Set the value of connect
     *
     * @return self
     */
    public function connect(bool | array | Closure $connect = true): static
    {
        $this->connect = $connect;

        return $this;
    }

    public function format(RawJs | Closure | string | null $format = null): static
    {
        $this->format = $format;

        return $this;
    }

    public function getFormat(): RawJs | null
    {
        return RawJs::make($this->evaluate($this->format));
    }
}
