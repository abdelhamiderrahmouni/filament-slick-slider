<?php

namespace AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns;

use Closure;

trait HasSnap
{
    protected bool | Closure $snap = false;

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
}
