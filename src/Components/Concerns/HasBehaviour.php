<?php

namespace AbdelhamidErrahmouni\FilamentSlickSlider\Components\Concerns;

use Closure;

trait HasBehaviour
{
    protected array | Closure $behaviour = ['drag', 'tap'];

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
}
