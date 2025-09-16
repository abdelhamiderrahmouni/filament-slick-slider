<?php

namespace AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns;

use Closure;

trait HasStep
{
    protected int | Closure $step = 1;

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
}
