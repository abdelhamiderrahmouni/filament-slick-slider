<?php

namespace AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns;

use Closure;

trait HasSliders
{
    protected array | Closure $sliders = [];

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
}
