<?php

namespace AbdelhamidErrahmouni\FilamentSlickSlider\Components;

use Closure;
use Error;
use Filament\Forms\Components\Component;
use Filament\Forms\Components\Concerns\CanBeValidated;
use Filament\Forms\Components\Concerns\HasChildComponents;
use Filament\Forms\Components\Concerns\HasHelperText;
use Filament\Forms\Components\Concerns\HasHint;
use Filament\Forms\Components\Concerns\HasLabel;

class InputSliderGroup extends Component
{
    use CanBeValidated;
    use HasChildComponents;
    use HasHelperText;
    use HasHint;
    use HasLabel;

    protected string $view = 'filament-slider::components.input-slider';

    protected int | Closure $max = 10;

    protected int | Closure $min = 0;

    protected int | Closure $step = 1;

    protected array | Closure $behaviour = ['drag', 'tap'];

    protected array | Closure $sliders = [];

    protected bool | Closure $snap = false;

    protected bool | array | Closure $connect = true;

    protected array | Closure | null $range = null;

    protected array | Closure | null $tooltips = null;

    protected bool $hasEnabledTooltips = false;

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


    /**
     * Set the value of step
     *
     * @return self
     */
    public function step(int | Closure $step): static
    {
        $this->step = $step;

        return $this;
    }

    /**
     * Get the value of step
     */
    public function getStep(): int
    {
        return (int) $this->evaluate($this->step);
    }


    /**
     * Set the value of behaviour
     *
     * @return self
     */
    public function behaviour(array | Closure $behaviour): static
    {
        $this->behaviour = $behaviour;

        return $this;
    }

    /**
     * Get the value of behaviour
     */
    public function getBehaviour(): string
    {
        $array = $this->evaluate($this->behaviour);

        return implode('-', $array);
    }

    /**
     * Set the value of snap
     *
     * @return self
     */
    public function snap(bool | Closure $snap): static
    {
        $this->snap = $snap;

        return $this;
    }

    /**
     * Get the value of snap
     */
    public function getSnap(): bool
    {
        return (bool) $this->evaluate($this->snap);
    }

    /**
     * Set the value of sliders
     *
     * @return self
     */
    public function sliders(array $sliders): static
    {
        $this->sliders = $sliders;

        $this->childComponents($sliders);

        return $this;
    }

    /**
     * Get the value of sliders
     */
    public function getSliders(): array
    {
        return $this->sliders;
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

    /**
     * Set the value of range
     *
     * @return self
     */
    public function range(array | Closure $range): static
    {
        $this->range = $range;

        return $this;
    }

    /**
     * Get the value of range
     */
    public function getRange(): array|null
    {
        $range = $this->evaluate($this->range);

        if ($range) {
            return $range;
        }

        return [
            'min' => $this->getMin(),
            'max' => $this->getMax(),
        ];
    }

    public function enableTooltips(bool | Closure $condition = true): static
    {
        $this->hasEnabledTooltips = $condition;

        return $this;
    }

    /**
     * Set the value of tooltips
     *
     * @return self
     */
    public function tooltips(array | Closure $tooltips): static
    {
        $this->tooltips = $tooltips;

        return $this;
    }

    /**
     * Get the value of tooltips
     */
    public function getTooltips(): array|null
    {
        $tooltips = $this->evaluate($this->tooltips);
        $hasEnabledTooltips = $this->evaluate($this->hasEnabledTooltips);

        if ($tooltips) {
            return $tooltips;
        }

        return array_fill(0, count($this->getSliders()), $hasEnabledTooltips);
    }
}
