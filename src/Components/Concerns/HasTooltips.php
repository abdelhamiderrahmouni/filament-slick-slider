<?php

namespace AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns;

use Closure;

trait HasTooltips
{
    protected array | Closure | null $tooltips = null;
    
    protected bool $hasEnabledTooltips = false;

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
